<!--
 * @Descripttion: 全局通知模块
 * @version:
 * @Author: wangqi
 * @Date: 2019-08-20 11:41:00
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-20 11:25:16
 -->
<template>
  <div class="websocket">
    <section class="remind"></section>
    <el-dialog
      :visible.sync="dialogVisible2"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="25%"
      class="band-dialog"
      top="30vh"
    >
      <div class="band-title">
        <span class="title-message"
          >{{ this.bandMessageObj ? this.bandMessageObj.txlbmc : '' }}&nbsp;{{
            this.bandMessageObj ? this.bandMessageObj.hzxm : ''
          }}</span
        >
        <span class="cwdm">{{
          this.bandMessageObj ? this.bandMessageObj.cwdm : ''
        }}</span>
        <span class="hljb">{{ nursingLevel }}</span>
      </div>
      <div class="band-message">
        {{ this.bandMessageObj ? this.bandMessageObj.value : '' }}
      </div>
      <div class="btn-group flex flex-align-center flex-pack-center">
        <span
          class="time-item"
          v-show="bandMessageObj && bandMessageObj.txlb === '12'"
          @click="dialogVisible3 = true"
          >正常出区</span
        >
        <span class="time-item" @click="bandMessageMakeSure">确认</span>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogVisible3"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="25%"
      class="band-timeset-dialog"
      @opened="openTimeSetter"
      top="30vh"
      :modal="false"
    >
      <span class="title-message">该患者多长时间不再提醒</span>
      <div class="time-select flex flex-align-center">
        <span class="time-item" @click="handleBandTimeSet('1')">6小时</span>
        <span class="time-item" @click="handleBandTimeSet('2')">12小时</span>
        <span class="time-item" @click="handleBandTimeSet('3')">24小时</span>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State, Action, Mutation } from 'vuex-class'
@Component({
  name: 'webSocket'
})
export default class webSocket extends Vue {
  @State sizeMultiple
  @State yljgdm
  @State associationAreaCode
  @State associationOfficeCode
  @State remindData

  private webSocketObj: any = null // websocket实例
  private sot: any = null // 重连延时器
  private reconnect: number = 0 // 重连时间
  private reconnectMark: boolean = false // 是否重连标记
  private dialogVisible: boolean = false // 弹框展示控制
  private showBounced: boolean = false //弹框开关
  private dialogVisible2: boolean = false //是否显示提醒弹框
  private dialogVisible3: boolean = false //是否显示提醒设置弹框
  private setTimeBtn: boolean = false //是否可以设置时间
  private bandMessageList: any[] = [] //手环提醒队列
  private bandMessageObj: any = null //手环提醒对象

  @Mutation SET_REMIND_DATA

  /**
   * @name: remindBouncedData
   * @test: test font
   * @msg: 筛选需要弹框提醒的数据
   * @param {void}
   * @return: void
   */
  get remindBouncedData(): object[] {
    // 提醒类别 1 需要提醒、提醒状态（提醒时效）0未过时
    return this.remindData.filter(item => {
      return item.txlb === '1' && item.txzt === '0'
    })
  }

  /**
   * @name: nursingLevel
   * @test: test font
   * @msg: 护理级别
   * @param {void}
   * @return: void
   */
  get nursingLevel(): string {
    if (!this.bandMessageObj) {
      return ''
    }
    let hljbmc = this.bandMessageObj.hljbmc
    if (hljbmc == null) {
      return ''
    } else {
      if (hljbmc.indexOf('特') > -1) {
        return '特'
      } else if (
        hljbmc.indexOf('一') > -1 ||
        hljbmc.indexOf('1') > -1 ||
        hljbmc.indexOf('Ⅰ') > -1 ||
        hljbmc.indexOf('I') > -1
      ) {
        return 'Ⅰ'
      } else if (
        hljbmc.indexOf('二') > -1 ||
        hljbmc.indexOf('2') > -1 ||
        hljbmc.indexOf('Ⅱ') > -1 ||
        hljbmc.indexOf('II') > -1
      ) {
        return 'Ⅱ'
      } else if (
        hljbmc.indexOf('三') > -1 ||
        hljbmc.indexOf('3') > -1 ||
        hljbmc.indexOf('Ⅲ') > -1 ||
        hljbmc.indexOf('III') > -1
      ) {
        return 'Ⅲ'
      } else {
        return ''
      }
    }
  }

  @Watch('associationAreaCode')
  areaCodeChange(newVal) {
    if (this.webSocketObj != null) {
      this.webSocketObj.close()
    }
    this.initWebSocket()
  }

  @Watch('remindBouncedData')
  remindDataChange(newVal) {}

  created() {
    if (this.associationAreaCode !== '') {
      this.initWebSocket()
    }
  }

