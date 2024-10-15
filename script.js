// Função para obter o valor de um input dado o seu ID
function getInputValue(id) {
    return parseFloat(document.getElementById(id).value) || 0;
}

// Função para exibir resultado em um elemento pelo ID
function displayResult(id, text) {
    document.getElementById(id).innerHTML = text;
}

// Função principal para calcular o preço
document.getElementById('calculate-price-btn').addEventListener('click', function() {
    const valorBruto = getInputValue('valor-bruto');
    const descontoEmpresa = getInputValue('desconto-empresa');
    const embalagem = getInputValue('embalagem');
    const icms = getInputValue('icms');
    const porcentagemVenda = getInputValue('porcentagem-venda');

    if (valorBruto <= 0) {
        alert('O valor bruto do produto deve ser maior que zero.');
        return;
    }

    // Calcular desconto e valor com desconto
    const desconto = valorBruto * (descontoEmpresa / 100);
    const valorComDesconto = valorBruto - desconto;

    // Aplicar a porcentagem de venda sobre o valor com desconto
    const valorComMargem = valorComDesconto * (1 + porcentagemVenda / 100);

    // Calcular ICMS e adicionar embalagem
    const valorICMS = valorComDesconto * (icms / 100);
    const valorFinal = valorComMargem + valorICMS + embalagem;

    // Exibir resultados
    displayResult('resultado', `Valor com Desconto: R$ ${valorComDesconto.toFixed(2)}<br>Valor Final: R$ ${valorFinal.toFixed(2)}`);
    document.getElementById('valor-desconto').innerText = `Valor: R$ ${desconto.toFixed(2)}`;
    document.getElementById('valor-icms').innerText = `Valor: R$ ${valorICMS.toFixed(2)}`;

    // Armazenar valor final para uso posterior
    document.getElementById('resultado').dataset.valorFinal = valorFinal.toFixed(2);

    // Mostrar seção de taxas
    document.getElementById('tax-section').style.display = 'block';
});

// Função para calcular taxas
document.getElementById('calculate-taxes-btn').addEventListener('click', function() {
    const taxaMaquininha = getInputValue('taxa-maquininha');
    const descontoCliente = getInputValue('desconto-cliente');
    const taxaPlataforma = getInputValue('taxa-plataforma');
    const comissao = getInputValue('comissao');

    const valorFinalAnterior = parseFloat(document.getElementById('resultado').dataset.valorFinal) || 0;

    if (valorFinalAnterior <= 0) {
        alert('Calcule o preço do produto antes de calcular as taxas.');
        return;
    }

    const valorTaxaMaquininha = valorFinalAnterior * (taxaMaquininha / 100);
    const valorDescontoCliente = valorFinalAnterior * (descontoCliente / 100);
    const valorTaxaPlataforma = valorFinalAnterior * (taxaPlataforma / 100);
    const valorComissao = valorFinalAnterior * (comissao / 100);

    const valorTotalTaxas = valorTaxaMaquininha + valorDescontoCliente + valorTaxaPlataforma + valorComissao;

    // Exibir resultados das taxas
    document.getElementById('valor-taxa-maquininha').innerText = `Valor: R$ ${valorTaxaMaquininha.toFixed(2)}`;
    document.getElementById('valor-desconto-cliente').innerText = `Valor: R$ ${valorDescontoCliente.toFixed(2)}`;
    document.getElementById('valor-taxa-plataforma').innerText = `Valor: R$ ${valorTaxaPlataforma.toFixed(2)}`;
    document.getElementById('valor-comissao').innerText = `Valor: R$ ${valorComissao.toFixed(2)}`;

    // Calcular valor final atualizado somando taxas ao valor final da primeira sessão
    const valorFinalComTaxas = valorFinalAnterior + valorTotalTaxas;

    displayResult('resultado-taxas', `Total de Taxas: R$ ${valorTotalTaxas.toFixed(2)}<br>Valor Final com Taxas: R$ ${valorFinalComTaxas.toFixed(2)}`);

    // Armazenar valor final com taxas para uso posterior
    document.getElementById('resultado-taxas').dataset.valorFinalComTaxas = valorFinalComTaxas.toFixed(2);

    // Mostrar seção de despesas gerais
    document.getElementById('expenses-section').style.display = 'block';
});

