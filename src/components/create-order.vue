<template>
  <section class="is-flex is-flex-direction-row is-justify-content-space-evenly">
            <b-select placeholder="Pick up">
                <option
                    v-for="location in dataLocations"
                    :value="location._id"
                    :key="location._id">
                    {{ location.title }}
                </option>
            </b-select>
            <b-select placeholder="Drop off">
                <option
                    v-for="location in dataLocations"
                    :value="location._id"
                    :key="location._id">
                    {{ location.title }}
                </option>
            </b-select>
        <b-button @click="createOrder">Create order</b-button>
  </section>
</template>

<script>
export default {
  name: "CreateOrder",
  props: {
    dataLocations: {
        type: Array,
        default: () => []
    }
  },
  data() {
    return {
      ok: true,
    };
  },
  methods: {
    createOrder() {
        console.log("Create!");
    }
  }
};
</script>

<style>
</style>