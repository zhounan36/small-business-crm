<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Calendar</h1>
      <button @click="showAddModal = true" class="btn-primary">
        Schedule Meeting
      </button>
    </div>

    <!-- Calendar Grid -->
    <div class="card p-6">
      <FullCalendar 
        ref="fullCalendar"
        :options="calendarOptions"
        class="!font-sans" />
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
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-dark-100 p-6 shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  {{ editingMeeting ? 'Edit Meeting' : 'Schedule New Meeting' }}
                </DialogTitle>

                <form @submit.prevent="saveMeeting" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                    <input type="text" v-model="meetingForm.title" required class="input-field">
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea v-model="meetingForm.description" rows="3" class="input-field"></textarea>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start</label>
                      <input type="datetime-local" v-model="meetingForm.start" required class="input-field">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End</label>
                      <input type="datetime-local" v-model="meetingForm.end" required class="input-field">
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                    <input type="text" v-model="meetingForm.location" class="input-field">
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Attendees</label>
                    <select v-model="meetingForm.attendees" multiple class="input-field h-32">
                      <option v-for="contact in contactsStore.contacts" :key="contact.id" :value="contact.name">
                        {{ contact.name }}
                      </option>
                    </select>
                    <p class="mt-1 text-sm text-gray-500">Hold Ctrl/Cmd to select multiple attendees</p>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                    <select v-model="meetingForm.status" required class="input-field">
                      <option value="scheduled">Scheduled</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div class="mt-6 flex justify-end space-x-3">
                    <button type="button" @click="closeModal" class="btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" class="btn-primary">
                      {{ editingMeeting ? 'Update' : 'Schedule' }}
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
import { ref, computed, watch } from 'vue'
import { useMeetingsStore } from '../stores/meetings'
import { useContactsStore } from '../stores/contacts'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

const meetingsStore = useMeetingsStore()
const contactsStore = useContactsStore()
const showAddModal = ref(false)
const editingMeeting = ref(null)
const fullCalendar = ref(null)

const meetingForm = ref({
  title: '',
  description: '',
  start: '',
  end: '',
  location: '',
  attendees: [],
  status: 'scheduled'
})

const calendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: '', // No content on the left
    center: 'title', // Title (Month and Year) at the top center
    right: '' // No content on the right
  },
  footerToolbar: {
    left: 'dayGridMonth,timeGridWeek,timeGridDay', // View buttons (Month/Week/Day) on top of arrows
    center: '', // Leave the center empty
    right: 'prev,next today' // Navigation arrows (Prev/Next/Today) on the bottom right
  },
  events: meetingsStore.getCalendarEvents,
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  eventClick: handleEventClick,
  select: handleDateSelect,
  eventDrop: handleEventDrop,
  eventResize: handleEventResize
};



function handleEventClick(info) {
  const meeting = meetingsStore.meetings.find(m => m.id === info.event.id)
  if (meeting) {
    editingMeeting.value = meeting
    meetingForm.value = { ...meeting }
    showAddModal.value = true
  }
}

function handleDateSelect(selectInfo) {
  const startDate = new Date(selectInfo.start)
  const endDate = new Date(selectInfo.end)
  
  // Format dates for datetime-local input
  const formatDate = (date) => {
    return date.toISOString().slice(0, 16)
  }

  meetingForm.value = {
    title: '',
    description: '',
    start: formatDate(startDate),
    end: formatDate(endDate),
    location: '',
    attendees: [],
    status: 'scheduled'
  }
  showAddModal.value = true
}

function handleEventDrop(info) {
  const meeting = meetingsStore.meetings.find(m => m.id === info.event.id)
  if (meeting) {
    meetingsStore.updateMeeting(meeting.id, {
      ...meeting,
      start: info.event.startStr,
      end: info.event.endStr
    })
  }
}

function handleEventResize(info) {
  const meeting = meetingsStore.meetings.find(m => m.id === info.event.id)
  if (meeting) {
    meetingsStore.updateMeeting(meeting.id, {
      ...meeting,
      end: info.event.endStr
    })
  }
}

function saveMeeting() {
  const meetingData = {
    ...meetingForm.value,
    start: new Date(meetingForm.value.start).toISOString(),
    end: new Date(meetingForm.value.end).toISOString()
  }

  if (editingMeeting.value) {
    meetingsStore.updateMeeting(editingMeeting.value.id, meetingData)
  } else {
    meetingsStore.addMeeting(meetingData)
  }
  closeModal()
}

function closeModal() {
  showAddModal.value = false
  editingMeeting.value = null
  meetingForm.value = {
    title: '',
    description: '',
    start: '',
    end: '',
    location: '',
    attendees: [],
    status: 'scheduled'
  }
}

// Watch for changes in meetings and refresh the calendar
watch(() => meetingsStore.meetings, () => {
  if (fullCalendar.value) {
    const calendarApi = fullCalendar.value.getApi()
    calendarApi.refetchEvents()
  }
}, { deep: true })
</script>

<style>
.fc {
  @apply font-sans;
}

.fc .fc-toolbar-title {
  @apply text-gray-900 dark:text-gray-100;
}

.fc .fc-button {
  @apply bg-white dark:bg-dark-200 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-dark-300 hover:bg-gray-50 dark:hover:bg-dark-300 focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 dark:focus:ring-offset-dark-100;
}

.fc .fc-button-primary:not(:disabled).fc-button-active,
.fc .fc-button-primary:not(:disabled):active {
  @apply bg-violet-600 dark:bg-violet-700 border-violet-600 dark:border-violet-700;
}

.fc .fc-daygrid-day-number,
.fc .fc-col-header-cell-cushion {
  @apply text-gray-700 dark:text-gray-300;
}

.fc .fc-daygrid-day.fc-day-today {
  @apply bg-violet-50 dark:bg-violet-900/20;
}

.fc .fc-event {
  @apply cursor-pointer;
}

.fc .fc-event:hover {
  @apply opacity-90;
}
</style>