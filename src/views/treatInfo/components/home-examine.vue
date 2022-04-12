<template>
  <!-- 检验 -->
  <div class="examine-box">
    <div
      v-for="(item, index) in examineList"
      :key="index"
      class="examine-item"
      @click="toDetailPage(item)"
    >
      <div class="examine-info flex flex-align-center">
        <p :class="['title', 'flex-1', `fs-${fontSize + 2}`]">
          {{ item.bglbmc }}
        </p>
        <p :class="['time', `fs-${fontSize}`]">
          {{ item.bgfbsj.substr(5, 11) }}
        </p>
      </div>
      <div
        class="unusual-box flex flex-align-center"
        v-if="item.wjzLisyjjgList && item.wjzLisyjjgList.length"
      >
        <div
          v-for="(unusualItem, unusualIndex) in item.wjzLisyjjgList"
          :key="unusualIndex"
          :style="getColorStyle(unusualItem.ycbz)"
          :class="[
            'unusual',
            { red: unusualItem.wjzbz === '1' },
            `fs-${fontSize}`
          ]"
        >
          <span class="name">
            {{ `${unusualItem.jyzbxmmc}  ${unusualItem.jyjg}` }}
          </span>
          <span v-if="unusualItem.ycbz === 'H'">↑</span>
          <span v-if="unusualItem.ycbz === 'L'">↓</span>
          <span
            :class="['icon', 'icon-danger', `fs-${fontSize}`]"
            v-if="unusualItem.wjzbz === '1'"
          ></span>
          <span
            :class="['icon', 'icon-unusual', `fs-${fontSize}`]"
            v-if="unusualItem.ycbz === 'H' || unusualItem.ycbz === 'L'"
          ></span>
        </div>
      </div>
      <span v-else :class="['no-data', `fs-${fontSize}`]">无异常</span>
    </div>
    <p class="no-data" v-if="!examineList.length">{{ emptyText }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State } from 'vuex-class'
@Component({
  name: 'homeExamine'
})
// 检验 wjzLisyjjgList 异常list  ycbz wjzbz
export default class homeExamine extends Vue {
  @State associationAreaCode
  @State associationOfficeCode
  @State yljgdm
  @State patidList
  @State patientInfo
  @State colorConfig
  @State fontSize

  private examineList: any[] = [] // 检验数据
  private emptyText: string = '' //无数据显示内容

  @Watch('patientInfo')
  changePatient(newVal) {
    this.emptyText = ''
    this.examineList = []
    this.getExamine()
  }

  mounted() {
    this.getExamine()
  }
  /**
   * @name: getExamine
   * @test: test font
   * @msg: 获取24小时内的检验
   * @param {void}
   * @return: void
   */
  private getExamine(): void {
    this.emptyText = ''
    let param = {
      patidList: this.patidList,
      yexh: this.patientInfo.yexh,
      jzlsh: this.patientInfo.jzlsh,
      jzlb: this.patientInfo.jzlb,
      yljgdm: this.yljgdm
    }
    this.$api
      .getLisreport(param)
      .then(res => {
        this.emptyText = '暂无数据'
        let map = {}
        const _res = res.data || {}
        const _arr = _res.reportList || []
        if (_arr.length) {
          let data = _arr[0].lisreportEntityList || []
          this.examineList = data
        }
        return
      })
      .catch(err => {
        this.emptyText = '页面无响应'
        console.log(err)
      })
  }

  /**
   * @name: getColorStyle
   * @msg: 通过异常标志控制字体颜色
   * @param {void}
   * @return: void
   */
  private getColorStyle(ycbz: string) {
    let fontColor = {}
    // 没有危急值  异常
    if (ycbz === 'L') {
      fontColor = {
        color: this.colorConfig.low
      }
    } else if (ycbz === 'H') {
      fontColor = {
        color: this.colorConfig.high
      }
    } else if (ycbz === 'P') {
      fontColor = {
        color: this.colorConfig.seriously
      }
    }
    return fontColor
  }

  /**
   * @name: toDetailPage
   * @msg: 跳转检检验报告详情页面
   * @param {void}
   * @return: void
   */
  private toDetailPage(report: any): void {
    this.$router.push({
      name: 'menuExaminationReports',
      query: {
        bglbmc: report.bglbmc + report.bblx,
        bgdh: report.bgdh
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.examine-box {
  height: 100%;
  overflow-y: auto;
  padding: 0 15px;
  @include puhui-m;
  .examine-item {
    @include el-table-solid-border;
    padding-left: 10px;
    cursor: pointer;
  }

  .examine-info {
    margin-bottom: 5px;
  }

  .title {
    @include el-menu-font-color;
    margin-top: 5px;
    font-weight: 600;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .time {
    width: 150px;
    @include el-table-title-font-color;
    text-align: center;
  }

  .name {
    margin-right: 10px;
  }
  .no-data {
    margin-bottom: 5px;
    @include el-menu-font-color;
  }
  .unusual {
    width: 100%;
    @include el-menu-font-color;
    margin-bottom: 5px;
  }
  .red {
    color: #ff3030;
  }
  .icon {
    display: inline-block;
    width: 24px;
    height: 24px;
    background-size: cover;
    margin-left: 10px;
    vertical-align: sub;
    &.fs-18 {
      width: 24px;
      height: 24px;
    }
    &.fs-20 {
      width: 26px;
      height: 26px;
    }
    &.fs-22 {
      width: 28px;
      height: 28px;
    }
    &.fs-24 {
      width: 30px;
      height: 30px;
    }
    &.fs-26 {
      width: 32px;
      height: 32px;
    }
  }
  .icon-danger {
    background-image: url('../../../assets/images/icon-danger.png');
  }
  .icon-unusual {
    background-image: url('../../../assets/images/icon-unusual.png');
  }
  .unusual-box {
    width: 100%;
    flex-wrap: wrap;
    .unusual {
      width: 100%;
    }
  }
}
</style>
