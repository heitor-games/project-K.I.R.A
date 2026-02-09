async function fazerCheckin() {
    const { data: userData } = await supabase.from('users').select('last_checkin', 'kiracoins').eq('id', user.id).single();

    const agora = new Date();
    const ultimoCheckin = userData.last_checkin ? new Date(userData.last_checkin) : null;

    if (!ultimoCheckin || (agora - ultimoCheckin) >= 24 * 60 * 60 * 1000) {
        const novoSaldo = userData.kiracoins + 20;
    }
}