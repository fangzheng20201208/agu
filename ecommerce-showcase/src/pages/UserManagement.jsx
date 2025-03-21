import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import AnimatedBackground from '../components/AnimatedBackground';
import EditUserModal from '../components/EditUserModal';

const Container = styled(AnimatedBackground)`
  padding: 120px 20px 40px;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: white;
  margin-bottom: 30px;
  text-align: center;
  font-size: 2.5rem;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const UserTable = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1.5fr 1.5fr 1.5fr;
  padding: 20px 30px;
  background: rgba(0, 0, 0, 0.4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  span {
    color: #4ecdc4;
    font-weight: 600;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

const UserRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1.5fr 1.5fr 1.5fr;
  padding: 20px 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  align-items: center;
  background: rgba(255, 255, 255, 0.02);
  transition: all 0.3s ease;
  
  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateX(5px);
  }
`;

const UserInfo = styled.span`
  color: white;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;

  ${props => props.role && `
    span {
      padding: 4px 12px;
      border-radius: 15px;
      font-size: 0.9rem;
      font-weight: 500;
      background: ${props.role === 'admin' ? 
        'linear-gradient(45deg, #ff6b6b, #ee5253)' : 
        'linear-gradient(45deg, #4ecdc4, #2cb5e8)'};
      color: white;
      display: inline-block;
    }
  `}

  ${props => props.date && `
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
  `}
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-start;
`;

const ActionButton = styled(motion.button)`
  padding: 8px 20px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  ${props => props.edit ? `
    background: linear-gradient(45deg, #4ecdc4, #2cb5e8);
    color: white;
    &:hover {
      box-shadow: 0 0 15px rgba(78, 205, 196, 0.5);
      transform: translateY(-2px);
    }
  ` : `
    background: linear-gradient(45deg, #ff6b6b, #ee5253);
    color: white;
    &:hover {
      box-shadow: 0 0 15px rgba(255, 107, 107, 0.5);
      transform: translateY(-2px);
    }
  `}

  &:active {
    transform: translateY(0);
  }
`;

const Modal = styled(motion.div)`
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

const ModalContent = styled(motion.div)`
  background: rgba(42, 42, 42, 0.95);
  padding: 40px;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ModalTitle = styled.h2`
  color: #4ecdc4;
  margin-bottom: 25px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #4ecdc4;
    box-shadow: 0 0 10px rgba(78, 205, 196, 0.3);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #4ecdc4;
  }

  option {
    background: #2a2a2a;
    color: white;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
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

const RoleTag = styled.span`
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 500;
  background: ${props => props.role === 'admin' ? 
    'rgba(78, 205, 196, 0.2)' : 
    'rgba(255, 107, 107, 0.2)'
  };
  color: ${props => props.role === 'admin' ? 
    '#4ecdc4' : 
    '#ff6b6b'
  };
  border: 1px solid ${props => props.role === 'admin' ? 
    'rgba(78, 205, 196, 0.3)' : 
    'rgba(255, 107, 107, 0.3)'
  };
`;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching users...'); // 调试日志
      const response = await api.getUsers();
      console.log('Users response:', response); // 调试日志
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error); // 调试日志
      setError(error.response?.data?.message || '获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('确定要删除此用户吗？')) {
      return;
    }

    try {
      await api.deleteUser(userId);
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.response?.data?.message || '删除用户失败');
    }
  };

  const handleUpdateUser = async (userId, updatedData) => {
    try {
      const response = await api.updateUser(userId, updatedData);
      setUsers(users.map(user => 
        user._id === userId ? response.data : user
      ));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
      alert(error.response?.data?.message || '更新用户失败');
    }
  };

  if (loading) {
    return <LoadingSpinner>加载中...</LoadingSpinner>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Container>
      <ContentWrapper>
        <Title>用户管理</Title>
        <UserTable>
          <TableHeader>
            <span>用户名</span>
            <span>角色</span>
            <span>创建时间</span>
            <span>最后登录</span>
            <span>操作</span>
          </TableHeader>

          {users.map(user => (
            <UserRow
              key={user._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <UserInfo>{user.username}</UserInfo>
              <UserInfo>
                <RoleTag role={user.role}>
                  {user.role === 'admin' ? '管理员' : '普通用户'}
                </RoleTag>
              </UserInfo>
              <UserInfo date>
                {new Date(user.createdAt).toLocaleString('zh-CN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </UserInfo>
              <UserInfo date>
                {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('zh-CN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                }) : '从未登录'}
              </UserInfo>
              <ActionButtons>
                <ActionButton
                  edit
                  onClick={() => handleEdit(user)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="fas fa-edit"></i>
                  编辑
                </ActionButton>
                <ActionButton
                  onClick={() => handleDelete(user._id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="fas fa-trash-alt"></i>
                  删除
                </ActionButton>
              </ActionButtons>
            </UserRow>
          ))}
        </UserTable>

        {isModalOpen && (
          <EditUserModal
            user={editingUser}
            onClose={() => {
              setIsModalOpen(false);
              setEditingUser(null);
            }}
            onUpdate={handleUpdateUser}
          />
        )}
      </ContentWrapper>
    </Container>
  );
};

export default UserManagement; 