<template>
  <!-- 体征模块 -->
  <ul class="sign-box">
    <li class="sign-tw flex flex-align-center">
      <span class="icon-tw"></span>
      <span class="line"></span>
      <span
        :class="[
          'value',
          'flex-1',
          `fs-${fontSize}`,
          { red: parseFloat(signTw.value) > 38.5 }
        ]"
      >
        {{ signTw.value || '-' }}
      </span>
      <span :class="['time', `fs-${fontSize - 2}`]">{{ signTw.time }}</span>
    </li>
    <li class="sign-hx flex flex-align-center">
      <span class="icon-hx"></span>
      <span class="line"></span>
      <span :class="['value', 'flex-1', `fs-${fontSize}`]">
        {{ signHx.value || '-' }}
      </span>
      <span :class="['time', `fs-${fontSize - 2}`]">{{ signHx.time }}</span>
    </li>
    <li class="sign-mb flex flex-align-center">
      <span class="icon-mb"></span>
      <span class="line"></span>
      <span :class="['value', 'flex-1', `fs-${fontSize}`]">
        {{ signMb.value || '-' }}
      </span>
      <span :class="['time', `fs-${fontSize - 2}`]">{{ signMb.time }}</span>
    </li>
    <!--<li class="sign-hyl flex flex-align-center">-->
    <!--<span class="icon-hyl"></span>-->
    <!--<span class="line"></span>-->
    <!--<span :class="['value', 'flex-1', `fs-${fontSize}`]">-->
    <!--{{ signHyl.value || '-' }}-->
    <!--</span>-->
    <!--<span :class="['time', `fs-${fontSize - 2}`]">{{ signHyl.time }}</span>-->
    <!--</li>-->
    <li class="sign-xy flex flex-align-center">
      <span class="icon-xy"></span>
      <span class="line"></span>
      <span :class="['value', 'flex-1', `fs-${fontSize}`]">
        {{ `${signXy.szy || '-'} / ${signXy.ssy || '-'} ${signXy.tzdw}` }}
      </span>
      <span :class="['time', `fs-${fontSize - 2}`]">{{ signXy.time }}</span>
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State } from 'vuex-class'
@Component({
  name: 'homeSign'
})
export default class homeSign extends Vue {
  @State associationAreaCode
  @State associationOfficeCode
  @State yljgdm
  @State patientInfo
  @State fontSize

  private signTw: any = {} // 体温 - 体温
  private signHx: any = {} // 体温 - 呼吸
  private signMb: any = {} // 体温 - 脉搏
  private signHyl: any = {} // 体温 - 含氧量
  private signXy: any = {
    ssy: '',
    szy: '',
    tzdw: '',
    time: ''
  } // 体温 - 血压

  @Watch('patientInfo')
  changePatient(newVal) {
    this.signTw = {}
    this.signHx = {}
    this.signMb = {}
    this.signHyl = {}
    this.signHyl = {
      ssy: '',
      szy: '',
      tzdw: '',
      time: ''
    }
    this.getSignData()
  }

  mounted() {
    this.getSignData()
  }

  /**
   * @name: getSignData
   * @test: test font
   * @msg: 获取最近一次的体征数据
   * @param {void}
   * @return: void
   */
  private getSignData() {
    const formData = {
      jzlsh: this.patientInfo.jzlsh,
      jzlb: this.patientInfo.jzlb,
      yljgdm: this.yljgdm,
      yexh: this.patientInfo.yexh,
      start: '0',
      size: '6'
    }
    this.$api
      .getTzjlByJzlshByPage(formData)
      .then(res => {
        const _res = res.data || []
        _res.forEach(item => {
          switch (item.tzdm) {
            // 体温 gw 肛温 kb 口表 yb 腋表 ew 耳温
            case 'tw':
            case 'gw':
            case 'kb':
            case 'yb':
            case 'ew':
              this.signTw = {
                value: `${item.tzvalueText} ${item.tzdw}`,
                time: item.lrrq.substr(5, 11)
              }
              break
            // 呼吸
            case 'hx':
              this.signHx = {
                value: `${item.tzvalueText} ${item.tzdw}`,
                time: item.lrrq.substr(5, 11)
              }
              break
            // 脉搏
            case 'mb':
              this.signMb = {
                value: `${item.tzvalueText} ${item.tzdw}`,
                time: item.lrrq.substr(5, 11)
              }
              break
            // 血氧饱和度
            case 'xybhd':
              this.signHyl = {
                value: `${item.tzvalueText} ${item.tzdw}`,
                time: item.lrrq.substr(5, 11)
              }
              break
            // 血压 收缩压
            case 'xy_ssy':
              this.signXy.ssy = item.tzvalueText
              this.signXy.tzdw = item.tzdw
              this.signXy.time = item.lrrq.substr(5, 11)
              break
            // 血压 舒张压
            case 'xy_szy':
              this.signXy.szy = item.tzvalueText
              this.signXy.tzdw = item.tzdw
              this.signXy.time = item.lrrq.substr(5, 11)
              break
          }
        })
        return
      })
      .catch(err => {
        this.signTw = {}
        this.signHx = {}
        this.signMb = {}
        this.signHyl = {}
        this.signHyl = {
          ssy: '',
          szy: '',
          tzdw: '',
          time: ''
        }
        console.log(err)
      })
  }
}
</script>

<style lang="scss" scoped>
.sign-box {
  width: 100%;
  height: 100%;
  @include puhui-m;
  overflow-y: auto;
  .icon-tw,
  .icon-hx,
  .icon-mb,
  .icon-hyl,
  .icon-xy {
    width: 25px;
    height: 25px;
    background-size: contain;
    background-repeat: no-repeat;
    margin-left: 25px;
  }
  .icon-tw {
    background-image: url('../../../assets/images/icon-tw.png');
  }
  .icon-hx {
    background-image: url('../../../assets/images/icon-hx.png');
  }
  .icon-mb {
    background-image: url('../../../assets/images/icon-mb.png');
  }
  .icon-hyl {
    background-image: url('../../../assets/images/icon-hyl.png');
  }
  .icon-xy {
    background-image: url('../../../assets/images/icon-xy.png');
  }

  .line {
    width: 1px;
    height: 25px;
    background: linear-gradient(#f2f4fc, #a4acf3, #f2f4fc);
    margin-left: 25px;
    margin-right: 20px;
  }
  li {
    height: 45px;
    @include el-table-solid-border;
  }
  .value {
    @include el-menu-font-color;
    font-size: 18px;
  }
  .time {
    width: 140px;
    text-align: center;
    font-size: 16px;
    @include el-table-title-font-color;
  }
  .red {
    color: #e73828;
  }
}
</style>
