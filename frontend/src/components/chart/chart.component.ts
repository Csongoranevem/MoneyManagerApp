import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Chart, registerables } from 'chart.js';
//import { BaseChartDirective } from 'ng2-charts';


//Chart.register(...registerables);

interface WalletRecord {
  id: number;
  date: string;      // ISO date string expected
  amount: number;    // positive = bevétel, negative = kiadás
  category?: string;
  description?: string;
  // add other fields as returned by your backend
}

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent {
  //@ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  userId!: number; // állítsd be a bejelentkezett user id-jét
  labels: string[] = [];
  incomeData: number[] = [];
  expenseData: number[] = [];
  balanceData: number[] = [];
  rawRecords: WalletRecord[] = [];

  // Chart.js options (ng2-charts kompatibilis)
  public lineChartData: any = {
    labels: this.labels,
    datasets: [
      {
        label: 'Bevételek',
        data: this.incomeData,
        fill: false,
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 4
      },
      {
        label: 'Kiadások',
        data: this.expenseData,
        fill: false,
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 4
      },
      {
        label: 'Kumulált egyenleg',
        data: this.balanceData,
        fill: false,
        borderWidth: 2,
        tension: 0.2,
        pointRadius: 0,
        yAxisID: 'y1'
      }
    ]
  };

  public lineChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Pénzügyi mozgások (napi bontás)',
        font: { size: 18, weight: 'bold' }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const val = context.parsed.y;
            return `${context.dataset.label}: ${val.toLocaleString('hu-HU')} Ft`;
          }
        }
      },
      legend: {
        labels: { font: { size: 13 } }
      }
    },
    scales: {
      x: {
        ticks: { maxRotation: 0, font: { size: 12 } },
        title: { display: true, text: 'Dátum' }
      },
      y: {
        position: 'left',
        title: { display: true, text: 'Összeg (Ft)' },
        ticks: { callback: (value: any) => Number(value).toLocaleString('hu-HU') }
      },
      y1: {
        position: 'right',
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Kumulált egyenleg (Ft)' },
        ticks: { callback: (value: any) => Number(value).toLocaleString('hu-HU') }
      }
    }
  };

  constructor(private api: ApiService) {}

  async ngOnInit() {
    await this.loadChartData();
    this.updateChartDatasets();
  }

  // Betölti a backend adatait (API: GET /wallets/:userId vagy hasonló)
  async loadChartData(): Promise<void> {
    try {
      const resp = await this.api.select('wallets', this.userId);
      if (resp.status === 200 && Array.isArray(resp.data)) {
        // Feltételezzük, hogy resp.data WalletRecord[] szerkezetű
        this.rawRecords = resp.data as WalletRecord[];

        // rendezés dátum szerint (asc)
        this.rawRecords.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Átalakítás napi aggregátumra (ha több tétel ugyanazon a napon)
        const map = new Map<string, { income: number; expense: number }>();
        for (const r of this.rawRecords) {
          const day = new Date(r.date).toISOString().slice(0, 10); // YYYY-MM-DD
          const existing = map.get(day) ?? { income: 0, expense: 0 };
          if (r.amount >= 0) existing.income += r.amount;
          else existing.expense += Math.abs(r.amount); // kiadás pozitívban tárolva
          map.set(day, existing);
        }

        // Kihúzzuk a címkéket (dátumok) és a dataset-eket
        this.labels = Array.from(map.keys());
        this.incomeData = [];
        this.expenseData = [];
        this.balanceData = [];

        let cumBalance = 0;
        for (const day of this.labels) {
          const val = map.get(day)!;
          this.incomeData.push(Math.round(val.income));
          this.expenseData.push(Math.round(val.expense));
          cumBalance += (val.income - val.expense);
          this.balanceData.push(Math.round(cumBalance));
        }
      } else {
        console.warn('Unexpected response from API:', resp);
      }
    } catch (err) {
      console.error('Hiba történt a chart adatlekéréskor', err);
      // értesítés / UI feedback ide
    }
  }

  // Frissíti a chart komponens adatstruktúráját
  updateChartDatasets() {
    this.lineChartData = {
      labels: this.labels,
      datasets: [
        {
          label: 'Bevételek',
          data: this.incomeData,
          borderColor: 'rgb(76,175,80)',
          backgroundColor: 'rgba(76,175,80,0.1)',
          fill: false,
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 4
        },
        {
          label: 'Kiadások',
          data: this.expenseData,
          borderColor: 'rgb(244,67,54)',
          backgroundColor: 'rgba(244,67,54,0.08)',
          fill: false,
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 4
        },
        {
          label: 'Kumulált egyenleg',
          data: this.balanceData,
          borderColor: 'rgb(33,150,243)',
          backgroundColor: 'rgba(33,150,243,0.05)',
          fill: false,
          borderWidth: 2,
          tension: 0.2,
          pointRadius: 0,
          yAxisID: 'y1'
        }
      ]
    };

    
    //setTimeout(() => this.chart?.update(), 0);
  }
}
