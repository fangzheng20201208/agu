import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { api } from '../services/api';

// 添加背景动画组件
const AnimatedBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  overflow: hidden;
  z-index: 0;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.3;
    animation: float 15s infinite ease-in-out;
  }

  &::before {
    background: #4ecdc4;
    top: -100px;
    left: -100px;
    animation-delay: 0s;
  }

  &::after {
    background: #2cb5e8;
    bottom: -100px;
    right: -100px;
    animation-delay: -7.5s;
  }

  @keyframes float {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    25% {
      transform: translate(50px, 50px) scale(1.1);
    }
    50% {
      transform: translate(0, 100px) scale(1);
    }
    75% {
      transform: translate(-50px, 50px) scale(0.9);
    }
  }
`;

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  position: relative;
  z-index: 1;
`;

const LoginForm = styled(motion.form)`
  width: 100%;
  max-width: 320px;
  padding: 35px 30px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: 0.5s;
    pointer-events: none;
  }

  &:hover::before {
    left: 100%;
  }
`;

const Title = styled(motion.h1)`
  text-align: center;
  color: #4ecdc4;
  margin-bottom: 30px;
  font-size: 2rem;
  background: linear-gradient(45deg, #4ecdc4, #2cb5e8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  padding-left: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  color: white;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #4ecdc4;
    box-shadow: 0 0 10px rgba(78, 205, 196, 0.3);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  background: linear-gradient(45deg, #4ecdc4, #2cb5e8);
  color: white;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
  box-sizing: border-box;

  &:hover {
    box-shadow: 0 6px 20px rgba(78, 205, 196, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  text-align: center;
  margin: 10px 0;
  font-size: 0.9rem;
`;

const SwitchMode = styled.div`
  text-align: center;
  margin-top: 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;

  span {
    color: #4ecdc4;
    cursor: pointer;
    margin-left: 5px;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api[isLogin ? 'login' : 'register'](formData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      navigate('/products');
    } catch (error) {
      setError(
        error.response?.data?.message || 
        error.message || 
        '操作失败，请重试'
      );
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <>
      <AnimatedBackground />
      <LoginContainer>
        <LoginForm 
          onSubmit={handleSubmit}
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <Title
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            {isLogin ? '用户登录' : '用户注册'}
          </Title>
          
          <motion.div variants={itemVariants}>
            <FormGroup>
              <Label>用户名</Label>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="请输入用户名"
                required
                disabled={loading}
              />
            </FormGroup>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <FormGroup>
              <Label>密码</Label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="请输入密码"
                required
                disabled={loading}
              />
            </FormGroup>
          </motion.div>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ErrorMessage>{error}</ErrorMessage>
            </motion.div>
          )}
          
          <motion.div variants={itemVariants}>
            <SubmitButton
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? '处理中...' : isLogin ? '登录' : '注册'}
            </SubmitButton>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <SwitchMode>
              {isLogin ? '还没有账号？' : '已有账号？'}
              <span onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? '立即注册' : '立即登录'}
              </span>
            </SwitchMode>
          </motion.div>
        </LoginForm>
      </LoginContainer>
    </>
  );
};

export default Login; 