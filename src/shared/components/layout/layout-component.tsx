import { HStack, Menu, Portal } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';
import { Outlet } from 'react-router';

import userLogo from '@/assets/images/user.svg';
import { Logo } from '@/shared/components/logo/Logo';
import { ACCESS_TOKEN_KEY } from '@/shared/constants/tokens';
import { useAuth } from '@/shared/context/auth-context';
import { getUser, logOut } from '@/store/slices/user-slice';
import { useAppDispatch, useAppSelector } from '@/store/store';

import {
  Content,
  LayoutContainer,
  Navigation,
  StyledNavLink,
} from './styled-components';

const _navigation = [
  { link: '/', name: 'Devices' },
  { link: '/dashboard', name: 'Dashboard' },
  { link: '/settings', name: 'Settings', isProtected: true },
];

const Layout = () => {
  const dispatch = useAppDispatch();
  const { user: authUser, setUser } = useAuth();
  const { user, status } = useAppSelector(({ user }) => user);

  useEffect(() => {
    if (authUser && !user && status !== 'loading') {
      void dispatch(getUser());
    }
  }, [authUser, dispatch, user, status]);

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
          <h1 style={{ color: 'black', fontWeight: 'bold', fontSize: 28 }}>
            Clear Zone
          </h1>
        </HStack>

        <HStack>{getNavigationMenu()}</HStack>

        {!!user && (
          <HStack>
            <div>{user.name ?? user.email}</div>
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
        )}
      </Navigation>

      <Content>
        <Outlet />
      </Content>
    </LayoutContainer>
  );
};

export default Layout;
