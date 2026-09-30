export class Avaliacao {
  constructor(data = {}) { Object.assign(this, data); }
  toPayload() { return { ID_Usuario: Number(this.ID_Usuario), ID_Curso: Number(this.ID_Curso), Nota: Number(this.Nota), Comentario: this.Comentario, DataAvaliacao: this.DataAvaliacao }; }
}
