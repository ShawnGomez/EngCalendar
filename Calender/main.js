import Calendar from '@toast-ui/calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';

const calendar = new Calendar('#calendar', {
    defaultView: 'month',
    usageStatistics: false,
});

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