import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export const useDealsStore = defineStore('deals', () => {
  const deals = ref(JSON.parse(localStorage.getItem('deals')) || [])

  const addDeal = (deal) => {
    deals.value.push({
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      status: 'new',
      priority: 'medium',
      activities: [],
      products: [],
      ...deal
    })
    saveToStorage()
  }

  const updateDeal = (id, updatedDeal) => {
    const index = deals.value.findIndex(d => d.id === id)
    if (index !== -1) {
      deals.value[index] = { ...deals.value[index], ...updatedDeal }
      saveToStorage()
    }
  }

  const deleteDeal = (id) => {
    deals.value = deals.value.filter(d => d.id !== id)
    saveToStorage()
  }

  const addActivity = (dealId, activity) => {
    const deal = deals.value.find(d => d.id === dealId)
    if (deal) {
      deal.activities.push({
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        ...activity
      })
      saveToStorage()
    }
  }

  const addProduct = (dealId, product) => {
    const deal = deals.value.find(d => d.id === dealId)
    if (deal) {
      deal.products.push({
        id: uuidv4(),
        ...product
      })
      updateDealValue(dealId)
      saveToStorage()
    }
  }

  const removeProduct = (dealId, productId) => {
    const deal = deals.value.find(d => d.id === dealId)
    if (deal) {
      deal.products = deal.products.filter(p => p.id !== productId)
      updateDealValue(dealId)
      saveToStorage()
    }
  }

  const updateDealValue = (dealId) => {
    const deal = deals.value.find(d => d.id === dealId)
    if (deal) {
      deal.value = deal.products.reduce((sum, product) => {
        return sum + (product.price * product.quantity)
      }, 0)
    }
  }

  const saveToStorage = () => {
    localStorage.setItem('deals', JSON.stringify(deals.value))
  }

  const totalValue = computed(() => {
    return deals.value.reduce((sum, deal) => sum + (parseFloat(deal.value) || 0), 0)
  })

  const dealsByStatus = computed(() => {
    return deals.value.reduce((acc, deal) => {
      acc[deal.status] = (acc[deal.status] || 0) + 1
      return acc
    }, {})
  })

  const dealsByPriority = computed(() => {
    return deals.value.reduce((acc, deal) => {
      acc[deal.priority] = (acc[deal.priority] || 0) + 1
      return acc
    }, {})
  })

  const recentDeals = computed(() => {
    return [...deals.value]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  })

  return {
    deals,
    addDeal,
    updateDeal,
    deleteDeal,
    addActivity,
    addProduct,
    removeProduct,
    totalValue,
    dealsByStatus,
    dealsByPriority,
    recentDeals
  }
})