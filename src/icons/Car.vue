<template>
    <svg
      class="car"
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
    >
      <defs></defs>
      <circle class="cls-1" cx="32" cy="32" r="32" />
      <path
        class="cls-2"
        d="M49.51,16.26,37.86,30.14l-2.75-3.27a2.86,2.86,0,0,1,0-3.69L40,17.29a2.93,2.93,0,0,1,2.23-1Z"
      />
      <path
        class="cls-2"
        d="M14.49,16.28,26.15,30.16l2.74-3.27a2.86,2.86,0,0,0,0-3.69L24,17.31a3,3,0,0,0-2.23-1Z"
      />
      <path
        class="cls-3"
        d="M49.72,47.74H42.36a2.83,2.83,0,0,1-2.2-1l-7.61-9.06a.72.72,0,0,0-1.1,0l-7.61,9.06a2.87,2.87,0,0,1-2.21,1H14.28L27.65,31.81l2.09-2.5a3,3,0,0,1,4.51,0l2.1,2.5Z"
      />
    </svg>
  </template>
  
  <script>
  export default {
    name: "CarIcon",
  };
  </script>
  
  <style>
  .car {
    transform: translateX(-30%);
    transform: scale(2);
    z-index: 999999999;
  }
  .cls-1 {
    fill: #233970;
  }
  .cls-2 {
    fill: #e16f2b;
  }
  .cls-3 {
    fill: #fff;
  }
  </style>