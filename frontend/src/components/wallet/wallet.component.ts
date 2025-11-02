import { Component, Input, input, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Transaction } from '../../interfaces/transaction';
import { CommonModule } from '@angular/common';
import { Category } from '../../interfaces/categories';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css'
})
export class WalletComponent implements OnInit {
  

  ngOnInit(): void {
    this.getWalletTransactions();
  }

  walletBalance: number = 0;
  walletTransactions: Transaction[] = [];
  @Input() categories: Category[] | null = null;

  constructor(private apiService: ApiService) {
    this.walletBalance = 0;
    this.getWalletBalance();
  }

  async getWalletBalance() {
    const response = await this.apiService.selectAll('wallets');
    this.walletBalance = response.data.balance;
  }

  async getWalletTransactions() {
    const response = await this.apiService.selectAll('transactions');
    this.walletTransactions = response.data;
  }

  filter(type: string): void {
    if (type === 'összes') {
      this.getWalletTransactions();

    } else {
      this.walletTransactions = this.walletTransactions.filter(tx => tx.type === type);
    }
  }

  addTransaction(): void {
    // implement adding a new transaction
  }

  getCategoryName(categoryID: number): string {
    console.log(this.categories);
    const category = this.categories?.find(cat => cat.id === categoryID);
    return category ? category.name : 'Ismeretlen';

  
  }


  editTransaction(transactionID: number): void {
    // implement editing a transaction
  }

  async deleteTransaction(transactionID: number): Promise<void> {
    const response = await this.apiService.delete('transactions', transactionID);
    if (response.status === 200) {
      this.walletTransactions = this.walletTransactions.filter(tx => tx.ID !== transactionID);
    }
    this.ngOnInit();
  }

}
