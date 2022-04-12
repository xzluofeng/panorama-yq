/*
 * @Descripttion:一些工具封装
 * @version:
 * @Author: wangqi
 * @Date: 2019-07-16 13:27:16
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-12 19:08:55
 */

import moment from 'moment'
// 防止保存的key，和其他项目的key相同，引起冲突
const SELFPREFIXSTRING = 'PAN-'

/**
 * @name: setLocalStorage
 * @test: test font
 * @msg: 封装 LocalStorage
 * @param keyStr 保存关键字
 * @param value 保存的值
 * @param selfPrefix 是否有自己项目的前缀
 * @return:
 */
export const setLocalStorage = (
  keyStr: string,
  value: any,
  selfPrefix: Boolean = true
): any => {
  if (selfPrefix) {
    keyStr += SELFPREFIXSTRING
  }
  localStorage.setItem(keyStr, JSON.stringify(value))
}

/**
 * @name: getLocalStorage
 * @test: test font
 * @msg: 获取 LocalStorage
 * @param keyStr 保存关键字
 * @param selfPrefix 是否有自己项目的前缀
 * @return:
 */
export const getLocalStorage = (
  keyStr: string,
  selfPrefix: Boolean = true
): any => {
  if (selfPrefix) {
    keyStr += SELFPREFIXSTRING
  }
  const theValue: any = localStorage.getItem(keyStr)
  if (theValue == null) {
    return null
  } else {
    return JSON.parse(theValue)
  }
}

/**
 * @name: setSessionStorage
 * @test: test font
 * @msg: 封装 SessionStorage
 * @param keyStr 保存关键字
 * @param value 保存的值
 * @param selfPrefix 是否有自己项目的前缀
 * @return:
 */
export const setSessionStorage = (
  keyStr: string,
  value: any,
  selfPrefix: Boolean = true
): any => {
  if (selfPrefix) {
    keyStr += SELFPREFIXSTRING
  }
  sessionStorage.setItem(keyStr, JSON.stringify(value))
}

/**
 * @name: getSessionStorage
 * @test: test font
 * @msg: 获取 SessionStorage
 * @param keyStr 保存关键字
 * @param selfPrefix 是否有自己项目的前缀
 * @return:
 */
export const getSessionStorage = (
  keyStr: string,
  selfPrefix: Boolean = true
): any => {
  if (selfPrefix) {
    keyStr += SELFPREFIXSTRING
  }
  const theValue: any = sessionStorage.getItem(keyStr)
  if (theValue == null) {
    return null
  } else {
    return JSON.parse(theValue)
  }
}

/**
 * @name: calculatePatientAge
 * @test: test font
 * @msg: 计算患者年龄
 * @msg: 一岁以下返回XX月XX日，两岁以上返回周岁
 * @param birthday 出生日期
 * @param inHospitalTime 入院时间
 * @return:
 */
export const calculatePatientAge = (
  birthday: string,
  inHospitalTime?: string
): string => {
  const birthdayMomentObj = moment(birthday)
  const inHospitalMomentTimeObj =
    inHospitalTime == null ? moment(new Date()) : moment(inHospitalTime)
  // 两个时间相差年数
  const ageDiff = moment.duration(
    inHospitalMomentTimeObj.diff(birthdayMomentObj)
  )
  // 如果入院时间早于出生时间 返回-1
  if (ageDiff.seconds() < 0) {
    return '-1'
  }
  const ageDiffYear = ageDiff.years()
  // 一岁以下返回XX月XX日，两岁以上返回周岁
  if (ageDiffYear === 0) {
    const ageDiffMonth = ageDiff.months()
    const ageDiffDay = ageDiff.days()
    if (ageDiffMonth === 0) {
      if (ageDiffDay === 0) {
        const ageDiffHours = ageDiff.hours()
        const ageDiffMinutes = ageDiff.minutes()
        return ageDiffHours === 0
          ? ageDiffMinutes + '分'
          : ageDiffHours + '时' + ageDiffMinutes + '分'
      } else {
        return ageDiffDay + '日'
      }
    } else {
      return ageDiffDay === 0
        ? ageDiffMonth + '月'
        : ageDiffMonth + '月' + ageDiffDay + '日'
    }
  } else {
    return ageDiffYear + '岁'
  }
}

/**
 * @name: formatReportTime
 * @test: test font
 * @msg: 格式化报告时间
 * @msg: 1小时内显示 ** 分钟前、1-3天内显示 **天前、3天以外显示具体报告日期
 * @param reportTime 报告日期
 * @return: {time: '', type: ''} type: y年 d天 m分钟
 */
