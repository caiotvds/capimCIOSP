// =====================================
// TAXAS PADRÃO DA CAPIM (exemplo)
const taxasCapim = {
  1: 3.15,  2: 4.39,  3: 4.96,  4: 5.54,  5: 6.12,  6: 6.70,  
  7: 7.48,  8: 8.06,  9: 8.64, 10: 9.22, 11: 9.35, 12: 10.14, 
 13: 11.13, 14: 11.90, 15: 12.67, 16: 13.44, 17: 14.21,
 18: 14.98, 19: 15.75, 20: 16.52, 21: 17.29, 22: 18.00, 23: 18.50
};

// =====================================
// SELETORES DE ELEMENTOS GERAIS
// =====================================
const vendasMesInput   = document.getElementById('vendasMes');
const numParcelasRange = document.getElementById('numParcelas');
const numParcelasLabel = document.getElementById('numParcelasLabel');
const parcelaAtualLabel= document.getElementById('parcelasAtualLabel');
const taxaAtualInput   = document.getElementById('taxaAtual');
const btnCalcular      = document.getElementById('btnCalcular');
const alerta           = document.getElementById('alerta');
const resultBlock      = document.getElementById('result-block');
const concTaxaEl       = document.getElementById('concTaxa');
const concTotalEl      = document.getElementById('concTotal');
const concParcelaEl    = document.getElementById('concParcela');
const capimTaxaEl      = document.getElementById('capimTaxa');
const capimTotalEl     = document.getElementById('capimTotal');
const capimParcelaEl   = document.getElementById('capimParcela');
const economiaEl       = document.getElementById('economia');

// =====================================
// SELETORES: SIDEBAR E PROPOSTA
// =====================================
const btnAvancadas         = document.getElementById('btnAvancadas');
const sidebar              = document.getElementById('sidebar');
const overlay              = document.getElementById('overlay');
const btnFecharSidebar     = document.getElementById('btnFecharSidebar');
const taxasList            = document.getElementById('taxasList');
const contatoInput         = document.getElementById('contato');
const btnEnviarProposta    = document.getElementById('btnEnviarProposta');
const btnEnviarPropostaTopo= document.getElementById('btnEnviarPropostaTopo');

// =====================================
// SELETORES: TOGGLE (AUTO x SPOT)
// =====================================
const btnAuto         = document.getElementById('toggleAuto');     // Botão "Antecipa Auto"
const btnSpot         = document.getElementById('toggleSpot');     // Botão "Antecipa Spot"
const autoContainer   = document.getElementById('autoContainer');  // Container com Taxas Capim + Calculadora
const spotContainer   = document.getElementById('spotContainer');  // Container em branco (por enquanto)

// =====================================
// EVENTOS PRINCIPAIS
// =====================================
vendasMesInput.addEventListener('input', formatarMoeda);
vendasMesInput.addEventListener('blur', () => {
  if (vendasMesInput.value.trim() === '') {
    vendasMesInput.value = 'R$ 0,00';
  }
  formatarMoeda();
});

taxaAtualInput.addEventListener('input', () => {
  formatarTaxaInputPercentual(taxaAtualInput);
});

numParcelasRange.addEventListener('input', () => {
  const qtd = parseInt(numParcelasRange.value, 10);
  atualizarLabelParcelas(qtd);
});

btnCalcular.addEventListener('click', calcular);

// Sidebar
btnAvancadas.addEventListener('click', abrirSidebar);
overlay.addEventListener('click', fecharSidebar);
btnFecharSidebar.addEventListener('click', fecharSidebar);
btnEnviarProposta.addEventListener('click', enviarProposta);
btnEnviarPropostaTopo.addEventListener('click', enviarProposta);

// Toggle
btnAuto.addEventListener('click', () => {
  // Mostra o "autoContainer" e esconde o "spotContainer"
  autoContainer.style.display = 'block';
  spotContainer.style.display = 'none';
  // Muda a classe "active" no botão
  btnAuto.classList.add('active');
  btnSpot.classList.remove('active');
});

btnSpot.addEventListener('click', () => {
  // Mostra o "spotContainer" e esconde o "autoContainer"
  autoContainer.style.display = 'none';
  spotContainer.style.display = 'block';
  // Muda a classe "active" no botão
  btnSpot.classList.add('active');
  btnAuto.classList.remove('active');
});

