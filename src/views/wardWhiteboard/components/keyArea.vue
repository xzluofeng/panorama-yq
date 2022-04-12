<!--
 * @Descripttion: 左下重点展示区域
 * @version:
 * @Author: wangqi
 * @Date: 2019-08-01 14:34:41
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-15 16:32:12
 -->
<template>
  <div
    class="key-area"
    @mousemove="mousemove"
    @click="setTimer"
    @mouseenter="setTimer"
  >
    <!-- tab 菜单项 -->
    <ul class="title-container flex">
      <li
        v-for="item in keyAreaModuleList"
        :key="item.moduleCode"
        :class="[
          'key-title',
          { active: keyActiveModuleCode === item.moduleCode },
          'flex',
          'flex-align-center'
        ]"
        @click="titleClick(item.moduleCode)"
      >
        <i :class="['module-icon', `module-${item.moduleCode}`]"></i>
        <span class="module-name">{{ item.moduleName }}</span>
      </li>
    </ul>
    <!-- table 展示表格 -->
    <el-table
      :class="['type-table', `fs-${fontSize}`]"
      id="marqueeDom"
      :data="keyAreaData.detail"
      :show-header="false"
      :empty-text="emptyText"
    >
      <el-table-column
        label="床位号"
        align="left"
        :width="
          keyAreaData.columns && keyAreaData.columns.length
            ? 120 * sizeMultiple
            : 150 * sizeMultiple
        "
      >
        <template slot-scope="scope">
          <bedNo
            :data="scope.row"
            :jump="false"
            @click.native="
              toDetail(scope.row.rycw || scope.row.cycw || scope.row.cwdm)
            "
          />
        </template>
      </el-table-column>
      <!-- 需要特别展示的 -->
      <template v-for="item in keyAreaData.columns">
        <el-table-column
          :key="item.columnCode"
          v-if="item.columnCode === 'hzxm'"
          label="姓名"
          :width="160 * sizeMultiple"
        >
          <!-- 患者姓名 -->
          <template slot-scope="scope">
            <span class="name-pref">患者：</span>
            <span class="name">{{ scope.row.hzxm }}</span>
          </template>
        </el-table-column>
        <!-- 预约检查 - 已出报告，后面需要添加报告号，点击直接跳转 -->
        <!-- <el-table-column
          :key="item.columnCode"
          v-else-if="
            keyActiveModuleCode === 'YYJC' && item.columnCode === 'bgzt'
          "
          label="姓名"
          :width="160 * sizeMultiple"
        >
          <template slot-scope="scope"> </template>
        </el-table-column> -->
        <!-- 就诊医生 -->
        <el-table-column
          :key="item.columnCode"
          v-else-if="item.columnCode === 'jzysmc'"
          label="医生"
          :width="180 * sizeMultiple"
        >
          <template slot-scope="scope">
            <div class="doctor-box flex flex-align-center">
              <div
                :class="['doctor-icon', { female: scope.row.sex === '女' }]"
              ></div>
              <div class="doctor-name">{{ scope.row.jzysmc }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :key="item.columnCode" v-else>
          <template slot-scope="scope">
            <span class="content">{{ scope.row[item.columnCode] }}</span>
          </template>
        </el-table-column>
      </template>
      <!-- <el-table-column label="内容">
        <template slot-scope="scope">
          <span class="content">{{ scope.row.nr }}</span>
        </template>
      </el-table-column> -->
      <!-- 手术状态 -->
      <!-- <el-table-column label="状态" :width="80 * sizeMultiple" align="center">
        <template slot-scope="scope">
          <i
            :class="[
              'icon-status',
              scope.row.status === '0'
                ? 'ss-yy'
                : scope.row.status === '1'
                ? 'ss-jx'
                : 'ss-js'
            ]"
          ></i>
        </template>
      </el-table-column> -->
      <!-- 手术时间 -->
      <!-- <el-table-column label="时间" :width="140 * sizeMultiple" align="center">
        <template slot-scope="scope">
          <span class="type-time">{{ scope.row.sj }}</span>
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State } from 'vuex-class'
import { debounce } from '../../../libs/utils'
import marquee from '../../../mixin/marquee'
import bedNo from '../../../components/bedNoCell.vue'
@Component({
  name: 'keyArea',
  components: {
    bedNo
  },
  mixins: [marquee]
})
// todo 需要穷举所有模块 需要特别展示的列
export default class keyArea extends Vue {
  @State sizeMultiple
  @State updateData
  @State yljgdm
  @State associationAreaCode
  @State associationOfficeCode
  @State isScrolling
  @State fontSize

