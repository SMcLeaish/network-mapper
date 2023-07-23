import React, { useEffect } from "react";
import { useMap } from "react-leaflet";

const MapController = (props) => {
  const map = useMap();
  const flyToDuration = 3;
    console.log(props.coord);

  const flyTo = () => {
    map.flyTo(props.coord, 10, {
      animate: true,
      duration: flyToDuration,
    });
  };

  useEffect(() => {
    if(props.coord) {
      flyTo(props.coord);
    }
  }, [props])

};

export { MapController };