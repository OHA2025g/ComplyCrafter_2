import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../shared/alert/alert.service';
import { UserProfileModel } from '../shared/common-models';
import { environment } from '../../environments/environment';

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
        [class.active]="activeTab === 'Account'"
        (click)="setActiveTab('Account')">
        Account Settings
      </button>
      <button 
        class="nav-tab" 
        [class.active]="activeTab === 'Preferences'"
        (click)="setActiveTab('Preferences')">
        My Preferences
      </button>
      <button 
        class="nav-tab" 
        [class.active]="activeTab === 'Files'"
        (click)="setActiveTab('Files')">
        Files
      </button>
      <button 
        class="nav-tab" 
        [class.active]="activeTab === 'Subscription'"
        (click)="setActiveTab('Subscription')">
        Subscription
      </button>
    </div>
  </div>

  <!-- General Info Section -->
  <div *ngIf="activeTab === 'general'">
    <!-- <h2 class="card-title">General Info</h2> -->
    <div class="content-section">
      <div class="section-header-with-action">
        <div class="action-buttons">
          <div class="menu-container" *ngIf="!isEditingGeneralInfo">
            <button class="btn-menu" (click)="toggleMenu('general'); $event.stopPropagation()" title="Menu">
              <span class="menu-icon">⋯</span>
            </button>
            <div class="menu-dropdown" *ngIf="openMenu === 'general'" (click)="$event.stopPropagation()">
              <button class="menu-item" (click)="enableEditMode(); closeMenu()">
                <span class="menu-item-icon">✏️</span>
                <span>Edit Details</span>
              </button>
            </div>
          </div>
          <div *ngIf="isEditingGeneralInfo" class="edit-mode-buttons">
            <button class="btn-back" (click)="cancelEdit()" title="Back to View">
              <span>Back</span>
            </button>
            <button class="btn-cancel" (click)="cancelEdit()" title="Cancel">
              <span>Cancel</span>
            </button>
            <button class="btn-save" (click)="saveProfile()" [disabled]="isSaving">
              <span *ngIf="!isSaving">Save</span>
              <span *ngIf="isSaving" class="save-loader">
                <span class="spinner"></span>
                <span>Saving...</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    
    <!-- Informative View (Read-only display with inline edit) -->
    <div class="info-display" *ngIf="!isEditingGeneralInfo">
      <div class="info-row" (mouseenter)="hoveredField = 'firstName'" (mouseleave)="hoveredField = null">
        <span class="info-label">First Name :</span>
        <span class="info-value" *ngIf="editingField !== 'firstName'">
          {{ firstName || '—' }}
          <button class="inline-edit-btn" *ngIf="hoveredField === 'firstName'" (click)="startInlineEdit('firstName')" title="Edit">
            <span class="edit-icon-small">✏️</span>
          </button>
        </span>
        <div class="inline-edit-container" *ngIf="editingField === 'firstName'">
          <input type="text" [(ngModel)]="firstName" class="inline-input" (blur)="saveInlineField('firstName')" (keyup.enter)="saveInlineField('firstName')" (keyup.escape)="cancelInlineEdit('firstName')" #firstNameInput />
          <div class="inline-edit-actions">
            <button class="inline-save-btn" (click)="saveInlineField('firstName')" title="Save">✓</button>
            <button class="inline-cancel-btn" (click)="cancelInlineEdit('firstName')" title="Cancel">✕</button>
          </div>
        </div>
      </div>
      <div class="info-row" (mouseenter)="hoveredField = 'lastName'" (mouseleave)="hoveredField = null">
        <span class="info-label">Last Name :</span>
        <span class="info-value" *ngIf="editingField !== 'lastName'">
          {{ lastName || '—' }}
          <button class="inline-edit-btn" *ngIf="hoveredField === 'lastName'" (click)="startInlineEdit('lastName')" title="Edit">
            <span class="edit-icon-small">✏️</span>
          </button>
        </span>
        <div class="inline-edit-container" *ngIf="editingField === 'lastName'">
          <input type="text" [(ngModel)]="lastName" class="inline-input" (blur)="saveInlineField('lastName')" (keyup.enter)="saveInlineField('lastName')" (keyup.escape)="cancelInlineEdit('lastName')" #lastNameInput />
          <div class="inline-edit-actions">
            <button class="inline-save-btn" (click)="saveInlineField('lastName')" title="Save">✓</button>
            <button class="inline-cancel-btn" (click)="cancelInlineEdit('lastName')" title="Cancel">✕</button>
          </div>
        </div>
      </div>
      <div class="info-row" (mouseenter)="hoveredField = 'mailingAddress'" (mouseleave)="hoveredField = null">
        <span class="info-label">Mailing Address :</span>
        <span class="info-value" *ngIf="editingField !== 'mailingAddress'">
          {{ mailingAddress || '—' }}
          <button class="inline-edit-btn" *ngIf="hoveredField === 'mailingAddress'" (click)="startInlineEdit('mailingAddress')" title="Edit">
            <span class="edit-icon-small">✏️</span>
          </button>
        </span>
        <div class="inline-edit-container" *ngIf="editingField === 'mailingAddress'">
          <input type="text" [(ngModel)]="mailingAddress" class="inline-input" (blur)="saveInlineField('mailingAddress')" (keyup.enter)="saveInlineField('mailingAddress')" (keyup.escape)="cancelInlineEdit('mailingAddress')" #mailingAddressInput />
          <div class="inline-edit-actions">
            <button class="inline-save-btn" (click)="saveInlineField('mailingAddress')" title="Save">✓</button>
            <button class="inline-cancel-btn" (click)="cancelInlineEdit('mailingAddress')" title="Cancel">✕</button>
          </div>
        </div>
      </div>
      <div class="info-row" (mouseenter)="hoveredField = 'alternativeAddress'" (mouseleave)="hoveredField = null">
        <span class="info-label">Alternative Address :</span>
        <span class="info-value" *ngIf="editingField !== 'alternativeAddress'">
          {{ alternativeAddress || '—' }}
          <button class="inline-edit-btn" *ngIf="hoveredField === 'alternativeAddress'" (click)="startInlineEdit('alternativeAddress')" title="Edit">
            <span class="edit-icon-small">✏️</span>
          </button>
        </span>
        <div class="inline-edit-container" *ngIf="editingField === 'alternativeAddress'">
          <input type="text" [(ngModel)]="alternativeAddress" class="inline-input" (blur)="saveInlineField('alternativeAddress')" (keyup.enter)="saveInlineField('alternativeAddress')" (keyup.escape)="cancelInlineEdit('alternativeAddress')" #alternativeAddressInput />
          <div class="inline-edit-actions">
            <button class="inline-save-btn" (click)="saveInlineField('alternativeAddress')" title="Save">✓</button>
            <button class="inline-cancel-btn" (click)="cancelInlineEdit('alternativeAddress')" title="Cancel">✕</button>
          </div>
        </div>
      </div>
      <div class="info-row" (mouseenter)="hoveredField = 'phoneNumber'" (mouseleave)="hoveredField = null">
        <span class="info-label">Phone :</span>
        <span class="info-value" *ngIf="editingField !== 'phoneNumber'">
          {{ phoneNumber || '—' }}
          <button class="inline-edit-btn" *ngIf="hoveredField === 'phoneNumber'" (click)="startInlineEdit('phoneNumber')" title="Edit">
            <span class="edit-icon-small">✏️</span>
          </button>
        </span>
        <div class="inline-edit-container" *ngIf="editingField === 'phoneNumber'">
          <input type="text" [(ngModel)]="phoneNumber" class="inline-input" (blur)="saveInlineField('phoneNumber')" (keyup.enter)="saveInlineField('phoneNumber')" (keyup.escape)="cancelInlineEdit('phoneNumber')" #phoneNumberInput />
          <div class="inline-edit-actions">
            <button class="inline-save-btn" (click)="saveInlineField('phoneNumber')" title="Save">✓</button>
            <button class="inline-cancel-btn" (click)="cancelInlineEdit('phoneNumber')" title="Cancel">✕</button>
          </div>
        </div>
      </div>
      <div class="info-row" (mouseenter)="hoveredField = 'alternativePhone'" (mouseleave)="hoveredField = null">
        <span class="info-label">Alternative Phone :</span>
        <span class="info-value" *ngIf="editingField !== 'alternativePhone'">
          {{ alternativePhone || '—' }}
          <button class="inline-edit-btn" *ngIf="hoveredField === 'alternativePhone'" (click)="startInlineEdit('alternativePhone')" title="Edit">
            <span class="edit-icon-small">✏️</span>
          </button>
        </span>
        <div class="inline-edit-container" *ngIf="editingField === 'alternativePhone'">
          <input type="text" [(ngModel)]="alternativePhone" class="inline-input" (blur)="saveInlineField('alternativePhone')" (keyup.enter)="saveInlineField('alternativePhone')" (keyup.escape)="cancelInlineEdit('alternativePhone')" #alternativePhoneInput />
          <div class="inline-edit-actions">
            <button class="inline-save-btn" (click)="saveInlineField('alternativePhone')" title="Save">✓</button>
            <button class="inline-cancel-btn" (click)="cancelInlineEdit('alternativePhone')" title="Cancel">✕</button>
          </div>
        </div>
      </div>
      <div class="info-row" (mouseenter)="hoveredField = 'dateOfBirth'" (mouseleave)="hoveredField = null">
        <span class="info-label">Date of Birth :</span>
        <span class="info-value" *ngIf="editingField !== 'dateOfBirth'">
          {{ formatDate(dateOfBirth) || '—' }}
          <button class="inline-edit-btn" *ngIf="hoveredField === 'dateOfBirth'" (click)="startInlineEdit('dateOfBirth')" title="Edit">
            <span class="edit-icon-small">✏️</span>
          </button>
        </span>
        <div class="inline-edit-container" *ngIf="editingField === 'dateOfBirth'">
          <input type="date" [(ngModel)]="dateOfBirth" class="inline-input" (blur)="saveInlineField('dateOfBirth')" (keyup.enter)="saveInlineField('dateOfBirth')" (keyup.escape)="cancelInlineEdit('dateOfBirth')" #dateOfBirthInput />
          <div class="inline-edit-actions">
            <button class="inline-save-btn" (click)="saveInlineField('dateOfBirth')" title="Save">✓</button>
            <button class="inline-cancel-btn" (click)="cancelInlineEdit('dateOfBirth')" title="Cancel">✕</button>
          </div>
        </div>
      </div>
      <div class="info-row" (mouseenter)="hoveredField = 'gstNumber'" (mouseleave)="hoveredField = null">
        <span class="info-label">GST Number :</span>
        <span class="info-value" *ngIf="editingField !== 'gstNumber'">
          {{ gstNumber || '—' }}
          <button class="inline-edit-btn" *ngIf="hoveredField === 'gstNumber'" (click)="startInlineEdit('gstNumber')" title="Edit">
            <span class="edit-icon-small">✏️</span>
          </button>
        </span>
        <div class="inline-edit-container" *ngIf="editingField === 'gstNumber'">
          <input type="text" [(ngModel)]="gstNumber" class="inline-input" (blur)="saveInlineField('gstNumber')" (keyup.enter)="saveInlineField('gstNumber')" (keyup.escape)="cancelInlineEdit('gstNumber')" #gstNumberInput />
          <div class="inline-edit-actions">
            <button class="inline-save-btn" (click)="saveInlineField('gstNumber')" title="Save">✓</button>
            <button class="inline-cancel-btn" (click)="cancelInlineEdit('gstNumber')" title="Cancel">✕</button>
          </div>
        </div>
      </div>
      <div class="info-row" (mouseenter)="hoveredField = 'gender'" (mouseleave)="hoveredField = null">
        <span class="info-label">Gender :</span>
        <span class="info-value" *ngIf="editingField !== 'gender'">
          {{ gender || '—' }}
          <button class="inline-edit-btn" *ngIf="hoveredField === 'gender'" (click)="startInlineEdit('gender')" title="Edit">
            <span class="edit-icon-small">✏️</span>
          </button>
        </span>
        <div class="inline-edit-container" *ngIf="editingField === 'gender'">
          <select [(ngModel)]="gender" class="inline-input" (blur)="saveInlineField('gender')" (keyup.escape)="cancelInlineEdit('gender')" #genderInput>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <div class="inline-edit-actions">
            <button class="inline-save-btn" (click)="saveInlineField('gender')" title="Save">✓</button>
            <button class="inline-cancel-btn" (click)="cancelInlineEdit('gender')" title="Cancel">✕</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Edit Mode (Form inputs) -->
    <div class="form-fields" *ngIf="isEditingGeneralInfo">
      <div class="form-field">
        <label>First name</label>
        <input 
          type="text" 
          [(ngModel)]="firstName" 
          placeholder="Enter first name" />
      </div>
      <div class="form-field">
        <label>Last name</label>
        <input 
          type="text" 
          [(ngModel)]="lastName" 
          placeholder="Enter last name" />
      </div>
      <div class="form-field">
        <label>Mailing address</label>
        <input 
          type="text" 
          [(ngModel)]="mailingAddress" 
          placeholder="Enter mailing address" />
      </div>
      <div class="form-field">
        <label>Alternative address</label>
        <input 
          type="text" 
          [(ngModel)]="alternativeAddress" 
          placeholder="Enter alternative address" />
      </div>
      <div class="form-field">
        <label>Phone</label>
        <input 
          type="text" 
          [(ngModel)]="phoneNumber" 
          placeholder="Enter phone number" />
      </div>
      <div class="form-field">
        <label>Alternative phone</label>
        <input 
          type="text" 
          [(ngModel)]="alternativePhone" 
          placeholder="Enter alternative phone" />
      </div>
      <div class="form-field">
        <label>Date of birth</label>
        <input 
          type="date" 
          [(ngModel)]="dateOfBirth" />
      </div>
      <div class="form-field">
        <label>GST Number</label>
        <input 
          type="text" 
          [(ngModel)]="gstNumber" 
          placeholder="Enter GST number" />
      </div>
      <div class="form-field form-field-gender">
        <label>Gender</label>
        <div class="radio-group">
          <label class="radio-label">
            <input 
              type="radio" 
              name="gender" 
              value="Male" 
              [(ngModel)]="gender" />
            <span>Male</span>
          </label>
          <label class="radio-label">
            <input 
              type="radio" 
              name="gender" 
              value="Female" 
              [(ngModel)]="gender" />
            <span>Female</span>
          </label>
          <label class="radio-label">
            <input 
              type="radio" 
              name="gender" 
              value="Other" 
              [(ngModel)]="gender" />
            <span>Other</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Account Settings Section -->
