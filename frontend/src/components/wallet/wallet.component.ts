import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Transaction } from '../../interfaces/transaction';
import { CommonModule } from '@angular/common';
import { Category } from '../../interfaces/categories';
import { Wallet } from '../../interfaces/wallet';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {


  ngOnInit(): void {
    this.getWalletTransactions();
    this.getWallets();
    this.getWalletBalance();
    this.getAllCategories();
  }


  userId: number = 1; // login utan megkapja
  wallets: Wallet[] = [];
  walletID: number = 1;
  categoryID: number = 0;
  walletBalance: number = 0;
  walletTransactions: Transaction[] = [];
  @Input() categories: Category[] | null = null;


  newTransaction: Transaction = {
    walletID: this.walletID,
    amount: 0,
    categoryID: this.categoryID,
    type: 'kiadás'
  };

  constructor(private apiService: ApiService) {
    this.walletBalance = 0;
    this.getWalletBalance();
  }

  async getWallets() {
    const response = await this.apiService.select('wallets', this.userId);
    this.wallets = response.data;

  }

  async getWalletBalance() {

    const response = await this.apiService.select('wallets/balance', this.userId);
    this.walletID = response.data[0].walletID;
    this.walletBalance = response.data[0].totalBalance;
    console.log(this.walletBalance);
  }

  async getWalletTransactions() {
    const response = await this.apiService.select('transactions', this.walletID);
    const raw: any[] = response.data || [];
    // normalize items and always replace the array so Angular change detection picks it up
    this.walletTransactions = raw.map(r => ({
      ...r,
      ID: r.ID ?? r.id ?? r.Id,
      walletID: Number(r.walletID ?? r.walletId ?? this.walletID),
      categoryID: Number(r.categoryID ?? r.categoryId ?? r.CategoryID ?? 0),
      amount: Number(r.amount ?? 0)
    }));
  }

  filter(type: string): void {
    if (type === 'összes') {
      this.getWalletTransactions();
    } else {
      this.walletTransactions = this.walletTransactions.filter(tx => tx.type === type);
    }
  }

  async addTransaction(): Promise<void> {
    // ensure wallet and numeric fields are set correctly
    this.newTransaction.walletID = this.walletID;
    this.newTransaction.categoryID = Number(this.newTransaction.categoryID);

    console.log('Adding transaction', this.newTransaction);
    const response = await this.apiService.postNew('transactions', this.newTransaction);
    if (response.status === 200) {
      // re-fetch transactions and balance to ensure UI and aggregates are correct
      await this.getWalletTransactions();
      await this.getWalletBalance();

      // reset form model
      this.newTransaction = {
        walletID: this.walletID,
        amount: 0,
        categoryID: this.categoryID,
        type: 'kiadás'
      };

      // try to close bootstrap modal if available
      try {
        // @ts-ignore
        const modalEl = document.getElementById('exampleModal');
        // @ts-ignore
        const bsModal = window.bootstrap?.Modal.getInstance(modalEl) || (modalEl ? new window.bootstrap.Modal(modalEl) : null);
        bsModal?.hide();
      } catch (e) { /* ignore if bootstrap not present */ }
    } else {
      console.error('Failed to add transaction', response);
    }
  }

  getCategoryName(categoryID: number): string {
    const category = this.categories?.find(cat => cat.id === categoryID);
    // debug: if categories exist but id mismatch (DB returns ID) normalize in getAllCategories
    // console.log('lookup', categoryID, this.categories);
    return category ? category.name : 'Ismeretlen';


  }

  getAllCategories(): void {
    this.apiService.selectAll('categories').then(response => {
      // normalize database column names to { id, name }
      try {
        const raw: any[] = response.data || [];
        const normalized = raw.map(c => ({
          id: c.id ?? c.ID ?? c.Id ?? 0,
          name: c.name ?? c.Name ?? ''
        }));
        this.categories = normalized;
      } catch (e) {
        this.categories = response.data;
      }
    });
  }


  editTransaction(transactionID: number): void {
    // implement editing a transaction
  }

  async deleteTransaction(transactionID: number): Promise<void> {
    const response = await this.apiService.delete('transactions', transactionID);
    if (response.status === 200) {
      // re-fetch transactions and update balance
      await this.getWalletTransactions();
      await this.getWalletBalance();
    } else {
      console.error('Failed to delete transaction', response);
    }
    
  }

}
