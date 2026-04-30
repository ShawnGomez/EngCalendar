export function loadEvents(calendar) {
    calendar.createEvents([
        {
            id: '1',
            calendarId: '1',
            title: 'First Event',
            category: 'time',
            start: new Date().toISOString(),
            end: new Date(Date.now() + 3600000).toISOString(),
        },
    ]);
}

export function addEvent(calendar, event) {
    calendar.createEvents([event]);
}