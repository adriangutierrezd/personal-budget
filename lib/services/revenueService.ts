export const getRevenues = async (token: string, startDate: string, endDate: string) => {
    try{
        const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/revenues/?date[gte]=${startDate}&date[lte]=${endDate}`, {
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