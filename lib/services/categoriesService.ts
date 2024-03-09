export const getCategories = async (token: string) => {
    try{
        const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categories/`, {
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


export const storeCategory = async({
    token,
    props
}: {
    token: string,
    props: object
}) => {
    try{
        const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categories/`, {
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

export const destroyCategory = async({
    token,
    categoryId
}: {
    token: string,
    categoryId: number
}) => {
    try{
        const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categories/${categoryId}`, {
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


export const updateCategory = async({
    token,
    categoryId,
    props
}: {
    token: string,
    categoryId: number,
    props: object
}) => {
    try{
        const data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categories/${categoryId}`, {
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