export function attachHandlers(calendar) {
    calendar.on('clickEvent', (e) => {
        alert('Clicked: ' + e.event.title);
    });

    calendar.on('beforeCreateEvent', (e) => {
        calendar.createEvents([e]);
    });
}