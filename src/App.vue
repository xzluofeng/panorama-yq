<!--
 * @Descripttion:
 * @version:
 * @Author: wangqi
 * @Date: 2019-07-16 13:27:16
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-14 18:34:40
 -->
<template>
  <div id="app">
    <keep-alive>
      <router-view
        v-if="$route.meta.keepAlive"
        class="flex-1"
        @click.native="showMenu = false"
      />
    </keep-alive>
    <router-view
      v-if="!$route.meta.keepAlive"
      class="flex-1"
      @click.native="showMenu = false"
    />
    <webSocket />
    <!-- 菜单 -->
    <div
      v-if="isShow"
      :class="['meun-box', 'flex', 'flex-align-center', { show: showMenu }]"
    >
      <span
        class="switch flex flex-align-center flex-pack-center"
        @click="showMenu = !showMenu"
      >
        <i class="el-icon-d-arrow-left"></i>
      </span>
      <!-- <div class="doctor" @click="showDoctorLogin"> -->
      <!-- 头像占位标签 -->
      <!-- <span></span>
      </div> -->
      <div class="nali-box" v-if="naliShow" @click="callNali">
        <i class="icon-nali"></i>
      </div>
      <div
        :class="[
          'home-page',
          { active: $route.path === '/wardWhiteboard' },
          'flex',
          'flex-align-center',
          'flex-pack-center'
        ]"
        @click="skip(1)"
      >
        <i class="my-icon icon-home"></i>
        主页
      </div>
      <div
        :class="[
          'bed-list-page',
          { active: $route.path === '/bedList' },
          'flex',
          'flex-align-center',
          'flex-pack-center'
        ]"
        @click="skip(2)"
      >
        <i class="my-icon icon-bed-list"></i>
        床位列表
      </div>
      <div
        :class="[
          'memo-page',
          { active: $route.path === '/areaRemark' },
          'flex',
          'flex-align-center',
          'flex-pack-center'
        ]"
        @click="skip(3)"
      >
        <i class="my-icon icon-note"></i>
        备忘录
      </div>
      <div
        :class="[
          'hander-page',
          { active: $route.path === '/handover' },
          'flex',
          'flex-align-center',
          'flex-pack-center'
        ]"
        @click="skip(4)"
      >
        <i class="my-icon icon-hander"></i>
        {{ cisShow ? '辅助交班' : '病区头条' }}
      </div>
    </div>
    <!-- 医生登录抽屉 -->
    <!-- <el-drawer
      custom-class="doctor-login"
      :visible.sync="drawerShow"
      :direction="rightHandType ? 'rtl' : 'ltr'"
    >
      <p class="draw-title">
        {{
          loginType === 1
            ? '请将脸部对准摄像头'
            : loginType === 2
            ? '请将证件码对准摄像头'
            : '请选择医生'
        }}
      </p> -->
    <!-- 扫描区域、医生列表 -->
    <!-- <div class="handle-area flex flex-align-center flex-pack-center">
        <div
          v-if="loginType !== 3"
          :class="['scan-box', loginType === 1 ? 'face' : 'qr-code']"
        ></div>
        <ul v-else class="doctor-list">
          <li>A医生</li>
          <li>B医生</li>
          <li>C医生</li>
          <li>D医生</li>
          <li>E医生</li>
          <li>F医生</li>
          <li>A医生</li>
          <li>B医生</li>
          <li>C医生</li>
          <li>D医生</li>
          <li>E医生</li>
          <li>F医生</li>
          <li>A医生</li>
          <li>B医生</li>
          <li>C医生</li>
          <li>D医生</li>
          <li>E医生</li>
          <li>F医生</li>
        </ul>
      </div>
      <div class="type-box flex flex-align-center flex-pack-justify-around">
        <div
          :class="['face-type', { active: loginType === 1 }]"
          @click="loginType = 1"
        >
          <i class="iconfont iconrenlianshibie"></i>
          <p>人脸识别</p>
        </div>
        <div
          :class="['qr-code-type', { active: loginType === 2 }]"
          @click="loginType = 2"
        >
          <i class="iconfont iconerweima"></i>
          <p>扫码登录</p>
        </div>
        <div
          :class="['list-type', { active: loginType === 3 }]"
          @click="loginType = 3"
        >
          <i class="iconfont iconyishengrukou"></i>
          <p>医生列表</p>
        </div>
      </div>
    </el-drawer> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State, Action, Mutation } from 'vuex-class'
