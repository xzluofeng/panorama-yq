<template>
  <!-- 检查 -->
  <div class="inspection-box">
    <div
      v-for="(item, index) in inspectionList"
      :key="index"
      class="inspection-item"
      @click="toDetailPage(item)"
    >
      <div class="inspection-info flex flex-align-center">
        <p :class="['title', 'flex-1', `fs-${fontSize + 2}`]">
          {{ item.bglbmc }}
        </p>
        <p :class="['time', `fs-${fontSize}`]">
          {{ item.bgfbsj ? item.bgfbsj.substr(5, 11) : '-' }}
        </p>
      </div>
      <!-- 异常结果 -->
      <div :class="['unusual', { purple: item.unusual }, `fs-${fontSize}`]">
        <span class="name">{{ item.jcjg }}</span>
        <span :class="['icon', `fs-${fontSize}`]" v-if="item.unusual"></span>
      </div>
    </div>
    <p class="no-data" v-if="!inspectionList.length">{{ emptyText }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State } from 'vuex-class'
@Component({
  name: 'homeInspection'
})
export default class homeInspection extends Vue {
  @State associationAreaCode
  @State associationOfficeCode
  @State patidList
  @State yljgdm
  @State patientInfo
  @State fontSize

  private inspectionList: any[] = [] // 检查数据
  private emptyText: string = '' //无数据显示内容

  @Watch('patientInfo')
  changePatient(newVal) {
    this.emptyText = ''
    this.inspectionList = []
    this.getInspection()
  }

  mounted() {
    this.getInspection()
  }

  /**
   * @name: getExamine
   * @test: test font
   * @msg: 获取24小时内的检查
   * @param {void}
   * @return: void
   */
  private getInspection(): void {
    this.emptyText = ''
    let params = {
      patidList: this.patidList,
      jzlsh: this.patientInfo.jzlsh,
      jzlb: this.patientInfo.jzlb,
      yljgdm: this.yljgdm,
      yexh: this.patientInfo.yexh
    }
    this.$api
      .getRisreport(params)
      .then(res => {
        this.emptyText = '暂无数据'
        const _res = res.data || {}
        if (_res.reportList && _res.reportList.length) {
          const reportList = _res.reportList[0].risreports || []
          this.inspectionList = reportList
        } else {
          this.inspectionList = []
        }
        return
      })
      .catch(err => {
        this.emptyText = '页面无响应'
        console.log(err)
      })
  }

  /**
   * @name: toDetailPage
   * @msg: 跳转检查报告详情页面
   * @param {void}
   * @return: void
   */
  private toDetailPage(report: any): void {
    this.$router.push({
      name: 'menuInspectionReports',
      query: {
        bglbmc: report.bglbmc,
        bgdh: report.bgdh
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.inspection-box {
  height: 100%;
  overflow-y: auto;
  padding: 0 15px;
  @include puhui-m;
  .inspection-item {
    @include el-table-solid-border;
    padding-left: 10px;
    cursor: pointer;
  }

  .inspection-info {
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
    @include el-table-title-font-color;
    text-align: center;
  }

  .name {
    margin-right: 10px;
  }
  .no-data {
    margin-bottom: 5px;
  }
  .unusual {
    width: 100%;
    @include el-menu-font-color;
    margin-bottom: 5px;
  }
  .purple {
    color: #cc2bff;
  }
  .icon {
    display: inline-block;
    width: 24px;
    height: 24px;
    background-image: url('../../../assets/images/icon-inspect-unusual.png');
    background-size: contain;
    background-repeat: no-repeat;
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
}
</style>
