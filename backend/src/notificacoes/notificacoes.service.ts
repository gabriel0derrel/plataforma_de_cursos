import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Consumer, Kafka, Producer } from 'kafkajs';
import { PrismaService } from '../prisma/prisma.service';

const conteudos = {
  'novo-curso': ['Novo curso disponível', 'O curso'],
  'nova-categoria': ['Nova categoria disponível', 'A categoria'],
  'nova-trilha': ['Nova trilha disponível', 'A trilha'],
  'novo-modulo': ['Novo módulo disponível', 'O módulo'],
  'nova-aula': ['Nova aula disponível', 'A aula'],
} as const;

type TipoNovoConteudo = keyof typeof conteudos;
export type TipoNotificacaoMobile = 'conta-criada' | 'login' | 'aula-concluida' | 'curso-concluido' | TipoNovoConteudo;

type EventoNotificacao = {
  eventoId: string;
  tipo: TipoNotificacaoMobile;
  titulo: string;
  mensagem: string;
  usuarioId?: number;
  paraTodosAlunos?: boolean;
  dataCriacao: string;
};

@Injectable()
export class NotificacoesService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NotificacoesService.name);
  private readonly topic = process.env.KAFKA_NOTIFICATIONS_TOPIC || 'hyperlessons.mobile.notifications.v1';
  private readonly enabled = process.env.KAFKA_ENABLED !== 'false';
  private readonly kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID || 'hyperlessons-api',
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(',').map((broker) => broker.trim()),
  });
  private readonly producer: Producer = this.kafka.producer();
  private readonly consumer: Consumer = this.kafka.consumer({ groupId: process.env.KAFKA_CONSUMER_GROUP || 'hyperlessons-mobile-notification-store' });
  private producerConnected = false;
  private consumerConnected = false;

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit(): void {
    if (this.enabled) void this.startConsumer();
  }

  async onModuleDestroy(): Promise<void> {
    await Promise.allSettled([
      this.producerConnected ? this.producer.disconnect() : Promise.resolve(),
      this.consumerConnected ? this.consumer.disconnect() : Promise.resolve(),
    ]);
  }

  publicarCriacao(tipo: TipoNovoConteudo, nome: string): Promise<void> {
    const [titulo, recurso] = conteudos[tipo];
    return this.publicar({ tipo, paraTodosAlunos: true, titulo, mensagem: `${recurso} “${nome}” chegou à plataforma.` });
  }

  async publicar(evento: Omit<EventoNotificacao, 'eventoId' | 'dataCriacao'>): Promise<void> {
    if (!this.enabled) return;
    const mensagem: EventoNotificacao = { ...evento, eventoId: randomUUID(), dataCriacao: new Date().toISOString() };
    try {
      if (!this.producerConnected) {
        await this.producer.connect();
        this.producerConnected = true;
      }
      await this.producer.send({ topic: this.topic, messages: [{ key: mensagem.usuarioId?.toString() || 'todos-alunos', value: JSON.stringify(mensagem) }] });
    } catch (error) {
      this.logger.error(`Não foi possível publicar a notificação Kafka: ${this.mensagemErro(error)}`);
    }
  }

  async listarParaUsuario(usuarioId: number) {
    return this.prisma.notificacaoMobile.findMany({ where: { ID_Usuario: usuarioId }, orderBy: { DataCriacao: 'desc' } });
  }

  async marcarComoLida(usuarioId: number, notificacaoId: number) {
    const resultado = await this.prisma.notificacaoMobile.updateMany({ where: { ID_Notificacao: notificacaoId, ID_Usuario: usuarioId }, data: { Lida: true } });
    return { atualizada: resultado.count === 1 };
  }

  private async startConsumer(): Promise<void> {
    try {
      await this.consumer.connect();
      this.consumerConnected = true;
      await this.consumer.subscribe({ topic: this.topic, fromBeginning: false });
      await this.consumer.run({ eachMessage: async ({ message }) => {
        if (!message.value) return;
        try { await this.persistir(JSON.parse(message.value.toString()) as EventoNotificacao); }
        catch (error) { this.logger.error(`Não foi possível consumir a notificação Kafka: ${this.mensagemErro(error)}`); }
      } });
    } catch (error) {
      this.logger.error(`Consumidor Kafka indisponível: ${this.mensagemErro(error)}`);
    }
  }

  private async persistir(evento: EventoNotificacao): Promise<void> {
    const destinatarios = evento.paraTodosAlunos
      ? await this.prisma.usuario.findMany({ where: { IsAdmin: false }, select: { ID_Usuario: true } })
      : evento.usuarioId ? [{ ID_Usuario: evento.usuarioId }] : [];
    if (!destinatarios.length) return;
    await this.prisma.notificacaoMobile.createMany({
      data: destinatarios.map(({ ID_Usuario }) => ({ ID_Usuario, EventoId: evento.eventoId, Tipo: evento.tipo, Titulo: evento.titulo, Mensagem: evento.mensagem, DataCriacao: new Date(evento.dataCriacao) })),
      skipDuplicates: true,
    });
  }

  private mensagemErro(error: unknown): string { return error instanceof Error ? error.message : 'erro desconhecido'; }
}