import kscreenshot from 'kscreenshot'
import webSocket from './components/webSocket.vue'
import jsonp from 'jsonp'
@Component({
  name: 'appHome',
  components: {
    webSocket
  }
})
export default class appHome extends Vue {
  @State theme
  @State currentAreaCode
  @State doctorLoginType
  @State rightHandType
  @State remindData
  @State sizeMultiple
  @State customConfig
  @State associationAreaCode
  @State associationOfficeCode
  @State yljgdm

  @Action getSizeMultiple
  @Action getPatientInfo

  @Mutation SET_KSCREEN_OBJ
  // 纳里医生调用
  get naliShow(): boolean {
    const config = this.customConfig.find(item => {
      return item.code === 'showConsultationBtn'
    })
    if (config == null) {
      return false
    } else {
      return config.enable
    }
  }
  get isShow(): boolean {
    return false
  }
  /**
   * 是否是cis交班
   */
  get cisShow(): boolean {
    const showData = this.customConfig.find(item => {
      return item.code === 'handoverType'
    })
    if (showData == null) {
      return false
    }
    return showData.value === '2'
  }

  private showMenu: boolean = false // 隐藏菜单展示控制
  private drawerShow: boolean = false // 医生登录抽屉展示控制
  private loginType: number = 1 // 医生登录方式  1：人脸识别  2：扫码登录  3：医生列表
  private noticeArr: any[] = [] // 实时弹框实例对象数组，用来关闭
  private hasInit: boolean = false // 是否完成初始化
  private naliConfig: object = {} // 纳里医生调用

  @Watch('remindData')
  remindDataChange(newVal, oldVal) {
    // todo 后期确认展示逻辑是否正确
    // 需要侧滑展示的提醒信息： 提醒类别为1,2,3,4，提醒状态为0
    // txlb 1:危急值 2:急救请求 3:患者入区 4:患者安全 5:新检查/检验结果 6:手术结束 7:预约超时提醒 8:护士留言 9:其他
    const noticeDataNew = newVal.filter(item => {
      return (
        item.txzt === '0' &&
        (item.txlb === '1' || item.txlb === '3' || item.txlb === '5')
      )
    })
    if (!this.hasInit) {
      noticeDataNew.forEach((item, index) => {
        if (item.cwdm == null || item.cwdm === '') {
          return
        }
        // 现在提醒类别只有1，3,5做了设计，非135项没有设计出来，不展示
        if (item.txlb === '1' || item.txlb === '3' || item.txlb === '5') {
          //setTimeout 解决弹出层重叠
          setTimeout(() => {
            let noticeObj = {
              id: item.id,
              notice: this.$notify({
                title: '',
                message: this.getNoticHtml(item),
                dangerouslyUseHTMLString: true,
                customClass: item.txlb < 5 ? 'real-time' : 'general',
                duration: 0,
                offset: 80 * this.sizeMultiple,
                showClose: false
              })
            }
            this.noticeArr.push(noticeObj)
          }, 1000)
        }
      })
      this.hasInit = true
    }
    const noticeDataOld = oldVal.filter(item => {
      return item.txzt === '0'
    })
    // 如果通知实例数组有值，那么进行增加删除操作
    this.addNotice(noticeDataNew, noticeDataOld)
    // 如果通知实例数组没有，那么进行赋值
    this.deleteNotice(noticeDataNew, noticeDataOld)
  }

