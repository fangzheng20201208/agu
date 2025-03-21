import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  width: 100%;
  max-width: 320px;
  background: rgba(42, 42, 42, 0.95);
  padding: 30px 25px;
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h2`
  color: white;
  text-align: center;
  margin-bottom: 30px;
  font-size: 1.8rem;
  background: linear-gradient(45deg, #4ecdc4, #2cb5e8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  width: 100%;
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
  height: 40px;
  padding: 0 15px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  color: white;
  font-size: 0.9rem;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  color: white;
  font-size: 0.9rem;
  min-height: 100px;
  resize: vertical;
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

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  width: 100%;
  height: 40px;
  padding: 0 15px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-sizing: border-box;
  
  &:hover {
    border-color: #4ecdc4;
    background: rgba(78, 205, 196, 0.1);
  }

  i {
    font-size: 1rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Button = styled(motion.button)`
  flex: 1;
  height: 40px;
  padding: 0 15px;
  border: none;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.primary ? 
    'linear-gradient(45deg, #4ecdc4, #2cb5e8)' : 
    'transparent'
  };
  color: ${props => props.primary ? 'white' : '#ff6b6b'};
  border: ${props => props.primary ? 'none' : '1px solid #ff6b6b'};
  
  &:hover {
    box-shadow: ${props => props.primary ? 
      '0 0 15px rgba(78, 205, 196, 0.3)' : 
      'none'
    };
    background: ${props => props.primary ? 
      'linear-gradient(45deg, #4ecdc4, #2cb5e8)' : 
      '#ff6b6b'
    };
    color: white;
  }
`;

const ErrorMessage = styled(motion.div)`
  color: #ff6b6b;
  text-align: center;
  margin-top: 10px;
  font-size: 0.9rem;
`;

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: null
  });
  const [selectedFileName, setSelectedFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files.length > 0) {
      console.log('Selected file:', files[0]); // 调试日志
      setFormData(prev => ({ ...prev, [name]: files[0] }));
      setSelectedFileName(files[0].name);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.image) {
        setError('请选择商品图片');
        setLoading(false);
        return;
      }

      // 创建一个新的 FormData 实例
      const formDataToSend = new FormData();
      
      // 添加基本信息
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('price', formData.price);
      formDataToSend.append('description', formData.description.trim());
      
      // 添加图片文件
      formDataToSend.append('image', formData.image);

      // 打印调试信息
      console.log('Submitting form with data:');
      console.log('Name:', formData.name);
      console.log('Price:', formData.price);
      console.log('Description:', formData.description);
      console.log('Image:', formData.image.name);

      // 发送请求
      const response = await api.createProduct(formDataToSend);
      
      if (response.data) {
        console.log('Product created successfully:', response.data);
        onProductAdded();
        onClose();
      } else {
        throw new Error('创建商品失败，请重试');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      console.error('Error response:', error.response?.data);
      
      // 处理不同类型的错误
      if (error.response?.data?.errors?.imageUrl) {
        setError('图片处理失败，请重试');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message.includes('Network Error')) {
        setError('网络错误，请检查网络连接');
      } else {
        setError('创建商品失败，请重试');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <ModalContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <Title>添加商品</Title>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>商品名称</Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="请输入商品名称"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>商品价格</Label>
                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="请输入商品价格"
                  required
                  min="0"
                  step="0.01"
                />
              </FormGroup>

              <FormGroup>
                <Label>商品描述</Label>
                <TextArea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="请输入商品描述"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>商品图片</Label>
                <FileInput
                  type="file"
                  name="image"
                  id="image"
                  onChange={handleChange}
                  accept="image/*"
                  required
                />
                <FileInputLabel htmlFor="image">
                  <i className="fas fa-upload"></i>
                  {selectedFileName || '选择图片'}
                </FileInputLabel>
              </FormGroup>

              {error && (
                <ErrorMessage
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </ErrorMessage>
              )}

              <ButtonGroup>
                <Button
                  type="button"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  primary
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? '添加中...' : '添加商品'}
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default AddProductModal; 