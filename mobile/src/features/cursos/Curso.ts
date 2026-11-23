export interface Curso {
  ID_Curso: number;
  Titulo: string;
  Descricao: string;
  Nivel: string;
  TotalAulas: number;
  TotalHoras: number;
}

// Modelo dos cursos recebidos da API.
export class CursoModel implements Curso {
  ID_Curso = 0;
  Titulo = '';
  Descricao = '';
  Nivel = '';
  TotalAulas = 0;
  TotalHoras = 0;
  constructor(data: Partial<Curso> = {}) { Object.assign(this, data); }
}
