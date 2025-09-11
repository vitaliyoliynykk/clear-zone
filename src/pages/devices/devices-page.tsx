import { Box, Container } from '@chakra-ui/react';
import { FC } from 'react';
import { IoAdd } from 'react-icons/io5';

import { PageHeading } from '@/shared/components/page-heading/page-heading-component';

import { ConnectModuleDialog } from './connect-module-dialog/connect-module-dialog';
import { DeviceContainer } from './styled-components';

const DevicesPage: FC = () => {
  return (
    <Container style={{ height: '100%' }}>
      <PageHeading>My Devices</PageHeading>
      <Box
        display="flex"
        onClick={() => {
          console.log('clicked');
        }}
      >
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
