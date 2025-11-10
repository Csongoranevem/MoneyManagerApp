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
  isEditing: boolean = false;

  async ngOnInit(): Promise<void> {
    await this.getWallets();
    await this.getAllCategories();
    await this.getWalletBalance();
    await this.getWalletTransactions();
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
  }

  async getWallets() {
    const response = await this.apiService.select('wallets', this.userId);
    this.wallets = response.data;

  }

  async getWalletBalance() {

    const response = await this.apiService.select('wallets/balance', this.userId);
    const info = (response.data && response.data[0]) ? response.data[0] : null;
    if (info) {
      this.walletID = Number(info.walletID ?? info.walletId ?? this.walletID);
      this.walletBalance = Number(info.totalBalance ?? info.total_balance ?? 0);
    }
    console.log(this.walletBalance);
  }

  async getWalletTransactions() {
    const response = await this.apiService.select('transactions', this.walletID);
    const raw: any[] = response.data || [];
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
    this.newTransaction.walletID = this.walletID;
    this.newTransaction.categoryID = Number(this.newTransaction.categoryID);

    console.log('Adding transaction', this.newTransaction);
    const response = await this.apiService.postNew('transactions', this.newTransaction);
    if (response.status === 200) {
      await this.getWalletTransactions();
      await this.getWalletBalance();

      // reset form model
      this.newTransaction = {
        walletID: this.walletID,
        amount: 0,
        categoryID: this.categoryID,
        type: 'kiadás'
      };

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
    return category ? category.name : 'Ismeretlen';


  }

  getAllCategories(): void {
    this.apiService.selectAll('categories').then(response => {
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

// bootstrap modal megnyitasa
  modalOpen(): void {
    try {
      // @ts-ignore
      const modalEl = document.getElementById('exampleModal');
      // @ts-ignore
      const bsModal = window.bootstrap?.Modal.getInstance(modalEl) || (modalEl ? new window.bootstrap.Modal(modalEl) : null);
      bsModal?.show();
    } catch (e) { /* ignore if bootstrap not present */ }
  }

// tranzakció szerkesztése

  async editTransaction(transactionID: number): Promise<void> {


    this.apiService.select(`transactions/${this.walletID}`, transactionID).then(response => {
      const transaction = response.data && response.data[0] ? response.data[0] : null;
      this.newTransaction = {
        walletID: transaction.walletID,
        amount: transaction.amount,
        categoryID: transaction.categoryID,
        type: transaction.type
      };
      this.isEditing = true;
      this.modalOpen();
    });

  }

// tranzakció frissítése

  async updateTransaction(transactionID: number): Promise<void> {
    const response = await this.apiService.update('transactions', transactionID, this.newTransaction);
    
    const transaction = response.data
    if (transaction) {
      await this.getWalletTransactions();
      await this.getWalletBalance();
    }
  }


// tranzakció törlése

  async deleteTransaction(transactionID: number): Promise<void> {
    let confirmDelete = confirm("Biztosan törölni szeretnéd a tranzakciót?");
    if (!confirmDelete) {
      return;
    }
    const response = await this.apiService.delete('transactions', transactionID);
    if (response.status === 200) {
      await this.getWalletTransactions();
      await this.getWalletBalance();
    } else {
      console.error('Failed to delete transaction', response);
    }

  }

  // pénztárca kiválasztása
  async selectWallet(walletID: number): Promise<void> {
    this.walletID = Number(walletID ?? this.walletID);
    await this.getWalletTransactions();
    await this.getWalletBalance();
  }

}
