/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';

import { theme } from '@/utils/theme';

export const NetworkContainer = styled.button`
  width: 100%;
  padding: ${theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${theme.colors.gray};
  border-radius: ${theme.radius.medium};
  cursor: pointer;
  transition: background-color 0.2s ease;

  :hover {
    background-color: ${theme.colors.lightBlue};
  }
`;
