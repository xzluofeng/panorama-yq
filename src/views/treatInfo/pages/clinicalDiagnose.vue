<!--
 * @Descripttion: 临床诊断
 * @version:
 * @Author: wangqi
 * @Date: 2019-08-02 09:30:32
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-02 09:40:05
 -->
<template>
  <div class="clinical-diagnose flex">
    <div class="table-box">
      <el-table
        :data="tableList"
        height="100%"
        :emptyText="emptyText"
        :class="`fs-${fontSize}`"
      >
        <el-table-column
          prop="zdsj"
          label="诊断时间"
          :width="350 * sizeMultiple"
        >
        </el-table-column>
        <el-table-column
          prop="zdmc"
          label="诊断名称"
          :width="380 * sizeMultiple"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column label="诊断说明" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.zdsm ? scope.row.zdsm : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="诊断类别" :width="320 * sizeMultiple">
          <template slot-scope="scope">
            {{ getZdlbmc(scope.row.zdlbdm) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State } from 'vuex-class'
@Component({
  name: 'clinicalDiagnose'
})
export default class clinicalDiagnose extends Vue {
  @State yljgdm
  @State associationAreaCode
  @State associationOfficeCode
  @State patientInfo
  @State sizeMultiple
  @State fontSize

  private tableList: object[] = [] //表格数据
  private emptyText: string = ' ' // 没数据提示
  private mzzdlbList: any = {
    '0': '门诊诊断',
    '1': '门诊中医诊断',
    '8': '未知',
    '9': '其他'
  } //门诊诊断类别字典
  private zyzdlbList: any = {
    '0': '门诊诊断',
    '1': '入院诊断',
    '2': '出院诊断',
    '3': '中医入院诊断',
    '4': '中医出院诊断',
    '5': '术前诊断',
    '6': '术后诊断',
    '7': '病理诊断',
    '8': '未知',
    '9': '其他'
  } //住院诊断类别字典

  @Watch('patientInfo')
  changePatient(newVal) {
    this.tableList = []
    this.getTableList()
  }

  mounted() {
    this.getTableList()
  }

  private getTableList(): void {
    const params = {
      jzlsh: this.patientInfo.jzlsh,
      jzlb: this.patientInfo.jzlb,
      yljgdm: this.patientInfo.yljgdm,
      yexh: this.patientInfo.yexh,
      bqdm: this.patientInfo.cybqdm,
      ksdm: this.patientInfo.cyksdm
    }
    this.$api
      .getBrzdList(params)
      .then(res => {
        this.emptyText = '暂无数据'
        if (res.data) {
          this.tableList = res.data || []
        }
        return
      })
      .catch(err => {
        this.emptyText = '页面无响应'
      })
  }

  private getZdlbmc(zdlbdm: any): string {
    if (this.patientInfo.jzlb === '2') {
      return this.zyzdlbList[zdlbdm]
    } else {
      return this.mzzdlbList[zdlbdm]
    }
  }
}
</script>

<style lang="scss" scoped>
.clinical-diagnose {
  @include home-content-bg;
  @include puhui-m;
  .table-box {
    position: absolute;
    top: 2px;
    bottom: 2px;
    left: 2px;
    right: 2px;
    overflow: auto;
    box-shadow: 0 2px 4px rgba(30, 60, 114, 0.4);
    border-radius: 0 4px 4px 4px;
  }
}
</style>
