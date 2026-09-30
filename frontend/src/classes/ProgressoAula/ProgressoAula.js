export class ProgressoAula {
  constructor(data = {}) { Object.assign(this, data); }
  toPayload() { return { ID_Usuario: Number(this.ID_Usuario), ID_Aula: Number(this.ID_Aula), DataConclusao: this.DataConclusao, Status: this.Status }; }
}
