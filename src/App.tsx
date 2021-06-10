import Detail from './Detail';
import List from './List';
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/movies/:id">
            <Detail />
          </Route>
          <Route path="/">
            <List />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
