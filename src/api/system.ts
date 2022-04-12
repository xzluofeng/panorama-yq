/*
 * @Descripttion: 病区配置等相关系统api
 * @version:
 * @Author: wangqi
 * @Date: 2019-07-16 13:27:16
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-13 15:19:06
 */

import { post } from '../libs/axios'

export default {
  /**
   * @name: login
   * @test:
   * @msg: 登录
   * @param {type}
   * @return: 登录信息
   */
  login(data: object) {
    return post('/v1/token/login', data, false)
  },

  /**
   * @name: getToken
   * @test:
   * @msg: 获取请求头中的token
   * @param {type}
   * @return: void
   */
  getToken(data: object) {
    return post('/c/api/v1/token/login', data)
  },

  /**
   * @name: getMasterInstitution
   * @test: test font
   * @msg: 获取医院名称，医疗机构代码等相关信息
   * @param {void}
   * @return: void
   */
  getMasterInstitution() {
    return post('/c/dict/getMainInstitution', {})
  },

  /**
   * @name: getAuthorizedList
   * @test: test font
   * @msg: 获取全院所有已授权病区科室列表
   * @param {void}
   * @return: void
   */
  getAuthorizedList(data: object) {
    return post('/pa/api/dept/bqks/authorized', data)
  },

  /**
   * @name: getMappingList
   * @test: test font
   * @msg: 获取可以查看的病区、科室列表
   * @param {obj}
   * @return: void
   */
  getMappingList(data: object) {
    return post('/pa/api/dept/getRelatedDeptList', data)
  },

  /**
   * @name: getTitleStr
   * @test:
   * @msg: 获取二级页面表头字段展示顺序
   * @param {type}
   * @return:
   */
  getTitleStr(data: object) {
    return post('/home/v1/getZdList', data)
  },

  /**
   * @name: getCustomConfig
   * @test:
   * @msg: 获取自定义配置参数
   * @param {type}
   * @return:
   */
  getCustomConfig(data: object) {
    return post('/pa/api/system/getSystemConfigList', data)
  },

  /**
   * @name: getRelations
   * @test:
   * @msg: 获取二级页面菜单
   * @param {type}
   * @return:
   */
  getRelations(data: object) {
    return post('/pa/api/quotaDept/getRelationList', data)
  },

  /**
   * @name: getDoctorList
   * @test:
   * @msg: 获取医生列表
   * @param {type}
   * @return:
   */
  getDoctorList(data: object) {
    return post('/pa/api/doctorConfig/getDoctorList', data)
  },

  getDeptModuleConfigList(data: object) {
    return post('/pa/api/deptModule/getDeptModuleConfigList', data)
  },
  /**
   * 获取模块所有指标
   * @param data
   */
  findQuotaByModuleCode(data: object) {
    return post('/pa/api/deptModule/findQuotaByModuleCode', data)
  },
  /**
   * @name: deleteDoctorConfig
   * @test:
   * @msg: 删除医生
   * @param {type}
   * @return:
   */
  deleteDoctorConfig(data: object) {
    return post('/pa/api/doctorConfig/deleteDoctorConfig', data)
  },

  /**
   * @name: addDoctorConfig
   * @test:
   * @msg: 新增医生
   * @param {type}
   * @return:
   */
  addDoctorConfig(data: object) {
    return post('/pa/api/doctorConfig/addDoctorConfig', data)
  },

  /**
   * @name: updateDoctorConfig
   * @test:
   * @msg: 编辑医生
   * @param {type}
   * @return:
   */
  updateDoctorConfig(data: object) {
    return post('/pa/api/doctorConfig/updateDoctorConfig', data)
  },

  /**
   * @name: getZbysList
   * @test:
   * @msg: 获取值班医生列表
   * @param {type}
   * @return:
   */
  getZbysList(data: object, showLoading: boolean = true) {
    return post('/pa/api/doctorConfig/getZbysList', data, showLoading)
  },

  /**
   * @name: intoZbysList
   * @test:
   * @msg: 修改/新增值班医生列表
   * @param {type}
   * @return:
   */
  intoZbysList(data: object) {
    return post('/pa/api/doctorConfig/intoZbysList', data)
  },

  /**
   * @name: deleteZbysList
   * @test:
   * @msg: 删除值班医生组
   * @param {type}
   * @return:
   */
  deleteZbysList(data: object) {
    return post('/pa/api/doctorConfig/deleteZbysList', data)
  },

  /**
   * @name: getZlzxxList
   * @test:
   * @msg: 获取诊疗组信息
   * @param {type}
   * @return:
   */
  getZlzxxList(data: object, showLoading: boolean = true) {
    return post('/pa/api/doctorConfig/getZlzxxList', data, showLoading)
  },

  /**
   * @name: getCwmlList
   * @test:
   * @msg: 获取病区全部床位
   * @param {type}
   * @return:
   */
  getCwmlList(data: object) {
    return post('/pa/api/cwml/getCwmlList', data)
  },

  /**
   * @name: intoZlzxx
   * @test:
   * @msg: 新增/修改诊疗组
   * @param {type}
   * @return:
   */
  intoZlzxx(data: object) {
    return post('/pa/api/doctorConfig/intoZlzxx', data)
  },

  /**
   * @name: deleteZlzxx
   * @test:
   * @msg: 删除诊疗组
   * @param {type}
   * @return:
   */
  deleteZlzxx(data: object) {
    return post('/pa/api/doctorConfig/deleteZlzxx', data)
  },

  /**
   * @name: getModuleColumnConfigList
   * @test:
   * @msg: 获取配置模块字段列表
   * @param {type}
   * @return:
   */
  getModuleColumnConfigList(data: object) {
    return post('/pa/api/moduleColumn/getModuleColumnConfigList', data)
  },

  /**
   * @name: intoModuleColumnConfig
   * @test:
   * @msg: 修改模块字段配置
   * @param {type}
   * @return:
   */
  intoModuleColumnConfig(data: object) {
    return post('/pa/api/moduleColumn/intoModuleColumnConfig', data)
  },

  /**
   * @name: getLisReportByDept
   * @test:
   * @msg: 获取病区所有的检验报告
   * @param {type}
   * @return:
   */
  getLisReportByDept(data: object) {
    return post('/pa/api/lisReport/getLisReportByDept', data)
  },

  /**
   * @name: getDeptFocusByBglbdm
   * @test:
   * @msg: 根据报告类别获取检验指标配置信息
   * @param {type}
   * @return:
   */
  getDeptFocusByBglbdm(data: object) {
    return post('/pa/api/deptFocus/getDeptFocusByBglbdm', data)
  },

  /**
   * @name: intoLisFocus
   * @test:
   * @msg: 新增/修改检验指标关注
   * @param {type}
   * @return:
   */
  intoLisFocus(data: object) {
    return post('/pa/api/deptFocus/intoLisFocus', data)
  },

  /**
   * @name: getFocusOtherList
   * @test:
   * @msg: 获取检验外的病区关注
   * @param {type}
   * @return:
   */
  getFocusOtherList(data: object) {
    return post('/pa/api/deptFocus/getFocusOtherList', data)
  },

  /**
   * @name: intoFocusOtherList
   * @test:
   * @msg: 修改某个分组下的病区关注
   * @param {type}
   * @return:
   */
  intoFocusOtherList(data: object) {
    return post('/pa/api/deptFocus/intoFocusOtherList', data)
  },

  /**
   * @name: getLisFocusByDept
   * @test:
   * @msg: 获取检验关注指标
   * @param {type}
   * @return:
   */
  getLisFocusByDept(data: object) {
    return post('/pa/api/deptFocus/getLisFocusByDept', data)
  },

  /**
   * @name: getAreaRemark
   * @test:
   * @msg: 获取病区备注list或者备注内容
   * @param {type}
   * @return:
   */
  getAreaRemark(data: object, showLoading: boolean = true) {
    return post('/pa/api/remark/getRemarkList', data, showLoading)
  },

  /**
   * @name: getBQList
   * @test:
   * @msg: 根据选中标签内容，获取病人标签
   * @param {type}
   * @return:
   */
  getBQList(data: object) {
    return post('/pa/api/remark/getBQList', data)
  },

  /**
   * @name: editRemark
   * @test:
   * @msg: 修改病区备忘
   * @param {type}
   * @return:
   */
  editRemark(data: object) {
    return post('/pa/api/remark/intoRemark', data)
  },

  /**
   * @name: getTagList
   * @test:
   * @msg: 获取病区备注标签
   * @param {type}
   * @return:
   */
  getTagList(data: object) {
    return post('/pa/api/remark/taglist', data)
  },

  /**
   * @name: editTagList
   * @test:
   * @msg: 修改病区备忘标签
   * @param {type}
   * @return:
   */
  editTagList(data: object) {
    return post('/pa/api/remark/intoTag', data)
  },

  /**
   * @name: handleQuota
   * @test:
   * @msg: 获取指标详情数据
   * @param {type}
   * @return:
   */
  handleQuota(data: object) {
    return post('/pa/api/quota/handleQuota', data)
  },

  /**
   * @name: handleQuota
   * @test:
   * @msg: 获取多个指标详情数据
   * @param {type}
   * @return:
   */
  handleQuotaList(data: object) {
    return post('/pa/api/quota/handleQuotaList', data)
  },
  /**
   * @name: getHzfzData
   * @test:
   * @msg: 获取患者分组数据
   * @param {type}
   * @return:
   */
  getHzfzData(data: object) {
    return post('/pa/api/index/chart', data)
  },
  /**
   * @name: updateTxzt
   * @test:
   * @msg: 实时提醒消息关闭
   * @param {type}
   * @return:
   */
  updateTxzt(data: object) {
    return post('/pa/api/txxx/updateTxzt', data)
  },

  /**
   * @name: setBandFocusTime
   * @test:
   * @msg: 设置手环提醒关注时间
   * @param {type}
   * @return:
   */
  setBandFocusTime(data: object) {
    return post('/pa/api/txxx/setBandFocusTime', data)
  },

  /**
   * @name: getFocusLisReport
   * @test:
   * @msg: 获取关注检验报告
   * @param {type}
   * @return:
   */
  getFocusLisReport(data: object) {
    return post('/pa/api/lisReport/getFocusLisReport', data)
  },

  /**
   * @name: getFocusRisReport
   * @test:
   * @msg: 获取关注检验报告
   * @param {type}
   * @return:
   */
  getFocusRisReport(data: object) {
    return post('/pa/api/risReport/getFocusRisReport', data)
  },

  /**
   * @name: handleReport
   * @test:
   * @msg: 获取报告表格信息
   * @param {type}
   * @return:
   */
  handleReport(data: object) {
    return post('/pa/api/quota/handleReport', data)
  },

  /**
   * @name: getCISJBList
   * @test:
   * @msg: 获取cis交班数据
   * @param {type}
   * @return:
   */
  getCISJBList(data: object) {
    return post('/pa/api/cisjb/getCISJBList  ', data)
  },

  /**
   * @name: getCwList
   * @test:
   * @msg: 床位列表 - 床位列表页面 - 不使用
   * @param {type}
   * @return:
   */
  getCwList(data: object) {
    return post('/pa/api/cwml/getCwList', data)
  },
  /**
   * @name: getZyCwList
   * @test:
   * @msg: 床位列表 - 患者详情页面
   * @param {type}
   * @return:
   */
  getZyCwList(data: object) {
    return post('/pa/api/cwml/getZyCwList', data)
  },

  /**
   * @name: getBedList
   * @test:
   * @msg: 床位列表 - 床位列表页面
   * @param {type}
   * @return:
   */
  getBedList(data: object) {
    return post('/pa/api/quota/getBedList', data)
  },

  /**
   * @name: getWzList
   * @test:
   * @msg: 获取病危病重 床位号
   * @param {type}
   * @return:
   */
  getWzList(data: object, showLoading: boolean) {
    return post('/pa/api/quota/wz', data, showLoading)
  },

  /**
   * @name: getNaliAccount
   * @test:
   * @msg: 获取纳里医生
   * @param {type}
   * @return:
   */
  getNaliAccount(data: object) {
    return post('/pa/api/deptConsultation/getDeptConsultation', data)
  },
  /**
   * @name: saveDeptQuotaConfig
   * @test:
   * @msg: 保存病区、科室模块指标配置信息
   * @param {type}
   * @return:
   */
  saveDeptQuotaConfig(data: object) {
    return post('/pa/api/deptModule/saveDeptQuotaConfig', data)
  },
  /**
   * @name: saveDeptQuotaConfig
   * @test:
   * @msg: 保存病区、科室模块指标配置信息
   * @param {type}
   * @return:
   */
  findRelationListByModuleCode(data: object) {
    return post('/pa/api/quotaDept/findRelationListByModuleCode', data)
  },
  /**
   * @name: getModuleColumnList
   * @test:
   * @msg: 获取模块列
   * @return:
   */
  getModuleColumnList(data: object) {
    return post('/pa/api/moduleColumn/getModuleColumnList', data)
  },
  /**
   * @name: searchBySearchKey
   * @test:
   * @msg: 模糊搜索检验指标
   * @param {type}
   * @return:
   */
  searchBySearchKey(data: object) {
    return post('/pa/api/deptFocus/searchBySearchKey', data)
  }
}