  private keyAreaData: any = {} // 重点区域数据
  private keyActiveModuleCode: string = '' // 激活展示模块代码
  private emptyText: string = ' ' // 无数据提示语
  private update: boolean = false // 第一次updateData不请求
  private keyAreaModuleList: any[] = [] // 重点区域模块列表

  @Watch('updateData')
  async onChangeValue(newVal: any) {
    if (this.update) {
      this.emptyText = ' '
      if (newVal.showLoading) {
        this.keyAreaModuleList = []
        this.keyAreaData = []
        await this.getAreaConfig('MAIN')
      }
      this.getKeyAreaData(newVal.showLoading)
    }
    this.update = true
  }

  @Watch('isScrolling')
  scrollChange(newVal) {
    if (newVal) {
      this.$nextTick(() => {
        this.domContainer = this.$refs.marqueeDom
        this.setTimer()
      })
    } else {
      this.$nextTick(() => {
        this.domContainer = this.$refs.marqueeDom
        this.cleanTimer()
      })
    }
  }

  @Watch('$route')
  routerChange(newVal) {
    if (this.isScrolling) {
      this.cleanTimer()
    }
    if (newVal.name === 'wardWhiteboard' && this.isScrolling) {
      this.$nextTick(() => {
        this.domContainer = this.$refs.marqueeDom
        this.setTimer()
      })
    }
  }

  // /**
  //  * @name: activeShowData
  //  * @test: test font
  //  * @msg: 展示中的数据
  //  * @param {void}
  //  * @return: array
  //  */
  // get activeShowData(): object {
  //   // const showData: any = this.keyAreaData.find(item => {
  //   //   return item.moduleCode === this.keyActiveModuleCode
  //   // })
  //   // if (this.keyAreaData == null || this.keyAreaData.detail == null) {
  //   //   return {}
  //   // } else {
  //   //   if (this.keyAreaData.columns != null) {
  //   //     showData.columns = showData.columns.split(',')
  //   //   }
  //   //   return showData
  //   // }
  // }
  async mounted() {
    await this.getAreaConfig('MAIN')
    this.getKeyAreaData(true)
  }

  mousemove() {
    if (this.isScrolling) {
      debounce(this.setTimer, 100)
    }
  }

