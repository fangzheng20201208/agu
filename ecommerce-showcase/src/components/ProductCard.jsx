import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`;

const StyledCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const ProductContent = styled.div`
  padding: 1.5rem;
`;

const ProductTitle = styled.h3`
  font-size: 1.4rem;
  color: white;
  margin: 0 0 0.5rem;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ProductPrice = styled.p`
  font-size: 1.5rem;
  color: #4ecdc4;
  font-weight: bold;
  margin: 0.5rem 0;
`;

const ProductDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0.5rem 0 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductCard = ({ product }) => {
  // 处理图片 URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/400?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`; // 添加后端服务器地址
  };

  return (
    <StyledLink to={`/product/${product._id}`}>
      <StyledCard
        whileHover={{ 
          y: -10,
          boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
        }}
        transition={{ duration: 0.3 }}
      >
        <ProductImage 
          src={getImageUrl(product.image)} 
          alt={product.name}
          onError={(e) => {
            console.error('Image load error for:', product.image);
            e.target.src = 'https://via.placeholder.com/400?text=Image+Not+Found';
          }}
        />
        <ProductContent>
          <ProductTitle>{product.name}</ProductTitle>
          <ProductPrice>¥{product.price}</ProductPrice>
          <ProductDescription>{product.description}</ProductDescription>
        </ProductContent>
      </StyledCard>
    </StyledLink>
  );
};

export default ProductCard; 