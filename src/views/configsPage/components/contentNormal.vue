<!--
 * @Descripttion: 显示内容-非病区关注配置
 * @version:
 * @Author: wangqi
 * @Date: 2019-08-13 18:44:55
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-15 14:24:16
 -->
<template>
  <div class="config-normal">
    <p class="title" v-if="moudleId === 'BQTT'">CIS交班时，无需配置</p>
    <sortTable :tableList="tableList" :moduleCode="moudleId" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import sortTable from './sortTable.vue'
@Component({
  name: 'configNormal',
  components: {
    sortTable
  }
})
export default class configNormal extends Vue {
  @State yljgdm
  @State associationAreaCode
  @State associationOfficeCode

  @Prop(String)
  moudleId!: string

  private tableList: any[] = [] // 表格数据

  @Watch('$route')
  onChangeValue(newVla: any, oldVla: any): void {
    // this.saveTableList(oldVla.params.moudleId)
    if (
      newVla.params.moudleId === 'BQGL' ||
      newVla.params.moudleId === 'HZFZ'
    ) {
      this.getQuotaListData()
    } else {
      this.getTableListData()
    }
  }

  // beforeDestroy() {
  //   this.saveTableList(this.moudleId)
  // }

  mounted() {
    if (this.moudleId === 'BQGL' || this.moudleId === 'HZFZ') {
      this.getQuotaListData()
    } else {
      this.getTableListData()
    }
  }

  /**
   * @name: selectArr
   * @test: test font
   * @msg: 选中的对象
   * @param {void}
   * @return: []
   */
  get selectArr(): any[] {
    const _arr = this.tableList.filter(item => {
      return item.isShow === 1
    })
    return _arr
  }

  /**
   * 获取病区概览和患者分组指标配置
   */
  private getQuotaListData(): void {
    const params = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm,
      moduleCode: this.moudleId,
      groupCode: ''
    }
    this.$api
      .getFocusOtherList(params)
      .then(res => {
        if (res.data) {
          this.tableList = res.data
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

  private intoQuotaListData(moduleCode: string): void {
    const columnList = this.selectArr.map(table => {
      return table.code
    })
    const params = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm,
      moduleCode: moduleCode,
      groupCode: '',
      codeList: columnList.join(',')
    }
    this.$api
      .intoFocusOtherList(params)
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

  /**
   * @name: getTableListData
   * @test: test font
   * @msg: 获取配置数据
   * @param {void}
   * @return: void
   */
  private getTableListData(): void {
    const params = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm,
      moduleCode: this.moudleId
    }
    this.$api
      .getModuleColumnConfigList(params)
      .then(res => {
        if (res.data) {
          this.tableList = res.data
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

  /**
   * 保存配置
   * @param moduleCode 模块id
   */
  private saveTableList(moduleCode: string): void {
    //判断是否是病区概览或患者分组
    if (moduleCode === 'BQGL' || moduleCode === 'HZFZ') {
      this.intoQuotaListData(moduleCode)
    } else {
      const columnList = this.selectArr.map(table => {
        return table.columnCode
      })
      const params = {
        bqdm: this.associationAreaCode,
        ksdm: this.associationOfficeCode,
        yljgdm: this.yljgdm,
        moduleCode: moduleCode,
        columnCodeList: columnList.join(',')
      }
      this.$api
        .intoModuleColumnConfig(params)
        .then(res => {
          return
        })
        .catch(err => {
          this.$message({
            message: err.data,
            type: 'error'
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.config-normal {
  padding: 25px;
  height: 100%;
  overflow: hidden;
  .el-table {
    max-height: 100%;
  }
  .title {
    font-size: 18px;
    color: #409eff;
    margin-bottom: 15px;
  }
}
</style>
