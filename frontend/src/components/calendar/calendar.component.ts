import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import multiMonthPlugin from '@fullcalendar/multimonth';
import interactionPlugin from '@fullcalendar/interaction';
import { ApiService } from '../../services/api.service';
import { MessageService } from '../../services/message.service';

interface CalendarEvent {
  title: string;
  start: string;
  allDay: boolean;
  extendedProps: {
    type: string;
    amount: number;
  };
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent {
  events: CalendarEvent[] = [];
  calendarOptions!: CalendarOptions;

  constructor(
    private apiService: ApiService,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
  // Előbb lekérjük az adatokat, aztán inicializáljuk a naptárat
  await this.getCalendarData();
  this.initCalendar();
}

  // Szimulált API-hívás / lokális adatforrás
  async getCalendarData() {
    const response = await this.apiService.selectAll('transactions');
    const data = response.data || [];
    console.log(data);

  this.events = data.map((x: { type: string; amount: { toLocaleString: (arg0: string) => any; }; date: any; }) => ({
    title: `${x.type === 'bevétel' ? '💰 Bevétel' : '💸 Kiadás'}: ${x.amount.toLocaleString('hu-HU')} Ft`,
    start: x.date,
    allDay: true,
    extendedProps: {
      type: x.type,
      amount: x.amount,
    },
  }));
}

// FullCalendar beállítások inicializálása
initCalendar() {
  this.calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, multiMonthPlugin],
    initialView: 'dayGridMonth', // <- fontos, hogy ne üres string legyen
    locale: 'hu',
    height: 600,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,multiMonthYear',
    },
    events: this.events,
    eventDisplay: 'block',

    // Egyedi eseménymegjelenítés (színes ikonok)
    eventContent: (arg) => {
      const { type, amount } = arg.event.extendedProps;
      const color = type === 'bevétel' ? '#4CAF50' : '#F44336';
      const icon = type === 'bevétel' ? '💰' : '💸';
      const html = `
          <div style="color: ${color}; font-weight: 600;">
            ${icon} ${amount.toLocaleString('hu-HU')} Ft
          </div>
        `;
      return { html };
    },
  };
}
}
