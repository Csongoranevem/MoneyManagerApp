import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Resp } from '../../interfaces/response';


interface WeatherEvent {
  weather: string;
  temp: number;
  date: string;
  iconUrl?: string;
}

interface CalendarEvent {
  title: string;
  start: string;
  allDay: boolean;
  extendedProps: {
    weather: string;
    icon?: string;
  };
}


@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  events: any[] = [];
  userId!: number; // or string, depending on your login logic
  calendarOptions: any;

  constructor(private api: ApiService) {}

  async ngOnInit() {
    await this.getCalendarData();
    this.initCalendar();
  }

  async getCalendarData() {
    this.events = [];
    try {
      const result: Resp = await this.api.select('wallets', this.userId);
      console.log(result)
      if (result.status === 200 && Array.isArray(result.data)) {
        result.data.forEach((x: WeatherEvent) => {
          const event = {
            title: ``,
            start: x.date,
            allDay: false,
            extendedProps: {
              cimke: "",
              icon: x.iconUrl
            }
          };
          this.events.push(event);
        });
      } 
    } catch (err) {
      console.error('Hiba történt!', err);
    }
  }

  initCalendar() {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev today next',
        center: 'title',
        right: 'timeGridDay,timeGridWeek,dayGridMonth,multiMonthYear'
      },
      locale: 'hu',
      eventTextColor: 'purple',
      events: this.events,
      eventContent: (arg: any) => {
       ;

        let innerHtml = '';
        

        innerHtml += `<span>${arg.event.title}</span>`;
        return { html: innerHtml };
      }
    };
  }
}