<div *ngIf="activeTab === 'Account'">
  <!-- <h2 class="card-title">Account Settings</h2> -->
  <div class="content-section">
    <div class="section-header-with-action">
      <div class="action-buttons">
        <div class="menu-container" *ngIf="!isEditingAccountSettings">
          <button class="btn-menu" (click)="toggleMenu('account'); $event.stopPropagation()" title="Menu">
            <span class="menu-icon">⋯</span>
          </button>
          <div class="menu-dropdown" *ngIf="openMenu === 'account'" (click)="$event.stopPropagation()">
            <button class="menu-item" (click)="enableAccountEditMode(); closeMenu()">
              <span class="menu-item-icon">✏️</span>
              <span>Edit Details</span>
            </button>
          </div>
        </div>
        <div *ngIf="isEditingAccountSettings" class="edit-mode-buttons">
          <button class="btn-back" (click)="cancelAccountEdit()" title="Back to View">
            <span>Back</span>
          </button>
          <button class="btn-cancel" (click)="cancelAccountEdit()" title="Cancel">
            <span>Cancel</span>
          </button>
          <button class="btn-save" (click)="saveAccountSettings()" [disabled]="isSaving">
            <span *ngIf="!isSaving">Save</span>
            <span *ngIf="isSaving" class="save-loader">
              <span class="spinner"></span>
              <span>Saving...</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  
  <!-- Informative View (Read-only display) -->
  <div class="info-display" *ngIf="!isEditingAccountSettings">
    <div class="info-row" (mouseenter)="hoveredField = 'email'" (mouseleave)="hoveredField = null">
      <span class="info-label">Email :</span>
      <span class="info-value" *ngIf="editingField !== 'email'">
        {{ user?.email || '—' }}
        <button class="inline-edit-btn" *ngIf="hoveredField === 'email' && false" (click)="startInlineEdit('email')" title="Edit" disabled>
          <span class="edit-icon-small">✏️</span>
        </button>
      </span>
    </div>
    <div class="info-row" (mouseenter)="hoveredField = 'password'" (mouseleave)="hoveredField = null">
      <span class="info-label">Password :</span>
      <span class="info-value" *ngIf="editingField !== 'password'">
        {{ password ? '••••••••' : '—' }}
        <button class="inline-edit-btn" *ngIf="hoveredField === 'password'" (click)="startInlineEdit('password')" title="Edit">
          <span class="edit-icon-small">✏️</span>
        </button>
      </span>
      <div class="inline-edit-container" *ngIf="editingField === 'password'">
        <input type="password" [(ngModel)]="password" class="inline-input" (blur)="saveInlineField('password')" (keyup.enter)="saveInlineField('password')" (keyup.escape)="cancelInlineEdit('password')" placeholder="Enter password" />
        <div class="inline-edit-actions">
          <button class="inline-save-btn" (click)="saveInlineField('password')" title="Save">✓</button>
          <button class="inline-cancel-btn" (click)="cancelInlineEdit('password')" title="Cancel">✕</button>
        </div>
      </div>
    </div>
    <div class="info-row">
      <span class="info-label">Role :</span>
      <span class="info-value">CompanyAdmin</span>
    </div>
  </div>
  
  <!-- Edit Mode (Form inputs) -->
  <div class="form-fields" *ngIf="isEditingAccountSettings">
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
  </div>
