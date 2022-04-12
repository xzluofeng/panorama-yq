<!--
 * @Descripttion: 床位号组件
 * @version:
 * @Author: wangqi
 * @Date: 2019-08-10 09:28:22
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-15 16:04:12
 -->
<template>
  <div
    v-if="data.xcwdm === '' || data.xcwdm == null"
    :class="[
      'bed-no',
      { highlight: highlight },
      fontSizeControl ? `fs-${fontSize + 2}` : '',
      { 'icon-dc': showDc && data.ztbz === 'dc' },
      {
        'icon-bri':
          showBirthday &&
          data.birth &&
          $moment().format('MM-DD') === data.birth.slice(5)
      },
      { dis: data.zcbz === '1' || data.brzt === '0' }
    ]"
    :style="StyleObj"
    @click="linkTo"
  >
    {{ data.rycw || data.cycw || data.cwdm }}
  </div>
  <div
    v-else
    :class="[
      'bed-no',
      'flex',
      'flex-align-center',
      fontSizeControl ? `fs-${fontSize + 2}` : '',
      { 'icon-dc': showDc && data.ztbz === 'dc' },
      {
        'icon-bri':
          showBirthday &&
          data.birth &&
          $moment().format('MM-DD') === data.birth.slice(5)
      },
      { dis: data.zcbz === '1' || data.brzt === '0' }
    ]"
    @click="linkTo"
  >
    {{ data.rycw || data.cycw || data.cwdm }}
    <span :class="`fs-${fontSize + 2}`">→</span>
    <span :style="StyleObj">
      {{ data.xcwdm }}
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { State, Action, Mutation } from 'vuex-class'
@Component({
  name: 'bedNo'
})
export default class bedNo extends Vue {
  // 数据
  @Prop({
    type: Object,
    default: () => {
      return {}
    }
  })
  data!: any

  // 是否跳转
  @Prop({ default: true })
  jump?: boolean

  // 跳转到患者详情页面
  @Prop({ default: true })
  jumpDetail?: boolean

  // 床位号是否显示病危病重，异常等颜色
  @Prop({ default: true })
  sickColor?: boolean

  // 是否接受系统设置字体大小
  @Prop({ default: true })
  fontSizeControl?: boolean

  // 是否显示dc标致
  @Prop({ default: false })
  showDc?: boolean

  // 是否生日图标
  @Prop({ default: false })
  showBirthday?: boolean

  // 是否高亮
  @Prop({ default: false })
  highlight?: boolean

  @State fontSize
  @State colorConfig
  @State criticalList
  @State seriouslyList

  @Action getPatientInfo
  @Mutation SET_TZ_CIS

  /**
   * @name: StyleObj
   * @test: test font
   * @msg: 病危病重字体颜色
   * @param {void}
   * @return:object
   */
  get StyleObj(): object {
    const benNo = this.data.rycw || this.data.cycw || this.data.cwdm
    let styleObj = {}
    // 优先级 ： 病危 > 病重
    if (this.criticalList.includes(benNo)) {
      // 病危,防止修改多种样式，使用样式对象
      styleObj = {
        color: this.colorConfig.seriously
      }
    } else if (this.seriouslyList.includes(benNo)) {
      // 病重
      styleObj = {
        color: this.colorConfig.critically
      }
    }
    return styleObj
  }

  /**
   * @name:
   * @test: test font
   * @msg:
   * @param {type}
   * @return:
   */
  private linkTo(): void {
    if (!this.jump) {
      return
    }
    if (this.jumpDetail) {
      const params = {
        patid: this.data.patid,
        jzlb: this.data.jzlb,
        yljgdm: this.data.yljgdm,
        jzlsh: this.data.jzlsh,
        yexh: this.data.yexh || 0
      }
      this.getPatientInfo(params)
        .then(() => {
          this.SET_TZ_CIS('1')
          sessionStorage.setItem('jzlsh', this.data.jzlsh)
          this.$router.push('/treatInfo')
          return
        })
        .catch(err => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.bed-no {
  @include bed-no-unfocus;
  @include home-font-color;
  position: relative;
  display: inline-block;
  min-width: 60px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  font-size: 21px;
  padding: 0 6px;
  box-shadow: 0 0 5px rgba(30, 60, 114, 0.3);
  border-radius: 4px;
  &.highlight {
    @include bed-no-focus;
    color: #fff;
  }
  &.mar {
    margin-bottom: 15px;
    margin-right: 15px;
  }
  &.mar-0 {
    margin: 0 auto;
  }
  &.dis {
    background-color: #f1f3f6;
  }
  &.fs-18 {
    @include bed-no-size-change(18);
  }
  &.fs-20 {
    @include bed-no-size-change(20);
  }
  &.fs-22 {
    @include bed-no-size-change(22);
  }
  &.fs-24 {
    @include bed-no-size-change(24);
  }
  &.fs-26 {
    @include bed-no-size-change(26);
  }
  &.fs-28 {
    @include bed-no-size-change(28);
  }
}

.icon-dc:after,
.icon-bri:after {
  position: absolute;
  right: -13px;
  top: -10px;
  content: '';
  display: inline-block;
  width: 26px;
  height: 21px;
  background-size: cover;
}
.icon-dc:after {
  background-image: url('../assets/images/icon-dc.png');
}
.icon-bri:after {
  height: 26px;
  background-image: url('../assets/images/birthday.png');
}
</style>
