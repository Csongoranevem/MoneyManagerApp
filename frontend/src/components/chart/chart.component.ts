import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { Users } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';
import { Wallet } from '../../interfaces/wallet';
import { MessageService } from '../../services/message.service';


// A táblád alapján készült interfész
interface WalletRecord {
  ID: number;
  walletID: number;
  amount: number;
  categoryID: number;
  type: 'bevétel' | 'kiadás';
}

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  labels: string[] = [];
  incomeData: number[] = [];
  expenseData: number[] = [];
  balanceData: number[] = [];

  wallets: WalletRecord[] = [];

  public lineChartData: any = {
    labels: this.labels,
    datasets: []
  };

  public lineChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Pénzügyi mozgások',
        font: { size: 18, weight: 'bold' }
      },
      legend: {
        labels: { font: { size: 13 } }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const val = context.parsed.y;
            return `${context.dataset.label}: ${val.toLocaleString('hu-HU')} Ft`;
          }
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Tranzakciók sorrendje' },
        ticks: { font: { size: 12 } }
      },
      y: {
        title: { display: true, text: 'Összeg (Ft)' },
        ticks: {
          callback: (value: any) => Number(value).toLocaleString('hu-HU')
        }
      },
      y1: {
        position: 'right',
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Kumulált egyenleg (Ft)' },
        ticks: {
          callback: (value: any) => Number(value).toLocaleString('hu-HU')
        }
      }
    }
  };

  async ngOnInit() {
    await this.loadChartData();
    this.updateChartDatasets();
    setTimeout(() => this.chart?.update(), 0);
  }

  async loadChartData(): Promise<void> {
    // 💾 Mock adatok a MySQL tábla alapján
    this.wallets = [
      { ID: 1, walletID: 3, amount: 74433, categoryID: 15, type: 'kiadás' },
      { ID: 2, walletID: 1, amount: 30000, categoryID: 2, type: 'kiadás' },
      { ID: 3, walletID: 3, amount: 8336, categoryID: 7, type: 'kiadás' },
      { ID: 4, walletID: 1, amount: 70239, categoryID: 3, type: 'bevétel' },
      { ID: 5, walletID: 3, amount: 24584, categoryID: 10, type: 'kiadás' },
      { ID: 6, walletID: 3, amount: 20657, categoryID: 1, type: 'kiadás' },
      { ID: 7, walletID: 3, amount: 25000, categoryID: 9, type: 'kiadás' },
      { ID: 8, walletID: 3, amount: 50000, categoryID: 10, type: 'bevétel' },
      { ID: 9, walletID: 4, amount: 10000, categoryID: 2, type: 'kiadás' },
      { ID: 10, walletID: 4, amount: 40000, categoryID: 4, type: 'bevétel' },
      { ID: 11, walletID: 5, amount: 4000, categoryID: 2, type: 'kiadás' },
      { ID: 12, walletID: 3, amount: 66301, categoryID: 3, type: 'bevétel' },
      { ID: 13, walletID: 3, amount: 66068, categoryID: 2, type: 'bevétel' },
      { ID: 14, walletID: 2, amount: 75246, categoryID: 2, type: 'kiadás' },
      { ID: 15, walletID: 3, amount: 58121, categoryID: 3, type: 'bevétel' },
      { ID: 16, walletID: 2, amount: 11200, categoryID: 9, type: 'kiadás' },
      { ID: 17, walletID: 3, amount: 67202, categoryID: 3, type: 'bevétel' },
      { ID: 18, walletID: 5, amount: 27220, categoryID: 5, type: 'kiadás' },
      { ID: 19, walletID: 3, amount: 31582, categoryID: 9, type: 'kiadás' },
      { ID: 20, walletID: 2, amount: 20896, categoryID: 5, type: 'kiadás' },
      { ID: 21, walletID: 3, amount: 12328, categoryID: 5, type: 'bevétel' }
    ];

    // címkék: T1, T2, T3, stb.
    this.labels = this.wallets.map((_, i) => `T${i + 1}`);

    this.incomeData = [];
    this.expenseData = [];
    this.balanceData = [];

    let cumBalance = 0;
    for (const tx of this.wallets) {
      if (tx.type === 'bevétel') {
        this.incomeData.push(tx.amount);
        this.expenseData.push(0);
        cumBalance += tx.amount;
      } else {
        this.expenseData.push(tx.amount);
        this.incomeData.push(0);
        cumBalance -= tx.amount;
      }
      this.balanceData.push(cumBalance);
    }
  }

  updateChartDatasets() {
    this.lineChartData = {
      labels: this.labels,
      datasets: [
        {
          label: 'Bevételek',
          data: this.incomeData,
          borderColor: 'rgb(28, 137, 240)',
          backgroundColor: 'rgba(76,175,80,0.1)',
          fill: false,
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 4
        },
        {
          label: 'Kiadások',
          data: this.expenseData,
          borderColor: 'rgb(184, 54, 244)',
          backgroundColor: 'rgba(244,67,54,0.1)',
          fill: false,
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 4
        },
       
      ]
    };
  }
}
