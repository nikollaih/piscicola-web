export const deleteService = async (path: string, token: string, params: object = {}) => {
    return await fetch(path, {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token // Include the CSRF token here
        },
        method: "DELETE",
        ...params
    });
}

export const pathService = async (path: string, token: string, params: object = {}) => {
    return await fetch(path, {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token // Include the CSRF token here
        },
        method: "PATCH",
        ...params
    });
}

export const postService = async (path: string, token: string, params: object = {}) => {
    return await fetch(path, {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token // Include the CSRF token here
        },
        method: "POST",
        body: JSON.stringify(params)
    });
}
