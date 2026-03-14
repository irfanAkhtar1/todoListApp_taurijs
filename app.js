document.addEventListener("DOMContentLoaded", async function() {

  const { getCurrentWindow, LogicalPosition } = window.__TAURI__.window;
  const appWindow = getCurrentWindow();

  // --- RESTORE WINDOW POSITION ON LOAD ---
  const savedPos = JSON.parse(localStorage.getItem("windowPos") || "{}");
  if (savedPos.x !== undefined && savedPos.y !== undefined) {
    await appWindow.setPosition(new LogicalPosition(savedPos.x, savedPos.y));
  }

  // --- SET POSITION BUTTON ---
  const posXInput = document.getElementById("posX");
  const posYInput = document.getElementById("posY");
  const setPosBtn = document.getElementById("setPosBtn");

  // Load saved pos into inputs
  if (posXInput && posYInput && savedPos.x !== undefined) {
    posXInput.value = savedPos.x;
    posYInput.value = savedPos.y;
  }

  if (setPosBtn) {
    setPosBtn.addEventListener("click", async () => {
      const x = parseInt(posXInput.value) || 0;
      const y = parseInt(posYInput.value) || 0;
      localStorage.setItem("windowPos", JSON.stringify({ x, y }));
      await appWindow.setPosition(new LogicalPosition(x, y));
      alert("Position saved!");
    });
  }

  // --- THEME HANDLING ---
  function applyTheme() {
    const theme = JSON.parse(localStorage.getItem("theme") || "{}");

    if (theme.fontColor) {
      document.querySelectorAll(".mainTask, h1, h3, span, label").forEach(el => {
        el.style.color = theme.fontColor;
      });
    }

    if (theme.barColor1 && theme.barColor2) {
      document.querySelectorAll(".progressValue").forEach(el => {
        el.style.background = `linear-gradient(270deg, ${theme.barColor1}, ${theme.barColor2})`;
      });
    }

    if (theme.checkColor) {
      document.querySelectorAll("input[type='checkbox']").forEach(el => {
        el.style.backgroundColor = el.checked ? theme.checkColor : "transparent";
        el.style.border = `2px solid ${theme.checkColor}`;
      });
    }

    if (theme.opacity) {
      document.body.style.opacity = theme.opacity / 100;
    }
  }

  applyTheme();

  // --- SETTINGS PAGE: Save Theme ---
  const colorBtn = document.querySelector(".SetColorBtn");
  const fontColor = document.querySelector(".fontColor");
  const barColor1 = document.querySelector(".barColor1");
  const barColor2 = document.querySelector(".barColor2");
  const checkColor = document.querySelector(".checkColor");
  const opacitySlider = document.getElementById("opacity");
  const opacityValue = document.getElementById("opacity-value");

  if (opacitySlider && opacityValue) {
    opacitySlider.addEventListener("input", () => {
      opacityValue.textContent = opacitySlider.value + "%";
    });
  }

  if (colorBtn && fontColor && barColor1 && barColor2 && checkColor && opacitySlider) {
    colorBtn.addEventListener("click", () => {
      const theme = {
        fontColor: fontColor.value,
        barColor1: barColor1.value,
        barColor2: barColor2.value,
        checkColor: checkColor.value,
        opacity: opacitySlider.value
      };
      localStorage.setItem("theme", JSON.stringify(theme));
      applyTheme();
      alert("Theme saved!");
    });

    const savedTheme = JSON.parse(localStorage.getItem("theme") || "{}");
    if (savedTheme.fontColor) fontColor.value = savedTheme.fontColor;
    if (savedTheme.barColor1) barColor1.value = savedTheme.barColor1;
    if (savedTheme.barColor2) barColor2.value = savedTheme.barColor2;
    if (savedTheme.checkColor) checkColor.value = savedTheme.checkColor;
    if (savedTheme.opacity) {
      opacitySlider.value = savedTheme.opacity;
      opacityValue.textContent = savedTheme.opacity + "%";
    }
  }

  // --- NAVIGATION ---
  const lockToggle = document.getElementById("lockToggle");
  let isLocked = false;

  if (lockToggle) {
    lockToggle.addEventListener("click", async () => {
      isLocked = !isLocked;
      const dragRegion = document.querySelector(".drag");
      if (dragRegion) dragRegion.style.webkitAppRegion = isLocked ? "no-drag" : "drag";
      lockToggle.textContent = isLocked ? "🔒 Locked" : "🔓 Lock Position";
      await appWindow.setResizable(!isLocked);
    });
  }

  const borderBtn = document.querySelector(".borderBtn");
  let borderOn = true;
  if (borderBtn) {
    borderBtn.addEventListener("click", () => {
      document.body.style.border = borderOn ? "none" : "1px solid rgba(255,255,255,0.2)";
      borderOn = !borderOn;
    });
  }

  const setBtn = document.querySelector(".setting");
  if (setBtn) setBtn.addEventListener("click", () => window.location.href = "setting.html");

  const backBtn = document.querySelector(".back");
  if (backBtn) backBtn.addEventListener("click", () => window.location.href = "index.html");

  // --- ADD TASK ---
  const addBtn = document.querySelector(".add");
  const addTaskForm = document.getElementById("addTaskForm");
  const saveTaskBtn = document.getElementById("saveTaskBtn");

  if (addBtn) addBtn.addEventListener("click", () => { if (addTaskForm) addTaskForm.style.display = "block"; });

  if (saveTaskBtn) {
    saveTaskBtn.addEventListener("click", () => {
      const mainTaskInput = document.getElementById("mainTaskInput");
      const subTasksInput = document.getElementById("subTasksInput");
      if (!mainTaskInput || !subTasksInput) return;

      const mainTask = mainTaskInput.value.trim();
      const subTasksRaw = subTasksInput.value.trim();

      if (mainTask === "") { alert("Please enter a main task."); return; }

      const subTasks = subTasksRaw
        ? subTasksRaw.split(",").map(t => ({ text: t.trim(), done: false }))
        : [];

      let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      tasks.push({ main: mainTask, subtasks: subTasks });
      localStorage.setItem("tasks", JSON.stringify(tasks));

      mainTaskInput.value = "";
      subTasksInput.value = "";
      if (addTaskForm) addTaskForm.style.display = "none";
      alert("Task added!");
      location.reload();
    });
  }

  // --- EDIT/DELETE TASK ---
  const editBtn = document.querySelector(".edit");
  const editForm = document.getElementById("editTaskForm");
  const taskSelector = document.getElementById("taskSelector");
  const editMain = document.getElementById("editMainTask");
  const editSubs = document.getElementById("editSubTasks");
  const updateTaskBtn = document.getElementById("updateTaskBtn");
  const deleteTaskBtn = document.getElementById("deleteTaskBtn");

  const refreshTaskSelector = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    if (!taskSelector || !editMain || !editSubs) return;
    taskSelector.innerHTML = "";
    tasks.forEach((t, i) => {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = t.main;
      taskSelector.appendChild(opt);
    });
    if (tasks.length) {
      editMain.value = tasks[0].main;
      editSubs.value = tasks[0].subtasks.map(s => s.text).join(", ");
    }
  };

  if (editBtn) {
    editBtn.addEventListener("click", () => {
      const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      if (!tasks.length) return alert("No tasks to edit.");
      if (!editForm) return;
      refreshTaskSelector();
      editForm.style.display = "block";
    });
  }

  if (taskSelector) {
    taskSelector.addEventListener("change", () => {
      const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      const index = +taskSelector.value;
      const task = tasks[index];
      if (!task) return;
      editMain.value = task.main;
      editSubs.value = task.subtasks.map(s => s.text).join(", ");
    });
  }

  if (updateTaskBtn) {
    updateTaskBtn.addEventListener("click", () => {
      const index = +taskSelector.value;
      let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      if (!tasks[index]) return;

      const newMain = editMain.value.trim();
      const newSubsRaw = editSubs.value.trim();
      if (!newMain) { alert("Main task cannot be empty."); return; }

      const oldSubtasks = tasks[index].subtasks;
      tasks[index].main = newMain;
      tasks[index].subtasks = newSubsRaw
        ? newSubsRaw.split(",").map((t, i) => ({ text: t.trim(), done: oldSubtasks[i] ? oldSubtasks[i].done : false }))
        : [];

      localStorage.setItem("tasks", JSON.stringify(tasks));
      alert("Task updated!");
      if (editForm) editForm.style.display = "none";
      location.reload();
    });
  }

  if (deleteTaskBtn) {
    deleteTaskBtn.addEventListener("click", () => {
      const index = +taskSelector.value;
      let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      if (!tasks[index]) return;
      if (!confirm("Are you sure you want to delete this task?")) return;

      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      alert("Task deleted!");
      if (editForm) editForm.style.display = "none";
      location.reload();
    });
  }

  // --- LOAD TASKS ON INDEX.HTML ---
  if (!window.location.pathname.endsWith("setting.html")) {
    const container = document.querySelector(".container");
    if (!container) return;

    let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    if (!tasks.length) { container.innerHTML = "<p>No tasks found.</p>"; return; }

    tasks.forEach((task, i) => {
      const taskRow = document.createElement("div");
      taskRow.className = "taskRow";

      const mainTitle = document.createElement("h1");
      mainTitle.className = "mainTask";
      mainTitle.textContent = task.main;

      const progress = document.createElement("div");
      progress.className = "progress";

      const progressValue = document.createElement("div");
      progressValue.className = "progressValue";

      const progressText = document.createElement("span");
      progressText.className = "progressText";

      progressValue.appendChild(progressText);
      progress.appendChild(progressValue);
      taskRow.appendChild(mainTitle);
      taskRow.appendChild(progress);
      container.appendChild(taskRow);

      const subList = document.createElement("ul");
      subList.className = "subTasksList";

      task.subtasks.forEach((sub, j) => {
        const li = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = sub.done;

        checkbox.addEventListener("change", () => {
          let allTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
          allTasks[i].subtasks[j].done = checkbox.checked;
          localStorage.setItem("tasks", JSON.stringify(allTasks));
          updateProgress(allTasks[i], progressText, progressValue);
          applyTheme();
        });

        const label = document.createElement("span");
        label.textContent = " " + sub.text;

        li.appendChild(checkbox);
        li.appendChild(label);
        subList.appendChild(li);
      });

      if (!task.subtasks.length) {
        li.textContent = "No subtasks";
        subList.appendChild(li);
      }

      container.appendChild(subList);
      updateProgress(task, progressText, progressValue);
    });

    applyTheme();
  }

  function updateProgress(task, progressText, progressBar) {
    const done = task.subtasks.filter(s => s.done).length;
    const total = task.subtasks.length || 1;
    const percent = Math.round((done / total) * 100);
    if (progressText) progressText.textContent = percent + "%";
    if (progressBar) progressBar.style.width = percent + "%";
  }
});
