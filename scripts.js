let tasks = []; //empty array to store tasks
let completed = []; //empty array to store completed tasks
let totalTasks = 0; // variable to store total number of tasks (not shown on screen but used for progress bar calculation)
let activeTasks = 0; // variable to store active number of tasks
let completedTasks = 0; // variable to store number of completed tasks
// variables to store last action info for undo functionality
let lastAction = null;
let lastTask = null;
let lastCompleted = null;
let lastIndex = null;

// for clear all
let lastTasks = [];
let lastCompletedList = [];

document.getElementById('addTaskBtn').addEventListener('click', function () {
    //get the value of the input field
    let taskInput = document.getElementById('taskInput').value
    //check if input field is empty
    if (taskInput.trim() !== '') {
        //add task to the array
        tasks.push(taskInput);
        completed.push(false);
        activeTasks++;
        totalTasks++;
        //clear input field value
        document.getElementById('taskInput').value = ''
        // update task list display
        displayTasks()
        // update task counters
        document.getElementById('activeTasks').textContent = activeTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
        updateProgressBar();
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
                onclick="toggleTask(${index}, this)">
                ${btnIcon}
            </button>
        `;
        //append the list item to the task list in the HTML
        taskList.appendChild(li)
    });
}

function updateProgressBar() {
    let progressBar = document.getElementById('progressBar');
    let progress = document.getElementById('progress');
    let percentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
    // ensure percentage doesn't exceed 100%
    percentage = Math.min(percentage, 100);
    progressBar.style.width = percentage + '%';
    progress.textContent = Math.round(percentage) + '%';
}
// this is not working im gonna crash out

function toggleTask(index, button) {

    if (!completed[index]) {
        // SAVE before changing
        lastAction = 'complete';
        lastIndex = index;

        completed[index] = true;
        completedTasks++;
        displayTasks();
        document.getElementById('completedTasks').textContent = completedTasks;
        updateProgressBar();
    } else {
        const li = button.closest('li');

        // save before deleting
        lastAction = 'delete';
        lastTask = tasks[index];
        lastCompleted = completed[index];
        lastIndex = index;

        // animate
        li.classList.add('removing');

        setTimeout(() => {
            tasks.splice(index, 1);
            completed.splice(index, 1);
            displayTasks();
        }, 300);
        activeTasks--;
        document.getElementById('activeTasks').textContent = activeTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
        // update progress bar
        updateProgressBar();
    }
}

// old removeTask function without animation
/* function removeTask(index) {
    //remove task from the array using the index
    tasks.splice(index, 1);
    //update task list display
    displayTasks();
} */

document.getElementById('clearTaskBtn').addEventListener('click', function () {
    // SAVE everything before clearing
    lastTotalTasks = totalTasks;
    lastAction = 'clear';
    lastTasks = [...tasks];
    lastCompletedList = [...completed];

    //clear the task arrays
    tasks = [];
    completed = [];
    //update task list display
    displayTasks();
    // reset task counters
    totalTasks = 0;
    activeTasks = 0;
    completedTasks = 0;
    document.getElementById('activeTasks').textContent = activeTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
    // reset progress bar
    updateProgressBar();
});

document.getElementById('undoBtn').addEventListener('click', function () {

    if (!lastAction) return;

    if (lastAction === 'complete') {
        // undo completion
        completed[lastIndex] = false;
        completedTasks--;
        document.getElementById('completedTasks').textContent = completedTasks;
        // update progress bar
        updateProgressBar();
    }

    else if (lastAction === 'delete') {
        // restore deleted task
        tasks.splice(lastIndex, 0, lastTask);
        completed.splice(lastIndex, 0, lastCompleted);
        activeTasks++;
        if (lastCompleted) completedTasks++;
        document.getElementById('activeTasks').textContent = activeTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
        // update progress bar
        updateProgressBar();
    }

    else if (lastAction === 'clear') {
        // restore full list
        tasks = [...lastTasks];
        completed = [...lastCompletedList];
        activeTasks = tasks.length;
        completedTasks = completed.filter(c => c).length; // count how many were completed
        totalTasks = lastTotalTasks; // restore total tasks
        document.getElementById('activeTasks').textContent = activeTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
        // reset progress bar
        updateProgressBar();
    }

    // reset undo so it only works once
    lastAction = null;

    displayTasks();
});

// ok so the progress bar still sucks and does not work and i am about to throw my computer out the window