  mounted() {
    this.loginType = this.doctorLoginType
    // 设置主题
    window.document.documentElement.setAttribute('data-theme', this.theme)
    this.getSizeMultiple()
    window.addEventListener('resize', this.getSizeMultiple, false)
    this.getBrowserInfo()
    // 初始化截图工具对象
    // this.SET_KSCREEN_OBJ(
    //   new kscreenshot({
    //     // 截图完成后，获取base64路径，并上传到服务器
    //     copyPath: path => {
    //       // todo 上传到服务器
    //       console.log(path)
    //     },
    //     // 需要声明两个回调，否组控制台会报错
    //     cancelCB: () => {},
    //     endCB: () => {}
    //   })
    // )
  }

  /**
   * @name: getBrowserInfo
   * @test: test font
   * @msg: 获取浏览器信息，确认是否跳转
   * @param {void}
   * @return: void
   */
  private getBrowserInfo(): void {
    const userAgent = navigator.userAgent.toLowerCase()
    if (userAgent.indexOf('chrome') > 0) {
      const regStr = /chrome\/[\d.]+/gi
      const browserInfoArr = userAgent.match(regStr) || []
      const browserInfo = browserInfoArr[0] || ''
      const version = parseInt((browserInfo + '').replace(/[^0-9.]/gi, ''))
      if (version < 60 || browserInfo === '') {
        this.$router.push('/updateBrowser')
      }
    } else {
      this.$router.push('/updateBrowser')
    }
  }

  /**
   * @name: skip
   * @test: test font
   * @msg: 跳转页面
   * @param {pageIndex} 自定义的跳转参数
   * @return: void
   */
  private skip(pageIndex: number): void {
    const pathArr = ['/wardWhiteboard', '/bedList', '/areaRemark', '/handover']
    this.showMenu = false
    this.$router.push(pathArr[pageIndex - 1])
  }

  /**
   * @name: showDoctorLogin
   * @test: test font
   * @msg: 显示医生登录抽屉
   * @param {void}
   * @return: void
   */
  private showDoctorLogin(): void {
    this.drawerShow = true
  }

