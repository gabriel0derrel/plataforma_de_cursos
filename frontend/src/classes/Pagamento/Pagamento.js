export class Pagamento {
  constructor(data = {}) { Object.assign(this, data); }
  toPayload() { return { ID_Assinatura: Number(this.ID_Assinatura), ValorPago: Number(this.ValorPago), DataPagamento: this.DataPagamento, MetodoPagamento: this.MetodoPagamento, Id_Transacao_Gateway: this.Id_Transacao_Gateway }; }
}
