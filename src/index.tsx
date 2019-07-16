import { CssBaseline, createMuiTheme } from '@material-ui/core';
import {amber, grey} from '@material-ui/core/colors';
import * as React from 'react';
import { render } from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { MuiThemeProvider } from 'material-ui/styles';

const theme = createMuiTheme({
  overrides:{
    // maybe we can include a set of the clock segment colors here?    
  },
  palette:{
    action:{
      hover: amber[900],
      // selected: amber[900],
    },
    primary: {
      main: amber[900]
    },
    secondary: {
      main: grey[900],
    },
    text:{
      // primary: amber[900],
      // secondary : amber[900],
    },
    type: "dark",
  }
});

render(
  <MuiThemeProvider muiTheme={theme}>
      <CssBaseline/>
      <App />
  </MuiThemeProvider>,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
