import { collectionOf, request } from '../../services/http';

export class EntityService {
  constructor(endpoint, Model) {
    this.endpoint = endpoint;
    this.Model = Model;
  }

  async listar() {
    const payload = await request(this.endpoint);
    return collectionOf(payload).map((data) => new this.Model(data));
  }

  criar(data) {
    return request(this.endpoint, {
      method: 'POST',
      body: new this.Model(data).toPayload(),
    });
  }

  buscar(id) {
    return request(this.endpoint + '/' + id).then((data) => new this.Model(data));
  }

  atualizar(id, data) {
    return request(this.endpoint + '/' + id, {
      method: 'PATCH',
      body: data,
    });
  }
}
