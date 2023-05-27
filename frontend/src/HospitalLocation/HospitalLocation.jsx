/* eslint-disable */
/* global kakao */
import React, {useState, useEffect} from 'react';
import { Link, Route } from 'react-router-dom';
import './HospitalLocation.scss'
import KakaoMap from './KakaoMap';
import HospitalInformation from './HospitalInformation'
import axios from 'axios';

import { useDispatch, useSelector } from 'react-redux';
// JSON 파일 서버 : npx json-server ./data.json(저장한 파일명) --watch --port 8080

function HospitalLocation(){

    useEffect(() => {
        dispatch({type: '지도기능', payload: {
            mapState: 0
        }})
    }, [])
    // let [list, listChange] = useState(['전체', '연수동', '연수동', '대소원', '호암동', '교현동', '지현동', '칠금동']);
    let [inputValue, setInputValue] = useState('');
    let [a, setA] = useState([]);
    const onChange = (e) => {
        // input에 입력한 값을 HospitalInformation에 보냄.
        setInputValue(e.target.value);
        console.log(e.target.value);
    }

    let state = useSelector(state => state);
    let dispatch = useDispatch();

    let [test, setTest] = useState(0);

    const counts = (value) => {
        setTest(value);
    }

    // enter 키 이벤트 (enter키를 누르면 검색이 실행된다.)
    const onkeyPress = e => {
        if(e.key == 'Enter'){
            data[0].kakaoMapSearch = e.target.value;
            console.log('검색 결과', data[0].kakaoMapSearch);
        }
    }
    function clickBtn(e){
        let searchBtn = document.querySelector('.btn');
        let search = document.querySelector('.search');
        let test = searchBtn.addEventListener('click', function(){
            console.log('클릭', search.textContent);
            dispatch({type: '검색', payload: {
                sendInput: e.target.value,
            }})
        })
    }
    // Main 페이지로 이동하는 함수 따로 만들어주기.(이렇게 안하면 다시 kakaomap 페이지 이동 시 내 위치 검색이 안됨.)
    function urlMain(){
        location.href = '/';
    }
    return(
        <main>
            <div className="inner">
                <div>
                </div>
                <section className="section">
                    <KakaoMap test={test} className="kakaoMap"/>
                    {/* input 값을 props로 보내기. */}
                    <HospitalInformation propsCount={counts}/>
                </section>
                <button onClick={urlMain} className='backBtn'>
                    뒤로가기
                </button>
            </div>
        </main>
    )
}
export default HospitalLocation;