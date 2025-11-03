interface useFetchProps {
    url: string
    data: any
}

export async function useFetch({ url, data }: useFetchProps) {
    const response = await fetch(`http://localhost:8000/${url}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        const error = await response.json()
        console.log(error)
        throw new Error(error.detail || "An error occurred while accessing the server.")
    }

    return response.json()
}
