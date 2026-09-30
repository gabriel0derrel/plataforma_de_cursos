export class Matricula {
  constructor(data = {}) { Object.assign(this, data); }
  toPayload() { return { ID_Usuario: Number(this.ID_Usuario), ID_Curso: Number(this.ID_Curso), DataMatricula: this.DataMatricula }; }
}
