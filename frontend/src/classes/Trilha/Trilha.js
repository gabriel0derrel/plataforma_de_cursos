export class Trilha {
  constructor(data = {}) { Object.assign(this, data); }
  toPayload() { return { Titulo: this.Titulo, Descricao: this.Descricao, ID_Categoria: this.ID_Categoria ? Number(this.ID_Categoria) : null }; }
}
