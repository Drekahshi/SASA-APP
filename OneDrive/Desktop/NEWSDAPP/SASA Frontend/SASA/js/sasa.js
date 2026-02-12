// Notes:
// - Target: Replace first main content image with new article link
// - Link: https://www.the-star.co.ke/opinion/star-blogs/2026-02-05-bwire-virtual-spaces-next-frontier-in-prevention-of-violent-extremism?fbclid=IwdGRzaAP0B-pjbGNrA_QHkGV4dG4DYWVtAjExAHNydGMGYXBwX2lkDDM1MDY4NTUzMTcyOAABHoSzY-LaFRtXF5rpBsZSQmFLj1dU4CcpIltRGXbAMFwfl4P3-UR1zajZ4ocx_aem_gxlei6eK-5l4xWI1ktkJYQ&sfnsn=wa
// - Title: Virtual spaces: Next frontier in prevention of violent extremism
// - Function: Remove first picture and replace with article link

function replaceFirstImageWithArticle() {
    // Find the first main content image (excluding logo and ads)
    const firstImage = document.querySelector('.utf_post_thumb img.img-fluid');
    
    if (firstImage) {
        // Get the parent container
        const thumbContainer = firstImage.parentElement;
        const postBlock = thumbContainer.closest('.utf_post_block_style');
        
        // Create new article link
        const articleLink = document.createElement('a');
        articleLink.href = 'https://www.the-star.co.ke/opinion/star-blogs/2026-02-05-bwire-virtual-spaces-next-frontier-in-prevention-of-violent-extremism?fbclid=IwdGRzaAP0B-pjbGNrA_QHkGV4dG4DYWVtAjExAHNydGMGYXBwX2lkDDM1MDY4NTUzMTcyOAABHoSzY-LaFRtXF5rpBsZSQmFLj1dU4CcpIltRGXbAMFwfl4P3-UR1zajZ4ocx_aem_gxlei6eK-5l4xWI1ktkJYQ&sfnsn=wa';
        articleLink.target = '_blank';
        articleLink.className = 'article-link';
        articleLink.innerHTML = `
            <div class="article-preview">
                <h3>Virtual spaces: Next frontier in prevention of violent extremism</h3>
                <p>Click to read the full article about virtual spaces and their role in preventing violent extremism...</p>
                <span class="read-more">Read More →</span>
            </div>
        `;
        
        // Add CSS styling for the article preview
        const style = document.createElement('style');
        style.textContent = `
            .article-link {
                display: block;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-decoration: none;
                border-radius: 8px;
                transition: all 0.3s ease;
                min-height: 200px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .article-link:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                text-decoration: none;
                color: white;
            }
            .article-preview {
                text-align: center;
            }
            .article-preview h3 {
                margin: 0 0 10px 0;
                font-size: 1.2em;
                font-weight: bold;
            }
            .article-preview p {
                margin: 0 0 15px 0;
                opacity: 0.9;
            }
            .read-more {
                font-weight: bold;
                font-size: 1.1em;
            }
        `;
        document.head.appendChild(style);
        
        // Replace the image with the article link
        if (postBlock) {
            postBlock.replaceChild(articleLink, thumbContainer);
        } else {
            thumbContainer.replaceWith(articleLink);
        }
        
        console.log('First image replaced with article link successfully');
    } else {
        console.log('No suitable image found to replace');
    }
}

// Auto-execute when DOM is loaded
document.addEventListener('DOMContentLoaded', replaceFirstImageWithArticle);

// Also make it available globally for manual execution
window.replaceFirstImageWithArticle = replaceFirstImageWithArticle;