<!--
 * @Descripttion: 左上部，分组统计以及病区概况
 * @version:
 * @Author: wangqi
 * @Date: 2019-08-01 14:29:29
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-15 17:12:07
 -->
<template>
  <v-touch
    class="touch-area flex-1"
    @swipeup="swipeUp"
    @swipedown="swipeDown"
    @swipeleft="swipeLeft"
    @swiperight="swipeRight"
  >
    <el-row class="group-container">
      <el-col class="left" :span="12">
        <div class="type-title flex flex-align-cneter">
          <span
            v-for="(item, index) in allCircleData"
            :key="index"
            :class="{ active: index === showCircleIndex }"
            @click="showCircleIndex = index"
          >
            {{ item.name }}
          </span>
          <span v-if="!allCircleData.length" class="no-data">
            {{ noDataTip }}
          </span>
        </div>
        <div id="type-echart" ref="typeChart" @click="toDetail(1)"></div>
      </el-col>
      <span class="line"></span>
      <el-col class="right" :span="12">
        <div id="line-echart" ref="lineChart"></div>
        <span v-if="!allLineData.length" class="no-data">
          {{ noLineTip }}
        </span>
      </el-col>
    </el-row>
  </v-touch>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State, Mutation } from 'vuex-class'
import echart from 'echarts'
@Component({
  name: 'group'
})
export default class group extends Vue {
  @State sizeMultiple
  @State updateData
  @State yljgdm
  @State associationAreaCode
  @State associationOfficeCode
  @State isScrolling
  @State theme

  @Mutation SET_AREA_SURVEY_DATA
  @Mutation SET_DATA_FLUSH_TIME

  private typeChart: any = null // 左边echart容器
  private lineChart: any = null // 右边echart容器
  private allCircleData: any[] = [] // 分组ehcart数据
  private showCircleIndex: number = 0 // 圆形图展示数据index
  private allLineData: any[] = [] // 病区概况柱状图数据
  private showLineIndex: number = 1 // 柱状图展示数据index
  private totalNum: number = 0 // 病区总病人数
  private lineGrounpNum: number = 0 // 病区概况组数（6个一组）
  private noDataTip: string = '' // 没有数据提示语
  private noLineTip: string = '' // 没有数据提示语
  private update: boolean = false // 第一次updateData不请求
  private animateTimer: any = null // 动画容器

  @Watch('updateData')
  onChangeValue(newVal: any): void {
    if (this.update) {
      if (newVal.showLoading) {
        this.noDataTip = ''
        this.noLineTip = ''
        this.typeChart.dispose()
        this.lineChart.dispose()
        this.allCircleData = []
        this.allLineData = []
        this.typeChart = echart.init(this.$refs.typeChart)
        this.lineChart = echart.init(this.$refs.lineChart)
      }
      this.getGrounpData(newVal.showLoading)
      this.getLineData(newVal.showLoading)
    }
    this.update = true
  }

  @Watch('theme')
  handSkinChange(newVal) {
    this.typeChart.setOption(this.typeOption)
    this.lineChart.setOption(this.lineOption)
  }

  @Watch('showCircleIndex')
  changeCircleData(newVal: number): void {
    this.typeChart.setOption(this.typeOption)
  }

  @Watch('showLineIndex')
  changeLineData(newVal: number): void {
    this.lineChart.setOption(this.lineOption)
  }

  get nameColor(): string {
    if (this.theme === 'blue') {
      return '#656D81'
    } else if (this.theme === 'dark') {
      return '#FFFFFF'
    }
    return '#656D81'
  }

