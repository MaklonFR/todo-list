let todos = [];

// Load tasks from localStorage
window.onload = () => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
    }
    renderTodos();
};

// Menambahkan tugas baru
function addTodo() {
    const input = document.getElementById('todo-input');
    const task = input.value.trim();

    if (task) {
        todos.push({ text: task, completed: false });
        input.value = '';
        saveTodos();
        renderTodos();
    }
}

// Fungsi untuk mengubah tinggi scroll secara dinamis
function setScrollHeight() {
    const unfinishedList = document.getElementById('unfinished-list');
    const finishedList = document.getElementById('finished-list');

    // Menghitung tinggi maksimum berdasarkan jumlah item
    const maxHeight = Math.min(unfinishedList.scrollHeight, 300);  // Max height 300px
    unfinishedList.style.maxHeight = `${maxHeight}px`;
    finishedList.style.maxHeight = `${maxHeight}px`;
}

// Render tugas ke dalam tab yang sesuai. Setelah render, panggil fungsi ini untuk menyesuaikan scroll
function renderTodos() {
    const unfinishedList = document.getElementById('unfinished-list');
    const finishedList = document.getElementById('finished-list');
    
    unfinishedList.innerHTML = '';
    finishedList.innerHTML = '';

    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = 'todo-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.onchange = () => toggleComplete(index);

        const taskText = document.createElement('span');
        taskText.textContent = todo.text;
        taskText.style.textDecoration = todo.completed ? 'line-through' : 'none';

        const actions = document.createElement('div');
        actions.className = 'actions';

        const editButton = document.createElement('button');
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.onclick = () => editTodo(index);

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.className = 'delete';
        deleteButton.onclick = () => deleteTodo(index);

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        li.appendChild(checkbox);
        li.appendChild(taskText);
        li.appendChild(actions);

        if (todo.completed) {
            finishedList.appendChild(li);
        } else {
            unfinishedList.appendChild(li);
        }
    });

    // Panggil fungsi setScrollHeight setelah setiap render
    setScrollHeight();
}

// Menandai tugas sebagai selesai atau belum selesai
function toggleComplete(index) {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderTodos();
}

// Simpan tugas ke localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Edit tugas langsung dalam input
function editTodo(index) {
    const todoList = todos[index].completed ? document.getElementById('finished-list') : document.getElementById('unfinished-list');
    const li = todoList.children[index];

    const taskText = li.querySelector('span');
    const currentText = taskText.textContent;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'edit-input';

    li.replaceChild(input, taskText);
    input.focus();

    input.addEventListener('blur', () => saveEdit(index, input));
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            saveEdit(index, input);
        }
    });
}

// Simpan perubahan setelah edit
function saveEdit(index, input) {
    const newTask = input.value.trim();
    if (newTask !== '') {
        todos[index].text = newTask;
        saveTodos();
    }
    renderTodos();
}

// Hapus tugas
function deleteTodo(index) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
}

// Fungsi untuk berpindah tab
function showTab(tab) {
    const unfinishedList = document.getElementById('unfinished-list');
    const finishedList = document.getElementById('finished-list');
    const buttons = document.querySelectorAll('.tab-button');

    if (tab === 'unfinished') {
        unfinishedList.classList.remove('hidden');
        finishedList.classList.add('hidden');
        buttons[0].classList.add('active');
        buttons[1].classList.remove('active');
    } else {
        unfinishedList.classList.add('hidden');
        finishedList.classList.remove('hidden');
        buttons[0].classList.remove('active');
        buttons[1].classList.add('active');
    }
}

// Fungsi untuk pencaharian Task
function filterTodos() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const lists = [document.getElementById('unfinished-list'), document.getElementById('finished-list')];

    lists.forEach(list => {
        Array.from(list.children).forEach(li => {
            const taskText = li.querySelector('span').textContent.toLowerCase();
            if (taskText.includes(searchTerm)) {
                li.style.display = 'flex';
            } else {
                li.style.display = 'none';
            }
        });
    });
}

