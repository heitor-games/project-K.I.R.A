// inicializar variáveis
let kiracoins = parseInt(localStorage.getItem('kiracoins')) || 0;
const balanceElementId = document.getElementById('balance');
const btnMission = document.getElementById('btn-mission');
const statusMsg = document.getElementById('status-msg');
const logElement = document.getElementById('log');

updateDisplay();

function updateDisplay() {
    balanceElementId.innerText = kiracoins;
    localStorage.setItem('kiracoins', kiracoins);
}

async function carregarDadosUsuario(userId) {
    const response =  await fetch(`http://localhost:3000/perfil/${userId}`);
    const dados = await response.json();

    kiracoins = dados.kiracoins;
    uopdateDisplay();
}

function addLog(text) {
    logElement.innerHTML = text + '<br>' + logElement.innerHTML;
}

async function BuscarMissaoDaIa() {
    statusMsg.innerText = 'Buscando Missão...';
    btnMission.disabled = true;

    try {
        const response = await fetch('http://localhost:3000/gerar-missao');
        const missao = await response.json();

        document.querySelector('.mission-box h3').innerText = `📍 ${missao.titulo}`;
        document.querySelector('.mission-box p').innerText = missao.descricao;

        iniciarContagemRegressiva(missao.recompensa, missao.tempo_segundos);


    } catch (error) {
        statusMsg.innerText = 'Erro ao conectar com a IA. Tente novamente.';
        btnMission.disabled = false;
    }
}

function iniciarContagemRegressiva(recompensa, tempo) {
    let timeLeft = tempo;
    const timer = setInterval(() => {
        btnMission.innerText = `Voltando em: (${timeLeft}s)`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timer);
            completarMissao(recompensa);
        }
    }, 1000);
}

function startMission() {
    const reward = Math.floor(Math.random() * 10) + 1; // Recompensa aleatória entre 1 e 100
    const duration = 5;

    btnMission.disabled = true;
    statusMsg.innerText = 'Missão em andamento...';

    let timeLeft = duration;
    const timer = setInterval(() => {
        timeLeft--;
        btnMission.innerText = `A Missão Acaba em: (${timeLeft}s)`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            completemission(reward);
        }
    }, 1000);
}

function completemission(reward) {
    kiracoins += reward;
    btnMission.disabled = false;
    btnMission.innerText = 'Começar Missão';
    statusMsg.innerText = `Missão Completa! Você ganhou ${reward} K.I.R.A Coins.`;

    addLog(`Recebeu da Missão: +${reward} K.I.R.A Coins`);
    updateDisplay();

    if (Math.random() < 0.1) { // 10% de chance de evento aleatório
        setTimeout(() => {
            const taxa = Math.floor(Math.random() * 5) + 1; // Taxa aleatória entre 1 e 5
            if (kiracoins >= taxa) {
                kiracoins -= taxa;
                addLog(`Evento Aleatório: Taxa de Manutenção -${taxa} K.I.R.A Coins`);
                updateDisplay();
            }
        }, 500);
    }
}

function resetGame() {
    if (confirm('Tem certeza que deseja resetar seu progresso?')) {
        kiracoins = 0;
        localStorage.clear();
        updateDisplay();
        addLog('Progresso resetado. Bem-vindo de volta, Viajante!');
    }
}
