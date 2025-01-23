import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export const useLeadsStore = defineStore('leads', () => {
  const leads = ref(JSON.parse(localStorage.getItem('leads')) || [])

  const addLead = (lead) => {
    leads.value.push({
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      status: 'new',
      source: 'direct',
      score: 0,
      activities: [],
      ...lead
    })
    saveToStorage()
  }

  const updateLead = (id, updatedLead) => {
    const index = leads.value.findIndex(l => l.id === id)
    if (index !== -1) {
      leads.value[index] = { ...leads.value[index], ...updatedLead }
      saveToStorage()
    }
  }

  const deleteLead = (id) => {
    leads.value = leads.value.filter(l => l.id !== id)
    saveToStorage()
  }

  const addActivity = (leadId, activity) => {
    const lead = leads.value.find(l => l.id === leadId)
    if (lead) {
      lead.activities.push({
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        ...activity
      })
      saveToStorage()
    }
  }

  const convertToDeal = (leadId, dealData) => {
    const lead = leads.value.find(l => l.id === leadId)
    if (lead) {
      lead.status = 'converted'
      saveToStorage()
      return {
        name: lead.company || `${lead.firstName} ${lead.lastName}`,
        contact: `${lead.firstName} ${lead.lastName}`,
        value: dealData.value,
        status: 'new',
        priority: dealData.priority || 'medium',
        source: lead.source,
        leadId: lead.id
      }
    }
    return null
  }

  const saveToStorage = () => {
    localStorage.setItem('leads', JSON.stringify(leads.value))
  }

  const totalLeads = computed(() => leads.value.length)
  
  const activeLeads = computed(() => 
    leads.value.filter(l => l.status !== 'converted' && l.status !== 'lost').length
  )

  const leadsByStatus = computed(() => {
    return leads.value.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1
      return acc
    }, {})
  })

  const leadsBySource = computed(() => {
    return leads.value.reduce((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1
      return acc
    }, {})
  })

  const recentLeads = computed(() => {
    return [...leads.value]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  })

  return {
    leads,
    addLead,
    updateLead,
    deleteLead,
    addActivity,
    convertToDeal,
    totalLeads,
    activeLeads,
    leadsByStatus,
    leadsBySource,
    recentLeads
  }
})