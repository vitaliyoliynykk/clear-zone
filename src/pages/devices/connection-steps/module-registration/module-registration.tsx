import { Spinner } from '@chakra-ui/react';
import { FC } from 'react';

import { ModalStepBody } from '../styled-components';

const ModuleRegistrationComponent: FC = () => {
  return (
    <ModalStepBody justifyContent="center">
      <Spinner />
      Registration is in progress
    </ModalStepBody>
  );
};

export default ModuleRegistrationComponent;
