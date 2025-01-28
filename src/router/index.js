import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Contacts from '../views/Contacts.vue'
import Leads from '../views/Leads.vue'
import Deals from '../views/Deals.vue'
import Opportunities from '../views/Opportunities.vue'
import Tasks from '../views/Tasks.vue'
import Campaigns from '../views/Campaigns.vue'
import Notes from '../views/Notes.vue'
import Calendar from '../views/Calendar.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/contacts',
      name: 'Contacts',
      component: Contacts
    },
    {
      path: '/leads',
      name: 'Leads',
      component: Leads
    },
    {
      path: '/deals',
      name: 'Deals',
      component: Deals
    },
    {
      path: '/opportunities',
      name: 'Opportunities',
      component: Opportunities
    },
    {
      path: '/tasks',
      name: 'Tasks',
      component: Tasks
    },
    {
      path: '/campaigns',
      name: 'Campaigns',
      component: Campaigns
    },
    {
      path: '/notes',
      name: 'Notes',
      component: Notes
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: Calendar
    }
  ]
})

export default router