</div>

<!-- My Preferences Section -->
<div *ngIf="activeTab === 'Preferences'">
  <!-- <h2 class="card-title">My Preferences</h2> -->
  <div class="content-section">
    <div class="section-header-with-action">
      <div class="action-buttons">
        <div class="menu-container" *ngIf="!isEditingPreferences">
          <button class="btn-menu" (click)="toggleMenu('preferences'); $event.stopPropagation()" title="Menu">
            <span class="menu-icon">⋯</span>
          </button>
          <div class="menu-dropdown" *ngIf="openMenu === 'preferences'" (click)="$event.stopPropagation()">
            <button class="menu-item" (click)="enablePreferencesEditMode(); closeMenu()">
              <span class="menu-item-icon">✏️</span>
              <span>Edit Details</span>
            </button>
          </div>
        </div>
        <div *ngIf="isEditingPreferences" class="edit-mode-buttons">
          <button class="btn-back" (click)="cancelPreferencesEdit()" title="Back to View">
            <span>Back</span>
          </button>
          <button class="btn-cancel" (click)="cancelPreferencesEdit()" title="Cancel">
            <span>Cancel</span>
          </button>
          <button class="btn-save" (click)="savePreferences()" [disabled]="isSaving">
            <span *ngIf="!isSaving">Save</span>
            <span *ngIf="isSaving" class="save-loader">
              <span class="spinner"></span>
              <span>Saving...</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  
  <!-- Informative View (Read-only display) -->
  <div class="info-display" *ngIf="!isEditingPreferences">
    <div class="info-row" (mouseenter)="hoveredField = 'enableWebNotification'" (mouseleave)="hoveredField = null">
      <span class="info-label">Enable Web Notification :</span>
      <span class="info-value" *ngIf="editingField !== 'enableWebNotification'">
        {{ enableWebNotification === 'yes' ? 'Yes' : 'No' }}
        <button class="inline-edit-btn" *ngIf="hoveredField === 'enableWebNotification'" (click)="startInlineEdit('enableWebNotification')" title="Edit">
          <span class="edit-icon-small">✏️</span>
        </button>
      </span>
      <div class="inline-edit-container" *ngIf="editingField === 'enableWebNotification'">
        <select [(ngModel)]="enableWebNotification" class="inline-input" (blur)="saveInlineField('enableWebNotification')" (keyup.escape)="cancelInlineEdit('enableWebNotification')">
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        <div class="inline-edit-actions">
          <button class="inline-save-btn" (click)="saveInlineField('enableWebNotification')" title="Save">✓</button>
          <button class="inline-cancel-btn" (click)="cancelInlineEdit('enableWebNotification')" title="Cancel">✕</button>
        </div>
      </div>
    </div>
    <div class="info-row" (mouseenter)="hoveredField = 'enableEmailNotification'" (mouseleave)="hoveredField = null">
      <span class="info-label">Enable Email Notification :</span>
      <span class="info-value" *ngIf="editingField !== 'enableEmailNotification'">
        {{ enableEmailNotification === 'yes' ? 'Yes' : 'No' }}
        <button class="inline-edit-btn" *ngIf="hoveredField === 'enableEmailNotification'" (click)="startInlineEdit('enableEmailNotification')" title="Edit">
          <span class="edit-icon-small">✏️</span>
        </button>
      </span>
      <div class="inline-edit-container" *ngIf="editingField === 'enableEmailNotification'">
        <select [(ngModel)]="enableEmailNotification" class="inline-input" (blur)="saveInlineField('enableEmailNotification')" (keyup.escape)="cancelInlineEdit('enableEmailNotification')">
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        <div class="inline-edit-actions">
          <button class="inline-save-btn" (click)="saveInlineField('enableEmailNotification')" title="Save">✓</button>
          <button class="inline-cancel-btn" (click)="cancelInlineEdit('enableEmailNotification')" title="Cancel">✕</button>
        </div>
      </div>
    </div>
    <div class="info-row" (mouseenter)="hoveredField = 'language'" (mouseleave)="hoveredField = null">
      <span class="info-label">Language :</span>
      <span class="info-value" *ngIf="editingField !== 'language'">
        {{ language === 'english' ? 'English' : 'Hindi' }}
        <button class="inline-edit-btn" *ngIf="hoveredField === 'language'" (click)="startInlineEdit('language')" title="Edit">
          <span class="edit-icon-small">✏️</span>
        </button>
      </span>
      <div class="inline-edit-container" *ngIf="editingField === 'language'">
        <select [(ngModel)]="language" class="inline-input" (blur)="saveInlineField('language')" (keyup.escape)="cancelInlineEdit('language')">
          <option value="english">English</option>
          <option value="hindi">Hindi</option>
        </select>
        <div class="inline-edit-actions">
          <button class="inline-save-btn" (click)="saveInlineField('language')" title="Save">✓</button>
          <button class="inline-cancel-btn" (click)="cancelInlineEdit('language')" title="Cancel">✕</button>
        </div>
      </div>
    </div>
    <div class="info-row" (mouseenter)="hoveredField = 'hiddenTopbarMenus'" (mouseleave)="hoveredField = null">
      <span class="info-label">Hide Menus From Topbar :</span>
      <span class="info-value" *ngIf="editingField !== 'hiddenTopbarMenus'">
        {{ hiddenTopbarMenus || '—' }}
        <button class="inline-edit-btn" *ngIf="hoveredField === 'hiddenTopbarMenus'" (click)="startInlineEdit('hiddenTopbarMenus')" title="Edit">
          <span class="edit-icon-small">✏️</span>
        </button>
      </span>
      <div class="inline-edit-container" *ngIf="editingField === 'hiddenTopbarMenus'">
        <input type="text" [(ngModel)]="hiddenTopbarMenus" class="inline-input" (blur)="saveInlineField('hiddenTopbarMenus')" (keyup.enter)="saveInlineField('hiddenTopbarMenus')" (keyup.escape)="cancelInlineEdit('hiddenTopbarMenus')" placeholder="Hidden topbar menus" />
        <div class="inline-edit-actions">
          <button class="inline-save-btn" (click)="saveInlineField('hiddenTopbarMenus')" title="Save">✓</button>
          <button class="inline-cancel-btn" (click)="cancelInlineEdit('hiddenTopbarMenus')" title="Cancel">✕</button>
        </div>
      </div>
    </div>
    <div class="info-row" (mouseenter)="hoveredField = 'disableKeyboardShortcuts'" (mouseleave)="hoveredField = null">
      <span class="info-label">Disable Keyboard Shortcuts :</span>
      <span class="info-value" *ngIf="editingField !== 'disableKeyboardShortcuts'">
        {{ disableKeyboardShortcuts === 'yes' ? 'Yes' : 'No' }}
        <button class="inline-edit-btn" *ngIf="hoveredField === 'disableKeyboardShortcuts'" (click)="startInlineEdit('disableKeyboardShortcuts')" title="Edit">
          <span class="edit-icon-small">✏️</span>
        </button>
      </span>
      <div class="inline-edit-container" *ngIf="editingField === 'disableKeyboardShortcuts'">
        <select [(ngModel)]="disableKeyboardShortcuts" class="inline-input" (blur)="saveInlineField('disableKeyboardShortcuts')" (keyup.escape)="cancelInlineEdit('disableKeyboardShortcuts')">
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
        <div class="inline-edit-actions">
          <button class="inline-save-btn" (click)="saveInlineField('disableKeyboardShortcuts')" title="Save">✓</button>
          <button class="inline-cancel-btn" (click)="cancelInlineEdit('disableKeyboardShortcuts')" title="Cancel">✕</button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Edit Mode (Form inputs) -->
  <div class="form-fields" *ngIf="isEditingPreferences">
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
</div>
</div>

