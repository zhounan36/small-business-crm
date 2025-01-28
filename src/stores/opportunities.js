import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export const useOpportunitiesStore = defineStore('opportunities', () => {
  // State
  const opportunities = ref(JSON.parse(localStorage.getItem('opportunities')) || [])

  // Add an opportunity
  const addOpportunity = (opportunity) => {
    const newOpportunity = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      stage: 'new',
      priority: 'medium',
      value: 0,  // assuming an initial value of 0, you can change that
      ...opportunity
    }
    opportunities.value.push(newOpportunity)
    saveToStorage()
  }

  // Update an opportunity
  const updateOpportunity = (id, updatedOpportunity) => {
    const index = opportunities.value.findIndex(o => o.id === id)
    if (index !== -1) {
      opportunities.value[index] = { ...opportunities.value[index], ...updatedOpportunity }
      saveToStorage()
    }
  }

  // Delete an opportunity
  const deleteOpportunity = (id) => {
    opportunities.value = opportunities.value.filter(o => o.id !== id)
    saveToStorage()
  }

  // Save opportunities to local storage (or database)
  const saveToStorage = () => {
    localStorage.setItem('opportunities', JSON.stringify(opportunities.value))
  }

  // Computed properties
  const totalOpportunities = computed(() => opportunities.value.length)

  const highPriority = computed(() => opportunities.value.filter(o => o.priority === 'high').length)

  const averageOpportunityValue = computed(() => {
    if (opportunities.value.length === 0) return 0
    const totalValue = opportunities.value.reduce((acc, opp) => acc + opp.value, 0)
    return (totalValue / opportunities.value.length).toFixed(2)
  })

  const winRate = computed(() => {
    const won = opportunities.value.filter(o => o.stage === 'won').length
    const total = opportunities.value.length
    return total ? ((won / total) * 100).toFixed(1) : 0
  })

  const opportunitiesByStage = computed(() => {
    return opportunities.value.reduce((acc, opportunity) => {
      acc[opportunity.stage] = (acc[opportunity.stage] || 0) + 1
      return acc
    }, {})
  })

  const opportunitiesByPriority = computed(() => {
    return opportunities.value.reduce((acc, opportunity) => {
      acc[opportunity.priority] = (acc[opportunity.priority] || 0) + 1
      return acc
    }, {})
  })

  // Return the store's properties and methods
  return {
    opportunities,
    totalOpportunities,
    highPriority,
    averageOpportunityValue,
    winRate,
    opportunitiesByStage,
    opportunitiesByPriority,
    addOpportunity,
    updateOpportunity,
    deleteOpportunity
  }
})
