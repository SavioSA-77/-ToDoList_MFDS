const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const DADOS_PATH = '/dados/tarefas.json';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

// Garantir que a pasta /dados existe
if (!fs.existsSync('/dados')) {
    fs.mkdirSync('/dados', { recursive: true });
}

// Criar arquivo se não existir
if (!fs.existsSync(DADOS_PATH)) {
    fs.writeFileSync(DADOS_PATH, JSON.stringify([]));
}

// Servir o frontend estático
app.use(express.static(path.join(__dirname, 'public')));

// Rota para listar tarefas
app.get('/tarefas', (req, res) => {
    const tarefas = JSON.parse(fs.readFileSync(DADOS_PATH, 'utf-8'));
    res.json(tarefas);
});

// Rota para adicionar tarefa
app.post('/tarefas', (req, res) => {
    const { texto } = req.body;
    if (!texto) return res.status(400).json({ error: 'Campo texto é obrigatório' });
    const tarefas = JSON.parse(fs.readFileSync(DADOS_PATH, 'utf-8'));
    const novaTarefa = {
        id: Date.now(),
        texto,
        estado: 'ativa'
    };
    tarefas.push(novaTarefa);
    fs.writeFileSync(DADOS_PATH, JSON.stringify(tarefas, null, 2));
    res.status(201).json(novaTarefa);
});

// Rota para atualizar estado da tarefa
app.put('/tarefas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { estado } = req.body;
    const tarefas = JSON.parse(fs.readFileSync(DADOS_PATH, 'utf-8'));
    const tarefa = tarefas.find(t => t.id === id);
    if (tarefa) {
        tarefa.estado = estado || 'feita';
        fs.writeFileSync(DADOS_PATH, JSON.stringify(tarefas, null, 2));
        res.json(tarefa);
    } else {
        res.status(404).json({ error: 'Tarefa não encontrada' });
    }
});

// Rota para remover tarefa
app.delete('/tarefas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let tarefas = JSON.parse(fs.readFileSync(DADOS_PATH, 'utf-8'));
    const existe = tarefas.find(t => t.id === id);
    if (existe) {
        tarefas = tarefas.filter(t => t.id !== id);
        fs.writeFileSync(DADOS_PATH, JSON.stringify(tarefas, null, 2));
        res.json({ message: 'Tarefa removida' });
    } else {
        res.status(404).json({ error: 'Tarefa não encontrada' });
    }
});

// Fallback para SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Backend rodando na porta ${PORT}`);
});
