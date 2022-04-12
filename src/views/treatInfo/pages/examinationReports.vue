<!--
 * @Descripttion: 检验报告
 * @version:
 * @Author: wangqi
 * @Date: 2019-08-02 09:27:18
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-02 09:40:16
 -->
<template>
  <div
    :class="['examition-reports', 'flex', { 'flex-reverse': rightHandType }]"
  >
    <!--左边 菜单 -->
    <div :class="['title-list', `fs-${fontSize + 2}`]">
      <div class="card-list">
        <div class="card" v-for="(card, index) in inspectList" :key="index">
          <div class="group-title">
            {{ card.title }}
          </div>
          <div
            class="inspect-time"
            v-for="(inspect, num) in card.inspect"
            :key="num"
            :class="{ active: activedInspectBtn === index + '+' + num }"
            @click="getContent(inspect, index, num)"
          >
            {{
              currentOrderOption === 'time'
                ? inspect.bglbmc + '&nbsp;' + inspect.bblx
                : inspect.bgfbsj.substring(0, 16)
            }}
          </div>
        </div>
      </div>
      <div
        class="no-data empty flex flex-pack-center"
        v-if="!inspectList.length"
      >
        <span :class="`fs-${fontSize}`"> {{ emptyText }}</span>
      </div>
      <div class="sort-rule">
        <span>排列：</span>
        <el-select
          v-model="currentOrderOption"
          popper-class="select-class"
          placeholder="请选择"
          @change="getLisreportList"
          size="mini"
        >
          <el-option
            v-for="item in orderOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <!--右边 检验内容-->
    <div
      :class="[
        'content',
        'flex-1',
        { 'mr-10': rightHandType },
        `fs-${fontSize + 2}`
      ]"
    >
      <div :class="['out', 'flex-1', `fs-${fontSize + 2}`]">
        <!--非抗生素table-->
        <el-table
          v-show="!isMicrobe"
          :data="inspectResultList"
          :empty-text="emptyText"
          style="width: 100%"
          height="100%"
          :class="`fs-${fontSize}`"
        >
          <el-table-column label="项目">
            <template slot-scope="scope">
              <span class="dangerous" v-show="scope.row.wjzbz === '1'"></span>
              <span :style="getColorStyle(scope.row)">{{
                scope.row.jyzbxmmc
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="结果" :width="300 * sizeMultiple">
            <template slot-scope="scope">
              <span :style="getColorStyle(scope.row)">
                {{ scope.row.jyjg }}
              </span>
              <span
                :style="getColorStyle(scope.row)"
                v-if="scope.row.ycbz === 'H'"
                >↑</span
              >
              <span
                :style="getColorStyle(scope.row)"
                v-if="scope.row.ycbz === 'L'"
                >↓</span
              >
            </template>
          </el-table-column>
          <el-table-column label="单位" :width="300 * sizeMultiple">
            <template slot-scope="scope">
              <span>
                {{ scope.row.jgdw }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="参考值" :width="300 * sizeMultiple">
            <template slot-scope="scope">
              <span>
                {{ scope.row.jgckzDx }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="趋势" :width="150 * sizeMultiple">
            <template slot-scope="scope">
              <i
                :class="['icon-trend', `fs-${fontSize}`]"
                v-if="isNumeric(scope.row.jyjg)"
                @click="trendEchartShow(scope.row)"
              ></i>
            </template>
          </el-table-column>
        </el-table>
        <!--抗生素table-->
        <el-table
          v-show="isMicrobe"
          :data="inspectResultList"
          :empty-text="emptyText"
          style="width: 100%"
        >
          <el-table-column
            prop="ymmc"
            label="抗生素"
            :width="330 * sizeMultiple"
          >
          </el-table-column>
          <el-table-column
            prop="yjhzj"
            label="数值"
            :width="300 * sizeMultiple"
          >
          </el-table-column>
          <el-table-column
            prop="jcjg"
            label="敏感度"
            :width="300 * sizeMultiple"
          >
          </el-table-column>
          <el-table-column prop="yfjyl" label="剂量及用法"> </el-table-column>
        </el-table>
      </div>
      <!--上一个、下一个按钮-->
      <div class="btn">
        <span
          :class="isFirst ? 'first' : ''"
          class="up"
          @click="changeInspect('up')"
          >上一个</span
        >
        <span
          :class="isLast ? 'last' : ''"
          class="next"
          @click="changeInspect('next')"
          >下一个</span
        >
      </div>
    </div>
    <el-dialog title="检验趋势图" :visible.sync="showChart" width="70%">
      <div id="trendChart"></div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State } from 'vuex-class'
import { assayEchartOption } from '../../../libs/common'
import echarts from 'echarts'

@Component({
  name: 'examitionReports'
})
export default class examitionReports extends Vue {
  @State yljgdm
  @State associationAreaCode
  @State associationOfficeCode
  @State patientInfo
  @State sizeMultiple
  @State patidList
  @State rightHandType
  @State colorConfig
  @State fontSize
  @State theme

  private inspectList: any[] = [] //检验列表
  private activedInspectBtn: string = '0+0' //激活的选项卡
  private inspectResultList: object[] = [] //检验结果列表
  private isMicrobe: boolean = false //是否是微生物
  private bblx: string = '' // 标本类型 用于echart请求
  private emptyText: string = ''
  private showChart: boolean = false // echart弹框
  private trendChart: any = null // echart
  private orderOptions: object[] = [] // 排序条件
  private timeOrderOption: any = { value: 'time', label: '按日期排' } // 时间排序条件
  private currentOrderOption: string = '' // 当前选中的排序条件
  private lisreportList: any[] = [] // 检验报告列表

  @Watch('patientInfo')
  changePatient(newVal) {
    this.inspectResultList = []
    this.inspectList = []
    this.getInspectList()
  }

  mounted() {
    this.getInspectList()
  }

  beforeDestroy() {
    if (!this.trendChart) {
      return
    }
    this.trendChart.dispose()
    this.trendChart = null
  }

  get isFirst(): boolean {
    if (this.inspectList.length) {
      let firstBtn = '0+0'
      return this.activedInspectBtn === firstBtn
    }
    return true
  }

  get isLast(): boolean {
    if (this.inspectList.length) {
      2
      let lastBtn =
        this.inspectList.length -
        1 +
        '+' +
        (this.inspectList[this.inspectList.length - 1].inspect.length - 1)
      return this.activedInspectBtn === lastBtn
    }
    return true
  }

  //趋势图点击事件
  private trendEchartShow(row: any): void {
    let param = {
      jyzbxmdm: row.jyzbxmdm,
      yexh: this.patientInfo.yexh,
      patidList: this.patidList,
      bblx: this.bblx,
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

  //获取检验列表
  private getInspectList(): void {
    this.emptyText = ' '
    let param = {
      patidList: this.patidList,
      yexh: this.patientInfo.yexh,
      jzlsh: this.patientInfo.jzlsh,
      jzlb: this.patientInfo.jzlb,
      yljgdm: this.patientInfo.yljgdm
    }
    this.$api
      .getLisreport(param)
      .then(res => {
        this.emptyText = '暂无数据'
        this.inspectList = []
        let map = {}
        const _res = res.data || {}
        const _arr = _res.reportList || []
        if (_arr.length) {
          // let data = _arr[0].lisreportEntityList || []
          this.lisreportList = _arr[0].lisreportEntityList || []
        } else {
          this.lisreportList = []
        }
        const typeList = _res.typeList || []
        this.initOrderOptions(typeList)
        this.getLisreportList()
        return
      })
      .catch(err => {
        this.emptyText = '页面无响应'
        console.log(err)
      })
  }

  // 获取危机，异常高低样式
  private getColorStyle(rowData: any): object {
    let fontColor = {}
    // 判断是否危急值
    if (rowData.wjzbz === '1') {
      return {
        color: '#E73A36'
      }
    }
    // 没有危急值  异常
    if (rowData.ycbz === 'L') {
      fontColor = {
        color: this.colorConfig.low
      }
    } else if (rowData.ycbz === 'H') {
      fontColor = {
        color: this.colorConfig.high
      }
    } else if (rowData.ycbz === 'P') {
      fontColor = {
        color: this.colorConfig.seriously
      }
    }
    return fontColor
  }

  // 获取检验结果列表
  private getContent(inspect: any, titleIndex: any, index: any) {
    this.emptyText = ' '
    this.activedInspectBtn = titleIndex + '+' + index
    this.bblx = inspect.bblx
    let param = {
      bgdh: inspect.bgdh,
      bglbdm: inspect.bglbdm,
      jzlb: inspect.jzlb,
      yljgdm: inspect.yljgdm,
      yexh: inspect.yexh,
      sysId: inspect.sysId
    }
    if (inspect.wswbgbz === '1') {
      this.isMicrobe = true
      this.$api
        .getMisxjjgkList(param)
        .then(res => {
          const _res = res.data || []
          this.emptyText = '暂无数据'
          if (_res.length) {
            this.inspectResultList = _res[0].misymjgkEntityList || []
          }
          return
        })
        .catch(err => {
          this.emptyText = '页面无响应'
          console.log(err)
        })
    } else {
      this.isMicrobe = false
      this.$api
        .getLisyjjgkEntities(param)
        .then(res => {
          this.emptyText = '暂无数据'
          this.inspectResultList = res.data || []
          return
        })
        .catch(err => {
          this.emptyText = '页面无响应'
          console.log(err)
        })
    }
  }

  //判断是否是定量数据
  private isNumeric(jyjg: any): boolean {
    let pattern = /(-?\d*)\.?\d+/
    return pattern.test(jyjg)
  }

  //上一个，下一个按钮事件
  private changeInspect(ev: string): void {
    let arr: any[] = []
    arr = this.activedInspectBtn.split('+')
    let titleIndex: number = parseInt(arr[0])
    let index: number = parseInt(arr[1])
    if (ev === 'up') {
      if (index === 0) {
        if (titleIndex !== 0) {
          const newTitleIndex: any = titleIndex - 1
          const bl = this.inspectList[newTitleIndex].inspect[
            this.inspectList[newTitleIndex].inspect.length - 1
          ]
          index = this.inspectList[newTitleIndex].inspect.length - 1
          this.getContent(bl, newTitleIndex, index)
        }
      } else {
        const bl = this.inspectList[titleIndex].inspect[index - 1]
        index = index - 1
        this.getContent(bl, titleIndex, index)
      }
    } else if (ev === 'next') {
      if (index === this.inspectList[titleIndex].inspect.length - 1) {
        if (titleIndex !== this.inspectList.length - 1) {
          titleIndex = titleIndex + 1
          let bl = this.inspectList[titleIndex].inspect[0]
          this.getContent(bl, titleIndex, 0)
        }
      } else {
        let bl = this.inspectList[titleIndex].inspect[index + 1]
        this.getContent(bl, titleIndex, index + 1)
      }
    }
  }

  // 初始化排序条件
  private initOrderOptions(typeList: any[]) {
    this.orderOptions = []
    this.orderOptions.push(this.timeOrderOption)
    for (let type of typeList) {
      this.orderOptions.push({ value: type.bglbdm, label: type.bglbmc })
    }
    this.currentOrderOption = this.timeOrderOption.value
  }

  // 获取分组后的检验列表
  private getLisreportList() {
    this.inspectList = []
    if (this.lisreportList.length) {
      // 按报告发布时间倒序排序
      let sortedLisreportList = this.lisreportList.sort(function(
        a: any,
        b: any
      ): number {
        return a.bgfbsj > b.bgfbsj ? -1 : 1
      })
      // 如果不是按时间排，则按报告类别代码筛选
      if (this.currentOrderOption !== 'time') {
        sortedLisreportList = sortedLisreportList.filter(
          item => item.bglbdm === this.currentOrderOption
        )
      }
      let item: any = {} // 分组后的结果
      for (let report of sortedLisreportList) {
        if (this.currentOrderOption === 'time' && !report.bgfbsj) {
          continue
        }
        let title: string =
          this.currentOrderOption === 'time'
            ? report.bgfbsj.substring(0, 10)
            : report.bglbmc + ' ' + report.bblx
        // 初始化
        if (!item[title]) {
          item[title] = { title: title, reportList: [] }
        }
        item[title].reportList.push(report)
      }
      // 将分组后的结果组装成数据
      for (let key of Object.keys(item)) {
        this.inspectList.push({ title: key, inspect: item[key].reportList })
      }
      this.showReportDetail()
    }
  }

  // 展示报告详情
  private showReportDetail() {
    if (this.$route.query.bgdh && this.$route.query.bglbmc) {
      const titleIndex = this.inspectList.findIndex(item => {
        return item.inspect.find(inspect => {
          return (
            inspect.bglbmc + inspect.bblx === this.$route.query.bglbmc &&
            inspect.bgdh === this.$route.query.bgdh
          )
        })
      })
      if (titleIndex === -1) {
        //默认加载第一个
        this.getContent(this.inspectList[0].inspect[0], 0, 0)
      } else {
        const index = this.inspectList[titleIndex].inspect.findIndex(item => {
          return item.bgdh === this.$route.query.bgdh
        })
        if (index === -1) {
          //默认加载第一个
          this.getContent(this.inspectList[0].inspect[0], 0, 0)
        } else {
          this.getContent(
            this.inspectList[titleIndex].inspect[index],
            titleIndex,
            index
          )
        }
      }
    } else {
      //默认加载第一个
      this.getContent(this.inspectList[0].inspect[0], 0, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.examition-reports {
  position: relative;
  overflow-y: auto;
  padding-bottom: 2px;
  height: 100%;

  .title-list {
    height: 100%;
    width: 250px;
    @include home-content-bg;
    overflow-y: auto;
    border-radius: 0 4px 4px 4px;
    box-shadow: 0 2px 4px rgba(30, 60, 114, 0.4);
    .card-list {
      width: 250px;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 50px;
      overflow-y: scroll;
    }
    .card {
      margin-top: 24px;
      .group-title {
        margin-left: 10px;
        @include el-table-title-font-color;
      }
      .inspect-time {
        padding-left: 20px;
        margin-top: 10px;
        @include el-menu-font-color;
      }
      .active {
        @include treat-menu-bg-color;
        color: #fff !important;
      }
    }
    .sort-rule {
      position: absolute;
      left: 15px;
      bottom: 0;
      @include title-s-font-color;
      font-size: 15px;
      line-height: 36px;
      bottom: 5px;
      .el-select {
        width: 112px;
      }
    }
  }

  .content {
    position: relative;
    height: 100%;
    overflow-y: auto;
    border-radius: 0 4px 4px 4px;
    box-shadow: 0 2px 4px rgba(30, 60, 114, 0.4);
    @include home-content-bg;
    padding-bottom: 50px;
    .out {
      height: 100%;
      overflow-y: auto;
      .el-table {
        font-size: 20px;
      }
    }
    .btn {
      position: absolute;
      bottom: 20px;
      right: 20px;
      text-decoration: underline;
      @include el-menu-font-color;
      .first,
      .last {
        @include a-not-active-color;
        text-decoration: underline;
      }

      .up {
        margin-right: 46px;
      }
    }
  }
  .empty {
    margin-top: 50px;
  }
  #trendChart {
    width: 100%;
    height: 500px;
  }
}
</style>
