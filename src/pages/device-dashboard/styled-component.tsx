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
  display: flex;
  flex-direction: column;
`;
