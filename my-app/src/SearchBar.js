import React from "react";
import axios from "axios";
import "./SearchBar.css";
import { appStore, coordsStore } from "./store/store";
function SearchBar() {
  const search = appStore.useState((s) => s.search);
  const addressPass = appStore.useState((s) => s.addressPass);
  const searched = appStore.useState((s) => s.searched);
  const rectangleCoords = coordsStore.useState((s) => s.rectangleCoords);
  const circleCoords = coordsStore.useState((s) => s.circleCoords);
  const polygonCoords = coordsStore.useState((s) => s.polygonCoords);
  function searchInput(e) {
    appStore.update((s) => {
      s.search = e.target.value;
    });
  }

  const point = { lat: 40.144794456372686, lng: -75.41317825652716 };

  function checkAddress() {
    //change address input to lat and lng using geo api
    axios
      .get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: {
          address: search,
          key: "AIzaSyBgxJ-padRN_a3sczwqk7sB1NPkuObA2gk",
        },
      })
      .then((response) => {
        const checkLat = response.data.results[0].geometry.location.lat;
        const checkLng = response.data.results[0].geometry.location.lng;

        // check if the input address coord falls into the circle areas
        circleCoords.forEach((coord) => {
          const circleRaidusInDegree = (coord.radius / 1.11) * 0.00001;
          const circleX = coord.coords.lng;
          const circleY = coord.coords.lat;
          const xDifference = Math.abs(checkLng - circleX);
          const yDifference = Math.abs(checkLat - circleY);
          const pointRaidus = Math.sqrt(
            xDifference * xDifference + yDifference * yDifference
          );

          if (circleRaidusInDegree > pointRaidus) {
            appStore.update((s) => {
              s.addressPass = false;
            });
          }
        });
        // check if the input address coord falls into the rectangle areas
        rectangleCoords.forEach((coord) => {
          if (
            coord.coords[2].lat > checkLat &&
            coord.coords[0].lat < checkLat &&
            coord.coords[2].lng > checkLng &&
            coord.coords[0].lng < checkLng
          ) {
            appStore.update((s) => {
              s.addressPass = false;
            });
          }
        });
        // check if the input address coord falls into the polygon areas
        polygonCoords.forEach((coord) => {
          const filtered = coord.coords.filter((coord) => coord.lng > checkLng);

          let count = 0;
          for (let i = 0; i < filtered.length - 1; i++) {
            const bigLatDifference = Math.abs(
              filtered[i].lat - filtered[i + 1].lat
            );
            const smallLatDifference = Math.abs(filtered[i].lat - checkLat);

            if (bigLatDifference > smallLatDifference) {
              count = count + 1;
            }
          }

          if (count % 2 == 1) {
            appStore.update((s) => {
              s.addressPass = false;
            });
          }
        });

        appStore.update((s) => {
          s.searched = true;
        });
      });
  }

  return (
    <div>
      <div className='search-bar'>
        <input onChange={searchInput} value={search} />
        <button onClick={checkAddress}>test</button>
      </div>
      {!addressPass && searched && (
        <div className='pass'>
          The address you entered falls in the restricted area
        </div>
      )}
      {addressPass && searched && (
        <div className='fail'>
          The address you entered does not falls in the restricted area
        </div>
      )}
      <br /> <br />
    </div>
  );
}

export default SearchBar;
