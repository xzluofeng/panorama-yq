/*
 * @Descripttion: 电子白板相关api
 * @version:
 * @Author: wangqi
 * @Date: 2019-07-17 15:28:15
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-15 15:31:27
 */

import { post } from '../libs/axios'

export default {
  /**
   * @name: getChartData
   * @test:
   * @msg: 饼图数据（患者分组）
   * @param {type}
   * @return:
   */
  getChartData(data: object, showLoading: boolean = true) {
    return post('/pa/api/index/chart', data, showLoading)
  },

  /**
   * @name: getLineData
   * @test:
   * @msg: 柱状图数据（病区概况）
   * @param {type}
   * @return:
   */
  getLineData(data: object, showLoading: boolean = true) {
    return post('/pa/api/index/line', data, showLoading)
  },

  /**
   * @name: getListData
   * @test: test font
   * @msg: 获取集中展示区域数据
   * @param {type}
   * @return:
   */
  getListData(data: object, showLoading: boolean = true) {
    return post('/pa/api/index/list', data, showLoading)
  },

  /**
   * @name: getMainData
   * @test: test font
   * @msg: 获取重点展示区域数据
   * @param {type}
   * @return:
   */
  getMainData(data: object, showLoading: boolean = true) {
    return post('/pa/api/index/main', data, showLoading)
  },
  getAreaConfig(
    areaCode: string,
    bqdm: string,
    ksdm: string,
    yljgdm: string,
    showLoading: boolean = true
  ) {
    return post(
      '/pa/api/dept/getAreaConfig',
      {
        areaCode: areaCode,
        bqdm: bqdm,
        ksdm: ksdm,
        yljgdm: yljgdm
      },
      showLoading
    )
  }
}
