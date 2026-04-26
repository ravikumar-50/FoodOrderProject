import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';

const FoodCard = ({ item }) => {
  const { addToCart } = useContext(CartContext);

  // Support both `item.rating` and `item.ratings` from JSON data
  const rating = item.ratings ?? item.rating ?? 0;
  // Derive image URL from images array or direct url
  const imageUrl = item.images && item.images.length > 0
    ? item.images[0].url
    : item.image || '';
  // Unique ID support
  const itemId = item._id?.$oid || item._id || item.id;

  const handleAddToCart = () => {
    addToCart({ ...item, id: itemId });
    toast.success(`${item.name} added to cart!`, {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: "light",
    });
  };

  return (
    <div className="food-card">
      <div className="food-image-container">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.name}
            className="food-image"
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
        ) : null}
        <div className="food-image-placeholder" style={{ display: imageUrl ? 'none' : 'flex' }}>
          🍽️
        </div>
      </div>

      <div className="food-info">
        <h3 className="food-name">{item.name}</h3>

        {item.description && (
          <p className="food-description">{item.description}</p>
        )}

        <div className="food-meta">
          <div className="food-rating">
            ⭐ <span>{Number(rating).toFixed(1)}</span>
            {item.numOfReviews && (
              <span className="food-reviews">({item.numOfReviews})</span>
            )}
          </div>
          {item.stock !== undefined && (
            <span className={`food-stock ${item.stock > 0 ? 'in-stock' : 'out-stock'}`}>
              {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          )}
        </div>

        <div className="food-footer">
          <span className="food-price">₹{item.price}</span>
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={item.stock === 0}
          >
            {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
