import React, { Component } from 'react';
import './GoogleMap.css';
import swal from 'sweetalert2';
// library
import {socket} from '../../../socketClient';
import {createMap} from '../../../google/mapOption';
import {driverMarker, riderMarker} from '../../../google/markers';
import {drawDirection} from '../../../google/drawDirection';
const google = window.google

export default class GoogleMap extends Component {

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount(){
    const {lat , lng , idDriver} = this.props;
    const map = new google.maps.Map(this.refs.map , createMap(lat , lng));
    const dMarker = driverMarker({lat , lng} , map);    
    if(idDriver) socket.emit('DRIVER_LOG_IN', idDriver);
    socket.on('SEVER_SEND_RIDER', riderData => {
      swal({
        title: 'Bạn có muốn đón khách ?',
        text: 'Thông báo sẽ đóng sau 5 giây !',
        timer: 5000,
        type: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Chấp nhận đón'
        // onOpen: () => {
        //   swal.showLoading()
        // }
      }).then(result => {
        if (result.dismiss === 'timer') {
          console.log("CANCEL");
        }
        if(result.value) {
          const rMarker = riderMarker(riderData , map);
          drawDirection(dMarker , rMarker, map);
        }
      })
    });
  }

  render() {
    return (
      <div id="map" ref="map" ></div>
    );
  }
}