/* eslint-disable */
/* global kakao */


import React, {useState, useEffect} from 'react';
import './HospitalInformation.scss'
import axios from 'axios';
import Spinner from '../Spinner';
import {useHistory} from 'react-router-dom';
import {connect, useSelector, useDispatch} from 'react-redux';

function HospitalInformation(props){
    const [data, setData] = useState([]);
    const [initName, setInitName] = useState([]);
    const [initTel, setInitTel] = useState([]);
    let clickLocationX = '';
    let clickLocationY = '';

    // 리스트 상태.
    let [listState, setListState] = useState(0);

    let [spinner, setSpinner] = useState(true);

    let state = useSelector(state => state);
    let dispatch = useDispatch();
    let [hospital, setHospital] = useState([]);
    let stop = '';

    const history = useHistory();

    useEffect(async () => {
        
        let interval = setInterval(() => {
            // useState에 배열 넣는 방법.
            setHospital(state[1].hospital);
            // stop에 1초에 한 번씩 바뀐 address 값을 보내줌. stop의 초기 값은 ''
            stop = state[1].setAddress;
            // 만약 stop의 값이 ''랑 다르면 setInterval 멈추고, spinner false로 바꿔주기.
            if(stop !== ''){
                clearInterval(interval);
                setSpinner(false);
            }
            let hospitalInformationBox = document.querySelectorAll('.hospitalInformationBox');
            for(let i = 0; i < hospitalInformationBox.length; i++){
                hospitalInformationBox[i].addEventListener('click', function(){
                    // 클릭 할 때마다 count 증가되는거..? 고치기.
                    localStorage.setItem('count', i);
                    // props.propsCount(1);
                });
            }

        }, 1000);

        let unlisten = history.listen((location) => {
            if (history.action === 'POP') {
                window.location.reload();
            }
          });
      
          return () => {
            unlisten();
          };

    }, [history])

    // 클릭한 병원
    function clickHospital(){
        let hospitalInformationBox = document.querySelectorAll('.hospitalInformationBox');
        for(let i = 0; i < hospitalInformationBox.length; i++){
            hospitalInformationBox[i].addEventListener('click', function(){
                // 클릭 할 때마다 count 증가되는거..? 고치기.
                localStorage.setItem('count', i);
                // props.propsCount(1);
            });
        }
    }
    return(
        <div className="container">
            <ul>
                {
                    hospital.map(i => {
                        return(
                            <div className="list">
                                <div class="hospitalInformationBox">
                                    <p className = "name">{i.place_name}</p>
                                    <p className = "tel">{i.phone}</p>
                                    <p className = "address">{i.road_address_name}</p>
                                </div>
                            </div>
                        )
                    })
                }
                {
                    spinner === true
                    ? (<Spinner className="spinner"/>)
                    : null
                }
            </ul>
        </div>
    )
}

export default HospitalInformation;