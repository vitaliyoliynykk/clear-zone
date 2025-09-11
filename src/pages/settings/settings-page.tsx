import {
  Avatar,
  Button,
  Container,
  Field,
  HStack,
  Input,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';

import { PageHeading } from '@/shared/components/page-heading/page-heading-component';
import { selectUser } from '@/store/slices/user-slice';
import { theme } from '@/utils/theme';

function SettingsPage() {
  const user = useSelector(selectUser);

  console.log(user);

  return (
    <Container style={{ height: '100%' }}>
      <PageHeading>User Settings</PageHeading>
      <VStack
        padding={theme.spacing.sm}
        bg={theme.colors.lightBlue}
        borderRadius="lg"
        boxShadow="md"
        alignItems="start"
        gap={theme.spacing.sm}
      >
        <HStack gap="4" marginBottom={theme.spacing.md}>
          <Avatar.Root>
            <Avatar.Fallback name={user?.name} />
            <Avatar.Image src={user?.profilePictureUrl} />
          </Avatar.Root>
          <Stack gap="0">
            <Text fontWeight="medium">{user?.name ?? '-'}</Text>
            <Text color="fg.muted" textStyle="sm">
              {user?.email}
            </Text>
          </Stack>
        </HStack>

        <Field.Root required>
          <Field.Label>
            User name <Field.RequiredIndicator />
          </Field.Label>
          <Input
            type="text"
            variant="subtle"
            placeholder="Enter your username"
            size="lg"
            width="50%"
          />
        </Field.Root>

        <Button type="submit" colorPalette={'teal'}>
          Update
        </Button>
      </VStack>
    </Container>
  );
}

export default SettingsPage;