  get valueColor(): string {
    if (this.theme === 'blue') {
      return '#18285C'
    } else if (this.theme === 'dark') {
      return '#FFFFFF'
    }
    return '#18285C'
  }
  /**
   * @name: typeOption
   * @test: test font
   * @msg: 分组echart的option
   * @param {void}
   * @return: object
   */
  get typeOption(): object {
    // 渐变数组
    const colorArr: any[] = [
      { startColor: '#4B64FF', endColor: '#2737DB' },
      { startColor: '#1CDAFF', endColor: '#00B1FF' },
      { startColor: '#4FFF93', endColor: '#16DD53' },
      { startColor: '#FFC092', endColor: '#FF8E56' },
      { startColor: '#FF85AC', endColor: '#FF3F6D' }
    ]
    const targetArr: object[] = []
    let totalNum: number = 0
    this.echartData.forEach((item, index) => {
      totalNum += item.num * 1
      let obj: any = { ...item }
      if (obj.name === '') obj.name = '--'
      obj.value = obj.num
      obj.itemStyle = {
        normal: {
          color: {
            colorStops: [
              {
                offset: 0,
                color: colorArr[index].startColor // 0% 处的颜色
              },
              {
                offset: 1,
                color: colorArr[index].endColor // 100% 处的颜色
              }
            ]
          }
        }
      }
      targetArr.push(obj)
    })
    this.totalNum = totalNum
    let option = {
      backgroundColor: 'transparent',
      title: {
        text: [`{num|${this.totalNum}}`, '{text|总人数}'].join('\n'),
        x: 170 * this.sizeMultiple,
        y: '48%',
        textAlign: 'center',
        textStyle: {
          fontWeight: 'normal',
          color: '#0E346E',
          rich: {
            num: {
              fontWeight: 'normal',
              fontFamily: 'puhui-r',
              color: '#0E346E',
              fontSize: 55 * this.sizeMultiple
            },
            text: {
              fontWeight: 'normal',
              color: '#656D81',
              fontSize: 16 * this.sizeMultiple
            }
          }
        }
      },
      legend: {
        show: true,
        orient: 'vertical',
        icon: 'circle',
        right: 6 * this.sizeMultiple,
        y: 'center',
        itemGap: 25 * this.sizeMultiple,
        itemWidth: 14 * this.sizeMultiple,
        itemHeight: 14 * this.sizeMultiple,
        selectedMode: false,
        formatter: (name: string) => {
          const itemObj: any = targetArr.find((item: any) => {
            return name === item.name
          })
          if (itemObj) {
            return `{name|${
              name.length > 5 ? name.slice(0, 5) + '...' : name
            }}  {value|(${itemObj.num})}`
          } else {
            return `{name|${name.length > 5 ? name.slice(0, 5) + '...' : name}}`
          }
        },
        textStyle: {
          rich: {
            name: {
              fontWeight: 'normal',
              color: this.nameColor,
              fontSize: 20 * this.sizeMultiple
            },
            value: {
              fontWeight: 'normal',
              color: this.valueColor,
              fontSize: 22 * this.sizeMultiple
            }
          }
        }
      },
      series: [
        {
          name: '大内环',
          type: 'pie',
          silent: true,
          clockWise: true,
          hoverAnimation: false,
          animationType: 'scale',
          radius: '40%',
          center: [176 * this.sizeMultiple, '58%'],
          label: {
            normal: {
              position: 'center'
            }
          },
          data: [
            {
              value: 100,
              itemStyle: {
                normal: {
                  color: {
                    colorStops: [
                      {
                        offset: 0,
                        color: '#fff' // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: '#fff' // 100% 处的颜色
                      }
                    ]
                  },
                  borderWidth: 2 * this.sizeMultiple,
                  shadowBlur: 5
                  // shadowColor: '#e5eaf5'
                }
              }
            }
          ]
        },
        {
          name: '小内环',
          type: 'pie',
          silent: true,
          clockWise: true,
          hoverAnimation: false,
          animationType: 'scale',
          radius: ['33%', '34%'],
          center: [176 * this.sizeMultiple, '58%'],
          label: {
            normal: {
              position: 'center'
            }
          },
          data: [
            {
              value: 100,
              itemStyle: {
                normal: {
                  color: {
                    colorStops: [
                      {
                        offset: 0,
                        color: '#ECEFF5' // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: '#ECEFF5' // 100% 处的颜色
                      }
                    ]
                  }
                }
              }
            }
          ]
        },
        {
          name: '内环',
          type: 'pie',
          silent: true,
          clockWise: true,
          hoverAnimation: false,
          animationType: 'scale',
          radius: ['40%', '41%'],
          center: [176 * this.sizeMultiple, '58%'],
          label: {
            normal: {
              position: 'center'
            }
          },
          data: [
            {
              value: 100,
              itemStyle: {
                normal: {
                  color: {
                    colorStops: [
                      {
                        offset: 0,
                        color: '#ECEFF5' // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: '#ECEFF5' // 100% 处的颜色
                      }
                    ]
                  }
                }
              }
            }
          ]
        },
        {
          name: '',
          type: 'pie',
          radius: ['50%', '80%'],
          center: [176 * this.sizeMultiple, '58%'],
          data: targetArr,
          startAngle: 120,
          roseType: 'radius',
          label: {
            show: false
          },
          labelLine: {
            show: false
          }
        }
      ]
    }
    return option
  }

