import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Transaction } from '../../interfaces/transaction';
import { CommonModule } from '@angular/common';
import { Category } from '../../interfaces/categories';
import { Wallet } from '../../interfaces/wallet';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../services/message.service';
import * as bootstrap from 'bootstrap'
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  // Szerkesztési mód
  isEditing: boolean = false;

  async ngOnInit(): Promise<void> {
    await this.getWallets();
    await this.getAllCategories();
    await this.getWalletBalance();
    await this.getWalletTransactions();
  }

  // A bejelentkezett felhasználó azonosítója
  //szükséges változók a pénztárcák lekérdezéséhez

  userId: number = this.authService.getToken(); // login utan megkapja
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

  selectedTransactionID: number = 0;

  constructor(
    private apiService: ApiService,
    private messageService: MessageService,
    private authService: AuthService
  ) {
    this.walletBalance = 0;
  }

  // pénztárcák lekérdezése
  async getWallets() {
    const response = await this.apiService.select('wallets', this.userId);
    this.wallets = response.data;
    console.log(this.userId);

  }
  // pénztárca egyenleg lekérdezése
  async getWalletBalance() {
    const response = await this.apiService.select('transactions', this.walletID);
    const raw: any[] = response.data || [];
    const transactions = raw.map(r => ({
      ...r,
      ID: r.ID ?? r.id ?? r.Id,
      walletID: Number(r.walletID ?? r.walletId ?? this.walletID),
      categoryID: Number(r.categoryID ?? r.categoryId ?? r.CategoryID ?? 0),
      amount: Number(r.amount ?? 0)
    }));

    this.walletBalance = transactions.reduce((acc, tx) => {
      return tx.type === 'bevétel' ? acc + tx.amount : acc - tx.amount;
    }, 0);
  }
  // pénztárca tranzakciók lekérdezése
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
  // tranzakciók szűrése típus szerint
  filter(type: string): void {
    if (type === 'összes') {
      this.getWalletTransactions();
    } else {
      this.walletTransactions = this.walletTransactions.filter(tx => tx.type === type);
    }
  }
  // új tranzakció hozzáadása
  addTransaction(): void {
    // Validate and normalize transaction data
    const amount = Number(this.newTransaction.amount);
    if (isNaN(amount) || amount <= 0) {
      this.messageService.show('warning', 'Az összeg érvénytelen; a tranzakció hozzáadása megszakítva.', '');
      return;
    }


    // hozzáadás API hívás
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
  // kategóriák lekérdezése
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
  // kategória név lekérdezése ID alapján
  getCategoryName(categoryID: number): string {
    const category = this.categories?.find(c => c.id === categoryID);
    return category ? category.name : 'Ismeretlen';
  }

  // modal megnyitása
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
    // betöltjük a tranzakció adatait a modal ablakba
    this.newTransaction = this.walletTransactions.find(tx => tx.ID === transactionID) || this.newTransaction;
    const amount = Number(this.newTransaction.amount);
    if (isNaN(amount) || amount <= 0) {
      this.messageService.show('warning', 'Az összeg érvénytelen; a tranzakció hozzáadása megszakítva.', '');
      return;
    }


    // frissítés API hívás
    this.apiService.update('transactions', transactionID, { ...this.newTransaction }).then(response => {
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
  // tranzakció törlése
  async deleteTransaction(transactionID: number): Promise<void> {


    const response = await this.apiService.delete('transactions', transactionID);
    if (response.status === 200) {
      await this.getWalletTransactions();
      await this.getWalletBalance();
    } else {
      console.error('Failed to delete transaction', response);
    }
    const deleteModalEl = document.getElementById('deleteModal');
    if (deleteModalEl) {
      const modal = (bootstrap as any).Modal.getInstance(deleteModalEl) ?? new (bootstrap as any).Modal(deleteModalEl);
      modal?.hide();
    }

  }

  // pénztárca kiválasztása
  async selectWallet(walletID: number): Promise<void> {
    this.walletID = Number(walletID ?? this.walletID);
    await this.getWalletTransactions();
    await this.getWalletBalance();
  }

}
