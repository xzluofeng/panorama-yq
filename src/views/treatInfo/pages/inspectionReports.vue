<!--
 * @Descripttion: 检查报告
 * @version:
 * @Author: wangqi
 * @Date: 2019-08-02 09:17:36
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-02 09:40:22
 -->
<template>
  <div
    :class="['inspection-reports', 'flex', { 'flex-reverse': rightHandType }]"
  >
    <!--左边 菜单 -->
    <div :class="['title-list', `fs-${fontSize + 2}`]">
      <div
        v-for="(report, titleIndex) in reportList"
        :key="titleIndex"
        class="card"
      >
        <div class="bglbmc">{{ report.type }}</div>
        <div
          v-for="(check, index) in report.list"
          :key="index"
          class="bgfbsj"
          :class="{ active: activedReport === titleIndex + '+' + index }"
          @click="getCheckResult(check, titleIndex, index)"
        >
          <span>{{ check.djsj.substring(0, 16) }}</span>
        </div>
      </div>
      <div
        class="empty no-data flex flex-pack-center"
        v-if="!reportList.length"
      >
        <span :class="`fs-${fontSize}`">{{ emptyText }}</span>
      </div>
    </div>
    <!--&lt;!&ndash;右边 报告内容&ndash;&gt;-->
    <div
      :class="[
        'content',
        'flex-1',
        `fs-${fontSize + 2}`,
        { 'mr-10': rightHandType }
      ]"
    >
      <div v-for="(jcjg, index) in jcjgList" :key="index">
        <div class="zbxmmc">{{ jcjg.zbxmmc }}</div>
        <div
          class="zbjg"
          ref="zbjg"
          v-html="jcjg.oldZbjg ? jcjg.oldZbjg : jcjg.zbjg ? jcjg.zbjg : ''"
        ></div>
      </div>
      <div
        :class="['no-data', 'empty', `fs-${fontSize}`]"
        v-if="!jcjgList.length"
      >
        {{ emptyText }}
      </div>
      <div class="image" v-if="imgUrl" @click="toCheckImg()">影像资料</div>
      <!--上一个、下一个按钮-->
      <div :class="['btn', `fs-${fontSize + 2}`]">
        <span :class="['up', { first: isFirst }]" @click="changeAdvice('up')">
          上一个
        </span>
        <span :class="['next', { last: isLast }]" @click="changeAdvice('next')">
          下一个
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State } from 'vuex-class'
import { sectionalizeArr } from '../../../libs/utils'
@Component({
  name: 'inspectionReports'
})
export default class inspectionReports extends Vue {
  @State yljgdm
  @State associationAreaCode
  @State associationOfficeCode
  @State patientInfo
  @State sizeMultiple
  @State patidList
  @State rightHandType
  @State customConfig
  @State fontSize

  private reportList: any[] = [] //报告列表
  private activedReport: string = '0+0' //选中的报告
  private jcjgList: any[] = [] //检查结果
  private imgUrl: string = '' //影像链接地址
  private emptyText: string = '' //无数据显示内容

  @Watch('patientInfo')
  changePatient(newVal) {
    this.reportList = []
    this.jcjgList = []
    this.imgUrl = ''
    this.getCheckList()
  }

  mounted() {
    this.getCheckList()
  }

  get isFirst(): boolean {
    if (this.reportList.length) {
      let firstBtn = '0+0'
      return this.activedReport === firstBtn
    }
    return true
  }

  get isLast(): boolean {
    if (this.reportList.length) {
      let lastBtn =
        this.reportList.length -
        1 +
        '+' +
        (this.reportList[this.reportList.length - 1].list.length - 1)
      return this.activedReport === lastBtn
    }
    return true
  }

  //获取检查列表
  getCheckList() {
    this.emptyText = ''
    let params = {
      patidList: this.patidList,
      jzlsh: this.patientInfo.jzlsh,
      jzlb: this.patientInfo.jzlb,
      yljgdm: this.patientInfo.yljgdm,
      yexh: this.patientInfo.yexh
    }
    this.$api
      .getRisreport(params)
      .then(res => {
        this.emptyText = '暂无数据'
        const _res = res.data || {}
        if (_res.reportList && _res.reportList.length) {
          const reportList = _res.reportList[0].risreports || []
          this.reportList = sectionalizeArr(reportList, 'bglbmc')
          if (this.$route.query.bgdh && this.$route.query.bglbmc) {
            const titleIndex = this.reportList.findIndex(item => {
              return item.type === this.$route.query.bglbmc
            })
            if (titleIndex === -1) {
              // 默认打开第一个检查报告
              this.getCheckResult(this.reportList[0].list[0], 0, 0)
            } else {
              const index = this.reportList[titleIndex].list.findIndex(item => {
                return item.bgdh === this.$route.query.bgdh
              })
              if (index === -1) {
                // 默认打开第一个检查报告
                this.getCheckResult(this.reportList[0].list[0], 0, 0)
              } else {
                this.getCheckResult(
                  this.reportList[titleIndex].list[index],
                  titleIndex,
                  index
                )
              }
            }
          } else {
            // 默认打开第一个检查报告
            this.getCheckResult(this.reportList[0].list[0], 0, 0)
          }
        } else {
          this.reportList = []
        }
        return
      })
      .catch(err => {
        this.emptyText = '页面无响应'
        console.log(err)
      })
  }

