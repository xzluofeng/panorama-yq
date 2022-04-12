<!--
 * @Descripttion: 公用脚部组件
 * @version:
 * @Author: wangqi
 * @Date: 2019-07-23 09:43:00
 * @LastEditors: wangqi
 * @LastEditTime: 2019-07-31 17:02:36
 -->

<template>
  <div class="g-foot">
    <span class="flush-time">截至{{ subDataFlushTime }}数据</span>
    <span class="version" @click="setSelectAreaShow(true)">
      卫视界可视化诊疗软件 {{ version }}
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import state from '../store/state'

@Component({
  name: 'gFoot'
})
export default class gFoot extends Vue {
  @State dataFlushTime
  private version: string = 'V3.5'
  @Action setSelectAreaShow

  get subDataFlushTime() {
    return this.dataFlushTime ? this.dataFlushTime.substring(11, 16) : '--'
  }
}
</script>
<style lang="scss" scoped>
.g-foot {
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  color: #999;
  text-align: right;
  padding-right: 20px;
  .version {
    cursor: pointer;
    @include puhui-m;
  }
  .flush-time {
    position: absolute;
    left: 20px;
  }
}
</style>
