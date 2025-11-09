export interface Transaction {
  ID?: number;
  walletID: number;
  amount: number;
  categoryID: number;
  type: 'bevétel' | 'kiadás';
}
