/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';

import { theme } from '@/utils/theme';

export const TabContainer = styled.div`
  padding: ${theme.radius.medium};
  border-radius: ${theme.radius.medium};
  border-color: ${theme.colors.grayDark};
  background-color: ${theme.colors.white};
  border-width: 1px;
  margin-bottom: ${theme.spacing.sm};
  cursor: pointer;

  &:hover {
    background-color: ${theme.colors.grayLight};
  }
`;
