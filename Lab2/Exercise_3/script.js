const taskNameInput = document.getElementById("taskName");
const addTaskBtn = document.getElementById("addTaskBtn");
const columns = document.querySelectorAll(".column");
const statusMessage = document.getElementById("statusMessage");

let taskIdCounter = 0;

// Add new task card
addTaskBtn.addEventListener("click", () => {
  const name = taskNameInput.value.trim();
  if (!name) return;

  const taskCard = createTaskCard(name);
  document.getElementById("todo").appendChild(taskCard);
  taskNameInput.value = "";
});

// Create a draggable task card with name + current date
function createTaskCard(name) {
  const card = document.createElement("div");
  card.className = "task-card";
  card.draggable = true;
  card.id = "task-" + taskIdCounter++;

  const dateStr = new Date().toLocaleDateString();

  card.innerHTML = `
    <strong>${name}</strong><br />
    <small>${dateStr}</small>
  `;

  card.addEventListener("dragstart", dragStart);
  card.addEventListener("dragend", dragEnd);

  return card;
}

// Drag & drop handlers
let draggedElement = null;

function dragStart(e) {
  draggedElement = this;
  e.dataTransfer.setData("text/plain", this.id);
}

function dragEnd() {
  draggedElement = null;
  columns.forEach(col => col.classList.remove("drag-over"));
}

columns.forEach(column => {
  column.addEventListener("dragover", e => {
    e.preventDefault();
  });

  column.addEventListener("dragenter", e => {
    e.preventDefault();
    column.classList.add("drag-over");
  });

  column.addEventListener("dragleave", () => {
    column.classList.remove("drag-over");
  });

  column.addEventListener("drop", e => {
    e.preventDefault();
    column.classList.remove("drag-over");

    const id = e.dataTransfer.getData("text/plain");
    const taskCard = document.getElementById(id);
    if (!taskCard) return;

    column.appendChild(taskCard);

    if (column.id === "completed") {
      taskCard.classList.add("completed");
      statusMessage.textContent = "Task Completed Successfully";
      setTimeout(() => (statusMessage.textContent = ""), 2000);
    } else {
      taskCard.classList.remove("completed");
    }
  });
});
