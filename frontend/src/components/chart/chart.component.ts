import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { MessageService } from '../../services/message.service';
import { Users } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';

// Interface for wallet transactions
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

  User:Users={
    ID:0,
    name: '',
    password: '',
    email: ''
  }
       
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

  constructor(
    private api: ApiService,
    private auth:AuthService,
    private message: MessageService
  ) {}

  async ngOnInit() {
    
    await this.loadChartData();
    this.updateChartDatasets();
    setTimeout(() => this.chart?.update(), 0);
  }

  async loadChartData(): Promise<void> {
    try {
      this.User = await this.auth.loggedUser()
      const res = await this.api.select('users/chart', this.User.ID!); //megfelelő adatok megszerzése
      const response = res.data || [];
      this.wallets = response as WalletRecord[];

      // X axis T1 t2
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

    } catch (error) {
     
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
        }
      ]
    };
  }
  
}
