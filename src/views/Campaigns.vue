<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">营销活动</h1>
      <button @click="showAddModal = true" class="btn-primary">
        创建营销活动
      </button>
    </div>

    <!-- Campaign Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="dashboard-card">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">活跃营销活动</h3>
        <p class="text-3xl font-bold text-violet-600 dark:text-violet-400">
          {{ campaignsStore.activeCampaigns.length }}
        </p>
      </div>
      
      <div class="dashboard-card">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">总支出</h3>
        <p class="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
          ￥{{ campaignsStore.totalSpent.toLocaleString() }}
        </p>
      </div>
      
      <div class="dashboard-card">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">总转化量</h3>
        <p class="text-3xl font-bold text-amber-600 dark:text-amber-400">
          {{ campaignsStore.totalConversions }}
        </p>
      </div>

      <div class="dashboard-card">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">平均转化成本</h3>
        <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">
          ￥{{ calculateCPC }}
        </p>
      </div>
    </div>

    <!-- Campaign List -->
    <div class="card overflow-hidden">
      <div class="p-4 sm:p-6 border-b border-gray-200 dark:border-dark-200">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <!-- Filters -->
          <div class="flex items-center gap-4">
            <select v-model="filters.status" class="input-field max-w-[150px]">
              <option value="">所有状态</option>
              <option value="draft">草稿</option>
              <option value="active">活跃</option>
              <option value="paused">暂停</option>
              <option value="completed">已完成</option>
            </select>
            <select v-model="filters.type" class="input-field max-w-[150px]">
              <option value="">所有类型</option>
              <option value="email">电子邮件</option>
              <option value="social">社交媒体</option>
              <option value="ppc">付费点击</option>
              <option value="content">内容营销</option>
            </select>
          </div>
          <!-- Search -->
          <div class="relative">
            <input type="text" 
                   v-model="searchQuery"
                   placeholder="搜索营销活动..."
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
              <th class="table-header">营销活动</th>
              <th class="table-header">类型</th>
              <th class="table-header">状态</th>
              <th class="table-header">预算</th>
              <th class="table-header">已花费</th>
              <th class="table-header">转化量</th>
              <th class="table-header text-right">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-dark-100 divide-y divide-gray-200 dark:divide-dark-200">
            <tr v-for="campaign in filteredCampaigns" 
                :key="campaign.id"
                class="hover:bg-gray-50 dark:hover:bg-dark-200 transition-colors duration-200">
              <td class="table-cell">
                <div>
                  <p class="font-medium text-gray-900 dark:text-gray-100">{{ campaign.name }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(campaign.startDate) }} - {{ formatDate(campaign.endDate) }}</p>
                </div>
              </td>
              <td class="table-cell">
                <span class="badge bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300">
                  {{ campaign.type }}
                </span>
              </td>
              <td class="table-cell">
                <span :class="getStatusClass(campaign.status)" class="badge">
                  {{ campaign.status }}
                </span>
              </td>
              <td class="table-cell text-gray-600 dark:text-gray-400">
                ￥{{ campaign.budget.toLocaleString() }}
              </td>
              <td class="table-cell text-gray-600 dark:text-gray-400">
                ￥{{ campaign.metrics.spent.toLocaleString() }}
              </td>
              <td class="table-cell">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-gray-900 dark:text-gray-100">
                    {{ campaign.metrics.conversions }}
                  </span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    ({{ calculateConversionRate(campaign) }}%)
                  </span>
                </div>
              </td>
              <td class="table-cell text-right">
                <button @click="editCampaign(campaign)" 
                        class="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium mr-3">
                  编辑
                </button>
                <button @click="deleteCampaign(campaign.id)" 
                        class="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium">
                  删除
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
                  {{ editingCampaign ? '编辑营销活动' : '创建新营销活动' }}
                </DialogTitle>

                <form @submit.prevent="saveCampaign" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">活动名称</label>
                    <input type="text" v-model="campaignForm.name" required class="input-field">
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">描述</label>
                    <textarea v-model="campaignForm.description" rows="3" class="input-field"></textarea>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">开始日期</label>
                      <input type="date" v-model="campaignForm.startDate" required class="input-field">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">结束日期</label>
                      <input type="date" v-model="campaignForm.endDate" required class="input-field">
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">类型</label>
                      <select v-model="campaignForm.type" required class="input-field">
                        <option value="email">电子邮件</option>
                        <option value="social">社交媒体</option>
                        <option value="ppc">付费点击</option>
                        <option value="content">内容营销</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">状态</label>
                      <select v-model="campaignForm.status" required class="input-field">
                        <option value="draft">草稿</option>
                        <option value="active">活跃</option>
                        <option value="paused">暂停</option>
                        <option value="completed">已完成</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">预算</label>
                    <input type="number" v-model="campaignForm.budget" min="0" step="0.01" required class="input-field">
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">总转化量</label>
                    <input type="number" v-model="campaignForm.metrics.conversions" min="0" class="input-field" />
                  </div>

                  <div class="mt-6 flex justify-end space-x-3">
                    <button type="button" @click="closeModal" class="btn-secondary">
                      取消
                    </button>
                    <button type="submit" class="btn-primary">
                      {{ editingCampaign ? '更新' : '创建' }}
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
import { useCampaignsStore } from '../stores/campaigns'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

const campaignsStore = useCampaignsStore()
const showAddModal = ref(false)
const editingCampaign = ref(null)
const searchQuery = ref('')
const filters = ref({
  status: '',
  type: ''
})

const campaignForm = ref({
  name: '',
  description: '',
  type: 'email',
  status: 'draft',
  startDate: '',
  endDate: '',
  budget: 0,
  metrics: {
    spent: 0,
    conversions: 0
  }
})

const calculateCPC = computed(() => {
  if (campaignsStore.totalConversions === 0) return 0
  return (campaignsStore.totalSpent / campaignsStore.totalConversions).toFixed(2)
})

const filteredCampaigns = computed(() => {
  return campaignsStore.campaigns
    .filter(campaign => {
      const matchesSearch = !searchQuery.value || 
        campaign.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      
      const matchesStatus = !filters.value.status || campaign.status === filters.value.status
      const matchesType = !filters.value.type || campaign.type === filters.value.type
      
      return matchesSearch && matchesStatus && matchesType
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const getStatusClass = (status) => {
  const classes = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    paused: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  }
  return classes[status]
}

const calculateConversionRate = (campaign) => {
  if (campaign.metrics.clicks === 0) return 0
  return ((campaign.metrics.conversions / campaign.metrics.clicks) * 100).toFixed(1)
}

const editCampaign = (campaign) => {
  editingCampaign.value = campaign
  campaignForm.value = { ...campaign }
  showAddModal.value = true
}

const deleteCampaign = (id) => {
  if (confirm('您确定要删除这个营销活动吗？')) {
    campaignsStore.deleteCampaign(id)
  }
}

const saveCampaign = () => {
  campaignForm.value.metrics.spent = campaignForm.value.budget
  if (editingCampaign.value) {
    campaignsStore.updateCampaign(editingCampaign.value.id, campaignForm.value)
  } else {
    campaignsStore.addCampaign(campaignForm.value)
  }
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  editingCampaign.value = null
  campaignForm.value = {
    name: '',
    description: '',
    type: 'email',
    status: 'draft',
    startDate: '',
    endDate: '',
    budget: 0,
    metrics: {
    spent: 0,
    conversions: 0
  }
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}
</script>