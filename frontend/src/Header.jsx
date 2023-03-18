import React from 'react';
import {useState, useEffect} from 'react';
import {Link, Route, Switch} from 'react-router-dom';
import './Header.scss';

function Header(){
    let menuList = ['홈', '내 위치 근처 병원 찾기', '내 주변 응급실 및 AED 위치찾기'];

    useEffect(() => {
        // 누른 메뉴에 따라서 url 변경.
        let menuList = document.querySelectorAll('.menuList');
        let load = ['/', 'hospital', 'emergency'];
        for(let i = 0; i < menuList.length; i++){
            menuList[i].addEventListener('click', function(){
                window.location.href = load[i];
            })
        }
    }, [])

    function hamburgerMove(){
        let line = document.querySelectorAll('.line');
        let menuOpen = document.querySelector('.menuOpen');
        for(var i = 0; i < line.length; i++){
            line[i].classList.toggle('event');
        }
        // 햄버거 누르면 옆에 메뉴 생성해주기. + 배경 어둡게 해주기.
        menuOpen.classList.toggle('event');
    }
    function hamburger(){
        let menuIcon = [];
        for(let i = 0; i < 3; i++){
            menuIcon.push(<div className = "line"/>);
        }
        return menuIcon;
    }

    function urlMain(){
        window.location.href = '/';
    }

    return(
        <header>
            <div className="inner">
                <img onClick={urlMain} className="logo" alt="스크린샷 2022-05-12 오후 1 30 46" src="https://user-images.githubusercontent.com/76980526/174195830-6909582a-9f7b-4607-833c-68f49239b273.png"></img>
                <div className='menuListIcon' onClick={hamburgerMove}>
                    {hamburger()}
                </div>
            </div>
            <div className='menuOpen'>
                    <ul>
                        {
                            menuList.map(i => {
                                return(
                                    <li className="menuList">{i}</li>
                                )
                            })
                        }
                    </ul>
                </div>
        </header>
    )
}

export default Header;
