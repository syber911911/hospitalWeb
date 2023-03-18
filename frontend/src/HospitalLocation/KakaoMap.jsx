/* eslint-disable */
/* global kakao */

import axios from 'axios';
import React, {useState, useEffect, Component} from 'react';
import Spinner from '../Spinner';
import './KakaoMap.scss'

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
        title: [] // 병원 이름
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
        // 화면이 띄워지면 spinner 제거.
        spinnerChange(false);
        mapOption = { 
            // 내 위치
            center: new kakao.maps.LatLng(state[0].clickLocationsX, state[0].clickLocationsY), // 지도의 중심좌표
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
        let beforeCount;
        setInterval(() => {
            if(localStorage.getItem('count') !== beforeCount) {
                beforeCount = localStorage.getItem('count');
                console.log(typeof localStorage.getItem('count').value);
                // 밑의 console 지우면.. 안됨..?
                panTo(testY[localStorage.getItem('count')], testX[localStorage.getItem('count')]);
            }
        }, 1000);
        
        function panTo(x, y) {
            // 이동할 위도 경도 위치를 생성합니다 
            var moveLatLon = new kakao.maps.LatLng(x, y);
            
            // 지도 중심을 부드럽게 이동시킵니다
            // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
            map.panTo(moveLatLon);            
        }
    }
    // 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
    function displayCenterInfo(result, status) {
        var infowindow = new kakao.maps.InfoWindow({zIndex:1});
        if (status === kakao.maps.services.Status.OK) {
            // infoDiv의 innerHTML 값을 전송
            var infoDiv = document.getElementById('centerAddr');
            for(var i = 0; i < result.length; i++) {
                if (result[i].region_type === 'H') {
                    infoDiv.innerHTML = result[i].address_name;
                    break;
                }
            }
            changeInfoDiv = infoDiv.innerHTML;
            // 장소 검색 객체를 생성합니다
            var ps = new kakao.maps.services.Places();
            // 내 위치에 주소가 있으면 내 위치 주변의 병원이 검색.
            if(localStorage.getItem('search') === null){
                ps.keywordSearch(`${changeInfoDiv} 병원`, placesSearchCB); 
            }else if(localStorage.getItem('search') !== ''){
                ps.keywordSearch(`${localStorage.getItem('search')} 병원`, placesSearchCB);
            }
            // 키워드 검색 완료 시 호출되는 콜백함수 입니다
            function placesSearchCB (data, status, pagination) {
                if (status === kakao.maps.services.Status.OK) {

                    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                    // LatLngBounds 객체에 좌표를 추가합니다
                    var bounds = new kakao.maps.LatLngBounds();

                    for (var i = 0; i < data.length; i++) {
                        displayMarker(data[i]);    
                        bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
                    }    
                    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
                    map.setBounds(bounds);
                } 
            }
            // 지도에 마커를 표시하는 함수.
            function displayMarker(place) {
                // 마커를 생성하고 지도에 표시합니다
                var marker = new kakao.maps.Marker({
                    map: map,
                    position: new kakao.maps.LatLng(place.y, place.x) 
                });
                dispatch({type: '병원정보', payload: {
                    hospital: place, address: changeInfoDiv,
                }})
                // 일단 이렇게 값 넣어주기.
                testX.push(place.x);
                testY.push(place.y);
                // 마커에 클릭이벤트를 등록합니다
                kakao.maps.event.addListener(marker, 'click', function() {
                    // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
                    infowindow.setContent(`<div style=
                        "padding:5px;
                        text-align: center;
                        width: 150px;
                        height: 30px;
                        font-size:13px;
                        font-weight: 700;"
                    >` + place.place_name + '</div>');
                    infowindow.open(map, marker);
                });
            }
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
                <div className="hAddr">
                    <span className="title">내 위치</span>
                    <span id="centerAddr"/>
                </div>
            </div>
        </div>
    )
}
export default KakaoMap;
