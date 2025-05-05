window.onload = function() {

let todos = [];

initializeApp();

function onDeviceReady() {
    initializeApp();
}

function initializeApp() {
    console.log('App initialisée');
    // Gestionnaire du formulaire
    $('#todo-form').on('submit', function(e) {
        e.preventDefault();
        const input = $('#todo-input');
        console.log('Input:', input.val());
        const text = input.val().trim();
        
        if (text) {
            console.log('Ajout de la tâche :', text);
            addTodo(text);
            input.val('');
        }
    });

    // Initialiser le swipe sur la liste
    initializeSwipe();
}

function addTodo(text) {
    const todo = {
        id: Date.now(),
        text: text,
        completed: false
    };
    todos.push(todo);
    renderTodos();
}

function renderTodos() {
    const list = $('#todo-list');
    list.empty();
    
    todos.forEach(todo => {
        const li = $('<li>').addClass('todo-item');
        if (todo.completed) {
            li.addClass('completed-task');
        }
        
        li.html(`<div class="todo-text">${todo.text}</div>`);
        li.data('todo-id', todo.id);
        list.append(li);
    });
    
    list.listview().listview('refresh');
}

function initializeSwipe() {
    let startX = 0;
    let currentX = 0;
    const threshold = 100; // Distance minimum pour déclencher une action

    $(document).on('touchstart', '.todo-item', function(e) {
        if (e.originalEvent && e.originalEvent.touches) {
            startX = e.originalEvent.touches[0].clientX;
            currentX = startX;
        }
    });

    $(document).on('touchmove', '.todo-item', function(e) {
        if (e.originalEvent && e.originalEvent.touches) {
            currentX = e.originalEvent.touches[0].clientX;
            const diff = currentX - startX;
            
            if (Math.abs(diff) > 20) { // Éviter le scroll vertical accidentel
                e.preventDefault();
            }
        }
    });

    $(document).on('touchend', '.todo-item', function(e) {
        const diff = currentX - startX;
        const todoId = $(this).data('todo-id');
        
        if (Math.abs(diff) >= threshold) {
            if (diff > 0) {
                // Swipe droite - marquer comme terminé
                toggleTodoComplete(todoId);
            } else {
                // Swipe gauche - supprimer
                deleteTodo(todoId);
            }
        }
    });
}

function toggleTodoComplete(todoId) {
    const todo = todos.find(t => t.id === todoId);
    if (todo) {
        todo.completed = !todo.completed;
        renderTodos();
    }
}

function deleteTodo(todoId) {
    todos = todos.filter(t => t.id !== todoId);
    renderTodos();
}


}