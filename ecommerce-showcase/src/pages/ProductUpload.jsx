import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import PropTypes from 'prop-types';

const UploadContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const UploadForm = styled.form`
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  margin: 20px;
  padding: 30px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  
  &:hover {
    color: #4ecdc4;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  color: #4ecdc4;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  color: white;
  
  &:focus {
    outline: none;
    border-color: #4ecdc4;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  color: white;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #4ecdc4;
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 15px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ImagePreview = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 10px;
  margin-top: 10px;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  text-align: center;
  padding: 1rem;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 5px;
  margin-bottom: 1rem;
`;

// 定义组件
const ProductUpload = ({ isOpen, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('description', formData.description);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      await api.createProduct(formDataToSend);
      alert('商品上传成功！');
      if (onSuccess) {
        onSuccess(); // 调用成功回调
      } else {
        onClose(); // 如果没有提供成功回调，则只关闭弹窗
      }
    } catch (error) {
      setError(error.message || '上传失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <UploadContainer onClick={(e) => e.target === e.currentTarget && onClose()}>
      <UploadForm onSubmit={handleSubmit}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <FormGroup>
          <Label>商品名称</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </FormGroup>
        
        <FormGroup>
          <Label>价格</Label>
          <Input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </FormGroup>
        
        <FormGroup>
          <Label>商品描述</Label>
          <TextArea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </FormGroup>
        
        <FormGroup>
          <Label>商品图片</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            disabled={loading}
          />
          {imagePreview && (
            <ImagePreview src={imagePreview} alt="预览" />
          )}
        </FormGroup>
        
        <SubmitButton
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
        >
          {loading ? '上传中...' : '上传商品'}
        </SubmitButton>
      </UploadForm>
    </UploadContainer>
  );
};

ProductUpload.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
};

export default ProductUpload;