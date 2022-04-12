<template>
  <div class="detail-normal flex-1">
    <el-table
      :class="`fs-${fontSize + 2}`"
      :data="tableList"
      style="width: 100%"
      height="100%"
      :empty-text="emptyText"
      @row-click="columnClick"
    >
      <el-table-column label="床位" align="center">
        <template slot-scope="scope">
          <span
            :class="[
              'mar',
              'bed-no',
              { highlight: scope.row['rycw'] === activeBedNo }
            ]"
          >
            {{ scope.row['rycw'] || '-' }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        v-for="(title, index) in titleList"
        :key="index"
        :label="title.columnName"
        align="center"
      >
        <template slot-scope="scope">
          {{ getColumnData(scope.row, title.columnCode) }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import moment from 'moment'
@Component({
  name: 'detailNormal'
})
export default class detailNormal extends Vue {
  @State yljgdm
  @State associationAreaCode
  @State associationOfficeCode
  @State sizeMultiple
  @State fontSize

  @Action getPatientInfo

  @Prop(String)
  quotaCode!: string

  @Prop(String)
  moduleCode!: string

  @Prop(String)
  activeBedNo!: string

  private emptyText: string = '暂无数据' //无数据提示语

  private tableList: object[] = [] //表格数据
  private titleList: object[] = [] //标题数据

  @Watch('quotaCode')
  onChangeValue(newVla: boolean): void {
    this.getDetailList()
  }
  created() {
    this.getDetailList()
  }
  /**
   * @name: getDetailList
   * @test: test font
   * @msg: 获取数据列表
   * @param {void}
   * @return: void
   */
  private getDetailList(): void {
    const params = {
      ksdm: this.associationOfficeCode,
      bqdm: this.associationAreaCode,
      yljgdm: this.yljgdm,
      moduleCode: this.moduleCode,
      quotaCode: this.quotaCode
    }
    if (this.moduleCode === 'BQGZ') {
      this.$api
        .handleQuota(params)
        .then(res => {
          if (res.data) {
            this.tableList = res.data.data
            this.titleList = res.data.columns
          }
          return
        })
        .catch(err => {
          this.$message({
            message: err.message,
            type: 'error'
          })
        })
    } else {
      this.$api
        .handleQuotaList(params)
        .then(res => {
          if (res.data) {
            this.tableList = res.data.data
            this.titleList = res.data.columns
          }
          return
        })
        .catch(err => {
          this.$message({
            message: err.message,
            type: 'error'
          })
        })
    }
  }

  getColumnData(row: any, code: any): string {
    if (code === 'ryts') {
      const rysj = moment(row.rysj)
      return moment(new Date()).diff(rysj, 'days') + ''
    } else {
      return row[code] || '-'
    }
  }
  /**
   * @name: columnClick
   * @test: test font
   * @msg: 行点击事件 跳转患者详情
   * @param {void}
   * @return: void
   */
  private columnClick(row): void {
    const params = {
      patid: row.patid,
      jzlb: row.jzlb,
      yljgdm: row.yljgdm,
      jzlsh: row.jzlsh,
      yexh: row.yexh || 0
    }
    this.getPatientInfo(params)
      .then(() => {
        this.$router.push('/treatInfo')
        return
      })
      .catch(err => {})
  }
}
</script>

<style lang="scss" scoped>
.detail-normal {
  .el-table {
    max-height: 100%;
  }
  .bed-no {
    position: relative;
    display: inline-block;
    min-width: 0.3125rem;
    height: 0.14583rem;
    line-height: 0.14583rem;
    text-align: center;
    font-size: 0.10938rem;
    padding: 0 0.03125rem;
    @include bed-no-unfocus;
    @include home-font-color;
    -webkit-box-shadow: 0 0 5px rgba(30, 60, 114, 0.3);
    box-shadow: 0 0 5px rgba(30, 60, 114, 0.3);
    border-radius: 4px;
    margin: 1px;
  }
  .highlight {
    @include bed-no-focus;
    color: white !important;
  }
}
</style>
