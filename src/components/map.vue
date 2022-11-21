<template>
    <!-- MAP SHOW LIST LOCATION -->
    <l-map class="map" :options="mapOptions" :zoom="zoom" :center="centerMap">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker
        :lat-lng="[location.lat, location.lng]"
        :key="index"
        v-for="(location, index) in list"
      >
        <l-icon v-if="location.type == 'Station'">
          <!-- Station icon -->
          <Station />
          <!-- Station title -->
          <p :class="location.title !== '.' ? 'headline' : 'headline-2'">
            {{ location.type == "Station" ? index + 1 + ") " : ""
            }}{{ location.title }}
          </p>
        </l-icon>
      </l-marker>
      <l-marker :lat-lng="carGPS">
      <l-icon>
        <CarIcon />
      </l-icon>
    </l-marker>
    </l-map>
  </template>
  
  <script>
  import { CENTER_MAP, MAP_OPTION, URL_MAP, ATTRIBUTION } from "@/constants/map";
  import Station from "@/icons/Station.vue";
import CarIcon from "@/icons/Car.vue";
  
  export default {
    name: "MapLocation",
    components: {
      Station,
      CarIcon
    },
    props: {
      list: {
        type: Array,
        default: () => [],
      },
      centerMap: {
        type: Array,
        default: () => CENTER_MAP,
      },
      carGPS: {
      type: Array,
      default: () => CENTER_MAP,
    },
    },
    data() {
      return {
        zoom: 18,
        mapOptions: MAP_OPTION,
        attribution: ATTRIBUTION,
        url: URL_MAP,
      };
    },
  };
  </script>
  
  <style scoped>
  .headline {
    position: absolute;
    font-size: 12px;
    top: -36px;
    left: 20px;
    font-weight: 600;
    color: #223771;
    width: max-content;
    max-width: 150px;
    text-align: center;
    padding: 4px;
  }
  .headline-2 {
    position: absolute;
    font-size: 12px;
    top: -16px;
    left: 20px;
    font-weight: 600;
    color: #223771;
    width: max-content;
    max-width: 150px;
    text-align: center;
    padding: 4px;
  }
  .map {
    height: 80vh;
    border-radius: 6px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  }
  </style>
  