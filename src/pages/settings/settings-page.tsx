import {
  Avatar,
  Badge,
  Button,
  Container,
  Field,
  Flex,
  HStack,
  Input,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { toaster } from '@/components/ui/toaster';
import { PageHeading } from '@/shared/components/page-heading/page-heading-component';
import { registerPushSubscriptionRequest } from '@/shared/requests/push/register-push-subscription';
import { testPushRequest } from '@/shared/requests/push/test-push';
import { arrayBufferToBase64Url } from '@/shared/utils/utils';
import {
  loadPushNotificationSettings,
  selectPushNotificationsSettings,
} from '@/store/slices/settings-slice';
import { selectUser, updateUser } from '@/store/slices/user-slice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { theme } from '@/utils/theme';
import { formatDate } from '@/utils/time';

function SettingsPage() {
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);
  const pushNotificationSettings = useAppSelector(
    selectPushNotificationsSettings
  );
  const pushSubscriptionRef = useRef<PushSubscription | null>(null);

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

  useEffect(() => {
    void initPushSubscription().then(() => {
      if (pushSubscriptionRef.current) {
        void dispatch(
          loadPushNotificationSettings(pushSubscriptionRef.current.endpoint)
        );
      }
    });
  }, [dispatch]);

  const initPushSubscription = async () => {
    if (!('serviceWorker' in navigator)) return;

    if (!navigator.serviceWorker.controller) {
      console.warn('Service worker not controlling page yet. Reload required.');
      return;
    }

    const sw = await navigator.serviceWorker.ready;
    let sub = await sw.pushManager.getSubscription();

    sub ??= await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY as string,
    });

    pushSubscriptionRef.current = sub;
  };

  const onSubmit = handleSubmit(({ name }) => {
    return dispatch(updateUser({ name }))
      .unwrap()
      .then(() => {
        reset();
      });
  });

  const requestNotificationPermission = async (): Promise<boolean> => {
    const result = await Notification.requestPermission();

    if (result === 'granted') {
      toaster.create({
        description: `Notifications permissions are granted`,
        type: 'success',
        duration: 3000,
      });

      return true;
    }

    return false;
  };

  const enablePushNotifications = async () => {
    const subscription = pushSubscriptionRef.current;

    if (subscription) {
      const auth = subscription.getKey('auth');
      const p256dh = subscription.getKey('p256dh');

      if (auth && p256dh) {
        await registerPushSubscriptionRequest({
          endpoint: subscription.endpoint,
          keys: {
            auth: arrayBufferToBase64Url(auth),
            p256dh: arrayBufferToBase64Url(p256dh),
          },
        });

        void dispatch(loadPushNotificationSettings(subscription.endpoint));
      }
    }
  };

  const testPushMessage = () => {
    if (pushSubscriptionRef.current) {
      void testPushRequest(pushSubscriptionRef.current.endpoint);
    }
  };

  const getNotificationsStatus = () => {
    if (!pushNotificationSettings?.enableAlerts) {
      return (
        <p>
          Notifications: <Badge colorPalette="red">Disabled</Badge>
        </p>
      );
    }

    return (
      <>
        <p>
          Notifications: <Badge colorPalette="green">Enabled</Badge>
        </p>
        <p>
          Last used:{' '}
          {formatDate(pushNotificationSettings.lastUsedAt, 'datetime')}
        </p>
      </>
    );
  };

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

      <PageHeading>Push Notifications</PageHeading>
      <VStack
        padding={theme.spacing.sm}
        bg={theme.colors.lightBlue}
        borderRadius="lg"
        boxShadow="md"
        alignItems="start"
        gap={theme.spacing.sm}
      >
        {getNotificationsStatus()}

        <Flex gap={theme.spacing.md} wrap="wrap">
          <Button
            colorPalette={'teal'}
            onClick={() => {
              void requestNotificationPermission();
            }}
          >
            Request notifications permissions
          </Button>

          <Button
            colorPalette={'teal'}
            onClick={() => {
              void enablePushNotifications();
            }}
          >
            Enable push notifications
          </Button>

          {pushNotificationSettings?.enableAlerts && (
            <Button
              colorPalette={'teal'}
              onClick={() => {
                testPushMessage();
              }}
            >
              Test push
            </Button>
          )}
        </Flex>
      </VStack>

      <p style={{ textAlign: 'right', marginTop: 12 }}>
        Clear Zone v.{import.meta.env.VITE_APP_VERSION}
      </p>
    </Container>
  );
}

export default SettingsPage;
