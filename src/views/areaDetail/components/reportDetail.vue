<template>
  <div class="report-detail flex flex-v">
    <div>
      <el-table
        :data="tableList"
        style="width: 100%"
        :empty-text="emptyText"
        stripe
        :class="`fs-${fontSize}`"
        @row-click="columnClick"
      >
        <el-table-column label="床位" align="center">
          <template slot-scope="scope">
            <span class="mar bed-no highlight">
              {{ scope.row['rycw'] || '-' }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          v-for="(title, index) in titleList"
          :key="index"
          :label="title.columnName"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row[title.columnCode] || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="查看" align="center">
          <span class="bgdhBtn" @click.stop="toPatientInfo">
            {{ report ? report.bgdh : '-' }}
          </span>
        </el-table-column>
      </el-table>
    </div>

    <div class="detail-content flex-1">
      <span :class="['type-title', `fs-${fontSize + 2}`]">
        {{ reportType === '1' ? '检验' : '检查' }}
      </span>
      <div v-if="reportType === '1' && isWsw">
        <div v-for="(detail, index) in DetailList" :key="index">
          <div :class="['wsw-title', `fs-${fontSize + 2}`]">
            <p>鉴定结果：{{ detail.misxjjgkEntity.xjmc }}</p>
            <p>菌落计数：{{ detail.misxjjgkEntity.jljs }}</p>
            <p>发现方式：{{ detail.misxjjgkEntity.fxfs }}</p>
          </div>
          <el-table
            :data="detail.misymjgkEntityList"
            :empty-text="emptyText"
            :class="`fs-${fontSize}`"
            tripe
          >
            <el-table-column prop="ymmc" label="抗生素" align="center">
            </el-table-column>
            <el-table-column prop="kssjcjg" label="数值" align="center">
            </el-table-column>
            <el-table-column prop="jcjg" label="敏感度" align="center">
            </el-table-column>
            <el-table-column prop="yfjyl" label="剂量及用法" align="center">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <el-table
        v-if="reportType === '1' && !isWsw"
        :data="newDetailList"
        :empty-text="emptyText"
        :class="`fs-${fontSize}`"
        tripe
      >
        <el-table-column label="项目" align="center">
          <template slot-scope="scope">
            <span :style="setTableClass(scope.row)">
              {{ scope.row.jyzbxmmc }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="jyjg" label="结果" align="center">
          <template slot-scope="scope">
            <span :style="setTableClass(scope.row)">
              {{ scope.row.jyjg }}
            </span>
            <span
              :style="setTableClass(scope.row)"
              v-if="scope.row.ycbz === 'H'"
              >↑</span
            >
            <span
              :style="setTableClass(scope.row)"
              v-if="scope.row.ycbz === 'L'"
              >↓</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="jgdw" label="单位" align="center">
        </el-table-column>
        <el-table-column prop="jgckzDx" label="参考值" align="center">
        </el-table-column>
        <el-table-column label="趋势" align="center">
          <template slot-scope="scope">
            <i
              :class="['icon-trend', `fs-${fontSize}`]"
              v-if="isNumeric(scope.row.jyjg)"
              @click="trendEchartShow(scope.row)"
            ></i>
          </template>
        </el-table-column>
      </el-table>
      <div
        :class="['ris-content', `fs-${fontSize + 2}`]"
        v-if="reportType === '2'"
      >
        <div v-for="(jcjg, index) in DetailList" :key="index">
          <div class="zbxmmc">{{ jcjg.zbxmmc }}</div>
          <div
            class="zbjg"
            ref="zbjg"
            v-html="jcjg.oldZbjg ? jcjg.oldZbjg : jcjg.zbjg ? jcjg.zbjg : ''"
          ></div>
        </div>
        <div class="image" v-if="imgUrl" @click="toCheckImg()">影像资料</div>
      </div>
    </div>
    <div class="detail-bottom" v-if="!isWsw && reportType === '1'">
      <el-radio-group v-model="radio" @change="filterDetail">
        <el-radio label="1">全部</el-radio>
        <el-radio label="2">仅看异常值</el-radio>
        <el-radio label="3">仅看危急值</el-radio>
      </el-radio-group>
    </div>
    <el-dialog title="检验趋势图" :visible.sync="showChart" width="70%">
      <div id="trendChart"></div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import { assayEchartOption } from '../../../libs/common'
import echarts from 'echarts'

@Component({
  name: 'reportDetail'
})
export default class reportDetail extends Vue {
  @State yljgdm
  @State associationAreaCode
  @State associationOfficeCode
  @State sizeMultiple
  @State customConfig
  @State fontSize
  @State colorConfig
  @State theme

  @Action getPatientInfo

  @Prop(Object)
  report!: any

  @Prop(String)
  moduleCode!: string

  @Prop(String)
  reportType!: string

  private emptyText: string = '暂无数据' //无数据提示语

  private tableList: object[] = [] //表格数据
  private titleList: object[] = [] //标题数据
  private DetailList: any[] = [] //报告详情
  private newDetailList: object[] = [] //报告详情
  private isWsw: boolean = false //是否是微生物报告
  private radio: string = '1' //类型筛选 1：全部 2：异常值 3：危急值
  private patids: string = '' // patids
  private showChart: boolean = false // echart弹框
  private trendChart: any = null // echart
  private imgUrl: string = ''

  @Watch('report')
  onChangeValue(newVla: boolean): void {
    this.tableList = []
    // this.titleList = []
    this.DetailList = []
    this.newDetailList = []
    if (this.report == null) {
      this.isWsw = false
    } else {
      this.isWsw = this.report.wswbgbz === '1'
      this.getReportDetailList()
      this.getReportDetail()
      this.getPatids()
    }
  }

  mounted() {
    if (this.report && Object.keys(this.report).length > 0) {
      this.isWsw = this.report.wswbgbz === '1'
      this.getReportDetailList()
      this.getReportDetail()
      this.getPatids()
    }
  }

  columnClick(row): void {
    const params = {
      patid: row.patid,
      jzlb: row.jzlb,
      yljgdm: this.yljgdm,
      jzlsh: row.jzlsh,
      yexh: row.yexh || 0
    }
    this.getPatientInfo(params)
      .then(() => {
        this.$router.push('/treatInfo')
        return
      })
      .catch(err => {})
  }

  //跳转患者详情
  private toPatientInfo(): void {
    let bglbmc: string = ''
    if (this.reportType === '1') {
      bglbmc = this.report.bglbmc + this.report.bblx
    } else {
      bglbmc = this.report.bglbmc
    }
    const param = {
      bglbmc: bglbmc,
      bgdh: this.report.bgdh
    }
    const params = {
      patid: this.report.zyjzdjk.patid,
      jzlb: this.report.jzlb,
      yljgdm: this.report.yljgdm,
      jzlsh: this.report.zyjzdjk.jzlsh,
      yexh: this.report.yexh || 0
    }
    this.getPatientInfo(params)
      .then(() => {
        if (this.reportType === '1') {
          this.$router.push({
            path: '/treatInfo/examinationReports',
            query: param
          })
        } else {
          this.$router.push({
            path: '/treatInfo/inspectionReports',
            query: param
          })
        }

        return
      })
      .catch(err => {})
  }

  /**
   * @name: getDetailList
   * @test: test font
   * @msg: 获取数据列表
   * @return: void
   */
  private getReportDetailList(): void {
    if (this.report == null || this.report.zyjzdjk == null) {
      this.tableList = []
      // this.titleList = []
      return
    }
    const params = {
      jzlsh: this.report.zyjzdjk.jzlsh,
      moduleCode: this.moduleCode,
      cwdm: this.report.zyjzdjk.rycw || this.report.zyjzdjk.cycw,
      cwys: this.report.zyjzdjk.jzysmc,
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm
    }
    this.$api
      .handleReport(params)
      .then(res => {
        if (res.data) {
          this.tableList = res.data.data
          this.titleList = res.data.columns
        }
        return
      })
      .catch(err => {})
  }

  private setTableClass(row): object {
    // 判断是否危急值
    if (row.wjzbz === '1') {
      return {
        color: '#E73A36'
      }
    }
    if (row.ycbz === 'L') {
      return {
        color: this.colorConfig.low
      }
    } else if (row.ycbz === 'H') {
      return {
        color: this.colorConfig.high
      }
    } else if (row.ycbz === 'P') {
      return {
        color: this.colorConfig.seriously
      }
    } else {
      return {}
    }
  }

  //跳转影像资料
  private toCheckImg(): void {
    if (this.imgUrl !== '') {
      // 如果配置了 iepath 那么调用ie程序
      const ieConfig = this.customConfig.find(item => {
        return item.code === 'IEPath'
      })
      if (ieConfig == null || !ieConfig.enable) {
        window.open(this.imgUrl)
      } else {
        if (ieConfig.value === '') {
          this.$message({
            message: 'IE路径未设置',
            type: 'error'
          })
        } else {
          this.imgUrl = `openIE://${ieConfig.value},${this.imgUrl}`
          window.location.href = this.imgUrl
        }
      }
    }
  }

  private getReportDetail(): void {
    this.emptyText = ' '
    if (this.report == null) {
      this.emptyText = '暂无数据'
      this.DetailList = []
      return
    }
    const params = {
      bgdh: this.report.bgdh,
      bglbdm: this.report.bglbdm,
      jzlb: '2',
      yljgdm: this.report.yljgdm,
      yexh: this.report.yexh,
      sysId: this.report.sysId
    }
    if (this.reportType === '1' && this.isWsw) {
      this.$api
        .getMisxjjgkList(params)
        .then(res => {
          this.emptyText = '暂无数据'
          if (res.data) {
            this.DetailList = res.data || []
          }
          return
        })
        .catch(err => {
          this.emptyText = '页面无响应'
          this.$message({
            message: err.message,
            type: 'error'
          })
        })
    } else if (this.reportType === '1' && !this.isWsw) {
      this.$api
        .getLisyjjgkEntities(params)
        .then(res => {
          this.emptyText = '暂无数据'
          if (res.data) {
            this.DetailList = res.data
            this.filterDetail(this.radio)
          }
          return
        })
        .catch(err => {
          this.emptyText = '页面无响应'
          this.$message({
            message: err.message,
            type: 'error'
          })
        })
    } else if (this.reportType === '2') {
      let param = {
        resourceUrlCode: this.report.bglbdm,
        attachPara: JSON.stringify({
          bgdh: this.report.bgdh,
          sysId: this.report.sysId
        }),
        jzlb: '2',
        yljgdm: this.report.yljgdm,
        jzlsh: this.report.zyjzdjk.jzlsh,
        isPrint: 0
      }
      this.getResourceUrl(param)
      this.$api
        .getRisjcjgkEntities(params)
        .then(res => {
          this.emptyText = '暂无数据'
          if (res.data) {
            this.DetailList = res.data
            this.$nextTick(() => {
              this.enableCdss()
            })
          }
          return
        })
        .catch(err => {
          this.emptyText = '页面无响应'
          this.$message({
            message: err.message,
            type: 'error'
          })
        })
    }
  }
  // 避免嵌套
  private getResourceUrl(param): void {
    this.$api
      .getResourceUrl(param)
      .then(res => {
        if (Object.keys(res.data).length !== 0) {
          this.imgUrl = res.data.url || ''
        } else {
          this.imgUrl = ''
        }
        return
      })
      .catch(err => {
        console.log(err)
      })
  }

  /**
   * 根据类别筛选
   * @param value
   */
  private filterDetail(value: any): void {
    if (value === '1') {
      this.newDetailList = this.DetailList
    } else if (value === '2') {
      this.newDetailList = this.DetailList.filter((item: any) => {
        return item.ycbz && item.ycbz !== 'NM'
      })
    } else if (value === '3') {
      this.newDetailList = this.DetailList.filter((item: any) => {
        return item.wjzbz && item.wjzbz === '1'
      })
    }
  }

  private trendEchartShow(row: any): void {
    let param = {
      jyzbxmdm: row.jyzbxmdm,
      yexh: '0',
      patidList: this.patids,
      bblx: this.report.bblx,
      bglbdm: row.bglbdm
    }
    this.$api
      .getChartDataOfYjjg(param)
      .then(res => {
        this.showChart = true
        const data = res.data || []
        const option = assayEchartOption(
          data,
          this.sizeMultiple,
          this.fontSize,
          this.theme
        )
        this.$nextTick(() => {
          if (!this.trendChart) {
            this.trendChart = echarts.init(
              document.getElementById('trendChart')
            )
          }
          this.trendChart.setOption(option)
          this.trendChart.dispatchAction({
            type: 'showTip',
            seriesIndex: 0 //第几条series
          })
        })
        return
      })
      .catch(err => {})
  }

  private getPatids(): void {
    const params = {
      patid: this.report.patid,
      jzlb: '2',
      yljgdm: this.yljgdm
    }
    this.$api
      .getPatidList(params)
      .then(res => {
        if (res.data) {
          this.patids = res.data
        }
        return
      })
      .catch(err => {})
  }
  //判断是否是定量数据
  private isNumeric(jyjg: any): boolean {
    let pattern = /(-?\d*)\.?\d+/
    return pattern.test(jyjg)
  }

  //处理知识库链接字体
  enableCdss() {
    const arr: any = this.$refs.zbjg
    if (arr) {
      for (let i = 0; i < arr.length; i++) {
        const childNode = arr[i].childNodes
        for (let k = 0; k < childNode.length; k++) {
          const node = childNode[k]
          if (node.tagName) {
            node.style.fontSize = 'inherit'
            node.style.fontWeight = 'normal'
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.report-detail {
  height: 100%;
  overflow: hidden;
  .detail-content {
    overflow-y: auto;
    margin-top: 15px;
    padding-left: 25px;
    .ris-content {
      .zbjg {
        @include el-menu-font-color;
        padding-left: 60px;
        padding-right: 45px;
        background: rgba(158, 200, 245, 0.1);
        min-height: 40px;
      }

      .zbxmmc {
        padding-left: 60px;
        margin-top: 16px;
        @include remark-title-font-color;
        margin-bottom: 8px;
      }
      .image {
        @include el-menu-font-color;
        margin-left: 60px;
        text-decoration: underline;
        margin-top: 16px;
      }
    }
    .el-table {
      width: 100%;
      margin-top: 16px;
    }
    .type-title {
      @include el-menu-font-color;
      border-left: 5px solid #3871e1;
      margin-left: 25px;
      padding-left: 8px;
    }
    .wsw-title {
      @include el-menu-font-color;
      margin-left: 40px;
      margin-top: 5px;
    }
  }
  .detail-bottom {
    padding-top: 10px;
    margin-left: 25px;
    margin-bottom: 10px;
  }
  #trendChart {
    width: 100%;
    height: 500px;
  }

  .bgdhBtn {
    @include remark-title-font-color;
    text-decoration: underline;
  }
  .bed-no {
    position: relative;
    display: inline-block;
    min-width: 0.3125rem;
    height: 0.14583rem;
    line-height: 0.14583rem;
    text-align: center;
    font-size: 0.10938rem;
    padding: 0 0.03125rem;
    @include home-font-color;
    @include bed-no-unfocus;
    -webkit-box-shadow: 0 0 5px rgba(30, 60, 114, 0.3);
    box-shadow: 0 0 5px rgba(30, 60, 114, 0.3);
    border-radius: 4px;
    margin: 1px;
  }
}
</style>
