<!--
 * @Descripttion: 公用头部组件
 * @version:
 * @Author: wangqi
 * @Date: 2019-07-23 09:42:38
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-14 18:10:55
 -->

<template>
  <div class="g-header flex flex-align-center flex-pack-justify-between">
    <div class="content flex flex-align-center">
      <span class="time-container">
        <p class="flex flex-pack-justify-between">
          <span class="time">{{ time }}</span>
          <span class="week">{{ week }}</span>
        </p>
        <p class="the-date">{{ thedate }}</p>
      </span>

      <span class="line" v-if="theme === 'blue'"></span>
      <span class="hospital-name" v-if="theme === 'blue'"
        >{{ hospitalName }} -</span
      >
      <span class="area-name" @click="chooseArea" v-if="theme === 'blue'">{{
        areaName
      }}</span>
    </div>
    <div v-if="theme === 'dark'" class="dark-area" @click="chooseArea">
      {{ areaName }}
    </div>
    <div class="icon-box fs-30">
      <el-popover
        placement="bottom"
        trigger="click"
        popper-class="util-popover"
      >
        <div class="util-menu flex flex-align-center flex-pack-justify-around">
          <!-- <span @click="startScreenShot">
            <i class="header-icon screenshot"></i>
            <p>截图</p>
          </span>
          <span @click="openFile">
            <i class="header-icon document"></i>
            <p>文件</p>
          </span> -->
          <span @click="ADD_FONT_SIZE">
            <i class="header-icon add-font"></i>
            <p>字大</p>
          </span>
          <span @click="DECREASE_FONT_SIZE">
            <i class="header-icon cut-font"></i>
            <p>字小</p>
          </span>
        </div>

        <i slot="reference" class="header-icon header-edit"></i>
      </el-popover>
      <el-popover
        placement="bottom"
        trigger="click"
        popper-class="config-popover"
      >
        <div
          class="config-menu flex flex-align-center flex-pack-justify-around"
        >
          <span @click="toLink('/configs/style')">
            <i class="header-icon config-style"></i>
            <p>风格</p>
          </span>
          <span @click="toLink('/configs/doctorInfo/inHospital')">
            <i class="header-icon config-doctor"></i>
            <p>医生</p>
          </span>
          <span @click="toLink('/configs/content/CWLB')">
            <i class="header-icon config-content"></i>
            <p>内容</p>
          </span>
        </div>

        <i slot="reference" class="header-icon header-config"></i>
      </el-popover>
    </div>

    <!--弹框 下拉病区信息-->
    <el-dialog
      :visible.sync="dialogVisible"
      width="25%"
      class="choose-area-dialog"
      :before-close="handleClose"
      top="30vh"
    >
      <div class="logo-box"></div>
      <el-select
        v-model="dialogAreaCode"
        placeholder="请选择病区"
        filterable
        popper-class="choose-area"
        size="big"
      >
        <el-option
          v-for="item in areaData"
          :key="item.ysbqdm + '-' + item.ysksdm"
          :label="item.ysbqmc"
          :value="item.ysbqdm + '-' + item.ysksdm"
        >
          <span class="select-left">{{ item.ysbqmc }}</span>
          <span class="select-right">
            {{ item.ysksmc }}
          </span>
        </el-option>
      </el-select>
      <el-button type="primary" class="choose-btn" @click="changeAreaCode">
        确&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;认
      </el-button>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Emit } from 'vue-property-decorator'
import { State, Action, Mutation } from 'vuex-class'
import state from '../store/state'
import appHome from '../App.vue'
import treat from '../api/treat'

@Component({
  name: 'gHeader',
  components: {
    appHome
  }
})
export default class gHeader extends Vue {
  @State theme
  @State kscreenObj
  @State hospitalName
  @State areaData
  @State associationAreaCode
  @State associationOfficeCode
  @State selectAreaShow
  @State currentAreaCode
  @State currentOfficeCode
  @State yljgdm

  @Action getToken
  @Action setCurrentArea
  @Action setAssociationArea
  @Action setAreaBedList
  @Action setSelectAreaShow
  @Action getAreaData
  @Action getCustomConfig

  @Mutation SET_UPDATE_DATA
  @Mutation ADD_FONT_SIZE
  @Mutation DECREASE_FONT_SIZE
  @Mutation SET_CRITICAL_LIST
  @Mutation SET_SERIOUSLY_LIST

  private timer: any = null //每隔30秒更新时间对象
  private dataTimer: any = null // 每隔3分钟更新所有数据
  private tokenTimer: any = null // 24小时更新一次token
  private timeObj: any = this.$moment()
  private selectAreaCode: string = '' // 选中的关联科室代码
  private dialogAreaCode: string = '' // 下拉选中的关联科室代码

