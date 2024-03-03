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
    color: string;
    userId: number;
}

type Session = {
    user: {
        token: string;
        user: {
            id: number;
            name: string;
            email: string;
            email_verified_at: null | string;
            created_at: string;
            updated_at: string;
        };
        iat: number;
        exp: number;
        jti: string;
    };
    expires: string;
};