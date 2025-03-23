import './home.scss';

import React from 'react';
import { Container } from 'reactstrap';
import { useAppSelector } from 'app/config/store';

export const Home = () => {
  const account = useAppSelector(state => state.authentication.account);

  return <Container></Container>;
};

export default Home;
