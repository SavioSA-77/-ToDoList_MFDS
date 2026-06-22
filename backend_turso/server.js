const express = require('express');
const cors = require('cors');
const { createClient } = require('@libsql/client');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(__dirname));

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Listar todas as tarefas
app.get('/tarefas', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM tarefas ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Adicionar nova tarefa
app.post('/tarefas', async (req, res) => {
  const { texto } = req.body;
  if (!texto || texto.trim() === '') {
    return res.status(400).json({ erro: 'Texto é obrigatório' });
  }
  try {
    await db.execute({
      sql: 'INSERT INTO tarefas (texto, estado) VALUES (?, ?)',
      args: [texto.trim(), 'ativa'],
    });
    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Atualizar estado (ativa/feita) de uma tarefa
app.put('/tarefas/:id', async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  if (!['ativa', 'feita'].includes(estado)) {
    return res.status(400).json({ erro: 'Estado inválido' });
  }
  try {
    await db.execute({
      sql: 'UPDATE tarefas SET estado = ? WHERE id = ?',
      args: [estado, id],
    });
    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Excluir tarefa
app.delete('/tarefas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute({
      sql: 'DELETE FROM tarefas WHERE id = ?',
      args: [id],
    });
    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));