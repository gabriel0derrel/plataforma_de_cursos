export class Modulo {
  constructor(data = {}) { Object.assign(this, data); }
  toPayload() { return { ID_Curso: Number(this.ID_Curso), Titulo: this.Titulo, Ordem: Number(this.Ordem) }; }
}