  /**
   * @name: getNoticHtml
   * @test: test font
   * @msg: 根据提醒类别返回html结构
   * @param {notice}
   * @return: any
   */
  private getNoticHtml(notice: any): any {
    const h = this.$createElement
    let target
    // todo 修改展示字段
    // txlb 1:危急值 2:急救请求 3:患者入区 4:患者安全 5:新检查/检验结果 6:手术结束 7:预约超时提醒 8:护士留言 9:其他
    switch (notice.txlb) {
      case '1':
        target = h('ul', { attrs: { class: 'critical' } }, [
          h(
            'li',
            {
              attrs: { class: 'close-btn', 'data-id': notice.id },
              on: { click: this.closeNotic }
            },
            '已阅'
          ),
          h('li', { attrs: { class: 'title red' } }, [
            h('span', { attrs: { class: 'warning' } }, ''),
            '危急值报警'
          ]),
          h('li', { attrs: { class: 'mb-10' } }, [
            h('span', { attrs: { class: 'bed-no' } }, notice.cwdm),
            h('span', { attrs: { class: 'name' } }, notice.hzxm)
          ]),
          h('li', { attrs: { class: 'mb-10' } }, [
            h('span', { attrs: { class: 'title-s' } }, '样品种类：'),
            h('span', { attrs: { class: 'value' } }, notice.bblx)
          ]),
          h('li', { attrs: { class: 'mb-10' } }, [
            h('span', { attrs: { class: 'title-s' } }, '检验项目：'),
            h('span', { attrs: { class: 'value red' } }, notice.xmmc)
          ]),
          h('li', {}, [
            h('span', { attrs: { class: 'title-s' } }, '结果：'),
            h('span', { attrs: { class: 'value red' } }, notice.value)
          ])
        ])
        break
      case '3':
        target = h('ul', { attrs: { class: 'critical' } }, [
          h(
            'li',
            {
              attrs: { class: 'close-btn', 'data-id': notice.id },
              on: { click: this.closeNotic }
            },
            '已阅'
          ),
          h('li', { attrs: { class: 'title' } }, '入区'),
          h('li', { attrs: { class: 'mb-10' } }, [
            h('span', { attrs: { class: 'bed-no' } }, notice.cwdm),
            h('span', { attrs: { class: 'name' } }, notice.hzxm)
          ]),
          h(
            'li',
            { attrs: { class: 'content mb-10' } },
            `${notice.fssj.substr(8, 2)}日${notice.fssj.substr(11, 5)}入区`
          ),
          h('li', {}, [
            h(
              'div',
              { attrs: { class: 'doctor-box flex flex-align-center' } },
              [
                h('div', { attrs: { class: 'doctor-icon' } }, ''),
                h('div', { attrs: { class: 'doctor-name' } }, notice.ysmc)
              ]
            )
          ])
        ])
        break
      case '5':
        target = h(
          'div',
          { attrs: { class: 'general flex flex-align-center' } },
          [
            h(
              'span',
              {
                attrs: { class: 'close-btn', 'data-id': notice.id },
                on: { click: this.closeNotic }
              },
              '已阅'
            ),
            h('span', { attrs: { class: 'bed-no' } }, notice.cwdm),
            h('span', { attrs: { class: 'name' } }, notice.hzxm),
            h('span', { attrs: { class: 'content flex-1' } }, notice.value),
            h(
              'span',
              {
                attrs: {
                  class: 'report red',
                  'data-id': notice.id,
                  'data-lx': notice.txlb,
                  'data-bglbmc': notice.bglbmc,
                  'data-bgdh': notice.bgdh,
                  'data-patid': notice.patid,
                  'data-jzlsh': notice.jzlsh,
                  'data-jzlb': notice.jzlb,
                  'data-yljgdm': notice.yljgdm,
                  'data-yexh': notice.yexh
                },
                on: {
                  click: this.toReport
                }
              },
              '查看报告'
            )
          ]
        )
        break
      case '6':
        target = h(
          'div',
          { attrs: { class: 'general flex flex-align-center' } },
          [
            h(
              'span',
              {
                attrs: { class: 'close-btn', 'data-id': notice.id },
                on: { click: this.closeNotic }
              },
              '已阅'
            ),
            h('span', { attrs: { class: 'bed-no' } }, notice.cwdm),
            h('span', { attrs: { class: 'name' } }, notice.hzxm),
            h('span', { attrs: { class: 'content flex-1' } }, notice.value),
            h(
              'span',
              {
                attrs: {
                  class: 'report red',
                  'data-id': notice.id,
                  'data-lx': notice.txlb,
                  'data-patid': notice.patid,
                  'data-jzlsh': notice.jzlsh,
                  'data-jzlb': notice.jzlb,
                  'data-yljgdm': notice.yljgdm,
                  'data-yexh': notice.yexh
                },
                on: {
                  click: this.toPatientMainPage
                }
              },
              '查看信息'
            )
          ]
        )
        break
      case '7':
        target = h(
          'div',
          { attrs: { class: 'general flex flex-align-center' } },
          [
            h(
              'span',
              {
                attrs: { class: 'close-btn', 'data-id': notice.id },
                on: { click: this.closeNotic }
              },
              '已阅'
            ),
            h('span', { attrs: { class: 'bed-no' } }, notice.cwdm),
            h('span', { attrs: { class: 'name' } }, notice.hzxm),
            h('span', { attrs: { class: 'content flex-1' } }, notice.value)
          ]
        )
        break
    }
    return target
  }