  /**
   * @name: getKeyAreaData
   * @test: test font
   * @msg: 获取重点区域数据
   * @param {viod}
   * @return: void
   */
  private getKeyAreaData(showLoading: boolean): void {
    const params = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm,
      moduleCode: this.keyActiveModuleCode
    }
    this.keyAreaData = []
    this.$api
      .getMainData(params, showLoading)
      .then(res => {
        if (
          res.data &&
          res.data.columns &&
          res.data.columns.length > 0 &&
          res.data.detail &&
          res.data.detail.length > 0
        ) {
          this.keyAreaData = res.data
          if (this.isScrolling) {
            this.$nextTick(() => {
              this.domContainer = document.getElementById('marqueeDom')
              this.setTimer()
            })
          }
        } else {
          this.emptyText = '暂无数据'
        }
        return
      })
      .catch(err => {
        this.emptyText = '页面无响应'
      })
  }
  private getAreaConfig(areaCode): Promise<any> {
    return new Promise((resolve, reject) => {
      this.$api
        .getAreaConfig(
          areaCode,
          this.associationAreaCode,
          this.associationOfficeCode,
          this.yljgdm
        )
        .then(res => {
          const _res = res.data
          if (_res != null) {
            this.keyAreaModuleList = _res
            if (_res.length > 0) {
              this.keyActiveModuleCode = _res[0].moduleCode
            }
            resolve()
          } else {
            reject()
          }
          return
        })
        .catch(err => {
          this.emptyText = '页面无响应'
          reject()
        })
    })
  }

  /**
   * @name: toDetail
   * @test: test font
   * @msg: 跳转二级页面
   * @param {typeIndex} number
   * @return: void
   */
  toDetail(bedNo: string): void {
    const moduleObj = this.keyAreaModuleList.find(item => {
      return item.moduleCode === this.keyActiveModuleCode
    })
    const moduleName = moduleObj.moduleName || ''
    // isJy 1、检验  0、非检验
    let param = {
      moduleName: moduleName,
      groupName: '',
      bedNo: bedNo,
      isJy: '0'
    }
    this.$router.push({
      path: '/areaDetail',
      query: param
    })
  }

  /**
   * @name: titleClick
   * @test: test font
   * @msg: 点击模块标题
   * @param {viod}
   * @return: void
   */
  private titleClick(moduleCode): void {
    if (this.keyActiveModuleCode === moduleCode) {
      const moduleObj = this.keyAreaModuleList.find(item => {
        return item.moduleCode === moduleCode
      })
      const moduleName = moduleObj.moduleName || ''
      // todo 跳转二级页面
      const param = {
        moduleName: moduleName,
        groupName: '',
        bedNo: '',
        isJy: '0'
      }
      this.$router.push({
        path: '/areaDetail',
        query: param
      })
    } else {
      this.keyActiveModuleCode = moduleCode
      this.getKeyAreaData(true)
    }
  }
}
</script>

<style lang="scss" scoped>
.key-area {
  position: relative;
  height: 100%;
  overflow-y: auto;
  padding: 65px 20px 10px 15px;
  border-radius: 4px;
  @include home-content-bg;
  .el-table {
    background-color: Transparent;
  }
  .title-container {
    position: absolute;
    top: 15px;
    left: 25px;
    right: 0;
    height: 50px;
    font-size: 0;
    li {
      padding: 0 10px;
      height: 50px;
      @include home-title-font-color;
      font-size: 24px;
      flex-shrink: 0;
      margin-right: 28px;
      border-bottom: 3px solid transparent;
      &.active {
        @include home-title-border-color;
      }
    }
    .module-name {
      margin-left: 10px;
      margin-right: 5px;
    }
  }
  .type-table {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    @include puhui-r;
    .bed-no {
      @include bed-no-focus;
      text-align: center;
      color: #fff;
    }
    .name-pref {
      @include home-title-s-font-color;
    }
    .name,
    .type-time {
      @include home-title-font-color;
    }
    .content {
      @include home-title-s-font-color;
    }
    .doctor-box {
      width: 124px;
      height: 30px;
      background-color: #e8f2ff;
      overflow: hidden;
      margin: 0 auto;
      border-radius: 4px;
      .doctor-icon {
        width: 37px;
        height: 30px;
        background-color: #9cc7f7;
        background-image: url('../../../assets/images/icon-male-doc.png');
        background-size: 25px 25px;
        background-position: center;
        background-repeat: no-repeat;
        flex-shrink: 0;
        &.female {
          background-image: url('../../../assets/images/icon-female-doc.png');
        }
      }
      .doctor-name {
        @include home-title-font-color;
        margin-left: 8px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .icon-status {
      display: inline-block;
      width: 55px;
      height: 25px;
      background-size: cover;
      vertical-align: middle;
    }
    // 预约
    .ss-yy {
      background-image: url('../../../assets/images/ss-yy.png');
    }
    // 进行中
    .ss-jx {
      background-image: url('../../../assets/images/ss-jx.png');
    }
    // 完成
    .ss-js {
      background-image: url('../../../assets/images/ss-js.png');
    }
  }
}
</style>
