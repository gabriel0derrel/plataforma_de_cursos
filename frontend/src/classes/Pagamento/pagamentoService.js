import { EntityService } from '../shared/EntityService';
import { Pagamento } from './Pagamento';
export const pagamentoService = new EntityService('/pagamentos', Pagamento);