// =====================================
// FUNÇÕES DE FORMATAÇÃO
// =====================================

/**
 * Formata o valor de entrada (vendasMesInput) em moeda brasileira.
 * Ex.: "400000" -> "R$ 4.000,00"
 */
function formatarMoeda() {
  let valor = vendasMesInput.value.replace(/[^\d]/g, '');
  if (valor === '') {
    vendasMesInput.value = '';
    return;
  }
  while (valor.length < 3) {
    valor = '0' + valor;
  }
  const inteiros = valor.slice(0, -2);
  const decimais = valor.slice(-2);
  const inteirosFormatados = inteiros.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  vendasMesInput.value = 'R$ ' + inteirosFormatados + ',' + decimais;
}

/**
 * Formata o valor de taxa "XX,XX" e adiciona "%" no final.
 */
function formatarTaxaInputPercentual(input) {
  let valor = input.value.replace(/[^\d]/g, '');
  if (valor === '') {
    input.value = '';
    return;
  }
  while (valor.length < 3) {
    valor = '0' + valor;
  }
  const parteInteira = parseInt(valor.slice(0, -2), 10);
  const parteDecimal = valor.slice(-2);
  input.value = parteInteira + ',' + parteDecimal + '%';
}

/**
 * Atualiza os rótulos de parcelas (por ex. "12x").
 */
function atualizarLabelParcelas(value) {
  numParcelasLabel.textContent = value + 'x';
  parcelaAtualLabel.textContent = value + 'x';
}

/**
 * Converte uma string de moeda "R$ XX.XXX,YY" para número (ex.: 40000.00).
 */
function converterValorMoedaParaNumero(str) {
  const valorStr = str.replace(/[^\d]/g, '');
  if (!valorStr) return 0;
  return parseFloat(valorStr.slice(0, -2) + '.' + valorStr.slice(-2));
}

/**
 * Converte uma string de taxa "XX,YY%" para número decimal (ex.: 5.40).
 */
function converterTaxaParaNumero(str) {
  if (!str) return 0;
  const semPorcentagem = str.replace('%', '');
  const limpa = semPorcentagem.replace(',', '.').replace(/[^\d.]/g, '');
  return parseFloat(limpa) || 0;
}

/**
 * Formata número em padrão brasileiro (por ex.: 40000.5 -> "40.000,50").
 */
