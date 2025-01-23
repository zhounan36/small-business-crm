<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Leads</h1>
      <button @click="showAddModal = true" class="btn-primary">
        Add Lead
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="dashboard-card">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Leads</h3>
        <p class="text-3xl font-bold text-violet-600 dark:text-violet-400">{{ leadsStore.totalLeads }}</p>
      </div>
      
      <div class="dashboard-card">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Active Leads</h3>
        <p class="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{{ leadsStore.activeLeads }}</p>
      </div>
      
      <div class="dashboard-card">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Conversion Rate</h3>
        <p class="text-3xl font-bold text-amber-600 dark:text-amber-400">{{ conversionRate }}%</p>
      </div>

      <div class="dashboard-card">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Avg Lead Score</h3>
        <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ averageLeadScore }}</p>
      </div>
    </div>

    <!-- Lead List -->
    <div class="card overflow-hidden">
      <div class="p-4 sm:p-6 border-b border-gray-200 dark:border-dark-200">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <!-- Filters -->
          <div class="flex items-center gap-4">
            <select v-model="filters.status" class="input-field max-w-[150px]">
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
            <select v-model="filters.source" class="input-field max-w-[150px]">
              <option value="">All Sources</option>
              <option value="direct">Direct</option>
              <option value="referral">Referral</option>
              <option value="web">Website</option>
              <option value="social">Social Media</option>
            </select>
          </div>
          <!-- Search -->
          <div class="relative">
            <input type="text" 
                   v-model="searchQuery"
                   placeholder="Search leads..."
                   class="input-field pl-10 w-full sm:w-64">
            <svg xmlns="http://www.w3.org/2000/svg" 
                 class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                 viewBox="0 0 20 20" 
                 fill="currentColor">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-dark-200">
          <thead>
            <tr>
              <th class="table-header">Name</th>
              <th class="table-header">Company</th>
              <th class="table-header">Email</th>
              <th class="table-header">Status</th>
              <th class="table-header">Source</th>
              <th class="table-header">Score</th>
              <th class="table-header text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-dark-100 divide-y divide-gray-200 dark:divide-dark-200">
            <tr v-for="lead in filteredLeads" 
                :key="lead.id"
                class="hover:bg-gray-50 dark:hover:bg-dark-200 transition-colors duration-200">
              <td class="table-cell font-medium">
                {{ lead.firstName }} {{ lead.lastName }}
              </td>
              <td class="table-cell text-gray-600 dark:text-gray-400">
                {{ lead.company || '-' }}
              </td>
              <td class="table-cell text-gray-600 dark:text-gray-400">
                {{ lead.email }}
              </td>
              <td class="table-cell">
                <span :class="getStatusClass(lead.status)" class="badge">
                  {{ lead.status }}
                </span>
              </td>
              <td class="table-cell">
                <span class="badge bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300">
                  {{ lead.source }}
                </span>
              </td>
              <td class="table-cell">
                <div class="flex items-center gap-2">
                  <div class="h-2 w-24 bg-gray-200 dark:bg-dark-200 rounded-full overflow-hidden">
                    <div class="h-full bg-violet-500" 
                         :style="{ width: `${lead.score}%` }">
                    </div>
                  </div>
                  <span class="text-sm text-gray-600 dark:text-gray-400">
                    {{ lead.score }}
                  </span>
                </div>
              </td>
              <td class="table-cell text-right">
                <button @click="convertToDeal(lead)" 
                        v-if="lead.status !== 'converted'"
                        class="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium mr-3">
                  Convert
                </button>
                <button @click="editLead(lead)" 
                        class="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium mr-3">
                  Edit
                </button>
                <button @click="deleteLead(lead.id)" 
                        class="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium">
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
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-dark-100 p-6 shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  {{ editingLead ? 'Edit Lead' : 'Add New Lead' }}
                </DialogTitle>

                <form @submit.prevent="saveLead" class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                      <input type="text" v-model="leadForm.firstName" required class="input-field">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                      <input type="text" v-model="leadForm.lastName" required class="input-field">
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input type="email" v-model="leadForm.email" required class="input-field">
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                    <input type="tel" v-model="leadForm.phone" class="input-field">
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
                    <input type="text" v-model="leadForm.company" class="input-field">
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                      <select v-model="leadForm.status" required class="input-field">
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="lost">Lost</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source</label>
                      <select v-model="leadForm.source" required class="input-field">
                        <option value="direct">Direct</option>
                        <option value="referral">Referral</option>
                        <option value="web">Website</option>
                        <option value="social">Social Media</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lead Score (0-100)</label>
                    <input type="number" v-model="leadForm.score" min="0" max="100" required class="input-field">
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                    <textarea v-model="leadForm.notes" rows="3" class="input-field"></textarea>
                  </div>

                  <div class="mt-6 flex justify-end space-x-3">
                    <button type="button" @click="closeModal" class="btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" class="btn-primary">
                      {{ editingLead ? 'Update' : 'Add' }}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Convert to Deal Modal -->
    <TransitionRoot appear :show="showConvertModal" as="template">
      <Dialog as="div" @close="closeConvertModal" class="relative z-10">
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
                  Convert Lead to Deal
                </DialogTitle>

                <form @submit.prevent="confirmConversion" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deal Value</label>
                    <input type="number" v-model="convertForm.value" min="0" step="0.01" required class="input-field">
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                    <select v-model="convertForm.priority" required class="input-field">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div class="mt-6 flex justify-end space-x-3">
                    <button type="button" @click="closeConvertModal" class="btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" class="btn-primary">
                      Convert to Deal
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
import { useLeadsStore } from '../stores/leads'
import { useDealsStore } from '../stores/deals'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

