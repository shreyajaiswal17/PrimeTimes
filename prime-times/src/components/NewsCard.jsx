import { useEffect, useState } from "react";
import { checkFakeNews } from "../utils/fakeNewsCheck"; // Ensure correct path

const NewsCard = ({ article }) => {
  const { urlToImage, title, description, publishedAt, source, url } = article;
  const [authenticity, setAuthenticity] = useState("Checking...");

  const imageSrc = urlToImage || "https://via.placeholder.com/400x200?text=No+Image";

  const date = new Date(publishedAt).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });

  useEffect(() => {
    let isMounted = true;

    const check = async () => {
      if (!description && !title) {
        setAuthenticity("❓ Not enough content to verify.");
        return;
      }

      try {
        const result = await checkFakeNews(description || title);
        if (isMounted) {
          setAuthenticity(result);
        }
      } catch (err) {
        if (isMounted) {
          setAuthenticity("❓ Unable to verify authenticity.");
        }
      }
    };

    check();

    return () => {
      isMounted = false; // cleanup to avoid setting state on unmounted component
    };
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
            authenticity.includes("Fake")
              ? "text-red-600"
              : authenticity.includes("Real")
              ? "text-green-600"
              : "text-yellow-600"
          } text-sm italic mt-2`}
        >
          {authenticity}
        </p>
      </div>
    </div>
  );
};

export default NewsCard;

