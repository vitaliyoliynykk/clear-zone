import { Box, Container, Spinner } from '@chakra-ui/react';
import { FC, useEffect } from 'react';
import { IoAdd } from 'react-icons/io5';

import { PageHeading } from '@/shared/components/page-heading/page-heading-component';
import {
  loadModulesList,
  selectModules,
  selectModulesStatus,
} from '@/store/slices/devices';
import { useAppDispatch, useAppSelector } from '@/store/store';

import { ConnectModuleDialog } from './connect-module-dialog/connect-module-dialog';
import { DeviceContainer } from './styled-components';

const DevicesPage: FC = () => {
  const dispatch = useAppDispatch();
  const modules = useAppSelector(selectModules);
  const status = useAppSelector(selectModulesStatus);

  useEffect(() => {
    void dispatch(loadModulesList());
  }, [dispatch]);

  if (status === 'loading') {
    return (
      <Container style={{ height: '100%' }}>
        <PageHeading>My Devices</PageHeading>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          style={{ height: '100%' }}
        >
          <Spinner />
        </Box>
      </Container>
    );
  }

  return (
    <Container style={{ height: '100%' }}>
      <PageHeading>My Devices</PageHeading>
      <Box
        display="flex"
        style={{ gap: '12px', flexWrap: 'wrap' }}
        onClick={() => {
          console.log('clicked');
        }}
      >
        {!!modules &&
          modules.map((module) => (
            <DeviceContainer key={module.device_id}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <div>{module.name}</div>
                <div>
                  Status:
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: 'green',
                      display: 'inline-block',
                      borderRadius: '50%',
                    }}
                  ></span>
                </div>
              </Box>
            </DeviceContainer>
          ))}

        <ConnectModuleDialog>
          <DeviceContainer>
            <Box display="flex" flexDirection="column" alignItems="center">
              <IoAdd style={{ height: 50, width: 50, marginBottom: 4 }} />
              <div>Connect Module</div>
            </Box>
          </DeviceContainer>
        </ConnectModuleDialog>
      </Box>
    </Container>
  );
};

export default DevicesPage;