  /**
   * @name: closeNotic
   * @test: test font
   * @msg: 关闭通知
   * @param {void}
   * @return: void
   */
  private closeNotic(e) {
    const _id = e.target.getAttribute('data-id') * 1
    const _index = this.noticeArr.findIndex(item => {
      return item.id === _id
    })
    if (_index > -1) {
      const _notice = this.remindData.find(item => {
        return item.id === _id
      })
      if (_notice == null) {
        this.noticeArr[_index].notice.close()
        this.noticeArr.splice(_index, 1)
      } else {
        this.$api
          .updateTxzt(_notice)
          .then(res => {
            this.noticeArr[_index].notice.close()
            this.noticeArr.splice(_index, 1)
            return
          })
          .catch(err => {
            this.noticeArr[_index].notice.close()
            this.noticeArr.splice(_index, 1)
          })
      }
    }
  }

  /**
   * @name: addNotice
   * @test: test font
   * @msg: 新增通知
   * @param {void}
   * @return: void
   */
  private addNotice(newArr, oldArr) {
    //遍历新值，item如果不在旧值中，那么就删除
    newArr.forEach(item => {
      const _bool = oldArr.some(oldItem => {
        return oldItem.id === item.id
      })
      if (!_bool) {
        setTimeout(() => {
          let noticeObj = {
            id: item.id,
            notice: this.$notify({
              title: '',
              message: this.getNoticHtml(item),
              dangerouslyUseHTMLString: true,
              customClass: item.txlb < 5 ? 'real-time' : 'general',
              duration: 0,
              offset: 80 * this.sizeMultiple,
              showClose: false
            })
          }
          this.noticeArr.push(noticeObj)
        }, 500)
      }
    })
  }

  /**
   * @name: deleteNotice
   * @test: test font
   * @msg: 删除通知
   * @param {void}
   * @return: void
   */
  private deleteNotice(newArr, oldArr) {
    oldArr.forEach(item => {
      const _bool = newArr.some(newItem => {
        return newItem.id === item.id
      })
      if (!_bool) {
        setTimeout(() => {
          const _index = this.noticeArr.findIndex(noticeItem => {
            return noticeItem.id === item.id
          })
          if (_index > -1) {
            this.noticeArr[_index].notice.close()
            this.noticeArr.splice(_index, 1)
          }
        }, 500)
      }
    })
  }

  /**
   * @name: toReport
   * @test: test font
   * @msg: 跳转报告页面
   * @param {void}
   * @return: void
   */
  private toReport(e) {
    // 提醒类别 区分检验检查
    this.closeNotic(e)
    // const type = e.target.getAttribute('data-lx')
    // TODO 优化
    const bgdh = e.target.getAttribute('data-bgdh')
    const bglbmc = e.target.getAttribute('data-bglbmc')
    const patid = e.target.getAttribute('data-patid')
    const jzlb = e.target.getAttribute('data-jzlb')
    const yljgdm = e.target.getAttribute('data-yljgdm')
    const jzlsh = e.target.getAttribute('data-jzlsh')
    const yexh = e.target.getAttribute('data-yexh')
    const params = {
      patid,
      jzlb: jzlb,
      yljgdm: yljgdm,
      jzlsh: jzlsh,
      yexh: yexh || 0
    }
    this.getPatientInfo(params)
      .then(() => {
        this.$router.push({
          path: '/treatInfo/examinationReports',
          query: {
            bgdh: bgdh,
            bglbmc: bglbmc
          }
        })
        return
      })
      .catch(err => {})
  }

