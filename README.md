# todoApp_taurijs

A desktop todo widget I built with Tauri v2 and Vanilla JS. It sits on your desktop, fully transparent with no borders, and tracks your tasks with a clean progress bar. Built it because I wanted something minimal that actually fits my desktop aesthetic instead of some bloated app.



## What it does

- Add, edit and delete tasks
- Progress bar that shows how many tasks you've completed
- Fully customizable theme — font color, bar gradient, checkbox color, opacity
- Everything saves automatically, even after closing
- Draggable so you can put it wherever on your screen
- Custom X/Y position that remembers where you left it

---

## The buttons

All buttons are invisible by default and only show up when you hover — keeping the whole thing clean and minimal.

| Location | Button | What it does |
|----------|--------|----------|
| Top | 🔓 Lock | Locks the window so you can't accidentally move it |
| Bottom Left | ⚙ Settings | Opens settings page |
| Bottom Right | Border | Toggles a subtle border around the widget |

---

## Settings page

- Font color
- Progress bar gradient colors
- Checkbox color
- Window opacity
- Window position (X and Y) so it opens in the same spot every time

---

## Stack

- [Tauri v2](https://tauri.app/)
- Vanilla HTML, CSS, JS
- localStorage for saving everything

---

## How to install

1. Grab the `.exe` from [Releases](https://github.com/irfanAkhtar1/todoListApp_taurijs/releases/tag/installer)
2. Run it
3. Drag the widget wherever you want on your desktop
4. Hover to reveal the buttons
5. Hit ⚙ to set your theme

---

## Heads up

- Uninstalling won't clear your saved settings/tasks
- To fully reset, delete `%appdata%\com.todo-progress-app.app` manually
