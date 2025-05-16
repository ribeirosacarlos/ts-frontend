const API_URL = 'http://localhost:8080/api';

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        // Token inválido ou expirado
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
    }

    return response;
} 