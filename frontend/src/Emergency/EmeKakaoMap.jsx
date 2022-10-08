/* eslint-disable */
/* global kakao */

import axios from 'axios';
import React, {useState, useEffect, Component} from 'react';
import Spinner from '../Spinner';
import './EmeKakaoMap.scss'

import data from '../data/test.json';

import {connect, useSelector, useDispatch} from 'react-redux';

const { kakao } = window;

function KakaoMap(props){
    let state = useSelector(state => state);
    let dispatch = useDispatch();

    // 페이지가 로딩되면 카카오 지도 띄우도록 설정.
    let latitude = 0;
    let longitude = 0;
    let mapContainer;
    let mapOption;
    let map;
    let [spinner, spinnerChange] = useState(false);

    // x축, y축, 제목
    let allLocations = {
        x_axis: [], // 데이터에 있는 x축
        y_axis: [], // 데이터에 있는 y축
        title: [] // 병원 이름.
    }

    let [changeInfoDiv, setChangeInfoDiv] = useState('');
    
    // 좌표 카운트
    let [count, setCount] = useState(0);

    let [testX, setTestX] = useState([]);
    let [testY, setTestY] = useState([]);


    useEffect(async () => {
        data[0].kakaoMapSearch = '';
        // 처음에 지도 표시해주기.
        mapContainer = document.getElementById('map'); // 지도를 표시할 div 
        mapOption = { 
            // 충주 중심좌표
            center: new kakao.maps.LatLng(36.99196502823086, 127.92563283606664),
            level: 7 // 지도의 확대 레벨
        };
        // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
        map = new kakao.maps.Map(mapContainer, mapOption);
        // 위치 찾기 버튼을 누르면 spinner 생성.
        spinnerChange(true)
        // 현재 내 위치를 찾아주고 찾아주면 그 위치로 지도를 이동시켜줌.
        return new Promise((resolve, reject) => {
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(function(position){
                    latitude = position.coords.latitude;
                    longitude = position.coords.longitude;
                    // 내위치를 지정.
                    dispatch({type: '내위치', payload: {x: latitude, y: longitude}});
                    // 위치를 찾으면 카카오맵의 위치를 현재위치로 재설정해서 재로딩 시켜줌.
                    // 실제 내 위치(마커적용)
                    resolve(mapReset(state[0].clickLocationsX, state[0].clickLocationsY));
                    // test 위치(마커적용)
            }, function(error){
                console.log(error);
            }, {
                    enableHighAccuracy: false,
                    maximumAge: 0, 
                    timeout: Infinity
                });
            }else{
                alert('GPS를 지원하지 않습니다.');
                reject('실패');
            }
        })
        // 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트를 등록합니다
        kakao.maps.event.addListener(map, 'idle', function() {
            searchAddrFromCoords(map.getCenter(), displayCenterInfo);
        });
    }, [])


    // 사이트가 재로딩되면서 내 위치를 새로 잡아줌.
    function reload(){
        localStorage.removeItem('search');
        window.location.reload();
    }

    // 내 위치 찾아주는 함수
    function mapReset(latitude, longitude){
        axios.get(`https://back.jintam.site/test/${latitude}/${longitude}`)
        // axios.get(`http://127.0.0.1:8000/test/${36.77556877677842}/${126.46515725738562}`)
        .then(res => {
            console.log(res.data);
            // 받아온 객체를 배열로 변환.
            let hospital = Object.entries(res.data);
            for(let i = 0; i < hospital.length; i++){
                // 병원 기본정보
                dispatch({type: '응급실정보', payload: {
                    emeCount: hospital.length,
                    hospitalName: hospital[i][1].기관명,
                    hospitalTel: hospital[i][1].대표전화1,
                    hospitalAddress: hospital[i][1].주소,
                }})

                // 응급실 상세정보
                dispatch({type: '응급실상세정보', payload: {
                    emeTel: hospital[i][1].응급실전화, monday: hospital[i][1].월요진료, thusday: hospital[i][1].화요진료,
                    wednesday: hospital[i][1].수요진료, thursday: hospital[i][1].목요진료, friday: hospital[i][1].금요진료,
                    saturday: hospital[i][1].토요진료, sunday: hospital[i][1].일요진료, holiday: hospital[i][1].공휴일진료,
                    treatment: hospital[i][1].병원분류명, admission: hospital[i][1].입원가능여부
                }})
                dispatch({type: '응급실위치', payload: {
                    emeX: hospital[i][1].병원위도,
                    emeY: hospital[i][1].병원경도
                }})
            }
        })
        .catch(err => console.log(err));
        spinnerChange(false);
        mapOption = { 
            // 내 위치
            center: new kakao.maps.LatLng(state[0].clickLocationsX, state[0].clickLocationsY), // 지도의 중심좌표
            // center: new kakao.maps.LatLng(36.97897509717851, 127.92863660615964), // 지도의 중심좌표
            level: 3 // 지도의 확대 레벨
        };
        map = new kakao.maps.Map(mapContainer, mapOption);

        // 커스텀 오버레이에 표출될 내용으로 HTML 문자열이나 document element가 가능.
        let content = '<div class="customoverlay">' +
                        '<div class="textBox">' +
                            '<p class="myLocationText">내위치</p>' +
                        '</div>' +
                        '<img class = "myLocation" src="https://us.123rf.com/450wm/thesomeday123/thesomeday1231712/thesomeday123171200009/91087331-%EB%82%A8%EC%84%B1%EC%9D%84%EC%9C%84%ED%95%9C-%EA%B8%B0%EB%B3%B8-%EC%95%84%EB%B0%94%ED%83%80-%ED%94%84%EB%A1%9C%ED%95%84-%EC%95%84%EC%9D%B4%EC%BD%98-%ED%9A%8C%EC%83%89-%EC%82%AC%EC%A7%84-%EC%9E%90%EB%A6%AC-%ED%91%9C%EC%8B%9C-%EC%9E%90-%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8-%EB%B2%A1%ED%84%B0.jpg?ver=6"/>' +
                      '</div>';

        // 마커이미지 주소.
        var imageSrc = 'https://user-images.githubusercontent.com/76980526/159206316-67534985-8a03-4fe4-a375-68be2aa58149.jpeg',
            imageSize = new kakao.maps.Size(50, 50),
            imageOption = {offset: new kakao.maps.Point(27, 69)};

        // 마커가 표시될 위치
        var markerPosition  = new kakao.maps.LatLng(latitude, longitude),
            markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption); 
        
        let customOverlay = new kakao.maps.CustomOverlay({
            map: map,
            position: markerPosition,
            content: content,
            yAnchor: 1
        });
        // 주소-좌표 변환 객체를 생성합니다
        var geocoder = new kakao.maps.services.Geocoder();

        var marker = new kakao.maps.Marker(), // 클릭한 위치를 표시할 마커입니다
            infowindow = new kakao.maps.InfoWindow({zindex:1}); // 클릭한 위치에 대한 주소를 표시할 인포윈도우입니다

        // 현재 지도 중심좌표로 주소를 검색해서 지도 좌측 상단에 표시합니다
        searchAddrFromCoords(map.getCenter(), displayCenterInfo);

        function searchAddrFromCoords(coords, callback) {
            // 좌표로 행정동 주소 정보를 요청합니다
            geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);         
        };
        function panTo(x, y) {
            // 이동할 위도 경도 위치를 생성합니다 
            var moveLatLon = new kakao.maps.LatLng(x, y);
            
            // 지도 중심을 부드럽게 이동시킵니다
            // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
            map.panTo(moveLatLon);            
        }
    }
    return(
        <div>
            <div id="map">
                {
                    spinner === true
                    ? (<Spinner/>)
                    : null
                }
            </div>
            {/* <button className='backBtn'>
                뒤로가기
            </button> */}
        </div>
    )
}
export default KakaoMap;
