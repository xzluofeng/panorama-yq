<!--
 * @Descripttion: 护理文书
 * @version:
 * @Author: wangqi
 * @Date: 2019-08-02 09:28:49
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-02 09:40:26
 -->
<template>
  <div :class="['nursing-doc', 'flex', { 'flex-reverse': rightHandType }]">
    <!--左边 菜单 -->
    <div :class="['title-list', `fs-${fontSize + 2}`]">
      <div
        class="card"
        v-for="(card, titleIndex) in lcwdList"
        :key="titleIndex"
      >
        <div class="group-title">
          {{ card.type }}
        </div>
        <div
          class="doc-name"
          v-for="(bl, index) in card.list"
          :class="{ active: activedLcwdBtn === titleIndex + '+' + index }"
          @click="getContent(titleIndex, bl, index)"
          :key="index"
        >
          {{ bl.wdmc }}
        </div>
      </div>
      <div class="empty no-data flex flex-pack-center" v-if="!lcwdList.length">
        <span :class="`fs-${fontSize}`"> {{ emptyText }}</span>
      </div>
    </div>
    <!--右边 病历内容-->
    <div :class="['content', 'flex-1', { 'mr-10': rightHandType }]">
      <!--pdf-->
      <div class="content-detail" v-if="style === 'pdf'">
        <iframe
          class="pdf"
          v-for="(wdnr, index) in lcwdsj"
          :key="index"
          :src="wdnr.filePath"
        ></iframe>
      </div>
      <!--html-->
      <div class="content-detail" v-else-if="style === 'html'">
        <div
          class="pdf"
          v-for="(wdnr, index) in lcwdsj"
          :key="index"
          v-html="wdnr.wdnr"
        ></div>
      </div>
      <!--图片-->
      <div class="content-detail" v-else-if="style === 'img'">
        <img
          class="pdf"
          v-for="(wdnr, index) in lcwdsj"
          :key="index"
          :src="wdnr.wdnr"
        />
      </div>
      <div class="empty no-data" v-else>
        <span :class="`fs-${fontSize}`"> {{ emptyText }}</span>
      </div>
      <div :class="['btn', `fs-${fontSize + 2}`]">
        <span
          :class="isFirst ? 'first' : ''"
          class="up"
          @click="changeAdvice('up')"
          >上一个</span
        >
        <span
          :class="isLast ? 'last' : ''"
          class="next"
          @click="changeAdvice('next')"
          >下一个</span
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State } from 'vuex-class'
import { sectionalizeArr } from '../../../libs/utils'

@Component({
  name: 'nursingDoc'
})
export default class nursingDoc extends Vue {
  @State yljgdm
  @State associationAreaCode
  @State associationOfficeCode
  @State patientInfo
  @State sizeMultiple
  @State rightHandType
  @State fontSize

  private lcwdList: any[] = [] //病历列表数据
  private activedLcwdBtn: string = '' //激活的病历
  private style: string = '' //文档格式
  private lcwdsj: object[] = [] //文档内容
  private emptyText: string = '' //无数据显示的内容

  @Watch('patientInfo')
  changePatient(newVal) {
    this.getLcwdList()
  }

  mounted() {
    this.getLcwdList()
  }

  get isFirst(): boolean {
    if (this.lcwdList.length) {
      let firstBtn = '0+0'
      return this.activedLcwdBtn === firstBtn
    }
    return true
  }

  get isLast(): boolean {
    if (this.lcwdList.length) {
      let lastBtn =
        this.lcwdList.length -
        1 +
        '+' +
        (this.lcwdList[this.lcwdList.length - 1].list.length - 1)
      return this.activedLcwdBtn === lastBtn
    }
    return true
  }

  //上一个，下一个按钮事件
  private changeAdvice(ev: string): void {
    let arr: any[] = []
    arr = this.activedLcwdBtn.split('+')
    let titleIndex: number = parseInt(arr[0])
    let index: number = parseInt(arr[1])
    if (ev === 'up') {
      if (index === 0) {
        if (titleIndex !== 0) {
          const newTitleIndex: any = titleIndex - 1
          const bl = this.lcwdList[newTitleIndex].list[
            this.lcwdList[newTitleIndex].list.length - 1
          ]
          index = this.lcwdList[newTitleIndex].list.length - 1
          this.getContent(newTitleIndex, bl, index)
        }
      } else {
        const bl = this.lcwdList[titleIndex].list[index - 1]
        index = index - 1
        this.getContent(titleIndex, bl, index)
      }
    } else if (ev === 'next') {
      if (index === this.lcwdList[titleIndex].list.length - 1) {
        if (titleIndex !== this.lcwdList.length - 1) {
          titleIndex = titleIndex + 1
          let bl = this.lcwdList[titleIndex].list[0]
          this.getContent(titleIndex, bl, 0)
        }
      } else {
        let bl = this.lcwdList[titleIndex].list[index + 1]
        this.getContent(titleIndex, bl, index + 1)
      }
    }
  }

