import styled, { keyframes } from 'styled-components';

const gradient = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const AnimatedBackground = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    -45deg,
    #1a1a1a,
    #2a2a2a,
    #1f2937,
    #111827
  );
  background-size: 400% 400%;
  animation: ${gradient} 15s ease infinite;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.5) 100%);
    pointer-events: none;
  }
`;

export default AnimatedBackground; 