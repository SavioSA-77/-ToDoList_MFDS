const inputTarefa = document.getElementById('coloca-tarefa');
const listaTarefas = document.getElementById('lista-tarefas');
const barraPesquisa = document.getElementById('barra-pesquisa');

const API_URL = 'https://todo-list-mfds.onrender.com/';

//console.log('Script carregado. Conectando com a API em:', API_URL);
// ---------- Funções de API ----------
async function carregarTarefas() {
  try {
    const resp = await fetch(API_URL);
    const tarefas = await resp.json();
    renderizarTarefas(tarefas);
  } catch (err) {
    console.error('Erro ao carregar tarefas:', err);
  }
}

async function adicionarTarefaAPI(texto) {
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto }),
    });
    await carregarTarefas(); // recarrega a lista
  } catch (err) {
    console.error('Erro ao adicionar:', err);
  }
}

async function atualizarEstadoAPI(id, estado) {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
    });
    await carregarTarefas();
  } catch (err) {
    console.error('Erro ao atualizar:', err);
  }
}

async function excluirTarefaAPI(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    await carregarTarefas();
  } catch (err) {
    console.error('Erro ao excluir:', err);
  }
}

// ---------- Renderização com filtros ----------
let filtroAtual = 'todas'; // 'todas', 'ativas', 'feitas'

function renderizarTarefas(tarefas) {
  // Aplica filtro por estado e pesquisa
  const textoPesquisa = barraPesquisa.value.toLowerCase();
  const filtradas = tarefas.filter(t => {
    const matchTexto = t.texto.toLowerCase().includes(textoPesquisa);
    if (filtroAtual === 'ativas') return matchTexto && t.estado === 'ativa';
    if (filtroAtual === 'feitas') return matchTexto && t.estado === 'feita';
    return matchTexto; // 'todas'
  });

  listaTarefas.innerHTML = '';
  filtradas.forEach(tarefa => {
    const li = document.createElement('li');
    li.textContent = tarefa.texto;
    if (tarefa.estado === 'feita') li.classList.add('feita');

    // Ao clicar na tarefa, alterna estado
    li.addEventListener('click', () => {
      const novoEstado = tarefa.estado === 'ativa' ? 'feita' : 'ativa';
      atualizarEstadoAPI(tarefa.id, novoEstado);
    });

    // Botão excluir
    const span = document.createElement('span');
    span.innerHTML = '🗑️';
    span.style.cursor = 'pointer';
    span.style.marginLeft = '15px';
    span.addEventListener('click', (e) => {
      e.stopPropagation();
      excluirTarefaAPI(tarefa.id);
    });

    li.appendChild(span);
    listaTarefas.appendChild(li);
  });
}

// ---------- Funções de UI ----------
function adicionarTarefa() {
  const valor = inputTarefa.value.trim();
  if (valor === '') {
    alert('Escreva algo!');
    return;
  }
  adicionarTarefaAPI(valor);
  inputTarefa.value = '';
  inputTarefa.focus();
}

function pesquisarTarefas() {
  carregarTarefas(); // recarrega e aplica o filtro de pesquisa no render
}

function mostrarTodasTarefas() {
  filtroAtual = 'todas';
  carregarTarefas();
}

function mostrarTarefasAtivas() {
  filtroAtual = 'ativas';
  carregarTarefas();
}

function mostrarTarefasFeitas() {
  filtroAtual = 'feitas';
  carregarTarefas();
}

// ---------- Eventos ----------
inputTarefa.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') adicionarTarefa();
});

barraPesquisa.addEventListener('input', pesquisarTarefas);

// Carregar ao iniciar
window.onload = carregarTarefas;
