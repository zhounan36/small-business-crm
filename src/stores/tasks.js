import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref(JSON.parse(localStorage.getItem('tasks')) || [])

  const addTask = (task) => {
    tasks.value.push({
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      completed: false,
      ...task
    })
    saveToStorage()
  }

  const updateTask = (id, updatedTask) => {
    const index = tasks.value.findIndex(t => t.id === id)
    if (index !== -1) {
      tasks.value[index] = { ...tasks.value[index], ...updatedTask }
      saveToStorage()
    }
  }

  const deleteTask = (id) => {
    tasks.value = tasks.value.filter(t => t.id !== id)
    saveToStorage()
  }

  const saveToStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks.value))
  }

  const pendingTasks = computed(() => tasks.value.filter(t => !t.completed))
  const completedTasks = computed(() => tasks.value.filter(t => t.completed))

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    pendingTasks,
    completedTasks
  }
})