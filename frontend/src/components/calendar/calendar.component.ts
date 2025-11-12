import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import multiMonthPlugin from '@fullcalendar/multimonth';
import interactionPlugin from '@fullcalendar/interaction';

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

  async ngOnInit() {
    // Előbb lekérjük az adatokat, aztán inicializáljuk a naptárat
    await this.getCalendarData();
    this.initCalendar();
  }

  // Szimulált API-hívás / lokális adatforrás
  async getCalendarData() {
    const data = [
      { date: '2025-11-01', type: 'bevétel', amount: 50000 },
      { date: '2025-11-03', type: 'kiadás', amount: 12000 },
      { date: '2025-11-04', type: 'kiadás', amount: 8000 },
      { date: '2025-11-06', type: 'bevétel', amount: 40000 },
      { date: '2025-11-08', type: 'kiadás', amount: 15000 },
      { date: '2025-11-09', type: 'bevétel', amount: 100000 },
      { date: '2025-11-12', type: 'kiadás', amount: 22000 },
      { date: '2025-11-15', type: 'bevétel', amount: 25000 },
    ];

    this.events = data.map((x) => ({
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
      plugins: [dayGridPlugin, timeGridPlugin, multiMonthPlugin, interactionPlugin],
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