  /**
   * @name: lineOption
   * @test: test font
   * @msg: 概况条形图option
   * @param {void}
   * @return: object
   */
  get lineOption(): object {
    const colorArr: any[] = [
      { startColor: '#FFD79F', endColor: '#F67E6C' },
      { startColor: '#4BDEC4', endColor: '#22D45E' },
      { startColor: '#00C5FF', endColor: '#0072FF' }
    ]
    const yAxisData: any = []
    // 内bar数据
    const seriesInData: any = []

    let maxValue = 0
    // 组装echart所需数据
    this.lineData.forEach((item, index) => {
      yAxisData.push(item.name)
      // 两组数字一个颜色
      const colorIndex = Math.floor(index / 2)
      if (item.value > maxValue) {
        maxValue = item.value
      }
      seriesInData.push({
        name: item.name,
        value: item.value,
        itemStyle: {
          normal: {
            barBorderRadius: 30,
            color: {
              colorStops: [
                {
                  offset: 0,
                  color: colorArr[colorIndex].startColor // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: colorArr[colorIndex].endColor // 100% 处的颜色
                }
              ]
            }
          }
        }
      })
    })
    // 外bar数据
    let outMax = 5 * Math.ceil(maxValue / 5)
    if (outMax === maxValue) {
      outMax += 5
    }
    const seriesOutData: number[] = new Array(this.lineData.length).fill(outMax)
    let option: object = {
      grid: {
        top: 60 * this.sizeMultiple,
        left: 80 * this.sizeMultiple,
        right: 80 * this.sizeMultiple,
        bottom: 40 * this.sizeMultiple,
        containLabel: true
      },
      xAxis: {
        show: true, //是否显示x轴
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        position: 'top',
        axisLabel: {
          formatter: '{value}人',
          color: '#D0D3D9',
          fontSize: 16 * this.sizeMultiple
        },
        splitLine: {
          lineStyle: {
            color: '#E3E8F2',
            type: 'dashed'
          }
        }
      },
      yAxis: {
        type: 'category',
        inverse: true,
        offset: 20,
        axisLabel: {
          show: true,
          textStyle: {
            color: this.nameColor,
            fontSize: 18 * this.sizeMultiple
          }
        },
        splitLine: { show: false }, //横向的线
        axisTick: { show: false }, //y轴的端点
        axisLine: { show: false }, //y轴的线
        data: yAxisData
      },
      series: [
        {
          name: '数据内框',
          type: 'bar',
          barWidth: 12 * this.sizeMultiple,
          data: seriesInData,
          label: {
            normal: {
              show: true,
              formatter: '{c}人',
              position: 'right',
              fontSize: 18 * this.sizeMultiple,
              color: '#18285C',
              distance: 0,
              padding: [
                10 * this.sizeMultiple,
                15 * this.sizeMultiple,
                5 * this.sizeMultiple,
                25 * this.sizeMultiple
              ],
              backgroundColor: {
                image:
                  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAAeCAYAAACIeIa4AAAAAXNSR0IArs4c6QAABRdJREFUWAndmE2II0UUx+uj0+kkk4kzY+swRsG9iIwXTwsqMqjsUU+uIMIiuHhwL+KC4sFh9qAeFjx5UhRF9uJJb+5BFpRVTyKSg5dRljisxmzMZPLV6ary/aunYieT2Tkl2ZmCTqqr6+P96r16Va84OyIZY/h4la2trQNl43Vm8b65uWnGx+GcD8sOFTIN5WAqlQqv1daHbVqtnWF+fJBpvheLa0OAMKyY9fV1+56GBeRE4cbBrl1jAiDNZlbE5RaP+21qV7by6wj52SXhF/bBqszLFoxXLZpSqa8BvLHB9AjgJLEcHDQGsFqNieZiU5Z2q7K/4AsdF7hWkX0mtZ92mZC+sY/XNtm9SDcXy6q0W1JhyHQacOKsAy4N1gh2vLzX9np7gRf4WsaRkUbHXAe+bY/8tIHQPxee1ZroRQZ5z+eqFwkVLPTiTlyIl3prcRrQu51Q1hQXCzKv296Xn1564qEH77sohbzbsMScnYZv18c0vjmnwRk3Sqt/fvv9z8vPv/zO92RdJmi1aQLW7LCHwsF5NJuropStyiZb9AAmhAi10VxbD8qZ0ZPX7DSA0n1ywQjAMEFOAzJBNrKqH0usqpv9VU2ya6pvDsA5k4RX7IUVoaMlmR10PcFFiG/a0HRpeghyJraYptrPa2VIeSSGYAycsKasjLx+zo/jsDX06CNwzswSl8/EQAaCKSW5n/EYkWhAQVvQHCAnDDybomRkmmQGQHh9ElOIOEeevMFZljH4DAvnoCAYCre3l0Q7jESxO5As0rITKQ91HJghsNlAHDYK5hcy4EdYUuX3SBEoS7YotBzRnPOQ9WIkC7W812R9j/smIznPWHMkQEeVnpDDRJhW+f8OhfDIksiOSKw806pnxUsOF2uEDROj5MCqubpcvKVkS/xLtqj8586cXrl+9fJb6AQV56+1yVPmtqP0oWKoObfOOsGS1Jmclxl0M1c+e/upRx6+/wIToqTV/BzIZJyjSy0ctAbv2H+gzpduKPHSK0+vnD/3zBsLhdyTSmsxrjWn7aO7n2+NoeYgRtxt8bMvPl54/bVnPyFXuIw9jXwRmeLx0xp4yJGOpkKe3D8jv3MC0giclyuaKx//0Prgw6/Pt9qd7xKvRO6WNpLjyGrhECYgLsreuGkaQaw/+uKb+umNC1u//PrHe0ybJhd0ICE6cpcW8rjADjWHgC8M13X+nqxaGHTjgVGDF869++2blz5/9VZj9/pxAUpbGJ09E5OD9jYo2Ct3V9TuslRFfdcgZjL66upP9cfOXHx/XHvpTu6E/DAcGgazYw7FAa60fNUOOzHipCwzA2XMQJBJuokADPLzetxk2qVCSyaRq8MQwOKbu4awZumExAcAnjrV0IVaW7e6wgaD0vdiW4c6sqfU/bWH+vNJEMNNtuUhGwt0AlcdijSyzwEAGzTWH10tUGxU0X6UU5zWIFwJtKftD9rj0DqfZEeG5dBkW4uiAEVKOkLRtQPuVSAVlDQCh8J9QFapnDXVn1d1NntTUbAa04ZeQ2CI+MmGGTiWzilYFbAgksMtFUTjfeXHpb1dzerLJny0YgEPwAEQCdrb3t7Rf/llFei/Y4Ty7poBk4Y6yWkcudkmKAAnp/Q1A/xDU5TVvVFbu6u+Q+EgLhZmr8ZUI2hz3FEglL+zL4hKqhiWrNYg/8Rl4w7GLgw6cVd7IEdygCfmUhZQTnsOEP9JzHfMr9MB4lIa0pVBmy4/z3+4+/HxE2eTlP4HTgM0C51xOdMAAAAASUVORK5CYII='
              }
            }
          }
        },
        {
          name: '外框',
          type: 'bar',
          itemStyle: {
            normal: {
              barBorderRadius: 30,
              color: '#D6DEE8' //rgba设置透明度0.14
            }
          },
          barGap: '-80%',
          z: 0,
          barWidth: 8 * this.sizeMultiple,
          data: seriesOutData
        }
      ]
    }
    return option
  }

