import styled from 'styled-components';

export const StyledTetrisWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url('/tetris_background.png');
  background-size: cover;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 100%;
    min-height: 100vh;
  }
`;

export const StyledTetris = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 40px;
  margin: 0 auto;
  max-width: 900px;

  aside {
    width: 100%;
    max-width: 200px;
    display: block;
    padding: 0 20px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;

    aside {
      padding: 20px 0;
    }
  }
`;

