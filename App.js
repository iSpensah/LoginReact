import React from 'react';
import {Switch, Route} from 'react-router-dom';
import GlobalStateProvider, { globalContext} from './Context/GlobalState';
import Home from './Components/Home';
import Register from './Components/Register';
import Login from './Components/Login';
import User from './Components/UserPage';
import NotFound from './Components/404';
import './App.css';

class App extends React.Component {
  render() {
    return (
    <div className="App">
      <GlobalStateProvider>
        <Switch>
          <Route exact path='/ReactLoginProject' ><Home></Home></Route>
          <Route path='/Register' ><Register></Register></Route>
          <Route exact path='/Login' ><Login></Login></Route>
          <Route path='/Login/User' ><User></User></Route>
          <Route path='*'><NotFound></NotFound></Route>
        </Switch>
      </GlobalStateProvider>
    </div>
  );
  }
}
App.contextType = globalContext;


export default App;