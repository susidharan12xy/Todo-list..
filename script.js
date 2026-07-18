const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Display Tasks
function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        if (
            currentFilter === "active" && task.completed ||
            currentFilter === "completed" && !task.completed
        ) {
            return;
        }

        const li = document.createElement("li");
        li.className = task.completed ? "task completed" : "task";

        li.innerHTML = `
            <span>${task.text}</span>
            <div class="actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        // Toggle Complete
        li.querySelector("span").addEventListener("click", () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
        });

        // Edit Task
        li.querySelector(".edit-btn").addEventListener("click", () => {
            const newTask = prompt("Edit Task", task.text);

            if (newTask !== null && newTask.trim() !== "") {
                tasks[index].text = newTask.trim();
                saveTasks();
                renderTasks();
            }
        });

        // Delete Task
        li.querySelector(".delete-btn").addEventListener("click", () => {
            if (confirm("Delete this task?")) {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            }
        });

        taskList.appendChild(li);
    });
}

// Save to Local Storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add Task
addBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    tasks.push({
        text: text,
        completed: false
    });

    taskInput.value = "";
    saveTasks();
    renderTasks();
});

// Add with Enter Key
taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addBtn.click();
    }
});

// Filter Tasks
filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {

        filterBtns.forEach(b => b.classList.remove("active"));

        btn.classList.add("active");

        currentFilter = btn.dataset.filter;

        renderTasks();
    });
});

// Initial Load
renderTasks();