import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

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

const Select = styled.select`
  width: 100%;
  height: 40px;
  padding: 0 15px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #4ecdc4;
    box-shadow: 0 0 10px rgba(78, 205, 196, 0.3);
  }

  option {
    background: #2a2a2a;
    color: white;
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

  ${props => props.primary ? `
    background: linear-gradient(45deg, #4ecdc4, #2cb5e8);
    color: white;
    
    &:hover {
      box-shadow: 0 0 15px rgba(78, 205, 196, 0.3);
    }
  ` : `
    background: transparent;
    border: 1px solid #ff6b6b;
    color: #ff6b6b;
    
    &:hover {
      background: #ff6b6b;
      color: white;
    }
  `}
`;

const EditUserModal = ({ user, onClose, onUpdate }) => {
  const [role, setRole] = useState(user.role);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(user._id, { role });
  };

  return (
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
        <Title>编辑用户</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>用户名</Label>
            <div style={{ color: 'white', paddingLeft: '5px' }}>{user.username}</div>
          </FormGroup>

          <FormGroup>
            <Label>角色</Label>
            <Select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">普通用户</option>
              <option value="admin">管理员</option>
            </Select>
          </FormGroup>

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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              保存
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default EditUserModal; 