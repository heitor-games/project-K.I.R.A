const PRODUTOS_REAIS = [
    {id: 'p_01', nome: 'Camiseta crochet K.I.R.A', preco: 500, estoque: 1},
    {id: 'p_02', nome: 'Bolsa crochet K.I.R.A', preco: 300, estoque: 2},
    {id: 'p_03', nome: 'Bonequinho K.I.R.A', preco: 100, estoque: 3},
];

async function encomendarProduto(produto) {
    if (kiracoins < produto.preco) {
        alert('K.I.R.A Coins insuficientes para comprar este item.');
        return;
    }

    const endereco = prompt(`Digite o endereço de entrega para: ${produto.nome}`);
    if (endereco) {
        //1. Tira os KiraCoins do usuário
        //2. cria registro na tabela 'orders' com status 'pendente'
        const {data, error} = await supabase.from('orders').insert({
            user_id: user.id,
            item_name: produto.id,
            address: endereco,
            status: 'pendente'
        });

        if (!error) {
            kiracoins -= produto.preco;
            await atualizarKiraCoins();
            alert(`Encomenda de ${produto.nome} realizada com sucesso! A entrega será feita em breve.`);
            addLog(`Encomendou: ${produto.nome} por ${produto.preco} K.I.R.A Coins`);
            renderizarLoja();
        }
    }
}

function renderizarLoja() {
    const shopContainer = document.getElementById('shop-items');
    shopContainer.innerHTML = '';

    PRODUTOS_REAIS.forEach(produto => {
        const jaComprou = false; // Aqui você pode implementar lógica para verificar se o usuário já comprou o item
        const btn = document.createElement('button');
        btn.innerHTML = `${produto.nome} (${produto.preco} K.I.R.A Coins)<br><small>${produto.descricao}</small>`;
        btn.disabled = kiracoins < produto.preco || jaComprou;
        btn.onclick = () => encomendarProduto(produto);
        if (jaComprou) {
            btn.innerHTML += '<br><small style="color: green;">Já comprado</small>';
        }

        shopContainer.appendChild(btn);
    });
}
async function atualizarKiraCoins() {
    const {data, error} = await supabase.from('users').update({kiracoins}).eq('id', user.id);
    if (error) {
        console.error('Erro ao atualizar K.I.R.A Coins:', error);
    }
}

async function listarPedidosPendentes() {
    const { data } = await supabase.from('orders').select('*').eq('status', 'pendente');

    data.forEach(pedido => {
        console.log(`ENTREGAR: ${pedido.item_name} para ${pedido.address}`);
        // Aqui você pode implementar a lógica de entrega, como marcar o pedido como 'entregue' após um tempo
    });
}

