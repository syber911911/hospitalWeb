/* eslint-disable */

import React, {useState, useEffect} from 'react';
import { Link, Route } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import './Emergency.scss'
import EmeKakaoMap from './EmeKakaoMap';
import EmergencyList from './EmergencyList';
import axios from 'axios';

function Emergency(){
    let dispatch = useDispatch();
    let state = useSelector(state => state);
    useEffect(() => {
        dispatch({type: '지도기능', payload: {
            mapState: 1
        }})
        console.log(state[2].mapState);
    }, [])
    function urlMain(){
        window.location.href = '/';
    }
    return(
        <div className="contain">
            <div className="inner">
                <div>
                </div>
                <section className="section">
                    <EmeKakaoMap className="emeKakakaomap"/>
                    <button onClick={urlMain} className="backBtn">뒤로가기</button>
                    <EmergencyList className="emergencyList"/>
                </section>
            </div>
        </div>
    )
}

export default Emergency;