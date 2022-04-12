/*
 * @Descripttion: 注册vue实例一些方法
 * @version:
 * @Author: wangqi
 * @Date: 2019-07-29 11:24:13
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-15 13:44:31
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import { Route } from 'vue-router'
// 扩充
declare module 'vue/types/vue' {
  interface Vue {
    $router: VueRouter
    $route: Route
    $Message: any
    $Modal: any
    $api: any
    $moment: any
    $config: any
  }
}
