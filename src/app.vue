<template>
  <!-- App -->
  <div id="app">

    <!-- Statusbar -->
    <f7-statusbar></f7-statusbar>

    <!-- Main View -->
    <f7-view id="main-view" url="/" main color="green"></f7-view>
  </div>
</template>

<script lang="ts">
import { f7View, f7Statusbar } from 'framework7-vue'
export default {
    components: {
        f7View,
        f7Statusbar
    }
}
</script>