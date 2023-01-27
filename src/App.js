import logo from './logo.svg';
import axios from 'axios'
import './App.css';
import { useEffect, useRef, useState } from 'react';
const { kakao } = window;
// 이때, 아래의 사진처럼 kakao.maps 부분에 'kakao' is not undefined 오류가 나는 것을 발견할 수 있습니다.
//이유는 스크립트로 kakao maps api를 심어서 가져오면 window전역 객체에 들어가게 됩니다.
//그런데 함수형 컴포넌트에서는 이를 바로 인식하지 못한다고 합니다.
//그렇기 때문에 코드 상단에 const { kakao } = window를 작성하여 함수형 컴포넌트에 인지 시키고 window에서 kakao객체를 뽑아서 사용하면 됩니다.

function App() {
  const url = 'https://api.odcloud.kr/api/15036011/v1/uddi:fc22c9fb-b27b-4693-9563-dd67097eb5c3?page=1&perPage=1000&serviceKey=620gIHWFqC%2FtXHpl8VcnOnfSQG3WaN5lQ4h4pxCK4dwjQr1QLlVOt0sopW186ChnXGVyxhZE%2FNADigXJrrXV4g%3D%3D'
  //재귀함수로 다 돌려서 페이지를 늘려서 다 받아온다.

  let [arr,setArr] = useState([]);
  let [points,setPoint] = useState([]);
  let mapRef = useRef(null);

  useEffect(()=>{
    const container = document.getElementById('map-area');
    const options = {
      center : new kakao.maps.LatLng(37.7387295, 127.0458908),
      level : 3,
    }
    mapRef.current = new kakao.maps.Map(container, options);
    getGmoneyData();
  },[]);

  useEffect(()=>{
    pointsInit();
  },[arr]);

  useEffect(()=>{
    var i, marker;
    for (i = 0; i < points.length; i++) {
      // 배열의 좌표들이 잘 보이게 마커를 지도에 추가합니다
      marker = new kakao.maps.Marker({ position : points[i] });
      marker.setMap(mapRef.current);
    }
  },[points])
 
  const getGmoneyData = () => {
    axios.get(url)
      .then((Response) => {
        setArr(Response.data.data);
      })
      .catch((Error)=>{
        console.log(Error);
      })
  }

  function pointsInit(){
    setPoint(arr.map( el => {
      return new kakao.maps.LatLng(el['위도'], el['경도'])
    })
    )
  }

  return (
    <div className="App">
      <div id='map-area' style={{width:'100%',height:'500px'}}></div>
    </div>
  );
}

export default App;
