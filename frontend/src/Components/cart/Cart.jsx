import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { toast } from "react-toastify";
import { payment } from "../../redux/actions/orderActions";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = useContext(CartContext);
  const { error } = useSelector((state) => state.order);

  React.useEffect(() => {
    if (error) {
      toast.error(error);
      // Optional: dispatch(clearErrors()) if you import it
    }
  }, [error]);

  // Calculate totals
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const delivery = cart.length > 0 ? 40 : 0;
  const total = subtotal + delivery;

  const handleRemove = (id, name) => {
    removeFromCart(id);
    toast.info(`${name} removed from cart`, { position: "bottom-right", autoClose: 1500 });
  };

  const handleDecrease = (id, quantity, name) => {
    if (quantity <= 1) {
      removeFromCart(id);
      toast.info(`${name} removed from cart`, { position: "bottom-right", autoClose: 1500 });
    } else {
      decreaseQuantity(id);
    }
  };

  const checkoutHandler = () => {
    if (cart.length === 0) {
      return toast.error("Your cart is empty!");
    }
    dispatch(payment(cart, null));
  };

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some delicious food items to get started!</p>
          <Link to="/" className="btn-primary">
            Browse Foods
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2 className="cart-title">
        Your Cart{" "}
        <span style={{ color: "var(--text-light)", fontSize: "1rem", fontWeight: 500 }}>
          ({cart.length} item{cart.length > 1 ? "s" : ""})
        </span>
      </h2>

      <div className="cart-content">
        {/* Cart Items List */}
        <div className="cart-items">
          {cart.map((item) => {
            const imageUrl =
              item.images && item.images.length > 0
                ? item.images[0].url
                : item.image || "";
            const id = item.id;

            return (
              <div className="cart-item" key={id}>
                {/* Image */}
                <div className="cart-item-image">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.name}
                      onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                    />
                  ) : null}
                  <div className="image-placeholder" style={{ display: imageUrl ? "none" : "flex" }}>
                    🍽️
                  </div>
                </div>

                {/* Info */}
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p className="item-price">₹{item.price} each</p>
                </div>

                {/* Quantity Controls */}
                <div className="cart-item-controls">
                  <button
                    className="qty-btn"
                    onClick={() => handleDecrease(id, item.quantity, item.name)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="qty-display">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => increaseQuantity(id)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Item Total + Remove */}
                <div className="cart-item-total">
                  <p className="item-total-price">₹{(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(id, item.name)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="cart-summary">
          <h3>Order Summary</h3>

          <div className="summary-row">
            <span>Subtotal ({cart.reduce((a, i) => a + i.quantity, 0)} items)</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>₹{delivery.toFixed(2)}</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row total-row">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <button
            id="checkout_btn"
            className="btn-primary checkout-btn"
            onClick={checkoutHandler}
          >
            Proceed to Checkout →
          </button>

          <Link
            to="/"
            className="continue-shopping-link"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;