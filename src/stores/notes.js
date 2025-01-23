import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export const useNotesStore = defineStore('notes', () => {
  const notes = ref(JSON.parse(localStorage.getItem('notes')) || [])

  const addNote = (note) => {
    notes.value.push({
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      color: getRandomColor(),
      ...note
    })
    saveToStorage()
  }

  const updateNote = (id, updatedNote) => {
    const index = notes.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notes.value[index] = { ...notes.value[index], ...updatedNote }
      saveToStorage()
    }
  }

  const deleteNote = (id) => {
    notes.value = notes.value.filter(n => n.id !== id)
    saveToStorage()
  }

  const saveToStorage = () => {
    localStorage.setItem('notes', JSON.stringify(notes.value))
  }

  const getRandomColor = () => {
    const colors = [
      'bg-yellow-100 dark:bg-yellow-900',
      'bg-green-100 dark:bg-green-900',
      'bg-blue-100 dark:bg-blue-900',
      'bg-pink-100 dark:bg-pink-900',
      'bg-purple-100 dark:bg-purple-900'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const recentNotes = computed(() => {
    return [...notes.value]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  })

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    recentNotes
  }
})