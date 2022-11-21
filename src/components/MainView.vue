<template>
  <div class="columns">
    <div class="column">
      <b-tag :type="connected ? 'is-success' : 'is-danger'"
        >Trạng thái kết nối: {{ connected ? "Connected" : "Disconnected" }}</b-tag
      >
      <b-tag type="is-primary">Trạng thái xe: {{ statusCar }}</b-tag>
      <b-tag type="is-info"> Điểm đến: {{ nextGoal ? nextGoal.title : "-" }}</b-tag>
      <CreateOrder :dataLocations="list" />
      <hr />
      <div class="columns">
        <div class="column">
          <b-field label="Car" horizontal>
            <b-input v-model="carName" :disabled="confirmCarAndOrder"></b-input>
          </b-field>
        </div>
        <div class="column">
          <b-field label="OrderId" horizontal>
            <b-input v-model="orderId" :disabled="confirmCarAndOrder"></b-input>
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
      <b-button @click="sendEngage()" :disabled="!confirmCarAndOrder"
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
import { getMapById, sendInfoToServer } from "@/api/map";
import ROSLIB from "roslib";
import MapLocation from "@/components/map.vue";
import CreateOrder from "@/components/create-order.vue";

export default {
  name: "MainView",
  components: {
    MapLocation,
    CreateOrder,
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
      carName: null,
      orderId: null,
      confirmCarAndOrder: null,
      arrivedGoalEvent: false,
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
        console.log(body);
        sendInfoToServer(this.orderId, body).then((res) => {
          console.log(res);
        });
        this.$buefy.snackbar.open("PATCH to server!");
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
      getMapById("637afbfbade15d94e2cdbe23").then((res) => {
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
      console.log("Set car and order!");
    },
    editCarAndOrder() {
      this.confirmCarAndOrder = false;
      console.log("Edit car and order!");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
