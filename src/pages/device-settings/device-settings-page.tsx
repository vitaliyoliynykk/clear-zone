import { Button, Container, Spinner, Stack } from '@chakra-ui/react';
import { GoArrowLeft } from 'react-icons/go';
import { useNavigate, useParams } from 'react-router';

import { PageHeading } from '@/shared/components/page-heading/page-heading-component';
import { moduleSelectors, selectModulesStatus } from '@/store/slices/devices';
import { useAppSelector } from '@/store/store';
import { formatDate } from '@/utils/time';

const DeviceSettingsPage = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  // const dispatch = useAppDispatch();
  const status = useAppSelector(selectModulesStatus);
  const module = useAppSelector((state) =>
    deviceId ? moduleSelectors.selectById(state, deviceId) : undefined
  );
  // const [error, setError] = useState<string | null>(null);

  // const removeModule = async () => {
  //   if (!module) return;

  //   setError(null);
  //   const result = await dispatch(deleteModule({ moduleId: module.device_id }));
  //   if (deleteModule.fulfilled.match(result)) {
  //     void navigate('/');
  //   } else {
  //     setError('Could not remove the device. Please try again.');
  //   }
  // };

  return (
    <Container>
      <PageHeading display="flex" justifyContent="flex-end">
        Device Settings{module ? ` - ${module.name}` : ''}
      </PageHeading>
      <Button
        variant="outline"
        size="sm"
        colorPalette="gray"
        mb={4}
        onClick={() => {
          void navigate(
            deviceId ? `/dashboard/${encodeURIComponent(deviceId)}` : '/'
          );
        }}
      >
        <GoArrowLeft />
        Back
      </Button>
      {module ? (
        <Stack gap={4}>
          <p>Status: Online</p>
          <p>Registration date: {formatDate(module.registration_date)}</p>
          <p>Module ID: {module.device_id}</p>
          {/* <Flex>
            <Button
              variant="outline"
              size="sm"
              colorPalette="red"
              disabled={status === 'loading'}
              onClick={() => {
                void removeModule();
              }}
            >
              Remove from account
            </Button>
          </Flex> */}
          {/* {error && <p role="alert">{error}</p>} */}
        </Stack>
      ) : status === 'loading' || status === 'empty' ? (
        <Spinner />
      ) : (
        <p>Module not found. Please try again...</p>
      )}
    </Container>
  );
};

export default DeviceSettingsPage;
