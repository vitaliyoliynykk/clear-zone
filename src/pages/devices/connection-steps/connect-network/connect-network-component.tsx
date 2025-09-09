import { Alert, Button, Input } from '@chakra-ui/react';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { PiShareNetwork } from 'react-icons/pi';
import { useSelector } from 'react-redux';

import { ModalStepBody } from '@/pages/devices/connection-steps/styled-components';
import NetworkItem from '@/shared/components/network-item/network-item-component';
import { selectCurrentNetwork } from '@/store/slices/connect-module.slice';

/* eslint-disable */
const ConnectNetworkComponent: FC = () => {
  const selectedNetwork = useSelector(selectCurrentNetwork);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<{
    password: string;
  }>({
    defaultValues: { password: '' },
  });

  if (!selectedNetwork) {
    return (
      <ModalStepBody style={{ height: 300 }}>
        Please, select network
      </ModalStepBody>
    );
  }

  const onSubmit = handleSubmit(({ password }) => {
    console.log(password);
    return new Promise((res) => {
      setTimeout(() => {
        res(password);
        reset();
      }, 300);
    });
  });

  return (
    <ModalStepBody justifyContent="center">
      <NetworkItem network={selectedNetwork as any} />
      <Input
        type="password"
        placeholder="Password"
        size="lg"
        {...register('password', {
          required: 'Password is required',
        })}
      />
      <Button
        variant="subtle"
        size="lg"
        style={{ width: '100%' }}
        loading={isSubmitting}
        disabled={isSubmitting || !isValid}
        onClick={() => {
          void onSubmit();
        }}
      >
        <PiShareNetwork />
        Connect
      </Button>

      {errors.root && (
        <Alert.Root status="error" marginTop={2}>
          <Alert.Indicator />
          <Alert.Title>{errors.root.message}</Alert.Title>
        </Alert.Root>
      )}
    </ModalStepBody>
  );
};

export default ConnectNetworkComponent;
