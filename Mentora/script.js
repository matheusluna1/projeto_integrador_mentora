const botaoAdicionar = document.querySelector('.botao-adicionar-materia');

const botaoCancelar = document.getElementById('botao-cancelar');

const botaoSalvar = document.getElementById('botao-salvar');
const inputMateria = document.getElementById('input-materia');
const listaMaterias = document.getElementById('lista-materias');

const formulario = document.getElementById('sobrepor-formulario');
const fundo = document.getElementById('escurecer-fundo');

//aparecer formulario e escurecer o fundo
botaoAdicionar.onclick = function() {
    formulario.style.display = 'block';
    fundo.style.display = 'block';
    inputMateria.focus();
}

//desaparecer formulario e embranquecer fundo
botaoCancelar.onclick = function() {
    formulario.style.display = 'none';
    fundo.style.display = 'none';
}

inputMateria.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        event.preventDefault();
        botaoCancelar.click();
    }
})

//desaparecer formulario e embranquecer fundo
fundo.onclick = function() {
    formulario.style.display = 'none';
    fundo.style.display = 'none';
}

//salvar matéria
botaoSalvar.onclick = function() {
    const nomeDaMateria = inputMateria.value.trim()

    if (nomeDaMateria === "") {
        alert("Digite o nome da matéria ou cancele a operação");
        return;
    }

    const novaMateria = document.createElement('li');
    novaMateria.textContent = nomeDaMateria;
    listaMaterias.appendChild(novaMateria);
    inputMateria.value = "";

    formulario.style.display = 'none';
    fundo.style.display = 'none';
}

inputMateria.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        botaoSalvar.click();
    }
})
