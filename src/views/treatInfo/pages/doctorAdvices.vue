<!--
 * @Descripttion: 医嘱/处方
 * @version:
 * @Author: wangqi
 * @Date: 2019-08-02 09:15:45
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-02 09:40:11
 -->
<template>
  <div :class="['doctor-advices', 'flex', { 'flex-reverse': rightHandType }]">
    <div class="title-list">
      <div
        :class="[
          'title',
          { active: activedAdviceBtn === index },
          `fs-${fontSize + 2}`
        ]"
        v-for="(advice, index) in adviceListVO"
        :key="index"
        @click="changeAdviceList(index)"
      >
        <span>{{ getYzlxmc(advice.type) }}</span>
      </div>
      <div
        :class="['empty', 'no-data', 'flex flex-pack-center', `fs-${fontSize}`]"
        v-if="!adviceListVO.length"
      >
        {{ emptyText }}
      </div>
    </div>
    <div class="content flex-1" @scroll="handleScroll" ref="content">
      <div
        :class="['yz-card', `fs-${fontSize + 2}`]"
        v-for="(advice, index) in adviceListVO"
        :key="index"
      >
        <div ref="title" class="yzlxmc">
          {{ getYzlxmc(advice.type) }}
        </div>
        <el-table
          :data="advice.list"
          style="width: 100%"
          :class="`fs-${fontSize}`"
        >
          <!--<el-table-column label="状态" :width="100 * sizeMultiple">-->
          <!--<template slot-scope="scope">-->
          <!--{{-->
          <!--patientInfo.jzlb === '2'-->
          <!--? getYzzt(scope.row.yzzt)-->
          <!--: patientInfo.jzlb === '1'-->
          <!--? getYzzt(scope.row.cfzt)-->
          <!--: ''-->
          <!--}}-->
          <!--</template>-->
          <!--</el-table-column>-->
          <el-table-column
            :prop="patientInfo.jzlb === '2' ? 'ksrq' : 'ksyysj'"
            label="开始日期"
            :width="120 * sizeMultiple"
          >
          </el-table-column>
          <el-table-column
            :prop="patientInfo.jzlb === '2' ? 'yznr' : 'xmmc'"
            :label="patientInfo.jzlb === '2' ? '医嘱内容' : '处方内容'"
          >
          </el-table-column>
          <el-table-column
            :prop="patientInfo.jzlb === '2' ? 'kzysmc' : 'kfysmc'"
            label="医师签名"
            :width="100 * sizeMultiple"
          >
          </el-table-column>
          <el-table-column
            :prop="patientInfo.jzlb === '2' ? 'tzsj' : 'tfrq'"
            label="停止日期"
            :width="120 * sizeMultiple"
          >
          </el-table-column>
          <el-table-column
            :prop="patientInfo.jzlb === '2' ? 'lrczymc' : 'zxczymc'"
            label="执行医师"
            :width="100 * sizeMultiple"
          >
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State } from 'vuex-class'
import { sectionalizeArr } from '../../../libs/utils'
@Component({
  name: 'doctorAdvices'
})
export default class doctorAdvices extends Vue {
  @State yljgdm
  @State associationAreaCode
  @State associationOfficeCode
  @State patientInfo
  @State sizeMultiple
  @State rightHandType
  @State fontSize

