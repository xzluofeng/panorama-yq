/*
 * @Descripttion: mutation
 * @version:
 * @Author: wangqi
 * @Date: 2019-07-16 13:27:16
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-13 13:17:16
 */
import { MutationTree } from 'vuex'
import Vue from 'vue'
import state from './state'
interface colorObj {
  type: number
  color: string
}

const Mutations: MutationTree<any> = {
  // 保存截图对象
  SET_KSCREEN_OBJ(state: any, kscreenObj: any): void {
    state.kscreenObj = kscreenObj
  },
  // 保存医生登录方式
  SET_DOC_LOGIN_TYPE(state: any, doctorLoginType: number): void {
    state.doctorLoginType = doctorLoginType
  },
  // 保存医院名称
  SET_HOSPITAL_NAME(state: any, hospitalName: string): void {
    state.hospitalName = hospitalName
  },
  // 保存医疗机构代码
  SET_YLJGDM(state: any, yljgdm: string): void {
    state.yljgdm = yljgdm
  },
  // 保存token
  SET_TOKEN(state: any, data: string): void {
    state.token = data
  },
  // 设置 当前病区代码
  SET_CURRENT_AREA_CODE(state: any, currentAreaCode: string): void {
    state.currentAreaCode = currentAreaCode
  },
  // 设置 当前科室代码
  SET_CURRENT_OFFICE_CODE(state: any, currentOfficeCode: string): void {
    state.currentOfficeCode = currentOfficeCode
  },
  // 设置 关联病区代码
  SET_ASSOCIATION_AREA_CODE(state: any, associationAreaCode: string): void {
    state.associationAreaCode = associationAreaCode
  },
  // 设置 关联科室代码
  SET_ASSOCIATION_OFFICE_CODE(state: any, associationOfficeCode: string): void {
    state.associationOfficeCode = associationOfficeCode
  },
  // 更新数据设置
  SET_UPDATE_DATA(state: any, updateData: object): void {
    state.updateData = updateData
  },
  // 二级页面菜单
  SET_MENU_DATA(state: any, menuData: object[]): void {
    state.menuData = menuData
  },
  // 设置计算倍数
  SET_SIZE_MULTIPLE(state: any, sizeMultiple: number): void {
    state.sizeMultiple = sizeMultiple
  },
  // 设置字体大小
  SET_FONT_SIZE(state: any, fontSize: number): void {
    state.fontSize = fontSize
  },
  // 设置主题
  SET_THEME(state: any, theme: string): void {
    state.theme = theme
  },
  // 设置病危病重等字体颜色
  SET_COLOR(state: any, colorObj: any): void {
    state.colorConfig[colorObj.type] = colorObj.color
  },
  // 设置 医院所有病区
  SET_AREA_DATA(state: any, areaData: Array<object>): void {
    state.areaData = areaData
  },
  // 关键病区选择框 展示
  SET_SELECTIVE_AREA_SHOW(state: any, selectAreaShow: boolean): void {
    state.selectAreaShow = selectAreaShow
  },
  // 设置全局提醒数据
  SET_REMIND_DATA(state: any, remindData: Array<object>): void {
    state.remindData = remindData
  },
  // 设置 病区 所有病床数据
  SET_AREA_BED_LIST(state: any, areaBedList: Array<object>): void {
    state.areaBedList = areaBedList
  },
  // 设置 病人相关信息
  SET_PATIENT_INFO(state: any, patientInfo: object): void {
    state.patientInfo = patientInfo
  },
  // 设置病人 patidList
  SET_PATID_LIST(state: any, patidList: string): void {
    state.patidList = patidList
  },
  // 设置是否滚动
  SET_SCROLLING(state: any, isScrolling: boolean): void {
    state.isScrolling = isScrolling
  },
  // 设置 滚动速度
  SET_SCROLL_SPEED(state: any, scrollSpeed: number): void {
    state.scrollSpeed = scrollSpeed
  },
  // 设置 自定义设置
  SET_CUSTOM_CONFIG(state: any, customConfig: object): void {
    state.customConfig = customConfig
  },
  // 诊断组 备忘录 隐藏联系方式
  CHANGE_GROUP_HIDDEN_TEL(state: any, hiddenTel: boolean): void {
    state.treatmentGroupHiddenTel = hiddenTel
  },
  // 值班备忘录隐藏方式
  CHANGE_DUTY_HIDDEN_TEL(state: any, hiddenTel: boolean): void {
    state.dutyHiddenTel = hiddenTel
  },
  // 修改电子白板备忘录区域展示内容
  CHANGE_WARD_CONTENT(state: any, wardContentType: number) {
    state.wardContentType = wardContentType
  },
  // 修改电子白板备忘录区域展示内容
  CHANGE_SKIN_TYPE(state: any, skinType: number) {
    state.skinType = skinType
  },
  // 修改左右手模式
  CHANGE_HAND_TYPE(state: any, rightHandType: boolean) {
    state.rightHandType = rightHandType
  },
  // 增大字体
  ADD_FONT_SIZE(state: any) {
    if (state.fontSize < 26) {
      state.fontSize += 2
    }
  },
  // 缩小字体
  DECREASE_FONT_SIZE(state: any) {
    if (state.fontSize > 18) {
      state.fontSize -= 2
    }
  },
  // 保存病区概况数据
  SET_AREA_SURVEY_DATA(state: any, areaSurveyData: any[]) {
    state.areaSurveyData = areaSurveyData
  },
  // 保存集中区域数据
  SET_CENTRALIZED_DATA(state: any, centralizedData: any[]) {
    state.centralizedData = centralizedData
  },
  // 保存病危患者数据
  SET_CRITICAL_LIST(state: any, criticalList: any[]) {
    state.criticalList = criticalList
  },
  // 保存病重患者数据
  SET_SERIOUSLY_LIST(state: any, seriouslyList: any[]) {
    state.seriouslyList = seriouslyList
  },
  // 设置数据刷新时间
  SET_DATA_FLUSH_TIME(state: any, time: string) {
    state.dataFlushTime = time
  },
  SET_TZ_CIS(state: any, cis: string) {
    state.cis = cis
  }
}

export default Mutations
