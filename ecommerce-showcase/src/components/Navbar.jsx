import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Nav = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const NavContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 2rem;
`;

const Logo = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const LogoutButton = styled.button`
  background: transparent;
  border: 1px solid #ff6b6b;
  color: #ff6b6b;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-left: auto;
  
  &:hover {
    background: #ff6b6b;
    color: white;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  i {
    font-size: 0.8rem;
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  position: relative;
  padding: 0.5rem 0;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
  
  &.active::after {
    width: 100%;
  }
`;

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: scrolled ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.8)',
        boxShadow: scrolled ? '0 2px 10px rgba(0,0,0,0.3)' : 'none'
      }}
    >
      <NavContainer>
        <Logo to="/products">Future Shop</Logo>
        <NavLinks>
          <NavLink 
            to="/products" 
            className={location.pathname === '/products' ? 'active' : ''}
          >
            商品展示
          </NavLink>
          {isAdmin && (
            <NavLink 
              to="/users" 
              className={location.pathname === '/users' ? 'active' : ''}
            >
              用户管理
            </NavLink>
          )}
        </NavLinks>
        <LogoutButton onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          退出
        </LogoutButton>
      </NavContainer>
    </Nav>
  );
};

export default Navbar; 