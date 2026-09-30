export class Certificado {
  constructor(data = {}) { Object.assign(this, data); }
  toPayload() { return { ID_Usuario: Number(this.ID_Usuario), ID_Curso: Number(this.ID_Curso), ID_Trilha: this.ID_Trilha ? Number(this.ID_Trilha) : null, CodigoVerificacao: this.CodigoVerificacao, DataEmissao: this.DataEmissao }; }
}
