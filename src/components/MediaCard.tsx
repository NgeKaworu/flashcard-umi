import { Card } from 'antd';
import styled from 'styled-components';

export default styled(Card)`
  height: 61.8vh;
  width: 30.9vw;

  @media (max-width: 768px) {
    width: 100%;
    margin: 0 12px;
  }
`;
