import { useEffect, useState } from "react";
import { checkFakeNews } from "../utils/fakeNewsCheck"; // adjust path if needed

const NewsCard = ({ article }) => {
  const { urlToImage, title, description, publishedAt, source, url } = article;
  const [authenticity, setAuthenticity] = useState("Checking...");

  const imageSrc = urlToImage || "https://via.placeholder.com/400x200?text=No+Image";

  const date = new Date(publishedAt).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });

  useEffect(() => {
    const check = async () => {
      if (!description && !title) {
        setAuthenticity("❓ Not enough content to verify.");
        return;
      }
      const result = await checkFakeNews(description || title);
      setAuthenticity(result);
    };
    check();
  }, [description, title]);

  return (
    <div className="card" onClick={() => window.open(url, "_blank")}>
      <div className="card-header">
        <img src={imageSrc} alt="news" id="news-img" />
      </div>
      <div className="card-content">
        <h3 id="news-title">{title}</h3>
        <h6 className="news-source" id="news-source">
          {source.name} · {date}
        </h6>
        <p className="news-desc" id="news-desc">{description}</p>
        <p
          className={`news-authenticity ${
            authenticity.includes("Fake") ? "text-red-600" : "text-green-600"
          } text-sm italic mt-2`}
        >
          {authenticity}
        </p>
      </div>
    </div>
  );
};

export default NewsCard;
