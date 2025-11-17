document.addEventListener("DOMContentLoaded", (event) => {
    const botaoAdicionarMateria = document.querySelector('#botao-adicionar-materia');
    const botaoAdicionarMateriaCorpo = document.querySelector('#botao-adicionar-materia-corpo');

    const botaoCancelar = document.getElementById('botao-cancelar');

    const botaoSalvar = document.getElementById('botao-salvar');
    const inputMateria = document.getElementById('input-materia');
    const listaMaterias = document.getElementById('lista-materias');

    const formulario = document.getElementById('sobrepor-formulario');
    const fundo = document.getElementById('escurecer-fundo');


    //aparecer formulario e escurecer o fundo
    botaoAdicionarMateria.onclick = function () {
        formulario.style.display = 'block';
        fundo.style.display = 'block';
        inputMateria.focus();
    }

    botaoAdicionarMateriaCorpo.onclick = function () {      //não pode usar o mesmo id para o mesmo botão, não le ids iguais.
        formulario.style.display = 'block';
        fundo.style.display = 'block';
        inputMateria.focus();
    }

    //desaparecer formulario e embranquecer fundo
    botaoCancelar.onclick = function () {
        formulario.style.display = 'none';
        fundo.style.display = 'none';
    }

    //sair da tela do formulario com Esc
    inputMateria.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            event.preventDefault();
            botaoCancelar.click();
        }
    })



    botaoSalvar.onclick = function () {
        salvarMateria(); //chama a função que salva no localStorage
    };


    //salvar materia com Enter quando está com formulário aberto
    inputMateria.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            botaoSalvar.click();
        }
    })

    //contador de IDs para as matérias
    if (!localStorage.getItem('contadorMaterias')) {            //se não existir contador (ID)
        localStorage.setItem('contadorMaterias', '1');          //cria o contador começando em 1
    }

    //contador de IDs para as atividade
    if (!localStorage.getItem('contadorAtividades')) {            //se não existir contador (ID)
        localStorage.setItem('contadorAtividades', '1');          //cria o contador começando em 1
    }

    //salvar array de matérias
    if (!localStorage.getItem('listaMaterias')) {               //se não existir lista de materias
        localStorage.setItem('listaMaterias', '[]');            //cria a lista de matérias
    }

    //salvar array de matérias
    if (!localStorage.getItem('listaAtividades')) {               //se não existir lista de materias
        localStorage.setItem('listaAtividades', '[]');            //cria a lista de matérias
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
        atualizarOfensiva();

        // limpa e fecha formulário 
        inputMateria.value = '';                                   // limpa campo
        formulario.style.display = 'none';                         // fecha modal
        fundo.style.display = 'none';                              // esconde overlay
    }

    //Função: remove matéria por ID (atualiza storage e tela)
    function removerMateria(id) {                                                       // recebe id (number)
        const lista = JSON.parse(localStorage.getItem('listaMaterias') || '[]');        // lê lista, se não tiver nada usa uma lista vazia ([])
        const novaLista = lista.filter(function (m) { return m.id !== id; });            // filtra removendo o id
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

        lista.forEach(function (materia) {
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

    const adicionarAtividade = document.getElementById('botao-adicionar-atividade-corpo');
    const adicionarAtividadeIcone = document.getElementById('adicionar-atividade');

    const formularioAtividade = document.getElementById('sobrepor-formulario-atividade');

    const botaoSalvarAtividade = document.getElementById('botao-salvar-atividade');
    const botaoCancelarAtividade = document.getElementById('botao-cancelar-atividade');
    const inputAtividade = document.getElementById('input-atividade');
    const listaAtividades = document.getElementById('lista-atividades');

    const inputDataAtividade = document.getElementById('input-data-atividade');


    fundo.onclick = function () {
        formulario.style.display = 'none';
        formularioAtividade.style.display = 'none';
        fundo.style.display = 'none';
    }

    adicionarAtividade.onclick = function () {
        formularioAtividade.style.display = 'block';
        fundo.style.display = 'block';
        inputAtividade.focus();
    }
    adicionarAtividadeIcone.onclick = function () {
        formularioAtividade.style.display = 'block';
        fundo.style.display = 'block';
        inputAtividade.focus();
    }

    botaoSalvarAtividade.onclick = function () {
        salvarAtividade(); //chama a função que salva no localStorage
    };

    inputAtividade.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            botaoSalvarAtividade.click();
        }
    })



    function salvarAtividade() {                                          // função que salva atividade
        const nomeDaAtividade = inputAtividade.value.trim();  // pega e trim do input
        const selecionarMateria = document.getElementById('selecionar-materia');
        // ===== PEGAR A MATÉRIA ESCOLHIDA =====
        const materiaSelecionada = selecionarMateria.value;

        // Se o usuário escolher "Sem matéria", o value será "0" → salvamos como null
        const materiaId = materiaSelecionada === "0" ? null : Number(materiaSelecionada);

        // pegar data AGORA
        const dataFim = inputDataAtividade.value;


        if (nomeDaAtividade === '') {                                     // valida campo não vazio
            alert('Digite o nome da atividade ou cancele a operação');    // alerta se vazio
            return;                                                     // sai sem salvar
        }

        if (dataFim === '') {                                     // valida campo não vazio
            alert('Escolha a data da atividade ou cancele a operação');    // alerta se vazio
            return;                                                     // sai sem salvar
        }

        const contadorAtual = parseInt(localStorage.getItem('contadorAtividades'), 10);   // pega contador atual

        const novaAtividade = {         //array de atividades contendo as informações para tela
            id: contadorAtual,
            nome: nomeDaAtividade,
            materiaId: materiaId,   // salva o id da matéria OU null
            dataFim: dataFim        // salva a data OU null
        };


        const lista = JSON.parse(localStorage.getItem('listaAtividades') || '[]');    // lê lista atual, se não tiver nada usa uma vazia ([])
        lista.push(novaAtividade);                                                    // adiciona a nova atividade
        localStorage.setItem('listaAtividades', JSON.stringify(lista));               // salva lista atualizada

        localStorage.setItem('contadorAtividades', String(contadorAtual + 1)); // incrementa e salva contador

        carregarAtividadesNaTela();
        atualizarOfensiva();                                // re-renderiza lista na tela//renderiza o select com a nova matéria cadastrada

        // limpa e fecha formulário 
        inputAtividade.value = '';                                   // limpa campo
        formularioAtividade.style.display = 'none';                         // fecha modal
        fundo.style.display = 'none';
        reloadCalendarEvents();                          // esconde overlay
    }

    botaoCancelarAtividade.onclick = function () {
        formularioAtividade.style.display = 'none';
        fundo.style.display = 'none';
    }

    //Função: remove matéria por ID (atualiza storage e tela)
    function removerAtividade(id) {                                                       // recebe id (number)
        const lista = JSON.parse(localStorage.getItem('listaAtividades') || '[]');        // lê lista, se não tiver nada usa uma lista vazia ([])
        const novaLista = lista.filter(function (m) { return m.id !== id; });            // filtra removendo o id
        localStorage.setItem('listaAtividades', JSON.stringify(novaLista));               // salva lista filtrada
        carregarAtividadesNaTela();
        reloadCalendarEvents();                                                     // atualiza DOM
    }

    // FUNÇÃO ORIGINAL (Encontre e substitua esta)
