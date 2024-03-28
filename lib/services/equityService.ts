export const getAllEquityPerDate = async (token: string) => {
    try{
        const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/equity-per-date`, {
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

export const getEquityPerDate = async (token: string,  startDate: string, endDate: string) => {
    try{
        const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/equity-per-date?date[gte]=${startDate}&date[lte]=${endDate}`, {
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


export const getEquityStatements = async (token: string, date: string) => {
    try{
        const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/equity-statements?date[eq]=${date}&includeCategories=1`, {
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

export const updateEquityStatement = async({
    token,
    statementId,
    props
}: {
    token: string,
    statementId: number,
    props: object
}) => {
    try{
        const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/equity-statements/${statementId}`, {
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

export const storeEquityStatement = async({
    token,
    props
}: {
    token: string,
    props: object
}) => {
    try{
        const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/equity-statements`, {
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

export const destroyEquityStatement = async({
    token,
    statementId
}: {
    token: string,
    statementId: number
}) => {
    try{
        const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/equity-statements/${statementId}`, {
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
