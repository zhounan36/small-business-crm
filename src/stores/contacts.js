import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export const useContactsStore = defineStore('contacts', () => {
  const contacts = ref(JSON.parse(localStorage.getItem('contacts')) || [])

  const addContact = (contact) => {
    contacts.value.push({
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      lastInteraction: new Date().toISOString(),
      status: 'active',
      notes: [],
      tags: [],
      ...contact
    })
    saveToStorage()
  }

  const updateContact = (id, updatedContact) => {
    const index = contacts.value.findIndex(c => c.id === id)
    if (index !== -1) {
      contacts.value[index] = { ...contacts.value[index], ...updatedContact }
      saveToStorage()
    }
  }

  const deleteContact = (id) => {
    contacts.value = contacts.value.filter(c => c.id !== id)
    saveToStorage()
  }

  const addNote = (contactId, note) => {
    const contact = contacts.value.find(c => c.id === contactId)
    if (contact) {
      contact.notes.push({
        id: uuidv4(),
        content: note,
        createdAt: new Date().toISOString()
      })
      saveToStorage()
    }
  }

  const addTag = (contactId, tag) => {
    const contact = contacts.value.find(c => c.id === contactId)
    if (contact && !contact.tags.includes(tag)) {
      contact.tags.push(tag)
      saveToStorage()
    }
  }

  const removeTag = (contactId, tag) => {
    const contact = contacts.value.find(c => c.id === contactId)
    if (contact) {
      contact.tags = contact.tags.filter(t => t !== tag)
      saveToStorage()
    }
  }

  const saveToStorage = () => {
    localStorage.setItem('contacts', JSON.stringify(contacts.value))
  }

  const totalContacts = computed(() => contacts.value.length)
  const activeContacts = computed(() => contacts.value.filter(c => c.status === 'active').length)
  const inactiveContacts = computed(() => contacts.value.filter(c => c.status === 'inactive').length)
  
  const contactsByTag = computed(() => {
    const tags = {}
    contacts.value.forEach(contact => {
      contact.tags.forEach(tag => {
        tags[tag] = (tags[tag] || 0) + 1
      })
    })
    return tags
  })

  return {
    contacts,
    addContact,
    updateContact,
    deleteContact,
    addNote,
    addTag,
    removeTag,
    totalContacts,
    activeContacts,
    inactiveContacts,
    contactsByTag
  }
})