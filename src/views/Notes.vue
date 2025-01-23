<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Notes</h1>
      <button @click="showAddModal = true" class="btn-primary">
        Add Note
      </button>
    </div>

    <!-- Notes Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="note in notesStore.notes" 
           :key="note.id"
           :class="[note.color, 'group relative p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer']"
           @click="editNote(note)">
        <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button @click.stop="deleteNote(note.id)" 
                  class="p-1 hover:bg-black/10 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" 
                 class="h-4 w-4 text-gray-600 dark:text-gray-400" 
                 viewBox="0 0 20 20" 
                 fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-2">{{ note.title }}</h3>
        <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{{ note.content }}</p>
        <p class="mt-4 text-xs text-gray-500 dark:text-gray-400">
          {{ formatDate(note.createdAt) }}
        </p>
      </div>

      <!-- Empty State -->
      <div v-if="notesStore.notes.length === 0" 
           class="col-span-full text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" 
             class="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" 
             fill="none" 
             viewBox="0 0 24 24" 
             stroke="currentColor">
          <path stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-gray-500 dark:text-gray-400">No notes yet. Click "Add Note" to create one.</p>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <TransitionRoot appear :show="showAddModal" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-10">
        <TransitionChild
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              enter="ease-out duration-300"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-dark-100 p-6 shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  {{ editingNote ? 'Edit Note' : 'Add New Note' }}
                </DialogTitle>

                <form @submit.prevent="saveNote" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                    <input type="text" v-model="noteForm.title" required class="input-field">
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
                    <textarea v-model="noteForm.content" 
                              rows="6" 
                              required 
                              class="input-field"></textarea>
                  </div>

                  <div class="mt-6 flex justify-end space-x-3">
                    <button type="button" @click="closeModal" class="btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" class="btn-primary">
                      {{ editingNote ? 'Update' : 'Add' }}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useNotesStore } from '../stores/notes'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

const notesStore = useNotesStore()
const showAddModal = ref(false)
const editingNote = ref(null)

const noteForm = ref({
  title: '',
  content: ''
})

const editNote = (note) => {
  editingNote.value = note
  noteForm.value = { ...note }
  showAddModal.value = true
}

const deleteNote = (id) => {
  if (confirm('Are you sure you want to delete this note?')) {
    notesStore.deleteNote(id)
  }
}

const saveNote = () => {
  if (editingNote.value) {
    notesStore.updateNote(editingNote.value.id, noteForm.value)
  } else {
    notesStore.addNote(noteForm.value)
  }
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  editingNote.value = null
  noteForm.value = {
    title: '',
    content: ''
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}
</script>