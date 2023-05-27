/* eslint-disable */
/* global kakao */

// 응급실 마커 이미지 https://w7.pngwing.com/pngs/819/834/png-transparent-red-cross-logo-hospital-medical-sign-health-medical-cross-logo-sign-medicine.png
import React, {useState, useEffect} from 'react';
import './EmeMap.scss'
import {useSelector, useDispatch} from 'react-redux';

import markerImg from '../image/marker/emeMarkerImg.png';

const { kakao } = window;

function EmeMap(props){
    let location = 0;
    useEffect(() => {
        console.log(props.click)
        location = props.click;
        // map();
    }, [])
    function Map(){
        let array = [];
        array.push(<div id="emeMap"/>)
        // return array;

        location = props.click;
        setTimeout(() => {
            var imageSrc = markerImg, // 마커이미지의 주소입니다    
            imageSize = new kakao.maps.Size(70, 40), // 마커이미지의 크기입니다
            imageOption = {offset: new kakao.maps.Point(27, 69)};

            let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption); // 마커 이미지
            let markerPosition  = new kakao.maps.LatLng(props.emeY[0][location], props.emeX[0][location]);  // 마커가 표시될 위치

            let marker = new kakao.maps.Marker({
                position: markerPosition,
                image: markerImage
            })
            var mapContainer = document.getElementById('emeMap'), // 지도를 표시할 div 
            mapOption = { 
                center: new kakao.maps.LatLng(props.emeY[0][location], props.emeX[0][location]), // 지도의 중심좌표
                level: 3 // 지도의 확대 레벨
            };

            // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
            var map = new kakao.maps.Map(mapContainer, mapOption); 

            marker.setMap(map);  
        }, 100);
        return array; 
    }
    return(
        <div>
            {Map()}
        </div>
    )
}
export default EmeMap;