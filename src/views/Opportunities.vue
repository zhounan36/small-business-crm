<template>
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">商机</h1>
        <button @click="openAddModal" class="btn-primary">
          添加商机
        </button>
      </div>
  
      <!-- Opportunity List -->
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-dark-200">
            <thead>
              <tr>
                <th class="table-header">名称</th>
                <th class="table-header">阶段</th>
                <th class="table-header">优先级</th>
                <th class="table-header">价值</th>
                <th class="table-header text-right">操作</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-dark-100 divide-y divide-gray-200 dark:divide-dark-200">
              <tr v-for="opportunity in filteredOpportunities" :key="opportunity.id" class="hover:bg-gray-50 dark:hover:bg-dark-200 transition-colors duration-200">
                <td class="table-cell font-medium">{{ opportunity.name }}</td>
                <td class="table-cell">
                  <span :class="getStageClass(opportunity.stage)" class="badge">{{ getStageTranslation(opportunity.stage) }}</span>
                </td>
                <td class="table-cell">
                  <span :class="getPriorityClass(opportunity.priority)" class="badge">{{ getPriorityTranslation(opportunity.priority) }}</span>
                </td>
                <td class="table-cell">￥{{ opportunity.value.toFixed(2) }}</td>
                <td class="table-cell text-right">
                  <button @click="openEditModal(opportunity)" class="text-violet-600 hover:text-violet-700 font-medium mr-3">
                    编辑
                  </button>
                  <button @click="deleteOpportunity(opportunity.id)" class="text-red-600 hover:text-red-700 font-medium">
                    删除
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
                    {{ editingOpportunity ? '编辑商机' : '添加新商机' }}
                  </DialogTitle>
  
                  <form @submit.prevent="saveOpportunity" class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">名称</label>
                      <input type="text" v-model="opportunityForm.name" required class="input-field" />
                    </div>
  
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">阶段</label>
                      <select v-model="opportunityForm.stage" required class="input-field">
                        <option value="new">新建</option>
                        <option value="negotiation">洽谈中</option>
                        <option value="won">已成交</option>
                        <option value="lost">已丢失</option>
                      </select>
                    </div>
  
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">优先级</label>
                      <select v-model="opportunityForm.priority" required class="input-field">
                        <option value="low">低</option>
                        <option value="medium">中</option>
                        <option value="high">高</option>
                      </select>
                    </div>
  
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">价值</label>
                      <input type="number" v-model="opportunityForm.value" required min="0" step="0.01" class="input-field" />
                    </div>
  
                    <div class="mt-6 flex justify-end space-x-3">
                      <button type="button" @click="closeModal" class="btn-secondary">
                        取消
                      </button>
                      <button type="submit" class="btn-primary">
                        {{ editingOpportunity ? '更新' : '添加' }}
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

  // 添加阶段和优先级的翻译函数
  const getStageTranslation = (stage) => {
    switch (stage) {
      case 'new': return '新建'
      case 'negotiation': return '洽谈中'
      case 'won': return '已成交'
      case 'lost': return '已丢失'
      default: return stage
    }
  }
  
  const getPriorityTranslation = (priority) => {
    switch (priority) {
      case 'low': return '低'
      case 'medium': return '中'
      case 'high': return '高'
      default: return priority
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
    if (confirm('确定要删除这个商机吗？')) {
      opportunitiesStore.deleteOpportunity(id)
    }
  }
  </script>
  
  <style scoped>
  /* Add styles for modal and other UI elements */
  </style>
