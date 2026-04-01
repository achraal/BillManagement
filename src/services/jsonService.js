const API_URL = "http://localhost:3001";

export const jsonService = {
    getArticles: () => fetch(`${API_URL}/articles`).then(res => res.json()),
    getCategories: () => fetch(`${API_URL}/categories`).then(res => res.json()),
    addArticle: (article) => fetch(`${API_URL}/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article)
    }).then(res => res.json()),
    deleteArticle: (id) => fetch(`${API_URL}/articles/${id}`, { method: 'DELETE' })
};