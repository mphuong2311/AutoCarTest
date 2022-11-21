<template>
  <div class="columns">
    <div class="column">
      <b-tag :type="connected ? 'is-success' : 'is-danger'"
        >Trạng thái kết nối: {{ connected ? "Connected" : "Disconnected" }}</b-tag
      >
      <b-tag type="is-primary">Trạng thái xe: {{ statusCar }}</b-tag>
      <b-tag type="is-info"> Điểm đến: {{ nextGoal ? nextGoal.title : "---" }}</b-tag>
      <hr>
      <OrderComponent :dataLocations="list" :hasUpdate="hasUpdate"/>
      <hr />
      <div class="columns">
        <div class="column">
          <b-field >
            <b-input v-model="orderId" :disabled="confirmCarAndOrder" placeholder="Order ID"></b-input>
          </b-field>
        </div>
        <div class="column">
          <b-field>
            <b-input v-model="carName" :disabled="confirmCarAndOrder" placeholder="Car ID"></b-input>
          </b-field>
        </div>
        <div class="column">
          <b-button @click="setCarAndOrder" :disabled="confirmCarAndOrder"
            >Set</b-button
          >
          <b-button
            @click="editCarAndOrder"
            :disabled="!confirmCarAndOrder || statusCar !== 'WaitingForRoute'"
            >Edit</b-button
          >
        </div>
      </div>

      <hr />
      <b-button
        :disabled="!confirmCarAndOrder"
        v-for="location in list"
        :key="location._id"
        @click="sendGoal(location)"
        >{{ location.title }}</b-button
      >
      <hr />
      <b-button @click="sendEngage()" :disabled="!confirmCarAndOrder || statusCar !== 'WaitingForEngage'"
        >Engage</b-button
      >
      <hr />
    </div>
    <div class="column">
      <MapLocation :list="list" :centerMap="centerMap" :carGPS="carGPS" />
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { getMapById } from "@/api/map";
import { updateOrder } from "@/api/order";
import ROSLIB from "roslib";
import MapLocation from "@/components/map.vue";
import OrderComponent from "@/components/orders.vue";

export default {
  name: "MainView",
  components: {
    MapLocation,
    OrderComponent,
  },
  data() {
    return {
      list: [],
      ros: null,
      connected: null,
      topicGoal: null,
      topicEngage: null,
      topicStatus: null,
      statusCar: null,
      // Map
      centerMap: [0, 0],
      nextGoal: null,
      carGPS: [0, 0],
      carName: this.$cookie.get("carName") || null,
      orderId: this.$cookie.get("orderId") || null,
      confirmCarAndOrder: null,
      arrivedGoalEvent: false,
      hasUpdate: false,
    };
  },
  created() {
    this.fetchData();
    this.connectRos();
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    arrivedGoalEvent(oldVal, newVal) {
      if (oldVal) {
        let body = {
          car: this.carName,
          location: this.nextGoal._id,
        };
        updateOrder(this.orderId, body).then((res) => {
          console.log(res.data);
          this.hasUpdate = true;
          this.$buefy.snackbar.open("PATCH to server!");
        });
        this.hasUpdate = false;
      }
    },
  },
  methods: {
    connectRos() {
      this.ros = new ROSLIB.Ros({
        url: "ws://0.0.0.0:9090",
      });
      this.ros.on("connection", () => {
        this.$buefy.snackbar.open("ROS Connected!");
        this.connected = true;
        this.setTopic();
        this.$buefy.snackbar.open("Set topic!");
        // Listen status car
        this.topicStatus = new ROSLIB.Topic({
          ros: this.ros,
          name: "/awapi/vehicle/get/status",
          messageType: "autoware_api_msgs/AwapiVehicleStatus",
        });
        this.topicStatus.subscribe((msg) => {
          this.statusCar = msg.autoware_state;
          this.carGPS = [msg.latlon.lat, msg.latlon.lon];
          if (this.statusCar == "ArrivedGoal") {
            this.arrivedGoalEvent = true;
          } else this.arrivedGoalEvent = false;
        });
      });
      this.ros.on("error", () => {
        this.$buefy.snackbar.open("ROS Error!");
      });
    },
    fetchData() {
      getMapById(process.env.VUE_APP_MAP_ID).then((res) => {
        this.$buefy.snackbar.open("Get map & location successfully!");
        this.centerMap = [res.data.center.lat, res.data.center.lng];
        this.list = res.data.locations.filter(
          (l) => l.type == "Station" && l.status == "Release"
        );
      });
      
    },
    setTopic() {
      this.topicGoal = new ROSLIB.Topic({
        ros: this.ros,
        name: "/planning/mission_planning/mission_planner/input/llh_goal",
        messageType: "sensor_msgs/NavSatFix",
      });
      this.topicEngage = new ROSLIB.Topic({
        ros: this.ros,
        name: "/autoware/engage",
        messageType: "std_msgs/Bool",
      });
    },
    sendGoal(location) {
      let message = new ROSLIB.Message({
        latitude: location.lat,
        longitude: location.lng,
        altitude: location.atl,
      });
      this.topicGoal.publish(message);
      this.$buefy.snackbar.open(`Đã gửi cho xe điểm đến ${location.title}`);
      this.nextGoal = location;
    },
    sendEngage() {
      this.topicEngage.publish(new ROSLIB.Message({ data: true }));
      this.$buefy.snackbar.open("Sent engage!");
    },
    setCarAndOrder() {
      this.confirmCarAndOrder = true;
      this.$cookie.set("carName", this.carName);
      this.$cookie.set("orderId", this.orderId);
      this.$buefy.snackbar.open("Set car and order!");
    },
    editCarAndOrder() {
      this.confirmCarAndOrder = false;
      this.$buefy.snackbar.open("Edit car and order!");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
