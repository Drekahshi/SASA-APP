const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../../data/news.json');

// Helper to read data
const readData = () => {
    if (!fs.existsSync(dataPath)) {
        return [];
    }
    const jsonData = fs.readFileSync(dataPath);
    return JSON.parse(jsonData);
};

// Helper to write data
const writeData = (data) => {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

exports.getAllNews = (req, res) => {
    try {
        const news = readData();
        res.json({ success: true, data: news });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error reading news data' });
    }
};

exports.createNews = (req, res) => {
    try {
        const { title, content, image, category } = req.body;

        if (!title || !content) {
            return res.status(400).json({ success: false, message: 'Title and content are required' });
        }

        const news = readData();
        const newArticle = {
            id: Date.now().toString(),
            title,
            content,
            image: image || 'images/news/default.jpg',
            category: category || 'General',
            date: new Date().toISOString()
        };

        news.unshift(newArticle); // Add to top
        writeData(news);

        res.status(201).json({ success: true, message: 'Article created', data: newArticle });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error saving article' });
    }
};
