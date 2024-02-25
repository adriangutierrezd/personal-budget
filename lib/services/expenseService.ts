export const getExpenses = async (token: string, startDate: string, endDate: string) => {
    try{
        const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/expenses/?date[gte]=${startDate}&date[lte]=${endDate}&includeCategories=1`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })

        const response = data.json()
        return response
    }catch(error){
        throw new Error(error.message)
    }
}

export const updateExpense = async({
    token,
    expenseId,
    props
}: {
    token: string,
    expenseId: number,
    props: object
}) => {
    try{
        const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/expenses/${expenseId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(props)
        })
        const response = data.json()
        return response
    }catch(error: any){
        throw new Error(error.message) as Error
    }
}