export const formatReportTime = (reportTime: string): object => {
  if (!reportTime || reportTime === '') {
    return { time: '' }
  }
  const nowDateMomentObj = moment(new Date())
  const reportTimeMomentObj = moment(reportTime)
  const ageDiff = moment.duration(nowDateMomentObj.diff(reportTimeMomentObj))
  if (ageDiff.seconds() < 0) {
    return { time: '' }
  }
  const minutes = ageDiff.asMinutes()
  if (Math.ceil(minutes) < 60) {
    return {
      time: Math.ceil(minutes) + '分钟前',
      type: 'm'
    }
  }
  const day = ageDiff.asDays()
  if (day > 3) {
    return {
      time: reportTimeMomentObj.format('YYYYMMDD'),
      type: 'y'
    }
  } else if (day > 1) {
    return {
      time: Math.ceil(day) + '天前',
      type: 'd'
    }
  } else {
    return {
      time: Math.ceil(ageDiff.asHours()) + '小时前',
      type: 'h'
    }
  }
}

/**
 * @name: debounce
 * @test: test font
 * @msg: 防抖函数
 * @param
 * @return
 */
export const debounce = (fn: Function, delay: number): any => {
  let timer: any
  return function(this: object) {
    let context = this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(function() {
      fn.apply(context, args)
    }, delay)
  }
}

/**
 * @name: sectionalizeArr
 * @test:
 * @msg: 根据某个字段进行分组
 * @param arr 源数组
 * @param key 分组字段
 * @return 数组 {type， list}
 */
export const sectionalizeArr = (
  arr: Array<object>,
  key: string
): Array<object> => {
  let resultArr: Array<object> = []
  if (arr.length) {
    let mapObj = {}
    arr.forEach(item => {
      if (item[key] in mapObj) {
        mapObj[item[key]].push(item)
      } else {
        mapObj[item[key]] = [item]
      }
    })
    for (let k in mapObj) {
      resultArr.push({
        type: k,
        list: mapObj[k]
      })
    }
  }
  return resultArr
}

/**
 * @name: loginEncode
 * @test:
 * @msg: 登录 账号 密码 加密
 * @param str 入参字段
 * @return str
 */
export const loginEncode = (str: string) => {
  let keyStr =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  let output: string = ''
  let chr1: any,
    chr2: any,
    chr3: any,
    enc1: any,
    enc2: any,
    enc3: any,
    enc4: any = ''
  let i: number = 0
  do {
    chr1 = str.charCodeAt(i++)
    chr2 = str.charCodeAt(i++)
    chr3 = str.charCodeAt(i++)
    enc1 = chr1 >> 2
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
    enc4 = chr3 & 63
    if (isNaN(chr2)) {
      enc3 = enc4 = 64
    } else if (isNaN(chr3)) {
      enc4 = 64
    }
    output =
      output +
      keyStr.charAt(enc1) +
      keyStr.charAt(enc2) +
      keyStr.charAt(enc3) +
      keyStr.charAt(enc4)
    chr1 = chr2 = chr3 = ''
    enc1 = enc2 = enc3 = enc4 = ''
  } while (i < str.length)
  return output
}

/**
 * 登录加密 账号 密码
 * @param
 * @return
 */
export const encode = str => {
  let keyStr =
    'ABCDEFGHIJKLMNOP' +
    'QRSTUVWXYZabcdef' +
    'ghijklmnopqrstuv' +
    'wxyz0123456789+/' +
    '='
  let output = ''
  let chr1, chr2, chr3
  let enc1, enc2, enc3, enc4
  let i = 0
  do {
    chr1 = str.charCodeAt(i++)
    chr2 = str.charCodeAt(i++)
    chr3 = str.charCodeAt(i++)
    enc1 = chr1 >> 2
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
    enc4 = chr3 & 63
    if (isNaN(chr2)) {
      enc3 = enc4 = 64
    } else if (isNaN(chr3)) {
      enc4 = 64
    }
    output =
      output +
      keyStr.charAt(enc1) +
      keyStr.charAt(enc2) +
      keyStr.charAt(enc3) +
      keyStr.charAt(enc4)
    chr1 = chr2 = chr3 = ''
    enc1 = enc2 = enc3 = enc4 = ''
  } while (i < str.length)

  return output
}
