import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-container">
      <!-- User Information Card with Navigation -->
      <div class="user-info-card">
        <div class="user-info-top">
          <div class="user-avatar">
            <div class="avatar-circle">
              <span class="avatar-logo">CC</span>
            </div>
          </div>
          <div class="user-contact">
            <div class="contact-item">
              <span class="contact-icon">✉</span>
              <span class="contact-text">{{ user?.email || 'user@example.com' }}</span>
            </div>
            <div class="contact-item">
              <span class="contact-icon">📞</span>
              <span class="contact-text">{{ phoneNumber || '9000001111' }}</span>
            </div>
          </div>
        </div>
        <!-- Navigation Tabs -->
        <div class="nav-tabs">
          <button 
            class="nav-tab" 
            [class.active]="activeTab === 'general'"
            (click)="activeTab = 'general'">
            General Info
          </button>
          <button 
            class="nav-tab" 
            [class.active]="activeTab === 'account'"
            (click)="activeTab = 'account'">
            Account Settings
          </button>
          <button 
            class="nav-tab" 
            [class.active]="activeTab === 'preferences'"
            (click)="activeTab = 'preferences'">
            My Preferences
          </button>
          <button 
            class="nav-tab" 
            [class.active]="activeTab === 'files'"
            (click)="activeTab = 'files'">
            Files
          </button>
          <button 
            class="nav-tab" 
            [class.active]="activeTab === 'subscription'"
            (click)="activeTab = 'subscription'">
            Subscription
          </button>
        </div>
      </div>

      <!-- General Info Section -->
      <div class="content-section" *ngIf="activeTab === 'general'">
        <h2 class="section-title">General Info</h2>
        <div class="form-fields">
          <div class="form-field">
            <label>First name</label>
            <input type="text" [(ngModel)]="firstName" placeholder="Enter first name" />
          </div>
          <div class="form-field">
            <label>Last name</label>
            <input type="text" [(ngModel)]="lastName" placeholder="Enter last name" />
          </div>
          <div class="form-field">
            <label>Mailing address</label>
            <input type="text" [(ngModel)]="mailingAddress" placeholder="Enter mailing address" />
          </div>
          <div class="form-field">
            <label>Alternative address</label>
            <input type="text" [(ngModel)]="alternativeAddress" placeholder="Enter alternative address" />
          </div>
          <div class="form-field">
            <label>Phone</label>
            <input type="text" [(ngModel)]="phoneNumber" placeholder="Enter phone number" />
          </div>
          <div class="form-field">
            <label>Alternative phone</label>
            <input type="text" [(ngModel)]="alternativePhone" placeholder="Enter alternative phone" />
          </div>
          <div class="form-field">
            <label>Date of birth</label>
            <input type="date" [(ngModel)]="dateOfBirth" />
          </div>
          <div class="form-field">
            <label>GST Number</label>
            <input type="text" [(ngModel)]="gstNumber" placeholder="Enter GST number" />
          </div>
          <div class="form-field form-field-gender">
            <label>Gender</label>
            <div class="radio-group">
              <label class="radio-label">
                <input type="radio" name="gender" value="male" [(ngModel)]="gender" />
                <span>Male</span>
              </label>
              <label class="radio-label">
                <input type="radio" name="gender" value="female" [(ngModel)]="gender" />
                <span>Female</span>
              </label>
            </div>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn-save" (click)="saveProfile()">
            <span class="save-icon">💾</span>
            <span>Save</span>
          </button>
        </div>
      </div>

      <!-- Account Settings Section -->
      <div class="content-section" *ngIf="activeTab === 'account'">
        <h2 class="section-title">Account Settings</h2>
        <div class="form-fields">
          <div class="form-field">
            <label>Email</label>
            <input type="text" [value]="user?.email || ''" readonly class="readonly-field" />
          </div>
          <div class="form-field">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" placeholder="Password" />
          </div>
          <div class="form-field">
            <label>Retype password</label>
            <input type="password" [(ngModel)]="retypePassword" placeholder="Retype password" />
          </div>
          <div class="form-field">
            <label>Role</label>
            <input type="text" value="CompanyAdmin" readonly class="readonly-field" />
          </div>
        </div>
        <div class="form-actions">
          <button class="btn-save" (click)="saveAccountSettings()">
            <span class="save-icon">💾</span>
            <span>Save</span>
          </button>
        </div>
      </div>

      <!-- My Preferences Section -->
      <div class="content-section" *ngIf="activeTab === 'preferences'">
        <h2 class="section-title">My Preferences</h2>
        <div class="form-fields">
          <div class="form-field">
            <label>Enable web notification</label>
            <select [(ngModel)]="enableWebNotification">
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div class="form-field">
            <label>Enable email notification</label>
            <select [(ngModel)]="enableEmailNotification">
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div class="form-field">
            <label>Language</label>
            <select [(ngModel)]="language">
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
            </select>
          </div>
          <div class="form-field">
            <label>Hide menus from topbar</label>
            <input type="text" [(ngModel)]="hiddenTopbarMenus" placeholder="Hidden topbar menus" />
          </div>
          <div class="form-field form-field-with-info">
            <div class="label-with-info">
              <label>Disable keyboard shortcuts</label>
              <button class="info-icon" title="Information about keyboard shortcuts">ℹ</button>
            </div>
            <select [(ngModel)]="disableKeyboardShortcuts">
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn-save" (click)="savePreferences()">
            <span class="save-icon">💾</span>
            <span>Save</span>
          </button>
        </div>
      </div>

      <!-- Files Section -->
      <div class="content-section" *ngIf="activeTab === 'files'">
        <div class="section-header">
          <h2 class="section-title">Files</h2>
          <button class="btn-add" (click)="addFiles()">
            <span>+ Add files</span>
          </button>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>File</th>
                <th>Size</th>
                <th>Uploaded by</th>
                <th>Created date</th>
                <th class="action-column">
                  <span class="menu-icon">☰</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="6" class="no-data">No record found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Subscription Section -->
      <div class="content-section" *ngIf="activeTab === 'subscription'">
        <!-- Subscription History -->
        <div class="subscription-section">
          <button class="btn-purchase" (click)="purchasePlan()">
            <span>+ Purchase Plan?</span>
          </button>
          <h3 class="subsection-title">Subscription History</h3>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Plan Name</th>
                  <th>Expires in Days</th>
                  <th>Total Entities</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Amount Paid</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colspan="8" class="no-data">No record found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Subscription Users -->
        <div class="subscription-section">
          <h3 class="subsection-title">
            <span class="icon">👥</span>
            Subscription Users
          </h3>
          
          <!-- Admin Section -->
          <div class="user-section">
            <h4 class="user-section-title">
              <span class="icon">👤</span>
              Admin
            </h4>
            <div class="admin-field">
              <input type="text" [value]="user?.email || 'dt34@gmail.com'" readonly class="readonly-field" />
              <span class="badge-admin">Admin</span>
            </div>
          </div>

          <!-- Sub-Users Section -->
          <div class="user-section">
            <div class="user-section-header">
              <h4 class="user-section-title">
                <span class="icon">👤</span>
                Sub-Users
              </h4>
              <button class="btn-add-subuser" (click)="addSubUser()">
                <span>Add Sub User?</span>
              </button>
            </div>
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Created Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colspan="6" class="no-data">No record found.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 1rem 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
      background: #f5f5f5;
      min-height: calc(100vh - 80px);
    }

    .user-info-card {
      background: white;
      border-radius: 8px;
      padding: 1rem 1.25rem;
      margin-bottom: 0.75rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .user-info-top {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding-bottom: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .user-avatar {
      flex-shrink: 0;
    }

    .avatar-circle {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: #1f3c88;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(31, 60, 136, 0.3);
    }

    .avatar-logo {
      color: white;
      font-size: 1.4rem;
      font-weight: 700;
      letter-spacing: 1.5px;
    }

    .user-contact {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .contact-icon {
      font-size: 1rem;
    }

    .contact-text {
      font-size: 0.95rem;
      color: #333;
    }

    .nav-tabs {
      display: flex;
      gap: 0;
      padding: 0;
    }

    .nav-tab {
      padding: 0.75rem 1.25rem;
      background: none;
      border: none;
      font-size: 0.95rem;
      font-weight: 500;
      color: #666;
      cursor: pointer;
      position: relative;
      transition: color 0.3s ease;
      border-bottom: 3px solid transparent;
      margin-bottom: -2px;
    }

    .nav-tab:hover {
      color: #1f3c88;
    }

    .nav-tab.active {
      color: #1f3c88;
      border-bottom-color: #1f3c88;
      font-weight: 600;
    }

    .content-section {
      background: white;
      border-radius: 8px;
      padding: 1.25rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f3c88;
      margin-bottom: 0.75rem;
    }

    .form-fields {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem 1.5rem;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-field-gender {
      grid-column: span 1;
    }

    .radio-group {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }

    .radio-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-weight: 400;
    }

    .radio-label input[type="radio"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: #1f3c88;
    }

    .radio-label span {
      color: #333;
      font-size: 0.95rem;
    }

    .form-field label {
      font-weight: 500;
      color: #333;
      font-size: 0.95rem;
    }

    .form-field input {
      padding: 0.75rem 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      font-size: 1rem;
      color: #333;
      transition: border-color 0.3s ease;
    }

    .form-field input:focus {
      outline: none;
      border-color: #1f3c88;
      box-shadow: 0 0 0 3px rgba(31, 60, 136, 0.1);
    }

    .form-field input::placeholder {
      color: #999;
    }

    .form-field select {
      padding: 0.75rem 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      font-size: 1rem;
      color: #333;
      background: white;
      cursor: pointer;
      transition: border-color 0.3s ease;
    }

    .form-field select:focus {
      outline: none;
      border-color: #1f3c88;
      box-shadow: 0 0 0 3px rgba(31, 60, 136, 0.1);
    }

    .readonly-field {
      background: #f5f5f5 !important;
      cursor: not-allowed;
    }

    .form-field-with-info {
      position: relative;
    }

    .label-with-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .info-icon {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #e0e0e0;
      border: none;
      color: #666;
      font-size: 0.75rem;
      cursor: help;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }

    .info-icon:hover {
      background: #d0d0d0;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .btn-add {
      padding: 0.5rem 1rem;
      background: white;
      border: 1px solid #333;
      border-radius: 4px;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-add:hover {
      background: #f5f5f5;
    }

    .table-container {
      overflow-x: auto;
      margin-top: 1rem;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
    }

    .data-table thead {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .data-table th {
      padding: 1rem;
      text-align: left;
      font-weight: 700;
      color: white;
      font-size: 0.95rem;
      border-bottom: 2px solid rgba(255, 255, 255, 0.2);
    }

    .data-table td {
      padding: 1rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      color: #333;
      font-size: 0.95rem;
    }

    .data-table tbody tr {
      background: #ffe5e5; /* Light pink */
    }

    .data-table tbody tr:nth-child(even) {
      background: #e5f0ff; /* Light blue */
    }

    .data-table tbody tr:hover {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.12), rgba(118, 75, 162, 0.12));
      transform: scale(1.01);
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .no-data {
      text-align: center;
      color: #999;
      padding: 2rem !important;
      font-style: italic;
    }

    .action-column {
      text-align: center;
      width: 50px;
    }

    .menu-icon {
      cursor: pointer;
      font-size: 1.2rem;
    }

    .subscription-section {
      margin-bottom: 2rem;
    }

    .subscription-section:last-child {
      margin-bottom: 0;
    }

    .btn-purchase {
      padding: 0.5rem 1rem;
      background: #1f3c88;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      margin-bottom: 1rem;
      transition: all 0.3s ease;
    }

    .btn-purchase:hover {
      background: #2a5298;
    }

    .subsection-title {
      font-size: 1.2rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .subsection-title .icon {
      font-size: 1.1rem;
    }

    .user-section {
      margin-bottom: 1.5rem;
    }

    .user-section:last-child {
      margin-bottom: 0;
    }

    .user-section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .user-section-title {
      font-size: 1rem;
      font-weight: 600;
      color: #333;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0;
    }

    .user-section-title .icon {
      font-size: 0.9rem;
    }

    .admin-field {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .admin-field input {
      flex: 1;
      max-width: 400px;
    }

    .badge-admin {
      padding: 0.25rem 0.75rem;
      background: #28a745;
      color: white;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .btn-add-subuser {
      padding: 0.5rem 1rem;
      background: #1f3c88;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-add-subuser:hover {
      background: #2a5298;
    }

    .placeholder-text {
      color: #666;
      font-size: 1rem;
      text-align: center;
      padding: 2rem 0;
    }

    .form-actions {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e9ecef;
    }

    .btn-save {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: #1f3c88;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-save:hover {
      background: #2a5298;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(31, 60, 136, 0.3);
    }

    .btn-save:active {
      transform: translateY(0);
    }

    .save-icon {
      font-size: 1.1rem;
    }

    @media (max-width: 1024px) {
      .form-fields {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .profile-container {
        padding: 1rem;
      }

      .user-info-card {
        flex-direction: column;
        text-align: center;
      }

      .nav-tabs {
        overflow-x: auto;
        flex-wrap: nowrap;
      }

      .nav-tab {
        white-space: nowrap;
        padding: 0.75rem 1rem;
      }

      .form-fields {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProfileComponent {
  private authService = inject(AuthService);
  
  user = this.authService.getCurrentUser();
  activeTab = 'general';
  
  firstName = '';
  lastName = '';
  mailingAddress = this.user?.email || '';
  alternativeAddress = '';
  phoneNumber = '9000001111';
  alternativePhone = '';
  dateOfBirth = '';
  gstNumber = '';
  gender = '';

  // Account Settings
  password = '';
  retypePassword = '';

  // My Preferences
  enableWebNotification = 'yes';
  enableEmailNotification = 'yes';
  language = 'english';
  hiddenTopbarMenus = 'Hidden topbar menus';
  disableKeyboardShortcuts = 'no';

  saveProfile(): void {
    // TODO: Implement save functionality
    console.log('Saving profile:', {
      firstName: this.firstName,
      lastName: this.lastName,
      mailingAddress: this.mailingAddress,
      alternativeAddress: this.alternativeAddress,
      phoneNumber: this.phoneNumber,
      alternativePhone: this.alternativePhone,
      dateOfBirth: this.dateOfBirth,
      gstNumber: this.gstNumber,
      gender: this.gender
    });
    alert('Profile saved successfully!');
  }

  saveAccountSettings(): void {
    if (this.password && this.password !== this.retypePassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Saving account settings:', {
      password: this.password,
      retypePassword: this.retypePassword
    });
    alert('Account settings saved successfully!');
  }

  savePreferences(): void {
    console.log('Saving preferences:', {
      enableWebNotification: this.enableWebNotification,
      enableEmailNotification: this.enableEmailNotification,
      language: this.language,
      hiddenTopbarMenus: this.hiddenTopbarMenus,
      disableKeyboardShortcuts: this.disableKeyboardShortcuts
    });
    alert('Preferences saved successfully!');
  }

  addFiles(): void {
    console.log('Add files clicked');
    // TODO: Implement file upload functionality
    alert('File upload feature coming soon!');
  }

  purchasePlan(): void {
    console.log('Purchase plan clicked');
    // TODO: Implement purchase plan functionality
    alert('Purchase plan feature coming soon!');
  }

  addSubUser(): void {
    console.log('Add sub user clicked');
    // TODO: Implement add sub user functionality
    alert('Add sub user feature coming soon!');
  }

  getTabTitle(): string {
    const titles: { [key: string]: string } = {
      'account': 'Account Settings',
      'preferences': 'My Preferences',
      'files': 'Files',
      'subscription': 'Subscription'
    };
    return titles[this.activeTab] || 'Profile';
  }
}

