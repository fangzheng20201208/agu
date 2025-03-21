import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { api } from '../services/api';

const Container = styled.div`
  min-height: 100vh;
  padding: 80px 20px 20px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const ProductContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageSection = styled.div`
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  aspect-ratio: 1;
  background: rgba(0, 0, 0, 0.2);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
    }
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ProductName = styled.h1`
  color: white;
  font-size: 2.5rem;
  margin: 0;
  background: linear-gradient(45deg, #4ecdc4, #2cb5e8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ProductPrice = styled.div`
  color: #4ecdc4;
  font-size: 2rem;
  font-weight: 600;
  
  &::before {
    content: '¥';
    font-size: 1.5rem;
    margin-right: 4px;
  }
`;

const Description = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: white;
  font-size: 1.2rem;
`;

const ErrorMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #ff6b6b;
  font-size: 1.2rem;
  text-align: center;
`;

const CreatedTime = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  margin-top: auto;
`;

const BackButton = styled(motion.button)`
  position: fixed;
  top: 100px;
  left: 40px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(78, 205, 196, 0.5);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 1000;

  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(45deg, #4ecdc4, #2cb5e8);
    border-radius: inherit;
    opacity: 0;
    transition: all 0.3s ease;
  }

  &::after {
    content: '←';
    font-size: 24px;
    color: #4ecdc4;
    z-index: 2;
    transition: all 0.3s ease;
    text-shadow: 0 0 10px rgba(78, 205, 196, 0.5);
  }

  .button-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, 
      rgba(78, 205, 196, 0.8) 0%,
      rgba(78, 205, 196, 0) 70%);
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 1;
  }

  &:hover {
    box-shadow: 0 0 20px rgba(78, 205, 196, 0.3),
                inset 0 0 20px rgba(78, 205, 196, 0.2);
    border-color: rgba(78, 205, 196, 0.8);
    transform: translateX(-5px);

    &::before {
      opacity: 0.1;
    }

    &::after {
      color: white;
      transform: scale(1.1);
      text-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
    }

    .button-glow {
      opacity: 0.15;
      animation: pulse 2s infinite;
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.15;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.3;
    }
    100% {
      transform: scale(1);
      opacity: 0.15;
    }
  }

  @media (max-width: 768px) {
    top: 85px;
    left: 20px;
  }
`;

const DeleteButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;

  &:hover {
    background: #ff5252;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // 处理图片 URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/400?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  useEffect(() => {
    // 检查用户是否是管理员
    const checkAdmin = () => {
      const user = JSON.parse(localStorage.getItem('user'));
      setIsAdmin(user?.role === 'admin');
    };

    checkAdmin();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.getProduct(id);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('获取商品信息失败');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('确定要删除这个商品吗？')) {
      try {
        await api.deleteProduct(id);
        navigate('/products');
      } catch (error) {
        console.error('Error deleting product:', error);
        setError('删除商品失败');
      }
    }
  };

  if (loading) {
    return (
      <Container>
        <ContentWrapper>
          <LoadingSpinner>加载中...</LoadingSpinner>
        </ContentWrapper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ContentWrapper>
          <ErrorMessage>{error}</ErrorMessage>
        </ContentWrapper>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <ContentWrapper>
          <ErrorMessage>商品不存在</ErrorMessage>
        </ContentWrapper>
      </Container>
    );
  }

  return (
    <Container>
      <ContentWrapper>
        <ProductContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {isAdmin && (
            <DeleteButton
              onClick={handleDelete}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              删除商品
            </DeleteButton>
          )}
          
          <ImageSection>
            <img 
              src={product ? getImageUrl(product.image) : 'https://via.placeholder.com/400?text=Loading'} 
              alt={product?.name || 'Product Image'}
              onError={(e) => {
                console.error('Image load error:', product?.image);
                e.target.src = 'https://via.placeholder.com/400?text=Image+Not+Found';
              }}
            />
          </ImageSection>
          
          <InfoSection>
            <ProductName>{product.name}</ProductName>
            <ProductPrice>{product.price}</ProductPrice>
            <Description>{product.description}</Description>
            <CreatedTime>
              发布时间：{new Date(product.createdAt).toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </CreatedTime>
          </InfoSection>
        </ProductContainer>
      </ContentWrapper>

      <BackButton
        onClick={() => navigate('/products')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="button-glow" />
      </BackButton>
    </Container>
  );
};

export default ProductDetail;