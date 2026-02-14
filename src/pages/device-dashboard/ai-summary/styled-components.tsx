/** @jsxImportSource @emotion/react */
import { Flex } from '@chakra-ui/react';
import styled from '@emotion/styled';

import { theme } from '@/utils/theme';

export const Container = styled(Flex)`
  height: 220px;
  flex-direction: column;
  padding: ${theme.spacing.sm};
`;
