export const deleteService = async (path: string, token: string, params: object = {}) => {
    let response = await fetch(path, {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token // Include the CSRF token here
        },
        method: "DELETE",
            ...params
    })

    return response;
}

export const pathService = async (path: string, token: string, params: object = {}) => {
    let response = await fetch(path, {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token // Include the CSRF token here
        },
        method: "PATCH",
        ...params
    })

    return response;
}
