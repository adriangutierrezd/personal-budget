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
    }catch(error){
        throw new Error(error.message)
    }
}