function carregarAtividadesNaTela() {
    // ... (restante do código) ...
    lista.forEach(function (atividade) {
        // ... (criação do li, matéria, etc.) ...
        
        // ... (Criação e anexação do botaoExcluir no li) ...
        // ... (Criação e anexação do botaoConcluir no li) ...
        
    });
    // ... (restante do código) ...
}

// -------------------------------------------------------------
// FUNÇÃO MODIFICADA (Substitua a original por esta)
// -------------------------------------------------------------

function carregarAtividadesNaTela() {

    listaAtividades.innerHTML = "";
    // Limpa a lista antes de reconstruir tudo do zero

    const lista = JSON.parse(localStorage.getItem('listaAtividades') || '[]');
    const materias = JSON.parse(localStorage.getItem('listaMaterias') || '[]');


    lista.forEach(function (atividade) {
        // Para cada atividade salva, cria um item visual <li>
        const li = document.createElement('li');
        
        // Achar a matéria correspondente, se existir
        const materia = materias.find(m => m.id === atividade.materiaId);

        li.innerHTML = `
            <strong>${atividade.nome}</strong><br>
            Matéria: ${materia ? materia.nome : "Sem matéria"}<br>
            Data: ${atividade.dataFim ? atividade.dataFim : "Sem data"}
        `;
        
        // =======================================================
        // COMEÇO DA MODIFICAÇÃO (CRIAÇÃO DO CONTAINER DE BOTÕES)
        // =======================================================

        // NOVO: 1. Cria o container (DIV) que define a coluna e a posição absoluta
        const divBotoes = document.createElement('div');
        divBotoes.classList.add('container-botoes-coluna');


        // 2. Botão de Excluir
        const botaoExcluir = document.createElement('button');
        botaoExcluir.classList.add('botao-excluir');
        // ADICIONA A CLASSE DE RESET DE POSICIONAMENTO AOS BOTÕES
        botaoExcluir.classList.add('botao-acao-vertical'); 

        const icone = document.createElement('img');
        icone.src = 'utilitarios/Lixeira.png';
        icone.alt = 'Excluir';
        icone.style.width = '18px';
        icone.style.height = '18px';

        botaoExcluir.appendChild(icone);
        botaoExcluir.onclick = function () {
            removerAtividade(atividade.id);
        };
        
        // ADICIONA O BOTÃO AO NOVO CONTAINER (em vez de no li)
        divBotoes.appendChild(botaoExcluir); 

        
        // 3. Botão de Concluir
        const botaoConcluir = document.createElement('button');
        botaoConcluir.classList.add('botao-concluir');
        // ADICIONA A CLASSE DE RESET DE POSICIONAMENTO AOS BOTÕES
        botaoConcluir.classList.add('botao-acao-vertical');

        const iconeConcluir = document.createElement('img');
        iconeConcluir.src = 'utilitarios/checked.png'; // caminho da imagem de check
        iconeConcluir.alt = '';
        botaoConcluir.appendChild(iconeConcluir);

        botaoConcluir.onclick = function () {
            li.classList.toggle('concluida'); 
            botaoConcluir.classList.toggle('concluida');

            // Atualiza no localStorage
            const listaAtividadesStorage = JSON.parse(localStorage.getItem('listaAtividades') || '[]');
            const index = listaAtividadesStorage.findIndex(a => a.id === atividade.id);
            if (index !== -1) {
                listaAtividadesStorage[index].concluida = li.classList.contains('concluida');
                localStorage.setItem('listaAtividades', JSON.stringify(listaAtividadesStorage));
            }

            // Move para o fim se concluída
            if (li.classList.contains('concluida')) {
                listaAtividades.appendChild(li);
            } else {
                listaAtividades.insertBefore(li, listaAtividades.firstChild);
            }
        };

        // ADICIONA O BOTÃO AO NOVO CONTAINER (em vez de no li)
        divBotoes.appendChild(botaoConcluir); 
        
        // 4. Adiciona o container de botões ao li
        li.appendChild(divBotoes);
        
        // =======================================================
        // FIM DA MODIFICAÇÃO
        // =======================================================


        listaAtividades.appendChild(li);
        // Adiciona o <li> completo dentro da lista na tela
    });

    reloadCalendarEvents();
}

    function atualizarImagemFogo(ofensiva) {
        const img = document.getElementById("imagem-ofensiva");
        const texto = document.getElementById("dias-ofensiva");

        texto.innerText = "Ofensiva:" + ofensiva; // atualiza o número

        if (ofensiva === 0) {
            img.src = "utilitarios/fogo_apagado.png";
        } else if (ofensiva < 10) {
            img.src = "utilitarios/fogo.png";
        } else if (ofensiva < 20) {
            img.src = "utilitarios/fogovermelho.png";
        } else if (ofensiva < 50) {
            img.src = "utilitarios/fogoazul.png";
        } else {
            img.src = "utilitarios/fogoroxo.png";
        }
    }

    function atualizarOfensiva() {
        const hoje = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        let dados = JSON.parse(localStorage.getItem("ofensiva")) || {
            ofensiva: 0,
            ultimaAtualizacao: null
        };

        // Já atualizou hoje → não soma novamente
        if (dados.ultimaAtualizacao === hoje) {
            atualizarImagemFogo(dados.ofensiva);
            return;
        }

        // Soma 1 dia
        dados.ofensiva += 1;
        dados.ultimaAtualizacao = hoje;

        // Salvar de volta
        localStorage.setItem("ofensiva", JSON.stringify(dados));

        atualizarImagemFogo(dados.ofensiva);
    }

    let calendar;


    // NOVA FUNÇÃO: Transforma a lista de atividades em formato de eventos do FullCalendar
    function getCalendarEvents() {
        const atividades = JSON.parse(localStorage.getItem('listaAtividades') || '[]');
        const materias = JSON.parse(localStorage.getItem('listaMaterias') || '[]');

        return atividades
            .filter(atividade => atividade.dataFim) // Filtra apenas atividades com data
            .map(atividade => {
                // Encontra a matéria correspondente para usar o nome no título do evento
                const materia = materias.find(m => m.id === atividade.materiaId);
                const titulo = `${atividade.nome} ${materia ? `(${materia.nome})` : ''}`;

                return {
                    id: atividade.id,
                    title: titulo,
                    // O FullCalendar usa 'date' ou 'start' para eventos de dia inteiro
                    start: atividade.dataFim,
                    allDay: true
                    // Você pode adicionar 'color' aqui se quiser cores diferentes por matéria!
                };
            });
    }


    // NOVO: Adiciona a função para recarregar os eventos (chame esta função após salvar/remover)
    function reloadCalendarEvents() {
        if (calendar) {
            // Remove a fonte de eventos existente e adiciona a nova lista.
            // Se a fonte for um array simples (como a função getCalendarEvents que retorna um array), 
            // a maneira mais fácil é redefinir o array de eventos.
            calendar.setOption('events', getCalendarEvents());
        }
    }

    calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
        initialView: 'dayGridMonth',
        locale: 'pt-br', // Certifique-se que o calendário está em português
        // Adiciona a fonte de eventos, chamando a função para carregar do localStorage
        events: getCalendarEvents()
    });

    //desaparecer formulario e embranquecer fundo


    calendar.render();

    carregarAtividadesNaTela();
    carregarMateriasNaTela();
    atualizarSelectMaterias();

    const dados = JSON.parse(localStorage.getItem("ofensiva")) || { ofensiva: 0 };
    atualizarImagemFogo(dados.ofensiva);
})