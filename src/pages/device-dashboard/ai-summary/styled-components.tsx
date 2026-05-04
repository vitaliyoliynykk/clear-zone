/** @jsxImportSource @emotion/react */
import { Flex } from '@chakra-ui/react';
import styled from '@emotion/styled';

import { theme } from '@/utils/theme';

export const Container = styled(Flex)`
  height: 300px;
  flex-direction: column;
  padding: ${theme.spacing.sm};
  overflow: auto;

  ul {
    list-style: circle;
    padding-left: ${theme.spacing.lg};
  }

  h3 {
    font-weight: bold;
    text-align: center;
  }
`;
