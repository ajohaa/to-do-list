let tasks = [] //empty array to store tasks

document.getElementById('addTaskBtn').addEventListener('click', function () {
    //get the value of the input field
    let taskInput = document.getElementById('taskInput').value
    //check if input field is empty
    if (taskInput) {
        //add task to the array
        tasks.push(taskInput)
        //clear input field value
        document.getElementById('taskInput').value = ''
        // update task list display
        displayTasks()
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
        )
        //set innerHTML of the list with a task and remove button
        li.innerHTML = `${task} <button class='btn btn-success btn-sm' onclick='removeTask(${index})'>complete ✓</button>`
        //append the list item to the task list in the HTML
        taskList.appendChild(li)
    })
}

function removeTask(index) {
    //remove task from the array using the index
    tasks.splice(index, 1);
    //update task list display
    displayTasks();
}

document.getElementById('clearTaskBtn').addEventListener('click', function () {
    //clear the task array
    tasks = [];
    //update task list display
    displayTasks();
});