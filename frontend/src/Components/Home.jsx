import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import FoodCard from './FoodCard';
import RestaurantCard from './RestaurantCard';
import { foods as mockFoods } from '../data/foods';
import { restaurants as mockRestaurants } from '../data/restaurants';
import { useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

// Derive category from food name since JSON data has no category field
const getCategory = (name = "") => {
  const n = name.toLowerCase();
  if (
    n.includes('coke') || n.includes('juice') || n.includes('lassi') ||
    n.includes('chai') || n.includes('tea') || n.includes('coffee') ||
    n.includes('water') || n.includes('drink') || n.includes('shake') ||
    n.includes('ml')
  ) return 'Beverages';
  if (
    n.includes('gulab jamun') || n.includes('jalebi') || n.includes('halwa') ||
    n.includes('kheer') || n.includes('barfi') || n.includes('dessert') ||
    n.includes('sweet') || n.includes('ice cream') || n.includes('kulfi') ||
    n.includes('payasam') || n.includes('ladoo')
  ) return 'Desserts';
  if (
    n.includes('pani puri') || n.includes('chaat') || n.includes('tikki') ||
    n.includes('bhel') || n.includes('samosa') || n.includes('kachori') ||
    n.includes('sandwich') || n.includes('manchurian') || n.includes('kabab') ||
    n.includes('65') || n.includes('vada') || n.includes('wada') ||
    n.includes('pakora') || n.includes('bhatura') || n.includes('puri') ||
    n.includes('roll') || n.includes('chhole') || n.includes('choley')
  ) return 'Street Food';
  return 'Main';
};

const Home = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const search = searchParams.get('search') || "";

  const [view, setView] = useState("restaurants");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");

  const categories = ["All", "Main", "Street Food", "Desserts", "Beverages"];

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/users/login" replace />;
  }

  const filteredFoods = mockFoods
    .filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    .filter(item => {
      if (category === "All") return true;
      return getCategory(item.name) === category;
    })
    .sort((a, b) => {
      const rA = a.ratings || a.rating || 0;
      const rB = b.ratings || b.rating || 0;
      if (sort === "priceLow") return a.price - b.price;
      if (sort === "priceHigh") return b.price - a.price;
      if (sort === "ratingHigh") return rB - rA;
      return 0;
    });

  const filteredRestaurants = mockRestaurants
    .filter(res =>
      res.name.toLowerCase().includes(search.toLowerCase()) ||
      res.address.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "ratingHigh") return b.ratings - a.ratings;
      return 0;
    });

  return (
    <div className="home-container">
      {/* View Toggle */}
      <div className="view-toggle-container">
        <div className="view-toggle">
          <button
            className={`toggle-btn ${view === "restaurants" ? 'active' : ''}`}
            onClick={() => setView("restaurants")}
          >
            Restaurants
          </button>
          <button
            className={`toggle-btn ${view === "foods" ? 'active' : ''}`}
            onClick={() => setView("foods")}
          >
            Foods
          </button>
        </div>
      </div>

      <div className="controls-section">
        {/* Categories (Only for Foods) */}
        {view === "foods" ? (
          <div className="categories-wrapper">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-btn ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        ) : (
          <div className="category-label">
            <h3>Popular Restaurants</h3>
          </div>
        )}

        {/* Sorting */}
        <div className="sort-wrapper">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="sort-select"
          >
            <option value="">Sort By</option>
            {view === "foods" && <option value="priceLow">Price: Low to High</option>}
            {view === "foods" && <option value="priceHigh">Price: High to Low</option>}
            <option value="ratingHigh">Rating: High to Low</option>
          </select>
        </div>
      </div>

      {search && (
        <div className="search-results-info">
          <p>Showing results for: <strong>{search}</strong></p>
        </div>
      )}

      {view === "foods" ? (
        <div className="foods-grid">
          {filteredFoods.length > 0 ? (
            filteredFoods.map(item => (
              <FoodCard key={item._id?.$oid || item.id} item={item} />
            ))
          ) : (
            <div className="no-items">
              <h3>No items found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      ) : (
        <div className="restaurants-grid">
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map(res => (
              <RestaurantCard key={res._id} restaurant={res} />
            ))
          ) : (
            <div className="no-items">
              <h3>No restaurants found</h3>
              <p>Try adjusting your search</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
