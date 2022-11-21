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
    <b-table :data="orderList ? orderList : []">
      <b-table-column field="id" label="ID" v-slot="props" centered>
        {{ props.row._id }}
      </b-table-column>
      <b-table-column field="car" label="Car" v-slot="props" centered>
        {{props.row.car._id}}
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
            { 'is-danger': props.row.status != 4 },
            { 'is-success': props.row.status == 4 },
          ]"
        >
          {{ props.row.status }}
        </span>
      </b-table-column>
    </b-table>
  </section>
</template>

<script>
import { createOrder, getOrders } from "@/api/order";
export default {
  name: "CreateOrder",
  props: {
    dataLocations: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      pickUp: null,
      dropOff: null,
      order: null,
      orderList: null,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getOrders().then((res) => {
        this.orderList = res.data;
      });
    },
    handleCreateOrder() {
      let data = {
        map: process.env.VUE_APP_MAP_ID,
        pickUp: this.pickUp,
        dropOff: this.dropOff,
      };
      createOrder(data).then((res) => {
        this.order = res.data;
        this.$buefy.snackbar.open("Created order successfully!");
        this.fetchData();
      });
    },
  },
};
</script>

<style>
</style>