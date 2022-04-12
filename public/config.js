/*
 * @Descripttion: 相关配置
 * @version:
 * @Author: wangqi
 * @Date: 2019-07-16 13:27:16
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-12 17:59:45
 */
const config = {
  baseUrl: 'http://127.0.0.1:8762', // api接口ip地址
  ftpTransformUrl: 'http://36.33.216.237:8082', // ftp转http地址
  wsServer: 'ws://172.17.1.222:8766/websocket/', // websocket地址,配置为poanorama-api的IP和端口号
  colorArr: [
    '#e73828',
    '#f29600',
    '#8dC21f',
    '#00913a',
    '#2ca6e0',
    '#6391c1',
    '#182987',
    '#000'
  ] // 配置病危病重等颜色
}
window.CONFIG = config