  private toPatientMainPage(e) {
    this.closeNotic(e)
    const patid = e.target.getAttribute('data-patid')
    const jzlb = e.target.getAttribute('data-jzlb')
    const yljgdm = e.target.getAttribute('data-yljgdm')
    const jzlsh = e.target.getAttribute('data-jzlsh')
    const yexh = e.target.getAttribute('data-yexh')
    const params = {
      patid,
      jzlb: jzlb,
      yljgdm: yljgdm,
      jzlsh: jzlsh,
      yexh: yexh || 0
    }
    this.getPatientInfo(params)
      .then(() => {
        this.$router.push({
          path: '/treatInfo/home'
        })
        return
      })
      .catch(err => {})
  }
  /**
   * @name: callNali
   * @test: test font
   * @msg: 调用纳里
   * @param {void}
   * @return: void
   */
  private callNali(): void {
    const parma = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm
    }
    this.$api
      .getNaliAccount(parma)
      .then(res => {
        if (res.data && res.data.doctorId) {
          setTimeout(() => {
            let url = `http://127.0.0.1:7009/open?sourse=web&appkey=${res.data.appkey}&appsecret=${res.data.appsecret}&doctorId=${res.data.doctorId}&activeModule=MeetClinic`
            url = encodeURI(url)
            jsonp(url, null, (err, data) => {
              if (err) {
                this.callNali()
              }
            })
          }, 1200)
        } else {
          this.$message({
            message: '纳里医生相关配置无数据！',
            type: 'error'
          })
        }
        return
      })
      .catch(err => {
        this.$message({
          message: '获取纳里医生相关配置失败！',
          type: 'error'
        })
      })
  }
}
</script>

<style lang="scss">
#app {
  height: 100%;
  position: relative;
  overflow: hidden;
  @include home-bg-img;
  background-size: cover;

  & > div {
    height: 100%;
    position: relative;
    overflow: hidden;
  }
  // 菜单盒子
  .meun-box {
    position: absolute;
    bottom: -60px;
    left: 50%;
    transform: translateX(-50%);
    // width: 680px;
    height: 60px;
    @include menu-bg-color;
    transition: all 1s;
    overflow: visible;
    border-radius: 4px;
    z-index: 1000;
    .switch {
      position: absolute;
      width: 88px;
      height: 24px;
      top: -24px;
      left: 50%;
      transform: translateX(-50%);
      border-top-right-radius: 4px;
      border-top-left-radius: 4px;
      background: linear-gradient(
        180deg,
        rgba(83, 109, 172, 1) 0%,
        rgba(41, 59, 116, 1) 100%
      );
      i {
        color: #fff;
        font-size: 24px;
        transform: rotate(90deg);
      }
    }
    &.show {
      bottom: 0;
      .switch i {
        transform: rotate(-90deg);
      }
    }
    .doctor {
      width: 80px;
      height: 100%;
      background: linear-gradient(
        360deg,
        rgba(24, 40, 92, 1) 0%,
        rgba(76, 104, 194, 1) 100%
      );
      cursor: pointer;
      border-top-left-radius: 4px;
      span {
        display: inline-block;
        width: 100%;
        height: 100%;
        background-image: url('./assets/images/icon-doctor.png');
        background-size: 43px 43px;
        background-position: center center;
        background-repeat: no-repeat;
      }
    }
    .home-page,
    .bed-list-page,
    .memo-page,
    .hander-page {
      width: 150px;
      text-align: center;
      font-size: 21px;
      height: 60px;
      line-height: 60px;
      @include menu-font-color;
      cursor: pointer;
      &.active {
        color: #fff;
        @include menu-active-bg;
        .icon-home {
          background-image: url('./assets/images/icon-menu-home-active.png');
        }
        .icon-note {
          background-image: url('./assets/images/icon-menu-note-active.png');
        }
        .icon-bed-list {
          background-image: url('./assets/images/icon-menu-bed-active.png');
        }
        .icon-hander {
          background-image: url('./assets/images/icon-menu-hander-active.png');
        }
      }
    }
    .hander-page {
      border-top-right-radius: 4px;
    }

    .my-icon {
      display: inline-block;
      width: 21px;
      height: 21px;
      background-size: cover;
      margin-right: 8px;
    }
    .icon-home {
      @include menu-icon-home;
    }
    .icon-note {
      @include menu-icon-bwl;
    }
    .icon-bed-list {
      @include menu-icon-cwlb;
    }
    .icon-hander {
      @include menu-icon-fzjb;
    }

    .nali-box {
      width: 60px;
      text-align: center;
      cursor: pointer;
    }
    .icon-nali {
      display: inline-block;
      width: 30px;
      height: 30px;
      background-size: cover;
      background-image: url('./assets/images/icon-nali.png');
    }
  }
}
</style>
