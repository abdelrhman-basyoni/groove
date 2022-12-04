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
import {getPageID} from './api'
 function App() {
   getPageID('https://www.facebook.com/Dr-Mahmoud-Magdy-%D8%A5%D8%B5%D8%A7%D8%A8%D8%A7%D8%AA-%D9%85%D9%84%D8%A7%D8%B9%D8%A8-%D8%AA%D8%A3%D9%87%D9%8A%D9%84-%D8%AD%D8%B1%D9%83%D9%8A-%D8%AA%D8%BA%D8%B0%D9%8A%D9%87-%D8%B9%D9%84%D8%A7%D8%AC%D9%8A%D9%87-593089974163819')

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
                  <Route path="" element={<Home />} />
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
