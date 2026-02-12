document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('news-form');
    const messageDiv = document.getElementById('message');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const title = document.getElementById('news-title').value;
            const category = document.getElementById('news-category').value;
            const image = document.getElementById('news-image').value;
            const content = document.getElementById('news-content').value;

            messageDiv.innerHTML = '<span class="text-info">Uploading...</span>';

            try {
                const response = await fetch('http://localhost:5000/api/news', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title, category, image, content })
                });

                const data = await response.json();

                if (response.ok) {
                    messageDiv.innerHTML = '<span class="text-success">News uploaded successfully!</span>';
                    form.reset();
                } else {
                    messageDiv.innerHTML = `<span class="text-danger">Error: ${data.message}</span>`;
                }
            } catch (error) {
                console.error('Upload Error:', error);
                messageDiv.innerHTML = '<span class="text-danger">Failed to connect to backend. Is it running?</span>';
            }
        });
    }
});
