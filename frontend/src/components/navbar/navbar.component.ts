import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isDark = true;

  ngOnInit(): void {
    try {
      const stored = localStorage.getItem('theme');
      const attr = stored || (document.documentElement.getAttribute('data-bs-theme') || document.body.getAttribute('data-bs-theme') || 'dark');
      this.isDark = attr === 'dark';
      // ensure both html and body are set
      document.documentElement.setAttribute('data-bs-theme', attr);
      if (document.body) document.body.setAttribute('data-bs-theme', attr);
    } catch (e) {
      // ignore
    }
  }

  toggleTheme(): void {
    // if currently dark -> switch to light, otherwise switch to dark
    const newTheme = this.isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    if (document.body) document.body.setAttribute('data-bs-theme', newTheme);
    try { localStorage.setItem('theme', newTheme); } catch (e) { }
    this.isDark = !this.isDark;
  }

}
