/*
 * @Descripttion: 封装axios请求
 * @version:
 * @Author: wangqi
 * @Date: 2019-07-16 13:27:16
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-13 14:53:05
 */

import axios from 'axios'
import { Loading, Message } from 'element-ui'
import { debounce } from './utils'
import qs from 'qs'
import store from '../store/store'

axios.defaults.timeout = 20000
axios.defaults.baseURL = ''

let loading: any
const startLoading: any = () => {
  loading = Loading.service({
    lock: true,
    text: '数据努力加载中……',
    background: 'transparent'
  })
}
const endLoading: any = () => {
  loading.close()
}

let needLoadingRequestCount: number = 0
const showFullScreenLoading: any = () => {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

const tryHideFullScreenLoading: any = () => {
  if (needLoadingRequestCount <= 0) {
    return
  }
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
    // 合并loading
    // debounce(endLoading, 300)()
  }
}
// http request 拦截器
axios.interceptors.request.use(
  config => {
    // @ts-ignore
    if (config.headers.showLoading) {
      showFullScreenLoading()
    }
    return config
  },
  error => {
    tryHideFullScreenLoading()
    Message.error({ message: error.message })
    return Promise.reject(error)
  }
)
// http response 拦截器
axios.interceptors.response.use(
  response => {
    // Loading.service().close();
    const res = response.data
    // @ts-ignore
    if (response.config.headers.showLoading) {
      tryHideFullScreenLoading()
    }
    if (res.status !== 200) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    // Loading.service().close();
    // if (error.response.status == 504||error.response.status == 404) {
    //   Message.error({message: '服务器被吃了⊙﹏⊙∥'});
    // } else if (error.response.status == 403) {
    //   Message.error({message: '权限不足,请联系管理员!'});
    // } else {
    //   Message.error({message: '未知错误'});
    // }
    tryHideFullScreenLoading()
    if (error.response && error.response.status === 500) {
      Message.error({ message: '服务器异常，请稍后重试！' })
    } else if (error.response && error.response.status === 408) {
      Message.error({ message: '链接超时，请稍后重试！' })
    } else {
      Message.error({ message: '未知错误' })
    }
    return Promise.reject(error)
  }
)

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export const post = (
  url: String,
  data: object = {},
  showLoading: Boolean = true,
  server: string = 'baseUrl'
): Promise<any> => {
  let postUrl = window.CONFIG.baseUrl + url
  if (server === 'ftpTransformUrl') {
    postUrl = window.CONFIG.ftpTransformUrl + url
  }
  let headerConfig: any = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Access-Control-Allow-Origin': '*',
    showLoading
  }
  if (store.state.token) {
    headerConfig.Authorization = store.state.token
  }

  return new Promise<any>((resolve, reject) => {
    axios
      .post(postUrl, qs.stringify(data), { headers: headerConfig })
      .then((response: any) => {
        // status === 200 正常执行
        if (response.status === 200) {
          resolve(response)
        } else {
          reject()
        }
        // todo 添加token过时，权限失效的返回status码
        return
      })
      .catch((error: any) => {
        // Message.error({message: '服务出错，请联系管理员！'});
        return reject(error)
      })
  })
}
