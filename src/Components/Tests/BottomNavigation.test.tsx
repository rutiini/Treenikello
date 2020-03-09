import React from 'react';
import ReactDOM from 'react-dom';
import { BottomNavigation } from '@material-ui/core';

it('BottomNavigation renders without crashing', () => {
    const div = document.createElement('div');
  ReactDOM.render(
      <BottomNavigation />, div);
    ReactDOM.unmountComponentAtNode(div);
  });