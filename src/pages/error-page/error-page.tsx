import { Button, Flex } from '@chakra-ui/react';
import { FC } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { Logo } from '@/shared/components/logo/Logo';
import { theme } from '@/utils/theme';

export const ErrorPage: FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const getErrorReason = (): string => {
    switch (searchParams.get('reason')) {
      case 'ERR_NETWORK':
        return 'Server is offline, or network connection is lost.';
      default:
        return 'Unexpected error happened.';
    }
  };

  return (
    <Flex
      justify="center"
      align="center"
      direction="column"
      style={{
        height: '100%',
        width: '100%',
        padding: theme.spacing.md,
      }}
    >
      <Flex style={{ marginBottom: theme.spacing.sm }}>
        <Logo />
        {getErrorReason()} Click to reload an app and try again
      </Flex>

      <Button
        width="100%"
        colorPalette="transparent"
        size="lg"
        onClick={() => {
          void navigate('dashboard');
        }}
      >
        Retry
      </Button>
    </Flex>
  );
};
