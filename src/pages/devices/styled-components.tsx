/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';

import { theme } from '@/utils/theme';

export const DeviceContainer = styled.div`
  width: 265px;
  height: 265px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.gray};
  border-radius: ${theme.radius.medium};
  cursor: pointer;
  transition: background-color 0.2s ease;
  padding: 15px;
  border: 1px solid ${theme.colors.grayLight};

  @media (max-width: 768px) {
    width: 100%;
  }

  :hover {
    background-color: ${theme.colors.lightBlue};
  }
`;
