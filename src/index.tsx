import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import {amber, grey} from '@material-ui/core/colors';
import * as React from 'react';
import { render } from 'react-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const theme = createMuiTheme({
  palette:{
    primary: {
      main: grey[900]
    },
    secondary: {
      main: amber[900]
    },
    type: "light"
  }
});

render(
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
