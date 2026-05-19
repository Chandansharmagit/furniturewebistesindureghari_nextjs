import React, { useEffect, useState } from "react";
import "./livingspaces.css";

const FlashSale = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: "Bedroom Furniture",
        image: "https://images.woodenstreet.de/wsnew2024/static-webmedia/images/fabric-sofa/new-osbert-set/new-logo/1-750x650.jpg",
        link: "/products/headphones",
      },
      {
        id: 2,
        name: "Living Room",
        image: "https://images.woodenstreet.de/wsnew2024/static-webmedia/images/bed-with-storage/adolph-bed-with-side-storage/revised/revised/honey/updated/honey/new-logo/1-750x650.jpg",
        link: "/products/smartwatch",
      },
      {
        id: 3,
        name: "Dining Room",
        image: "https://images.woodenstreet.de/wsnew2024/static-webmedia/images/dining-set/6-seater/trish-advait-6-seater-dining-table-set-with-bench/updated/new-update/4.jpg",
        link: "/products/speaker",
      },
      {
        id: 4,
        name: "Study Room",
        image: "https://images.woodenstreet.de/wsnew2024/static-webmedia/images/sofa-beds/sereta-sofa-cum-bed/updated/honey/updated/new-logo/3-750x650.jpg",
        link: "/products/mouse",
      },
      {
        id: 5,
        name: "Outdoor Furniture",
        image: "https://images.woodenstreet.de/wsnew2024/static-webmedia/images/coffee-table/petlin-coffee-table-revised/revised/honey/revised/new-logo/1-750x650.jpg",
        link: "/products/earbuds",
      },
      {
        id: 6,
        name: "Kids Room",
        image: "https://images.woodenstreet.de/wsnew2024/static-webmedia/images/home-temple/maurya-home-temple/revised/honey/updated/new-logo/1-750x650.jpg",
        link: "/products/laptop-stand",
      },
    ];

    setProducts(mockProducts);
  }, []);

  return (
    <>
      <h1 className="recomended">Beautify Your Living Spaces</h1>
      <h4 className="texts">Revamp Every Corner with Elegance</h4>

      <div className="flash-sale-grid-unique">
        {products.map((profile) => (
          <div className="flash-grid-item-1" key={profile.id}>
            <a href={profile.link}>
              <img
                src={profile.image || "https://picsum.photos/600/600?random=10"}
                alt={profile.name || "Product image"}
                id="flash-sale-img-1"
                onError={(e) => {
                  e.target.src = "https://picsum.photos/600/600?random=10";
                }}
              />
            </a>
          </div>
        ))}
      </div>
    </>
  );
};

export default FlashSale;
