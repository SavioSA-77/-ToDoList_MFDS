//script.js


console.log("hello world");
const inputTarefa = document.getElementById('coloca-tarefa');
const listaTarefas = document.getElementById('lista-tarefas');

function pesquisarTarefas() {
    const filtro = document.getElementById('barra-pesquisa').value.toLowerCase();
    const itens = listaTarefas.getElementsByTagName('li');

    for (let i = 0; i < itens.length; i++) {
        const texto = itens[i].textContent.toLowerCase();
        if (texto.includes(filtro)) {
            itens[i].style.display = 'flex';
        } else {
            itens[i].style.display = 'none';
        }
    }
}

function adicionarTarefa() {
    const valor = inputTarefa.value.trim();
    if (valor === '') {
        alert('Escreva algo!');
        return;
    }

    const li = document.createElement('li');
    li.textContent = valor;
    li.dataset.estado = 'ativa';

    li.addEventListener('click', function() {
        this.classList.toggle('feita');
        this.dataset.estado = this.classList.contains('feita') ? 'feita' : 'ativa';
    });

    const span = document.createElement('span');
    span.innerHTML = '🗑️';
    span.style.cursor = 'pointer';
    span.style.marginLeft = '15px';

    span.addEventListener('click', function(e) {
        e.stopPropagation();
        this.parentElement.remove();
    });

    li.appendChild(span);
    listaTarefas.appendChild(li);

    inputTarefa.value = '';
    inputTarefa.focus();
}

function mostrarTarefasAtivas() {
    const itens = listaTarefas.getElementsByTagName('li');
    Array.from(itens).forEach(item => {
        item.style.display = item.dataset.estado === 'ativa' ? 'flex' : 'none';
    });
}

function mostrarTarefasFeitas() {
    const itens = listaTarefas.getElementsByTagName('li');
    Array.from(itens).forEach(item => {
        item.style.display = item.dataset.estado === 'feita' ? 'flex' : 'none';
    });
}

function mostrarTodasTarefas() {
    const itens = listaTarefas.getElementsByTagName('li');
    Array.from(itens).forEach(item => item.style.display = 'flex');
}

inputTarefa.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        adicionarTarefa();
    }
});