  /**
   * @name: echartData
   * @test: test font
   * @msg: 根据激活showEchartIndex 返回echart数据
   * @param {void}
   * @return: object
   */
  get echartData(): any[] {
    // name 只有这个'其它',没有'其他'
    if (!this.allCircleData.length) {
      return []
    } else {
      const target = this.allCircleData[this.showCircleIndex].subList.sort(
        function(a, b) {
          return b.num - a.num
        }
      )
      if (target.length < 6) {
        const otherObj = target.find(item => {
          return item.name === '其它'
        })
        if (otherObj != null) {
          const _arr = target.filter(item => {
            return item.name !== '其它'
          })
          _arr.push(otherObj)
          return _arr
        }
        return target
      } else {
        const _arr: any[] = []
        let other = {
          name: '其它',
          num: 0
        }
        let SHOW_LENGTH = 4
        target.forEach((item, index) => {
          if (index < SHOW_LENGTH) {
            if (item.name === '其它') {
              SHOW_LENGTH++
              other.num += item.num * 1
            } else {
              _arr.push(item)
            }
          } else {
            other.num += item.num * 1
          }
        })
        _arr.push(other)
        return _arr
      }
    }
  }

  /**
   * @name: lineData
   * @test: test font
   * @msg: 根据激活showLineIndex 返回echart数据
   * @param {void}
   * @return: object
   */
  get lineData(): any[] {
    if (!this.allLineData.length) {
      return []
    } else {
      this.lineGrounpNum = Math.ceil(this.allLineData.length / 6)
      const startIndex = 6 * (this.showLineIndex - 1)
      const endIndex = 6 * this.showLineIndex
      const target = this.allLineData.slice(startIndex, endIndex)
      return target
    }
  }
  mounted() {
    this.typeChart = echart.init(this.$refs.typeChart)
    this.lineChart = echart.init(this.$refs.lineChart)
    this.getGrounpData(true)
    this.getLineData(true)
    // 30秒自动切换一次数据
    this.animateTimer = setInterval(() => {
      this.swipeUp()
    }, 30000)
    // // 单击事件处理
    // const _this = this;
    // this.lineChart.on('click', function(params) {
    //   _this.toDetail(2, params.name)
    // })
  }
  beforeDestroy() {
    if (!this.typeChart) {
      return
    }
    this.typeChart.dispose()
    this.lineChart.dispose()
    this.typeChart = null
    this.lineChart = null
    if (this.animateTimer) {
      clearInterval(this.animateTimer)
    }
  }

