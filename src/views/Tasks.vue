<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">任务</h1>
      <button @click="showAddModal = true" class="btn-primary">
        添加任务
      </button>
    </div>

    <!-- Task List -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Pending Tasks -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">待办任务</h2>
        <div class="space-y-4">
          <div v-for="task in tasksStore.pendingTasks" :key="task.id" 
               class="group flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <input type="checkbox" 
                   :checked="task.completed"
                   @change="toggleTask(task)"
                   class="mt-1.5 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500">
            <div class="flex-grow ml-3">
              <div class="flex justify-between items-start">
                <div>
                  <p class="font-medium text-gray-900">{{ task.title }}</p>
                  <p class="text-sm text-gray-600 mt-1">截止日期: {{ formatDate(task.dueDate) }}</p>
                  <p class="text-sm text-gray-600 mt-1">{{ task.description }}</p>
                  <p v-if="task.contact" class="text-sm text-gray-500 mt-1">
                    联系人: {{ task.contact }}
                  </p>
                </div>
                <div class="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button @click="editTask(task)" 
                          class="text-blue-600 hover:text-blue-800 font-medium">
                    编辑
                  </button>
                  <button @click="deleteTask(task.id)" 
                          class="text-red-600 hover:text-red-800 font-medium">
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-if="tasksStore.pendingTasks.length === 0" 
               class="text-center py-8 text-gray-500">
            没有待办任务
          </div>
        </div>
      </div>

      <!-- Completed Tasks -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">已完成任务</h2>
        <div class="space-y-4">
          <div v-for="task in tasksStore.completedTasks" :key="task.id" 
               class="group flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <input type="checkbox" 
                   :checked="task.completed"
                   @change="toggleTask(task)"
                   class="mt-1.5 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500">
            <div class="flex-grow ml-3">
              <div class="flex justify-between items-start">
                <div>
                  <p class="font-medium text-gray-500 line-through">{{ task.title }}</p>
                  <p class="text-sm text-gray-500 mt-1">完成时间: {{ formatDate(task.completedAt) }}</p>
                </div>
                <button @click="deleteTask(task.id)" 
                        class="text-red-600 hover:text-red-800 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  删除
                </button>
              </div>
            </div>
          </div>
          <div v-if="tasksStore.completedTasks.length === 0" 
               class="text-center py-8 text-gray-500">
            没有已完成任务
          </div>
        </div>
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
              enter=" ease-out duration-300"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-semibold text-gray-900 mb-6">
                  {{ editingTask ? '编辑任务' : '添加新任务' }}
                </DialogTitle>

                <form @submit.prevent="saveTask" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">标题</label>
                    <input type="text" v-model="taskForm.title" required class="input-field">
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
                    <textarea v-model="taskForm.description" rows="3" class="input-field"></textarea>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">截止日期</label>
                    <input type="date" v-model="taskForm.dueDate" required class="input-field">
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">相关联系人</label>
                    <select v-model="taskForm.contact" class="input-field">
                      <option value="">无</option>
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
                      {{ editingTask ? '更新' : '添加' }}
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
import { useTasksStore } from '../stores/tasks'
import { useContactsStore } from '../stores/contacts'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

const tasksStore = useTasksStore()
const contactsStore = useContactsStore()
const showAddModal = ref(false)
const editingTask = ref(null)
const taskForm = ref({
  title: '',
  description: '',
  dueDate: '',
  contact: '',
  completed: false
})

const toggleTask = (task) => {
  const now = new Date().toISOString()
  tasksStore.updateTask(task.id, { 
    completed: !task.completed,
    completedAt: !task.completed ? now : null
  })
}

const editTask = (task) => {
  editingTask.value = task
  taskForm.value = { ...task }
  showAddModal.value = true
}

const deleteTask = (id) => {
  if (confirm('确定要删除这个任务吗？')) {
    tasksStore.deleteTask(id)
  }
}

const saveTask = () => {
  if (editingTask.value) {
    tasksStore.updateTask(editingTask.value.id, taskForm.value)
  } else {
    tasksStore.addTask(taskForm.value)
  }
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  editingTask.value = null
  taskForm.value = {
    title: '',
    description: '',
    dueDate: '',
    contact: '',
    completed: false
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}
</script>