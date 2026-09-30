export class Curso {
  constructor(data = {}) { Object.assign(this, data); }
  toPayload() { return { Titulo: this.Titulo, Descricao: this.Descricao, ID_Instrutor: Number(this.ID_Instrutor), ID_Categoria: Number(this.ID_Categoria), Nivel: this.Nivel, DataPublicacao: this.DataPublicacao, TotalAulas: Number(this.TotalAulas || 0), TotalHoras: Number(this.TotalHoras || 0) }; }
}
