let todoList;
const ENTER = 13;
const STORAGE_NAME = 'todo';

window.onload = function() {
    todoList = getTodoList();
    showTodo(todoList);

    document.getElementById('input').addEventListener('keydown', function(event) {
        if (event.keyCode === ENTER) {
            if (isEmptyString(getInput())) {
                return;
            }

            let id = getLastId();
            todoList.push(createTodo(id));
            saveToStorage(STORAGE_NAME, todoList);
            
            document.getElementById('input').value = '';
            showTodo(getTodoList());    
        }
    });

    document.getElementById("result").addEventListener("click", function(event) {
        let element = event.target;
        let elementJob = element.attributes.job.value;

        if (elementJob == "complete") {
            completeToDo(element);
        }else if (elementJob == "delete") {
            removeToDo(element);
        } else if (elementJob == "update") {
            updateToDo(element);
        }

        showTodo(getTodoList());
    });
};

function saveToStorage(key, list) {
    localStorage.setItem(key, JSON.stringify(list));
}

function updateToDo(element) {
    let todo = getElementById(element.id);
    todo.task = prompt('Update', todo.task);
    if (todo.task == null) {
        return;
    }

    changeListItem(todo, element.id);
    saveToStorage(STORAGE_NAME, todoList);
}

function isEmptyString(str) {
    return str.length > 0 ? false : true; 
}

function completeToDo(element) {
    let todo = getElementById(element.id);
    todo.done = todo.done ? false : true;
    changeListItem(todo, element.id);
    saveToStorage(STORAGE_NAME, todoList);
}

function getElementById(id) {
    return todoList.filter(item => item.id == id)[0];
}

function changeListItem(item, id) {
    let element = getElementById(id);
    index = todoList.indexOf(element);
    todoList[index] = item;
}

function removeToDo(element) {
    todoList = todoList.filter(item => item.id != element.id);
    saveToStorage(STORAGE_NAME, todoList);
}

function getLastId() {
    if (todoList.length == 0) {
        return 0;
    } else {
        let id = todoList.slice(-1)[0].id;
        return ++id;
    }
}

function getTodoList() {
    let todoList = [];

    if (localStorage.getItem(STORAGE_NAME) != undefined) {
        return todoList = JSON.parse(localStorage.getItem(STORAGE_NAME));
    } else {
        return todoList;
    }
}

function createTodo(id) {
    let todo = {};
    todo.id = id;
    todo.task = getInput();
    todo.done = false;  

    return todo;  
}

function getInput() {
    return document.getElementById("input").value;
}

function showTodo(todoList) {
    let output = "";
    for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].done == true) {
            output += `<li>
            <button id='${todoList[i].id}' class='complete-button' job='complete'>Undone</button>
            <p class='done' job='update'>${todoList[i].task}</p>
            <button id='${todoList[i].id}' class='delete-button' job='delete'>Delete</button>
            </li>
            `;
        } else {
            output += `<li>
            <button id='${todoList[i].id}' class='complete-button' job='complete'>Done</button>
            <p id='${todoList[i].id}' class='undone' job='update'>${todoList[i].task}</p>
            <button id='${todoList[i].id}' class='delete-button' job='delete'>Delete</button>
            </li>
            `;
        }
    }

    let result = document.getElementById("result");
    result.innerHTML = output;
}
