import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
//import icon from '../assets/icon.svg';

const Main = () => {
  return (
    <div>
      <h1> Test </h1>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Main} />
      </Switch>
    </Router>
  );
}