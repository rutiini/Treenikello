import { createMuiTheme, CssBaseline, MuiThemeProvider } from '@material-ui/core';
import {amber, grey} from '@material-ui/core/colors';
import * as React from 'react';
import { render } from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const theme = createMuiTheme({
  overrides:{
    // maybe we can include a set of the clock segment colors here?    
  },
  palette:{
    primary: {
      main: grey[900],
    },
    secondary: {
      main: amber[900]
    },
    type: "dark",
  },
});

render(
  <MuiThemeProvider theme={theme}>
  <CssBaseline/>
    <App />
  </MuiThemeProvider>,
  document.getElementById('root') as HTMLElement
);

registerServiceWorker();
