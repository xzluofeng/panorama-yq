<!--
 * @Descripttion: 颜色选择盒子
 * @version: 
 * @Author: wangqi
 * @Date: 2019-08-06 16:03:28
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-12 11:03:52
 -->
<template>
  <div class="color-choose flex flex-align-center">
    <span class="c-c-title">{{ title }}</span>
    <span
      v-for="(item, index) in colorArr"
      :key="index"
      :class="['color-item', { active: chooseValue === item }]"
      :style="{ backgroundColor: item }"
      @click="chooseColor(item)"
    >
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { State, Mutation } from 'vuex-class'
@Component({
  name: 'colorChoose'
})
export default class colorChoose extends Vue {
  @Prop(String) title!: string // 小标题
  @Prop(String) type!: string // 类别
  @Prop(String) defaultColor!: string // 默认颜色

  @Mutation SET_COLOR

  private colorArr: string[] = this.$config.colorArr
  public chooseValue: string = this.defaultColor

  private chooseColor(color: string): void {
    this.chooseValue = color
    this.SET_COLOR({
      type: this.type,
      color
    })
  }
}
</script>

<style lang="scss" scoped>
.color-choose {
  display: inline-block;
  margin-right: 40px;
  .c-c-title {
    font-size: 24px;
    color: #4996e2;
    margin-right: 20px;
  }
  .color-item {
    position: relative;
    display: inline-block;
    width: 22px;
    height: 22px;
    margin-right: 10px;
    cursor: pointer;
    &.active {
      &:after {
        content: '\e790';
        color: #0c62ce;
        position: absolute;
        font-size: 14px;
        text-align: center;
        top: -50%;
        left: 50%;
        transform: translateX(-50%);
        font-family: element-icons !important;
        speak: none;
        font-style: normal;
        font-weight: 400;
        font-variant: normal;
        text-transform: none;
        line-height: 1;
        vertical-align: baseline;
        display: inline-block;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
    }
  }
}
</style>
