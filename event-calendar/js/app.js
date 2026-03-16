// Event Calendar Application
const EventCalendar = (() => {
    let events = [];
    let currentDate = new Date();
    let currentView = 'month';
    let selectedEvent = null;
    let filteredCategory = 'all';

    const categories = [
        { id: 'work', name: 'Work', color: '#3b82f6' },
        { id: 'personal', name: 'Personal', color: '#10b981' },
        { id: 'family', name: 'Family', color: '#f59e0b' },
        { id: 'health', name: 'Health', color: '#ef4444' },
        { id: 'other', name: 'Other', color: '#8b5cf6' }
    ];

    const elements = {
        calendarGrid: document.getElementById('calendarGrid'),
        currentPeriod: document.getElementById('currentPeriod'),
        prevBtn: document.getElementById('prevBtn'),
        nextBtn: document.getElementById('nextBtn'),
        todayBtn: document.getElementById('todayBtn'),
        calendarView: document.getElementById('calendarView'),
        addEventBtn: document.getElementById('addEventBtn'),
        eventModal: document.getElementById('eventModal'),
        closeModal: document.getElementById('closeModal'),
        eventForm: document.getElementById('eventForm'),
        modalTitle: document.getElementById('modalTitle'),
        eventTitle: document.getElementById('eventTitle'),
        eventDate: document.getElementById('eventDate'),
        eventTime: document.getElementById('eventTime'),
        eventDescription: document.getElementById('eventDescription'),
        eventCategory: document.getElementById('eventCategory'),
        eventRecurring: document.getElementById('eventRecurring'),
        recurringOptions: document.getElementById('recurringOptions'),
        recurringType: document.getElementById('recurringType'),
        recurringEnd: document.getElementById('recurringEnd'),
        eventReminder: document.getElementById('eventReminder'),
        cancelBtn: document.getElementById('cancelBtn'),
        deleteEventBtn: document.getElementById('deleteEventBtn'),
        searchInput: document.getElementById('searchInput'),
        exportBtn: document.getElementById('exportBtn'),
        miniCalendar: document.getElementById('miniCalendar'),
        toast: document.getElementById('toast')
    };

    // Initialize
    function init() {
        loadFromLocalStorage();
        setupEventListeners();
        populateCategories();
        renderCalendar();
        renderMiniCalendar();
        checkReminders();
        setInterval(checkReminders, 60000); // Check every minute
    }

    // Setup Event Listeners
    function setupEventListeners() {
        elements.prevBtn.addEventListener('click', () => navigateCalendar(-1));
        elements.nextBtn.addEventListener('click', () => navigateCalendar(1));
        elements.todayBtn.addEventListener('click', goToToday);
        elements.calendarView.addEventListener('change', changeView);
        elements.addEventBtn.addEventListener('click', openAddEventModal);
        elements.closeModal.addEventListener('click', closeModal);
        elements.cancelBtn.addEventListener('click', closeModal);
        elements.eventForm.addEventListener('submit', handleEventSubmit);
        elements.deleteEventBtn.addEventListener('click', deleteEvent);
        elements.eventRecurring.addEventListener('change', toggleRecurringOptions);
        elements.searchInput.addEventListener('input', handleSearch);
        elements.exportBtn.addEventListener('click', exportToICal);

        elements.eventModal.addEventListener('click', (e) => {
            if (e.target === elements.eventModal) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !elements.eventModal.classList.contains('hidden')) {
                closeModal();
            }
        });
    }

    // Populate Categories
    function populateCategories() {
        elements.eventCategory.innerHTML = categories.map(cat => 
            `<option value="${cat.id}">${cat.name}</option>`
        ).join('');
    }

    // Navigate Calendar
    function navigateCalendar(direction) {
        if (currentView === 'month') {
            currentDate.setMonth(currentDate.getMonth() + direction);
        } else if (currentView === 'week') {
            currentDate.setDate(currentDate.getDate() + (direction * 7));
        } else if (currentView === 'day') {
            currentDate.setDate(currentDate.getDate() + direction);
        }
        renderCalendar();
        renderMiniCalendar();
    }

    // Go to Today
    function goToToday() {
        currentDate = new Date();
        renderCalendar();
        renderMiniCalendar();
    }

    // Change View
    function changeView(e) {
        currentView = e.target.value;
        renderCalendar();
    }

    // Render Calendar
    function renderCalendar() {
        if (currentView === 'month') {
            renderMonthView();
        } else if (currentView === 'week') {
            renderWeekView();
        } else if (currentView === 'day') {
            renderDayView();
        }
    }

    // Render Month View
    function renderMonthView() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        elements.currentPeriod.textContent = dateFns.format(currentDate, 'MMMM yyyy');
        
        let html = '<div class="calendar-month">';
        html += '<div class="calendar-weekdays">';
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        weekdays.forEach(day => {
            html += `<div class="weekday">${day}</div>`;
        });
        html += '</div>';
        
        html += '<div class="calendar-days">';
        const current = new Date(startDate);
        
        for (let i = 0; i < 42; i++) {
            const isCurrentMonth = current.getMonth() === month;
            const isToday = dateFns.isToday(current);
            const dateStr = dateFns.format(current, 'yyyy-MM-dd');
            const dayEvents = getEventsForDate(current);
            
            html += `<div class="calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}" data-date="${dateStr}">`;
            html += `<div class="day-number">${current.getDate()}</div>`;
            html += '<div class="day-events">';
            
            dayEvents.slice(0, 3).forEach(event => {
                const category = categories.find(c => c.id === event.category);
                html += `<div class="event-item" style="background-color: ${category.color}20; border-left: 3px solid ${category.color}" data-event-id="${event.id}">
                    <span class="event-time">${event.time}</span>
                    <span class="event-title-small">${event.title}</span>
                </div>`;
            });
            
            if (dayEvents.length > 3) {
                html += `<div class="more-events">+${dayEvents.length - 3} more</div>`;
            }
            
            html += '</div></div>';
            current.setDate(current.getDate() + 1);
        }
        
        html += '</div></div>';
        elements.calendarGrid.innerHTML = html;
        
        attachDayClickListeners();
    }

    // Render Week View
    function renderWeekView() {
        const startOfWeek = dateFns.startOfWeek(currentDate);
        const endOfWeek = dateFns.endOfWeek(currentDate);
        
        elements.currentPeriod.textContent = `${dateFns.format(startOfWeek, 'MMM d')} - ${dateFns.format(endOfWeek, 'MMM d, yyyy')}`;
        
        let html = '<div class="calendar-week">';
        html += '<div class="week-header">';
        html += '<div class="time-column">Time</div>';
        
        const current = new Date(startOfWeek);
        for (let i = 0; i < 7; i++) {
            const isToday = dateFns.isToday(current);
            html += `<div class="week-day-header ${isToday ? 'today' : ''}">
                <div class="day-name">${dateFns.format(current, 'EEE')}</div>
                <div class="day-date">${dateFns.format(current, 'd')}</div>
            </div>`;
            current.setDate(current.getDate() + 1);
        }
        html += '</div>';
        
        html += '<div class="week-body">';
        for (let hour = 0; hour < 24; hour++) {
            html += '<div class="week-row">';
            html += `<div class="time-slot">${hour.toString().padStart(2, '0')}:00</div>`;
            
            const dayStart = new Date(startOfWeek);
            for (let day = 0; day < 7; day++) {
                const dateStr = dateFns.format(dayStart, 'yyyy-MM-dd');
                html += `<div class="week-cell" data-date="${dateStr}" data-hour="${hour}">`;
                
                const hourEvents = getEventsForDateAndHour(dayStart, hour);
                hourEvents.forEach(event => {
                    const category = categories.find(c => c.id === event.category);
                    html += `<div class="event-item" style="background-color: ${category.color}; color: white;" data-event-id="${event.id}">
                        ${event.title}
                    </div>`;
                });
                
                html += '</div>';
                dayStart.setDate(dayStart.getDate() + 1);
            }
            html += '</div>';
        }
        html += '</div></div>';
        
        elements.calendarGrid.innerHTML = html;
        attachDayClickListeners();
    }

    // Render Day View
    function renderDayView() {
        elements.currentPeriod.textContent = dateFns.format(currentDate, 'EEEE, MMMM d, yyyy');
        
        let html = '<div class="calendar-day-view">';
        
        for (let hour = 0; hour < 24; hour++) {
            html += '<div class="day-hour-row">';
            html += `<div class="hour-label">${hour.toString().padStart(2, '0')}:00</div>`;
            html += `<div class="hour-content" data-date="${dateFns.format(currentDate, 'yyyy-MM-dd')}" data-hour="${hour}">`;
            
            const hourEvents = getEventsForDateAndHour(currentDate, hour);
            hourEvents.forEach(event => {
                const category = categories.find(c => c.id === event.category);
                html += `<div class="event-item-day" style="background-color: ${category.color}; color: white;" data-event-id="${event.id}">
                    <div class="event-time-day">${event.time}</div>
                    <div class="event-title-day">${event.title}</div>
                    ${event.description ? `<div class="event-desc-day">${event.description}</div>` : ''}
                </div>`;
            });
            
            html += '</div></div>';
        }
        
        html += '</div>';
        elements.calendarGrid.innerHTML = html;
        attachDayClickListeners();
    }

    // Render Mini Calendar
    function renderMiniCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        let html = '<div class="mini-calendar-grid">';
        const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        weekdays.forEach(day => {
            html += `<div class="mini-weekday">${day}</div>`;
        });
        
        const current = new Date(startDate);
        for (let i = 0; i < 42; i++) {
            const isCurrentMonth = current.getMonth() === month;
            const isToday = dateFns.isToday(current);
            const hasEvents = getEventsForDate(current).length > 0;
            const dateStr = dateFns.format(current, 'yyyy-MM-dd');
            
            html += `<div class="mini-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${hasEvents ? 'has-events' : ''}" data-date="${dateStr}">
                ${current.getDate()}
            </div>`;
            current.setDate(current.getDate() + 1);
        }
        
        html += '</div>';
        elements.miniCalendar.innerHTML = html;
        
        elements.miniCalendar.querySelectorAll('.mini-day').forEach(day => {
            day.addEventListener('click', (e) => {
                const date = new Date(e.target.dataset.date);
                currentDate = date;
                renderCalendar();
                renderMiniCalendar();
            });
        });
    }

    // Attach Day Click Listeners
    function attachDayClickListeners() {
        elements.calendarGrid.querySelectorAll('.calendar-day, .week-cell, .hour-content').forEach(el => {
            el.addEventListener('click', (e) => {
                if (!e.target.closest('.event-item, .event-item-day')) {
                    const date = el.dataset.date;
                    const hour = el.dataset.hour;
                    openAddEventModal(date, hour);
                }
            });
        });
        
        elements.calendarGrid.querySelectorAll('.event-item, .event-item-day').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const eventId = el.dataset.eventId;
                openEditEventModal(eventId);
            });
        });
    }

    // Open Add Event Modal
    function openAddEventModal(date = null, hour = null) {
        selectedEvent = null;
        elements.modalTitle.textContent = 'Add Event';
        elements.eventForm.reset();
        elements.deleteEventBtn.classList.add('hidden');
        elements.recurringOptions.classList.add('hidden');
        
        if (date) {
            elements.eventDate.value = date;
            if (hour !== null) {
                elements.eventTime.value = `${hour.toString().padStart(2, '0')}:00`;
            }
        } else {
            elements.eventDate.value = dateFns.format(currentDate, 'yyyy-MM-dd');
        }
        
        elements.eventModal.classList.remove('hidden');
    }

    // Open Edit Event Modal
    function openEditEventModal(eventId) {
        const event = events.find(e => e.id === eventId);
        if (!event) return;
        
        selectedEvent = event;
        elements.modalTitle.textContent = 'Edit Event';
        elements.deleteEventBtn.classList.remove('hidden');
        
        elements.eventTitle.value = event.title;
        elements.eventDate.value = event.date;
        elements.eventTime.value = event.time;
        elements.eventDescription.value = event.description || '';
        elements.eventCategory.value = event.category;
        elements.eventRecurring.checked = event.recurring;
        elements.eventReminder.value = event.reminder || '';
        
        if (event.recurring) {
            elements.recurringOptions.classList.remove('hidden');
            elements.recurringType.value = event.recurringType;
            elements.recurringEnd.value = event.recurringEnd || '';
        }
        
        elements.eventModal.classList.remove('hidden');
    }

    // Close Modal
    function closeModal() {
        elements.eventModal.classList.add('hidden');
        elements.eventForm.reset();
        selectedEvent = null;
    }

    // Toggle Recurring Options
    function toggleRecurringOptions(e) {
        if (e.target.checked) {
            elements.recurringOptions.classList.remove('hidden');
        } else {
            elements.recurringOptions.classList.add('hidden');
        }
    }

    // Handle Event Submit
    function handleEventSubmit(e) {
        e.preventDefault();
        
        const title = elements.eventTitle.value.trim();
        const date = elements.eventDate.value;
        const time = elements.eventTime.value;
        const description = elements.eventDescription.value.trim();
        const category = elements.eventCategory.value;
        const recurring = elements.eventRecurring.checked;
        const reminder = elements.eventReminder.value;
        
        if (!title || !date || !time) {
            showToast('Please fill in all required fields', 'error');
            return;
        }
        
        const eventData = {
            title,
            date,
            time,
            description,
            category,
            recurring,
            reminder
        };
        
        if (recurring) {
            eventData.recurringType = elements.recurringType.value;
            eventData.recurringEnd = elements.recurringEnd.value;
        }
        
        if (selectedEvent) {
            updateEvent(selectedEvent.id, eventData);
            showToast('Event updated successfully', 'success');
        } else {
            addEvent(eventData);
            showToast('Event added successfully', 'success');
        }
        
        closeModal();
        renderCalendar();
        renderMiniCalendar();
        saveToLocalStorage();
    }

    // Add Event
    function addEvent(eventData) {
        const event = {
            id: generateId(),
            ...eventData
        };
        
        if (event.recurring) {
            generateRecurringEvents(event);
        } else {
            events.push(event);
        }
    }

    // Update Event
    function updateEvent(id, eventData) {
        const index = events.findIndex(e => e.id === id);
        if (index !== -1) {
            events[index] = { ...events[index], ...eventData };
        }
    }

    // Delete Event
    function deleteEvent() {
        if (!selectedEvent) return;
        
        if (confirm('Are you sure you want to delete this event?')) {
            events = events.filter(e => e.id !== selectedEvent.id);
            showToast('Event deleted successfully', 'success');
            closeModal();
            renderCalendar();
            renderMiniCalendar();
            saveToLocalStorage();
        }
    }

    // Generate Recurring Events
    function generateRecurringEvents(baseEvent) {
        const startDate = new Date(baseEvent.date);
        const endDate = baseEvent.recurringEnd ? new Date(baseEvent.recurringEnd) : new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate());
        
        let currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
            const event = {
                ...baseEvent,
                id: generateId(),
                date: dateFns.format(currentDate, 'yyyy-MM-dd'),
                parentId: baseEvent.id
            };
            events.push(event);
            
            switch (baseEvent.recurringType) {
                case 'daily':
                    currentDate.setDate(currentDate.getDate() + 1);
                    break;
                case 'weekly':
                    currentDate.setDate(currentDate.getDate() + 7);
                    break;
                case 'monthly':
                    currentDate.setMonth(currentDate.getMonth() + 1);
                    break;
                case 'yearly':
                    currentDate.setFullYear(currentDate.getFullYear() + 1);
                    break;
            }
        }
    }

    // Get Events for Date
    function getEventsForDate(date) {
        const dateStr = dateFns.format(date, 'yyyy-MM-dd');
        return events.filter(e => e.date === dateStr && matchesFilter(e));
    }

    // Get Events for Date and Hour
    function getEventsForDateAndHour(date, hour) {
        const dateStr = dateFns.format(date, 'yyyy-MM-dd');
        return events.filter(e => {
            if (e.date !== dateStr || !matchesFilter(e)) return false;
            const eventHour = parseInt(e.time.split(':')[0]);
            return eventHour === hour;
        });
    }

    // Matches Filter
    function matchesFilter(event) {
        if (filteredCategory !== 'all' && event.category !== filteredCategory) {
            return false;
        }
        
        const searchTerm = elements.searchInput.value.toLowerCase();
        if (searchTerm) {
            return event.title.toLowerCase().includes(searchTerm) ||
                   (event.description && event.description.toLowerCase().includes(searchTerm));
        }
        
        return true;
    }

    // Handle Search
    function handleSearch() {
        renderCalendar();
    }

    // Check Reminders
    function checkReminders() {
        const now = new Date();
        
        events.forEach(event => {
            if (!event.reminder || event.reminded) return;
            
            const eventDateTime = new Date(`${event.date}T${event.time}`);
            let reminderTime = new Date(eventDateTime);
            
            switch (event.reminder) {
                case '5min':
                    reminderTime.setMinutes(reminderTime.getMinutes() - 5);
                    break;
                case '15min':
                    reminderTime.setMinutes(reminderTime.getMinutes() - 15);
                    break;
                case '30min':
                    reminderTime.setMinutes(reminderTime.getMinutes() - 30);
                    break;
                case '1hour':
                    reminderTime.setHours(reminderTime.getHours() - 1);
                    break;
                case '1day':
                    reminderTime.setDate(reminderTime.getDate() - 1);
                    break;
            }
            
            if (now >= reminderTime && now < eventDateTime) {
                showNotification(event);
                event.reminded = true;
                saveToLocalStorage();
            }
        });
    }

    // Show Notification
    function showNotification(event) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Event Reminder', {
                body: `${event.title} at ${event.time}`,
                icon: '/favicon.ico'
            });
        }
        showToast(`Reminder: ${event.title} at ${event.time}`, 'info');
    }

    // Export to iCal
    function exportToICal() {
        let icalContent = 'BEGIN:VCALENDAR\n';
        icalContent += 'VERSION:2.0\n';
        icalContent += 'PRODID:-//Event Calendar//EN\n';
        icalContent += 'CALSCALE:GREGORIAN\n';
        
        events.forEach(event => {
            const startDateTime = new Date(`${event.date}T${event.time}`);
            const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour duration
            
            icalContent += 'BEGIN:VEVENT\n';
            icalContent += `UID:${event.id}@eventcalendar.com\n`;
            icalContent += `DTSTAMP:${formatICalDate(new Date())}\n`;
            icalContent += `DTSTART:${formatICalDate(startDateTime)}\n`;
            icalContent += `DTEND:${formatICalDate(endDateTime)}\n`;
            icalContent += `SUMMARY:${event.title}\n`;
            
            if (event.description) {
                icalContent += `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}\n`;
            }
            
            icalContent += `CATEGORIES:${event.category}\n`;
            
            if (event.recurring) {
                let rrule = 'RRULE:FREQ=';
                switch (event.recurringType) {
                    case 'daily':
                        rrule += 'DAILY';
                        break;
                    case 'weekly':
                        rrule += 'WEEKLY';
                        break;
                    case 'monthly':
                        rrule += 'MONTHLY';
                        break;
                    case 'yearly':
                        rrule += 'YEARLY';
                        break;
                }
                
                if (event.recurringEnd) {
                    const endDate = new Date(event.recurringEnd);
                    rrule += `;UNTIL=${formatICalDate(endDate)}`;
                }
                
                icalContent += `${rrule}\n`;
            }
            
            icalContent += 'END:VEVENT\n';
        });
        
        icalContent += 'END:VCALENDAR';
        
        const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
        saveAs(blob, 'calendar-events.ics');
        showToast('Calendar exported successfully', 'success');
    }

    // Format iCal Date
    function formatICalDate(date) {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    }

    // Show Toast
    function showToast(message, type = 'info') {
        elements.toast.textContent = message;
        elements.toast.className = `toast toast-${type} show`;
        
        setTimeout(() => {
            elements.toast.classList.remove('show');
        }, 3000);
    }

    // Generate ID
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Save to LocalStorage
    function saveToLocalStorage() {
        localStorage.setItem('calendarEvents', JSON.stringify(events));
    }

    // Load from LocalStorage
    function loadFromLocalStorage() {
        const stored = localStorage.getItem('calendarEvents');
        if (stored) {
            events = JSON.parse(stored);
        }
    }

    // Request Notification Permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }

    return { init };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', EventCalendar.init);
} else {
    EventCalendar.init();
}