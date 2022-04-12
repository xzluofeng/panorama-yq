<!--
 * @Descripttion: 内容显示-病区关注-检验类
 * @version:
 * @Author: wangqi
 * @Date: 2019-08-19 10:49:25
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-10 19:54:47
 -->
<template>
  <div class="test-class">
    <el-table
      :data="tableData"
      style="width: 100%; height:100%"
      row-key="id"
      :expand-row-keys="expandRow"
      row-class-name="report_row"
      ref="tableColumn"
    >
      <el-table-column label="报告类别+标本类型">
        <template slot-scope="scope">
          {{ scope.row.bglbmc + '&nbsp;' + scope.row.bblx }}
        </template>
      </el-table-column>
      <el-table-column label="分类" :width="300 * sizeMultiple"
        >检验</el-table-column
      >
      <el-table-column label="选择项目" :width="200 * sizeMultiple">
        <template slot-scope="scope">
          <span class="row-click" @click="rowClick(scope.row)">点击查看</span>
        </template>
      </el-table-column>
      <el-table-column type="expand">
        <template>
          <el-table
            class="expand-table"
            :data="collapseData"
            style="width: 95%"
            :row-class-name="getClassName"
            stripe
          >
            <el-table-column label="项目" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ scope.row.jyzbxmmc }}
              </template>
            </el-table-column>
            <el-table-column
              label="参考值"
              :width="300 * sizeMultiple"
              align="center"
            >
              <template slot-scope="props">
                {{
                  props.row.dl
                    ? `${props.row.jgckzLower}~${props.row.jgckzUpper}`
                    : ''
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="设为关注指标"
              :width="250 * sizeMultiple"
              align="center"
            >
              <template slot-scope="props">
                <i
                  class="icon el-icon-star-on"
                  v-if="props.row.hasFocus === '1'"
                  @click="starClick(props.row)"
                ></i>
                <i
                  class="icon el-icon-star-off"
                  v-else
                  @click="starClick(props.row)"
                ></i>
                <i
                  class="icon el-icon-edit"
                  v-if="props.row.hasFocus === '1' && props.row.dl"
                  @click="setFocus(props.row)"
                ></i>
              </template>
            </el-table-column>
            <el-table-column
              label="设置关注值"
              :width="300 * sizeMultiple"
              align="center"
            >
              <template slot-scope="props">
                {{ getCkzfw(props.row) }}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <!-- <el-table-column width="1"></el-table-column> -->
    </el-table>

    <el-dialog
      :visible.sync="dialogVisible"
      width="40%"
      title="设置关注指标值"
      top="20vh"
    >
      <el-form v-model="focusObj">
        <el-form-item label="项目名称">
          <span class="dialog-name">{{ focusObj.name }}</span>
        </el-form-item>

        <el-radio-group v-model="focusObj.focusType">
          <el-radio :label="1">关注上限</el-radio>
          <el-radio :label="2">关注下限</el-radio>
          <el-radio :label="3">关注上下限</el-radio>
        </el-radio-group>

        <el-form-item label="上限">
          <el-input-number
            v-model="focusObj.max"
            :disabled="focusObj.focusType === 2"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="下限">
          <el-input-number
            v-model="focusObj.min"
            :disabled="focusObj.focusType === 1"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="affirm">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
@Component({
  name: 'testClass'
})
export default class testClass extends Vue {
  @State yljgdm
  @State associationAreaCode
  @State associationOfficeCode
  @State sizeMultiple

  @Prop(String)
  activeQuota!: string

  private tableData: any[] = [] //table数据
  private collapseData: any = [] // 展开行数据
  private expandRow: any = [] // 展开航的id集合
  private dialogVisible: boolean = false // 弹框展示控制
  private focusObj: any = {} // 指标值设置对象 focusType 1：关注上限 2：关注下限 3：关注上下限
  private activedBblx: string = '' //展开的标本类型
  private defaultQuota: string = '' //默认的指标
  private contentContainer: any = null
  private offsetTopList: any[] = []

  mounted() {
    this.getTableData()
    // this.expandRow.push(this.tableData[1].id)
  }

  @Watch('activeQuota')
  setQuota(newVal) {
    this.setActiveQuota(newVal)
  }

  /**
   * 设置关注范围显示内容
   */
  private getCkzfw(row: any): string {
    if (row.deptFocusConfigEntity && row.dl) {
      if (row.deptFocusConfigEntity.gzfw === 1) {
        return '小于' + row.deptFocusConfigEntity.ckzUpper
      } else if (row.deptFocusConfigEntity.gzfw === 2) {
        return '大于' + row.deptFocusConfigEntity.ckzLower
      } else {
        return (
          row.deptFocusConfigEntity.ckzLower +
          '~' +
          row.deptFocusConfigEntity.ckzUpper
        )
      }
    } else if (row.deptFocusConfigEntity && !row.dl) {
      return '仅关注异常值'
    }
    return ''
  }

  /**
   * 定位展开的报告
   */
  private scrollToActived(index: number): void {
    this.offsetTopList = []
    let group = document.querySelectorAll('.report_row')
    group.forEach((item: any, index) => {
      this.offsetTopList.push({
        top: item.offsetTop,
        height: item.offsetHeight,
        index: index
      })
    })
    let paddHeight = 0
    if (this.contentContainer) {
      paddHeight =
        this.contentContainer.$el.offsetHeight -
        this.offsetTopList[this.offsetTopList.length - 1].height
    }

    if (paddHeight > 0) {
      this.contentContainer.$el.style.paddingBottom = paddHeight + 20 + 'px'
    }
    if (index > -1) {
      this.contentContainer.$el.scrollTop = this.offsetTopList[index].top + 42
    }
  }
  /**
   * 设置展开的指标
   */
  private setActiveQuota(newVal: string): void {
    let arr = newVal.split(',')
    const bglbdm = arr[0]
    const bblx = arr[1]
    this.defaultQuota = arr[2]
    const index = this.tableData.findIndex((item: any) => {
      return item.bglbdm === bglbdm && item.bblx === bblx
    })
    if (index !== -1) {
      if (
        !this.expandRow.length ||
        this.tableData[index].id !== this.expandRow[0]
      ) {
        this.rowClick(this.tableData[index])
      }
      this.$nextTick(() => {
        this.contentContainer = this.$refs.tableColumn
        this.scrollToActived(index)
      })
    }
  }

  /**
   * 设置行类名
   */
  private getClassName({ row, rowIndex }): string {
    if (row.jyzbxmdm === this.defaultQuota) {
      return 'activedQuota'
    } else {
      return ''
    }
  }

  /**
   * @name:getTableData
   * @test: test font
   * @msg: 获取table数据
   * @param {void}
   * @return: void
   */
  private getTableData(): void {
    const params = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm
    }
    this.$api
      .getLisReportByDept(params)
      .then(res => {
        if (res.data) {
          this.tableData = res.data
        }
        return
      })
      .catch(err => {
        this.$message({
          message: err.data,
          type: 'error'
        })
      })
  }

  /**
   * @name:getCollapseData
   * @test: test font
   * @msg: 获取折叠行数据
   * @param {void}
   * @return: void
   */
  private getCollapseData(row): Promise<any> {
    const params = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm,
      bblx: this.activedBblx ? this.activedBblx : '',
      bglbdm: row.bglbdm,
      bgdh: row.bgdh,
      sysId: row.sysId,
      wswbgbz: row.wswbgbz
    }
    return new Promise((resolve, reject) => {
      this.$api
        .getDeptFocusByBglbdm(params)
        .then(res => {
          if (res.data) {
            this.collapseData = res.data
            resolve()
          }
          return
        })
        .catch(err => {
          this.$message({
            message: err.data,
            type: 'error'
          })
          reject()
        })
    })
  }

  /**
   * @name:moveDrowClickown
   * @test: test font
   * @msg: table行点击事件
   * @param {object}
   * @return: void
   */
  private async rowClick(row) {
    const _index = this.expandRow.indexOf(row.id)
    this.activedBblx = row.bblx
    if (_index < 0) {
      await this.getCollapseData(row)
      this.expandRow = []
      this.expandRow.push(row.id)
    } else {
      this.expandRow.splice(_index, 1)
    }
  }

  /**
   * @name:setFocus
   * @test: test font
   * @msg: 点击修改指标
   * @param {void}
   * @return: void
   */
  private setFocus(row: any) {
    this.focusObj = JSON.parse(JSON.stringify(row))
    if (this.focusObj.deptFocusConfigEntity) {
      this.$set(
        this.focusObj,
        'min',
        this.focusObj.deptFocusConfigEntity.ckzLower
      )
      this.$set(
        this.focusObj,
        'max',
        this.focusObj.deptFocusConfigEntity.ckzUpper
      )
      this.$set(
        this.focusObj,
        'focusType',
        this.focusObj.deptFocusConfigEntity.gzfw
      )
    } else {
      this.$set(this.focusObj, 'min', this.focusObj.jgckzLower)
      this.$set(this.focusObj, 'max', this.focusObj.jgckzUpper)
      this.$set(this.focusObj, 'focusType', 3)
    }
    this.dialogVisible = true
  }

  /**
   * 小星星点击事件
   *
   */
  private starClick(row: any): void {
    if (row.hasFocus === '1') {
      row.hasFocus = '0'
    } else {
      row.hasFocus = '1'
    }
    //取消关注
    if (!row.dl || row.hasFocus === '0') {
      this.focusObj = JSON.parse(JSON.stringify(row))
      this.$set(this.focusObj, 'focusType', 0)
      this.affirm()
    }
  }
  /**
   * @name:affirm
   * @test: test font
   * @msg: 弹框点击确认
   * @param {void}
   * @return: void
   */
  private affirm(): void {
    if (this.focusObj.focusType === 1) {
      this.focusObj.min = ''
    } else if (this.focusObj.focusType === 2) {
      this.focusObj.max = ''
    } else if (this.focusObj.focusType === 3) {
      if (this.focusObj.min >= this.focusObj.max) {
        this.$alert('下限必须小于上限！')
        return
      }
    }

    const params = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm,
      bglbdm: this.focusObj.bglbdm,
      bblx: this.activedBblx,
      focusType: this.focusObj.focusType ? this.focusObj.focusType : 0,
      ckzLower: this.focusObj.min ? this.focusObj.min : '',
      ckzUpper: this.focusObj.max ? this.focusObj.max : '',
      jyzbxmdm: this.focusObj.jyzbxmdm,
      jyzbxmmc: this.focusObj.jyzbxmmc,
      isDl: this.focusObj.dl ? 1 : 0,
      hasFocus: this.focusObj.hasFocus,
      wswbgbz: this.focusObj.wswbgbz
    }

    this.$api
      .intoLisFocus(params)
      .then(res => {
        this.$message({
          message: res.data,
          type: 'info'
        })
        this.dialogVisible = false
        if (this.focusObj.dl) {
          //设置页面参考值显示刷新
          if (this.focusObj.hasFocus === '0') {
            this.focusObj.deptFocusConfigEntity = null
          } else {
            this.focusObj.deptFocusConfigEntity = {
              ckzLower: this.focusObj.min,
              ckzUpper: this.focusObj.max,
              gzfw: this.focusObj.focusType
            }
          }
          const index: any = this.collapseData.findIndex((item: any) => {
            return this.focusObj.id === item.id
          })
          this.$set(this.collapseData, index, this.focusObj)
        }
        return
      })
      .catch(err => {
        this.$message({
          message: err.data,
          type: 'error'
        })
        this.dialogVisible = false
      })
  }
}
</script>

<style lang="scss" scoped>
.test-class {
  overflow: hidden;
  height: 100%;
  .row-click {
    display: inline-block;
    cursor: pointer;
    padding-bottom: 2px;
    border-bottom: 1px solid #606266;
  }

  // 折叠 关注，未关注，编辑样式
  .icon {
    cursor: pointer;
    font-size: 26px;
    color: #409eff;
  }

  // 折叠table样式
  .expand-table {
    margin: 0 auto;
    border: 1px solid #ccc;
  }

  // 弹框标题
  .dialog-name {
    font-size: 18px;
  }

  .el-radio-group {
    margin-left: 90px;
    margin-bottom: 20px;
  }
  .el-form-item {
    padding-left: 20px;
  }
  .el-table .activedQuota {
    background: oldlace;
  }
}
</style>
