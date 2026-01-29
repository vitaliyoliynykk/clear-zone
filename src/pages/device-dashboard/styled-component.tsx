/** @jsxImportSource @emotion/react */
import { Box } from '@chakra-ui/react';
import styled from '@emotion/styled';

import { theme } from '@/utils/theme';

export const DashboardCard = styled(Box)`
  background-color: ${theme.colors.gray};
  border-radius: ${theme.radius.medium};
  border: 1px solid ${theme.colors.gray};
  padding: ${theme.spacing.sm};
  min-width: 350px;

  box-shadow: ${theme.boxShadow.elevation};
`;

export const CardContainer = styled.div`
  background-color: ${theme.colors.white};
  border-radius: ${theme.radius.medium};
  box-shadow: ${theme.boxShadow.elevation};
  margin-top: ${theme.spacing.sm};
`;
