import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Transaction } from '../../interfaces/transaction';
import { CommonModule } from '@angular/common';
import { Category } from '../../interfaces/categories';
import { Wallet } from '../../interfaces/wallet';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../services/message.service';
import * as bootstrap from 'bootstrap'

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


  constructor(
    private apiService: ApiService,
    private messageService: MessageService
  ) {
    this.walletBalance = 0;
  }

  async getWallets() {
    const response = await this.apiService.select('wallets', this.userId);
    this.wallets = response.data;

  }

  async getWalletBalance() {
    const response = await this.apiService.select('wallets/balance', this.walletID);
    const info = (response.data && response.data[0]) ? response.data[0] : null;
    if (info) {
      this.walletID = Number(info.walletID ?? info.walletId ?? this.walletID);
      this.walletBalance = Number(info.balance ?? info.balance ?? 0);
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

  addTransaction(): void {
    // Validate and normalize transaction data
    const amount = Number(this.newTransaction.amount);
    if (isNaN(amount) || amount <= 0) {
      this.messageService.show('warning', 'Az összeg érvénytelen; a tranzakció hozzáadása megszakítva.', '');
      return;
    }



    this.apiService.postNew('transactions', this.newTransaction).then(response => {
      const addModalEl = document.getElementById('addModal');
      if (addModalEl) {
        const modal = bootstrap.Modal.getInstance(addModalEl) ?? new bootstrap.Modal(addModalEl);
        modal?.hide();
      }
      this.getWalletTransactions();
      this.getWalletBalance();
    });


    this.newTransaction = {
      walletID: this.walletID,
      amount: 0,
      categoryID: 0,
      type: 'kiadás'
    };
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

  getCategoryName(categoryID: number): string {
    const category = this.categories?.find(c => c.id === categoryID);
    return category ? category.name : 'Ismeretlen';
  }


  modalOpen(): void {
    try {
      // @ts-ignore
      const modalEl = document.getElementById('exampleModal');
      // @ts-ignore
      const bsModal = window.bootstrap?.Modal.getInstance(modalEl) || (modalEl ? new window.bootstrap.Modal(modalEl) : null);
      bsModal?.show();
    } catch (e) { /* ignore if bootstrap not present */ }
  }

  async editTransaction(transactionID: number): Promise<void> {
    // Validate and normalize transaction data
    const amount = Number(this.newTransaction.amount);
    if (isNaN(amount) || amount <= 0) {
      this.messageService.show('warning', 'Az összeg érvénytelen; a tranzakció hozzáadása megszakítva.', '');
      return;
    }



    this.apiService.update('transactions', transactionID, this.newTransaction).then(response => {
      const addModalEl = document.getElementById('addModal');
      if (addModalEl) {
        const modal = bootstrap.Modal.getInstance(addModalEl) ?? new bootstrap.Modal(addModalEl);
        modal?.hide();
      }
      this.getWalletTransactions();
      this.getWalletBalance();
    });


    this.newTransaction = {
      walletID: this.walletID,
      amount: 0,
      categoryID: 0,
      type: 'kiadás'
    };

  }

  async updateTransaction(transactionID: number): Promise<void> {
    const response = await this.apiService.update('transactions', transactionID, this.newTransaction);

    const transaction = response.data
    if (transaction) {
      await this.getWalletTransactions();
      await this.getWalletBalance();
    }
  }

  async deleteTransaction(transactionID: number): Promise<void> {
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
