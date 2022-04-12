/*
 * @Descripttion: 操作state的action
 * @version:
 * @Author: wangqi
 * @Date: 2019-07-16 13:27:16
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-13 11:21:34
 */
import { ActionTree } from 'vuex'
import { Message, Loading } from 'element-ui'
import API from '../api/index'
import moment from 'moment'
import {
  calculatePatientAge,
  sectionalizeArr,
  encode,
  debounce
} from '../libs/utils'
interface bqksObj {
  bqdm: string
  ksdm: string
}

const actions: ActionTree<any, any> = {
  // 获取请求需要的token参数
  getToken({ commit, state }): Promise<any> {
    const parmas = {
      usercode: encode('winningTest'),
      password: encode('abc123'),
      yljgdm: state.yljgdm
    }
    return new Promise((resolve, reject) => {
      API.getToken(parmas)
        .then(res => {
          if (res.data.token == null) {
            Message({
              message: res.data,
              type: 'warning'
            })
            reject()
          } else {
            commit('SET_TOKEN', ' '+res.data.token)
            resolve()
          }
          return
        })
        .catch(err => {
          Message({
            message: '获取参数失败，请联系管理员！',
            type: 'error'
          })
          reject()
        })
    })
  },
  // 选中当前病区科室
  setCurrentArea({ commit }, bqksObj: bqksObj) {
    commit('SET_CURRENT_AREA_CODE', bqksObj.bqdm)
    commit('SET_CURRENT_OFFICE_CODE', bqksObj.ksdm)
  },
  // 每次进入系统  默认本病区科室
  resetAreaCode({ commit, state }): void {
    commit('SET_ASSOCIATION_AREA_CODE', state.currentAreaCode)
    commit('SET_ASSOCIATION_OFFICE_CODE', state.currentOfficeCode)
  },
  // 选择需要展示的病区科室 关联病区
  setAssociationArea({ commit }, bqksObj: bqksObj): void {
    commit('SET_ASSOCIATION_AREA_CODE', bqksObj.bqdm)
    commit('SET_ASSOCIATION_OFFICE_CODE', bqksObj.ksdm)
  },
  // 设置 倍数
  getSizeMultiple({ commit }): void {
    commit('SET_SIZE_MULTIPLE', window.innerWidth / 1920)
  },
  // 设置选择病区筛选框显示隐藏
  setSelectAreaShow({ commit }, selectAreaShow: boolean): void {
    commit('SET_SELECTIVE_AREA_SHOW', selectAreaShow)
  },
  // 设置字体大小
  setFontSize({ commit }, fontSize: number): void {
    commit('SET_FONT_SIZE', fontSize)
  },
  // 更换主题
  changeTheme({ commit }, theme: string): void {
    window.document.documentElement.setAttribute('data-theme', theme)
    commit('SET_THEME', theme)
  },
  // 获取关联病区数据
  getAreaData({ commit, state }, bqksObj: bqksObj): Promise<any> {
    const formData = {
      yljgdm: state.yljgdm,
      bqdm: bqksObj.bqdm,
      ksdm: bqksObj.ksdm
    }
    return new Promise((resolve, reject) => {
      API.getMappingList(formData)
        .then(res => {
          const _res = res.data || []
          commit('SET_AREA_DATA', _res)
          resolve()
          return
        })
        .catch(err => {
          commit('SET_AREA_DATA', [])
          Message({
            message: '获取关联病区失败，请联系管理员！',
            type: 'error'
          })
          reject(err)
        })
    })
  },
  // 获取所有病区床位
  setAreaBedList({ commit }, areaBedList): void {
    commit('SET_AREA_BED_LIST', areaBedList)
  },
  // 获取病人信息
  async getPatientInfo({ commit }, data: any): Promise<any> {
    const formData = {
      jzlsh: data.jzlsh,
      yljgdm: data.yljgdm,
      yexh: data.yexh || 0,
      jzlb: data.jzlb || 2
    }
    //await this.dispatch('getPatidList', data)
    return new Promise((resolve, reject) => {
      API.getPatientInfo(formData)
        .then((res: any) => {
          const _res = res.data || {}
          const age = calculatePatientAge(_res.brxxkJz.birth, _res.jzkssj)
          let isBirthDay =
            moment(new Date()).format('MM-DD') ===
            _res.brxxkJz.birth.substr(5, 5)
          const patientInfo = {
            ..._res,
            age,
            isBirthDay
          }
          commit('SET_PATIENT_INFO', patientInfo)
          resolve()
          return
        })
        .catch((err: any) => {
          commit('SET_PATIENT_INFO', {})
          Message({
            message: '获取病人信息失败，请联系管理员！',
            type: 'error'
          })
          reject()
        })
    })
  },
  // 获取病人信息
  async getPatientInfoByZjhm({ commit }, data: any): Promise<any> {
      const formData = {
          hzxm:data.hzxm,
          zjhm:data.zjhm
      }
      await this.dispatch('getPatidListByZjhm', data)
      return new Promise((resolve, reject) => {
          API.getPatientInfoByZjhm(formData)
              .then((res: any) => {
                  const _res = res.data || {}
                  const age = calculatePatientAge(_res.brxxkJz.birth, _res.jzkssj)
                  let isBirthDay =
                      moment(new Date()).format('MM-DD') ===
                      _res.brxxkJz.birth.substr(5, 5)
                  const patientInfo = {
                      ..._res,
                      age,
                      isBirthDay
                  }
                  commit('SET_PATIENT_INFO', patientInfo)
                  commit('SET_YLJGDM', _res.yljgdm)
                  resolve()
                  return
              })
              .catch((err: any) => {
                  commit('SET_PATIENT_INFO', {})
                  Message({
                      message: '获取病人信息失败，请联系管理员！',
                      type: 'error'
                  })
                  reject()
              })
      })
  },
  // 获取病人patidList
  getPatidList({ commit }, data: any): Promise<any> {
    const loading = Loading.service({
      lock: true,
      text: '数据努力加载中……',
      background: 'transparent'
    })
    const formData = {
      patid: data.patid,
      jzlb: data.jzlb || 2,
      yljgdm: data.yljgdm
    }
    return new Promise((resolve, reject) => {
      API.getPatidList(formData)
        .then((res: any) => {
          loading.close()
          commit('SET_PATID_LIST', res.data || '')
          resolve()
          return
        })
        .catch((err: any) => {
          loading.close()
          commit('SET_PATID_LIST', '')
          reject()
        })
    })
  },
  // 获取病人patidList
  getPatidListByZjhm({ commit }, data: any): Promise<any> {
      const loading = Loading.service({
          lock: true,
          text: '数据努力加载中……',
          background: 'transparent'
      })
      const formData = {
          //patid: data.patid,
          //jzlb: data.jzlb || 2,
          //yljgdm: data.yljgdm
          hzxm : data.hzxm,
          zjhm :data.zjhm
      }
      return new Promise((resolve, reject) => {
          API.getPatidListByZjhm(formData)
              .then((res: any) => {
                  loading.close()
                  commit('SET_PATID_LIST', res.data || '')
                  resolve()
                  return
              })
              .catch((err: any) => {
                  loading.close()
                  commit('SET_PATID_LIST', '')
                  reject()
              })
      })
  },
  // 获取自定义配置
  getCustomConfig({ commit }) {
    const formData = {
      frontend: 'front',
      is_enable: '',
      sszd: '',
      pageSize: 1000,
      pageNo: 1
    }
    return new Promise((resolve, reject) => {
      API.getCustomConfig(formData)
        .then((res: any) => {
          const _res = res.data || []
          if (_res.length) {
            commit('SET_CUSTOM_CONFIG', _res)
            resolve()
          }
          return
        })
        .catch((err: any) => {
          Message({
            message: '获取个性化配置失败！',
            type: 'error'
          })
        })
    })
  }
}

export default actions
