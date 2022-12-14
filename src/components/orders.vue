<template>
  <section>
    <section
      class="is-flex is-flex-direction-row is-justify-content-space-evenly"
    >
      <b-select placeholder="Pick up" v-model="pickUp">
        <option
          v-for="location in dataLocations"
          :value="location._id"
          :key="location._id"
        >
          {{ location.title }}
        </option>
      </b-select>
      <b-select placeholder="Drop off" v-model="dropOff">
        <option
          v-for="location in dataLocations"
          :value="location._id"
          :key="location._id"
        >
          {{ location.title }}
        </option>
      </b-select>
      <b-button @click="handleCreateOrder">Create order</b-button>
    </section>
    <br />
    <b-checkbox v-model="showCompletedOrders">
      Show completed orders
    </b-checkbox>
    <b-table :data="orderList ? orderList : []">
      <b-table-column field="id" label="Order ID" v-slot="props" centered>
        {{ props.row._id }}
      </b-table-column>
      <b-table-column field="car" label="Car" v-slot="props" centered>
        {{ props.row.car?._id || "-" }}
      </b-table-column>
      <b-table-column field="pickUp" label="pickUp" v-slot="props" centered>
        {{ props.row.pickUp.title }}
      </b-table-column>
      <b-table-column field="dropOff" label="dropOff" v-slot="props" centered>
        {{ props.row.dropOff.title }}
      </b-table-column>
      <b-table-column
        field="status"
        label="Status"
        v-slot="props"
        sortable
        centered
      >
        <span
          :class="[
            'tag',
            { 'is-info': props.row.status === 2 },
            { 'is-danger': props.row.status == 0 || props.row.status === 1 },
            { 'is-success': props.row.status == 4 },
          ]"
        >
          {{ props.row.status }}
        </span>
      </b-table-column>
      <b-table-column label="Actions" v-slot="props" centered>
        <b-button
          @click="handleDeleteOrder(props.row._id)"
          size="is-small"
          type="is-danger"
          icon-left="delete"
          >Delete</b-button
        >
      </b-table-column>
    </b-table>
  </section>
</template>

<script>
import { createOrder, getOrders, deleteOrder } from "@/api/order";
export default {
  name: "CreateOrder",
  props: {
    dataLocations: {
      type: Array,
      default: () => [],
    },
    hasUpdate: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      pickUp: null,
      dropOff: null,
      order: null,
      orderList: [],
      showCompletedOrders: false,
    };
  },
  created() {
    this.fetchProcessingOrders();
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    hasUpdate(oldVal, newVal) {
      this.fetchProcessingOrders();
    },
    // eslint-disable-next-line no-unused-vars
    showCompletedOrders(oldVal, newVal) {
      if (!oldVal) {
        this.fetchProcessingOrders();
      } else this.fetchCompletedOrders();
    },
  },
  sockets: {
    decline_order: function () {
      console.log("Don hang bi tu choi!");
      this.fetchProcessingOrders()
    },
    accept_order(order) {
      console.log(order);
      console.log("Co don hang moi!");
      this.fetchProcessingOrders()
    }
  },  
  methods: {
    fetchCompletedOrders() {
      getOrders().then((res) => {
        this.$buefy.snackbar.open("Get completed orders!");
        this.orderList = res.data.filter((o) => o.status == 4);
      });
    },
    fetchProcessingOrders() {
      getOrders().then((res) => {
        this.$buefy.snackbar.open("Get processing orders!");
        this.orderList = res.data.filter((o) => o.status != 4);
      });
    },
    handleCreateOrder() {
      let data = {
        map: process.env.VUE_APP_MAP_ID,
        pickUp: this.pickUp,
        dropOff: this.dropOff,
      };
      createOrder(data).then((res) => {
        this.$socket.emit("track_order", res.data._id);
        this.order = res.data;
        this.$buefy.snackbar.open("Created order successfully!");
        if (this.showCompletedOrders) {
          this.fetchCompletedOrders();
        } else this.fetchProcessingOrders();
      });
    },
    handleDeleteOrder(id) {
      deleteOrder(id).then(() => {
        this.$buefy.toast.open(`Delete ${id}`);
        if (this.showCompletedOrders) {
          this.fetchCompletedOrders();
        } else this.fetchProcessingOrders();
      });
    },
  },
};
</script>

<style>
</style>