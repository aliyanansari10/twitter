import React, { useState } from 'react';
import './trends.css';
import { FiSettings } from 'react-icons/fi';

import { BsThreeDots } from 'react-icons/bs';

function Trends() {
  const [searchValue, setSearchValue] = useState();
  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };
  console.log('Search Value', searchValue);
  return (
    <div className="col-md-3 col-lg-3">
      <div className="trends">
        <div className="search-bar">
          <nav className="navbar navbar-expand-lg">
            <form className="search-form d-flex">
              <input
                className="form-control me-2 rounded-pill"
                type="search"
                placeholder="Search"
                aria-label="Search"
                onChange={handleSearch}
              />
              <button className="btn custom-button" type="button">
                Search
              </button>
            </form>
          </nav>
        </div>
        <div className="trends-for-you my-4">
          <div className="trends-head">
            <h3>Trends For You</h3>
            <i>
              <button>
                <FiSettings />
              </button>
            </i>
          </div>
          <div className="trend-card">
            <div className="trend-content">
              <span className="country">Trending in Pakistan</span>
              <h5>Karachi</h5>
              <span className="tweet-count">9958 Tweets</span>
            </div>
            <div className="trend-icon">
              <i>
                <BsThreeDots />
              </i>
            </div>
          </div>
          <div className="trend-card">
            <div className="trend-content">
              <span className="country">Trending in Karachi</span>
              <h5>Islamabad</h5>
              <span className="tweet-count">12358 Tweets</span>
            </div>
            <div className="trend-icon">
              <i>
                <BsThreeDots />
              </i>
            </div>
          </div>
          <div className="trend-card">
            <div className="trend-content">
              <span className="country">Trending in Lahore</span>
              <h5>Quetta</h5>
              <span className="tweet-count">41958 Tweets</span>
            </div>
            <div className="trend-icon">
              <i>
                <BsThreeDots />
              </i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trends;
