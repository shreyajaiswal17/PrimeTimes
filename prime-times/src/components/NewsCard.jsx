// src/components/NewsCard.jsx
const NewsCard = ({ article }) => {
    const { urlToImage, title, description, publishedAt, source, url } = article;
    if (!urlToImage) return null;
  
    const date = new Date(publishedAt).toLocaleString("en-US", {
      timeZone: "Asia/Jakarta",
    });
  
    return (
      <div className="card" onClick={() => window.open(url, "_blank")}>
        <div className="card-header">
          <img src={urlToImage} alt="news" id="news-img" />
        </div>
        <div className="card-content">
          <h3 id="news-title">{title}</h3>
          <h6 className="news-source" id="news-source">
            {source.name} · {date}
          </h6>
          <p className="news-desc" id="news-desc">{description}</p>
        </div>
      </div>
    );
  };
  
  export default NewsCard;
  