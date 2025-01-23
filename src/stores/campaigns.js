import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export const useCampaignsStore = defineStore('campaigns', () => {
  const campaigns = ref(JSON.parse(localStorage.getItem('campaigns')) || [])

  const addCampaign = (campaign) => {
    campaigns.value.push({
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      status: 'draft',
      metrics: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        spent: 0
      },
      ...campaign
    })
    saveToStorage()
  }

  const updateCampaign = (id, updatedCampaign) => {
    const index = campaigns.value.findIndex(c => c.id === id)
    if (index !== -1) {
      campaigns.value[index] = { ...campaigns.value[index], ...updatedCampaign }
      saveToStorage()
    }
  }

  const deleteCampaign = (id) => {
    campaigns.value = campaigns.value.filter(c => c.id !== id)
    saveToStorage()
  }

  const updateMetrics = (id, metrics) => {
    const campaign = campaigns.value.find(c => c.id === id)
    if (campaign) {
      campaign.metrics = { ...campaign.metrics, ...metrics }
      saveToStorage()
    }
  }

  const saveToStorage = () => {
    localStorage.setItem('campaigns', JSON.stringify(campaigns.value))
  }

  const activeCampaigns = computed(() => 
    campaigns.value.filter(c => c.status === 'active')
  )

  const completedCampaigns = computed(() => 
    campaigns.value.filter(c => c.status === 'completed')
  )

  const totalSpent = computed(() => 
    campaigns.value.reduce((sum, campaign) => sum + campaign.metrics.spent, 0)
  )

  const totalConversions = computed(() => 
    campaigns.value.reduce((sum, campaign) => sum + campaign.metrics.conversions, 0)
  )

  const recentCampaigns = computed(() => {
    return [...campaigns.value]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  })

  return {
    campaigns,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    updateMetrics,
    activeCampaigns,
    completedCampaigns,
    totalSpent,
    totalConversions,
    recentCampaigns
  }
})