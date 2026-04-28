let tasks = []; //empty array to store tasks
let completed = []; //empty array to store completed tasks

document.getElementById('addTaskBtn').addEventListener('click', function () {
    //get the value of the input field
    let taskInput = document.getElementById('taskInput').value
    //check if input field is empty
    if (taskInput.trim() !== '') {
        //add task to the array
        tasks.push(taskInput);
        completed.push(false);
        //clear input field value
        document.getElementById('taskInput').value = ''
        // update task list display
        displayTasks()
    }
});

document.getElementById('taskInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        document.getElementById('addTaskBtn').click();
    }
});


function displayTasks() {
    // select taskList in the HTML
    let taskList = document.getElementById('taskList')
    // clear the existing html list
    taskList.innerHTML = ''
    // loop through each task in the array and create a list item for each
    tasks.forEach((task, index) => {
        // create <li> element for each task
        let li = document.createElement('li')
        // add styling 
        li.classList.add(
            'list-group-item',
            'd-flex',
            'justify-content-between',
            'align-items-center'
        );
        if (completed[index]) {
            li.classList.add('completed');
        }
        let btnIcon = completed[index] ? '✕' : '✓';
        let btnClass = completed[index] ? 'btn-danger' : 'btn-success';
        li.innerHTML = `
            <span class="${completed[index] ? 'text-decoration-line-through' : ''}">
                ${task}
            </span>

            <button class="btn ${btnClass} btn-sm"
                onclick="toggleTask(${index})">
                ${btnIcon}
            </button>
        `;
        //append the list item to the task list in the HTML
        taskList.appendChild(li)
    });
}

function toggleTask(index) {

    if (!completed[index]) {
        // mark complete
        completed[index] = true;
    } else {
        // delete it
        tasks.splice(index, 1);
        completed.splice(index, 1);
    }
    displayTasks();
}

// old removeTask function without animation
/* function removeTask(index) {
    //remove task from the array using the index
    tasks.splice(index, 1);
    //update task list display
    displayTasks();
} */

function removeTask(index, button) {
    const li = button.closest('li');

    // add animation class
    li.classList.add('removing');

    setTimeout(() => {
        tasks.splice(index, 1);
        displayTasks();
    }, 300);
}


document.getElementById('clearTaskBtn').addEventListener('click', function () {
    //clear the task array
    tasks = [];
    //update task list display
    displayTasks();
});