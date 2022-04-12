<!--
 * @Descripttion: 患者详情 - 头部
 * @version: header
 * @LastEditTime: 2019-08-09 13:58:25
 -->
<template>
  <div class="header flex flex-align-center">
    <div class="patient"></div>
    <span class="bold">{{ patientInfo.brxxkJz.hzxm }}</span>
    <span class="bold">{{ patientInfo.brxxkJz.xbmc }}</span>
    <span class="bold">{{ patientInfo.age }}</span>
    <span class="in-hosptail">
      {{ patientInfo.jzkssj.substr(0, 10) }}入院
    </span>
    <span class="diagnosis flex-1">主诊断： {{ patientInfo.zdmc || '-' }}</span>
    <div
      :class="[{ sjz_down: !showTime }, { sjz_up: showTime }, 'sjz_xz']"
      @click="toggleTimeLine"
    ></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit, Watch } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import moment from 'moment'

@Component({
  name: 't-header'
})
export default class tHeader extends Vue {
  @State patientInfo
  @State patidList
  @State yljgdm

  @Emit('toggleTimeLine')
  toggleTimeLine(): void {
    this.showTime = !this.showTime
  }

  @Watch('patientInfo')
  patientChange(newVal) {
    this.getTag()
  }

  mounted() {
    this.getTag()
  }

  private showTime: boolean = false // 是否展示时间轴
  private isolation: boolean = false // 是否隔离
  private isRH: boolean = false // 是否RH血
  private hasOps: boolean = false // 是否RH血

  /**
   * @name: getIconName
   * @test: test font
   * @msg: 根据患者性别，出生日期，入院日期，返回图片类名
   * @param {void}
   * @return: void
   */
  get getIconName(): string {
    const xbdm = this.patientInfo.brxxkJz.xbdm
    const birthday = this.patientInfo.brxxkJz.birth
    const hospitalTime = this.patientInfo.jzkssj
    if (!birthday || !hospitalTime) {
      if (xbdm === '2') {
        return 'icon-women'
      } else {
        return 'icon-man'
      }
    }
    const birthMomentObj = moment(birthday)
    const hospitalMomentObj = moment(hospitalTime)
    // 两个时间相差年数
    const ageDiff = moment.duration(hospitalMomentObj.diff(birthMomentObj))
    if (ageDiff.seconds() < 0) {
      if (xbdm === '2') {
        return 'icon-women'
      } else {
        return 'icon-man'
      }
    } else {
      const ageDiffYear = ageDiff.years()
      if (ageDiffYear >= 80) {
        if (xbdm === '2') {
          return 'icon-old-women'
        } else {
          return 'icon-old-man'
        }
      } else if (ageDiffYear <= 7) {
        if (xbdm === '2') {
          return 'icon-girl'
        } else {
          return 'icon-boy'
        }
      } else {
        if (xbdm === '2') {
          return 'icon-women'
        } else {
          return 'icon-man'
        }
      }
    }
  }

  /**
   * @name: nursingLevel
   * @test: test font
   * @msg: 护理级别
   * @param {void}
   * @return: void
   */
  get nursingLevel(): string {
    let hljbmc = this.patientInfo.hljbmc
    if (hljbmc == null) {
      return ''
    } else {
      if (hljbmc.indexOf('特') > -1) {
        return '特级护理'
      } else if (
        hljbmc.indexOf('一') > -1 ||
        hljbmc.indexOf('1') > -1 ||
        hljbmc.indexOf('Ⅰ') > -1 ||
        hljbmc.indexOf('I') > -1
      ) {
        return 'Ⅰ级护理'
      } else if (
        hljbmc.indexOf('二') > -1 ||
        hljbmc.indexOf('2') > -1 ||
        hljbmc.indexOf('Ⅱ') > -1 ||
        hljbmc.indexOf('II') > -1
      ) {
        return 'Ⅱ级护理'
      } else if (
        hljbmc.indexOf('三') > -1 ||
        hljbmc.indexOf('3') > -1 ||
        hljbmc.indexOf('Ⅲ') > -1 ||
        hljbmc.indexOf('III') > -1
      ) {
        return 'Ⅲ级护理'
      } else {
        return ''
      }
    }
  }

  /**
   * @name: getTag
   * @test: test font
   * @msg: 获取所有的标签 隔离，发热，手术，RH
   * @param {void}
   * @return: void
   */
  private getTag(): void {
    this.getIsolation()
    this.getRHxx()
    this.getTodaySsyyjlList()
  }
  // 是否隔离
  private getIsolation(): void {
    this.isolation = false
    const param = {
      yzlb: '1,2,3',
      jzlsh: this.patientInfo.jzlsh,
      jzlb: this.patientInfo.jzlb,
      yexh: this.patientInfo.yexh || 0,
      yljgdm: this.yljgdm,
      xmlx: '1,2,3',
      ksrq: this.$moment().format('YYYY-MM-DD'),
      jsrq: this.$moment()
        .add(1, 'days')
        .format('YYYY-MM-DD')
    }
    this.$api
      .getZyyz(param)
      .then(res => {
        const _res = res.data || []
        this.isolation = _res.some(item => {
          return item.yznr.indexOf('隔离') !== -1
        })
        return
      })
      .catch(err => {})
  }

  // RH
  private getRHxx(): void {
    this.isRH = false
    const param = {
      patidList: this.patidList
    }
    this.$api
      .isRH(param)
      .then(res => {
        const _res = res.data || {}
        this.isRH = _res.isRH || false
        return
      })
      .catch(err => {})
  }

  // 今日手术
  private getTodaySsyyjlList(): void {
    this.hasOps = false
    const param = {
      jzlsh: this.patientInfo.jzlsh,
      yljgdm: this.yljgdm
    }
    this.$api
      .getTodaySsyyjlList(param)
      .then(res => {
        this.hasOps = res.data.length > 0
        return
      })
      .catch(err => {})
  }
}
</script>

<style lang="scss" scoped>
.header {
  @include treat-header-bg;
  background-size: cover;
  box-shadow: 0px 2px 4px rgba(91, 113, 155, 0.5);
  border-radius: 0 4px 4px 4px;
  @include puhui-m;
  color: #fff;
  .bold {
    font-size: 20px !important;
    font-weight: 900;
  }
  .patient {
    width: 30px;
    height: 50px;
    background: url('../../../assets/images/patient.png') center no-repeat;
    background-size: 100%;
  }
  .sjz_xz {
    width: 50px;
    height: 50px;
    background-size: 100%;
  }
  .sjz_down {
    background: url('../../../assets/images/sjz_down.png') center no-repeat;
  }
  .sjz_up {
    background: url('../../../assets/images/sjz_up.png') center no-repeat;
  }
}
.header span {
  padding: 0 20px;
}
</style>
