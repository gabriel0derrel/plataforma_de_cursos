import { assinaturaService } from '../Assinatura/assinaturaService';
import { aulaService } from '../Aula/aulaService';
import { categoriaService } from '../Categoria/categoriaService';
import { cursoService } from '../Curso/cursoService';
import { moduloService } from '../Modulo/moduloService';
import { planoService } from '../Plano/planoService';
import { trilhaService } from '../Trilha/trilhaService';
import { usuarioService } from '../Usuario/usuarioService';

export const referenceServices = {
  assinaturas: assinaturaService,
  aulas: aulaService,
  categorias: categoriaService,
  cursos: cursoService,
  modulos: moduloService,
  planos: planoService,
  trilhas: trilhaService,
  usuarios: usuarioService,
};

export function referenceLabel(reference, item) {
  const labels = {
    assinaturas: item.DataInicio ? `Assinatura iniciada em ${new Date(item.DataInicio).toLocaleDateString('pt-BR')}` : 'Assinatura',
    aulas: item.Titulo,
    categorias: item.Nome,
    cursos: item.Titulo,
    modulos: item.Titulo,
    planos: item.Nome,
    trilhas: item.Titulo,
    usuarios: item.NomeCompleto ? `${item.NomeCompleto}${item.Email ? ` — ${item.Email}` : ''}` : item.Email,
  };
  return labels[reference] || 'Registro';
}

export function referenceId(item) {
  return Object.entries(item).find(([key]) => /^ID_[A-Za-z]+$/.test(key))?.[1];
}