  private activedAdviceBtn: number = 0 // 当前选中医嘱按钮：长期、临时、有效
  private adviceList: object[] = [] //医嘱数据
  private adviceListVO: object[] = [] //分类后的数据
  private scrollTop: number = 0
  private offsetTopList: any[] = []
  private emptyText: string = '' //无数据显示的内容
  private yzlxList: object = {
    '0': '药品医嘱',
    '1': '治疗医嘱',
    '2': '手术医嘱',
    '3': '膳食医嘱',
    '4': '输血医嘱',
    '5': '护理医嘱',
    '6': '检查医嘱',
    '7': '检验医嘱',
    '8': '输液医嘱',
    '9': '停止医嘱',
    '10': '转科医嘱',
    '11': '出院医嘱',
    '12': '出院带药',
    '13': '转床医嘱',
    '14': '术后医嘱',
    '15': '产后医嘱',
    '1501': '草药医嘱',
    YQYY: '院前用药'
  } //医嘱类型字典
  private cflxList: object = {
    '0': '治疗处方',
    '1': '手术处方',
    '2': '麻醉处方',
    '3': '膳食处方',
    '4': '输血处方',
    '5': '护理处方',
    '6': '床位处方',
    '7': '检查处方',
    '8': '检验处方',
    '9': '输液处方',
    '10': '挂号处方',
    '11': '材料处方',
    '12': '诊疗处方',
    '13': '危重级别',
    '14': ' 糖 处方',
    '15': '出院医嘱',
    '16': '吸氧处方',
    '17': '心电监护',
    '18': '留置导尿',
    '19': '青霉素阳性',
    '20': '测血糖',
    '21': '24小时尿量',
    '28': '药品处方',
    '98': '未知处方',
    '99': '其他处方'
  } //处方类型字典
  private yzztList: object = {
    '0': '待审',
    '1': '审核',
    '2': '执行',
    '3': '取消',
    '4': '停止'
  } //医嘱状态字典
  private cfztList: object = {
    '0': '正常',
    '1': '退方',
    '2': '红冲',
    '3': '家床取消',
    '4': '家床取消红冲',
    '5': '未收费',
    '6': '医技作废',
    '7': '医技确认',
    '8': '划价处取消',
    '9': '预算',
    '10': '收费已确认',
    '11': '录入后状态',
    '99': '未知'
  } //处方状态字典
  private contentContainer: any = null

  @Watch('scrollTop')
  onChangeValue(newVla: boolean): void {
    this.updateScroll()
  }

  @Watch('patientInfo')
  changePatient(newVal) {
    this.getLongAdviceList()
  }

  mounted() {
    this.getLongAdviceList()
    this.contentContainer = this.$refs.content
  }

  private handleScroll(): void {
    this.scrollTop = this.contentContainer.scrollTop
  }

  //切换选项卡
  private changeAdviceList(index: any): void {
    this.activedAdviceBtn = index
    this.contentContainer.scrollTop = this.offsetTopList[index].top - 156
  }

  //获取医嘱状态名称
  private getYzzt(yzzt: string): string {
    if (this.patientInfo.jzlb === '2') {
      return this.yzztList[yzzt]
    } else {
      return this.cfztList[yzzt]
    }
  }

  //获取医嘱列表
  private getLongAdviceList(): void {
    this.emptyText = ' '
    if (this.patientInfo.jzlb === '2') {
      let param = {
        yzlb: '1,2',
        yzlx: 'all',
        jzlsh: this.patientInfo.jzlsh,
        jzlb: this.patientInfo.jzlb,
        yljgdm: this.patientInfo.yljgdm,
        ksrq: this.patientInfo.jzkssj.substring(0, 10),
        jsrq:
          this.patientInfo.jzjssj == null || this.patientInfo.jzjssj === ''
            ? this.$moment(new Date()).format('YYYY-MM-DD')
            : this.patientInfo.jzjssj.substring(0, 10),
        yexh: this.patientInfo.yexh
      }
      this.$api
        .getZyyzmxkListYzlbAndYzlx(param)
        .then(res => {
          setTimeout(() => {
            this.emptyText = '暂无数据'
          }, 500)

          this.adviceListVO = []
          this.adviceList = res.data.zymxkList || []
          this.adviceListVO = sectionalizeArr(this.adviceList, 'yzlx')
          this.$nextTick(() => {
            this.onScroll()
          })
          return
        })
        .catch(err => {
          console.log(err)
          setTimeout(() => {
            this.emptyText = '页面无响应'
          }, 500)
        })
    } else {
      let param = {
        jzlsh: this.patientInfo.jzlsh,
        jzlb: this.patientInfo.jzlb,
        yljgdm: this.patientInfo.yljgdm,
        ksrq: this.patientInfo.jzkssj.substring(0, 10),
        jsrq:
          this.patientInfo.jzjssj === null
            ? this.$moment(new Date()).format('YYYY-MM-DD')
            : this.patientInfo.jzjssj.substring(0, 10),
        yexh: this.patientInfo.yexh
      }
      this.$api
        .getMzcfkListByCflxdm(param)
        .then(res => {
          this.adviceListVO = []
          this.adviceList = res.data || []
          this.adviceListVO = sectionalizeArr(this.adviceList, 'cflxdm')
          this.$nextTick(() => {
            this.emptyText = '暂无数据'
            this.onScroll()
          })
          return
        })
        .catch(err => {
          console.log(err)
          setTimeout(() => {
            this.emptyText = '页面无响应'
          }, 500)
        })
    }
  }

