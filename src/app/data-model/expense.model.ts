export interface Expense{
    id: number;
    date: string;
    expenseHead: string;
    amount: number;
    currency: string;
    expenseCategory: string[];
    isRecurring: boolean;
    isSelected: boolean;
    details: string;
}

export interface SelectEvent{
    id: number;
    selected: boolean;
  }