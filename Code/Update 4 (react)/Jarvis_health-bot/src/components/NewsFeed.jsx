import { useState, useEffect } from 'react';
import axios from 'axios';
import './NewsFeed.css';

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // In a real app, you would use NewsAPI or similar service
        // const response = await axios.get('/api/news');
        // setArticles(response.data.articles);
        
        // Mock data for demo
        const mockArticles = [
          {
            id: 1,
            title: "New Study Reveals Benefits of Mediterranean Diet",
            description: "Recent research confirms significant health benefits from following a Mediterranean-style diet.",
            source: "Health Journal",
            date: "2023-11-15",
            url: "#",
            image: "/assets/news1.jpg"
          },
          {
            id: 2,
            title: "Breakthrough in Diabetes Treatment",
            description: "Scientists discover new approach that could revolutionize treatment for type 2 diabetes.",
            source: "Medical News Today",
            date: "2023-11-10",
            url: "#",
            image: "/assets/news2.jpg"
          },
          {
            id: 3,
            title: "WHO Updates COVID-19 Guidelines",
            description: "World Health Organization releases updated recommendations for COVID-19 prevention.",
            source: "Global Health",
            date: "2023-11-05",
            url: "#",
            image: "/assets/news3.jpg"
          }
        ];
        
        setTimeout(() => {
          setArticles(mockArticles);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to load news articles");
        setLoading(false);
        console.error("Error fetching news:", err);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="news-feed">
      <div className="news-header">
        <h2>Latest Health News</h2>
        <div className="news-filter">
          <select>
            <option value="all">All Categories</option>
            <option value="covid">COVID-19</option>
            <option value="nutrition">Nutrition</option>
            <option value="research">Medical Research</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <i className="ri-loader-4-line"></i>
        </div>
      ) : error ? (
        <div className="error-message">
          <i className="ri-error-warning-line"></i>
          <p>{error}</p>
        </div>
      ) : (
        <div className="articles-container">
          {articles.map((article) => (
            <div key={article.id} className="article-card">
              <div className="article-image">
                <img src={article.image} alt={article.title} />
              </div>
              <div className="article-content">
                <h3>{article.title}</h3>
                <p className="article-meta">
                  {article.source} • {article.date}
                </p>
                <p className="article-description">{article.description}</p>
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more">
                  Read More <i className="ri-arrow-right-line"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsFeed;