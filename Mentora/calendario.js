// Este script deve ser usado APENAS em calendario-grande.html

// Copie esta função do seu script.js, ela precisa acessar o localStorage
function getCalendarEvents() {
    const atividades = JSON.parse(localStorage.getItem('listaAtividades') || '[]');
    const materias = JSON.parse(localStorage.getItem('listaMaterias') || '[]');

    return atividades
        .filter(atividade => atividade.dataFim)
        .map(atividade => {
            const materia = materias.find(m => m.id === atividade.materiaId);
            const titulo = `${atividade.nome} ${materia ? `(${materia.nome})` : ''}`;
            
            return {
                id: atividade.id,
                title: titulo,
                start: atividade.dataFim, 
                allDay: true 
            };
        });
}

document.addEventListener("DOMContentLoaded", (event) => {
    // Inicializa o calendário FullCalendar no novo contêiner
    let calendarFullscreen = new FullCalendar.Calendar(document.getElementById('calendar-fullscreen'), {
        initialView: 'dayGridMonth',
        locale: 'pt-br',
        events: getCalendarEvents(),
        
        // Configurações para tela cheia/grande:
        height: 'auto', // Deixa a altura se ajustar ao conteúdo/viewport
        contentHeight: 'auto', 
        
        // Você pode configurar o cabeçalho para ter apenas os botões de navegação
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: ''
        }
    });
    
    calendarFullscreen.render();

    // Como esta é uma tela separada, você pode adicionar um listener para refetchEvents
    // se desejar que ele se atualize quando você voltar para a página.
    // Mas, ao recarregar a página, ele já carrega os dados novos do localStorage.
});