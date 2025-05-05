window.onload = function() {
    initApp();

function initApp() {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const ongoingList = document.getElementById('ongoing-tasks');
    const completedList = document.getElementById('completed-tasks');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || { ongoing: [], completed: [] };

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function createTaskElement(text, isCompleted = false) {
        const li = document.createElement('li');
        li.className = 'todo-item';
        li.innerHTML = `
            <div class="todo-text">${text}</div>
            <div class="swipe-hint">${isCompleted ? 'En cours →' : 'Terminé →'}</div>
        `;

        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        li.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            li.classList.add('swiping');
        });

        li.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const diff = currentX - startX;
            li.style.transform = `translateX(${diff}px)`;

            // Afficher l'indicateur de swipe
            const hint = li.querySelector('.swipe-hint');
            if (Math.abs(diff) > 50) {
                hint.classList.add('visible');
                // Ajout des classes appropriées selon la direction
                if (diff > 0) {
                    hint.classList.add('complete');
                    hint.classList.remove('delete');
                } else {
                    hint.classList.add('delete');
                    hint.classList.remove('complete');
                }
            } else {
                hint.classList.remove('visible');
            }
        });

        li.addEventListener('touchend', () => {
            isDragging = false;
            const diff = currentX - startX;
            li.classList.remove('swiping');

            if (Math.abs(diff) > 100) {
                const taskText = li.querySelector('.todo-text').textContent;
                if (diff > 0) {
                    // Swipe droite : basculer entre en cours et terminé
                    if (isCompleted) {
                        // Retour en cours
                        tasks.completed = tasks.completed.filter(t => t !== taskText);
                        tasks.ongoing.push(taskText);
                    } else {
                        // Marquer comme terminé
                        tasks.ongoing = tasks.ongoing.filter(t => t !== taskText);
                        tasks.completed.push(taskText);
                    }
                    li.classList.add('move-right');
                } else if (diff < 0) {
                    // Swipe gauche : supprimer la tâche
                    if (isCompleted) {
                        tasks.completed = tasks.completed.filter(t => t !== taskText);
                    } else {
                        tasks.ongoing = tasks.ongoing.filter(t => t !== taskText);
                    }
                    li.classList.add('move-left');
                }
                saveTasks();
                
                // Attendre la fin de l'animation avant de rafraîchir
                setTimeout(renderTasks, 300);
            } else {
                // Pas assez swipé, retour à la position initiale
                li.style.transform = '';
                li.querySelector('.swipe-hint').classList.remove('visible');
            }
        });

        return li;
    }

    function renderTasks() {
        ongoingList.innerHTML = '';
        completedList.innerHTML = '';

        tasks.ongoing.forEach(text => {
            ongoingList.appendChild(createTaskElement(text, false));
        });

        tasks.completed.forEach(text => {
            completedList.appendChild(createTaskElement(text, true));
        });

        // Refresh jQuery Mobile list
        $(ongoingList).listview().listview('refresh');
        $(completedList).listview().listview('refresh');
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (text) {
            tasks.ongoing.push(text);
            saveTasks();
            renderTasks();
            input.value = '';
        }
    });

  
  
    renderTasks();
}

}