/*
 * @Descripttion: mock配置文件
 * @version:
 * @Author: wangqi
 * @Date: 2019-07-31 10:38:18
 * @LastEditors: wangqi
 * @LastEditTime: 2019-07-31 15:06:07
 */

import Mock from 'mockjs'
import data from './data'

Mock.setup({
  timeout: 0
})

// 登录相关和获取用户信息
Mock.mock(/\/getBqKsxx/, data.getBqKsxx)
// 模块信息
// Mock.mock(/\/getMkxx/, data.getMkxx);
// 患者总数  床位列表
// Mock.mock(/\/getTzdBrxx/, data.getTzdBrxx);

// Mock.mock(/\/getXmxx/, data.getXmxx);
// Mock.mock(/\/getGyxx/, data.getGyxx1);
// Mock.mock(/\/getFzxx/, data.getFzxx);
// Mock.mock(/\/getBqBqxx/, data.getBqBqxx);
// Mock.mock(/\/getPatientByJzlsh/, data.getPatientByJzlsh);
//
// Mock.mock(/\/getLisyjjgkEntitiesByJylb/, data.getLisyjjgkEntitiesByJylb);
// Mock.mock(/\/getBqjb/, data.getBqjb);

export default Mock
