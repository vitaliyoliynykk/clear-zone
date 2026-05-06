import { Button, SkeletonText } from '@chakra-ui/react';
import { FC, useState } from 'react';
import Markdown from 'react-markdown';

import { toaster } from '@/components/ui/toaster';
import { AiSummaryResponseModel } from '@/shared/models/responses/ai-summary-model';
import { getAiSummaryRequest } from '@/shared/requests/ai/getSummary';
import { theme } from '@/utils/theme';

import { Container } from './styled-components';

export const AISummary: FC<{ deviceId: string }> = ({ deviceId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<AiSummaryResponseModel | null>(null);
  const timePeriodHours = 24;

  const getAiSummary = async () => {
    setIsLoading(true);
    try {
      const result = await getAiSummaryRequest(deviceId, timePeriodHours);

      setSummary(result);
    } catch (error) {
      console.error(error);
      toaster.create({
        description: `Couldn't create AI summary. Please try again`,
        type: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
        <SkeletonText noOfLines={8} />
      </Container>
    );
  }

  if (!summary) {
    return (
      <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Button
          colorPalette="teal"
          boxShadow={theme.boxShadow.elevation}
          mb={theme.spacing.xs}
          onClick={() => {
            void getAiSummary();
          }}
        >
          Analyze ✨
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Markdown>{summary.result}</Markdown>
    </Container>
  );
};
