import { Component, OnInit, Output, output } from '@angular/core';
import { Category } from '../../interfaces/categories';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {


  categoriesData: Category[] = [];
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getCategories();
  }

  async getCategories(): Promise<void> {
    const response = await this.apiService.selectAll('categories');
    this.categories = response.data;
    console.log(this.categories);
  }

  addCategory(): void { 
    // implement adding a new category
  }

  editCategory(categoryID: number): void {
    // implement editing a category
  }

  deleteCategory(categoryID: number): void {
    // implement deleting a category
  }

  @Output() categories = this.categoriesData;
}
