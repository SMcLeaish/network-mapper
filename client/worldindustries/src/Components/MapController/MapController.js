import React, { useEffect } from "react";
import { useMap } from "react-leaflet";

const MapController = (props) => {
  const map = useMap();
  let newBounds = map.getBounds();

  const flyToDuration = 3;
    console.log(props.coord);
    console.log(newBounds)

  const flyTo = () => {
    map.flyTo(props.coord, 13, {
      animate: true,
      duration: flyToDuration,
    });
  };

//   const ShowBounds = () => {
//     const mMap = useMap();
//     let newBounds = mMap.getBounds();
//     console.log(newBounds);
//     }

  useEffect(() => {
    if(props.coord) {
      flyTo(props.coord);
    }
  }, [props])

};

export { MapController };