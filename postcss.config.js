/*
 * @Descripttion:
 * @version:
 * @Author: wangqi
 * @Date: 2019-07-16 13:27:16
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-14 10:41:29
 */
module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 192,
      propList: ['!box-shadow', '!-webkit-box-shadow', '!border-radius', '*'],
      selectorBlackList: ['.ig-']
    }
  }
}
