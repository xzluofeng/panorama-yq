/*
 * @Descripttion: 相同处理事件提取
 * @version:
 * @Author: wangqi
 * @Date: 2019-07-16 13:27:16
 * @LastEditors: wangqi
 * @LastEditTime: 2019-07-31 15:01:10
 */
import { Message } from 'element-ui'
/**
 * @name: assayEchartOption
 * @test: test font
 * @msg: 检验趋势图option
 * @param data 检验结果数据
 * @param sizeMultiple 基于2k倍数
 * @return:
 */
export const assayEchartOption = (
  data: any[],
  s: number,
  fontSize: number,
  theme: string
) => {
  if (!data || data.length === 0) {
    Message({
      message: '没有数据',
      type: 'warning'
    })
    return
  }
  const option: any = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'tranparent',
      formatter: function(parameters) {
        var axisValue = parameters[0].axisValue
        var res = ''
        var toolBg =
          theme === 'blue' ? '#333' : theme === 'dark' ? '#102D60' : '#333'
        for (var i = 0; i < data.length; i++) {
          if (axisValue === data[i].bgfbrq.substring(0, 16)) {
            var labelColor = '#1fadfd'
            var normalColor =
              theme === 'blue' ? '#333' : theme === 'dark' ? '#fff' : '#333'
            if (data[i].jyjg < data[0].jgckzLower) {
              labelColor = '#FF5A5A'
            }
            if (data[i].jyjg > data[0].jgckzUpper) {
              labelColor = '#FF5A5A'
            }
            res =
              '<p><span class="chart-tip-title fs-' +
              fontSize +
              '" style="color: ' +
              normalColor +
              '">报告类别：</span><span class="chart-tip-value fs-' +
              fontSize +
              '" style="color: ' +
              normalColor +
              '">' +
              data[i].bglbmc +
              '</span></p>' +
              '<p><span class="chart-tip-title fs-' +
              fontSize +
              '" style="color: ' +
              normalColor +
              '">标本类型：</span><span class="chart-tip-value fs-' +
              fontSize +
              '" style="color: ' +
              normalColor +
              '">' +
              data[i].bblx +
              '</span></p>' +
              '<p><span class="chart-tip-title fs-' +
              fontSize +
              '" style="color: ' +
              normalColor +
              '">检验项目：</span><span class="chart-tip-value fs-' +
              fontSize +
              '" style="color: ' +
              normalColor +
              '">' +
              data[i].jyzbxmmc +
              '</span></p>' +
              '<p><span class="chart-tip-title fs-' +
              fontSize +
              '" style="color: ' +
              normalColor +
              '">检验结果：</span><span style="font-size:' +
              fontSize +
              'px;font-weight:600;color:' +
              labelColor +
              ';">' +
              data[i].jyjg +
              '(' +
              data[0].jgdw +
              ')</span></p>' +
              '<p><span class="chart-tip-title fs-' +
              fontSize +
              '" style="color: ' +
              normalColor +
              '">&nbsp;&nbsp;&nbsp;参考值：</span><span class="chart-tip-value fs-' +
              fontSize +
              '" style="color: ' +
              normalColor +
              '">' +
              data[i].jgckzDx +
              '</span></p>' +
              '<p><span class="chart-tip-title fs-' +
              fontSize +
              '" style="color: ' +
              normalColor +
              '">检验日期：</span><span class="chart-tip-value fs-' +
              fontSize +
              '" style="color: ' +
              normalColor +
              '">' +
              data[i].bgfbrq
                .substring(0, 16)
                .split('-')
                .join('/') +
              '</span></p>'
            break
          }
        }
        return (
          '<div class="chart-tip" style="background:' +
          toolBg +
          '">' +
          res +
          '</div>'
        )
      }
    },
    grid: {
      top: 30 * s,
      bottom: 30 * s,
      left: 75 * s,
      right: 60 * s
    },
    xAxis: {
      axisLine: {
        show: false
      },
      axisLabel: {
        textStyle: {
          color: theme === 'blue' ? '#333' : theme === 'dark' ? '#fff' : '#333',
          fontSize: (fontSize - 4) * s,
          fontWeight: 'bold'
        },
        margin: 10 * s
      },
      type: 'category',
      boundaryGap: false,
      axisTick: {
        show: false
      },
      data: [],
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: 'rgba(140, 160, 179,0.25)'
        }
      }
    },
    yAxis: {
      axisLine: {
        show: false
      },
      type: 'value',
      axisLabel: {
        textStyle: {
          color:
            theme === 'blue'
              ? '#0040C9'
              : theme === 'dark'
              ? '#F0FBFF'
              : '#0040C9',
          fontSize: fontSize * s
        },
        margin: 30 * s
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: 'rgba(140, 160, 179,0.25)'
        }
      }
    },
    series: [
      {
        symbol: 'circle',
        symbolSize: 10 * s,
        showAllSymbol: true,
        itemStyle: {
          normal: {
            color:
              theme === 'blue'
                ? '#0040C9'
                : theme === 'dark'
                ? '#20A0FF'
                : '#0040C9'
          }
        },
        lineStyle: {
          normal: {
            color:
              theme === 'blue'
                ? '#0040C9'
                : theme === 'dark'
                ? '#20A0FF'
                : '#0040C9'
          }
        },
        type: 'line',
        data: [],
        label: {
          normal: {
            show: true,
            position: 'top'
          }
        },
        markLine: {
          symbol: ['', ''],
          data: [
            {
              name: '下限',
              yAxis: 0,
              symbol: '',
              lineStyle: {
                normal: {
                  color: '#01cd80'
                }
              },
              label: {
                textStyle: {
                  fontSize: fontSize * s
                }
              }
            },
            {
              name: '上限',
              yAxis: 100,
              symbol: '',
              lineStyle: {
                normal: {
                  color: '#ff4e4e'
                }
              },
              label: {
                textStyle: {
                  fontSize: fontSize * s
                }
              }
            }
          ]
        }
      }
    ]
  }
  let xAxisData: any[] = []
  let yAxisData: any[] = []
  let max = Math.ceil(data[0].jgckzUpper) || 0
  let min = Math.floor(data[0].jgckzLower) || 0
  if (isNaN(max)) {
    max = 0
  }
  if (isNaN(min)) {
    min = 0
  }
  let lateJgckzLower = Math.floor(data[data.length - 1].jgckzLower)
  let lateJgckzUpper = Math.ceil(data[data.length - 1].jgckzUpper)
  for (var i = 0; i < data.length; i++) {
    var symbol = ''
    xAxisData[i] = data[i].bgfbrq.substring(0, 16)
    var labelColor =
      theme === 'blue' ? '#0040C9' : theme === 'dark' ? '#20A0FF' : '#0040C9'
    if (Math.floor(data[i].jyjg) < lateJgckzLower) {
      labelColor = '#FF5A5A'
    }
    if (Math.ceil(data[i].jyjg) > lateJgckzUpper) {
      labelColor = '#FF5A5A'
    }

    if (
      Math.floor(data[i].jgckzLower) === lateJgckzLower &&
      Math.ceil(data[i].jgckzUpper) === lateJgckzUpper
    ) {
      //和最近一次的参考值比较，如果都一样，就用实心圆形，否则用空心圆
      symbol = 'circle' //实心圆形
    } else {
      symbol = 'emptyCircle' //空心圆
    }
    yAxisData[i] = {
      value: data[i].jyjg,
      symbol: symbol,
      label: {
        normal: {
          show: true,
          position: 'top',
          fontSize: fontSize * s,
          color: labelColor
        }
      },
      itemStyle: {
        normal: {
          fontSize: fontSize * s,
          color: labelColor
        }
      }
    }
    if (Math.ceil(data[i].jyjg) > max) {
      max = Math.ceil(data[i].jyjg)
    }
    if (Math.floor(data[i].jyjg) < min) {
      min = Math.floor(data[i].jyjg)
    }
  }
  option.xAxis.data = xAxisData
  option.series[0].data = yAxisData
  option.series[0].markLine.data[0].yAxis = data[0].jgckzLower
  option.series[0].markLine.data[1].yAxis = data[0].jgckzUpper
  option.yAxis.max = max
  option.yAxis.min = min
  return option
}
