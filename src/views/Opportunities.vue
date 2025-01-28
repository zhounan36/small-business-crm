<template>
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Opportunities</h1>
        <button @click="openAddModal" class="btn-primary">
          Add Opportunity
        </button>
      </div>
  
      <!-- Opportunity List -->
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-dark-200">
            <thead>
              <tr>
                <th class="table-header">Name</th>
                <th class="table-header">Stage</th>
                <th class="table-header">Priority</th>
                <th class="table-header">Value</th>
                <th class="table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-dark-100 divide-y divide-gray-200 dark:divide-dark-200">
              <tr v-for="opportunity in filteredOpportunities" :key="opportunity.id" class="hover:bg-gray-50 dark:hover:bg-dark-200 transition-colors duration-200">
                <td class="table-cell font-medium">{{ opportunity.name }}</td>
                <td class="table-cell">
                  <span :class="getStageClass(opportunity.stage)" class="badge">{{ opportunity.stage }}</span>
                </td>
                <td class="table-cell">
                  <span :class="getPriorityClass(opportunity.priority)" class="badge">{{ opportunity.priority }}</span>
                </td>
                <td class="table-cell">${{ opportunity.value.toFixed(2) }}</td>
                <td class="table-cell text-right">
                  <button @click="openEditModal(opportunity)" class="text-violet-600 hover:text-violet-700 font-medium mr-3">
                    Edit
                  </button>
                  <button @click="deleteOpportunity(opportunity.id)" class="text-red-600 hover:text-red-700 font-medium">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- Add/Edit Opportunity Modal -->
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
                    {{ editingOpportunity ? 'Edit Opportunity' : 'Add New Opportunity' }}
                  </DialogTitle>
  
                  <form @submit.prevent="saveOpportunity" class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input type="text" v-model="opportunityForm.name" required class="input-field" />
                    </div>
  
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                      <select v-model="opportunityForm.stage" required class="input-field">
                        <option value="new">New</option>
                        <option value="negotiation">Negotiation</option>
                        <option value="won">Won</option>
                        <option value="lost">Lost</option>
                      </select>
                    </div>
  
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <select v-model="opportunityForm.priority" required class="input-field">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
  
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Value</label>
                      <input type="number" v-model="opportunityForm.value" required min="0" step="0.01" class="input-field" />
                    </div>
  
                    <div class="mt-6 flex justify-end space-x-3">
                      <button type="button" @click="closeModal" class="btn-secondary">
                        Cancel
                      </button>
                      <button type="submit" class="btn-primary">
                        {{ editingOpportunity ? 'Update' : 'Add' }}
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
  import { ref, computed } from 'vue'
  import { useOpportunitiesStore } from '../stores/opportunities'
  import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
  
  const opportunitiesStore = useOpportunitiesStore()
  const showAddModal = ref(false)
  const editingOpportunity = ref(null)
  const opportunityForm = ref({
    name: '',
    stage: 'new',
    priority: 'low',
    value: 0
  })
  
  const filters = ref({
    stage: '',
    priority: ''
  })
  
  const searchQuery = ref('')
  
  // Computed properties
  const filteredOpportunities = computed(() => {
    return opportunitiesStore.opportunities.filter(opportunity => {
      const matchesStage = filters.value.stage ? opportunity.stage === filters.value.stage : true
      const matchesPriority = filters.value.priority ? opportunity.priority === filters.value.priority : true
      const matchesSearch = searchQuery.value
        ? opportunity.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        : true
      return matchesStage && matchesPriority && matchesSearch
    })
  })
  
  const getStageClass = (stage) => {
    switch (stage) {
      case 'new':
        return 'bg-gray-300 text-gray-800'
      case 'negotiation':
        return 'bg-yellow-300 text-yellow-800'
      case 'won':
        return 'bg-green-300 text-green-800'
      case 'lost':
        return 'bg-red-300 text-red-800'
      default:
        return 'bg-gray-200 text-gray-700'
    }
  }
  
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-green-300 text-green-800'
      case 'medium':
        return 'bg-yellow-300 text-yellow-800'
      case 'high':
        return 'bg-red-300 text-red-800'
      default:
        return 'bg-gray-200 text-gray-700'
    }
  }
  
  const openAddModal = () => {
    editingOpportunity.value = null
    opportunityForm.value = { name: '', stage: 'new', priority: 'low', value: 0 }
    showAddModal.value = true
  }
  
  const openEditModal = (opportunity) => {
    editingOpportunity.value = opportunity
    opportunityForm.value = { ...opportunity }
    showAddModal.value = true
  }
  
  const closeModal = () => {
    showAddModal.value = false
    editingOpportunity.value = null
  }
  
  const saveOpportunity = () => {
    if (editingOpportunity.value) {
      opportunitiesStore.updateOpportunity(editingOpportunity.value.id, opportunityForm.value)
    } else {
      opportunitiesStore.addOpportunity(opportunityForm.value)
    }
    closeModal()
  }
  
  const deleteOpportunity = (id) => {
    if (confirm('Are you sure you want to delete this opportunity?')) {
      opportunitiesStore.deleteOpportunity(id)
    }
  }
  </script>
  
  <style scoped>
  /* Add styles for modal and other UI elements */
  </style>
  