<!--
 * @Descripttion: 返回按钮
 * @version:
 * @Author: wangqi
 * @Date: 2019-08-01 15:21:42
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-09 13:56:07
 -->
<template>
  <div class="go-back flex flex-align-center flex-pack-center" @click="goBack">
    <i class="icon"></i> 返回上一步
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
@Component({
  name: 'goBack'
})
export default class goBack extends Vue {
  private goBack(): void {
    this.$router.back()
  }
}
</script>

<style lang="scss" scoped>
.go-back {
  font-size: 21px;
  height: 48px;
  line-height: 48px;
  @include home-content-bg;
  @include button-border;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(30, 60, 114, 0.4);
  margin: 2px;
  @include go-back-font-color;
  cursor: pointer;
  @include puhui-m;
  .icon {
    display: inline-block;
    width: 24px;
    height: 24px;
    background-image: url('../assets/images/go-back.png');
    background-size: contain;
    margin-right: 10px;
    background-repeat: no-repeat;
  }
}
</style>
