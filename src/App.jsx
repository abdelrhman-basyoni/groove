import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'antd/dist/antd.css';
import './App.css'
import Home from "./pages/home/Home";

import Applayout from "./components/app/Layout";

import React, { Fragment } from 'react';

import Adset from './pages/adSets/Adset'

import Ads from "./pages/ads/Ads";
import {ReactNotifications} from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'

 function App() {

  return (
    <div className="app">
        <ReactNotifications  />
      <div className="app-header">
        {/* <Applayout> */}
        
        <Fragment>
      
          <Router>
            <Routes>

              
                <Route path='/*' element={<Applayout />} >
                  <Route path="campgains" element={<Home />} />
                  <Route path="campgains/:campgainId" element={<Adset />} />
                  <Route path="adsets/:adsetsId" element={<Ads />} />
                  {/* <Route path="ads/:adsetsId" element={<Adset />} /> */}
               


               

                </Route>
        


            </Routes>
          </Router>
          {/* </Applayout> */}
        </Fragment>
     
      </div>
    </div>
  )
}

export default App
