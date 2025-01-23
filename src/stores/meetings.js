import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { format, isWithinInterval, startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns'

export const useMeetingsStore = defineStore('meetings', () => {
  const meetings = ref(JSON.parse(localStorage.getItem('meetings')) || [])

  const addMeeting = (meeting) => {
    meetings.value.push({
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      status: 'scheduled',
      ...meeting
    })
    saveToStorage()
  }

  const updateMeeting = (id, updatedMeeting) => {
    const index = meetings.value.findIndex(m => m.id === id)
    if (index !== -1) {
      meetings.value[index] = { ...meetings.value[index], ...updatedMeeting }
      saveToStorage()
    }
  }

  const deleteMeeting = (id) => {
    meetings.value = meetings.value.filter(m => m.id !== id)
    saveToStorage()
  }

  const saveToStorage = () => {
    localStorage.setItem('meetings', JSON.stringify(meetings.value))
  }

  const upcomingMeetings = computed(() => {
    const now = new Date()
    return meetings.value
      .filter(meeting => new Date(meeting.start) > now)
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .slice(0, 5)
  })

  const thisWeeksMeetings = computed(() => {
    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }) // Start week on Monday
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 })
    
    return meetings.value
      .filter(meeting => {
        const meetingDate = new Date(meeting.start)
        return isWithinInterval(meetingDate, {
          start: weekStart,
          end: weekEnd
        })
      })
      .sort((a, b) => new Date(a.start) - new Date(b.start))
  })

  const todaysMeetings = computed(() => {
    const today = new Date()
    return meetings.value.filter(meeting => {
      const meetingDate = new Date(meeting.start)
      return isWithinInterval(meetingDate, {
        start: startOfDay(today),
        end: endOfDay(today)
      })
    })
  })

  const getCalendarEvents = computed(() => {
    return meetings.value.map(meeting => ({
      id: meeting.id,
      title: meeting.title,
      start: meeting.start,
      end: meeting.end,
      description: meeting.description,
      location: meeting.location,
      attendees: meeting.attendees,
      status: meeting.status,
      backgroundColor: getStatusColor(meeting.status),
      borderColor: getStatusColor(meeting.status),
      allDay: false
    }))
  })

  const getStatusColor = (status) => {
    const colors = {
      scheduled: '#8B5CF6', // violet-500
      'in-progress': '#10B981', // emerald-500
      completed: '#6B7280', // gray-500
      cancelled: '#EF4444', // red-500
    }
    return colors[status] || colors.scheduled
  }

  return {
    meetings,
    addMeeting,
    updateMeeting,
    deleteMeeting,
    upcomingMeetings,
    todaysMeetings,
    thisWeeksMeetings,
    getCalendarEvents
  }
})