const inputTarefa = document.getElementById('coloca-tarefa');
const listaTarefas = document.getElementById('lista-tarefas');

function pesquisarTarefas() {
    const filtro = document.getElementById('barra-pesquisa').value.toLowerCase();
    const tarefas = listaTarefas.getElementsByTagName('li');

    for (let i = 0; i < tarefas.length; i++) {
        const texto = tarefas[i].textContent.toLowerCase();
        if (texto.includes(filtro)) {
            tarefas[i].style.display = 'flex';
        } else {
            tarefas[i].style.display = 'none';
        }
    }
}


function adicionarTarefa() {
    if (inputTarefa.value === '') {
        alert("Escreva algo!");
        return;
    } else {
        let li = document.createElement("li");
        li.textContent = inputTarefa.value;
        li.dataset.estado = 'ativa';
        
        const tarefa = {
            nome: inputTarefa.value,
            estado: 'ativa'
        }

        li.addEventListener('click', function() {
            this.classList.toggle('feita');
            tarefa.estado = this.classList.contains('feita') ? 'feita' : 'ativa';
            this.dataset.estado = tarefa.estado;
        });


      
        let span = document.createElement("span");
        span.innerHTML = "🗑️";
        span.style.cursor = "pointer";
        span.style.marginLeft = "15px";
        
        span.addEventListener('click', function(e) {
            e.stopPropagation();
            this.parentElement.remove();
        });
        
        li.appendChild(span);
        listaTarefas.appendChild(li);
        
       
        inputTarefa.value = '';
        inputTarefa.focus(); 
    }
}



function mostrarTarefasAtivas() {
    const tarefas = listaTarefas.getElementsByTagName('li');
    Array.from(tarefas).forEach(tarefa => {
        tarefa.style.display = tarefa.dataset.estado === 'ativa' ? 'flex' : 'none';
    });
}


function mostrarTarefasFeitas() {
    const tarefas = listaTarefas.getElementsByTagName('li');
    Array.from(tarefas).forEach(tarefa => {
        tarefa.style.display = tarefa.dataset.estado === 'feita' ? 'flex' : 'none';
    });
}


function mostrarTodasTarefas() {
    const tarefas = listaTarefas.getElementsByTagName('li');
    Array.from(tarefas).forEach(tarefa => tarefa.style.display = 'flex');
}


inputTarefa.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        adicionarTarefa();
    }
});