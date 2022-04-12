<!--
 * @Descripttion: 备忘录页面
 * @version:
 * @Author: wangqi
 * @Date: 2019-07-16 15:47:04
 * @LastEditors: wangqi
 * @LastEditTime: 2019-07-31 17:20:45
 -->
<template>
  <div class="area-remark flex flex-v">
    <div class="top flex-1 flex">
      <patientNote />
      <wardCheat />
    </div>
    <div class="bottom flex">
      <responsibilityGroup />
      <dutyGroup />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import patientNote from './components/patientNote.vue'
import wardCheat from './components/wardCheat.vue'
import responsibilityGroup from './components/responsibilityGroup.vue'
import dutyGroup from './components/dutyGroup.vue'

@Component({
  name: 'areaRemark',
  components: {
    patientNote,
    wardCheat,
    responsibilityGroup,
    dutyGroup
  }
})
export default class areaRemark extends Vue {}
</script>

<style lang="scss" scoped>
.area-remark {
  height: 100px;
  overflow: hidden;
  .top {
    margin-bottom: 15px;
  }
  .bottom {
    height: 415px;
  }

  .top,
  .bottom {
    & > div {
      box-shadow: 0px 2px 4px rgba(30, 60, 114, 0.4);
      border-radius: 4px;
      height: 100%;
      @include home-content-bg;
      padding: 65px 25px 15px;
    }
  }
}
</style>
