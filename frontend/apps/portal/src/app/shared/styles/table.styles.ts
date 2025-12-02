/**
 * Shared table styles for consistent design across the application
 * Based on Share Certificate table design with purple header and alternating row colors
 */
export const TABLE_STYLES = `
  /* Table Wrapper */
  .table-wrapper {
    overflow-x: auto;
    margin-bottom: 1.5rem;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  /* Data Table */
  .data-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 0.95rem;
    background: white;
    border-radius: 8px;
    overflow: hidden;
  }

  /* Table Header - Dark Purple/Blue Gradient */
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
    font-size: 0.9rem;
    white-space: nowrap;
    border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  }

  /* Table Body - Alternating Row Colors (Theme Matching) */
  .data-table tbody tr {
    transition: all 0.2s ease;
    background: rgba(102, 126, 234, 0.05); /* Light purple tint */
  }

  .data-table tbody tr:nth-child(even) {
    background: rgba(118, 75, 162, 0.05); /* Light purple-blue tint */
  }

  .data-table tbody tr:hover {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.12), rgba(118, 75, 162, 0.12));
    transform: scale(1.01);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .data-table td {
    padding: 0.5rem 1rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    font-size: 0.95rem;
    color: #333;
  }

  .data-table tbody tr:last-child td:first-child {
    border-bottom-left-radius: 8px;
  }

  .data-table tbody tr:last-child td:last-child {
    border-bottom-right-radius: 8px;
  }

  /* Action Buttons */
  .action-cell {
    text-align: center;
    white-space: nowrap;
  }

  .action-column {
    text-align: center;
    white-space: nowrap;
  }

  .action-column .action-btn {
    display: inline-flex;
    margin: 0 0.25rem;
  }

  .action-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0.5rem;
    border-radius: 6px;
    transition: all 0.2s ease;
    margin: 0 0.25rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .action-btn:hover {
    background: rgba(102, 126, 234, 0.15);
    transform: scale(1.15);
  }

  .action-btn.delete-btn:hover {
    background: rgba(255, 68, 68, 0.15);
  }

  /* Status Badges */
  .status-badge {
    padding: 0.4rem 0.85rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 700;
    display: inline-block;
    white-space: nowrap;
  }

  .status-active {
    background: linear-gradient(135deg, #11998e, #38ef7d);
    color: white;
  }

  .status-inactive {
    background: linear-gradient(135deg, #f093fb, #f5576c);
    color: white;
  }

  /* Table Footer */
  .table-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid #e0e0e0;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .entries-info {
    color: #666;
    font-size: 0.95rem;
    font-weight: 600;
  }

  /* Pagination */
  .pagination {
    display: flex;
    gap: 0.5rem;
  }

  .page-btn {
    padding: 0.5rem 0.85rem;
    border: none;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    color: #667eea;
    transition: all 0.2s ease;
    min-width: 40px;
    text-align: center;
  }

  .page-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border-color: transparent;
    transform: translateY(-1px);
  }

  .page-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .page-btn.active {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border-color: transparent;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  }

  /* No Data State */
  .no-data {
    text-align: center;
    padding: 3rem !important;
  }

  .empty-state p {
    margin: 0;
    color: #666;
    font-size: 0.95rem;
  }
`;