function formatarNumeroComPontos(num) {
  return num.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// =====================================
// CÁLCULO DE TAXAS E EXIBIÇÃO DE RESULTADOS
// =====================================
function calcular() {
  const valor = converterValorMoedaParaNumero(vendasMesInput.value);
  const parcelas = parseInt(numParcelasRange.value, 10);
  const taxaConcorrencia = converterTaxaParaNumero(taxaAtualInput.value);

  // Validações
  if (isNaN(valor) || valor <= 0) {
    alerta.innerHTML = 'Preencha o valor de vendas no mês corretamente.';
    resultBlock.style.display = 'none';
    return;
  }

  if (isNaN(taxaConcorrencia) || taxaConcorrencia === 0) {
    alerta.innerHTML = `Defina a taxa da concorrência para ${parcelas}x (não pode ficar em 0,00%).`;
    resultBlock.style.display = 'none';
    return;
  }

  // Limpa alerta e mostra resultados
  alerta.innerHTML = '';
  resultBlock.style.display = 'block';

  // Concorrência
  const valorConcorrencia = valor * (taxaConcorrencia / 100);
  const valorFinalConc = valor + valorConcorrencia;
  const parcelaConc = valorFinalConc / parcelas;

  // Capim
  const taxaCapimEscolhida = taxasCapim[parcelas] || 0;
  const valorCapim = valor * (taxaCapimEscolhida / 100);
  const valorFinalCapim = valor + valorCapim;
  const parcelaCapim = valorFinalCapim / parcelas;

  // Exibe no DOM
  concTaxaEl.textContent    = `${taxaConcorrencia.toFixed(2)}%`;
  concTotalEl.textContent   = 'R$ ' + formatarNumeroComPontos(valorFinalConc);
  concParcelaEl.textContent = 'R$ ' + formatarNumeroComPontos(parcelaConc);

  capimTaxaEl.textContent   = `${taxaCapimEscolhida.toFixed(2)}%`;
  capimTotalEl.textContent  = 'R$ ' + formatarNumeroComPontos(valorFinalCapim);
  capimParcelaEl.textContent= 'R$ ' + formatarNumeroComPontos(parcelaCapim);

  // Diferença
  const economiaValor = valorFinalConc - valorFinalCapim;
  let economiaTexto = '';
  if (economiaValor > 0) {
    economiaTexto = `Você economiza: R$ ${formatarNumeroComPontos(economiaValor)} optando pela Capim!`;
  } else if (economiaValor < 0) {
    economiaTexto = 'Nesta condição, a Capim sai mais cara. Entre em contato para negociar.';
  } else {
    economiaTexto = 'Os custos são iguais. Entre em contato para melhores condições.';
  }
  economiaEl.textContent = economiaTexto;
}

// =====================================
// FUNÇÕES: SIDEBAR (TAXAS AVANÇADAS)
// =====================================
function criarLinhasTaxasAvancadas() {
  taxasList.innerHTML = '';
  
  for (let i = 1; i <= 23; i++) {
    const row = document.createElement('div');
    row.className = 'taxa-row';

    const label = document.createElement('div');
    label.className = 'taxa-row-label';
    label.innerText = `${i}x`;

    const inputsContainer = document.createElement('div');
    inputsContainer.className = 'taxa-row-inputs';

    const inputTxt = document.createElement('input');
    inputTxt.type = 'text';
    inputTxt.className = 'taxa-input';
    inputTxt.placeholder = '0,00';
    inputTxt.dataset.parcela = i;

    const range = document.createElement('input');
    range.type = 'range';
    range.min = '0';
    range.max = '30';
    range.step = '0.01';
    range.value = '0';
    range.className = 'taxa-slider';
    range.dataset.parcela = i;

    // Sincroniza input texto <-> slider
    inputTxt.addEventListener('input', () => {
      let valor = inputTxt.value.replace(/[^\d]/g, '');
      if (valor === '') {
        inputTxt.value = '';
        return;
      }
      while (valor.length < 3) {
        valor = '0' + valor;
      }
      const parteInteira = parseInt(valor.slice(0, -2), 10);
      const parteDecimal = valor.slice(-2);
      inputTxt.value = `${parteInteira},${parteDecimal}`;

      const valorNumero = converterTaxaParaNumero(inputTxt.value + '%');
      range.value = valorNumero.toFixed(2);
    });

    range.addEventListener('input', () => {
      const valor = parseFloat(range.value);
      const inteiro = Math.floor(valor);
      const decimais = Math.round((valor - inteiro) * 100);
      const valorStr = `${inteiro},${decimais < 10 ? '0' + decimais : decimais}`;
      inputTxt.value = valorStr;
    });

    inputsContainer.appendChild(inputTxt);
    inputsContainer.appendChild(range);
    row.appendChild(label);
    row.appendChild(inputsContainer);
    taxasList.appendChild(row);
  }
}

function criarListaTaxasCapim() {
  const lista = document.getElementById('listaTaxasCapim');
  if (!lista) return; // caso não exista no HTML
  lista.innerHTML = '';
  
  for (let i = 1; i <= 23; i++) {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${i}x:</strong> ${taxasCapim[i].toFixed(2)}%`;
    lista.appendChild(li);
  }
}

function abrirSidebar() {
  sidebar.classList.add('open');
  overlay.style.display = 'block';
}

function fecharSidebar() {
  sidebar.classList.remove('open');
  overlay.style.display = 'none';
}

function enviarProposta() {
  const contato = contatoInput.value.trim();
  alert(`Dados enviados com sucesso!\nContato: ${contato || 'Não informado'}`);
  
  fecharSidebar();
  contatoInput.value = '';
}

// =====================================
// INICIALIZAÇÃO
// =====================================

// Cria as linhas avançadas na sidebar
criarLinhasTaxasAvancadas();

// Cria a lista de taxas Capim no aside (Taxas Capim)
criarListaTaxasCapim();

// Define inicialmente que estamos no modo "Antecipa Auto" (pode ser omitido se já estiver no HTML)
autoContainer.style.display = 'block';
spotContainer.style.display = 'none';
btnAuto.classList.add('active');
