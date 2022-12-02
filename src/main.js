import Vue from "vue";
import App from "./App.vue";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
import '@mdi/font/css/materialdesignicons.css'
Vue.config.productionTip = false;
Vue.use(Buefy, {
  defaultIconPack: 'mdi',
});

/* VUE-LEAFLET */
import { LMap, LTileLayer, LMarker, LIcon, LRectangle } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
var VueCookie = require("vue-cookie");
Vue.use(VueCookie);
Vue.component("l-map", LMap);
Vue.component("l-tile-layer", LTileLayer);
Vue.component("l-marker", LMarker);
Vue.component("l-icon", LIcon);
Vue.component("l-rectangle", LRectangle);
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

/* VUE-SOCKET.IO */
import { WS_CONFIG } from "@/constants/socket";
import VueSocketIO from "vue-socket.io";
Vue.use(new VueSocketIO(WS_CONFIG));

new Vue({
  render: (h) => h(App),
}).$mount("#app");
