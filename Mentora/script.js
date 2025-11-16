const botaoAdicionarMateria = document.querySelector('#botao-adicionar-materia');
const botaoAdicionarMateriaCorpo = document.querySelector('#botao-adicionar-materia-corpo');

const botaoCancelar = document.getElementById('botao-cancelar');

const botaoSalvar = document.getElementById('botao-salvar');
const inputMateria = document.getElementById('input-materia');
const listaMaterias = document.getElementById('lista-materias');

const formulario = document.getElementById('sobrepor-formulario');
const fundo = document.getElementById('escurecer-fundo');



//aparecer formulario e escurecer o fundo
botaoAdicionarMateria.onclick = function() {
    formulario.style.display = 'block';
    fundo.style.display = 'block';
    inputMateria.focus();
}
botaoAdicionarMateriaCorpo.onclick = function() {      //não pode usar o mesmo id para o mesmo botão, não le ids iguais.
    formulario.style.display = 'block';
    fundo.style.display = 'block';
    inputMateria.focus();
}

//desaparecer formulario e embranquecer fundo
botaoCancelar.onclick = function() {
    formulario.style.display = 'none';
    fundo.style.display = 'none';
}

//sair da tela do formulario com Esc
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


botaoSalvar.onclick = function() {
    salvarMateria(); //chama a função que salva no localStorage
};


//salvar materia com Enter quando está com formulário aberto
inputMateria.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        botaoSalvar.click();
    }
})

//contador de IDs para as matérias
if (!localStorage.getItem('contadorMaterias')) {            //se não existir contador (ID)
    localStorage.setItem('contadorMaterias', '1');          //cria o contador começando em 1
}

//salvar array de matérias
if (!localStorage.getItem('listaMaterias')) {               //se não existir lista de materias
    localStorage.setItem('listaMaterias', '[]');            //cria a lista de matérias
}


//salvar materia no localStorage
function salvarMateria() {                                          // função que salva matéria
    const nomeDaMateria = inputMateria.value.trim();                // pega e trim do input
    if (nomeDaMateria === '') {                                     // valida campo não vazio
        alert('Digite o nome da matéria ou cancele a operação');    // alerta se vazio
        return;                                                     // sai sem salvar
    }

    const contadorAtual = parseInt(localStorage.getItem('contadorMaterias'), 10);   // pega contador atual

    const novaMateria = { id: contadorAtual, nome: nomeDaMateria };     // cria objeto matéria

    const lista = JSON.parse(localStorage.getItem('listaMaterias') || '[]');    // lê lista atual, se não tiver nada usa uma vazia ([])
    lista.push(novaMateria);                                                    // adiciona a nova matéria
    localStorage.setItem('listaMaterias', JSON.stringify(lista));               // salva lista atualizada

    localStorage.setItem('contadorMaterias', String(contadorAtual + 1)); // incrementa e salva contador

    carregarMateriasNaTela();                                  // re-renderiza lista na tela
    atualizarSelectMaterias();                                 //renderiza o select com a nova matéria cadastrada

    // limpa e fecha formulário 
    inputMateria.value = '';                                   // limpa campo
    formulario.style.display = 'none';                         // fecha modal
    fundo.style.display = 'none';                              // esconde overlay
}

//Função: remove matéria por ID (atualiza storage e tela)
function removerMateria(id) {                                                       // recebe id (number)
    const lista = JSON.parse(localStorage.getItem('listaMaterias') || '[]');        // lê lista, se não tiver nada usa uma lista vazia ([])
    const novaLista = lista.filter(function(m) { return m.id !== id; });            // filtra removendo o id
    localStorage.setItem('listaMaterias', JSON.stringify(novaLista));               // salva lista filtrada
    carregarMateriasNaTela();                                                       // atualiza DOM
    atualizarSelectMaterias();
}

//Inicializa a renderização ao carregar o script
//FUNÇÃO PARA CARREGAR AS MATÉRIAS NA TELA
function carregarMateriasNaTela() {

    listaMaterias.innerHTML = ""; 
    // Limpa a lista antes de reconstruir tudo do zero
    // (evita itens duplicados ao atualizar a tela)

    const lista = JSON.parse(localStorage.getItem('listaMaterias') || '[]');
    // Lê a lista de matérias salva no localStorage
    // Se não existir nada, usa uma lista vazia ([])

    lista.forEach(function(materia) { 
        // Para cada matéria salva, cria um item visual <li>

        const li = document.createElement('li');
        li.textContent = materia.nome; 
        // Cria o <li> e coloca o nome da matéria dentro dele

        const botaoExcluir = document.createElement('button');
        botaoExcluir.classList.add('botao-excluir');
        // Cria o botão de excluir e adiciona sua classe

        const icone = document.createElement('img');
        icone.src = 'utilitarios/Lixeira.png';
        icone.alt = 'Excluir';
        icone.style.width = '18px';
        icone.style.height = '18px';
        // Cria o ícone da lixeira e define o tamanho dele

        botaoExcluir.appendChild(icone);
        // Coloca o ícone dentro do botão

        botaoExcluir.onclick = function () {
            removerMateria(materia.id);
        };
        // Ao clicar no botão:
        // chama removerMateria() passando o ID único dessa matéria

        li.appendChild(botaoExcluir);
        // Adiciona o botão de excluir dentro do <li>

        listaMaterias.appendChild(li);
        // Adiciona o <li> completo dentro da lista na tela
    });
}

function atualizarSelectMaterias() {
    const selecionarMateria = document.getElementById('selecionar-materia');    //pega o select, onde as matérias serão listadas
    selecionarMateria.innerHTML = '';                                           //limpa ele antes de recriar tudo

    //cria a opção para permitir que o usuário escolha nenhuma matéria.
    const optionNenhuma = document.createElement('option');
    optionNenhuma.value = '0';          //define o valor zero para 'nenhuma matéria'
    optionNenhuma.textContent = "Sem matéria";
    selecionarMateria.appendChild(optionNenhuma);       //adiciona essa opção como primeira.

    //pega a lista de matérias do localStorage
    const listaMateriasSelect = JSON.parse(localStorage.getItem('listaMaterias') || '[]'); 

    //para cada matéria cadastrada
    listaMateriasSelect.forEach(materia => {
        const option = document.createElement('option');        //cria um option
        option.value = materia.id;                              //valor interno = ao id da matéria
        option.textContent = materia.nome;
        selecionarMateria.appendChild(option);                  //adiciona no select
    })
}

const adicionarAtividade = document.getElementById('adicionar-atividade');
const formularioAtividade = document.getElementById('sobrepor-formulario-atividade');

const botaoSalvarAtividade = document.getElementById('botaoSalvarAtividade');
const botaoCancelarAtividade = document.getElementById('botao-cancelar-atividade');
const inputAtividade = document.getElementById('input-atividade');

adicionarAtividade.onclick = function() {
    formularioAtividade.style.display = 'block';
    fundo.style.display = 'block';
    inputAtividade.focus();
}


carregarMateriasNaTela();       //colocado no final do código para ao atualizar a página, carregar todos os itens da lista (materias)
atualizarSelectMaterias();      //colocado no final do código para ao atualizar a página, carregar todos os itens do select