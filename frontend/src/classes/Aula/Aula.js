export class Aula {
  constructor(data = {}) { Object.assign(this, data); }
  toPayload() { return { ID_Modulo: Number(this.ID_Modulo), Titulo: this.Titulo, TipoConteudo: this.TipoConteudo, URL_Conteudo: this.URL_Conteudo, DuracaoMinutos: Number(this.DuracaoMinutos), Ordem: Number(this.Ordem) }; }
}
