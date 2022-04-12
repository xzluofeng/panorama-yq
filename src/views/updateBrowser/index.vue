<template>
  <div class="update-browser"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'updateBrowser'
})
export default class updateBrowser extends Vue {}
</script>

<style lang="scss" scoped>
.update-browser {
  height: 100%;
  background-image: url('../../assets/images/updateBrowser.png');
  background-size: cover;
  background-position: center;
}
</style>