  /**
   * @name: swipeUp
   * @test: test font
   * @msg: 向上滑动
   * @param {void}
   * @return:void
   */
  private swipeUp(): void {
    this.showCircleIndex += 1
    if (this.showCircleIndex >= this.allCircleData.length) {
      this.showCircleIndex = 0
    }
    this.showLineIndex += 1
    if (this.showLineIndex >= this.lineGrounpNum + 1) {
      this.showLineIndex = 1
    }
  }

  /**
   * @name: swipeDown
   * @test: test font
   * @msg: 向下滑动
   * @param {void}
   * @return:void
   */
  private swipeDown(): void {
    this.showCircleIndex -= 1
    if (this.showCircleIndex <= -1) {
      this.showCircleIndex = this.allCircleData.length - 1
    }
    this.showLineIndex -= 1
    if (this.showLineIndex <= 0) {
      this.showLineIndex = this.lineGrounpNum
    }
  }

  /**
   * @name: swipeLeft
   * @test: test font
   * @msg: 向左滑动
   * @param {void}
   * @return:void
   */
  private swipeLeft(): void {
    this.showCircleIndex -= 1
    if (this.showCircleIndex <= -1) {
      this.showCircleIndex = this.allCircleData.length - 1
    }
  }

  /**
   * @name: swipeRight
   * @test: test font
   * @msg: 向右滑动
   * @param {void}
   * @return:void
   */
  private swipeRight(): void {
    this.showCircleIndex += 1
    if (this.showCircleIndex >= this.allCircleData.length) {
      this.showCircleIndex = 0
    }
  }