  //上一个，下一个按钮事件
  private changeAdvice(ev: string): void {
    let arr: any[] = []
    arr = this.activedReport.split('+')
    let titleIndex: number = parseInt(arr[0])
    let index: number = parseInt(arr[1])
    if (ev === 'up') {
      if (index === 0) {
        if (titleIndex !== 0) {
          const newTitleIndex: any = titleIndex - 1
          const bl = this.reportList[newTitleIndex].list[
            this.reportList[newTitleIndex].list.length - 1
          ]
          index = this.reportList[newTitleIndex].list.length - 1
          this.getCheckResult(bl, newTitleIndex, index)
        }
      } else {
        const bl = this.reportList[titleIndex].list[index - 1]
        index = index - 1
        this.getCheckResult(bl, titleIndex, index)
      }
    } else if (ev === 'next') {
      if (index === this.reportList[titleIndex].list.length - 1) {
        if (titleIndex !== this.reportList.length - 1) {
          titleIndex = titleIndex + 1
          let bl = this.reportList[titleIndex].list[0]
          this.getCheckResult(bl, titleIndex, 0)
        }
      } else {
        let bl = this.reportList[titleIndex].list[index + 1]
        this.getCheckResult(bl, titleIndex, index + 1)
      }
    }
  }

  //获取检查结果
  private getCheckResult(report: any, titleIndex: any, index: any): void {
    this.jcjgList = []
    this.imgUrl = ''
    let params = {
      resourceUrlCode: report.bglbdm,
      attachPara: JSON.stringify({ bgdh: report.bgdh, sysId: report.sysId }),
      jzlsh: this.patientInfo.jzlsh,
      jzlb: this.patientInfo.jzlb,
      yljgdm: this.patientInfo.yljgdm
    }
    this.getResourceUrl(params)
    this.emptyText = ''
    this.activedReport = titleIndex + '+' + index
    const param = {
      bgdh: report.bgdh,
      bglbdm: report.bglbdm,
      jzlb: report.jzlb,
      yljgdm: report.yljgdm,
      sysId: report.sysId,
      yexh: report.yexh,
      isPrint: 0
    }
    this.$api
      .getRisjcjgkEntities(param)
      .then(res => {
        this.jcjgList = res.data || []
        this.$nextTick(() => {
          this.enableCdss()
        })
        this.emptyText = '暂无数据'
        return
      })
      .catch(err => {
        this.emptyText = '页面无响应'
        console.log(err)
      })
  }

  // 避免嵌套
  private getResourceUrl(param): void {
    this.$api
      .getResourceUrl(param)
      .then(res => {
        if (Object.keys(res.data).length !== 0) {
          this.imgUrl = res.data.url || ''
        } else {
          this.imgUrl = ''
        }
        return
      })
      .catch(err => {
        console.log(err)
      })
  }

  //跳转影像资料
  private toCheckImg(): void {
    if (this.imgUrl !== '') {
      // 如果配置了 iepath 那么调用ie程序
      const ieConfig = this.customConfig.find(item => {
        return item.code === 'IEPath'
      })
      if (ieConfig == null || !ieConfig.enable) {
        window.open(this.imgUrl)
      } else {
        if (ieConfig.value === '') {
          this.$message({
            message: 'IE路径未设置',
            type: 'error'
          })
        } else {
          this.imgUrl = `openIE://${ieConfig.value},${this.imgUrl}`
          window.location.href = this.imgUrl
        }
      }
    }
  }

  //处理知识库链接字体
  enableCdss() {
    const arr: any = this.$refs.zbjg
    if (arr) {
      for (let i = 0; i < arr.length; i++) {
        const childNode = arr[i].childNodes
        for (let k = 0; k < childNode.length; k++) {
          const node = childNode[k]
          if (node.tagName) {
            node.style.fontSize = 'inherit'
            node.style.fontWeight = 'normal'
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.inspection-reports {
  position: relative;
  overflow-y: auto;
  padding-bottom: 2px;
  height: 100%;
  .title-list {
    height: 100%;
    width: 250px;
    @include home-content-bg;
    overflow-y: auto;
    border-radius: 0 4px 4px 4px;
    box-shadow: 0 2px 4px rgba(30, 60, 114, 0.4);
    .card {
      margin-top: 24px;
      .bglbmc {
        margin-left: 10px;
        @include el-table-title-font-color;
      }
      .bgfbsj {
        padding-left: 20px;
        margin-top: 10px;
        @include el-menu-font-color;
      }
      .active {
        @include treat-menu-bg-color;
        color: #fff !important;
      }
    }
  }

  .content {
    position: relative;
    height: 100%;
    overflow-y: auto;
    border-radius: 0 4px 4px 4px;
    box-shadow: 0 2px 4px rgba(30, 60, 114, 0.4);
    @include home-content-bg;
    padding-bottom: 50px;
    margin-left: 10px;
    .btn {
      position: absolute;
      bottom: 20px;
      right: 20px;
      text-decoration: underline;
      @include el-menu-font-color;
      .first,
      .last {
        @include a-not-active-color;
        text-decoration: underline;
      }
      .up {
        margin-right: 46px;
      }
    }

    .image {
      @include a-font-color;
      margin-left: 60px;
      text-decoration: underline;
      margin-top: 16px;
    }

    .zbjg {
      padding-left: 60px;
      padding-right: 45px;
      @include el-menu-font-color;
      background: rgba(99, 145, 193, 0.1);
      min-height: 40px;
    }

    .zbxmmc {
      padding-left: 40px;
      margin-top: 16px;
      @include title-s-font-color;
      opacity: 1;
      margin-bottom: 8px;
    }
  }

  .empty {
    margin-top: 50px;
  }
  .mr-10 {
    margin-left: 0;
  }
}
</style>