  private defaultCode: string = '' // 默认病区科室代码
  private dialogVisible: boolean = false // 弹出框
  private hasInit: boolean = false // 是否完成初始化

  // 时间
  get time(): string {
    return this.timeObj.format('HH:mm')
  }
  // 周几
  get week(): string {
    return this.timeObj.format('dddd')
  }
  // 日期
  get thedate(): string {
    return this.timeObj.format('YYYY/MM/DD')
  }
  // 关联病区名称
  get areaName(): string {
    if (!this.hasInit) {
      return ''
    }
    let [bqdm, ksdm] = this.selectAreaCode.split('-')
    const data: any = this.areaData.find((item: any) => {
      return item.ysbqdm === bqdm && item.ysksdm + '' === ksdm
    })
    // 之前有选择关联病区，刷新后取消关联权限，重置展示本身病区
    if (data == null) {
      const defaultCode = `${this.currentAreaCode}-${this.currentOfficeCode}`
      const formData = {
        bqdm: this.currentAreaCode,
        ksdm: this.currentOfficeCode
      }
      this.setCurrentArea(formData)
      // 不触发 saveAreaCode事件
      const _data: any = this.areaData.find((item: any) => {
        return (
          item.ysbqdm === this.currentAreaCode &&
          item.ysksdm + '' === this.currentOfficeCode
        )
      })
      if (_data == null) {
        // this.$message({
        //   message: '关联病区数据有误，请联系管理员！',
        //   type: 'error'
        // })
        // 是否直接返回到选择病区页面
        const _ksObj = {
          bqdm: '',
          ksdm: ''
        }
        this.setCurrentArea(_ksObj)
        this.setAssociationArea(_ksObj)
        clearInterval(this.timer)
        clearInterval(this.dataTimer)
        clearInterval(this.tokenTimer)
        this.$router.push('/login')
        return ''
      } else {
        this.saveAreaCode(defaultCode)
        if (_data.ysksmc === '' || _data.ysksmc == null) {
          return _data.ysbqmc
        } else {
          return _data.ysksmc
        }
      }
    } else {
      if (ksdm === '' || ksdm === 'null' || ksdm == null) {
        return data.ysbqmc
      } else {
        return data.ysksmc
      }
    }
  }

  // 监听selectAreaShow值，如果为true，则弹框
  @Watch('selectAreaShow')
  onChangeValue(newVla: boolean): void {
    if (newVla) {
      this.chooseArea()
    }
  }

  created() {
    // 是否选择了病区，弹出病区选择框
    if (this.associationAreaCode === '') {
      this.defaultCode = `${this.currentAreaCode}-${this.currentOfficeCode}`
    } else {
      this.defaultCode = `${this.associationAreaCode}-${this.associationOfficeCode}`
    }
    this.selectAreaCode = this.defaultCode
    this.dialogAreaCode = this.defaultCode
  }

  mounted() {
    this.init()
    // 30秒更新时间
    this.timer = setInterval(() => {
      this.timeObj = this.$moment()
    }, 30000)
    // 3分钟更新数据 180000
    this.dataTimer = setInterval(() => {
      this.SET_UPDATE_DATA({
        cleanData: false,
        showLoading: false
      })
      this.getBedColor(false)
    }, 180000)
    // 6小时更新一次token
    this.tokenTimer = setInterval(() => {
      this.getToken()
    }, 6 * 3600 * 1000)
  }

  beforeDestroy() {
    clearInterval(this.timer)
    clearInterval(this.dataTimer)
    clearInterval(this.tokenTimer)
  }
  // 初始化
  private async init(): Promise<any> {
    if (this.$route.fullPath === '/wardWhiteboard') {
      const bqksObj = {
        bqdm: this.currentAreaCode,
        ksdm: this.currentOfficeCode
      }
      await this.getAreaData(bqksObj)
        .then(res => {
          return
        })
        .catch(err => {
          const _ksObj = {
            bqdm: '',
            ksdm: ''
          }
          this.setCurrentArea(_ksObj)
          this.setAssociationArea(_ksObj)
          clearInterval(this.timer)
          clearInterval(this.dataTimer)
          clearInterval(this.tokenTimer)
          this.$router.push('/login')
        })
      this.getCustomConfig()
      this.getBedColor(true)
      this.SET_UPDATE_DATA({
        cleanData: false,
        showLoading: true
      })
    }
    this.hasInit = true
  }
  // 如果非电子白板，那么不弹框
  private chooseArea(): void {
    if (this.$route.path === '/wardWhiteboard') {
      this.selectAreaCode = this.defaultCode
      this.dialogAreaCode = this.defaultCode
      this.dialogVisible = true
    }
  }
  // 下拉选中病区科室
  private saveAreaCode(areaCode: string): void {
    // 更新state里面的 关联病区科室代码
    if (this.defaultCode === areaCode) {
      return
    } else {
      this.defaultCode = areaCode
      const [bqdm, ksdm] = areaCode.split('-')
      this.setAssociationArea({ bqdm, ksdm })
      this.setAreaBedList([])
      this.SET_CRITICAL_LIST([])
      this.SET_SERIOUSLY_LIST([])
      this.getBedColor(true)
      this.SET_UPDATE_DATA({
        cleanData: true,
        showLoading: true
      })
      this.setSelectAreaShow(false)
    }
  }

