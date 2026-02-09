const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

app.get('/gerar-missao', async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `Você é um mestre de RPG. Gere algumas missões curtas para um jogo parecido com dabloons. Responda apenas em JSON com os campos: 'titulo', descricao', recompensa' (entre 0 e 20) e 'tempo_segundos' (entre 30 e 120 segundos). O jogo vai ser implementado em uma loja de moda alternativa, faça as missões relacionadas à essa loja`;

        const result = await model.generateContent(prompt);
        const response = await result.response();
        const text = result.text();

        const clearJson = text.replace(/```json/g, '').replace(/```/g, '');
        res.json(JSON.parse(clearJson));

    } catch (error) {
        res.status(500).json({ error: 'Erro ao gerar missão' });
    }
});

app.post('/ganhar_kiracoins', async (req, res) => {
    const { userId, valor } = req.body;
    
    let { data } = await supabase.from('users').select('kiracoins').eq('id', userId).single();

    const novoSaldo = data.kiracoins + valor;

    const { error } = await supabase.from('users').update({ kiracoins: novoSaldo }).eq('id', userId);

    if (error) return res.status(400).json(error);
    res.json({ novoSaldo });
});

app.post('/completar_missao', async (req, res) => {
    const { userId, valor } = req.body;

    const { data, error } = await supabase.from('users').update({ kiracoins: kiracoins + valor }).eq('id', userId);

    res.json({succes: true});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});