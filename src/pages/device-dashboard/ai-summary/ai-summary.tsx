import { Button } from '@chakra-ui/react';
import { FC } from 'react';

import { theme } from '@/utils/theme';

import { Container } from './styled-components';

export const AISummary: FC = () => {
  return (
    <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Button colorPalette="teal" mb={theme.spacing.xs}>
        Explain air quality with AI ✨
      </Button>
      <p style={{ textAlign: 'center' }}>
        Explains how metrics contribute to your air quality using aggregated
        data from the past hour
      </p>
    </Container>
  );
};
