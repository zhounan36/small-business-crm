<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Deals</h1>
      <button @click="showAddModal = true" class="btn-primary">
        Add Deal
      </button>
    </div>

    <!-- Deal List -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="table-header">Name</th>
              <th class="table-header">Value</th>
              <th class="table-header">Status</th>
              <th class="table-header">Contact</th>
              <th class="table-header text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="deal in dealsStore.deals" :key="deal.id"
                class="hover:bg-gray-50 transition-colors duration-200">
              <td class="table-cell font-medium">{{ deal.name }}</td>
              <td class="table-cell">${{ deal.value.toLocaleString() }}</td>
              <td class="table-cell">
                <span :class="getStatusClass(deal.status)" class="badge">
                  {{ deal.status }}
                </span>
              </td>
              <td class="table-cell text-gray-600">{{ deal.contact }}</td>
              <td class="table-cell text-right">
                <button @click="editDeal(deal)" 
                        class="text-blue-600 hover:text-blue-800 font-medium mr-3">
                  Edit
                </button>
                <button @click="deleteDeal(deal.id)" 
                        class="text-red-600 hover:text-red-800 font-medium">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-semibold text-gray-900 mb-6">
                  {{ editingDeal ? 'Edit Deal' : 'Add New Deal' }}
                </DialogTitle>

                <form @submit.prevent="saveDeal" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" v-model="dealForm.name" required class="input-field">
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Value</label>
                    <input type="number" v-model="dealForm.value" required min="0" step="0.01" class="input-field">
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select v-model="dealForm.status" required class="input-field">
                      <option value="new">New</option>
                      <option value="in-progress">In Progress</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                    <select v-model="dealForm.contact" required class="input-field">
                      <option v-for="contact in contactsStore.contacts" :key="contact.id" :value="contact.name">
                        {{ contact.name }}
                      </option>
                    </select>
                  </div>

                  <div class="mt-6 flex justify-end space-x-3">
                    <button type="button" @click="closeModal" class="btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" class="btn-primary">
                      {{ editingDeal ? 'Update' : 'Add' }}
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
import { useDealsStore } from '../stores/deals'
import { useContactsStore } from '../stores/contacts'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

const dealsStore = useDealsStore()
const contactsStore = useContactsStore()
const showAddModal = ref(false)
const editingDeal = ref(null)
const dealForm = ref({
  name: '',
  value: '',
  status: 'new',
  contact: ''
})

const getStatusClass = (status) => {
  const classes = {
    new: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    won: 'bg-green-100 text-green-800',
    lost: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const editDeal = (deal) => {
  editingDeal.value = deal
  dealForm.value = { ...deal }
  showAddModal.value = true
}

const deleteDeal = (id) => {
  if (confirm('Are you sure you want to delete this deal?')) {
    dealsStore.deleteDeal(id)
  }
}

const saveDeal = () => {
  if (editingDeal.value) {
    dealsStore.updateDeal(editingDeal.value.id, dealForm.value)
  } else {
    dealsStore.addDeal(dealForm.value)
  }
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  editingDeal.value = null
  dealForm.value = {
    name: '',
    value: '',
    status: 'new',
    contact: ''
  }
}
</script>