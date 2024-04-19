
export async function checkAuthStatus() {
    const resp = await  fetch('api/authenticated');
    return resp.status === 200;
}

