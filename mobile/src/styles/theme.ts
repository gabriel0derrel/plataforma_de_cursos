// Paleta LCARS (mesmas cores do global.css), em hexadecimal completo
const lcars = {
  preto: '#000000',
  cinza: '#223344', // --lcars-gray (#234)
  branco: '#ffffff',
  canario: '#ffff99',
  dourado: '#ffcc66',
  laranja: '#ff9933',
  lilas: '#cc99cc',
  azulSino: '#9999cc',
  anakiwa: '#99ccff',
  mariner: '#3366cc',
  bahama: '#006699',
  alerta: '#ee1100',
  ferrugem: '#bb4411',
  carmim: '#aa5533',
  hopbush: '#cc6699',
  azulClaro: '#ccddff', // #cdf: texto secundário usado no global.css
} as const;

// Cores semânticas: é nelas que as telas devem se apoiar.
// Trocar aqui muda o app inteiro.
export const cores = {
  ...lcars,
  fundo: lcars.preto, // fundo das telas
  superficie: lcars.cinza, // cards, painéis, barra de abas
  texto: lcars.branco, // texto principal
  textoSuave: lcars.azulClaro, // texto secundário
  primaria: lcars.dourado, // botões, destaques, aba ativa
  sobrePrimaria: lcars.preto, // texto sobre fundo dourado
  destaque: lcars.laranja, // notas, detalhes
  borda: lcars.azulSino, // bordas de inputs e chips
  erro: lcars.alerta, // ações destrutivas (sair)
} as const;

export type Cores = typeof cores;
