/* eslint-disable */

import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import './EmergencyDetail.scss';

import EmeMap from './EmeMap';


function EmergencyDetail(props){
    // redux 변수
    let state = useSelector(state => state);
    let dispatch = useDispatch();

    let [hospitalInformation1, setHospitalInformation1] = useState(['병원이름', '전화번호', '상세주소']);
    let [emeX, setEmeX] = useState([]);
    let [emeY, setEmeY] = useState([]);

    let location = 0;
    useEffect(() => {
        console.log(props);
        emeX.push(state[5].emeX);
        emeY.push(state[5].emeY);
        location = state[5].location;
    }, [])

    function activate({ target }){
        let hospitalInformation = document.querySelector('.hospitalModal');
        [...hospitalInformation.children].forEach(information => {
            information.classList.toggle('active', information === target);
        })
    }

    function Information1UI(){
        let array = [];
        let info = ['병원 이름', '전화번호', '응급실 번호'];

        let [hospitalName, hospitalTel, hospitalEmeTel] = [
            props.hospitalName[props.clickHospital],
            props.hospitalTel[props.clickHospital],
            props.emeTel[props.clickHospital]
        ]
        
        let emeTel = hospitalEmeTel;

        let hospitalInfo = [hospitalName, hospitalTel, emeTel];
        for(let i = 0; i < info.length; i++){
            array.push(
                <p className = "firstInformation">{info[i]}: {hospitalInfo[i]}</p>
            );   
        }
        return array;
    }

    function NowemeState(){
	    let array = [];
	    let NowState = ['응급실 병상 수 : ', '수술실 병상 수 : ', '입원실 병상 수 : '];
	    let NowStateData = [];
	    NowStateData.push(
		    props.emeleftover, props.surgeryleftover, props.hospitalroomleftover
	    )
	    for(let i = 0; i < NowState.length; i++){
		    array.push(
			    <p className="nowState">{NowState[i]}<span className = "NowStateData_span">{NowStateData[i][props.clickHospital]}{"석 사용가능"}</span></p>
		    )
	    }
	    return array;
    }
    
    function WeekUI(){
        let array = [];
        let week = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일', '공휴일'];
        let weekData = [];
        weekData.push(
            props.monday, props.thusday, props.wednesday, props.thursday,
            props.friday, props.saturday, props.sunday, props.holiday
        )
        for(let i = 0; i < week.length; i++){
            array.push(
                <p className="week">{week[i]} {weekData[i][props.clickHospital]}</p>
            )
        }
        return array;
    }

    if(props.detailState === 1){
        console.log(props);
        dispatch({type: '응급실위치', payload: {
            location: props.clickHospital
        }})
        let hospitalAddress = props.hospitalAddress[props.clickHospital];

        // setTimeout 안쓰도록.. 해보기
        setTimeout(() => {
            let emeStateText = document.getElementById('emeStateText');
            console.log(emeStateText);
            if(emeStateText.innerHTML === 'True'){
                emeStateText.style.color = 'blue';
                emeStateText.innerHTML = '입원 가능'
            }else if(emeStateText.innerHTML === 'False'){
                emeStateText.style.color = 'red';
                emeStateText.innerHTML = '입원 불가능'
            }
        }, 1);

        console.log(hospitalAddress);
        return(
            <div className="hospitalDetail">
                <div className="back"/>
                <div className="information">
                    {/* onClick={props.setDetailState(0)} */}
                    <p className="close" onClick={() => {
                            props.setDetailState(0);
                            // 응급실 상세 정보에서 x모양의 닫기 버튼을 누르면 햄버거(메뉴바) 생성.
                            let menuIcon = document.querySelector('.menuListIcon');
                            menuIcon.style.display = 'block';
                        }
                    }>X</p>
                    <div className="hospitalDetail">
                        <h1>병원 정보</h1><br/>
                        {Information1UI()}
                    </div>
                    <div className="hospitalDetail2">
                        <ul className="hospitalModal">
                            <h1 onClick={activate}>병원 상세정보</h1>
                        </ul><br/><br/>
                        <div className="hospitalDetail2Inner">
                            {/* <h1 className="emergencyCall">응급실 연락처 : {props.emeTel[props.clickHospital]}</h1> */}
                            <br/>
                            <h1 className="emeState">입원 가능 여부: <span id="emeStateText">{props.admission[props.clickHospital]}</span></h1><br/>
			    <h1 className="emeState">남은병동수</h1><br/>
		            <div className="NowemeState">
				{NowemeState()}
		            </div><br/>
                            <h1 className="emeLocation">위치: {hospitalAddress}</h1>
                            <EmeMap
                                emeX = {emeX}
                                emeY = {emeY}
                                click = {props.clickHospital}
                                detailState = {props.detailState}
                            />
                            <h1 className="treatmentTime">진료 시간</h1><br/>
                            <div className="weekBox">
                                {WeekUI()}
                            </div> <br/>
                            <h1>병원 구분</h1><br/>
                            <div className="diagnosisBox">
                                <p className="diagnosis">{props.treatment[props.clickHospital]}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }else {
        return(
            null
        )
    }
}

export default EmergencyDetail;
