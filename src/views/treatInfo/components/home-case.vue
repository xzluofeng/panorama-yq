<template>
  <!-- 病例模块 -->
  <ul :class="['case-box', `fs-${fontSize}`]">
    <li v-for="(item, index) in caseList" :key="index" @click="linkTo(item)">
      {{ item.wdmc }}
    </li>
    <li class="no-data" v-if="!caseList.length">{{ emptyText }}</li>
  </ul>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State } from 'vuex-class'
@Component({
  name: 'homeCase'
})
export default class homeCase extends Vue {
  @State associationAreaCode
  @State associationOfficeCode
  @State patidList
  @State yljgdm
  @State patientInfo
  @State fontSize

  @Watch('patientInfo')
  changePatient(newVal) {
    this.emptyText = ''
    this.caseList = []
    this.getCaseData()
  }

  private caseList: any[] = [] // 病例数据
  private emptyText: string = '' //无数据显示内容

  mounted() {
    this.getCaseData()
  }

  /**
   * @name: getCaseData
   * @test: test font
   * @msg: 获取24小时内的电子病例
   * @param {void}
   * @return: void
   */
  private getCaseData(): void {
    this.emptyText = ''
    let params = {
      patidList: this.patidList,
      jzlsh: this.patientInfo.jzlsh,
      jzlb: this.patientInfo.jzlb,
      yljgdm: this.yljgdm,
      yexh: this.patientInfo.yexh,
      wdlb: '1'
    }
    this.$api
      .getLcwd(params)
      .then(res => {
        const _res = res.data || {}
        const lcwdList = _res.lcwdList || []
        this.emptyText = '暂无数据'
        if (lcwdList.length) {
          const _data = lcwdList[0].lcwdList || []
          this.caseList = _data
        }
        return
      })
      .catch(err => {
        this.emptyText = '页面无响应'
        console.log(err)
      })
  }

  /**
   * @name: linkTo
   * @test: test font
   * @msg: 跳转电子病例页面
   * @param {void}
   * @return: void
   */
  private linkTo(caseItem: any) {
    this.$router.push({
      name: 'menuCaseHistory',
      query: {
        wdbsh: caseItem.wdbsh
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.case-box {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  @include puhui-m;
  color: #0aaad2;
  li {
    padding-left: 15px;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
  }
}
</style>
