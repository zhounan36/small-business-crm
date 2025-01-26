<template>
  <div class="min-h-screen bg-violet-200 dark:bg-dark-50 transition-colors duration-200">
    <!-- Navigation -->
    <nav class="bg-white dark:bg-dark-100 border-b border-gray-200 dark:border-dark-200 transition-colors duration-200 relative z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <h1 class="text-xl font-bold text-violet-600 dark:text-violet-400">Small Business CRM</h1>
            </div>
          </div>
          <!-- Hamburger menu for mobile -->
          <div class="flex items-center sm:hidden">
            <button
              @click="toggleMobileMenu"
              class="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors duration-200"
            >
              <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <!-- Full navigation for larger screens -->
          <div class="hidden sm:ml-8 sm:flex sm:space-x-4">
            <RouterLink
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              :class="[
                $route.path === item.href
                  ? 'border-violet-500 text-violet-600 dark:text-violet-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300',
                'inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium transition-colors duration-200'
              ]"
            >
              {{ item.name }}
            </RouterLink>
          </div>
          <!-- Theme toggle button -->
          <div class="flex items-center">
            <button
              @click="themeStore.toggleTheme"
              class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors duration-200"
            >
              <svg v-if="themeStore.isDark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </button>
          </div>
        </div>
        <!-- Mobile menu -->
        <div
          v-if="mobileMenuOpen"
          class="sm:hidden bg-white dark:bg-dark-100 border-t border-gray-200 dark:border-dark-200 transition-colors duration-200"
        >
          <div class="py-2 space-y-1">
            <RouterLink
              v-for="item in navigation"
              :key="item.name"
              :to="item.href"
              class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200"
              :class="[
                $route.path === item.href
                  ? 'border-violet-500 text-violet-600 dark:text-violet-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-200 hover:border-gray-300'
              ]"
              @click="closeMobileMenu"
            >
              {{ item.name }}
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Page Content -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useThemeStore } from './stores/theme'

const themeStore = useThemeStore()

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Contacts', href: '/contacts' },
  { name: 'Leads', href: '/leads' },
  { name: 'Deals', href: '/deals' },
  { name: 'Tasks', href: '/tasks' },
  { name: 'Campaigns', href: '/campaigns' },
  { name: 'Notes', href: '/notes' },
  { name: 'Calendar', href: '/calendar' }
]

// Reactive state for mobile menu
const mobileMenuOpen = ref(false)

// Functions for mobile menu
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}
</script>