// Função para calcular as despesas gerais e resultados finais
document.getElementById('calculate-expenses-btn').addEventListener('click', function() {
    const energia = getInputValue('energia');
    const aluguel = getInputValue('aluguel');
    const funcionario = getInputValue('funcionario');
    const internet = getInputValue('internet');
    const marketing = getInputValue('marketing');
    const simplesNacional = getInputValue('simples-nacional');
    const frete = getInputValue('frete');

    const valorFinalComTaxas = parseFloat(document.getElementById('resultado-taxas').dataset.valorFinalComTaxas) || 0;

    if (valorFinalComTaxas <= 0) {
        alert('Calcule as taxas antes de calcular os gastos gerais.');
        return;
    }

    // Calcular Gastos Operacionais (embalagem + icms sobre valor com desconto)
    const embalagem = getInputValue('embalagem');
    const icms = getInputValue('icms');
    const valorComDesconto = getInputValue('valor-bruto') - (getInputValue('valor-bruto') * (getInputValue('desconto-empresa') / 100));
    const gastosOperacionais = embalagem + (valorComDesconto * (icms / 100));

    // Calcular Total de Gastos Gerais
    const totalGastosGerais = energia + aluguel + funcionario + internet + marketing + simplesNacional + frete;

    // Valor Final Com Todos os Gastos
    const valorFinalTotal = valorFinalComTaxas + totalGastosGerais + gastosOperacionais;

    // Calcular Lucro (Valor Bruto - Gastos Totais)
    const valorBruto = getInputValue('valor-bruto');
    const valorLucro = valorBruto - valorFinalTotal;

    // Exibir Resultados
    displayResult('resultado-gastos', `Total de Gastos Gerais: R$ ${totalGastosGerais.toFixed(2)}<br>Valor Final com Gastos Gerais: R$ ${valorFinalTotal.toFixed(2)}`);
    document.getElementById('gastos-operacionais').innerText = `Total de Gastos Operacionais: R$ ${gastosOperacionais.toFixed(2)}`;
    document.getElementById('total-taxas').innerText = `Total de Taxas: R$ ${valorFinalComTaxas.toFixed(2)}`;
    document.getElementById('total-gastos-gerais').innerText = `Total de Gastos Gerais: R$ ${totalGastosGerais.toFixed(2)}`;
    document.getElementById('valor-final-total').innerText = `Valor Final com Todos os Gastos: R$ ${valorFinalTotal.toFixed(2)}`;
    document.getElementById('valor-lucro').innerText = `Valor de Lucro: R$ ${valorLucro.toFixed(2)}`;

    // Exibir a seção de resultados finais
    document.getElementById('resultado-final').style.display = 'block';

    // Gerar Gráfico
    gerarGrafico(gastosOperacionais, totalGastosGerais, valorFinalTotal, valorLucro);
});

// Função para gerar o gráfico com Chart.js
function gerarGrafico(gastosOperacionais, gastosGerais, valorFinal, lucro) {
    const ctx = document.getElementById('grafico-resultados').getContext('2d');
    if (window.myChart) {
        window.myChart.destroy();
    }
    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Gastos Operacionais', 'Gastos Gerais', 'Valor Final', 'Lucro'],
            datasets: [{
                label: 'Valores (R$)',
                data: [gastosOperacionais, gastosGerais, valorFinal, lucro],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',   // Gastos Operacionais (Vermelho)
                    'rgba(255, 159, 64, 0.8)',   // Gastos Gerais (Tonalidade de Vermelho)
                    'rgba(75, 192, 192, 0.8)',   // Valor Final (Verde)
                    'rgba(54, 235, 162, 0.8)'    // Lucro (Verde Diferente)
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Distribuição de Gastos e Lucro'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


