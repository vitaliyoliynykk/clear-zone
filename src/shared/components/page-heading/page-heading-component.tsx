/** @jsxImportSource @emotion/react */
import { Heading } from '@chakra-ui/react';
import styled from '@emotion/styled';

import { theme } from '@/utils/theme';

export const PageHeading = styled(Heading)`
  margin: ${theme.spacing.md} 0;
  font-size: ${theme.fontSize.lg};
`;
