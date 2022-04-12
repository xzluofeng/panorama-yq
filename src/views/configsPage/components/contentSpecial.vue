<!--
 * @Descripttion: 内容显示-病区关注
 * @version:
 * @Author: wangqi
 * @Date: 2019-08-13 18:49:25
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-13 19:54:47
 -->
<template>
  <div class="content-special flex flex-v">
    <p class="title">{{ titleContent }}</p>
    <div class="focus-content flex-1">
      <testClass v-if="activeTypeIndex === '0'" :activeQuota="activeQuota" />
      <sortTable
        :testClass="true"
        v-else
        :tableList="tableList"
        :moduleCode="`BQGZ`"
      />
    </div>
    <el-tabs tab-position="bottom" v-model="activeTypeIndex">
      <el-tab-pane
        v-for="(item, index) in typeArr"
        :key="index"
        :label="item"
        :name="'' + index"
      >
      </el-tab-pane>
    </el-tabs>
    <el-select
      v-model="searchValue"
      class="search-box"
      filterable
      remote
      reserve-keyword
      placeholder="请输入检验指标"
      :remote-method="doSearch"
      :loading="loading"
      v-if="activeTypeIndex === '0'"
      @change="changeSelect"
    >
      <el-option
        v-for="item in searchList"
        :key="item.id"
        :label="item.bglbmc + item.bblx + ' ' + item.jyzbxmmc"
        :value="item.bglbdm + ',' + item.bblx + ',' + item.jyzbxmdm"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import sortTable from './sortTable.vue'
import testClass from './testClass.vue'

@Component({
  name: 'contentSpecial',
  components: {
    sortTable,
    testClass
  }
})
export default class contentSpecial extends Vue {
  @State yljgdm
  @State associationAreaCode
  @State associationOfficeCode

  @Prop(Object)
  moudleObj!: object

  @Prop(String)
  moudleId!: string

  private tableList: any[] = [] // 表格数据
  private typeArr: any[] = [
    '检验类',
    '检查类',
    '患者相关类',
    '医嘱类',
    '护理单类'
  ] // 类型数据
  private activeTypeIndex: string = '0' // 激活展示类型index
  private searchList: object[] = [] //搜索框的内容列表
  private searchValue: string = '' //选中的指标
  private loading: boolean = false //加载状态
  private activeQuota: string = '' //选中的指标

  @Watch('activeTypeIndex')
  activeIndexChange(newVal: any, oldVal: any): void {
    if (oldVal !== '0') {
      this.intoFocusOtherList(oldVal)
    }
    if (newVal !== '0') {
      this.getTableListData(newVal)
    }
  }

  beforeDestroy() {
    if (this.activeTypeIndex !== '0') {
      this.intoFocusOtherList(this.activeTypeIndex)
    }
  }

  /**
   * @name: titleContent
   * @test: test font
   * @msg: 提示标题
   * @param {void}
   * @return: void
   */
  get titleContent(): string {
    const content = [
      '请找出相关单子，再找对应指标，如有符合的指标，在区期间会一直显示，直至指标正常',
      '取最近一次录入的记录，如有符合的单子，在区期间会一直显示，直至单子正常',
      '取最近一次录入的记录，如有符合的单子，在区期间会一直显示，直至单子正常',
      '取最近一次录入的记录，如有符合的单子，在区期间会一直显示，直至单子正常',
      '取最近一次录入的记录，如有符合的单子，在区期间会一直显示，直至单子正常'
    ]
    return content[this.activeTypeIndex]
  }

  mounted() {}

  /**
   * @name: getTableListData
   * @test: test font
   * @msg: 获取配置数据
   * @param {void}
   * @return: void
   */
  private getTableListData(typeIndex: any): void {
    const params = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm,
      moduleCode: this.moudleId,
      groupCode: this.getGroupCode(typeIndex)
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

  /**
   * 筛选事件
   */
  private changeSelect(val): void {
    this.activeQuota = val
  }

  /**
   * 模糊查询检验指标
   */
  private doSearch(searchKey): void {
    this.loading = true
    const params = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm,
      searchKey: searchKey
    }
    this.$api
      .searchBySearchKey(params)
      .then(res => {
        this.loading = false
        if (res.data) {
          this.searchList = res.data
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
   * 修改关注内容
   */
  private intoFocusOtherList(typeIndex: any): void {
    const columnList = this.selectArr.map(table => {
      return table.code
    })
    const params = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm,
      moduleCode: this.moudleId,
      groupCode: this.getGroupCode(typeIndex),
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
   *  获取分组代码
   * @param index 类别序号
   */
  private getGroupCode(index: any): string {
    if (index === '1') {
      return 'JC'
    } else if (index === '2') {
      return 'HZXG'
    } else if (index === '3') {
      return 'YZ'
    } else if (index === '4') {
      return 'HLD'
    }
    return ''
  }
}
</script>

<style lang="scss" scoped>
.content-special {
  padding: 25px;
  height: 100%;
  overflow: hidden;
  .title {
    font-size: 18px;
    color: #409eff;
    margin-bottom: 15px;
  }
  .el-tabs__item {
    font-size: 18px;
  }
  .focus-content {
    overflow: auto;
  }
  .search-box {
    right: 45px;
    bottom: 35px;
    width: 193px;
    position: absolute;
  }
}
</style>