  beforeDestroy() {
    window.removeEventListener(
      'online',
      () => {
        clearTimeout(this.sot)
        this.webSocketObj.close()
        this.initWebSocket()
      },
      true
    )
    window.removeEventListener(
      'offline',
      () => {
        this.webSocketObj.close()
      },
      true
    )
  }

  /**
   * 打开时间设置对话框，并设置z-index
   */
  private openTimeSetter(): void {
    this.dialogVisible3 = true
    this.$nextTick(() => {
      let target1: any = document.querySelector('.band-dialog')
      const target2: any = document.querySelector('.band-timeset-dialog')
      target1.style.zIndex = target2.style.zIndex
    })
  }

  /**
   * @name: initWebSocket
   * @test: test font
   * @msg: 初始化websocket
   * @param {void}
   * @return: void
   */
  private initWebSocket(): void {
    let wsUrl = this.$config.wsServer + 'wsj' + this.associationAreaCode
    if ('WebSocket' in window) {
      // 建立连接
      this.webSocketObj = new WebSocket(wsUrl)
      // 心跳包
      this.webSocketObj.keepalive = () => {
        // 如果断网了，ws.send会无法发送消息出去。ws.bufferedAmount不会为0。
        if (
          this.webSocketObj.bufferedAmount === 0 &&
          this.webSocketObj.readyState === 1
        ) {
          let req = {
            status: 1,
            bqdm: this.associationAreaCode,
            ksdm: this.associationOfficeCode
          }
          this.webSocketObj.send(JSON.stringify(req))
        }
      }
      if (this.webSocketObj) {
        this.webSocketObj.onopen = this.webSocketOnOpen
        this.webSocketObj.onerror = this.webSocketOnError
        this.webSocketObj.onmessage = this.webSocketOnMessage
        this.webSocketObj.onclose = this.webSocketClose
      }
      //	网络波动情况下,情况下导致webSocket的问题
      window.addEventListener(
        'online',
        () => {
          clearTimeout(this.sot)
          this.webSocketObj.close()
          this.initWebSocket()
        },
        true
      )
      window.addEventListener(
        'offline',
        () => {
          this.webSocketObj.close()
        },
        true
      )
    } else {
      this.$message({
        message: '该浏览器不支持websocket！',
        type: 'error'
      })
    }
  }

  private handleBandTimeSet(type: string): void {
    let endTime = this.$moment()
    if (type === '1') {
      endTime = this.$moment()
        .add(6, 'hours')
        .format('YYYY-MM-DD HH:mm:ss')
    } else if (type === '2') {
      endTime = this.$moment()
        .add(12, 'hours')
        .format('YYYY-MM-DD HH:mm:ss')
    } else if (type === '3') {
      endTime = this.$moment()
        .add(24, 'hours')
        .format('YYYY-MM-DD HH:mm:ss')
    }
    const params = {
      txlb: this.bandMessageObj.txlb,
      jzlsh: this.bandMessageObj.jzlsh,
      unfocusTime: endTime,
      yljgdm: this.bandMessageObj.yljgdm,
      jzlb: '2'
    }
    this.$api
      .setBandFocusTime(params)
      .then(res => {
        this.bandMessageMakeSure()
        return
      })
      .catch(err => {
        this.dialogVisible2 = false
        this.dialogVisible3 = false
        this.$message({
          type: 'error',
          message: '操作失败！'
        })
      })
  }
  /**
   * @name: websocketOnOpen
   * @test: test font
   * @msg: webSocket 打开回调
   * @param {void}
   * @return: void
   */
  private webSocketOnOpen(): void {
    this.reconnect = 0
    this.reconnectMark = false
    if (this.webSocketObj.readyState === 1) {
      // 为1表示连接处于open状态
      this.webSocketObj.keepalive()
      this.webSocketObj.keepAliveTimer = setInterval(() => {
        this.webSocketObj.keepalive()
      }, 60000)
    }
  }

  /**
   * @name: webSocketOnError
   * @test: test font
   * @msg: webSocket 异常回调
   * @param {void}
   * @return: void
   */
  private webSocketOnError(): void {
    console.log('WebSocket连接发生错误')
  }

  /**
   * @name: webSocketOnMessage
   * @test: test font
   * @msg: webSocket 接受消息回调
   * @param {void}
   * @return: void
   */
  private webSocketOnMessage(e): void {
    const _data = JSON.parse(e.data)
    // 注意需要区分正常数据  和  心跳包
    // 心跳包 数据{message: "i am alive"}
    // 正常数据  {status: 200, message: "SUCCESS", data: Array(*)}
    if (_data.hasOwnProperty('data')) {
      const targeArr = _data.data || []
      // 过滤获取本病区提示信息数据
      let areaData = targeArr.filter(item => {
        return (
          item.bqdm === this.associationAreaCode &&
          item.ksdm === this.associationOfficeCode &&
          item.yljgdm === this.yljgdm
        )
      })
      // 保存消息数据
      this.SET_REMIND_DATA(areaData)
      this.bandMessageList = []
      areaData.forEach(item => {
        if (
          item.txzt === '0' &&
          (item.txlb === '10' || item.txlb === '11' || item.txlb === '12')
        ) {
          this.bandMessageList.push(item)
        }
      })
      this.showBandDialog()
      if (!this.showBounced) {
        // 第一次进页面，不弹框任何数据开关
        setTimeout(() => {
          this.showBounced = true
        }, 30)
      }
    }
  }

