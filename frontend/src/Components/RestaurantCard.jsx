import React from 'react';

const RestaurantCard = ({ restaurant }) => {
  // Support both images array and direct image field
  const imageUrl = restaurant.images && restaurant.images.length > 0
    ? restaurant.images[0].url
    : restaurant.image || '';

  return (
    <div className="restaurant-card">
      <div className="restaurant-image-container">
        {restaurant.isVeg && <span className="veg-tag">Pure Veg</span>}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={restaurant.name}
            className="restaurant-image"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="food-image-placeholder">🏪</div>
        )}
      </div>

      <div className="restaurant-info">
        <h3 className="restaurant-name">{restaurant.name}</h3>
        {restaurant.cuisine && (
          <p className="restaurant-cuisine">{restaurant.cuisine}</p>
        )}
        <p className="restaurant-address">📍 {restaurant.address}</p>

        <div className="restaurant-footer">
          <div className="restaurant-rating-box">
            <span className="rating-star">★</span>
            <span>{restaurant.ratings}</span>
            <span className="reviews-count">({restaurant.numOfReviews} reviews)</span>
          </div>
          <div className="restaurant-delivery-info">
            {restaurant.deliveryTime && (
              <span className="delivery-time">🕐 {restaurant.deliveryTime}</span>
            )}
            {restaurant.minOrder && (
              <span className="min-order">Min ₹{restaurant.minOrder}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
