<!--
 * @Descripttion: 床位列表
 * @version:
 * @Author: wangqi
 * @Date: 2019-08-01 16:31:38
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-01 16:32:26
 -->
<template>
  <div class="bed-list">
    <el-table
      :class="`fs-${fontSize}`"
      :data="tableData"
      :empty-text="emptyText"
      style="width: 100%;"
      height="100%"
    >
      <el-table-column
        v-if="tableData.length"
        label="床位"
        :width="titleArr.length ? 180 * sizeMultiple : ''"
        align="center"
      >
        <template slot-scope="scope">
          <bedNo :data="scope.row" />
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in titleArr"
        :key="index"
        :label="item.columnName"
      >
        <template slot-scope="scope">
          {{
            item.columnCode === 'hzxx'
              ? scope.row.hzxx
              : item.columnCode === 'ryts'
              ? scope.row.ryts
              : item.columnCode === 'bqgz'
              ? scope.row.bqgz
              : item.columnCode === 'bqjc'
              ? scope.row.bqjc
              : item.columnCode === 'bqss'
              ? scope.row.bqss
              : item.columnCode === 'bqgk'
              ? scope.row.bqgk
              : ''
          }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="tableData.length && bandUrl && bandUrl.enable"
        label="位置轨迹"
        :width="titleArr.length ? 120 * sizeMultiple : ''"
        align="center"
      >
        <template slot-scope="scope">
          <i class="el-icon-position" @click="trailPatient(scope.row)"></i>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="hzxx" label="基本信息" :width="180 * sizeMultiple">
      </el-table-column>
      <el-table-column prop="address" label="诊疗次数"> </el-table-column>
      <el-table-column prop="address" label="主诊断"> </el-table-column>
      <el-table-column prop="address" label="辅诊断"> </el-table-column>
      <el-table-column prop="address" label="床位医生"> </el-table-column>
      <el-table-column prop="address" label="标记"> </el-table-column> -->
    </el-table>

    <!-- <el-radio-group v-model="selectGroup">
      <el-radio label="">全部</el-radio>
      <el-radio
        v-for="(item, index) in doctorGroup"
        :key="index"
        :label="item.key"
      >
        {{ item.label }}
      </el-radio>
    </el-radio-group> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State } from 'vuex-class'
import bedNo from '../../components/bedNoCell.vue'

@Component({
  name: 'bedList',
  components: {
    bedNo
  }
})
// todo 诊疗组暂时没有数据，后续添加调试
export default class bedList extends Vue {
  @State yljgdm
  @State associationAreaCode
  @State associationOfficeCode
  @State sizeMultiple
  @State fontSize
  @State customConfig

  private doctorGroup: object[] = [] // 诊疗组
  private selectGroup: string = '' // 选中的诊疗组序号
  private tableData: object[] = [] // 床位列表数据
  private emptyText: string = ' ' // 无数据提示语
  private titleArr: any[] = [] // 表头

  mounted() {
    this.getTableData()
  }

  @Watch('selectGroup')
  groupIdChange(newVal) {
    this.getTableData()
  }

  get bandUrl(): any {
    return this.customConfig.find(item => {
      return item.code === 'band_url'
    })
  }

  /**
   * @name:getTableData
   * @test: test font
   * @msg: 获取床位列表数据
   * @param {void}
   * @return: void
   */
  private getTableData() {
    this.emptyText = ' '
    const params = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm
    }
    this.$api
      .getZyCwList(params)
      .then(res => {
        this.emptyText = '暂无数据'
        if (res.data && res.data.data) {
          this.tableData = res.data.data || []
          this.titleArr = res.data.columns
        }
        return
      })
      .catch(err => {
        this.emptyText = '页面无响应'
        this.$message({
          message: '获取床位列表失败！',
          type: 'error'
        })
      })
  }

  /**
   * @name:getGroupData
   * @test: test font
   * @msg: 获取诊断组数据
   * @param {void}
   * @return: void
   */
  private getGroupData() {
    const params = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm
    }
    this.$api
      .getBedList(params)
      .then(res => {
        this.emptyText = '暂无数据'
        const _res = res.data || []
        _res.forEach(item => {
          item.syzt = item.zlzcwysEntityList[0].syzt
        })
        const _data = _res.filter(item => {
          return item.syzt === '1'
        })
        const target: any = []
        _data.forEach(item => {
          let nameArr: string[] = []
          item.zlzysysEntityList.forEach(groupItem => {
            nameArr.push(groupItem.ysmc)
          })
          let _obj = {
            key: item.zlzxh,
            label: nameArr.join(',')
          }
          target.push(_obj)
        })
        this.doctorGroup = target
        return
      })
      .catch(err => {
        this.emptyText = '页面无响应'
      })
  }

  private trailPatient(row: any): void {
    let url =
      this.bandUrl.value +
      '/iotp/locate/trailPatient?bqdm=' +
      row.bqdm +
      '&patientId=' +
      row.patid +
      '&yexh=' +
      row.yexh
    window.open(url)
  }

  /**
   * @name:getDetailList
   * @test: test font
   * @msg: 获取表头数据
   * @param {void}
   * @return: void
   */
  private getDetailList(): void {
    const params = {
      ksdm: this.associationOfficeCode,
      bqdm: this.associationAreaCode,
      yljgdm: this.yljgdm,
      moduleCode: 'CWLB',
      quotaCode: ''
    }
    this.$api
      .handleQuota(params)
      .then(res => {
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
</script>

<style lang="scss" scoped>
.bed-list {
  position: relative;
  padding-bottom: 50px !important;
  @include home-content-bg;
  margin: 20px 15px 0;
  box-shadow: 0 2px 4px rgba(30, 60, 114, 0.4);
  border-radius: 4px;
  height: 100%;
  overflow-y: auto;
  .el-radio-group {
    position: absolute;
    bottom: 20px;
    left: 20px;
  }
  .el-table {
    background-color: Transparent;
    @include el-table-font-color;
    max-height: 100%;
  }
  .bed-no {
    margin: 1px;
  }
  .el-icon-position {
    cursor: pointer;
    @include el-table-font-color;
  }
}
</style>
