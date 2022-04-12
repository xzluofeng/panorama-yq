<!--
 * @Descripttion:
 * @version:
 * @Author: wangqi
 * @Date: 2019-08-06 13:27:38
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-15 09:10:20
 -->
<template>
  <transition name="el-fade-in-linear">
    <contentNormal v-if="moudleId !== 'BQGZ'" :moudleId="moudleId" />
    <contentSpecial v-else :moudleId="moudleId" />
  </transition>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import contentNormal from '../components/contentNormal.vue'
import contentSpecial from '../components/contentSpecial.vue'

@Component({
  name: 'pageContent',
  components: {
    contentNormal,
    contentSpecial
  }
})
export default class pageContent extends Vue {
  @State moduleMenu

  private moudleId: string = '' // 模块id

  created() {
    this.moudleId = this.$route.params.moudleId
  }

  /**
   * @name: moudleObj
   * @test: test font
   * @msg: 模块对象，传入子组件
   * @param {type}
   * @return: object
   */
  get moudleObj(): object {
    const obj = this.moduleMenu.find(item => {
      return item.moduleId === this.moudleId
    })
    return obj
  }

  @Watch('$route')
  onChangeValue(newVla: any): void {
    this.moudleId = '' + newVla.params.moudleId
  }
}
</script>

<style lang="scss" scoped></style>
