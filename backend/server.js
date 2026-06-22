const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = '/dados/tarefas.json';

const app = express();
app.use(cors());
app.use(express.json());

// Garantir que a pasta /dados existe
if (!fs.existsSync('/dados')) {
    fs.mkdirSync('/dados');
}

// Criar arquivo se não existir
if (!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify([]));
}

// Rota para listar tarefas
app.get('/tarefas', (req, res) => {
    const tarefas = JSON.parse(fs.readFileSync(path, 'utf-8'));
    res.json(tarefas);
});

// Rota para adicionar tarefa
app.post('/tarefas', (req, res) => {
    const { titulo } = req.body;
    const tarefas = JSON.parse(fs.readFileSync(path, 'utf-8'));
    const novaTarefa = {
        id: Date.now(),
        titulo,
        concluida: false
    };
    tarefas.push(novaTarefa);
    fs.writeFileSync(path, JSON.stringify(tarefas, null, 2));
    res.status(201).json(novaTarefa);
});

// Rota para concluir tarefa
app.put('/tarefas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const tarefas = JSON.parse(fs.readFileSync(path, 'utf-8'));
    const tarefa = tarefas.find(t => t.id === id);
    if (tarefa) {
        tarefa.concluida = true;
        fs.writeFileSync(path, JSON.stringify(tarefas, null, 2));
        res.json(tarefa);
    } else {
        res.status(404).json({ error: 'Tarefa não encontrada' });
    }
});

// Rota para remover tarefa
app.delete('/tarefas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let tarefas = JSON.parse(fs.readFileSync(path, 'utf-8'));
    const tarefaExistia = tarefas.find(t => t.id === id);
    if (tarefaExistia) {
        tarefas = tarefas.filter(t => t.id !== id);
        fs.writeFileSync(path, JSON.stringify(tarefas, null, 2));
        res.json({ message: 'Tarefa removida' });
    } else {
        res.status(404).json({ error: 'Tarefa não encontrada' });
    }
});

app.listen(3000, () => {
    console.log('Backend rodando na porta 3000');
});
