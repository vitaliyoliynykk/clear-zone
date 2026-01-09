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
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { PageHeading } from '@/shared/components/page-heading/page-heading-component';
import { selectUser, updateUser } from '@/store/slices/user-slice';
import { useAppDispatch } from '@/store/store';
import { theme } from '@/utils/theme';

function SettingsPage() {
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);

  console.log(user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<{
    name?: string;
  }>({
    defaultValues: { name: '' },
  });

  const onSubmit = handleSubmit(({ name }) => {
    return dispatch(updateUser({ name }))
      .unwrap()
      .then(() => {
        reset();
      });
  });

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
            {...register('name')}
          />
        </Field.Root>

        <Button
          type="submit"
          colorPalette={'teal'}
          loading={isSubmitting}
          disabled={isSubmitting}
          onClick={() => {
            void onSubmit();
          }}
        >
          Update
        </Button>
      </VStack>
      <p style={{ textAlign: 'right', marginTop: 12 }}>
        Clear Zone v.{import.meta.env.VITE_APP_VERSION}
      </p>
    </Container>
  );
}

export default SettingsPage;
