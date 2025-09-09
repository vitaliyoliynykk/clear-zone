/** @jsxImportSource @emotion/react */
import { VStack } from '@chakra-ui/react';
import styled from '@emotion/styled';

import { theme } from '@/utils/theme';

export const ModalStepBody = styled(VStack)`
  height: 300px;
  overflow: auto;
  padding: ${theme.spacing.sm};
`;
