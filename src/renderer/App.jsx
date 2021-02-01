import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
//import icon from '../assets/icon.svg';

import { createMuiTheme, ThemeProvider  } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import ImageViewer from "./components/ImageViewer"

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});


export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route path="/" component={ImageViewer} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}