  /**
   * 显示手环提醒弹框
   */
  private showBandDialog() {
    if (this.bandMessageList.length) {
      this.bandMessageObj = this.bandMessageList[0]
      this.dialogVisible2 = true
    }
  }

  /**
   * @name: webSocketClose
   * @test: test font
   * @msg: webSocket 关闭回调
   * @param {void}
   * @return: void
   */
  private webSocketClose(e): void {
    console.log('connection closed (' + e.code + ')')
    clearInterval(this.webSocketObj.keepAliveTimer)
    if (!this.reconnectMark) {
      // 如果没有重连过，进行重连。
      this.reconnect = new Date().getTime()
      this.reconnectMark = true
    }
    let tempWs = this.webSocketObj // 保存t.ws对象
    if (!window.navigator.onLine) {
      this.webSocketObj.close()
    } else {
      //非断网情况下
      if (new Date().getTime() - this.reconnect >= 5000) {
        // 5秒中重连，连不上就不连了
        this.webSocketObj.close()
        this.sot = setTimeout(() => {
          this.webSocketObj.close()
          this.initWebSocket()
          clearTimeout(this.sot)
        }, 60000)
      } else {
        let wsUrl = this.$config.wsServer + 'wsj' + this.associationAreaCode
        // 添加websock地址
        this.webSocketObj = new WebSocket(wsUrl)
        this.webSocketObj.onopen = tempWs.onopen
        this.webSocketObj.onmessage = tempWs.onmessage
        this.webSocketObj.onerror = tempWs.onerror
        this.webSocketObj.onclose = tempWs.onclose
        this.webSocketObj.keepalive = tempWs.keepalive
      }
    }
  }

  /**
   * @name: webSocketsend
   * @test: test font
   * @msg: webSocket 发送消息
   * @param {void}
   * @return: void
   */
  private webSocketsend(data: any): void {
    this.webSocketObj.send(data)
  }

  /**
   * 手环提醒点击确定
   */
  private bandMessageMakeSure(): void {
    this.$api
      .updateTxzt(this.bandMessageObj)
      .then(res => {
        this.dialogVisible2 = false
        this.dialogVisible3 = false
        this.showBandDialog()
        return
      })
      .catch(err => {
        this.dialogVisible2 = false
        this.dialogVisible3 = false
        this.showBandDialog()
        this.$message({
          type: 'error',
          message: '操作失败！'
        })
      })
  }

  /**
   * @name: dialogMakeSure
   * @test: test font
   * @msg: 弹框点击确认
   * @param {void}
   * @return: void
   */
  private dialogMakeSure(): void {
    const {
      patid,
      cwdm,
      bglbdm,
      bblx,
      xmmc,
      bgdh,
      bqdm,
      ksdm
    }: any = this.remindBouncedData
    this.$api
      .updateTxzt({ bqdm, ksdm, patid, cwdm, bglbdm, bblx, xmmc, bgdh })
      .then(res => {
        this.dialogVisible = false
        return
      })
      .catch(err => {
        this.dialogVisible = false
        this.$message({
          type: 'error',
          message: '操作失败！'
        })
      })
  }
}
</script>

<style lang="scss" scoped>
.websocket {
  .time-item {
    width: 120px;
    height: 36px;
    line-height: 34px;
    text-align: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50px;
    color: white;
    margin-right: 15px;
    margin-bottom: 10px;
    font-size: 18px;
  }
  .time-select {
    margin-top: 20px;
  }
  .title-message {
    font-weight: 500;
    font-size: 33px;
    color: rgba(255, 48, 48, 1);
    margin-bottom: 20px;
  }
  .btn-group {
    bottom: 20px;
    position: absolute;
    width: 100%;
  }
  .cwdm {
    width: 100px;
    height: 50px;
    background: rgba(255, 255, 255, 0.3);
    box-shadow: 0px 0px 5px rgba(30, 60, 114, 0.3);
    opacity: 1;
    border-radius: 4px;
    font-size: 33px;
    color: white;
    display: inline-block;
    margin-left: 20px;
  }
  .hljb {
    width: 30px;
    height: 30px;
    background: rgba(249, 89, 125, 1);
    opacity: 1;
    border-radius: 50px;
    display: inline-block;
    color: white;
    font-size: 20px;
    margin-left: 10px;
  }
  .band-message {
    font-weight: bold;
    color: rgba(28, 238, 247, 1);
    font-size: 20px;
    margin-top: 20px;
  }
}
</style>
