/*
 * @Descripttion: 应用中所有的api
 * @version:
 * @Author: wangqi
 * @Date: 2019-07-16 13:27:16
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-15 15:31:36
 */

import system from './system'
import ward from './ward'
import treat from './treat'

export default {
  login: system.login,
  getToken: system.getToken,
  getMasterInstitution: system.getMasterInstitution,
  getAuthorizedList: system.getAuthorizedList,
  getMappingList: system.getMappingList,
  getTitleStr: system.getTitleStr,
  getCustomConfig: system.getCustomConfig,
  deleteZbysList: system.deleteZbysList,
  getZlzxxList: system.getZlzxxList,
  getCwmlList: system.getCwmlList,
  intoZlzxx: system.intoZlzxx,
  deleteZlzxx: system.deleteZlzxx,
  getAreaRemark: system.getAreaRemark,
  editRemark: system.editRemark,
  getTagList: system.getTagList,
  editTagList: system.editTagList,
  updateTxzt: system.updateTxzt,
  getCwList: system.getCwList,
  getZyCwList: system.getZyCwList,
  getBedList: system.getBedList,
  getWzList: system.getWzList,
  getNaliAccount: system.getNaliAccount,

  // 配置页面
  getDoctorList: system.getDoctorList,
  getDeptModuleConfigList: system.getDeptModuleConfigList,
  deleteDoctorConfig: system.deleteDoctorConfig,
  addDoctorConfig: system.addDoctorConfig,
  updateDoctorConfig: system.updateDoctorConfig,
  getZbysList: system.getZbysList,
  intoZbysList: system.intoZbysList,
  intoModuleColumnConfig: system.intoModuleColumnConfig,
  getModuleColumnConfigList: system.getModuleColumnConfigList,
  getLisReportByDept: system.getLisReportByDept,
  getDeptFocusByBglbdm: system.getDeptFocusByBglbdm,
  intoLisFocus: system.intoLisFocus,
  getFocusOtherList: system.getFocusOtherList,
  intoFocusOtherList: system.intoFocusOtherList,
  getCISJBList: system.getCISJBList,
  getBQList: system.getBQList,

  // 电子白板
  getChartData: ward.getChartData,
  getLineData: ward.getLineData,
  getListData: ward.getListData,
  getMainData: ward.getMainData,
  getAreaConfig: ward.getAreaConfig,

  // 患者治疗信息
  getTimeline: treat.getTimeline,
  getPatientInfo: treat.getPatientInfo,
  getSsjlk: treat.getSsjlk,
  getLcwd: treat.getLcwd,
  getLcwdwdsjEntities: treat.getLcwdwdsjEntities,
  getLcwdwddsjEntities: treat.getLcwdwddsjEntities,
  getTzjl: treat.getTzjl,
  getZyyz: treat.getZyyz,
  getLczd: treat.getLczd,
  getBrzdList: treat.getBrzdList,
  getUnstructList: treat.getUnstructList,
  getLisreport: treat.getLisreport,
  getLisyjjgkEntities: treat.getLisyjjgkEntities,
  getMisxjjgkList: treat.getMisxjjgkList,
  getChartDataOfYjjg: treat.getChartDataOfYjjg,
  getRisreport: treat.getRisreport,
  findByJzlshAndYljgdm: treat.findByJzlshAndYljgdm,
  getHospitalCustomInfo: treat.getHospitalCustomInfo,
  getRisjcjgkEntities: treat.getRisjcjgkEntities,
  getYjbgfjList: treat.getYjbgfjList,
  getResourceUrl: treat.getResourceUrl,
  getMzcfkListByCflxdm: treat.getMzcfkListByCflxdm,
  getPatidList: treat.getPatidList,
  getAllSysConfig: treat.getAllSysConfig,
  getJczbList: treat.getJczbList,
  getUnstructContent: treat.getUnstructContent,
  handleFtpTransform: treat.handleFtpTransform,
  getNewRisReport: treat.getNewRisReport,
  getRisReportByPatid: treat.getRisReportByPatid,
  getSsjlByJzlsh: treat.getSsjlByJzlsh,
  getGmlbByJzlsh: treat.getGmlbByJzlsh,
  getGmxx: treat.getGmxx,
  isRH: treat.isRH,
  getGroupedGmgmjlk: treat.getGroupedGmgmjlk,
  getTzjlByJzlshByPage: treat.getTzjlByJzlshByPage,
  getTempretureData: treat.getTempretureData, // 新增体温数据
  getRelations: system.getRelations,
  getZyyzmxkListYzlbAndYzlx: treat.getZyyzmxkListYzlbAndYzlx,
  getTodaySsyyjlList: treat.getTodaySsyyjlList,
  gethzsySsyyjlList: treat.gethzsySsyyjlList,
  getRemarkEntity: treat.getRemarkEntity,

  //二级页面
  getLisFocusByDept: system.getLisFocusByDept,
  handleQuota: system.handleQuota,
  handleQuotaList: system.handleQuotaList,
  getHzfzData: system.getHzfzData,
  getFocusLisReport: system.getFocusLisReport,
  handleReport: system.handleReport,
  getFocusRisReport: system.getFocusRisReport,
  findQuotaByModuleCode: system.findQuotaByModuleCode,
  saveDeptQuotaConfig: system.saveDeptQuotaConfig,
  findRelationListByModuleCode: system.findRelationListByModuleCode,
  searchBySearchKey: system.searchBySearchKey,
  getModuleColumnList: system.getModuleColumnList,
  setBandFocusTime: system.setBandFocusTime,

  getMainDataList: treat.getMainDataList,
  getHsjcList: treat.getHsjcList,
  getMjryxxList: treat.getMjryxxList,
  getFollowupList: treat.getFollowupList,
  getGldryxxList: treat.getGldryxxList,
  getHzsfxx: treat.getHzsfxx,
  getPatientInfoByZjhm: treat.getPatientInfoByZjhm,
  getPatidListByZjhm: treat.getPatidListByZjhm,
  getPatientOverview: treat.getPatientOverview
}
