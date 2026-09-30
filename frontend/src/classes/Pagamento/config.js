import { CreditCard } from 'lucide-react';
import { Pagamento } from './Pagamento';
import { pagamentoService } from './pagamentoService';
export const pagamentoConfig = {
  key: 'pagamentos', route: '/pagamentos', singular: 'Pagamento', plural: 'Pagamentos', icon: CreditCard, Model: Pagamento, service: pagamentoService,
  columns: ['ID_Pagamento', 'ID_Assinatura', 'ValorPago', 'MetodoPagamento', 'DataPagamento', 'Id_Transacao_Gateway'],
  fields: [
    { name: 'ID_Assinatura', label: 'Assinatura', reference: 'assinaturas', required: true }, { name: 'ValorPago', label: 'Valor pago', type: 'number', min: 0, step: '0.01', required: true },
    { name: 'DataPagamento', label: 'Data do pagamento', type: 'date', required: true }, { name: 'MetodoPagamento', label: 'Metodo de pagamento', type: 'select', required: true, options: ['Cartao de credito', 'Pix', 'Boleto'] },
    { name: 'Id_Transacao_Gateway', label: 'ID da transacao', type: 'text', required: true },
  ],
};
