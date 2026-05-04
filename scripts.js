let tasks = []; //empty array to store tasks
let completed = []; //empty array to store completed tasks
let history = []; // stores a snapshot of the site's state before each action for undo functionality

let totalTasksEver = 0; // variable to store total tasks ever added, for stats and progress bar calculations
let totalCompletedEver = 0; // variable to store total tasks ever completed, for stats and progress bar calculations

// variables to store last action info for undo functionality
let lastAction = null;
let lastTask = null;
let lastCompleted = null;
let lastIndex = null;

// for clear all
let lastTasks = [];
let lastCompletedList = [];

// helper state functions

function getCompletedCount() {
    return completed.filter(Boolean).length;
}

function getActiveCount() {
    return tasks.length;
}

function saveState() {
    // object literal that stores the current state of everything
    history.push({
        tasks: [...tasks], // spread operators so it doesn't store any references
        completed: [...completed],
        totalTasksEver,
        totalCompletedEver,
    });
}

document.getElementById("addTaskBtn").addEventListener("click", () => {
    const input = document.getElementById("taskInput");
    const value = input.value;

    if (value.trim() === "") return;

    saveState();

    tasks.push(value);
    completed.push(false);
    totalTasksEver++;

    input.value = "";

    displayTasks();
    updateProgressBar();
    updateStats();
    saveToLocalStorage();
});

document.getElementById("taskInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        document.getElementById("addTaskBtn").click();
    }
});

function displayTasks() {
    let taskList = document.getElementById("taskList");
    let emptyState = document.getElementById("emptyState");

    taskList.innerHTML = "";

    if (tasks.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }
    tasks.forEach((task, index) => {
        // create <li> element for each task
        let li = document.createElement("li");
        // add styling
        li.classList.add(
            "list-group-item",
            "d-flex",
            "justify-content-between",
            "align-items-center",
        );
        if (completed[index]) {
            li.classList.add("completed");
        }
        let btnIcon = completed[index] ? "✕" : "✓";
        let btnClass = completed[index] ? "btn-danger" : "btn-success";
        li.innerHTML = `
           <span class="${completed[index] ? "text-decoration-line-through" : ""}">
               ${task}
           </span>

           <button class="btn ${btnClass} btn-sm"
               onclick="toggleTask(${index}, this)">
               ${btnIcon}
           </button>
       `;
        taskList.appendChild(li);
        updateStats();
    });
}

function updateStats() {
    document.getElementById("activeTasks").textContent =
        tasks.length - getCompletedCount();
    document.getElementById("completedTasks").textContent = totalCompletedEver;
}

function updateProgressBar() {
    const progressBar = document.getElementById("progressBar");
    const progress = document.getElementById("progress");

    const percentage =
        totalTasksEver === 0 ? 0 : (totalCompletedEver / totalTasksEver) * 100;

    progressBar.style.width = `${percentage}%`;
    progress.textContent = `${Math.round(percentage)}%`;
}

function toggleTask(index, button) {
    const li = button.closest("li"); // thank you w3schools for teaching me closest. link: https://www.w3schools.com/jsref/met_element_closest.asp
    if (completed[index]) {
        saveState();

        li.classList.add("removing");

        setTimeout(() => {
            tasks.splice(index, 1);
            completed.splice(index, 1);
            displayTasks();
            updateProgressBar();
        }, 300);
    } else {
        saveState();
        completed[index] = true;
        totalCompletedEver++;
        displayTasks();
        updateProgressBar();
        updateStats();
        saveToLocalStorage();
    }
}

document.getElementById("clearTaskBtn").addEventListener("click", () => {
    saveState();

    tasks = [];
    completed = [];
    totalTasksEver = 0;
    totalCompletedEver = 0;

    displayTasks();
    updateProgressBar();
    updateStats();
    saveToLocalStorage();
});

// AI helped with this, I just thought it'd be cool to add an undo button if the user clicked something accidentally
document.getElementById("undoBtn").addEventListener("click", undo);

function undo() {
    if (history.length === 0) return;

    const previous = history.pop();

    tasks = previous.tasks;
    completed = previous.completed;
    totalTasksEver = previous.totalTasksEver;
    totalCompletedEver = previous.totalCompletedEver;

    displayTasks();
    updateProgressBar();
    updateStats();
    saveToLocalStorage();
}
// end of AI code

// local storage code, also AI helped with this, I just wanted the site to remember your tasks if you accidentally close the tab or refresh

function saveToLocalStorage() {
    const data = {
        tasks,
        completed,
        totalTasksEver,
        totalCompletedEver
    };

    localStorage.setItem('todoApp', JSON.stringify(data));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('todoApp');

    if (!saved) return;

    const data = JSON.parse(saved);

    tasks = data.tasks || [];
    completed = data.completed || [];
    totalTasksEver = data.totalTasksEver || 0;
    totalCompletedEver = data.totalCompletedEver || 0;

    displayTasks();
    updateStats();
    updateProgressBar();
}

loadFromLocalStorage();