  //获取病历详情
  private getContent(titleIndex: any, bl: any, index: any): void {
    this.activedLcwdBtn = titleIndex + '+' + index
    let param = {
      wdbsh: bl.wdbsh,
      yljgdm: bl.yljgdm,
      sysId: bl.sysId
    }
    this.$api
      .getUnstructContent(param)
      .then(res => {
        this.loadContent(res.data)
        return
      })
      .catch(err => {
        console.log(err)
      })
  }

  //根据数据格式加载
  private loadContent(data: any): void {
    this.style = ''
    if (data.length && data[0].wdgs) {
      switch (data[0].wdgs) {
        case 'html':
          this.loadHtml(data)
          this.style = 'html'
          break
        case 'pdf':
          this.loadPdf(data)
          this.style = 'pdf'
          break
        case 'url':
          this.loadPdf(data)
          this.style = 'pdf'
          break
        case 'img':
          this.loadImg(data)
          this.style = 'img'
          break
      }
    }
  }

  //加载pdf
  loadPdf(data) {
    this.lcwdsj = []
    data.forEach(item => {
      const params = {
        id: item.wdbsh,
        ftpUrl: item.wdnr,
        yljgdm: item.yljgdm
      }
      this.$api
        .handleFtpTransform(params)
        .then(res => {
          res.data.filePath = this.$config.ftpTransformUrl + res.data.filePath
          this.lcwdsj.push(res.data)
          return
        })
        .catch(err => {
          console.log(err)
        })
    })
  }
  //加载html
  loadHtml(data) {
    this.lcwdsj = data
  }

  //加载img
  loadImg(data) {
    this.lcwdsj = data
  }

  //获取病历列表
  private getLcwdList(): void {
    this.emptyText = ''
    const params = {
      patidList:
        this.patientInfo.patid +
        '+' +
        this.patientInfo.jzlb +
        '+' +
        this.patientInfo.yljgdm,
      lcwdNumber: '6',
      yexh: this.patientInfo.yexh,
      moduleCode: 'hlbl',
      jzlsh: this.patientInfo.jzlsh,
      jzlb: this.patientInfo.jzlb,
      yljgdm: this.patientInfo.yljgdm
    }
    this.$api
      .getUnstructList(params)
      .then(res => {
        this.emptyText = '暂无数据'
        this.lcwdList = []
        const _res = res.data || {}
        if (_res.lcwdVOList && _res.lcwdVOList.length) {
          _res.lcwdVOList[0].lcwdList.forEach(item => {
            item.cjsj = item.cjsj.substring(0, 10)
          })
          this.lcwdList = sectionalizeArr(_res.lcwdVOList[0].lcwdList, 'cjsj')
          this.getContent(0, this.lcwdList[0].list[0], 0)
        }
        return
      })
      .catch(err => {
        this.emptyText = '页面无响应'
        console.log(err)
      })
  }
}
</script>

<style lang="scss" scoped>
.nursing-doc {
  overflow-y: auto;
  height: 100%;
  .title-list {
    height: 100%;
    width: 250px;
    @include home-content-bg;
    overflow-y: auto;
    border-radius: 0 4px 4px 4px;
    box-shadow: 0 2px 4px rgba(30, 60, 114, 0.4);
    .card {
      margin-top: 15px;
      .group-title {
        padding-left: 10px;
        @include el-table-title-font-color;
      }
      .doc-name {
        padding-left: 10px;
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
    .content-detail {
      height: 100%;
    }
    .pdf {
      width: 100%;
      height: 100%;
    }

    .btn {
      position: absolute;
      bottom: 15px;
      right: 20px;
      @include el-menu-font-color;
      text-decoration: underline;
      .first,
      .last {
        @include a-not-active-color;
        text-decoration: underline;
      }
      .up {
        margin-right: 46px;
      }
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
