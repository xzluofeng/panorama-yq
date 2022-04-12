/*
 * @Descripttion: 患者诊疗临床等相关api
 * @version:
 * @Author: wangqi
 * @Date: 2019-07-16 16:02:36
 * @LastEditors: wangqi
 * @LastEditTime: 2019-07-31 14:58:43
 */

import { post } from '../libs/axios'

export default {
  /**
   * @name: getTimeline
   * @test:
   * @msg: 获取就诊时间轴
   * @param {type}
   * @return:
   */
  getTimeline(data: object) {
    return post('/c/api/v1/zyjzdjk/getJzjlsjz', data)
  },

  /**
   * @name: getPatientInfo
   * @test:
   * @msg: 病人信息
   * @param {type}
   * @return:
   */
  getPatientInfo(data: object) {
    return post('/c/api/v1/zyjzdjk/getPatientByJzlsh', data)
  },

  getPatientInfoBYzjhm(data: object) {
    return post('/pa/api/timeNode/getPatientInfoByZjhm', data)
  },

  /**
   * @name: getLcwd
   * @test:
   * @msg: 病历列表
   * @param {type}
   * @return:
   */
  getLcwd(data: object) {
    return post('/c/api/v1/lcwd/getLcwdByPatidListAndJzlsh', data)
  },

  /**
   * @name: getLcwdwdsjEntities
   * @test:
   * @msg: 通过文档标识号获取病历内容
   * @param {type}
   * @return:
   */
  getLcwdwdsjEntities(data: object) {
    return post('/c/api/v1/lcwd/getLcwdwdsjEntitiesByWdbsh', data)
  },

  /**
   * @name: getLcwdwddsjEntities
   * @test:
   * @msg: 病历内容
   * @param {type}
   * @return:
   */
  getLcwdwddsjEntities(data: object) {
    return post('/c/api/v1/lcwd/getLcwdwddsjEntitiesByWdbsh', data)
  },

  /**
   * @name: getTzjl
   * @test:
   * @msg: 体征记录
   * @param {type}
   * @return:
   */
  getTzjl(data: object) {
    return post('/v1/wsj/getTzjlByJzlsh', data)
  },

  /**
   * @name: getZyyz
   * @test:
   * @msg: 住院医嘱
   * @param {type}
   * @return:
   */
  getZyyz(data: object) {
    return post('/c/api/v1/zyyzmxk/getZyyzmxkListYzlbAndXmlx', data)
  },

  /**
   * @name: getLczd
   * @test:
   * @msg: 问题清单
   * @param {type}
   * @return:
   */
  getLczd(data: object) {
    return post('/v1/ppl/getDatasByProc', data)
  },

  /**
   * @name: getBrzdList
   * @test:
   * @msg: 临床诊断
   * @param {type}
   * @return:
   */
  getBrzdList(data: object) {
    return post('/c/api/v1/brzd/getBrzdListByJzlshAndYljgdm', data)
  },

  /**
   * @name: getUnstructList
   * @test:
   * @msg: 护理文书
   * @param {type}
   * @return:
   */
  getUnstructList(data: object) {
    return post('/c/api/v1/unstruct/getUnstructList', data)
  },

  /**
   * @name: getUnstructList
   * @test:
   * @msg: 获取手术列表
   * @param {type}
   * @return:
   */
  getSsjlk(data: object) {
    return post('/c/api/v1/ssjlk/getSsjlkByPatidListAndJzlsh', data)
  },

  /**
   * @name: getLisreport
   * @test:
   * @msg: 检验报告列表
   * @param {type}
   * @return:
   */
  getLisreport(data: object) {
    return post('/c/api/v1/lisreport/getLisreportByPatidListAndJzlsh', data)
  },

  /**
   * @name: getLisyjjgkEntities
   * @test:
   * @msg: 检验报告结果信息,非微生物
   * @param {type}
   * @return:
   */
  getLisyjjgkEntities(data: object) {
    return post('/c/api/v1/lisreport/getLisyjjgkEntitiesByJylb', data)
  },

  /**
   * @name: getMisxjjgkList
   * @test:
   * @msg: 获取微生物报告
   * @param {type}
   * @return:
   */
  getMisxjjgkList(data: object) {
    return post('/c/api/v1/lisreport/getMisxjjgkListByBgdh', data)
  },

  /**
   * @name: getChartDataOfYjjg
   * @test:
   * @msg: 获取患者单个检验指标图表数据
   * @param {type}
   * @return:
   */
  getChartDataOfYjjg(data: object) {
    return post('/c/api/v1/lisreport/getAllChartData', data)
  },

  /**
   * @name: getRisreport
   * @test:
   * @msg: 检查报告列表
   * @param {type}
   * @return:
   */
  getRisreport(data: object) {
    return post('/c/api/v1/risreport/getRisreportByPatidListAndJzlsh', data)
  },

  /**
   * @name: getMedicalListData
   * @test:
   * @msg: 用户病案首页
   * @param {type}
   * @return:
   */
  findByJzlshAndYljgdm(data: object) {
    return post('/c/api/v1/zybasy/findByJzlshAndYljgdm', data)
  },
  getHospitalCustomInfo(data: object) {
    return post('/c/api/v1/zybasy/getHospitalCustomInfo', data)
  },

  /**
   * @name: getRisreport
   * @test:
   * @msg: 检查报告结果信息
   * @param {type}
   * @return:
   */
  getRisjcjgkEntities(data: object) {
    return post('/c/api/v1/risreport/getRisjcjgkEntitiesByBgdh', data)
  },

  /**
   * @name: getYjbgfjList
   * @test:
   * @msg: 检查报告结果信息,查看图片
   * @param {type}
   * @return:
   */
  getYjbgfjList(data: object) {
    return post('/v1/lisreport/getYjbgfjListByBgdh', data)
  },

  /**
   * @name: handleFtpTransform
   * @test:
   * @msg: ftp 转换 http
   * @param {type}
   * @return:
   */
  handleFtpTransform(data: object) {
    return post('/cdrps/ftp/handle', data, true, 'ftpTransformUrl')
  },

  /**
   * @name: getResourceUrl
   * @test:
   * @msg: 检查报告结果信息,获取影像资料路径
   * @param {type}
   * @return:
   */
  getResourceUrl(data: object) {
    return post('/c/api/v1/com/getResourceUrl', data)
  },

  /**
   * @name: getMzcfkListByCflxdm
   * @test:
   * @msg: 获取处方
   * @param {type}
   * @return:
   */
  getMzcfkListByCflxdm(data: object) {
    return post('/c/api/v1/mzcfk/getMzcfkListByCflxdm', data)
  },

  /**
   * @name: getZyyzmxkListYzlbAndYzlx
   * @test:
   * @msg: 获取医嘱
   * @param {type}
   * @return:
   */
  getZyyzmxkListYzlbAndYzlx(data: object) {
    return post('/c/api/v1/zyyzmxk/getZyyzmxkListYzlbAndYzlx', data)
  },

  /**
   * @name: getPatids
   * @test:
   * @msg: 获取patidList
   * @param {type}
   * @return:
   */
  getPatidList(data: object) {
    return post('/c/api/v1/empi/queryPatient', data)
  },

  getPatidListByZjhm(data: object) {
    return post('/pa/api/timeNode/queryPatidListByZjhm', data)
  },

  /**
   * @name: getGmxx
   * @test:
   * @msg: 获取过敏记录
   * @param {type}
   * @return:
   */
  getGmxx(data: object) {
    return post('/v1/gmjl/getZygmxxByPatidListAndJzlsh', data)
  },

  /**
   * @name: getAllSysConfig
   * @test:
   * @msg: 获取内部资源
   * @param {type}
   * @return:
   */
  getAllSysConfig() {
    return post('/v1/token/getAllSysConfig')
  },

  /**
   * @name: getJczbList
   * @test:
   * @msg: 获取心电图报告
   * @param {type}
   * @return:
   */
  getJczbList(data: object) {
    return post('/v1/risreport/getJczbList', data)
  },

  /**
   * @name: getUnstructContent
   * @test:
   * @msg: 获取护理明细
   * @param {type}
   * @return:
   */
  getUnstructContent(data: object) {
    return post('/c/api/v1/unstruct/getUnstructContent', data)
  },

  /**
   * @name: getNewRisReport
   * @test:
   * @msg: 获取当天检验
   * @param {type}
   * @return:
   */
  getNewRisReport(data: object) {
    return post('/v1/wsj/getLisreportByRq', data)
  },

  /**
   * @name: getRisReportByPatid
   * @test:
   * @msg: 获取当天检查
   * @param {type}
   * @return:
   */
  getRisReportByPatid(data: object) {
    return post('/v1/wsj/getRisReportByPatid', data)
  },

  /**
   * @name: getSsjlByJzlsh
   * @test:
   * @msg: 获取当天手术
   * @param {type}
   * @return:
   */
  getSsjlByJzlsh(data: object) {
    return post('/c/api/v1/wsj/getSsjlByJzlsh', data)
  },

  /**
   * @name: getGmlbByJzlsh
   * @test:
   * @msg: 获取当天过敏
   * @param {type}
   * @return:
   */
  getGmlbByJzlsh(data: object) {
    return post('/c/api/v1/qjfw/getGmlbByJzlsh', data)
  },

  /**
   * @name: isRH
   * @test:
   * @msg: 判断熊猫血
   * @param {type}
   * @return:
   */
  isRH(data: object) {
    return post('/c/api/v1/wsj/isRH', data)
  },

  /**
   * @name: getGroupedGmgmjlk
   * @test:
   * @msg: 过敏
   * @param {type}
   * @return:
   */
  getGroupedGmgmjlk(data: object) {
    return post('/c/api/v1/gmjl/getGroupedGmgmjlk', data)
  },

  /**
   * @name: getTzjlByJzlshByPage
   * @test:
   * @msg: 获取患者体征信息
   * @param {type}
   * @return:
   */
  getTzjlByJzlshByPage(data: object) {
    return post('/c/api/v1/tzjl/getTzjlByJzlshByPage', data)
  },

  /**
   * @name: getTempretureData
   * @test:  新增的
   * @msg: 获取患者温度信息
   * @param {type}
   * @return:
   */
  getTempretureData(data: object) {
    return post('/c/api/v1/qjfw/getTzjlByJzlsh', data)
  },

  /**
   * @name: getTodaySsyyjlList
   * @test:
   * @msg: 获取今日手术列表
   * @param {type}
   * @return:
   */
  getTodaySsyyjlList(data: object) {
    return post('/pa/api/ssyyjl/getTodaySsyyjlList', data)
  },

  /**
   * @name: getTodaySsyyjlList
   * @test:
   * @msg: 获取今日手术列表
   * @param {type}
   * @return:
   */
  gethzsySsyyjlList(data: object) {
    return post('/pa/api/ssyyjl/gethzsySsyyjlList', data)
  },

  /**
   * @name: getRemarkEntity
   * @test:
   * @msg: 获取病人备注
   * @param {type}
   * @return:
   */
  getRemarkEntity(data: object) {
    return post('/pa/api/remark/getRemarkEntity', data)
  },

  /**
   * 疫情大屏首页时间节点
   * @param data
   */
  getMainDataList(data: object) {
    return post('/pa/api/timeNode/getTimeNodeList', data)
  },

  /**
   * 新冠肺炎核酸检测记录
   * @param data
   */
  getHsjcList(data: object) {
    return post('/pa/api/xxgzbdhsjc/getHsjcList', data)
  },
  /**
   * 密接人员信息记录
   * @param data
   */
  getMjryxxList(data: object) {
    return post('/pa/api/mjryxx/getMjryxxList', data)
  },
  /**
   * 随访信息记录
   * @param data
   */
  getFollowupList(data: object) {
    return post('/pa/api/followup/getFollowupList', data)
  },
  /**
   * 新增
   * 获取新冠隔离信息
   * @param data
   */
  getGldryxxList(data: object) {
    return post('/pa/api/xxgzbdbgk/getGldryxxList', data)
  },
  /**
   * 查询新冠患者病例类型和身份信息
   * @param {Object} data
   */
  getHzsfxx(data: object) {
    return post('/pa/api/xxgzbdbgk/getHzsfxx', data)
  },
  /***
   * 通过姓名+证件号查询患者信息
   */
  getPatientInfoByZjhm(data: object) {
    return post('/pa/api/timeNode/getPatientInfoByZjhm', data)
  },

  getPatientOverview(data: object) {
    return post('/pa/api/xxgzbdbgk/getPatientOverview', data)
  }
}
