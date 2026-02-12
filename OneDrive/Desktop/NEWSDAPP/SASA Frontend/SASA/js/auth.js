// Auth Logic (Mock)
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            // Clear previous errors
            loginError.style.display = 'none';
            loginError.textContent = '';

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Mock successful login
            const mockUser = {
                name: 'Test User',
                email: email,
                role: 'user'
            };
            const mockToken = 'mock-jwt-token-12345';

            localStorage.setItem('token', mockToken);
            localStorage.setItem('user', JSON.stringify(mockUser));

            // Redirect to home page
            window.location.href = 'index.html';
        });
    }
});