const leadsStore = useLeadsStore()
const dealsStore = useDealsStore()

const showAddModal = ref(false)
const showConvertModal = ref(false)
const editingLead = ref(null)
const convertingLead = ref(null)
const searchQuery = ref('')
const filters = ref({
  status: '',
  source: ''
})

const leadForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  status: 'new',
  source: 'direct',
  score: 0,
  notes: ''
})

const convertForm = ref({
  value: 0,
  priority: 'medium'
})

const filteredLeads = computed(() => {
  return leadsStore.leads
    .filter(lead => {
      const matchesSearch = !searchQuery.value || 
        `${lead.firstName} ${lead.lastName} ${lead.company} ${lead.email}`
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase())
      
      const matchesStatus = !filters.value.status || lead.status === filters.value.status
      const matchesSource = !filters.value.source || lead.source === filters.value.source
      
      return matchesSearch && matchesStatus && matchesSource
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const conversionRate = computed(() => {
  const converted = leadsStore.leads.filter(l => l.status === 'converted').length
  if (leadsStore.totalLeads === 0) return 0
  return Math.round((converted / leadsStore.totalLeads) * 100)
})

const averageLeadScore = computed(() => {
  if (leadsStore.leads.length === 0) return 0
  const total = leadsStore.leads.reduce((sum, lead) => sum + lead.score, 0)
  return Math.round(total / leadsStore.leads.length)
})

const getStatusClass = (status) => {
  const classes = {
    new: 'badge-new',
    contacted: 'badge-progress',
    qualified: 'badge-progress',
    converted: 'badge-won',
    lost: 'badge-lost'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const editLead = (lead) => {
  editingLead.value = lead
  leadForm.value = { ...lead }
  showAddModal.value = true
}

const deleteLead = (id) => {
  if (confirm('Are you sure you want to delete this lead?')) {
    leadsStore.deleteLead(id)
  }
}

const saveLead = () => {
  if (editingLead.value) {
    leadsStore.updateLead(editingLead.value.id, leadForm.value)
  } else {
    leadsStore.addLead(leadForm.value)
  }
  closeModal()
}

const convertToDeal = (lead) => {
  convertingLead.value = lead
  convertForm.value = {
    value: 0,
    priority: 'medium'
  }
  showConvertModal.value = true
}

const confirmConversion = () => {
  if (convertingLead.value) {
    const dealData = leadsStore.convertToDeal(convertingLead.value.id, convertForm.value)
    if (dealData) {
      dealsStore.addDeal(dealData)
    }
  }
  closeConvertModal()
}

const closeModal = () => {
  showAddModal.value = false
  editingLead.value = null
  leadForm.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    status: 'new',
    source: 'direct',
    score: 0,
    notes: ''
  }
}

const closeConvertModal = () => {
  showConvertModal.value = false
  convertingLead.value = null
  convertForm.value = {
    value: 0,
    priority: 'medium'
  }
}
</script>