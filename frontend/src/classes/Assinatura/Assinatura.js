export class Assinatura {
  constructor(data = {}) { Object.assign(this, data); }
  toPayload() { return { ID_Usuario: Number(this.ID_Usuario), ID_Plano: Number(this.ID_Plano), DataInicio: this.DataInicio, DataFim: this.DataFim }; }
}
