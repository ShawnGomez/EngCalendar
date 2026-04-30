import Calendar from '@toast-ui/calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';

export function initCalendar() {
    return new Calendar('#calendar', {
        defaultView: 'month',
        usageStatistics: false,
    });
}