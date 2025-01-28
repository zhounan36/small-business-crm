<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Dashboard</h1>
    
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
      <!-- Existing summary cards... -->
      <div class="dashboard-card">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Contacts</h3>
        <div class="flex items-end justify-between">
          <p class="text-3xl font-bold text-violet-600 dark:text-violet-400">{{ contactsStore.totalContacts }}</p>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            Active: {{ contactsStore.activeContacts }}
          </span>
        </div>
      </div>
      
      <div class="dashboard-card">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Deal Value</h3>
        <div class="flex items-end justify-between">
          <p class="text-3xl font-bold text-emerald-600 dark:text-emerald-400">${{ dealsStore.totalValue.toLocaleString() }}</p>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            Deals: {{ dealsStore.deals.length }}
          </span>
        </div>
      </div>
      
      <div class="dashboard-card">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Tasks</h3>
        <div class="flex items-end justify-between">
          <p class="text-3xl font-bold text-amber-600 dark:text-amber-400">{{ tasksStore.pendingTasks.length }}</p>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            Done: {{ tasksStore.completedTasks.length }}
          </span>
        </div>
      </div>

      <div class="dashboard-card">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Deal Win Rate</h3>
        <div class="flex items-end justify-between">
          <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {{ calculateWinRate }}%
          </p>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            Won: {{ wonDeals }}
          </span>
        </div>
      </div>

      <div class="dashboard-card">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Active Leads</h3>
        <div class="flex items-end justify-between">
          <p class="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{{ leadsStore.activeLeads }}</p>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            Total: {{ leadsStore.totalLeads }}
          </span>
        </div>
      </div>

      <div class="dashboard-card">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Lead Conversion Rate</h3>
        <div class="flex items-end justify-between">
          <p class="text-3xl font-bold text-fuchsia-600 dark:text-fuchsia-400">{{ conversionRate }}%</p>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            Converted: {{ convertedLeads }}
          </span>
        </div>
      </div>

      <div class="dashboard-card">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Active Campaigns</h3>
        <div class="flex items-end justify-between">
          <p class="text-3xl font-bold text-rose-600 dark:text-rose-400">{{ campaignsStore.activeCampaigns.length }}</p>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            Total: {{ campaignsStore.campaigns.length }}
          </span>
        </div>
      </div>

      <div class="dashboard-card">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Campaign ROI</h3>
        <div class="flex items-end justify-between">
          <p class="text-3xl font-bold text-teal-600 dark:text-teal-400">${{ calculateROI }}</p>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            Spent: ${{ campaignsStore.totalSpent.toLocaleString() }}
          </span>
        </div>
      </div>
    </div>

    <!-- Opportunities Overview -->
    <div class="card p-6 dark:bg-dark-100 mb-4">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Opportunities Overview</h3>
        <RouterLink to="/opportunities" class="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium">
          View All
        </RouterLink>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Opportunities -->
        <div class="flex justify-between items-center p-4 bg-gray-50 dark:bg-dark-200 rounded-lg hover:bg-yellow-100 dark:hover:bg-dark-300 transition-all duration-200">
          <div>
            <p class="ext-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Opportunities</p>
            <p class="text-3xl font-bold text-fuchsia-600 dark:text-fuchsia-400">{{ opportunitiesStore.totalOpportunities }}</p>
          </div>
          <div class="text-gray-600 dark:text-gray-400">
            <i class="fa fa-briefcase"></i> <!-- Icon for Opportunities -->
          </div>
        </div>
        <!-- High Priority Opportunities -->
        <div class="flex justify-between items-center p-4 bg-yellow-50 dark:bg-dark-200 rounded-lg hover:bg-yellow-100 dark:hover:bg-dark-300 transition-all duration-200">
          <div>
            <p class="ext-sm font-medium text-gray-500 dark:text-gray-400 mb-1">High Priority Opportunities</p>
            <p class="text-3xl font-bold text-green-600 dark:text-green-400">{{ opportunitiesStore.highPriority }}</p>
          </div>
          <div class="text-yellow-600 dark:text-yellow-400">
            <i class="fa fa-exclamation-triangle"></i> <!-- Icon for High Priority -->
          </div>
        </div>
        <!-- Average Opportunity Value -->
        <div class="flex justify-between items-center p-4 bg-green-50 dark:bg-dark-200 rounded-lg hover:bg-green-100 dark:hover:bg-dark-300 transition-all duration-200">
          <div>
            <p class="ext-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Average Opportunity Value</p>
            <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">${{ opportunitiesStore.averageOpportunityValue }}</p>
          </div>
          <div class="text-green-600 dark:text-green-400">
            <i class="fa fa-dollar-sign"></i> <!-- Icon for Average Value -->
          </div>
        </div>
        <!-- Win Rate -->
        <div class="flex justify-between items-center p-4 bg-blue-50 dark:bg-dark-200 rounded-lg hover:bg-blue-100 dark:hover:bg-dark-300 transition-all duration-200">
          <div>
            <p class="ext-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Win Rate</p>
            <p class="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{{ opportunitiesStore.winRate }}%</p>
          </div>
          <div class="text-blue-600 dark:text-blue-400">
            <i class="fa fa-trophy"></i> <!-- Icon for Win Rate -->
          </div>
        </div>
      </div>
    </div>


    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- This Week's Meetings -->
      <div class="card p-6 dark:bg-dark-100">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">This Week's Meetings</h3>
          <RouterLink to="/calendar" class="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium">
            View Calendar
          </RouterLink>
        </div>
        <div class="space-y-4">
          <div v-for="meeting in meetingsStore.thisWeeksMeetings" :key="meeting.id" 
               class="flex justify-between items-start p-4 bg-gray-50 dark:bg-dark-200 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-300 transition-all duration-200">
            <div>
              <p class="font-medium text-gray-900 dark:text-gray-100">{{ meeting.title }}</p>
              <div class="flex items-center gap-2 mt-1">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ formatDateTime(meeting.start) }}
                </p>
                <span class="text-gray-400 dark:text-gray-500">•</span>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ meeting.location || 'No location' }}
                </p>
              </div>
              <div class="flex flex-wrap gap-1 mt-2">
                <span v-for="attendee in meeting.attendees" 
                      :key="attendee"
                      class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-violet-100 dark:bg-violet-900 text-violet-800 dark:text-violet-200">
                  {{ attendee }}
                </span>
              </div>
            </div>
            <span :class="getMeetingStatusClass(meeting.status)" class="badge">
              {{ meeting.status }}
            </span>
          </div>
          <div v-if="meetingsStore.thisWeeksMeetings.length === 0" 
               class="text-center py-8 text-gray-500 dark:text-gray-400">
            No meetings scheduled this week
          </div>
        </div>
      </div>

      <!-- Recent Deals -->
      <div class="card p-6 dark:bg-dark-100">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Deals</h3>
          <RouterLink to="/deals" class="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium">
            View All
          </RouterLink>
        </div>
        <div class="space-y-4">
          <div v-for="deal in dealsStore.recentDeals" :key="deal.id" 
               class="flex justify-between items-center p-4 bg-gray-50 dark:bg-dark-200 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-300 transition-all duration-200">
            <div>
              <p class="font-medium text-gray-900 dark:text-gray-100">{{ deal.name }}</p>
              <div class="flex items-center gap-2 mt-1">
                <p class="text-sm text-gray-600 dark:text-gray-400">${{ deal.value.toLocaleString() }}</p>
                <span class="text-gray-400 dark:text-gray-500">•</span>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ deal.contact }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span :class="getPriorityClass(deal.priority)" class="badge">
                {{ deal.priority }}
              </span>
              <span :class="getStatusClass(deal.status)" class="badge">
                {{ deal.status }}
              </span>
            </div>
          </div>
          <div v-if="dealsStore.recentDeals.length === 0" 
               class="text-center py-8 text-gray-500 dark:text-gray-400">
            No deals yet
          </div>
        </div>
      </div>

      <!-- Recent Leads -->
      <div class="card p-6 dark:bg-dark-100">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Leads</h3>
          <RouterLink to="/leads" class="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium">
            View All
          </RouterLink>
        </div>
        <div class="space-y-4">
          <div v-for="lead in leadsStore.recentLeads" :key="lead.id" 
               class="flex justify-between items-center p-4 bg-gray-50 dark:bg-dark-200 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-300 transition-all duration-200">
            <div>
              <p class="font-medium text-gray-900 dark:text-gray-100">{{ lead.firstName }} {{ lead.lastName }}</p>
              <div class="flex items-center gap-2 mt-1">
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ lead.company || 'No Company' }}</p>
                <span class="text-gray-400 dark:text-gray-500">•</span>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ lead.source }}</p>
              </div>
            </div>
            <span :class="getLeadStatusClass(lead.status)" class="badge">
              {{ lead.status }}
            </span>
          </div>
          <div v-if="leadsStore.recentLeads.length === 0" 
               class="text-center py-8 text-gray-500 dark:text-gray-400">
            No leads yet
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useContactsStore } from '../stores/contacts'
import { useDealsStore } from '../stores/deals'
import { useTasksStore } from '../stores/tasks'
import { useLeadsStore } from '../stores/leads'
import { useCampaignsStore } from '../stores/campaigns'
import { useMeetingsStore } from '../stores/meetings'
import { useOpportunitiesStore } from '../stores/opportunities'
import { RouterLink } from 'vue-router'
import { format } from 'date-fns'

