import { Component, OnInit } from '@angular/core';
import { Category } from '../../interfaces/categories';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  newCategory: Category = {
    id: 0,
    name: 'Új kategória'
  };
  categoryId: number = 0;
  categories: Category[] = [];
  constructor(
    private apiService: ApiService,
    private messageService: MessageService
  ) { }

  selectedCategoryId: number = 0;

  openDeleteModal(id: number) {
    this.selectedCategoryId = id;
  }


    openAddModal() {
      this.newCategory = {
        id: 0,
        name: ''
      };
    }


  ngOnInit(): void {
    this.getAllCategories();
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



  addCategory(): void {
    // Validate and normalize name
    const name = (this.newCategory.name || '').trim();
    if (!name) {
      this.messageService.show('warning', 'Kategória neve üres; a hozzáadás megszakítva.', '');
      return;
    }
    this.apiService.postNew('categories', { name })
      .then(() => {
        const addModalEl = document.getElementById('addModal');
        if (addModalEl) {
          const modal = (bootstrap as any).Modal.getInstance(addModalEl) ?? new (bootstrap as any).Modal(addModalEl);
          modal?.hide();
        }
        // refresh list
        this.getAllCategories();
      })
      .catch(err => {
        this.messageService.show('danger','Kategória hozzáadása sikertelen: ', (err?.msg || 'Ismeretlen hiba'));
      });
  }

  editCategory(categoryID: number): void {
    const category = this.categories.find(c => c.id === categoryID);
    if (category) {
      this.newCategory = { ...category };
    }
    this.apiService.update('categories', categoryID, { ...this.newCategory }).then(() => {
      const addModalEl = document.getElementById('addModal');
      if (addModalEl) {
        const modal = (bootstrap as any).Modal.getInstance(addModalEl) ?? new (bootstrap as any).Modal(addModalEl);
        modal?.hide();
      }
      this.getAllCategories();
    });
  }

  deleteCategory(categoryID: number): void {
    //kategória törlése (meg kell kérdezni a felhasználót modal ablakban)
    this.apiService.delete('categories', categoryID).then(() => {
      //modal bezárása
      const deleteModalEl = document.getElementById('deleteModal');
      if (deleteModalEl) {
        const modal = (bootstrap as any).Modal.getInstance(deleteModalEl) ?? new (bootstrap as any).Modal(deleteModalEl);
        modal?.hide();
      }
      this.getAllCategories(); //frissítjük a kategória listát
    });
  }

}
