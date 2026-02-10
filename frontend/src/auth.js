const supabase = require("../../backend/src/db");

async function fazerCheckin() {
    const { data: userData } = await supabase.from('users').select('last_checkin', 'kiracoins').eq('id', usuarioLogado.id).single();

    const agora = new Date();
    const ultimoCheckin = userData.last_checkin ? new Date(userData.last_checkin) : null;

    if (!ultimoCheckin || (agora - ultimoCheckin) >= 24 * 60 * 60 * 1000) {
        const novoSaldo = userData.kiracoins + 20;
        
        await supabase.from('users').update({
            kiracoins: novoSaldo,
            last_checkin: agora.toISOString()
        }).eq('id', userData)

        alert("Check-in Realizado! +20 kiracoins");
        updateDisplay()
    }else{
        alert("Você ja coletou seus kiracoins hoje! Por gentileza, volte Amanhã")
    }
}