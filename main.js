const ENTER = 13;
const STORAGE = 'http://5da30a3e76c28f0014bbe6a6.mockapi.io/todos';

window.onload = function() {
    getTodos()
        .then(todos => showTodos(todos));

    document.getElementById('input').addEventListener('keydown', function(event) {
        if (event.keyCode === ENTER) {
            if (isEmptyString(getInput())) {
                return;
            }

            let todo = createTodo();
            saveToStorage(todo)
                .then(_ => getTodos())
                .then(todos => showTodos(todos));
            
            document.getElementById('input').value = '';
        }
    });

    document.getElementById("result").addEventListener("click", function(event) {
        let element = event.target;
        let elementJob = element.attributes.job.value;

        if (elementJob == "complete") {
            completeToDo(element)
                .then(_ => getTodos())
                .then(todos => showTodos(todos));
        }else if (elementJob == "delete") {
            removeToDo(element)
                .then(_ => getTodos())
                .then(todos => showTodos(todos));
        } else if (elementJob == "update") {
            updateToDo(element)
                .then(_ => getTodos())
                .then(todos => showTodos(todos));
        }
    });
};

function saveToStorage(todo) {
    return fetch(STORAGE, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plan, */*',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(todo)
            });
}

function updateToStorage(todo) {
    return fetch(`${STORAGE}/${todo.id}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json, text/plan, */*',
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(todo)
            });
}

function updateToDo(element) {
    return fetch(`${STORAGE}/${element.id}`)
            .then(res => res.json())
            .then(todo => {
                todo.task = prompt('Update', todo.task);
                if (todo.task == null) {
                    return;
                }
                return updateToStorage(todo);
            });
}

function isEmptyString(str) {
    return str.length > 0 ? false : true; 
}

function completeToDo(button) {
    return fetch(`${STORAGE}/${button.id}`)
            .then(res => res.json())
            .then(todo => {
                todo.done = todo.done ? false : true;
                return updateToStorage(todo);
            });
}

function removeToDo(button) {
    return fetch(`${STORAGE}/${button.id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json, text/plan, */*',
                    'Content-type': 'application/json'
                }
            });
}

function getTodos() {
    return fetch(STORAGE)
              .then(res => res.json());
}

function createTodo() {
    let todo = {};
    todo.id;
    todo.task = getInput();
    todo.done = false;  

    return todo;  
}

function getInput() {
    return document.getElementById("input").value;
}

function showTodos(todos) {
    let output = "";   

    for (let i = 0; i < todos.length; i++) {
        const DONE = todos[i].done ? 'done' : 'undone';
        const DONE_BUTTON = todos[i].done ? 'Undone' : 'Done';
        
        output += `<li>
            <button id='${todos[i].id}' class='complete-button' job='complete'>${DONE_BUTTON}</button>
            <p id='${todos[i].id}' class=${DONE} job='update'>${todos[i].task}</p>
            <button id='${todos[i].id}' class='delete-button' job='delete'>Delete</button>
            </li>
            `;
    }

    let result = document.getElementById("result");
    result.innerHTML = output;
}
