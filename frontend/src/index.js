import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// bootstrap 스타일 가져오기.
import 'bootstrap/dist/css/bootstrap.css';

import { BrowserRouter } from 'react-router-dom';

import {Provider} from 'react-redux'
import { createStore } from 'redux';

let defaultState = [
  {myLocationX: 0, myLocationY: 0, hospitalName: ''},
  {hospital: [], setAddress: '', x: [], y: [], hospitalCount: 0},
  // 상태가 0이면 내 위치 근처 지도 찾아주는 기능 넣기 1이면 응급실 찾아주는 기능 넣기
  {mapState: 0},
  // [3]은 응급실 정보 모아놓음.
  {emeCount: 0, hospitalName: [], hospitalTel: [], hospitalAddress: []},
  {emeTel: [], monday: [], thusday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: [], holiday: [], treatment: [], admission: [], emeleftover: [], surgeryleftover: [], hospitalroomleftover: []},
  {emeX: [], emeY: []}
]

function reducer(state = defaultState, action){
  let copy = [...state];
  if(action.type === '좌표변경'){
    // copy[0].hospitalName = action.payload.hospitalNames
    copy[0].clickLocationsX = action.payload.x;
    copy[0].clickLocationsY = action.payload.y;
    return copy;
  }else if(action.type === '내위치'){
    copy[0].clickLocationsX = action.payload.x;
    copy[0].clickLocationsY = action.payload.y;
  }else if(action.type === '병원정보'){
    copy[1].hospital.push(action.payload.hospital);
    copy[1].setAddress = action.payload.address;
    copy[1].x.push(action.payload.x);
    copy[1].y.push(action.payload.y);
    copy[1].hospitalCount = action.payload.count;
  }else if(action.type === '지도기능'){
    copy[2].mapState = action.payload.mapState
  }else if(action.type === '응급실정보'){
    copy[3].emeCount = action.payload.emeCount;
    copy[3].hospitalName.push(action.payload.hospitalName);
    copy[3].hospitalTel.push(action.payload.hospitalTel);
    copy[3].hospitalAddress.push(action.payload.hospitalAddress);
  }else if(action.type === '응급실상세정보'){
    copy[4].emeTel.push(action.payload.emeTel);
    copy[4].monday.push(action.payload.monday);
    copy[4].thusday.push(action.payload.thusday);
    copy[4].wednesday.push(action.payload.wednesday);
    copy[4].thursday.push(action.payload.thursday);
    copy[4].friday.push(action.payload.friday);
    copy[4].saturday.push(action.payload.saturday);
    copy[4].sunday.push(action.payload.sunday);
    copy[4].holiday.push(action.payload.holiday);
    copy[4].treatment.push(action.payload.treatment);
    copy[4].admission.push(action.payload.admission);
    copy[4].emeleftover.push(action.payload.emeleftover);
    copy[4].surgeryleftover.push(action.payload.surgeryleftover);
    copy[4].hospitalroomleftover.push(action.payload.hospitalroomleftover);
  }else if(action.type === '응급실위치'){
    copy[5].emeX.push(action.payload.emeX);
    copy[5].emeY.push(action.payload.emeY);
  }else{ 
    return state;
  }
}

// combineReducers를 사용해서 reducer 여러 개 등록.
let store = createStore(reducer);

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
