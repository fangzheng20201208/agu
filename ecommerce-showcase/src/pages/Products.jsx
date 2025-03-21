import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import AnimatedBackground from '../components/AnimatedBackground';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import AddProductModal from '../components/AddProductModal';

const Container = styled.div`
  min-height: 100vh;
  padding: 80px 20px 20px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled(motion.h1)`
  font-size: 2.5rem;
  color: white;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled(motion.p)`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const ProductsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
`;

const LoadingSpinner = styled(motion.div)`
  text-align: center;
  color: white;
  font-size: 1.2rem;
  padding: 2rem;
`;

const ErrorMessage = styled(motion.div)`
  color: #ff6b6b;
  text-align: center;
  padding: 1rem;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 10px;
  margin: 1rem auto;
  max-width: 600px;
`;

const EmptyMessage = styled(motion.div)`
  text-align: center;
  color: white;
  padding: 2rem;
  font-size: 1.2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  backdrop-filter: blur(5px);
`;

const UploadButton = styled(motion.button)`
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(45deg, #4ecdc4, #2cb5e8);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
  z-index: 1000;
  transition: all 0.3s ease;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    background: linear-gradient(45deg, #4ecdc4, #2cb5e8);
    opacity: 0.6;
    filter: blur(10px);
    z-index: -1;
    transition: all 0.3s ease;
  }

  &::after {
    content: '+';
    font-size: 32px;
    font-weight: 300;
    color: white;
    transition: all 0.3s ease;
    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(78, 205, 196, 0.5);
    
    &::before {
      opacity: 0.8;
      filter: blur(15px);
    }

    &::after {
      transform: rotate(180deg) scale(1.1);
    }
  }

  &:active {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(78, 205, 196, 0.4);
  }
`;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.response?.data?.message || '获取商品列表失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <ContentWrapper>
        <Header>
          <Title
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            精选商品展示
          </Title>
          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            发现独特的商品，享受优质的购物体验
          </Subtitle>
        </Header>

        <AnimatePresence>
          {loading ? (
            <LoadingSpinner
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              加载中...
            </LoadingSpinner>
          ) : error ? (
            <ErrorMessage
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {error}
            </ErrorMessage>
          ) : products.length === 0 ? (
            <EmptyMessage
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              暂无商品，请先上传商品。
            </EmptyMessage>
          ) : (
            <ProductsGrid
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </ProductsGrid>
          )}
        </AnimatePresence>

        {isAdmin && (
          <UploadButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsModalOpen(true)}
          />
        )}

        <AddProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onProductAdded={fetchProducts}
        />
      </ContentWrapper>
    </Container>
  );
};

export default Products; 