<!--
 * @Descripttion: 页面风格配置
 * @version:
 * @Author: wangqi
 * @Date: 2019-08-06 13:26:49
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-14 17:25:38
 -->
<template>
  <div class="config-style">
    <div class="style-area">
      <el-divider content-position="left">
        <p class="style-title">特殊患者床位配色</p>
      </el-divider>

      <div class="config-content">
        <colorChoose
          title="病危"
          type="seriously"
          :defaultColor="colorConfig.seriously"
        />
        <colorChoose
          title="病重"
          type="critically"
          :defaultColor="colorConfig.critically"
        />
      </div>
    </div>
    <div class="style-area">
      <el-divider content-position="left">
        <p class="style-title">检验异常配色</p>
      </el-divider>
      <div class="config-content">
        <colorChoose
          title="高于正常值"
          type="high"
          :defaultColor="colorConfig.high"
        />
        <colorChoose
          title="低于正常值"
          type="low"
          :defaultColor="colorConfig.low"
        />
        <colorChoose
          title="异常"
          type="abnormal"
          :defaultColor="colorConfig.abnormal"
        />
      </div>
    </div>
    <div class="style-area">
      <el-divider content-position="left">
        <p class="style-title">主页展示滚动</p>
      </el-divider>
      <div class="config-content scroll-config flex flex-align-center">
        <el-radio v-model="scollRadio" :label="true" @change="changeScroll">
          滚动
        </el-radio>
        <span>慢</span>
        <el-slider
          class="scroll-input"
          v-model="per"
          show-input
          :disabled="!scollRadio"
          @change="receivePer"
        >
        </el-slider>
        <span class="mr-20">快</span>
        <el-radio v-model="scollRadio" :label="false" @change="changeScroll">
          不滚动
        </el-radio>
      </div>
    </div>
    <div class="style-area">
      <el-divider content-position="left">
        <p class="style-title">电子白板可配置内容</p>
      </el-divider>
      <div class="config-content">
        <el-radio-group v-model="wardAreaType">
          <el-radio :label="1">备忘录</el-radio>
          <el-radio :label="2">诊疗组</el-radio>
          <el-radio :label="3">值班组</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="style-area">
      <el-divider content-position="left">
        <p class="style-title">左右手模式</p>
      </el-divider>
      <div class="config-content">
        <el-radio-group v-model="handType">
          <el-radio :label="false">左手模式</el-radio>
          <el-radio :label="true">右手模式</el-radio>
        </el-radio-group>
      </div>
    </div>
    <div class="style-area">
      <el-divider content-position="left">
        <p class="style-title">皮肤</p>
      </el-divider>
      <div class="config-content">
        <el-radio-group v-model="skinType">
          <el-radio label="blue">默认</el-radio>
          <el-radio label="dark">夜间</el-radio>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State, Mutation } from 'vuex-class'
import colorChoose from '../components/colorChoose.vue'
import { debounce } from '../../../libs/utils'

@Component({
  name: 'pageStyle',
  components: {
    colorChoose
  }
})
export default class pageStyle extends Vue {
  @State colorConfig
  @State isScrolling
  @State scrollSpeed
  @State wardContentType
  @State rightHandType
  @State theme

  @Mutation SET_SCROLLING
  @Mutation SET_SCROLL_SPEED
  @Mutation CHANGE_WARD_CONTENT
  @Mutation CHANGE_HAND_TYPE
  @Mutation SET_THEME

  private scollRadio: boolean = false // 是否滚动
  private per: number = 0 // 滚动速度
  private wardAreaType: number = 0 // 电子白板备忘录区域展示内容配置
  private handType: boolean = false // 右手模式
  private skinType: string = 'blue' //皮肤

  @Watch('wardAreaType')
  typeChange(newVal) {
    this.CHANGE_WARD_CONTENT(newVal)
  }

  @Watch('handType')
  handTypeChange(newVal) {
    this.CHANGE_HAND_TYPE(newVal)
  }

  @Watch('skinType')
  handSkinChange(newVal) {
    window.document.documentElement.setAttribute('data-theme', newVal)
    this.SET_THEME(newVal)
  }

  mounted() {
    this.wardAreaType = this.wardContentType
    this.handType = this.rightHandType
    this.scollRadio = this.isScrolling
    this.per = this.scrollSpeed
    this.skinType = this.theme
  }

  /**
   * @name: changeScroll
   * @test: test font
   * @msg: 设置是否滚动
   * @param {void}
   * @return: void
   */
  private changeScroll(): void {
    this.SET_SCROLLING(this.scollRadio)
  }

  private receivePer(): void {
    this.SET_SCROLL_SPEED(this.per)
  }
}
</script>

<style lang="scss" scoped>
.config-style {
  height: 100px;
  .style-area {
    margin: 20px;
    padding: 10px 20px;
    border-radius: 10px;
  }
  .style-title {
    @include home-title-s-font-color;
    font-size: 20px;
  }
  .config-content {
    margin-top: 40px;
  }
  .scroll-input {
    width: 300px;
    margin-right: 20px;
    margin-left: 20px;
  }
  .scroll-config {
    font-size: 20px;
    @include home-title-s-font-color;
  }
  .mr-20 {
    margin-right: 20px;
  }
}
</style>
