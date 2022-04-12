<template>
  <div class="temperatureTrend">
    <div class="echart-contianer" ref="echarts" id="myCharts"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'
import echart from 'echarts'
@Component({
  name: 'temperatureTrend',
})
export default class caseHistory extends Vue {
  @State yljgdm
  @State associationAreaCode
  @State associationOfficeCode
  @State patientInfo
  @State sizeMultiple
  @State rightHandType
  @State fontSize

  private searchTableHeight: number = 0
  private searchTableWidth: number = 0
  private reportUrl: string = ''
  private echarts: any = null // 左边echart容器
  // 定义数据容器
  private dateList: any[] = [] //横时间坐标
  private tempatureList: any[] = [] //纵坐标温度坐标

  private widthHeight(): void {
    this.searchTableHeight = window.innerHeight - 180
    this.searchTableWidth = window.innerWidth - 230
  }
  // 调接口数据
  private getTempretureData(): void {
    const formData = {
      userId: 0,
      serviceId: 0,
      jzlsh: this.patientInfo.jzlsh,
      jzlb: this.patientInfo.jzlb,
      yljgdm: this.yljgdm,
      yexh: this.patientInfo.yexh,
      startDate: '1970-01-01',
      endDate: this.$moment(Date.now()).format('YYYY-MM-DD'),
    }
    this.$api
      .getTempretureData(formData)
      .then((res) => {
        if (res.data) {
          const twDataList = res.data.chartTzInfoList.filter((item) => {
            return item.rwCode === 'tw'
          })
          const twTimeDataList: any[] = [] // 拿到后台返回的时间数组
          const twTempetureList: any[] = [] // 拿到后台返回的体温数组
          // const jcrq: String = '' //检查日期数据
          twDataList[0].tzjlTzvalueList.forEach((items) => {
            twTimeDataList.push(`${items.cjrq} ${items.sj}`)
            twTempetureList.push(items.tzvalueText.trim() * 1)
          })
          // 分别拿到时间和体温数据
          this.dateList = twTimeDataList
          this.tempatureList = twTempetureList
          this.initChart() //拿到后台数据后再调用一次刷图
        }
        return
      })
      .catch(() => {
        this.dateList = []
        this.tempatureList = []
      })
  }
  private initChart() {
    var myChart = echart.init(this.$refs.echarts)
    let option = {
      backgroundColor: '#032c74',
      // 标题
      title: {
        text: '患者体温趋势',
        textStyle: {
          fontSize: '16',
          color: '#ccc',
        },
        subtext: '体温',
        x: '7%',
        y: '5px',
      },
      // 提示框
      tooltip: {
        trigger: 'axis',
        // a0系列名，b0数据名，c0数据值
        formatter:
          '<span style="color: #00fff6;">时间</span> : {b0}<br/><span style="color: #00fff6;">{a0}</span> : {c0}℃',
      },
      // x轴
      xAxis: {
        type: 'category',
        name: '时间',
        // 修改轴线尾部name文字颜色
        nameTextStyle: {
          color: '#ccc',
        },
        data: this.dateList,
        // 轴标签格式
        axisLabel: {
          color: '#fff',
          // interval: 30, // 间隔长度，可自定义（如果是时间格式，echarts会自动处理）
          rotate: 40, // 横坐标上label的倾斜度
          textStyle: {
            color: 'white',
            fontFamily: 'sans-serif',
            fontSize: 10,
            fontStyle: 'italic',
          },
        },
        // 轴线样式
        axisLine: {
          lineStyle: {
            color: '#fff',
            width: 1, //这里是为了突出显示加上的
          },
        },
      },
      yAxis: {
        type: 'value',
        min: 35, //最小
        max: 41, //最多
        splitNumber: 5, // 设置y轴刻度间隔个数
        axisLine: {
          //y轴线不显示
          show: false,
        },
        splitLine: {
          //网格线
          lineStyle: {
            type: 'dashed', //设置网格线类型 dotted：虚线   solid:实线
          },
          show: true, //隐藏或显示
        },
        // 轴标签格式
        axisLabel: {
          color: '#fff',
          // formatter定制提示文字格式
          formatter: '{value}℃',
        },
        // 轴刻度线
        axisTick: {
          //y轴刻度线不显示
          show: false,
        },
      },
      //直角坐标系内绘图网格
      grid: {
        bottom: '80', //值越大X轴下方的高度越大
      },
      // 图表类型
      series: [
        {
          name: '体温',
          data: this.tempatureList,
          type: 'line',
          smooth: true,
          // 设置折线颜色
          itemStyle: {
            normal: {
              lineStyle: {
                color: '#fff', // 设置折线颜色
              },
            },
          },
        },
      ],
      // x轴滚动条
      dataZoom: [
        {
          //添加X轴滚动条
          type: 'inside', //直接左右滑动就可以了，slider会有滚动条
          show: true,
          // y: 36,位置
          // height: 20, // 高度大小
          start: 0,
          end: 80,
          handleSize: 12,
        },
      ],
    }
    option && myChart.setOption(option, true)
  }
  created() {
    // 调接口
    this.getTempretureData()
  }
  mounted() {
    window.onresize = () => {
      this.widthHeight() // 自适应高宽度
    }
    this.$nextTick(function () {
      this.widthHeight()
    })

    // echarts相关代码
    this.initChart()
  }
}
</script>

<style lang="scss" scoped>
.echart-contianer {
  width: 90%;
  height: 600px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
</style>
