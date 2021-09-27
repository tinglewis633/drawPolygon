import React from "react";
import axios from "axios";
import "./SearchBar.css";
import PlacesAutocomplete, {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from "react-places-autocomplete";
import { appStore, coordsStore } from "./store/store";
function SearchBar() {
  // const [address, setAddress] = React.useState("");
  const search = appStore.useState((s) => s.search);
  const addressPass = appStore.useState((s) => s.addressPass);
  const searched = appStore.useState((s) => s.searched);
  const rectangleCoords = coordsStore.useState((s) => s.rectangleCoords);
  const circleCoords = coordsStore.useState((s) => s.circleCoords);
  const polygonCoords = coordsStore.useState((s) => s.polygonCoords);
  const markerCoord = appStore.useState((s) => s.markerCoord);
  const address = appStore.useState((s) => s.address);
  function searchInput(e) {
    appStore.update((s) => {
      s.search = e.target.value;
    });
  }

  const point = { lat: 40.144794456372686, lng: -75.41317825652716 };
  const handleChange = (e) => {
    appStore.update((s) => {
      s.address = e;
    });
  };

  const handleSelect = async (e) => {
    appStore.update((s) => {
      s.address = e;
    });
  };
  function checkAddress() {
    //change address input to lat and lng using geo api
    axios
      .get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: {
          address: address,
          key: "AIzaSyBgxJ-padRN_a3sczwqk7sB1NPkuObA2gk",
        },
      })
      .then((response) => {
        appStore.update((s) => {
          s.addressPass = true;
        });

        const checkLat = response.data.results[0].geometry.location.lat;
        const checkLng = response.data.results[0].geometry.location.lng;

        appStore.update((s) => {
          s.markerCoord = {
            lat: checkLat,
            lng: checkLng,
          };
        });

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
          let count = 0;
          console.log("COORD", coord.coords);
          for (let i = 0; i < coord.coords.length - 1; i++) {
            if (
              (coord.coords[i].lat > checkLat &&
                coord.coords[i + 1].lat < checkLat) ||
              (coord.coords[i].lat < checkLat &&
                coord.coords[i + 1].lat > checkLat)
            ) {
              const slope =
                (coord.coords[i + 1].lat - coord.coords[i].lat) /
                (coord.coords[i + 1].lng - coord.coords[i].lng);
              const intercept =
                coord.coords[i + 1].lat - slope * coord.coords[i + 1].lng;
              const cross = (checkLat - intercept) / slope;
              if (cross > checkLng) {
                count = count + 1;
              }
            }
          }
          console.log("COUNT", count);
          if (count % 2 === 1) {
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
      <div>
        <PlacesAutocomplete
          value={address}
          onChange={handleChange}
          onSelect={handleSelect}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading,
          }) => (
            <div>
              <div className='search-bar'>
                <input {...getInputProps({ placeholder: "Type address" })} />
                <button onClick={checkAddress}>test</button>
              </div>
              <div>
                {loading ? <div>...loading</div> : null}

                {suggestions.map((suggestion) => {
                  const style = {
                    backgroundColor: suggestion.active ? "#41b6e6" : "#fff",
                  };
                  return (
                    <li
                      key={suggestion.id}
                      {...getSuggestionItemProps(suggestion, { style })}
                    >
                      {suggestion.description}
                    </li>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>
      </div>
      {!addressPass && searched && (
        <div className='pass'>
          The address you entered falls in the restricted area
        </div>
      )}
      {addressPass && searched && (
        <div className='fail'>
          The address you entered does not fall in the restricted area
        </div>
      )}
      <br /> <br />
    </div>
  );
}

export default SearchBar;
