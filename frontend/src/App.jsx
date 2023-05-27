import logo from './logo.svg';
import React, {useState, useEffect} from 'react';
import {Link, Route, Switch} from 'react-router-dom'
import Main from './Main/Main'
import HospitalLocation from './HospitalLocation/HospitalLocation'
import Header from './Header';
import Emergency from './Emergency/Emergency';
// import RestAPI from './RestAPI.js';
import './App.scss';

function App() {
  return (
    <div className="App">
      {/* <RestAPI/> */}
      <Header/>
      <Route exact path="/">
        <Main/>
      </Route>
      <Route exact path="/hospital">
        <HospitalLocation/>
      </Route>
      <Route exact path="/emergency">
        <Emergency/>
      </Route>
    </div>
  );
}

export default App;