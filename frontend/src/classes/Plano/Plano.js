export class Plano {
  constructor(data = {}) { Object.assign(this, data); }
  toPayload() { return { Nome: this.Nome, Descricao: this.Descricao, Preco: Number(this.Preco), DuracaoMeses: Number(this.DuracaoMeses) }; }
}
