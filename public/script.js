function getToDo(todoData) {
    const html = `
    <li class="todo-item js todo-item" data id="${todoData.id}">
        <div class="form">
        <input type="text" class="todo-form-input js-todo-item-${todoData.id}" value="${todoData.todo}" />
        <button class="button save js-save-button" data-id="${todoData.id}" type="submit">Save</button>
      </div>
      <button class="button delete js-delete-button" data-id="${todoData.id}" type="button">Delete</button>
    </li>`;
    return html;
}

function renderToDos() {
    axios.get('/api/todos')
        .then((response) => {
            const htmlArray = response.data.map((todoItem) => {
                return getToDo(todoItem);
            });
            const htmlString = htmlArray.join('');
            const todos = document.querySelector('.js-todos');
            todos.innerHTML = htmlString;
        })
        .catch((error) => {
            const errorMessage = error.response.data.error || error;
            alert('Unable to get to dos: ' + error.response.data.error);
        });
}

function addAToDo(text) {
    axios.post('/api/todos', {
        todo: text,
    })
        .then((response) => {
            const htmlString = getToDoHtml(response.data);
            const todos = document.querySelector('.js-todos');
            todos.innerHTML += htmlString;
        })
        .catch((error) => {
            const errorMessage = error.response.data.error || error;
            alert('Unable to add a todo: ' + errorMessage);

        });
}

function deleteAToDo(id) {
    axios.delete(`/api/todos/${id}`)
        .then((response) => {
            const htmlArray = response.data.map((todoItem) => {
                return getToDoHtml(todoItem);
            });
            const htmlString = htmlArray.join('');
            const todos = document.querySelector('.js-todos');
            todos.innerHTML = htmlString;
        })
        .catch((error) => {
            const errorMessage = error.response.data.error || error;
            alert('Unable to add a todo: ' + errorMessage);
        });
}

function updateAToDo(id) {
    const toDoForm = document.querySelector(`.js-todo-item-${id}`);
    axios.put(`/api/todos/${id}`, {
            todo: toDoForm.value,
        })
        .then((response) => {
            toDoForm.value = response.data.todo;
        })
        .catch((error) => {
            const errorMessage = error.response.data.error || error;
            alert('Unable to update todo:' + errorMessage);
        });
}

const addForm = document.querySelector('.js-add-form');
addForm.addEventListener('Submit', (e) => {
    e.preventDefault();

    const text = document.querySelector('.js-input').value;
    addAToDo(text);
    addForm.reset();
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('js-delete-button')) {
        const id = e.target.dataset.id;
        updateAToDo(id);
    }
});

renderToDos();