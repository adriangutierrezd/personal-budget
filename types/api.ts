export type Expense = {
    id: number;
    userId: number;
    categoryId: number;
    name: string;
    description: string | null;
    date: string;
    week: number;
    month: number;
    year: number;
    amount: number;
    category?: Category
}

export type RecurringExpense = {
    id: number;
    userId: number;
    categoryId: number;
    name: string;
    description: string | null;
    amount: number;
    category?: Category
}

export type Revenue = {
    id: number;
    userId: number;
    name: string;
    description: string | null;
    date: string;
    week: number;
    month: number;
    year: number;
    amount: number;
};

export type Category = {
    id: number;
    name: string;
    type: string;
    color: string;
    userId: number;
}

export type MonthData = {
    monthName: string;
    year: number;
    earnedAmount: string | number;
    spentAmount: string | number; 
    totalSaved: string | number;  
    savedPercentage: string | number;
}

export type MonthRawData = {
    month: number;
    year: number;
    total: number;
    yearMonth: string;
  }