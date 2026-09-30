export class Usuario {
  constructor(data = {}) {
    Object.assign(this, data);
  }

  toPayload() {
    return {
      NomeCompleto: this.NomeCompleto,
      Email: this.Email,
      Senha: this.Senha,
      IsInstrutor: Boolean(this.IsInstrutor),
    };
  }
}
