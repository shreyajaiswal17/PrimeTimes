import './assets/style.css';
import logo from './assets/logo.png';
import { useEffect, useState } from 'react';
import NewsCard from './components/NewsCard';

const API_KEY = "28dbf04d6ca743b5935cc72a74d314b7";
const url = "https://newsapi.org/v2/everything?q=";

function App() {
  const [articles, setArticles] = useState([]);
  const [query, setQuery] = useState('India');
  const [activeNav, setActiveNav] = useState(null);

  const categories = ['Sports', 'Finance', 'Politics', 'Bollywood', 'Technology', 'Stock Market'];

  useEffect(() => {
    fetchNews(query);
  }, [query]);

  const fetchNews = async (searchTerm) => {
    try {
      const res = await fetch(`${url}${searchTerm}&apiKey=${API_KEY}`);
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    setActiveNav(null);
    fetchNews(query);
  };

  const handleCategoryClick = (cat) => {
    setQuery(cat);
    setActiveNav(cat);
  };

  return (
    <>
      <nav>
        <div className="main-nav container flex">
          <a href="#" className="company-logo" onClick={() => window.location.reload()}>
            <img src={logo} alt="company logo" />
          </a>
          <div className="nav-links">
            <ul className="flex">
              {categories.map((cat) => (
                <li
                  key={cat}
                  className={`hover-link nav-item ${activeNav === cat ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>
          <div className="search-bar flex">
            <input
              type="text"
              className="news-input"
              placeholder="e.g. Science"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="search-button" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </nav>

      <main>
        <div className="cards-container container flex">
          {articles.map((article, idx) => (
            <NewsCard article={article} key={idx} />
          ))}
        </div>
      </main>
    </>
  );
}

export default App;
