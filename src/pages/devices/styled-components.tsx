/** @jsxImportSource @emotion/react */
import { Heading } from '@chakra-ui/react';
import styled from '@emotion/styled';

import { theme } from '@/utils/theme';

export const DeviceContainer = styled.div`
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.gray};
  border-radius: ${theme.radius.medium};
  cursor: pointer;
  transition: background-color 0.2s ease;

  :hover {
    background-color: ${theme.colors.lightBlue};
  }
`;

export const PageHeading = styled(Heading)`
  margin: ${theme.spacing.md} 0;
  font-size: ${theme.fontSize.lg};
`;