  //获取医嘱类型名称
  private getYzlxmc(yzlx: string): string {
    if (this.patientInfo.jzlb === '2') {
      return this.yzlxList[yzlx]
    } else {
      return this.cflxList[yzlx]
    }
  }

  //滚动切换激活选项卡
  private updateScroll(): void {
    for (let i = 0; i < this.offsetTopList.length; i++) {
      if (this.scrollTop < this.offsetTopList[0].top - 157) {
        this.activedAdviceBtn = 0
      }
      if (i < this.offsetTopList.length - 1) {
        if (
          this.scrollTop >= this.offsetTopList[i].top - 158 &&
          this.scrollTop < this.offsetTopList[i + 1].top - 157
        ) {
          this.activedAdviceBtn = this.offsetTopList[i].index
        }
      }
      if (
        this.scrollTop >=
        this.offsetTopList[this.offsetTopList.length - 1].top - 157
      ) {
        this.activedAdviceBtn = this.offsetTopList.length - 1
      }
    }
  }

  //滚动事件
  private onScroll(): void {
    this.offsetTopList = []
    let advice = document.querySelectorAll('.yz-card')
    advice.forEach((item: any, index) => {
      this.offsetTopList.push({
        top: item.offsetTop,
        height: item.offsetHeight,
        index: index
      })
    })
    let paddHeight = 0
    if (this.contentContainer) {
      paddHeight =
        this.contentContainer.offsetHeight -
        this.offsetTopList[this.offsetTopList.length - 1].height
    }

    if (paddHeight > 0) {
      this.contentContainer.style.paddingBottom = paddHeight + 20 + 'px'
    }
  }
}
</script>

<style lang="scss" scoped>
.doctor-advices {
  overflow-y: auto;
  height: 100%;
  &.flex-reverse {
    .title-list {
      margin-left: 10px;
      margin-right: 0;
    }
  }
  .title-list {
    box-shadow: 0 2px 4px rgba(30, 60, 114, 0.4);
    @include puhui-m;
    @include home-content-bg;
    border-radius: 0 4px 4px 4px;
    height: 100%;
    overflow: auto;
    width: 250px;
    background-color: #fff;
    padding-bottom: 20px;
    margin-right: 10px;
    .title {
      @include el-menu-font-color;
      width: 100%;
      margin-top: 17px;
      padding: 7px 0 6px 15px;
    }
    .active {
      @include treat-menu-bg-color;
      color: #ffffff !important;
    }
  }

  .content {
    @include home-content-bg;
    padding-left: 20px;
    padding-top: 10px;
    box-shadow: 0 2px 4px rgba(30, 60, 114, 0.4);
    @include puhui-m;
    border-radius: 0 4px 4px 4px;
    height: 100%;
    overflow: auto;
    .yz-card {
      margin-bottom: 25px;
      .el-table {
        font-size: 18px;
      }
      .yzlxmc {
        @include title-s-font-color;
        margin-left: 2px;
      }
    }
  }

  .empty {
    margin-top: 50px;
  }
}
</style>