  /**
   * @name: getGrounpData
   * @test: test font
   * @msg: 左边饼图数据（患者分组）
   * @param {void}
   * @return: void
   */
  private getGrounpData(showLoading: boolean): void {
    this.noDataTip = ''
    const params = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm
    }
    this.$api
      .getChartData(params, showLoading)
      .then(res => {
        // 设置数据刷新时间
        const dataFlushTime: string = res.time
        this.SET_DATA_FLUSH_TIME(dataFlushTime)

        this.noDataTip = '暂无数据'
        const _res = res.data || []
        if (_res.length) {
          this.allCircleData = _res.slice(0, 3) || []
          setTimeout(() => {
            this.typeChart.setOption(this.typeOption)
            window.addEventListener('resize', () => {
              this.typeChart.resize()
            })
          }, 300)
        }
        return
      })
      .catch(err => {
        this.noDataTip = '页面无响应'
      })
  }

  /**
   * @name: getLineData
   * @test: test font
   * @msg: 获取病区概况输数据
   * @param {void}
   * @return: void
   */
  private getLineData(showLoading: boolean): void {
    this.noLineTip = ''
    const params = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm
    }
    this.$api
      .getLineData(params, showLoading)
      .then(res => {
        this.noLineTip = '暂无数据'
        const _res = res.data || []
        this.SET_AREA_SURVEY_DATA(_res)
        const lineData: any[] = []
        _res.forEach(item => {
          lineData.push({
            name: item.name,
            value: item.num * 1
          })
        })
        this.allLineData = lineData
        setTimeout(() => {
          this.lineChart.setOption(this.lineOption)
          window.addEventListener('resize', () => {
            this.lineChart.resize()
          })
        }, 300)
        return
      })
      .catch(err => {
        this.noLineTip = '页面无响应'
      })
  }

  /**
   * @name: toDetail
   * @test: test font
   * @msg: 跳转二级页面
   * @param {type} 区分那里点击
   * @return: void
   */
  private toDetail(type, groupName): void {
    let param: any = {
      isJy: '0',
      jyzbxmdm: ''
    }
    if (type === 1) {
      param = {
        moduleName: '患者分组',
        groupName: this.allCircleData[this.showCircleIndex].name,
        bedNo: ''
      }
    } else {
      param = {
        moduleName: '病区概况',
        groupName: groupName,
        bedNo: ''
      }
    }
    this.$router.push({
      path: '/areaDetail',
      query: param
    })
  }
}
</script>

<style lang="scss" scoped>
.touch-area {
  margin-bottom: 15px;
}
.group-container {
  @include home-content-bg;
  position: relative;
  height: 380px;
  border-radius: 4px;
  height: 100%;
  .left,
  .right {
    position: relative;
    height: 100%;
  }

  .left {
    padding: 25px;
  }

  .right .no-data {
    position: absolute;
    top: 25px;
    left: 25px;
  }
  .type-title {
    position: absolute;
    top: 15px;
    left: 25px;
    font-size: 22px;
    z-index: 1000;
    @include puhui-r;
    @include home-title-font-color;
    span {
      padding: 4px 10px;
      text-align: center;
      &.active {
        @include home-title-border-color;
      }
    }
  }

  #type-echart {
    height: 100%;
  }

  .line {
    position: absolute;
    display: inline-block;
    width: 2px;
    height: 260px;
    @include home-line-border;
    left: 50%;
    bottom: 40px;
  }

  #line-echart {
    height: 100%;
  }
}
</style>
