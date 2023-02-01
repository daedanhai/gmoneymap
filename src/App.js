import axios from 'axios'
import './App.css';
import { useEffect, useMemo, useState } from 'react';
import { Map, MapMarker, MarkerClusterer ,useMap} from 'react-kakao-maps-sdk';
import { Route, Routes } from 'react-router-dom';


function App() {
  const dataUrl = 'https://api.odcloud.kr/api/15036011/v1/uddi:fc22c9fb-b27b-4693-9563-dd67097eb5c3?page=1&perPage=300&serviceKey=620gIHWFqC%2FtXHpl8VcnOnfSQG3WaN5lQ4h4pxCK4dwjQr1QLlVOt0sopW186ChnXGVyxhZE%2FNADigXJrrXV4g%3D%3D';
  let [ dataArr,setDataArr ] = useState([]);
  // let [ filtedData,setFiltedData ] = useState([]);
  
  useEffect(()=>{
    axios.get(dataUrl)
      .then((response) => {
        setDataArr(response.data.data);
      })
      .catch((error)=> {
        console.log(error.data);
      });
  },[]);
  console.log(dataArr);


  // useEffect(()=>{
  //   dataFilted();
  // },[dataArr]);


  const dataFilted = ()=>{
    return(
      setFiltedData(
        dataArr.map((el)=>{
          return (
            {
              name: el['상호명'],
              location: el['소재지(도로명주소)'],
              latlng: { lat: el['위도'], lng: el['경도'] }
            }
          )
        })
      )
    )
  };

  const EventMarkerContainer = ({ lng , lat, name, location }) => {
    const map = useMap()
    const [isVisible, setIsVisible] = useState(false);
    return (
      <MapMarker
        position={ {
          lat: lat,
          lng: lng,
        } } // 마커를 표시할 위치
        // @ts-ignore
        onClick={ ( marker ) => map.panTo( marker.getPosition() )}
        onMouseOver={ () => setIsVisible(true) }
        onMouseOut={ () => setIsVisible(false) }
      >
        { 
          isVisible &&
          <div className='info-wrap'>
            <h4>{name}</h4>
            <p>{location}</p>
          </div>
        }
      </MapMarker>
    )
  }

  return (
    <div className="App">
      
      <Routes>
        <Route path="/" element={
          <Map // 지도를 표시할 Container
            center={{
              // 지도의 중심좌표
              lat: 37.7387295,
              lng: 127.0458908,
            }}
            style={{
              // 지도의 크기
              width: "100%",
              height: "100vh",
            }}
            level={5} // 지도의 확대 레벨
          >
            <MarkerClusterer
              averageCenter={true} // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
              minLevel={5} // 클러스터 할 최소 지도 레벨
            >
            { 
              dataArr.map((value, idx) => (
                <EventMarkerContainer
                  key={ idx }
                  lat = { value['위도'] }
                  lng = { value['경도']}
                  name={ value['상호명'] }
                  location={ value['소재지(도로명주소)'] }
                />
              ))
            }
            </MarkerClusterer>
          </Map>
        } />
        <Route path="/test" element={<div className='test'>테스트</div>} />
      </Routes>
    </div>
  );
}

export default App;
