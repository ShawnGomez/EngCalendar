import { initCalendar } from './calendarFiles/init.js';
import { loadEvents } from './calendarFiles/events.js';
import { attachHandlers } from './calendarFiles/handlers.js';

const calendar = initCalendar();

loadEvents(calendar);
attachHandlers(calendar);