  /**
   * @name: startScreenShot
   * @test: test font
   * @msg: 开始截屏
   * @param {void}
   * @return: void
   */
  private startScreenShot(): void {
    // this.kscreenObj.startScreenShot()
    let url = 'screenShot://C:/winning_screenshot/winning_screenshot.exe'
    window.location.href = url
  }

  /**
   * @name:changeAreaCode
   * @test: test font
   * @msg:确认更改关联病区
   * @param {void}
   * @return:void
   */
  private changeAreaCode(): void {
    this.selectAreaCode = this.dialogAreaCode
    this.saveAreaCode(this.selectAreaCode)
    this.setSelectAreaShow(false)
    this.dialogVisible = false
  }

  /**
   * @name:handleClose
   * @test: test font
   * @msg:关闭病区选择框
   * @param {void}
   * @return:void
   */
  private handleClose(done): void {
    if (this.selectAreaCode === '') {
      this.$message({
        type: 'error',
        message: '请选择病区！',
        center: true
      })
    } else {
      this.setSelectAreaShow(false)
      done()
    }
  }

  /**
   * @name:getBedColor
   * @test: test font
   * @msg:获取病区病危病重，检验异常，结果偏高偏低患者清单，控制床位列表字体颜色
   * @param {void}
   * @return:void
   */
  private getBedColor(showLoading: boolean): void {
    const parmas = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm
    }
    this.$api
      .getWzList(parmas, showLoading)
      .then(res => {
        const _res = res.data || {}
        const bwList = _res.bw || []
        const bzList = _res.bz || []
        const bwBedNo: any = []
        const bzBedNo: any = []
        bwList.forEach(item => {
          bwBedNo.push(item.rycw || item.cycw || item.cwdm)
        })
        bzList.forEach(item => {
          bzBedNo.push(item.rycw || item.cycw || item.cwdm)
        })
        this.SET_CRITICAL_LIST(bwBedNo)
        this.SET_SERIOUSLY_LIST(bzBedNo)
        return
      })
      .catch(err => {})
  }

  /**
   * @name:openFile
   * @test: test font
   * @msg: 打开文件功能，此版本暂不开发此功能
   * @param {void}
   * @return:void
   */
  private openFile(): void {
    const fs = require('fs')
    const items = fs.readdirSync('.')
  }

  private toLink(linkStr: string): void {
    if (this.$route.fullPath === linkStr) {
      return
    } else {
      this.$router.push(linkStr)
    }
  }
}
</script>
<style lang="scss" scoped>
.g-header {
  @include header-bg-img;
  background-size: cover;
  height: 80px;
  padding-left: 40px;
  padding-right: 20px;
  color: #fff;
  .content {
    @include puhui-m;
    font-size: 32px;
  }
  .config-menu {
    @include home-font-color;
  }
  // 左侧医院名称  及  时间日期组件样式
  .time-container {
    .time {
      font-size: 24px;
    }
    .time,
    .week {
      height: 30px;
    }
    .week,
    .the-date {
      font-size: 21px;
      opacity: 0.9;
    }
    .the-date {
      letter-spacing: 3.15px;
    }
  }
  .dark-area {
    @include puhui-m;
    font-size: 32px;
    margin-right: 41px;
  }
  .line {
    width: 1px;
    height: 30px;
    margin-left: 30px;
    margin-right: 30px;
    background-color: #fff;
  }
  .hospital-name {
    font-size: 32px;
    margin-right: 4px;
  }
  .area-name {
    margin-left: 4px;
  }
  .icon-box {
    span {
      margin-right: 20px;
      cursor: pointer;
    }
  }
}
</style>