<!-- Files Section -->
<div *ngIf="activeTab === 'Files'">
  <!-- <h2 class="card-title">Files</h2> -->
  <div class="content-section">
    <div class="section-header">
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
        <tr *ngFor="let file of files">
          <td>{{ file.id }}</td>
          <td>
            <span class="file-icon">📄</span>
            <span class="file-name">{{ file.fileName }}</span>
          </td>
          <td>{{ file.size }}</td>
          <td>{{ file.uploadedBy }}</td>
          <td>{{ formatDate(file.createdDate) }}</td>
          <td class="action-column">
            <div class="action-menu">
              <button class="action-btn" (click)="viewFile(file)" title="View">
                <span>👁️</span>
              </button>
              <button class="action-btn" (click)="downloadFile(file)" title="Download">
                <span>⬇️</span>
              </button>
              <button class="action-btn" (click)="deleteFile(file)" title="Delete">
                <span>🗑️</span>
              </button>
            </div>
          </td>
        </tr>
        <tr *ngIf="files.length === 0">
          <td colspan="6" class="no-data">No record found.</td>
        </tr>
      </tbody>
    </table>
  </div>
  </div>
</div>

  <!-- Subscription Section -->
  <div *ngIf="activeTab === 'Subscription'">
    <h2 class="card-title">Subscription</h2>
    
    <!-- Card 1: Purchase Plan and Subscription History -->
    <div class="content-section">
      <div class="subscription-section">
        <h3 class="subsection-title">
          Subscription History
          <button class="btn-purchase" (click)="purchasePlan()">
            <span>+ Purchase Plan?</span>
          </button>
        </h3>
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
            <tr *ngFor="let subscription of subscriptions">
              <td>{{ subscription.planName }}</td>
              <td>{{ subscription.expiresInDays }}</td>
              <td>{{ subscription.totalEntities }}</td>
              <td>{{ formatDate(subscription.startDate) }}</td>
              <td>{{ formatDate(subscription.endDate) }}</td>
              <td>
                <span class="status-badge" [class.status-active]="subscription.status === 'Active'" [class.status-inactive]="subscription.status !== 'Active'">
                  {{ subscription.status }}
                </span>
              </td>
              <td>₹{{ subscription.amountPaid }}</td>
              <td class="action-column">
                <button class="action-btn" (click)="viewSubscription(subscription)" title="View">👁️</button>
                <button class="action-btn" (click)="renewSubscription(subscription)" title="Renew">🔄</button>
              </td>
            </tr>
            <tr *ngIf="subscriptions.length === 0">
              <td colspan="8" class="no-data">No record found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Card 2: Subscription Users -->
  <div class="content-section">
    <div class="subscription-users-container">
      <!-- <h3 class="subscription-users-title">
        <span class="icon">👥</span>
        Subscription Users
      </h3> -->
      
      <!-- Admin with Sub-Users -->
      <div class="subscription-user-card admin-with-subusers">
        <!-- Admin Section -->
        <div class="admin-section">
          <h4 class="card-section-title">
            <span class="icon">👤</span>
            Admin
            <span class="admin-status status-active">Active</span>
          </h4>
          <div class="admin-info">
            <span class="admin-email">{{ user?.email || 'dt34@gmail.com' }}</span>
            <span class="admin-role">CompanyAdmin</span>
          </div>
        </div>

        <!-- Sub-Users Section -->
        <div class="sub-users-section">
          <div class="sub-users-header">
            <h4 class="card-section-title">
              <span class="icon">👥</span>
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
                <tr *ngFor="let subUser of subUsers">
                  <td>{{ subUser.userName }}</td>
                  <td>{{ subUser.email }}</td>
                  <td>{{ subUser.mobile }}</td>
                  <td>{{ formatDate(subUser.createdDate) }}</td>
                  <td>
                    <span class="status-badge" [class.status-active]="subUser.status === 'Active'" [class.status-inactive]="subUser.status !== 'Active'">
                      {{ subUser.status }}
                    </span>
                  </td>
                  <td class="action-column">
                    <button class="action-btn" (click)="viewSubUser(subUser)" title="View">👁️</button>
                    <button class="action-btn" (click)="editSubUser(subUser)" title="Edit">✏️</button>
                    <button class="action-btn" (click)="deleteSubUser(subUser)" title="Delete">🗑️</button>
                  </td>
                </tr>
                <tr *ngIf="subUsers.length === 0">
                  <td colspan="6" class="no-data">No record found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- View File Modal -->
  <div class="modal-overlay" *ngIf="showViewFileModal" (click)="closeViewFileModal()">
    <div class="modal-content" (click)="$event.stopPropagation()">
      <div class="modal-header">
        <h2 class="modal-title">File Details</h2>
        <button class="modal-close" (click)="closeViewFileModal()" title="Close">
          <span>×</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="view-details">
          <div class="detail-row">
            <span class="detail-label">File Name:</span>
            <span class="detail-value">{{ viewingFile?.fileName || '—' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Size:</span>
            <span class="detail-value">{{ viewingFile?.size || '—' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Uploaded By:</span>
            <span class="detail-value">{{ viewingFile?.uploadedBy || '—' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Created Date:</span>
            <span class="detail-value">{{ formatDate(viewingFile?.createdDate) || '—' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- View Sub User Modal -->
  <div class="modal-overlay" *ngIf="showViewSubUserModal" (click)="closeViewSubUserModal()">
    <div class="modal-content" (click)="$event.stopPropagation()">
      <div class="modal-header" [class.header-active]="viewingSubUser?.status === 'Active'" [class.header-inactive]="viewingSubUser?.status !== 'Active'">
        <h2 class="modal-title">{{viewingSubUser?.userName}}</h2>
        <button class="modal-close" (click)="closeViewSubUserModal()" title="Close">
          <span>×</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="view-details">
          <!-- <div class="detail-row">
            <span class="detail-label">User Name:</span>
            <span class="detail-value">{{ viewingSubUser?.userName || '—' }}</span>
          </div> -->
          <div class="detail-row">
            <span class="detail-label">Email:</span>
            <span class="detail-value">{{ viewingSubUser?.email || '—' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Mobile:</span>
            <span class="detail-value">{{ viewingSubUser?.mobile || '—' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Created Date:</span>
            <span class="detail-value">{{ formatDate(viewingSubUser?.createdDate) || '—' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status:</span>
            <span class="detail-value">
              <span class="status-badge" [class.status-active]="viewingSubUser?.status === 'Active'" [class.status-inactive]="viewingSubUser?.status !== 'Active'">
                {{ viewingSubUser?.status || '—' }}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Edit Sub User Modal -->
  <div class="modal-overlay" *ngIf="showEditSubUserModal" (click)="closeEditSubUserModal()">
    <div class="modal-content" (click)="$event.stopPropagation()">
      <div class="modal-header" [class.header-active]="editingSubUser.isActive" [class.header-inactive]="!editingSubUser.isActive">
        <h2 class="modal-title">Edit details of {{editingSubUser.userName}}</h2>
        <button class="modal-close" (click)="closeEditSubUserModal()" title="Close">
          <span>×</span>
        </button>
      </div>
      <div class="modal-body">
        <form class="sub-user-form" (ngSubmit)="updateSubUser()">
          <div class="form-row">
            <div class="form-group">
              <label for="editUserName">User Name</label>
              <input 
                type="text" 
                id="editUserName" 
                [(ngModel)]="editingSubUser.userName" 
                name="userName"
                class="form-input" 
                placeholder="Enter user name" 
                required />
            </div>
            <div class="form-group">
              <label for="editEmail">Email ID</label>
              <input 
                type="email" 
                id="editEmail" 
                [(ngModel)]="editingSubUser.email" 
                name="email"
                class="form-input" 
                placeholder="Enter email" 
                required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="editMobile">Mobile Number</label>
              <input 
                type="tel" 
                id="editMobile" 
                [(ngModel)]="editingSubUser.mobile" 
                name="mobile"
                class="form-input" 
                placeholder="Enter mobile number" 
                required />
            </div>
            <div class="form-group">
              <label for="editStatus">Status</label>
              <div class="checkbox-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    id="editStatus" 
                    [(ngModel)]="editingSubUser.isActive" 
                    name="isActive"
                    class="checkbox-input" />
                  <span class="checkbox-text">Active</span>
                </label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-cancel-modal" (click)="closeEditSubUserModal()">
              Cancel
            </button>
            <button type="submit" class="btn-update-modal" [class.btn-update-active]="editingSubUser.isActive" [class.btn-update-inactive]="!editingSubUser.isActive" [disabled]="isUpdatingSubUser">
              <span *ngIf="!isUpdatingSubUser">Update</span>
              <span *ngIf="isUpdatingSubUser" class="save-loader">
                <span class="spinner"></span>
                <span>Updating...</span>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div class="modal-overlay" *ngIf="showDeleteConfirmModal" (click)="closeDeleteConfirmModal()">
    <div class="delete-modal-content" (click)="$event.stopPropagation()">
      <div class="delete-modal-header" [class.header-active]="deleteItemType === 'subUser' && itemToDelete?.status === 'Active'" [class.header-inactive]="deleteItemType === 'subUser' && itemToDelete?.status !== 'Active'">
        <h2 class="delete-modal-title">Attention!</h2>
        <button class="modal-close" (click)="closeDeleteConfirmModal()" title="Close">
          <span>×</span>
        </button>
      </div>
      <div class="delete-modal-body">
        <div class="delete-modal-icon">
          <div class="icon-circle">
            <span class="icon-i">i</span>
          </div>
        </div>
        <p class="delete-modal-message">
          Are you sure you want to delete {{ deleteItemType === 'file' ? 'file' : 'sub user' }} details?
        </p>
        <div class="delete-modal-footer">
          <button class="btn-delete-confirm" [class.btn-delete-active]="deleteItemType === 'subUser' && itemToDelete?.status === 'Active'" [class.btn-delete-inactive]="deleteItemType === 'subUser' && itemToDelete?.status !== 'Active'" (click)="confirmDelete()">
            Yes, Delete
          </button>
          <button class="btn-delete-cancel" (click)="closeDeleteConfirmModal()">
            No, Cancel
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Create Sub User Modal -->
  <div class="modal-overlay" *ngIf="showCreateSubUserModal" (click)="closeCreateSubUserModal()">
    <div class="modal-content" (click)="$event.stopPropagation()">
      <div class="modal-header">
        <h2 class="modal-title">Create Sub User</h2>
        <button class="modal-close" (click)="closeCreateSubUserModal()" title="Close">
          <span>×</span>
        </button>
      </div>
      <div class="modal-body">
        <p class="modal-description">Please provide the sub-user details you'd like to register.</p>
        <form class="sub-user-form" (ngSubmit)="createSubUser()">
          <div class="form-row">
            <div class="form-group">
              <label for="subUserFirstName">First Name</label>
              <input 
                type="text" 
                id="subUserFirstName" 
                [(ngModel)]="newSubUser.firstName" 
                name="firstName"
                class="form-input" 
                placeholder="Enter first name" 
                required />
            </div>
            <div class="form-group">
              <label for="subUserLastName">Last Name</label>
              <input 
                type="text" 
                id="subUserLastName" 
                [(ngModel)]="newSubUser.lastName" 
                name="lastName"
                class="form-input" 
                placeholder="Enter last name" 
                required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="subUserEmail">Email ID</label>
              <input 
                type="email" 
                id="subUserEmail" 
                [(ngModel)]="newSubUser.email" 
                name="email"
                class="form-input" 
                placeholder="example@neptune.com" 
                required />
            </div>
            <div class="form-group">
              <label for="subUserPhone">Phone Number</label>
              <input 
                type="tel" 
                id="subUserPhone" 
                [(ngModel)]="newSubUser.phone" 
                name="phone"
                class="form-input" 
                placeholder="Enter phone number" 
                required />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-cancel-modal" (click)="closeCreateSubUserModal()">
              Cancel
            </button>
            <button type="submit" class="btn-create-modal" [disabled]="isCreatingSubUser">
              <span *ngIf="!isCreatingSubUser">Create</span>
              <span *ngIf="isCreatingSubUser" class="save-loader">
                <span class="spinner"></span>
                <span>Creating...</span>
              </span>
            </button>
          </div>
        </form>
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
  color: #764ba2;
  // background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.nav-tab.active {
  color: #764ba2;
  border-bottom-color: #764ba2;
  font-weight: 600;
  // background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.content-section {
  background: white;
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.content-section:last-child {
  margin-bottom: 0;
}

.section-header-with-action {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1rem;
  color: #6974dc;
  margin: 0;
  padding: 4px;
  font-family: Arial, sans-serif;
}

.subscription-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f3c88;
  margin: 0;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.edit-mode-buttons {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.menu-container {
  position: relative;
}

.btn-menu {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #667eea;
}

.btn-menu:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #764ba2;
}

.menu-icon {
  font-size: 1.5rem;
  line-height: 1;
  font-weight: bold;
  transform: rotate(90deg);
  display: inline-block;
}

.menu-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 160px;
  z-index: 1000;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease;
  color: #333;
  font-size: 0.9rem;
}

.menu-item:hover {
  background: #f5f5f5;
}

.menu-item-icon {
  font-size: 1rem;
}

.btn-edit {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  background: transparent;
  color: #667eea;
  border: none;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.3s ease;
}

.btn-edit:hover {
  color: #764ba2;
}

.btn-edit:active {
  opacity: 0.8;
}

.edit-icon {
  font-size: 1rem;
}

.btn-back,
.btn-cancel,
.btn-save {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
  height: 36px;
  line-height: 1;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.btn-back {
  background: #f3f4f6;
  color: #6b7280;
}

.btn-back:hover {
  background: #e5e7eb;
  color: #4b5563;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-back:active {
  transform: translateY(0);
}

.btn-cancel {
  background: #ef4444;
  color: white;
}

.btn-cancel:hover {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-cancel:active {
  transform: translateY(0);
}

.btn-save {
  background: #667eea;
  color: white;
}

.btn-save:hover:not(:disabled) {
  background: #764ba2;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-save:active:not(:disabled) {
  transform: translateY(0);
}

.btn-save:disabled {
  background: #cccccc;
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.save-icon {
  font-size: 0.85rem;
  line-height: 1;
}

/* Info Display (Read-only view) */
.info-display {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem 2rem;
  padding: 0;
}

.info-row {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border: none;
  background: transparent;
}

.info-label {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
}

.info-value {
  font-size: 1rem;
  color: #333;
  font-weight: 400;
  flex: 1;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.info-row:hover {
  background: #f9fafb;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  margin: 0 -0.5rem;
}

.inline-edit-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
  opacity: 0.7;
}

.inline-edit-btn:hover {
  background: #e0e7ff;
  opacity: 1;
}

.edit-icon-small {
  font-size: 0.85rem;
  color: #667eea;
}

.inline-edit-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.inline-input {
  flex: 1;
  padding: 0.4rem 0.75rem;
  border: 1px solid #667eea;
  border-radius: 4px;
  font-size: 1rem;
  color: #333;
  background: white;
  min-width: 150px;
}

.inline-input:focus {
  outline: none;
  border-color: #764ba2;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.inline-edit-actions {
  display: flex;
  gap: 0.25rem;
}

.inline-save-btn,
.inline-cancel-btn {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.inline-save-btn {
  background: #4caf50;
  color: white;
}

.inline-save-btn:hover {
  background: #45a049;
  transform: scale(1.1);
}

.inline-cancel-btn {
  background: #ef4444;
  color: white;
}

.inline-cancel-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
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
  color: #666;
}

.readonly-field:focus {
  outline: none;
  border-color: #e0e0e0;
}

.radio-group.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.radio-label.disabled {
  cursor: not-allowed;
  opacity: 0.6;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 1px solid #333;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: 700;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-add:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.table-container {
  overflow-x: auto;
  margin-top: 1rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.data-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.data-table thead tr:first-child th:first-child {
  border-top-left-radius: 8px;
}

.data-table thead tr:first-child th:last-child {
  border-top-right-radius: 8px;
}

.data-table th {
  padding: 0.65rem 1rem;
  text-align: left;
  font-weight: 700;
  color: white;
  font-size: 0.9rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.data-table td {
  padding: 0.5rem 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  color: #333;
  font-size: 0.95rem;
}

.data-table tbody tr:last-child td:first-child {
  border-bottom-left-radius: 8px;
}

.data-table tbody tr:last-child td:last-child {
  border-bottom-right-radius: 8px;
}

.data-table tbody tr {
  background: rgba(102, 126, 234, 0.05); /* Light purple tint */
}

.data-table tbody tr:nth-child(even) {
  background: rgba(118, 75, 162, 0.05); /* Light purple-blue tint */
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

/* Action column styles are now in shared table.styles.ts */

.menu-icon {
  cursor: pointer;
  font-size: 1.2rem;
}

.file-icon {
  font-size: 1.2rem;
  margin-right: 0.5rem;
  vertical-align: middle;
}

.file-name {
  font-weight: 500;
  color: #333;
}

.action-menu {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}

.action-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0.4rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: rgba(102, 126, 234, 0.15);
  transform: scale(1.15);
}

.status-badge {
  padding: 0.4rem 0.85rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  display: inline-block;
  white-space: nowrap;
  color: white;
}

.status-active {
  background: linear-gradient(135deg, #11998e, #38ef7d);
}

.status-inactive {
  background: linear-gradient(135deg, #f093fb, #f5576c);
}

.subscription-section {
  margin-bottom: 0;
}

.btn-purchase {
  padding: 0.65rem 1.25rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  white-space: nowrap;
}

.btn-purchase:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.subsection-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.subsection-title {
  justify-content: space-between;
}

.subsection-title .btn-purchase {
  margin-left: auto;
}

.subsection-title .icon {
  font-size: 1.1rem;
}

/* Subscription Users Container */
.subscription-users-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.subscription-users-header {
  margin-bottom: 1.5rem;
}

.subscription-users-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  flex-wrap: wrap;
}

.subscription-users-title .icon {
  font-size: 1.2rem;
}

.subscription-users-title .btn-purchase {
  margin-left: auto;
}

/* Subscription User Card (Admin with Sub-Users) */
.subscription-user-card {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 1.5rem;
}

.admin-with-subusers {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Admin Section */
.admin-section {
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e0e0e0;
}

.card-section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
}

.card-section-title .icon {
  font-size: 0.9rem;
}

.admin-status {
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  margin-left: auto;
}

.admin-status.status-active {
  background: linear-gradient(135deg, #11998e, #38ef7d);
  color: white;
}

.admin-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.admin-email {
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 500;
}

.admin-role {
  padding: 0.4rem 0.85rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
}

/* Sub-Users Section */
.sub-users-section {
  display: flex;
  flex-direction: column;
}

.sub-users-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.btn-add-subuser {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 4px;
  font-color: white;
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

.save-loader {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1024px) {
  .form-fields {
    grid-template-columns: repeat(2, 1fr);
  }
  .info-display {
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
  .info-display {
    grid-template-columns: 1fr;
  }
  .section-header-with-action {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .action-buttons,
  .edit-mode-buttons {
    width: 100%;
    flex-wrap: wrap;
  }
  .btn-edit,
  .btn-back,
  .btn-cancel,
  .btn-save {
    flex: 1;
    min-width: 80px;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 0.3s ease;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border-bottom: none;
}

.modal-header.header-active {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.modal-header.header-inactive {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.modal-header:not(.header-active):not(.header-inactive) {
  background: linear-gradient(135deg, #8b9ef8 0%, #764ba2 100%);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.modal-close {
  background: transparent;
  border: none;
  font-size: 1.75rem;
  color: white;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  line-height: 1;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.modal-description {
  color: #6c757d;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.sub-user-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background: #f8f9fa;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-input::placeholder {
  color: #adb5bd;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.btn-cancel-modal {
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel-modal:hover {
  background: #f8f9fa;
  border-color: #d0d0d0;
}

.btn-create-modal {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-create-modal:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.btn-create-modal:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Delete Confirmation Modal Styles */
.delete-modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: fadeInUp 0.3s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.delete-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border-bottom: none;
}

.delete-modal-header.header-active {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.delete-modal-header.header-inactive {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.delete-modal-header:not(.header-active):not(.header-inactive) {
  background: linear-gradient(135deg, #8b9ef8 0%, #764ba2 100%);
}

.delete-modal-body {
  padding: 2rem;
  text-align: center;
}

.delete-modal-icon {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

.icon-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(79, 172, 254, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.icon-i {
  font-size: 3rem;
  font-weight: 700;
  color: #4facfe;
  font-style: normal;
  font-family: Arial, sans-serif;
}

.delete-modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.delete-modal-message {
  font-size: 1rem;
  color: #6c757d;
  margin: 0 0 2rem 0;
  line-height: 1.5;
}

.delete-modal-footer {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-delete-confirm {
  padding: 0.75rem 2rem;
  border: 2px solid transparent;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-delete-confirm.btn-delete-active {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  border-color: rgba(17, 153, 142, 0.3);
  box-shadow: 0 4px 12px rgba(17, 153, 142, 0.3);
}

.btn-delete-confirm.btn-delete-active:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(17, 153, 142, 0.4);
}

.btn-delete-confirm.btn-delete-inactive {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-color: rgba(245, 87, 108, 0.3);
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
}

.btn-delete-confirm.btn-delete-inactive:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(245, 87, 108, 0.4);
}

.btn-delete-confirm:not(.btn-delete-active):not(.btn-delete-inactive) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #8b9ef8;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-delete-confirm:not(.btn-delete-active):not(.btn-delete-inactive):hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.btn-delete-cancel {
  padding: 0.75rem 2rem;
  background: #6c757d;
  border: 2px solid #8b9ef8;
  border-color: #adb5bd;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-delete-cancel:hover {
  background: #5a6268;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

/* View Details Styles */
.view-details {
  display: flex;
  flex-direction: column;
}

.detail-row {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  // border-bottom: 1px solid #e0e0e0;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #2c3e50;
  min-width: 140px;
  font-size: 0.95rem;
}

.detail-value {
  color: #333;
  font-size: 0.95rem;
  flex: 1;
}

/* Checkbox Styles */
.checkbox-group {
  display: flex;
  align-items: center;
  padding-top: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #667eea;
}

.checkbox-text {
  font-size: 0.95rem;
  color: #2c3e50;
  font-weight: 500;
}

/* Update Button (Theme Color) */
.btn-update-modal {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-update-modal.btn-update-active {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  box-shadow: 0 4px 12px rgba(17, 153, 142, 0.3);
}

.btn-update-modal.btn-update-active:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(17, 153, 142, 0.4);
}

.btn-update-modal.btn-update-inactive {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
}

.btn-update-modal.btn-update-inactive:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(245, 87, 108, 0.4);
}

.btn-update-modal:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
  `]
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private alertService = inject(AlertService);
  private readonly API_BASE_URL = environment.apiUrl;
  
  user = this.authService.getCurrentUser();
  activeTab = 'general';
  isSaving = false;
  isEditingGeneralInfo = false;
  isEditingAccountSettings = false;
  isEditingPreferences = false;
  openMenu: string | null = null; // Track which menu is open

  constructor() {
    // Close menu when clicking outside
    document.addEventListener('click', (event: Event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.menu-container')) {
        this.openMenu = null;
      }
    });
  }
  
  // Inline editing properties
  hoveredField: string | null = null;
  editingField: string | null = null;
  private inlineOriginalValues: { [key: string]: any } = {};
  
  // Original values for cancel functionality
  private originalValues: any = {};
  private accountOriginalValues: any = {};
  private preferencesOriginalValues: any = {};
  
  firstName = 'RAFIQ';
  lastName = 'SHAIKH';
  mailingAddress = this.user?.email || '';
  alternativeAddress = '';
  phoneNumber = '9000001111';
  alternativePhone = '44446467567';
  dateOfBirth = '1990-01-01';
  gstNumber = '2324242423235';
  gender = 'Male';

  // Account Settings
  password = '';
  retypePassword = '';

  // My Preferences
  enableWebNotification = 'yes';
  enableEmailNotification = 'yes';
  language = 'english';
  hiddenTopbarMenus = 'Hidden topbar menus';
  disableKeyboardShortcuts = 'no';

  // Subscription Data
  subscriptions = [
    {
      planName: 'Premium Plan',
      expiresInDays: 45,
      totalEntities: 10,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'Active',
      amountPaid: 50000
    },
    {
      planName: 'Basic Plan',
      expiresInDays: 0,
      totalEntities: 5,
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      status: 'Expired',
      amountPaid: 25000
    },
    {
      planName: 'Enterprise Plan',
      expiresInDays: 120,
      totalEntities: 50,
      startDate: '2024-06-01',
      endDate: '2025-05-31',
      status: 'Active',
      amountPaid: 150000
    }
  ];

  // Sub-Users Data
  subUsers = [
    {
      userName: 'John Smith',
      email: 'john.smith@example.com',
      mobile: '+91 98765 43220',
      createdDate: '2024-01-10',
      status: 'Active'
    },
    {
      userName: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      mobile: '+91 98765 43221',
      createdDate: '2024-02-15',
      status: 'Active'
    },
    {
      userName: 'Michael Brown',
      email: 'michael.brown@example.com',
      mobile: '+91 98765 43222',
      createdDate: '2024-03-20',
      status: 'Inactive'
    }
  ];

  // Files Data
  files = [
    {
      id: 1,
      fileName: 'Company_Registration_Certificate.pdf',
      size: '2.5 MB',
      uploadedBy: 'RAFIQ SHAIKH',
      createdDate: '2024-01-15'
    },
    {
      id: 2,
      fileName: 'GST_Certificate.pdf',
      size: '1.8 MB',
      uploadedBy: 'RAFIQ SHAIKH',
      createdDate: '2024-01-20'
    },
    {
      id: 3,
      fileName: 'PAN_Card.pdf',
      size: '850 KB',
      uploadedBy: 'RAFIQ SHAIKH',
      createdDate: '2024-02-01'
    },
    {
      id: 4,
      fileName: 'Board_Resolution_2024.docx',
      size: '1.2 MB',
      uploadedBy: 'RAFIQ SHAIKH',
      createdDate: '2024-02-10'
    },
    {
      id: 5,
      fileName: 'Annual_Report_2023.pdf',
      size: '5.3 MB',
      uploadedBy: 'RAFIQ SHAIKH',
      createdDate: '2024-02-15'
    },
    {
      id: 6,
      fileName: 'Tax_Return_2023.pdf',
      size: '3.1 MB',
      uploadedBy: 'RAFIQ SHAIKH',
      createdDate: '2024-02-20'
    }
  ];

  enableEditMode(): void {
    // Save original values before editing
    this.originalValues = {
      firstName: this.firstName,
      lastName: this.lastName,
      mailingAddress: this.mailingAddress,
      alternativeAddress: this.alternativeAddress,
      phoneNumber: this.phoneNumber,
      alternativePhone: this.alternativePhone,
      dateOfBirth: this.dateOfBirth,
      gstNumber: this.gstNumber,
      gender: this.gender
    };
    this.isEditingGeneralInfo = true;
  }

  cancelEdit(): void {
    // Restore original values
    if (this.originalValues) {
      this.firstName = this.originalValues.firstName || '';
      this.lastName = this.originalValues.lastName || '';
      this.mailingAddress = this.originalValues.mailingAddress || '';
      this.alternativeAddress = this.originalValues.alternativeAddress || '';
      this.phoneNumber = this.originalValues.phoneNumber || '';
      this.alternativePhone = this.originalValues.alternativePhone || '';
      this.dateOfBirth = this.originalValues.dateOfBirth || '';
      this.gstNumber = this.originalValues.gstNumber || '';
      this.gender = this.originalValues.gender || '';
    }
    this.isEditingGeneralInfo = false;
    this.originalValues = {};
  }

  /**
   * Unified method to save all user profile data (General Info, Account Settings, My Preferences)
   * This method sends all fields to a single API endpoint
   */
  private async saveUserProfile(validateGeneralInfo: boolean = false): Promise<void> {
    // Validate required fields for General Info if needed
    if (validateGeneralInfo) {
      if (!this.firstName || !this.lastName || !this.mailingAddress || !this.phoneNumber || !this.dateOfBirth || !this.gender) {
        this.alertService.warning('Please fill in all required fields (First Name, Last Name, Mailing Address, Phone, Date of Birth, Gender)', 'Validation Error');
        return;
      }
    }

    // Validate password if provided
    if (this.password && this.password !== this.retypePassword) {
      this.alertService.warning('Passwords do not match!', 'Validation Error');
      return;
    }

    this.isSaving = true;

    try {
      // Create complete UserProfileModel object with all fields from all three tabs
      const profileData: UserProfileModel = {
        Id: this.user?.id || '',
        // General Info fields
        FirstName: this.firstName,
        LastName: this.lastName,
        MailingAddress: this.mailingAddress,
        PhoneNumber: this.phoneNumber,
        DateOfBirth: this.dateOfBirth, // Should be in YYYY-MM-DD format
        Gender: this.gender || 'Other', // "Male" | "Female" | "Other"
        // Optional General Info fields
        ...(this.alternativeAddress && { AlternativeAddress: this.alternativeAddress }),
        ...(this.alternativePhone && { AlternativePhone: this.alternativePhone }),
        ...(this.gstNumber && { GstNumber: this.gstNumber }),
        // Account Settings fields
        Email: this.user?.email || '',
        ...(this.password && { Password: this.password }), // Only include if password is provided
        Role: 'CompanyAdmin', // Default role
        // My Preferences fields
        EnableWebNotification: this.enableWebNotification,
        EnableEmailNotification: this.enableEmailNotification,
        Language: this.language,
        HiddenTopbarMenus: this.hiddenTopbarMenus,
        DisableKeyboardShortcuts: this.disableKeyboardShortcuts
      };

      console.log('Saving complete user profile data:', profileData);

      // Single API call for all profile data
      let response: any;
      try {
        response = await firstValueFrom(
          this.http.post<any>(
            `${this.API_BASE_URL}/auth/updateuserdetails`,
            profileData,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authService.getToken()}`
              }
            }
          )
        );
      } catch (error) {
        // Since backend is not ready, simulate a successful response
        console.log('API call made (dummy - backend not ready):', error);
        response = { success: true, message: 'Profile updated successfully (dummy response)' };
      }

      console.log('Profile save response:', response);
      this.alertService.success('Details updated successfully!');
      
      // Optionally update local user data
      if (this.user) {
        this.user.first_name = this.firstName;
        this.user.last_name = this.lastName;
      }

      // Exit all edit modes after successful save
      this.isEditingGeneralInfo = false;
      this.isEditingAccountSettings = false;
      this.isEditingPreferences = false;
      this.originalValues = {};
      this.accountOriginalValues = {};
      this.preferencesOriginalValues = {};

    } catch (error) {
      console.error('Error saving profile:', error);
      this.alertService.error('Failed to save profile. Please try again.', 'Error');
    } finally {
      this.isSaving = false;
    }
  }

  async saveProfile(): Promise<void> {
    await this.saveUserProfile(true); // Validate General Info fields
  }

  // Account Settings Edit Mode Methods
  enableAccountEditMode(): void {
    // Save original values before editing
    this.accountOriginalValues = {
      password: this.password,
      retypePassword: this.retypePassword
    };
    this.isEditingAccountSettings = true;
  }

  cancelAccountEdit(): void {
    // Restore original values
    if (this.accountOriginalValues) {
      this.password = this.accountOriginalValues.password || '';
      this.retypePassword = this.accountOriginalValues.retypePassword || '';
    }
    this.isEditingAccountSettings = false;
    this.accountOriginalValues = {};
  }

  async saveAccountSettings(): Promise<void> {
    await this.saveUserProfile(false); // Don't validate General Info fields, only password validation
  }

  // My Preferences Edit Mode Methods
  enablePreferencesEditMode(): void {
    // Save original values before editing
    this.preferencesOriginalValues = {
      enableWebNotification: this.enableWebNotification,
      enableEmailNotification: this.enableEmailNotification,
      language: this.language,
      hiddenTopbarMenus: this.hiddenTopbarMenus,
      disableKeyboardShortcuts: this.disableKeyboardShortcuts
    };
    this.isEditingPreferences = true;
  }

  cancelPreferencesEdit(): void {
    // Restore original values
    if (this.preferencesOriginalValues) {
      this.enableWebNotification = this.preferencesOriginalValues.enableWebNotification || 'yes';
      this.enableEmailNotification = this.preferencesOriginalValues.enableEmailNotification || 'yes';
      this.language = this.preferencesOriginalValues.language || 'english';
      this.hiddenTopbarMenus = this.preferencesOriginalValues.hiddenTopbarMenus || 'Hidden topbar menus';
      this.disableKeyboardShortcuts = this.preferencesOriginalValues.disableKeyboardShortcuts || 'no';
    }
    this.isEditingPreferences = false;
    this.preferencesOriginalValues = {};
  }

  async savePreferences(): Promise<void> {
    await this.saveUserProfile(false); // Don't validate General Info fields
  }

  addFiles(): void {
    console.log('Add files clicked');
    // TODO: Implement file upload functionality
    this.alertService.info('File upload feature coming soon!', 'Coming Soon');
  }

  // View File Modal State
  showViewFileModal = false;
  viewingFile: any = null;

  viewFile(file: any): void {
    this.viewingFile = { ...file };
    this.showViewFileModal = true;
  }

  closeViewFileModal(): void {
    this.showViewFileModal = false;
    this.viewingFile = null;
  }

  downloadFile(file: any): void {
    console.log('Download file:', file);
    this.alertService.success(`Downloading file: ${file.fileName}`, 'Download');
  }

  // Delete Confirmation Modal State
  showDeleteConfirmModal = false;
  itemToDelete: any = null;
  deleteItemType: 'file' | 'subUser' = 'file';

  deleteFile(file: any): void {
    this.itemToDelete = file;
    this.deleteItemType = 'file';
    this.showDeleteConfirmModal = true;
  }

  deleteSubUser(subUser: any): void {
    this.itemToDelete = subUser;
    this.deleteItemType = 'subUser';
    this.showDeleteConfirmModal = true;
  }

  closeDeleteConfirmModal(): void {
    this.showDeleteConfirmModal = false;
    this.itemToDelete = null;
  }

  confirmDelete(): void {
    if (!this.itemToDelete) {
      this.closeDeleteConfirmModal();
      return;
    }

    if (this.deleteItemType === 'file') {
      const file = this.itemToDelete;
      const index = this.files.findIndex(f => f.id === file.id);
      if (index > -1) {
        this.files.splice(index, 1);
        this.alertService.success(`File "${file.fileName}" deleted successfully`, 'Delete File');
      }
    } else if (this.deleteItemType === 'subUser') {
      const subUser = this.itemToDelete;
      const index = this.subUsers.findIndex(u => u.email === subUser.email);
      if (index > -1) {
        this.subUsers.splice(index, 1);
        this.alertService.success(`Sub user "${subUser.userName}" deleted successfully`, 'Delete Sub User');
      }
    }

    this.closeDeleteConfirmModal();
  }

  purchasePlan(): void {
    console.log('Purchase plan clicked');
    // TODO: Implement purchase plan functionality
    this.alertService.info('Purchase plan feature coming soon!', 'Coming Soon');
  }

  // Sub User Modal State
  showCreateSubUserModal = false;
  isCreatingSubUser = false;
  newSubUser = {
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  };

  addSubUser(): void {
    this.newSubUser = {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    };
    this.showCreateSubUserModal = true;
  }

  closeCreateSubUserModal(): void {
    this.showCreateSubUserModal = false;
    this.newSubUser = {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    };
  }

  async createSubUser(): Promise<void> {
    if (!this.newSubUser.firstName || !this.newSubUser.lastName || !this.newSubUser.email || !this.newSubUser.phone) {
      this.alertService.warning('Please fill in all required fields.', 'Validation Error');
      return;
    }

    this.isCreatingSubUser = true;

    try {
      // TODO: Replace with actual API call
      console.log('Creating sub user:', this.newSubUser);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add to subUsers array
      const newUser = {
        userName: `${this.newSubUser.firstName} ${this.newSubUser.lastName}`,
        email: this.newSubUser.email,
        mobile: this.newSubUser.phone,
        createdDate: new Date().toISOString().split('T')[0],
        status: 'Active'
      };

      this.subUsers.push(newUser);
      this.alertService.success('Sub user created successfully!', 'Success');
      this.closeCreateSubUserModal();

    } catch (error) {
      console.error('Error creating sub user:', error);
      this.alertService.error('Failed to create sub user. Please try again.', 'Error');
    } finally {
      this.isCreatingSubUser = false;
    }
  }

  viewSubscription(subscription: any): void {
    console.log('View subscription:', subscription);
    this.alertService.info(`Viewing subscription: ${subscription.planName}`, 'Subscription Details');
  }

  renewSubscription(subscription: any): void {
    console.log('Renew subscription:', subscription);
    this.alertService.info(`Renewing subscription: ${subscription.planName}`, 'Renew Subscription');
  }

  // View Sub User Modal State
  showViewSubUserModal = false;
  viewingSubUser: any = null;

  // Edit Sub User Modal State
  showEditSubUserModal = false;
  isUpdatingSubUser = false;
  editingSubUser: any = {
    userName: '',
    email: '',
    mobile: '',
    isActive: false
  };
  originalSubUserIndex: number = -1;

  viewSubUser(subUser: any): void {
    this.viewingSubUser = { ...subUser };
    this.showViewSubUserModal = true;
  }

  closeViewSubUserModal(): void {
    this.showViewSubUserModal = false;
    this.viewingSubUser = null;
  }

  editSubUser(subUser: any): void {
    // Find the index of the sub user
    this.originalSubUserIndex = this.subUsers.findIndex(u => u.email === subUser.email);
    
    // Set editing data
    this.editingSubUser = {
      userName: subUser.userName || '',
      email: subUser.email || '',
      mobile: subUser.mobile || '',
      isActive: subUser.status === 'Active'
    };
    
    this.showEditSubUserModal = true;
  }

  closeEditSubUserModal(): void {
    this.showEditSubUserModal = false;
    this.editingSubUser = {
      userName: '',
      email: '',
      mobile: '',
      isActive: false
    };
    this.originalSubUserIndex = -1;
  }

  async updateSubUser(): Promise<void> {
    if (!this.editingSubUser.userName || !this.editingSubUser.email || !this.editingSubUser.mobile) {
      this.alertService.warning('Please fill in all required fields.', 'Validation Error');
      return;
    }

    this.isUpdatingSubUser = true;

    try {
      // TODO: Replace with actual API call
      console.log('Updating sub user:', this.editingSubUser);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update the sub user in the array
      if (this.originalSubUserIndex > -1) {
        this.subUsers[this.originalSubUserIndex] = {
          userName: this.editingSubUser.userName,
          email: this.editingSubUser.email,
          mobile: this.editingSubUser.mobile,
          createdDate: this.subUsers[this.originalSubUserIndex].createdDate,
          status: this.editingSubUser.isActive ? 'Active' : 'Inactive'
        };

        this.alertService.success('Sub user updated successfully!', 'Success');
        this.closeEditSubUserModal();
      }

    } catch (error) {
      console.error('Error updating sub user:', error);
      this.alertService.error('Failed to update sub user. Please try again.', 'Error');
    } finally {
      this.isUpdatingSubUser = false;
    }
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

  formatDate(dateString: string): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return dateString;
    }
  }

  startInlineEdit(fieldName: string): void {
    // Save original value
    this.inlineOriginalValues[fieldName] = (this as any)[fieldName] || '';
    this.editingField = fieldName;
    
    // Focus input after view updates
    setTimeout(() => {
      const input = document.querySelector(`.inline-edit-container .inline-input`) as HTMLInputElement | HTMLSelectElement;
      if (input) {
        input.focus();
        if (input instanceof HTMLInputElement) {
          input.select();
        }
      }
    }, 0);
  }

  async saveInlineField(fieldName: string): Promise<void> {
    if (!this.editingField || this.editingField !== fieldName) return;

    const value = (this as any)[fieldName];
    const originalValue = this.inlineOriginalValues[fieldName];
    
    // Check which section this field belongs to
    const accountFields = ['password', 'retypePassword', 'email'];
    const preferencesFields = ['enableWebNotification', 'enableEmailNotification', 'language', 'hiddenTopbarMenus', 'disableKeyboardShortcuts'];
    
    // Save to backend using unified API for all fields
    try {
      // Validate password if it's being saved
      if (fieldName === 'password' && this.password && this.password !== this.retypePassword) {
        this.alertService.warning('Passwords do not match!', 'Validation Error');
        return;
      }
      
      // Use unified save method for all fields (General Info, Account Settings, My Preferences)
      // This sends all profile data to a single API endpoint
      await this.saveUserProfile(false); // Don't validate General Info for inline edits
      
      // Exit edit mode on success
      this.editingField = null;
      delete this.inlineOriginalValues[fieldName];
      this.alertService.success(`${this.capitalizeFirstLetter(fieldName)} updated successfully!`);
    } catch (error) {
      console.error('Error saving inline field:', error);
      // Restore original value on error
      (this as any)[fieldName] = originalValue;
      this.alertService.error(`Failed to save ${fieldName}. Please try again.`, 'Error');
    }
  }

  capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  toggleMenu(menuType: string): void {
    if (this.openMenu === menuType) {
      this.openMenu = null;
    } else {
      this.openMenu = menuType;
    }
  }

  closeMenu(): void {
    this.openMenu = null;
  }

  setActiveTab(tab: string): void {
    console.log('Setting activeTab to:', tab);
    this.activeTab = tab;
    console.log('activeTab is now:', this.activeTab);
  }

  cancelInlineEdit(fieldName: string): void {
    if (!this.editingField || this.editingField !== fieldName) return;

    // Restore original value
    if (this.inlineOriginalValues[fieldName] !== undefined) {
      (this as any)[fieldName] = this.inlineOriginalValues[fieldName];
    }

    // Exit edit mode
    this.editingField = null;
    delete this.inlineOriginalValues[fieldName];
  }
}

