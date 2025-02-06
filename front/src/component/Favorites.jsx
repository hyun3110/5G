import React from "react";

const Favorites = ({ favorites }) => {
  return (
    <div>
      <h3>즐겨찾기</h3>
      <div className="favorites-grid">
        {favorites.length > 0 ? (
          favorites.map((favorite) => (
            <div key={favorite.id} className="favorite-item">
              <img
                src={favorite.image}
                alt={`Favorite ${favorite.id}`}
                className="favorite-image"
              />
            </div>
          ))
        ) : (
          <p>즐겨찾기한 스타일이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default Favorites;
