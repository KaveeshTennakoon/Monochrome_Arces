import api from "./api";

// TODO: 
export async function login(email, password) {
    return await api.post('/login', {
        email,
        password
    });
}

// TODO: 
export async function createAccount(name, nic, email, password) {
    return await api.post('/signup', {
        name, 
        nic,
        email,
        password
    });
}