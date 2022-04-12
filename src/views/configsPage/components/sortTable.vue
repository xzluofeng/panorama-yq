<!--
 * @Descripttion: 上下移动table
 * @version:
 * @Author: wangqi
 * @Date: 2019-08-13 18:32:54
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-15 14:54:09
 -->
<template>
  <el-table ref="multipleTable" :data="shwoTableList" style="width: 100%">
    <el-table-column :width="55 * sizeMultiple">
      <template slot-scope="scope">
        <el-checkbox
          v-model="scope.row.isShow"
          :true-label="1"
          :false-label="0"
          @change="saveTableList"
        >
        </el-checkbox>
      </template>
    </el-table-column>
    <el-table-column label="排序" :width="180 * sizeMultiple">
      <template slot-scope="scope">
        <i
          v-show="scope.row.isShow === 1"
          :class="[
            'el-icon-sort-up',
            { disabled: scope.row.id === selectStartId }
          ]"
          @click="moveUp(scope.$index)"
        ></i>
        <i
          v-show="scope.row.isShow === 1"
          :class="[
            'el-icon-sort-down',
            { disabled: scope.row.id === selectEndId }
          ]"
          @click="moveDown(scope.$index)"
        ></i>
      </template>
    </el-table-column>
    <el-table-column label="内容" :width="180 * sizeMultiple">
      <template slot-scope="scope">
        {{ scope.row.columnName ? scope.row.columnName : scope.row.name }}
      </template>
    </el-table-column>
    <el-table-column v-if="testClass" prop="groupName" label="分类">
    </el-table-column>
    <el-table-column v-else prop="remark" label="规则"></el-table-column>
  </el-table>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'

@Component({
  name: 'configTable'
})
export default class configTable extends Vue {
  @Prop(Array)
  tableList!: any[]
  @Prop(String)
  moduleCode!: string

  @Prop({
    type: Boolean,
    default: false
  })
  testClass?: boolean

  @State sizeMultiple
  @State yljgdm
  @State associationAreaCode
  @State associationOfficeCode

  /**
   * @name: shwoTableList
   * @test: test font
   * @msg: 用于展示table
   * @param {void}
   * @return: 排序后的数据，选中的在上面（展示）
   */
  get shwoTableList(): any[] {
    if (!this.tableList) {
      return []
    } else {
      return this.tableList.sort((a: any, b: any) => {
        return b.isShow - a.isShow
      })
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
    const _arr =
      this.tableList.filter(item => {
        return item.isShow === 1
      }) || []
    return _arr
  }

  /**
   * @name: selectStartId
   * @test: test font
   * @msg: 选中最前面的字段的字段id，用于移动图标的disable设置
   * @param {void}
   * @return: string
   */
  get selectStartId(): string {
    if (this.selectArr.length) {
      return this.selectArr[0].id
    } else {
      return ''
    }
  }
  /**
   * @name: selectEndId
   * @test: test font
   * @msg: 选中最后面的字段的字段id，用于移动图标的disable设置
   * @param {void}
   * @return: string
   */
  get selectEndId(): string {
    if (this.selectArr.length) {
      return this.selectArr[this.selectArr.length - 1].id
    } else {
      return ''
    }
  }

  /**
   * @name: moveUp
   * @test: test font
   * @msg: 向上移动
   * @param {number}
   * @return: void
   */
  private moveUp(index: number): void {
    if (this.tableList[index].id === this.selectStartId) {
      this.$message({
        message: '已经是第一条，不可上移',
        type: 'warning'
      })
      return
    }
    let temp = this.tableList[index - 1]
    this.$set(this.tableList, index - 1, this.tableList[index])
    this.$set(this.tableList, index, temp)
    this.saveTableList()
  }

  /**
   * 保存配置
   * @param moduleCode 模块id
   */
  private saveTableList(): void {
    //判断是否是病区概览或患者分组
    if (this.moduleCode === 'BQGL' || this.moduleCode === 'HZFZ') {
      this.intoQuotaListData()
    } else if (
      this.moduleCode !== 'BQGL' &&
      this.moduleCode !== 'HZFZ' &&
      this.moduleCode !== 'BQGZ'
    ) {
      const columnList = this.selectArr.map(table => {
        return table.columnCode
      })
      const params = {
        bqdm: this.associationAreaCode,
        ksdm: this.associationOfficeCode,
        yljgdm: this.yljgdm,
        moduleCode: this.moduleCode,
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

  private intoQuotaListData(): void {
    const columnList = this.selectArr.map(table => {
      return table.code
    })
    const params = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm,
      moduleCode: this.moduleCode,
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
   * @name:moveDown
   * @test: test font
   * @msg: 向下移动
   * @param {number}
   * @return: void
   */
  private moveDown(index: number): void {
    if (this.tableList[index].id === this.selectEndId) {
      this.$message({
        message: '已经是最后一条，不可下移',
        type: 'warning'
      })
      return
    }
    let i = this.tableList[index + 1]
    this.$set(this.tableList, index + 1, this.tableList[index])
    this.$set(this.tableList, index, i)
    this.saveTableList()
  }
}
</script>

<style lang="scss" scoped>
.el-icon-sort-up,
.el-icon-sort-down {
  @include el-menu-font-color;
}
.disabled {
  color: #999 !important;
}
</style>
