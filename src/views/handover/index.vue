<!--
 * @Descripttion: 辅助交班
 * @version: 
 * @Author: wangqi
 * @Date: 2019-07-16 15:51:44
 * @LastEditors: wangqi
 * @LastEditTime: 2019-07-31 17:21:48
 -->
<template>
  <cis v-if="cisShow" />
  <headlines v-else />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'
import cis from './components/cis.vue'
import headlines from './components/headlines.vue'
@Component({
  name: 'handover',
  components: {
    cis,
    headlines
  }
})
export default class handover extends Vue {
  @State customConfig
  get cisShow(): boolean {
    const showData = this.customConfig.find(item => {
      return item.code === 'handoverType'
    })
    if (showData == null) {
      return false
    }
    return showData.value === '2'
  }
}
</script>

<style lang="scss" scoped></style>
