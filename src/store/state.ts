/*
 * @Descripttion: state
 * @version:
 * @Author: wangqi
 * @Date: 2019-07-16 13:27:16
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-13 18:13:49
 */
interface state {
  cis: string
  hospitalName: string
  yljgdm: string
  kscreenObj: any
  doctorLoginType: number
  doctorName: string
  doctorId: string
  areaData: Array<object>
  token: string
  sizeMultiple: number
  fontSize: number
  theme: string
  currentAreaCode: string
  currentOfficeCode: string
  associationAreaCode: string
  associationOfficeCode: string
  selectAreaShow: boolean
  updateData: any
  menuData: object[]
  areaBedList: Array<object>
  remindData: Array<any>
  patientInfo: object
  patidList: string
  colorConfig: any
  isScrolling: boolean
  scrollSpeed: number
  customConfig: Array<any>
  moduleMenu: any[]
  treatmentGroupHiddenTel: boolean
  dutyHiddenTel: boolean
  wardContentType: number
  skinType: number
  rightHandType: boolean
  areaSurveyData: any[]
  centralizedData: any[]
  criticalList: any[]
  seriouslyList: any[]
  dataFlushTime: string
}

// 初始数据
const state: state = {
  cis: '0',
  hospitalName: '',
  yljgdm: '',
  kscreenObj: null, // 截图工具保存对象
  doctorLoginType: 1, // 默认医生登录方式  1：人脸识别  2：扫码登录  3：医生列表
  doctorName: '', // 登录医生姓名
  doctorId: '', // 登录医生id
  areaData: [], // 医院所有病区
  token: '', // 请求头配置中的token，登录时获取
  sizeMultiple: 1, // 适配4k屏幕，1920的倍数
  fontSize: 18, // 字体设置变化值
  theme: 'dark', // 页面风格主题
  currentAreaCode: '', // 选中本病区代码
  currentOfficeCode: '', // 选中本科室代码
  associationAreaCode: '', // 关联病区代码，用于展示数据
  associationOfficeCode: '', // 关联科室代码，用于展示数据
  selectAreaShow: false, // 点击卫宁卫视界显示关联病区筛选框
  updateData: {
    cleanData: false, // 清空之前数据
    showLoading: false // 显示loading遮罩层
  },
  menuData: [], // 二级页面菜单数据
  areaBedList: [], // 病区所有床位
  remindData: [], // 实时提醒数据
  patientInfo: {}, // 病人信息及就诊信息
  patidList: '', // 病人patidList
  colorConfig: {
    critically: '#e73828', // 病重
    seriously: '#f29600', // 病危
    high: '#e73828', // 异常-高
    low: '#f29600', // 异常-低
    abnormal: '#e73828' // 异常
  },
  isScrolling: false, // 是否滚动
  scrollSpeed: 0, // 滚动速度 ，百分比
  customConfig: [], // 自定义配置 ie路径，会诊按钮展示控制，交班类型（cis，病区头条）
  moduleMenu: [
    // 前端自定义模块
    { name: '病区概况', moduleId: '1', code: 'BQGL' },
    { name: '患者分组', moduleId: '2', code: 'HZFZ' },
    { name: '病区手术', moduleId: '3', code: 'SSPQ' },
    { name: '预约检查', moduleId: '4', code: 'YYJC' },
    { name: '病区关注', moduleId: '5', code: 'BQGZ' },
    { name: '入区', moduleId: '6', code: 'RQ' },
    { name: '出区', moduleId: '7', code: 'CQ' },
    { name: '危重患者', moduleId: '8', code: 'WZ' },
    { name: '分娩', moduleId: '9', code: 'FM' },
    { name: '新生儿', moduleId: '10', code: 'XSE' },
    { name: '床位列表', moduleId: '11', code: 'CWLB' }
  ],
  treatmentGroupHiddenTel: false, //诊断组，备忘录隐藏联系方式
  dutyHiddenTel: false, // 值班，备忘录隐藏方式
  wardContentType: 1, // 电子白板备忘录区域展示内容
  skinType: 1,
  rightHandType: false, // 右手模式
  areaSurveyData: [], // 病区概况
  centralizedData: [], // 集中区数据
  criticalList: [], // 病危患者数据
  seriouslyList: [], // 病重患者数据
  dataFlushTime: '' // 数据刷新时间
}
export default state
