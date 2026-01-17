import { HStack, Menu, Portal, Spinner } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';
import { Outlet } from 'react-router';

import userLogo from '@/assets/images/user.svg';
import { Logo } from '@/shared/components/logo/Logo';
import { ACCESS_TOKEN_KEY } from '@/shared/constants/tokens';
import { useAuth } from '@/shared/context/auth-context';
import { loadModulesList } from '@/store/slices/devices';
import { getUser, logOut } from '@/store/slices/user-slice';
import { useAppDispatch, useAppSelector } from '@/store/store';

import {
  AppTitle,
  Content,
  LayoutContainer,
  Navigation,
  StyledNavLink,
  UserTitle,
} from './styled-components';

const _navigation = [
  { link: '/', name: 'Devices' },
  { link: '/dashboard', name: 'Dashboard' },
  { link: '/settings', name: 'Settings', isProtected: true },
];

const Layout = () => {
  const dispatch = useAppDispatch();
  const { setUser } = useAuth();
  const { user } = useAppSelector(({ user }) => user);

  useEffect(() => {
    void dispatch(getUser());
    void dispatch(loadModulesList());
  }, [dispatch]);

  const navigation = useMemo(() => {
    if (!user) {
      return _navigation.filter((item) => !item.isProtected);
    }

    return _navigation;
  }, [user]);

  const handleLogOut = () => {
    try {
      if (setUser) {
        setUser(null);
      }
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      void dispatch(logOut());
    } catch {
      console.log('Error loggin out');
    }
  };

  const getNavigationMenu = () => {
    return navigation.map(({ link, name }) => (
      <StyledNavLink to={link} key={link}>
        {name}
      </StyledNavLink>
    ));
  };

  return (
    <LayoutContainer>
      <Navigation>
        <HStack>
          <Logo />
          <AppTitle>Clear Zone</AppTitle>
        </HStack>

        <HStack>{getNavigationMenu()}</HStack>

        {user ? (
          <HStack>
            <UserTitle>{user.name ?? user.email}</UserTitle>
            <Menu.Root>
              <Menu.Trigger asChild>
                <img
                  src={userLogo}
                  alt="user logo"
                  style={{ height: 25, cursor: 'pointer' }}
                />
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item
                      value="new-txt-a"
                      onClick={() => {
                        handleLogOut();
                      }}
                    >
                      Log out
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </HStack>
        ) : (
          <Spinner />
        )}
      </Navigation>

      <Content>
        <Outlet />
      </Content>
    </LayoutContainer>
  );
};

export default Layout;
