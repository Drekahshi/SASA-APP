document.addEventListener('DOMContentLoaded', () => {
    loadNews();
});

async function loadNews() {
    const newsContainer = document.getElementById('dynamic-news-section');
    if (!newsContainer) return;

    try {
        const response = await fetch('http://localhost:5000/api/news');
        const data = await response.json();

        if (data.success && data.data.length > 0) {
            // Clear existing static content if you want to replace everything, 
            // OR append new items. For now, we prepend new items.
            // But since the HTML might have static items, we should decide strategy.
            // Strategy: Create a new row for dynamic news at the top.

            const newsHtml = data.data.map(article => `
                <div class="col-md-6 mb-4">
                    <div class="utf_post_block_style clearfix">
                        <div class="utf_post_thumb"> 
                            <a href="#"><img class="img-fluid" src="${article.image}" alt="${article.title}" style="height: 200px; object-fit: cover;"></a> 
                        </div>
                        <a class="utf_post_cat" href="#">${article.category}</a>
                        <div class="utf_post_content">
                            <h2 class="utf_post_title title-small"> <a href="#">${article.title}</a> </h2>
                            <p>${article.content.substring(0, 100)}...</p>
                            <div class="utf_post_meta"> <span class="utf_post_date"><i class="fa fa-clock-o"></i> ${new Date(article.date).toLocaleDateString()}</span> </div>
                        </div>
                    </div>
                </div>
            `).join('');

            newsContainer.innerHTML = newsHtml;
        }
    } catch (error) {
        console.error('Error loading news:', error);
        // Optionally show nothing or a message
    }
}
