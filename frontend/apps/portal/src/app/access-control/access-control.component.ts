import { Component, OnInit, inject, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AlertService } from '../shared/alert/alert.service';
import { environment } from '../../environments/environment';

interface Role {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
}

interface User {
  id: number;
  username: string;
  email: string;
  is_active?: boolean;
}

interface UserRolesResponse {
  user_id: number;
  roles: Role[];
}

@Component({
  selector: 'app-access-control',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="access-control-container">
      <div class="cards-row">
        <!-- Roles -->
        <div class="card-wrapper">
          <div class="section-header">
            <h3 class="subsection-title">Available Roles</h3>
            <button class="btn-create-role" (click)="openCreateRoleModal()">+ Create Role</button>
          </div>
          <section class="content-section roles-section">
            <div class="pagination-header">
              <label class="pagination-label">Show:</label>
              <select class="pagination-select" [(ngModel)]="rolesPageSize" (change)="rolesCurrentPage = 1">
                <option *ngFor="let size of pageSizeOptions" [value]="size">{{ size }}</option>
              </select>
              <span class="pagination-info-text">Showing {{ getRolesStartIndex() }} - {{ getRolesEndIndex() }} of {{ roles.length }} roles</span>
            </div>

            <div class="table-container" [class.has-scroll]="getPaginatedRoles().length > 10">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Role Name</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngIf="getPaginatedRoles().length === 0">
                    <td colspan="4" class="no-data">No roles found. Create a role to get started.</td>
                  </tr>
                  <tr *ngFor="let role of getPaginatedRoles(); trackBy: trackByRole" class="role-row" (click)="viewRoleDetails(role)" [class.selected]="selectedRoleForEdit?.id === role.id">
                    <td>{{ role.id }}</td>
                    <td><strong>{{ role.name }}</strong></td>
                    <td>
                      <span class="status-badge" [class.active]="role.is_active">{{ role.is_active ? 'Active' : 'Inactive' }}</span>
                    </td>
                    <td class="action-cell" (click)="$event.stopPropagation()">
                      <button class="btn-delete-icon" (click)="deleteRole(role)" title="Delete Role">🗑️</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="pagination-footer" *ngIf="roles.length > rolesPageSize">
              <button class="page-btn" (click)="rolesPreviousPage()" [disabled]="rolesCurrentPage === 1">Previous</button>
              <span class="page-info">Page {{ rolesCurrentPage }} of {{ getRolesTotalPages() }}</span>
              <button class="page-btn" (click)="rolesNextPage()" [disabled]="rolesCurrentPage >= getRolesTotalPages()">Next</button>
            </div>
          </section>
        </div>

        <!-- Users -->
        <div class="card-wrapper">
          <h3 class="subsection-title">Users & Role Assignment</h3>
          <section class="content-section users-section">
            <div class="pagination-header">
              <label class="pagination-label">Show:</label>
              <select class="pagination-select" [(ngModel)]="usersPageSize" (change)="usersCurrentPage = 1">
                <option *ngFor="let size of pageSizeOptions" [value]="size">{{ size }}</option>
              </select>
              <span class="pagination-info-text">Showing {{ getUsersStartIndex() }} - {{ getUsersEndIndex() }} of {{ users.length }} users</span>
            </div>

            <div class="table-container" [class.has-scroll]="getPaginatedUsers().length > 10">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Current Roles</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngIf="getPaginatedUsers().length === 0">
                    <td colspan="6" class="no-data">Loading users...</td>
                  </tr>
                  <tr *ngFor="let user of getPaginatedUsers(); trackBy: trackByUser" (click)="viewUserDetails(user)">
                    <td>{{ user.id }}</td>
                    <td><strong>{{ user.username }}</strong></td>
                    <td>{{ user.email }}</td>
                    <td>
                      <span class="status-badge" [class.active]="user.is_active !== false">{{ user.is_active !== false ? 'Active' : 'Inactive' }}</span>
                    </td>
                    <td>
                      <div class="role-badges-container">
                        <span *ngFor="let role of getUserRoles(user.id)" class="role-badge-item">{{ role.name }}
                          <button class="role-remove-btn" (click)="unassignRoleFromUser(user.id, role.id); $event.stopPropagation()">×</button>
                        </span>
                        <span *ngIf="getUserRoles(user.id).length === 0" class="no-roles">No roles assigned</span>
                      </div>
                    </td>
                    <td class="action-cell" (click)="$event.stopPropagation()">
                      <button class="btn-assign" (click)="openAssignRolesModal(user)">Assign Roles</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="pagination-footer" *ngIf="users.length > usersPageSize">
              <button class="page-btn" (click)="usersPreviousPage()" [disabled]="usersCurrentPage === 1">Previous</button>
              <span class="page-info">Page {{ usersCurrentPage }} of {{ getUsersTotalPages() }}</span>
              <button class="page-btn" (click)="usersNextPage()" [disabled]="usersCurrentPage >= getUsersTotalPages()">Next</button>
            </div>
          </section>
        </div>
      </div>

      <!-- Create/Edit Role Modal -->
      <div class="modal-overlay" *ngIf="showCreateRoleModal" (click)="closeCreateRoleModal()" [style.zIndex]="9000">
        <div class="modal-content create-role-modal" (click)="$event.stopPropagation()">
          <div class="modal-header" [class.active]="selectedRoleForEdit?.is_active">
            <h3 class="modal-title">{{ selectedRoleForEdit ? 'Edit Role' : 'Create Role' }}</h3>
            <button class="modal-close" (click)="closeCreateRoleModal()">×</button>
          </div>

          <div class="modal-body">
            <div class="role-form">
              <div class="form-group">
                <label>Role Name *</label>
                <input type="text" [(ngModel)]="newRole.name" [disabled]="isCreatingRole || isUpdatingRole" />
              </div>

              <div class="form-group">
                <label>Description</label>
                <textarea [(ngModel)]="newRole.description" [disabled]="isCreatingRole || isUpdatingRole"></textarea>
              </div>

              <div class="form-group" *ngIf="selectedRoleForEdit">
                <label>
                  <input type="checkbox" [(ngModel)]="newRole.is_active" [disabled]="isUpdatingRole" />
                  Active
                </label>
              </div>

              <div class="form-actions">
                <button class="btn-cancel-modal" (click)="closeCreateRoleModal()">Cancel</button>
                <button class="btn-create-modal" *ngIf="!selectedRoleForEdit" (click)="createSingleRole()" [disabled]="isCreatingRole || !newRole.name.trim()">{{ isCreatingRole ? 'Creating...' : 'Create Role' }}</button>
                <button class="btn-update-modal" *ngIf="selectedRoleForEdit" (click)="updateRole()" [disabled]="isUpdatingRole || !newRole.name.trim()" [class.active]="newRole.is_active">{{ isUpdatingRole ? 'Updating...' : 'Update' }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Assign Roles Modal -->
      <div class="modal-overlay" *ngIf="showAssignRolesModal && selectedUser" (click)="closeAssignRolesModal()" [style.zIndex]="9999" [style.display]="showAssignRolesModal && selectedUser ? 'flex' : 'none'">
        <div class="modal-content assign-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Assign Roles to {{ selectedUser?.username }}</h3>
            <button class="modal-close" (click)="closeAssignRolesModal()">×</button>
          </div>

          <div class="modal-body">
            <div class="multi-select-container" (click)="$event.stopPropagation()">
              <div class="multi-select-header" (click)="toggleDropdown()">
                <span>Select Roles ({{ selectedRoleIds.size }} selected)</span>
                <span class="dropdown-arrow">{{ isDropdownOpen ? '▲' : '▼' }}</span>
              </div>
              <div class="multi-select-dropdown" *ngIf="isDropdownOpen" (click)="$event.stopPropagation()">
                <div class="dropdown-pagination-controls" (click)="$event.stopPropagation()">
                  <label>Show:</label>
                  <select class="pagination-select" [(ngModel)]="dropdownPageSize" (change)="dropdownCurrentPage = 1" (click)="$event.stopPropagation()">
                    <option *ngFor="let size of pageSizeOptions" [value]="size">{{ size }}</option>
                  </select>
                </div>
                <div class="dropdown-options" (click)="$event.stopPropagation()">
                  <div *ngFor="let role of getAvailableRolesForPagination(); trackBy: trackByRole" class="dropdown-option" (click)="$event.stopPropagation()">
                    <label>
                      <input type="checkbox" [checked]="isRoleSelected(role.id)" (change)="toggleRoleSelection(role.id)" (click)="$event.stopPropagation()" />
                      {{ role.name }}
                    </label>
                  </div>
                </div>
                <div class="dropdown-pagination" *ngIf="getAvailableRoles().length > dropdownPageSize" (click)="$event.stopPropagation()">
                  <button type="button" class="page-btn" (click)="dropdownPreviousPage()" [disabled]="dropdownCurrentPage === 1">Previous</button>
                  <span class="page-info">Page {{ dropdownCurrentPage }} of {{ getDropdownTotalPages() }}</span>
                  <button type="button" class="page-btn" (click)="dropdownNextPage()" [disabled]="dropdownCurrentPage >= getDropdownTotalPages()">Next</button>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button class="btn-cancel-modal" (click)="closeAssignRolesModal()">Cancel</button>
              <button class="btn-assign-modal" (click)="assignRolesToUser()" [disabled]="isAssigningRoles || selectedRoleIds.size === 0">{{ isAssigningRoles ? 'Assigning...' : 'Assign Roles' }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div class="modal-overlay" *ngIf="showDeleteConfirmModal && roleToDelete" (click)="closeDeleteModal()" [style.zIndex]="9000">
        <div class="modal-content delete-modal" (click)="$event.stopPropagation()">
          <div class="modal-header" [class.active]="roleToDelete?.is_active">
            <h3 class="modal-title">Delete Role</h3>
            <button class="modal-close" (click)="closeDeleteModal()">×</button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete the role "{{ roleToDelete?.name }}"? This action cannot be undone.</p>
          </div>
          <div class="form-actions">
            <button class="btn-cancel-modal" (click)="closeDeleteModal()">No, Cancel</button>
            <button class="btn-delete-modal" [class.active]="roleToDelete?.is_active" (click)="confirmDeleteRole()">Yes, Delete</button>
          </div>
        </div>
      </div>

      <!-- View User Details Modal -->
      <div class="modal-overlay" *ngIf="showUserDetailsModal && selectedUserForView" (click)="closeUserDetailsModal()" [style.zIndex]="9000">
        <div class="modal-content user-details-modal" (click)="$event.stopPropagation()">
          <div class="modal-header" [class.active]="selectedUserForView?.is_active !== false">
            <h3 class="modal-title">User Details</h3>
            <button class="modal-close" (click)="closeUserDetailsModal()">×</button>
          </div>
          <div class="modal-body">
            <div class="user-details">
              <div class="detail-row">
                <label>User ID:</label>
                <span>{{ selectedUserForView?.id }}</span>
              </div>
              <div class="detail-row">
                <label>Username:</label>
                <span><strong>{{ selectedUserForView?.username }}</strong></span>
              </div>
              <div class="detail-row">
                <label>Email:</label>
                <span>{{ selectedUserForView?.email }}</span>
              </div>
              <div class="detail-row">
                <label>Status:</label>
                <span class="status-badge" [class.active]="selectedUserForView?.is_active !== false">
                  {{ selectedUserForView?.is_active !== false ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <div class="detail-row">
                <label>Assigned Roles:</label>
                <div class="roles-list">
                  <span *ngFor="let role of getUserRoles(selectedUserForView?.id)" class="role-badge-display">
                    {{ role.name }}
                    <span class="role-status" [class.active]="role.is_active">{{ role.is_active ? '✓' : '✗' }}</span>
                  </span>
                  <span *ngIf="getUserRoles(selectedUserForView?.id).length === 0" class="no-roles">No roles assigned</span>
                </div>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button class="btn-cancel-modal" (click)="closeUserDetailsModal()">Close</button>
            <button class="btn-assign-modal" (click)="openAssignRolesFromDetails()">Manage Roles</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .access-control-container {
      padding: 2rem;
      min-height: calc(100vh - 120px);
      height: calc(100vh - 120px);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .cards-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
      flex: 1;
      min-height: 0;
    }

    @media (max-width: 1400px) {
      .cards-row {
        grid-template-columns: 1fr;
      }
    }

    .card-wrapper {
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
      flex-shrink: 0;
    }

    .subsection-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 0.75rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e9ecef;
      flex-shrink: 0;
    }

    .card-wrapper .subsection-title {
      margin-bottom: 0.75rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e9ecef;
    }

    .content-section {
      background: white;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }

    .roles-section {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-height: 0;
    }

    .users-section {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-height: 0;
    }

    .btn-create-role {
      padding: 0.5rem 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 600;
      color: white;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-create-role:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
    }

    .pagination-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
      flex-shrink: 0;
    }

    .pagination-label {
      font-size: 0.9rem;
      color: #666;
    }

    .pagination-select {
      padding: 0.4rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .pagination-info-text {
      font-size: 0.9rem;
      color: #666;
      margin-left: auto;
    }

    .table-container {
      overflow-x: auto;
      overflow-y: auto;
      flex: 1;
      min-height: 0;
      max-height: calc(10 * 2.8rem + 2.5rem);
    }

    .table-container.has-scroll {
      overflow-y: scroll;
      scrollbar-width: thin;
      scrollbar-color: #667eea #f0f0f0;
    }

    .table-container.has-scroll::-webkit-scrollbar {
      width: 8px;
    }

    .table-container.has-scroll::-webkit-scrollbar-track {
      background: #f0f0f0;
      border-radius: 4px;
    }

    .table-container.has-scroll::-webkit-scrollbar-thumb {
      background: #667eea;
      border-radius: 4px;
    }

    .table-container.has-scroll::-webkit-scrollbar-thumb:hover {
      background: #764ba2;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      border-radius: 8px;
      overflow: hidden;
    }

    .data-table thead {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .data-table th {
      padding: 0.6rem;
      text-align: left;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .data-table td {
      padding: 0.4rem;
      font-size: 0.9rem;
      border-bottom: 1px solid #e9ecef;
    }

    .data-table tbody tr {
      cursor: pointer;
      transition: background 0.2s;
    }

    .data-table tbody tr:hover {
      background: #f8f9fa;
    }

    .data-table tbody tr.selected {
      background: #e7f3ff;
    }

    .role-row {
      cursor: pointer;
    }

    .action-cell {
      text-align: center;
      white-space: nowrap;
    }

    .btn-delete-icon {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .btn-delete-icon:hover {
      background: #f8d7da;
    }

    .btn-assign {
      padding: 0.5rem 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 600;
      color: white;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-assign:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
    }

    .role-badges-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      align-items: center;
    }

    .role-badge-item {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
      gap: 0.25rem;
    }

    .role-remove-btn {
      background: rgba(255, 255, 255, 0.3);
      border: none;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      font-size: 0.9rem;
      color: white;
      cursor: pointer;
      padding: 0;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .role-remove-btn:hover {
      background: rgba(255, 255, 255, 0.5);
      transform: scale(1.1);
    }

    .no-roles {
      color: #999;
      font-style: italic;
      font-size: 0.85rem;
    }

    .status-badge {
      padding: 0.25rem 0.6rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .status-badge.active {
      background: #d4edda;
      color: #155724;
    }

    .status-badge:not(.active) {
      background: #f8d7da;
      color: #721c24;
    }

    .pagination-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 0.75rem;
      border-top: 1px solid #e9ecef;
      margin-top: 0.75rem;
      flex-shrink: 0;
    }

    .page-btn {
      padding: 0.4rem 0.8rem;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;
    }

    .page-btn:hover:not(:disabled) {
      background: #f8f9fa;
    }

    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-info {
      font-size: 0.9rem;
      color: #666;
    }

    .no-data {
      text-align: center;
      padding: 2rem;
      color: #999;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999 !important;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      z-index: 10000 !important;
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e9ecef;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px 12px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header.active {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    }

    .modal-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
      color: white;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: white;
      cursor: pointer;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s;
    }

    .modal-close:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .modal-body {
      padding: 1.5rem;
    }

    .role-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 600;
      color: #495057;
    }

    .form-group input,
    .form-group textarea {
      padding: 0.75rem;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-group textarea {
      min-height: 100px;
      resize: vertical;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
    }

    .btn-cancel-modal {
      padding: 0.75rem 1.5rem;
      background: #f8f9fa;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      color: #495057;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-cancel-modal:hover {
      background: #e9ecef;
    }

    .btn-create-modal,
    .btn-update-modal,
    .btn-assign-modal {
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      color: white;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-update-modal.active {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    }

    .btn-create-modal:hover,
    .btn-update-modal:hover,
    .btn-assign-modal:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .btn-delete-modal {
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      color: white;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-delete-modal.active {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    }

    .btn-delete-modal:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
    }

    .multi-select-container {
      position: relative;
      margin-bottom: 1rem;
    }

    .multi-select-header {
      padding: 0.75rem;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
    }

    .multi-select-header:hover {
      border-color: #667eea;
    }

    .dropdown-arrow {
      font-size: 0.8rem;
      color: #666;
    }

    .multi-select-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      margin-top: 0.5rem;
      max-height: 300px;
      overflow-y: auto;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .dropdown-pagination-controls {
      padding: 0.5rem;
      border-bottom: 1px solid #e9ecef;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .dropdown-options {
      max-height: 200px;
      overflow-y: auto;
    }

    .dropdown-option {
      padding: 0.5rem 1rem;
      cursor: pointer;
      transition: background 0.2s;
    }

    .dropdown-option:hover {
      background: #f8f9fa;
    }

    .dropdown-option label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      margin: 0;
      font-weight: normal;
    }

    .dropdown-pagination {
      padding: 0.5rem;
      border-top: 1px solid #e9ecef;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
    }

    .user-details-modal {
      max-width: 600px;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .detail-row {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e9ecef;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .detail-row label {
      font-weight: 600;
      color: #495057;
      font-size: 0.9rem;
    }

    .detail-row span {
      color: #333;
      font-size: 1rem;
    }

    .roles-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .role-badge-display {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .role-status {
      font-size: 0.75rem;
      opacity: 0.8;
    }

    .role-status.active {
      color: #28a745;
    }
  `]
})
export class AccessControlComponent implements OnInit {
  private http = inject(HttpClient);
  private alertService = inject(AlertService);
  private cdr = inject(ChangeDetectorRef);
  private API_BASE_URL = environment.apiUrl;

  // Roles
  roles: Role[] = [];
  rolesCurrentPage = 1;
  rolesPageSize = 10;
  pageSizeOptions = [10, 20, 30, 50, 100];

  // Users
  users: User[] = [];
  userRolesMap: Map<number, Role[]> = new Map();
  usersCurrentPage = 1;
  usersPageSize = 10;

  // Modals
  showCreateRoleModal = false;
  showAssignRolesModal = false;
  showDeleteConfirmModal = false;
  showUserDetailsModal = false;
  selectedRoleForEdit: Role | null = null;
  selectedUser: User | null = null;
  selectedUserForView: User | null = null;
  roleToDelete: Role | null = null;

  // Role creation/editing
  newRole: { name: string; description: string; is_active: boolean } = {
    name: '',
    description: '',
    is_active: true
  };
  isCreatingRole = false;
  isUpdatingRole = false;

  // Role assignment
  selectedRoleIds: Set<number> = new Set();
  isDropdownOpen = false;
  isAssigningRoles = false;
  dropdownCurrentPage = 1;
  dropdownPageSize = 10;

  ngOnInit(): void {
    this.loadRoles();
    this.loadUsers();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.multi-select-container')) {
      this.isDropdownOpen = false;
    }
  }

  // Role Management
  async loadRoles(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.get<Role[]>(`${this.API_BASE_URL}/roles`)
      );
      this.roles = response;
    } catch (error) {
      this.alertService.showAlert('Failed to load roles', 'error');
    }
  }

  openCreateRoleModal(): void {
    this.selectedRoleForEdit = null;
    this.newRole = { name: '', description: '', is_active: true };
    this.showCreateRoleModal = true;
  }

  closeCreateRoleModal(): void {
    this.showCreateRoleModal = false;
    this.selectedRoleForEdit = null;
    this.newRole = { name: '', description: '', is_active: true };
  }

  viewRoleDetails(role: Role): void {
    this.selectedRoleForEdit = { ...role };
    this.newRole = {
      name: role.name,
      description: role.description || '',
      is_active: role.is_active
    };
    this.showCreateRoleModal = true;
  }

  async createSingleRole(): Promise<void> {
    if (!this.newRole.name.trim()) {
      this.alertService.showAlert('Role name is required', 'error');
      return;
    }

    this.isCreatingRole = true;
    try {
      await firstValueFrom(
        this.http.post<Role>(`${this.API_BASE_URL}/roles`, {
          name: this.newRole.name.trim(),
          description: this.newRole.description.trim() || undefined
        })
      );
      this.alertService.showAlert('Role created successfully', 'success');
      this.closeCreateRoleModal();
      this.loadRoles();
    } catch (error: any) {
      this.alertService.showAlert(error?.error?.detail || 'Failed to create role', 'error');
    } finally {
      this.isCreatingRole = false;
    }
  }

  async updateRole(): Promise<void> {
    if (!this.selectedRoleForEdit || !this.newRole.name.trim()) {
      return;
    }

    this.isUpdatingRole = true;
    try {
      await firstValueFrom(
        this.http.put<Role>(`${this.API_BASE_URL}/roles/${this.selectedRoleForEdit.id}`, {
          name: this.newRole.name.trim(),
          description: this.newRole.description.trim() || undefined,
          is_active: this.newRole.is_active
        })
      );
      this.alertService.showAlert('Role updated successfully', 'success');
      this.closeCreateRoleModal();
      this.loadRoles();
    } catch (error: any) {
      this.alertService.showAlert(error?.error?.detail || 'Failed to update role', 'error');
    } finally {
      this.isUpdatingRole = false;
    }
  }

  deleteRole(role: Role): void {
    this.roleToDelete = role;
    this.showDeleteConfirmModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteConfirmModal = false;
    this.roleToDelete = null;
  }

  async confirmDeleteRole(): Promise<void> {
    if (!this.roleToDelete) return;

    try {
      await firstValueFrom(
        this.http.delete(`${this.API_BASE_URL}/roles/${this.roleToDelete.id}`)
      );
      this.alertService.showAlert('Role deleted successfully', 'success');
      this.closeDeleteModal();
      this.loadRoles();
      this.loadUsers(); // Refresh users to update role assignments
    } catch (error: any) {
      this.alertService.showAlert(error?.error?.detail || 'Failed to delete role', 'error');
    }
  }

  // User Management
  async loadUsers(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.get<User[]>(`${this.API_BASE_URL}/auth/users`)
      );
      this.users = response;
      await this.loadUserRoles();
    } catch (error) {
      this.alertService.showAlert('Failed to load users', 'error');
    }
  }

  async loadUserRoles(): Promise<void> {
    for (const user of this.users) {
      try {
        const response = await firstValueFrom(
          this.http.get<UserRolesResponse>(`${this.API_BASE_URL}/roles/users/${user.id}`)
        );
        this.userRolesMap.set(user.id, response.roles || []);
      } catch (error) {
        this.userRolesMap.set(user.id, []);
      }
    }
  }

  getUserRoles(userId: number): Role[] {
    return this.userRolesMap.get(userId) || [];
  }

  openAssignRolesModal(user: User): void {
    this.selectedUser = user;
    const assignedRoleIds = this.getUserRoles(user.id).map(r => r.id);
    this.selectedRoleIds = new Set(assignedRoleIds);
    this.showAssignRolesModal = true;
    this.isDropdownOpen = false;
    this.cdr.detectChanges();
  }

  closeAssignRolesModal(): void {
    this.showAssignRolesModal = false;
    this.selectedUser = null;
    this.selectedRoleIds = new Set();
    this.isDropdownOpen = false;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  getAvailableRoles(): Role[] {
    if (!this.selectedUser) return [];
    const assignedRoleIds = this.getUserRoles(this.selectedUser.id).map(r => r.id);
    return this.roles.filter(r => !assignedRoleIds.includes(r.id));
  }

  getAvailableRolesForPagination(): Role[] {
    const available = this.getAvailableRoles();
    const start = (this.dropdownCurrentPage - 1) * this.dropdownPageSize;
    const end = start + this.dropdownPageSize;
    return available.slice(start, end);
  }

  getDropdownTotalPages(): number {
    return Math.ceil(this.getAvailableRoles().length / this.dropdownPageSize);
  }

  dropdownPreviousPage(): void {
    if (this.dropdownCurrentPage > 1) {
      this.dropdownCurrentPage--;
    }
  }

  dropdownNextPage(): void {
    if (this.dropdownCurrentPage < this.getDropdownTotalPages()) {
      this.dropdownCurrentPage++;
    }
  }

  isRoleSelected(roleId: number): boolean {
    return this.selectedRoleIds.has(roleId);
  }

  toggleRoleSelection(roleId: number): void {
    if (this.selectedRoleIds.has(roleId)) {
      this.selectedRoleIds.delete(roleId);
    } else {
      this.selectedRoleIds.add(roleId);
    }
  }

  async assignRolesToUser(): Promise<void> {
    if (!this.selectedUser || this.selectedRoleIds.size === 0) return;

    this.isAssigningRoles = true;
    try {
      await firstValueFrom(
        this.http.post(`${this.API_BASE_URL}/roles/users/${this.selectedUser.id}/assign`, {
          role_ids: Array.from(this.selectedRoleIds)
        })
      );
      this.alertService.showAlert('Roles assigned successfully', 'success');
      this.closeAssignRolesModal();
      this.loadUserRoles();
    } catch (error: any) {
      this.alertService.showAlert(error?.error?.detail || 'Failed to assign roles', 'error');
    } finally {
      this.isAssigningRoles = false;
    }
  }

  async unassignRoleFromUser(userId: number, roleId: number): Promise<void> {
    try {
      await firstValueFrom(
        this.http.delete(`${this.API_BASE_URL}/roles/users/${userId}/roles/${roleId}`)
      );
      this.alertService.showAlert('Role unassigned successfully', 'success');
      this.loadUserRoles();
    } catch (error: any) {
      this.alertService.showAlert(error?.error?.detail || 'Failed to unassign role', 'error');
    }
  }

  // Pagination
  getPaginatedRoles(): Role[] {
    const start = (this.rolesCurrentPage - 1) * this.rolesPageSize;
    const end = start + this.rolesPageSize;
    return this.roles.slice(start, end);
  }

  getRolesStartIndex(): number {
    return (this.rolesCurrentPage - 1) * this.rolesPageSize + 1;
  }

  getRolesEndIndex(): number {
    return Math.min(this.rolesCurrentPage * this.rolesPageSize, this.roles.length);
  }

  getRolesTotalPages(): number {
    return Math.ceil(this.roles.length / this.rolesPageSize);
  }

  rolesPreviousPage(): void {
    if (this.rolesCurrentPage > 1) {
      this.rolesCurrentPage--;
    }
  }

  rolesNextPage(): void {
    if (this.rolesCurrentPage < this.getRolesTotalPages()) {
      this.rolesCurrentPage++;
    }
  }

  getPaginatedUsers(): User[] {
    const start = (this.usersCurrentPage - 1) * this.usersPageSize;
    const end = start + this.usersPageSize;
    return this.users.slice(start, end);
  }

  getUsersStartIndex(): number {
    return (this.usersCurrentPage - 1) * this.usersPageSize + 1;
  }

  getUsersEndIndex(): number {
    return Math.min(this.usersCurrentPage * this.usersPageSize, this.users.length);
  }

  getUsersTotalPages(): number {
    return Math.ceil(this.users.length / this.usersPageSize);
  }

  usersPreviousPage(): void {
    if (this.usersCurrentPage > 1) {
      this.usersCurrentPage--;
    }
  }

  usersNextPage(): void {
    if (this.usersCurrentPage < this.getUsersTotalPages()) {
      this.usersCurrentPage++;
    }
  }

  // TrackBy functions
  trackByRole(index: number, role: Role): number {
    return role.id;
  }

  trackByUser(index: number, user: User): number {
    return user.id;
  }

  // User Details
  viewUserDetails(user: User): void {
    this.selectedUserForView = user;
    this.showUserDetailsModal = true;
  }

  closeUserDetailsModal(): void {
    this.showUserDetailsModal = false;
    this.selectedUserForView = null;
  }

  openAssignRolesFromDetails(): void {
    if (this.selectedUserForView) {
      this.closeUserDetailsModal();
      this.openAssignRolesModal(this.selectedUserForView);
    }
  }
}

