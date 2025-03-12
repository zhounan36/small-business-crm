<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">联系人</h1>
      <button @click="showAddModal = true" class="btn-primary">
        添加联系人
      </button>
    </div>

    <!-- Contact List -->
    <div class="card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="table-header">名称</th>
              <th class="table-header">邮箱</th>
              <th class="table-header">电话</th>
              <th class="table-header">公司</th>
              <th class="table-header text-right">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="contact in contactsStore.contacts" :key="contact.id"
                class="hover:bg-gray-50 transition-colors duration-200">
              <td class="table-cell font-medium dark:text-black">{{ contact.name }}</td>
              <td class="table-cell text-gray-600 dark:text-black">{{ contact.email }}</td>
              <td class="table-cell text-gray-600 dark:text-black">{{ contact.phone }}</td>
              <td class="table-cell text-gray-600 dark:text-black">{{ contact.company }}</td>
              <td class="table-cell text-right">
                <button @click="editContact(contact)" 
                        class="text-blue-600 hover:text-blue-800 font-medium mr-3">
                  编辑
                </button>
                <button @click="deleteContact(contact.id)" 
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
                  {{ editingContact ? '编辑联系人' : '添加联系人' }}
                </DialogTitle>

                <form @submit.prevent="saveContact" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">名称</label>
                    <input type="text" v-model="contactForm.name" required class="input-field">
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">邮件</label>
                    <input type="email" v-model="contactForm.email" required class="input-field">
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">电话</label>
                    <input type="tel" v-model="contactForm.phone" class="input-field">
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">公司</label>
                    <input type="text" v-model="contactForm.company" class="input-field">
                  </div>

                  <div class="mt-6 flex justify-end space-x-3">
                    <button type="button" @click="closeModal" class="btn-secondary">
                      取消
                    </button>
                    <button type="submit" class="btn-primary">
                      {{ editingContact ? '更新' : '添加' }}
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
import { useContactsStore } from '../stores/contacts'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

const contactsStore = useContactsStore()
const showAddModal = ref(false)
const editingContact = ref(null)
const contactForm = ref({
  name: '',
  email: '',
  phone: '',
  company: ''
})

const editContact = (contact) => {
  editingContact.value = contact
  contactForm.value = { ...contact }
  showAddModal.value = true
}

const deleteContact = (id) => {
  if (confirm('Are you sure you want to delete this contact?')) {
    contactsStore.deleteContact(id)
  }
}

const saveContact = () => {
  if (editingContact.value) {
    contactsStore.updateContact(editingContact.value.id, contactForm.value)
  } else {
    contactsStore.addContact(contactForm.value)
  }
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  editingContact.value = null
  contactForm.value = {
    name: '',
    email: '',
    phone: '',
    company: ''
  }
}
</script>