import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="app-container">
      <header class="app-header">
        <div class="header-content">
          <h1 class="app-title">מערכת ניהול לידים</h1>
          <nav class="app-nav">
            <a routerLink="/leads" class="nav-link">לידים</a>
            <a routerLink="/clients" class="nav-link">לקוחות</a>
          </nav>
        </div>
      </header>

      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .app-container {
        min-height: 100vh;
        background: #f5f5f5;
      }

      .app-header {
        background: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        padding: 0 20px;
      }

      .header-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 64px;
      }

      .app-title {
        margin: 0;
        color: #333;
        font-size: 20px;
        font-weight: 600;
      }

      .app-nav {
        display: flex;
        gap: 20px;
      }

      .nav-link {
        color: #666;
        text-decoration: none;
        padding: 8px 16px;
        border-radius: 4px;
        transition: background-color 0.2s;
      }

      .nav-link:hover {
        background: #f0f0f0;
        color: #333;
      }

      .app-main {
        padding: 20px 0;
      }
    `,
  ],
})
export class AppComponent {
  title = 'leads-management-app';
}
