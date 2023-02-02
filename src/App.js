import axios from 'axios'
import './App.css';
import { useEffect, useRef, useState } from 'react';
const { kakao } = window;
// 이때, 아래의 사진처럼 kakao.maps 부분에 'kakao' is not undefined 오류가 나는 것을 발견할 수 있습니다.
// 이유는 스크립트로 kakao maps api를 심어서 가져오면 window 전역 객체에 들어가게 됩니다.
// 그런데 함수형 컴포넌트에서는 이를 바로 인식하지 못한다고 합니다.
// 그렇기 때문에 코드 상단에 const { kakao } = window를 작성하여 함수형 컴포넌트에 인지 시키고 window에서 kakao객체를 뽑아서 사용하면 됩니다.

function App() {
  let [ storeArr, setStoreArr ] = useState([]);
  let [ dataFinish, setDataFinish ] = useState(false);
  let mapRef = useRef(null);
  
  useEffect(()=>{
    const container = document.getElementById('map-area');
    const options = {
      center : new kakao.maps.LatLng(37.7387295, 127.0458908), //지도 중심 의정부역
      level : 5,
    }
    mapRef.current = new kakao.maps.Map(container, options);
    getData();
  },[]);

  useEffect(()=>{
    if (dataFinish) {
      const points = storeArr.map( el => {
        return new kakao.maps.LatLng(el['위도'], el['경도'])
      });

      var i, marker;
      for (i = 0; i < points.length; i++) {
        // 배열의 좌표들이 잘 보이게 마커를 지도에 추가합니다
        marker = new kakao.maps.Marker({ position : points[i] });
        marker.setMap(mapRef.current);
      }
    }
  },[storeArr, dataFinish])
 
  // const getData = (matchCount) => {
  //   if(!matchCount){ matchCount = 10 }
  //   let url =  `https://api.odcloud.kr/api/15036011/v1/uddi:fc22c9fb-b27b-4693-9563-dd67097eb5c3?page=1&perPage=${matchCount}&serviceKey=620gIHWFqC%2FtXHpl8VcnOnfSQG3WaN5lQ4h4pxCK4dwjQr1QLlVOt0sopW186ChnXGVyxhZE%2FNADigXJrrXV4g%3D%3D`;
  //   axios.get(url)
  //     .then((Response) => {
  //       if(matchCount === 10){
  //         console.log('시발', Response)
  //         getData(Response.data.matchCount);
  //       } else {
  //         console.log('야발', Response)
  //         setStoreArr(Response.data.data);
  //       }
  //     })
  //     .catch((Error)=>{
  //       console.log(Error);
  //     })
  // }

  const getData = (page) => {
    if(!page){ page = 1 }
    let url =  `https://api.odcloud.kr/api/15036011/v1/uddi:fc22c9fb-b27b-4693-9563-dd67097eb5c3?page=${page}&perPage=1000&serviceKey=620gIHWFqC%2FtXHpl8VcnOnfSQG3WaN5lQ4h4pxCK4dwjQr1QLlVOt0sopW186ChnXGVyxhZE%2FNADigXJrrXV4g%3D%3D`;
    axios.get(url)
      .then((Response) => {
        if(Response.data.data.length != 0){
          getData(++page);
          setStoreArr((storeArr) => [...storeArr, ...Response.data.data]);
        } else {
          setDataFinish(true);
        }
      })
      .catch((Error)=>{
        console.log(Error);
      })
  }

  return (
    <div className="App">
      {
        !dataFinish && <div>데이터 로딩중 입니다.</div> 
      }
      <div id='map-area' style={{width:'100%', height:'100vh'}}></div>
    </div>
  );
}

export default App;
