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
    }catch(error: any){
        throw new Error(error.message)
    }
}


export const storeRevenue = async({
    token,
    props
}: {
    token: string,
    props: object
}) => {
    try{
        const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/revenues/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(props)
        })

        return data
    }catch(error: any){
        throw new Error(error.message) as Error
    }
}

export const destroyRevenue = async({
    token,
    revenueId
}: {
    token: string,
    revenueId: number
}) => {
    try{
        const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/revenues/${revenueId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })

        return data
    }catch(error: any){
        throw new Error(error.message) as Error
    }
}


export const updateRevenue = async({
    token,
    revenueId,
    props
}: {
    token: string,
    revenueId: number,
    props: object
}) => {
    try{
        const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/revenues/${revenueId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(props)
        })

        return data
    }catch(error: any){
        throw new Error(error.message) as Error
    }
}

export const getRevenuesByMonth = async (token: string, startDate: string, endDate: string) => {
    try{
        const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/revenues-by-month/?date[gte]=${startDate}&date[lte]=${endDate}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })

        const response = data.json()
        return response
    }catch(error: any){
        throw new Error(error.message)
    }
}

