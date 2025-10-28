export interface INC20A {
  id?: number;
  refUser?: number;
  companyId?: number;
  cin?: string;
  companyName?: string;
  companyAddress?: string;
  companyEmail?: string;
  
  // Form-specific fields will be added based on the actual form structure
  // This is a template that needs to be customized for each form
  
  // Audit fields
  createdBy?: number;
  createdOn?: string;
  updatedBy?: number;
  updatedOn?: string;
  isActive?: boolean;
}

export interface INC20AView extends INC20A {
  refUserName?: string;
}