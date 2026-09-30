export class Categoria {
  constructor(data = {}) { Object.assign(this, data); }
  toPayload() { return { Nome: this.Nome, Descricao: this.Descricao }; }
}
