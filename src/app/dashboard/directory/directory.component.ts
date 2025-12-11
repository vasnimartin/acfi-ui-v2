
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Member {
  name: string;
  email?: string; // Optional for privacy
  phone?: string;
  role: string;
  joinedYear: number;
}

@Component({
  selector: 'app-directory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="container">
        <div class="header-section">
          <h1>Member Directory</h1>
          <p>Connect with your church family.</p>
          
          <div class="search-bar">
            <i class="fa-solid fa-search"></i>
            <input type="text" [(ngModel)]="searchTerm" (input)="filterMembers()" placeholder="Search by name...">
          </div>
        </div>

        <div class="directory-list">
          <div autowidth class="member-card" *ngFor="let member of filteredMembers">
            <div class="avatar">
              {{ getInitials(member.name) }}
            </div>
            <div class="info">
              <h3>{{ member.name }}</h3>
              <span class="member-badge">{{ member.role }}</span>
              <p class="joined">Member since {{ member.joinedYear }}</p>
              
              <div class="contact-info">
                 <!-- Privacy check simulated -->
                 <p *ngIf="member.email"><i class="fa-solid fa-envelope"></i> {{ member.email }}</p>
                 <p *ngIf="member.phone"><i class="fa-solid fa-phone"></i> {{ member.phone }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 60px 0;
      background-color: #f9f9f9;
      min-height: 80vh;
    }

    .header-section {
      text-align: center;
      margin-bottom: 50px;
    }

    h1 {
      font-size: 2.5rem;
      color: #2c3e50;
      margin-bottom: 10px;
    }

    .search-bar {
      margin-top: 30px;
      position: relative;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    }

    .search-bar i {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: #95a5a6;
    }

    .search-bar input {
      width: 100%;
      padding: 12px 12px 12px 45px;
      border: 1px solid #ddd;
      border-radius: 50px;
      font-size: 1rem;
      transition: all 0.3s;
    }

    .search-bar input:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 10px rgba(52, 152, 219, 0.1);
    }

    .directory-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 25px;
    }

    .member-card {
      background: white;
      border-radius: 12px;
      padding: 25px;
      text-align: center;
      box-shadow: 0 5px 15px rgba(0,0,0,0.05);
      transition: transform 0.2s;
    }

    .member-card:hover {
      transform: translateY(-5px);
    }

    .avatar {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #3498db, #2980b9);
      color: white;
      border-radius: 50%;
      margin: 0 auto 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .member-badge {
      display: inline-block;
      background: #ecf0f1;
      color: #7f8c8d;
      font-size: 0.8rem;
      padding: 4px 10px;
      border-radius: 20px;
      margin-bottom: 10px;
    }

    h3 {
      color: #2c3e50;
      margin: 0 0 5px;
    }

    .joined {
      color: #95a5a6;
      font-size: 0.9rem;
      margin-bottom: 15px;
    }

    .contact-info p {
      color: #34495e;
      font-size: 0.9rem;
      margin: 5px 0;
    }

    .contact-info i {
      color: #3498db;
      margin-right: 5px;
    }
  `]
})
export class DirectoryComponent {
  searchTerm = '';
  members: Member[] = [
    { name: 'John Doe', role: 'Member', joinedYear: 2018, email: 'john@example.com' },
    { name: 'Jane Smith', role: 'Worship Leader', joinedYear: 2015, email: 'jane@example.com' },
    { name: 'Robert Johnson', role: 'Elder', joinedYear: 2010, phone: '(555) 555-5555' },
    { name: 'Emily Davis', role: 'Member', joinedYear: 2020 },
    { name: 'Michael Brown', role: 'Deacon', joinedYear: 2012, email: 'michael@example.com' },
    { name: 'Sarah Wilson', role: 'Sunday School', joinedYear: 2019 }
  ];

  filteredMembers = [...this.members];

  filterMembers() {
    this.filteredMembers = this.members.filter(m => 
      m.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
