<!--
 * @Descripttion: 电子白板，床位列表，备忘录，辅助交班公用布局组件
 * @version: 
 * @Author: wangqi
 * @Date: 2019-07-23 09:42:45
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-13 18:19:58
 -->

<template>
  <div class="layout flex flex-v">
    <g-header />
    <router-view class="flex-1 container" />
    <g-foot />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import gHeader from '../components/g-header.vue'
import gFoot from '../components/g-foot.vue'

@Component({
  name: 'layout',
  components: {
    gHeader,
    gFoot
  }
})
export default class layout extends Vue {}
</script>
<style lang="scss" scoped>
.layout {
  position: relative;
  height: 100%;
  overflow: hidden;
  .container {
    padding: 10px 15px 5px 15px;
    overflow: hidden;
  }
}
</style>