const contactsStore = useContactsStore()
const dealsStore = useDealsStore()
const tasksStore = useTasksStore()
const leadsStore = useLeadsStore()
const campaignsStore = useCampaignsStore()
const meetingsStore = useMeetingsStore()
const opportunitiesStore  = useOpportunitiesStore()

const wonDeals = computed(() => {
  return dealsStore.deals.filter(deal => deal.status === 'won').length
})

const convertedLeads = computed(() => {
  return leadsStore.leads.filter(lead => lead.status === 'converted').length
})

const calculateWinRate = computed(() => {
  const closedDeals = dealsStore.deals.filter(deal => 
    deal.status === 'won' || deal.status === 'lost'
  ).length
  
  if (closedDeals === 0) return 0
  
  const winRate = (wonDeals.value / closedDeals) * 100
  return Math.round(winRate)
})

const conversionRate = computed(() => {
  if (leadsStore.totalLeads === 0) return 0
  return Math.round((convertedLeads.value / leadsStore.totalLeads) * 100)
})

const calculateROI = computed(() => {
  if (campaignsStore.totalSpent === 0) return 0
  const totalRevenue = dealsStore.deals
    .filter(deal => deal.status === 'won')
    .reduce((sum, deal) => sum + deal.value, 0)
  const roi = ((totalRevenue - campaignsStore.totalSpent) / campaignsStore.totalSpent) * 100
  return Math.round(roi)
})

const formatDateTime = (date) => {
  return format(new Date(date), 'MMM d, h:mm a')
}

const getMeetingStatusClass = (status) => {
  const classes = {
    scheduled: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
    'in-progress': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    completed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return classes[status] || classes.scheduled
}

const getStatusClass = (status) => {
  const classes = {
    new: 'badge-new',
    'in-progress': 'badge-progress',
    won: 'badge-won',
    lost: 'badge-lost'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
}

const getLeadStatusClass = (status) => {
  const classes = {
    new: 'badge-new',
    contacted: 'badge-progress',
    qualified: 'badge-progress',
    converted: 'badge-won',
    lost: 'badge-lost'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
}

const getPriorityClass = (priority) => {
  const classes = {
    high: 'badge-priority-high',
    medium: 'badge-priority-medium',
    low: 'badge-priority-low'
  }
  return classes[priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
}
</script>