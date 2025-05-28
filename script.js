class StudentScheduler {
  constructor () {
    this.studyTasks = this.loadTasks() || []
    this.renderTasks()
    this.setupEventListeners()
  }

  loadTasks () {
    try {
      const storedTasks = localStorage.getItem('studyTasks')
      return storedTasks ? JSON.parse(storedTasks) : null
    } catch (error) {
      console.error('Error loading tasks from local storage:', error)
      return null
    }
  }

  saveTasks (tasks) {
    try {
      localStorage.setItem('studyTasks', JSON.stringify(tasks))
    } catch (error) {
      console.error('Error saving tasks to local storage:', error)
    }
  }

  editTask(taskId) {
    const task = this.studyTasks.find(t => t.id === taskId)
    if (!task) return

    const newName = prompt('Edit task name:', task.name)
    const newDueDate = prompt('Edit due date (YYYY-MM-DD):', task.dueDate)
    const newPriority = prompt('Edit priority (Low, Medium, High):', task.priority)
    const newDuration = prompt('Edit duration:', task.duration)

    if (newName && newDueDate && newPriority && newDuration) {
      task.name = newName.trim()
      task.dueDate = newDueDate
      task.priority = newPriority
      task.duration = newDuration.trim()
      this.saveTasks(this.studyTasks)
      this.renderTasks()
    }
  }

  addTask(taskName, dueDate, priority, duration) {
    const newTask = {
      id: Date.now(),
      name: taskName,
      dueDate: dueDate,
      priority: priority,
      duration: duration,
      completed: false
    }

    this.studyTasks.push(newTask)
    this.saveTasks(this.studyTasks)
    this.renderTasks()
  }

  removeTask (taskId) {
    this.studyTasks = this.studyTasks.filter(task => task.id !== taskId)
    this.saveTasks(this.studyTasks)
    this.renderTasks()
  }

  toggleComplete (taskId) {
    this.studyTasks = this.studyTasks.map(task => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed }
      }
      return task
    })
    this.saveTasks(this.studyTasks)
    this.renderTasks()
  }
  getProgress() {
  if (this.studyTasks.length === 0) return 0;
  const completedTasks = this.studyTasks.filter(task => task.completed).length;
  return Math.round((completedTasks / this.studyTasks.length) * 100);
}


  renderTasks () {
    const taskListElement = document.getElementById('taskList')
    if (!taskListElement) {
      console.error('Task list element not found.')
      return
    }

    taskListElement.innerHTML = ''

    this.studyTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))

    this.studyTasks.forEach(task => {
      const listItem = document.createElement('li')
      listItem.className = `mb-2 py-2 px-4 rounded shadow ${task.completed ? 'bg-green-100' : 'bg-white'} flex items-center justify-between`

      const taskDetails = document.createElement('div')
      taskDetails.innerHTML = `
        <span class="${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}">${task.name}</span><br>
        <span class="text-sm text-gray-600">Due: ${task.dueDate}</span><br>
        <span class="text-sm text-blue-600">Duration: ${task.duration || 'N/A'}</span>
      `
      taskDetails.className = "flex-grow"

      listItem.appendChild(taskDetails)

      const prioritySpan = document.createElement('span')
      prioritySpan.className = `px-2 py-1 rounded-full text-xs font-semibold ${
        task.priority === 'High' ? 'bg-red-200 text-red-700'
        : task.priority === 'Medium' ? 'bg-yellow-200 text-yellow-700'
        : 'bg-green-200 text-green-700'
      }`
      prioritySpan.textContent = task.priority
      listItem.appendChild(prioritySpan)

      const completeButton = document.createElement('button')
      completeButton.textContent = task.completed ? 'Undo' : 'Complete'
      completeButton.className = `ml-2 px-3 py-1 rounded text-white ${task.completed ? 'bg-gray-500 hover:bg-gray-700' : 'bg-green-500 hover:bg-green-700'}`
      completeButton.addEventListener('click', () => this.toggleComplete(task.id))
      listItem.appendChild(completeButton)

      const editButton = document.createElement('button')
      editButton.textContent = 'Edit'
      editButton.className = 'ml-2 px-3 py-1 rounded bg-yellow-500 hover:bg-yellow-700 text-white'
      editButton.addEventListener('click', () => this.editTask(task.id))
      listItem.appendChild(editButton)

      const removeButton = document.createElement('button')
      removeButton.textContent = 'Remove'
      removeButton.className = 'ml-2 px-3 py-1 rounded bg-red-500 hover:bg-red-700 text-white'
      removeButton.addEventListener('click', () => this.removeTask(task.id))
      listItem.appendChild(removeButton)

      taskListElement.appendChild(listItem)
      const progress = this.getProgress();
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');

if (progressBar && progressText) {
  progressBar.style.width = progress + '%';
  progressText.textContent = `Progress: ${progress}%`;
}

    })
  }

  setupEventListeners () {
    const taskForm = document.getElementById('taskForm')
    if (!taskForm) {
      console.error('taskForm element not found')
      return
    }

    taskForm.addEventListener('submit', event => {
      event.preventDefault()

      const taskNameInput = document.getElementById('taskName')
      const dueDateInput = document.getElementById('dueDate')
      const priorityInput = document.getElementById('priority')
      const durationInput = document.getElementById('duration')

      if (!taskNameInput || !dueDateInput || !priorityInput || !durationInput) {
        console.error('One or more input elements not found.')
        return
      }

      const taskName = taskNameInput.value.trim()
      const dueDate = dueDateInput.value
      const priority = priorityInput.value
      const duration = durationInput.value.trim()

      if (taskName === '') {
        alert('Please enter a task name.')
        return
      }

      this.addTask(taskName, dueDate, priority, duration)

      taskNameInput.value = ''
      dueDateInput.value = ''
      priorityInput.value = 'Low'
      durationInput.value = ''
    })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const scheduler = new StudentScheduler()
  window.scheduler = scheduler
})
