<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">交易</h1>
      <button @click="showAddModal = true" class="btn-primary">
        添加交易
      </button>
    </div>

    <!-- Deal List -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="table-header">名称</th>
              <th class="table-header">价值</th>
              <th class="table-header">状态</th>
              <th class="table-header">联系人</th>
              <th class="table-header text-right">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="deal in dealsStore.deals" :key="deal.id"
                class="hover:bg-gray-50 transition-colors duration-200">
              <td class="table-cell font-medium dark:text-black">{{ deal.name }}</td>
              <td class="table-cell dark:text-black">${{ deal.value.toLocaleString() }}</td>
              <td class="table-cell dark:text-black">
                <span :class="getStatusClass(deal.status)" class="badge">
                  {{ getTranslatedStatus(deal.status) }}
                </span>
              </td>
              <td class="table-cell text-gray-600 dark:text-black">{{ deal.contact }}</td>
              <td class="table-cell text-right">
                <button @click="editDeal(deal)" 
                        class="text-blue-600 hover:text-blue-800 font-medium mr-3">
                  编辑
                </button>
                <button @click="deleteDeal(deal.id)" 
                        class="text-red-600 hover:text-red-800 font-medium">
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
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-semibold text-gray-900 mb-6">
                  {{ editingDeal ? '编辑交易' : '添加新交易' }}
                </DialogTitle>

                <form @submit.prevent="saveDeal" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">名称</label>
                    <input type="text" v-model="dealForm.name" required class="input-field">
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">价值</label>
                    <input type="number" v-model="dealForm.value" required min="0" step="0.01" class="input-field">
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">状态</label>
                    <select v-model="dealForm.status" required class="input-field">
                      <option value="new">新建</option>
                      <option value="in-progress">进行中</option>
                      <option value="won">已赢得</option>
                      <option value="lost">已失去</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">联系人</label>
                    <select v-model="dealForm.contact" required class="input-field">
                      <option v-for="contact in contactsStore.contacts" :key="contact.id" :value="contact.name">
                        {{ contact.name }}
                      </option>
                    </select>
                  </div>

                  <div class="mt-6 flex justify-end space-x-3">
                    <button type="button" @click="closeModal" class="btn-secondary">
                      取消
                    </button>
                    <button type="submit" class="btn-primary">
                      {{ editingDeal ? '更新' : '添加' }}
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

// 添加一个新函数来翻译状态文本
const getTranslatedStatus = (status) => {
  const translations = {
    'new': '新建',
    'in-progress': '进行中',
    'won': '已赢得',
    'lost': '已失去'
  }
  return translations[status] || status
}

const editDeal = (deal) => {
  editingDeal.value = deal
  dealForm.value = { ...deal }
  showAddModal.value = true
}

const deleteDeal = (id) => {
  if (confirm('您确定要删除此交易吗？')) {
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