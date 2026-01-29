/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { NavLink } from 'react-router';

export const LayoutContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  color: black;

  @media (max-width: 768px) {
    width: 100%;
    position: fixed;
    flex-direction: column-reverse;
  }
`;

export const Navigation = styled.nav(({ theme }) => ({
  backgroundColor: '#d8e0ebff',
  height: 75,
  borderBottom: '1px solid rgba(218, 218, 218, 1)',
  padding: `0px ${theme.spacing.lg}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  ' @media (max-width: 768px)': {
    paddingBottom: theme.spacing.md,
  },
}));

export const StyledNavLink = styled(NavLink)(({ theme }) => ({
  padding: theme.spacing.xxs,
  height: 50,
  alignItems: 'center',
  display: 'flex',
  boxSizing: 'border-box',
  borderBottom: '2px solid transparent',
  '&.active': {
    borderBottom: '2px solid black',
  },
  '&:hover': {
    borderBottom: '2px solid black',
  },
}));

export const Content = styled.main`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

export const NavigationMenu = styled.ul`
  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

export const AppTitle = styled.h1`
  color: black;
  font-wight: bold;
  font-size: 28;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const UserTitle = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;
