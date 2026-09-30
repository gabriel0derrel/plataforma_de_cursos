export class TrilhaCurso {
  constructor(data = {}) { Object.assign(this, data); }
  toPayload() { return { ID_Trilha: Number(this.ID_Trilha), ID_Curso: Number(this.ID_Curso), Ordem: Number(this.Ordem) }; }
}
