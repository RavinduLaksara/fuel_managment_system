import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar2 = ({ 
  brand,
  links,
  actionButtons = [], // For buttons like "Download" or "Sign Up"
  className = ''
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  const handleMouseEnter = (index) => {
    if (links[index]?.dropdownItems?.length > 0) {
      setActiveDropdown(index);
    }
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <nav className={`navbar2 ${className}`}>
      <div className="navbar2-container">
        <div className="navbar2-left">
          <Link to="/" className="navbar2-brand">
            {brand}
          </Link>

          <div className="navbar2-links">
            {links.map((link, index) => (
              <div
                key={index}
                className="nav2-link-container"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to={link.path}
                  className={`nav2-link ${location.pathname === link.path ? 'active' : ''} ${link.dropdownItems ? 'has-dropdown' : ''}`}
                >
                  <span className="nav2-label">{link.label}</span>
                  {link.dropdownItems && (
                    <span className="dropdown-arrow">▼</span>
                  )}
                  {link.badge && (
                    <span className="nav2-badge">{link.badge}</span>
                  )}
                </Link>

                {link.dropdownItems && activeDropdown === index && (
                  <div className="dropdown-menu">
                    {link.dropdownItems.map((item, itemIndex) => (
                      <Link
                        key={itemIndex}
                        to={item.path}
                        className="dropdown-item"
                      >
                        {item.icon && <span className="dropdown-item-icon">{item.icon}</span>}
                        <div className="dropdown-item-content">
                          <div className="dropdown-item-title">{item.label}</div>
                          {item.description && (
                            <div className="dropdown-item-description">{item.description}</div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="navbar2-right">
          {actionButtons.map((button, index) => (
            <button
              key={index}
              onClick={button.onClick}
              className={`nav2-button ${button.variant || 'primary'}`}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

// Add styles for the navbar component
const styles = `
  .navbar2 {
    background-color: #0D1117;
    padding: 0.75rem 2rem;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .navbar2-container {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .navbar2-left {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .navbar2-brand {
    color: #00FFD1;
    text-decoration: none;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .navbar2-links {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .nav2-link-container {
    position: relative;
  }

  .nav2-link {
    color: #ffffff;
    text-decoration: none;
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
    transition: color 0.2s;
  }

  .nav2-link:hover {
    color: #00FFD1;
  }

  .nav2-link.active {
    color: #00FFD1;
  }

  .nav2-link.has-dropdown {
    padding-right: 1.5rem;
  }

  .dropdown-arrow {
    font-size: 0.7rem;
    margin-left: 0.25rem;
  }

  .nav2-badge {
    background-color: #00FFD1;
    color: #0D1117;
    padding: 0.15rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: #1C2128;
    border-radius: 8px;
    padding: 0.5rem;
    min-width: 280px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    margin-top: 0.5rem;
  }

  .dropdown-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 0.75rem;
    text-decoration: none;
    color: #ffffff;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .dropdown-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .dropdown-item-icon {
    color: #00FFD1;
    font-size: 1.2rem;
  }

  .dropdown-item-content {
    flex: 1;
  }

  .dropdown-item-title {
    font-weight: 500;
    margin-bottom: 0.25rem;
  }

  .dropdown-item-description {
    font-size: 0.85rem;
    color: #8B949E;
  }

  .navbar2-right {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .nav2-button {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
  }

  .nav2-button.primary {
    background-color: #00FFD1;
    color: #0D1117;
  }

  .nav2-button.primary:hover {
    background-color: #00E6BC;
  }

  .nav2-button.secondary {
    background-color: transparent;
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .nav2-button.secondary:hover {
    border-color: #00FFD1;
    color: #00FFD1;
  }
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default Navbar2;
