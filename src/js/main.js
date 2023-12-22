//Time
setInterval(() => {
  updateClock();
}, 1000);

function updateClock() {
  const currentTime = new Date(),
    hrs = document.querySelector("#hrs"),
    min = document.querySelector("#min"),
    sec = document.querySelector("#sec"),
    apm = document.querySelector("#apm");

  let hours = currentTime.getHours();
  let minutes = currentTime.getMinutes();
  let seconds = currentTime.getSeconds();

  if (hours >= 12) {
    apm.textContent = "PM";
    if (hours > 12) {
      hours -= 12;
    }
  } else {
    apm.textContent = "AM";
    if (hours == 0) {
      hours = 12;
    }
  }
  hrs.textContent = addLeadingZeros(hours);
  min.textContent = addLeadingZeros(minutes);
  sec.textContent = addLeadingZeros(seconds);

  function addLeadingZeros(n) {
    return n.toString().padStart(2, "0");
    // return n < 10 ? "0" + n : n;
  }
}

// Get Advice
const getAdviceBtn = document.querySelector("#get-advice");
getAdviceBtn.addEventListener("click", getAdvice);
async function getAdvice() {
  const response = await fetch("https://api.adviceslip.com/advice");
  if (!response.ok) throw new Error(response);
  let data = await response.json();
  let advice = await data.slip.advice;
  console.log(advice);
  document.querySelector("#quote div").innerText = `"${advice}"`;
}

//  todo
let input = document.querySelector("#add-task");
let submit = document.querySelector("#add-btn");
let tasksList = document.querySelector(".tasks-list");
let myList = [];

renderTasksFromLocalStorage();

let handleSubmit = function (e) {
  e.preventDefault();
  if (!input.value) return;
  addToTasksList(input.value);
  input.value = "";
};
tasksList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-task")) {
    const taskId = parseInt(e.target.getAttribute("data-id"));
    myList = myList.filter((task) => task.id !== taskId);
    addToPage(myList);
    addToLocalStorage(myList);
  }
});
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-all")) {
    const confirmed = window.confirm(
      "Are you sure you want to delete all items"
    );
    if (confirmed) {
      myList = [];
      addToPage(myList);
      addToLocalStorage(myList);
    }
  }
 
});

function addToTasksList(taskText) {
  const task = {
    id: Date.now(),
    title: taskText,
    completed: false,
  };
  myList = [...myList, task];
  addToPage(myList);
  addToLocalStorage(myList);
}

function addToPage(myList) {
  tasksList.innerHTML = "";
  myList.forEach((task) => {
    let li = document.createElement("li");
    li.className = "task-item";
    if (task.completed) {
      li.className = "task-item done";
    }
    li.setAttribute("data-id", task.id);
    li.innerHTML = `
      <div class="content">
        <span class="task" id="task">${task.title}</span>
      </div>
      <span class="delete-task" data-id="${task.id}">❌</span>`;
    tasksList.appendChild(li);

    li.addEventListener("click", handleContentClick);
  });
  updateProgress();
}

// Add to Local Storage
function addToLocalStorage(myList) {
  window.localStorage.setItem("tasks", JSON.stringify(myList));
}

function renderTasksFromLocalStorage() {
  let data = window.localStorage.getItem("tasks");
  if (data) {
    myList = JSON.parse(data);
    addToPage(myList);
  }
}

function handleContentClick(e) {
  const taskId = parseInt(e.target.getAttribute("data-id"));
  myList = myList.map((task) => {
    if (task.id === taskId) {
      task.completed = !task.completed;
    }
    return task;
  });

  addToPage(myList);
  addToLocalStorage(myList);
}
submit.addEventListener("click", handleSubmit);

function updateProgress() {
  const numCompleted = myList.filter((task) => task.completed).length;
  const percentCompleted = Math.round((numCompleted / myList.length) * 100);
  let footer = document.querySelector(".footer");

  if (myList.length === 0) {
    footer.innerHTML = `Start Adding Tasks to Manage Your Day ⌚`;
  } else if (percentCompleted === 100) {
    footer.innerHTML = `
      You finished All your tasks 🎉😎
    `;
  } else {
    footer.innerHTML = `
      You Have ${myList.length} task On Your List, And You Already Finished
      ${numCompleted} (${percentCompleted}%)
    `;
  }
}
