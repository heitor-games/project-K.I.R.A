const lojaItens = [
    {
        id: 'rolo_crochet_pequeno',
        nome: 'Rolo de Crochê Pequeno',
        descricao: 'Um rolo de crochê pequeno, perfeito para projetos menores.',
        preco: 150,
        raridade: 'comum'
    },
]

function comprarItem(id) {
    const item = lojaItens.find(i => i.id === id);
    if (kiracoins >= item.preco) {
        kiracoins -= item.preco;
        let inventario = JSON.parse(localStorage.getItem('inventario')) || [];
        inventario.push(item);
        localStorage.setItem('inventario', JSON.stringify(inventario));
        addLog(`Comprou: ${item.nome} por ${item.preco} K.I.R.A Coins`);
        updateDisplay();
        alert(`Você comprou: ${item.nome}`);
    }
}