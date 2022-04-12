<!--
 * @Descripttion: 二级明细页面
 * @version:
 * @Author: wangqi
 * @Date: 2019-07-16 15:50:16
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-09 13:57:02
 -->
<template>
  <div :class="['area-detail', 'flex', { 'flex-reverse': rightHandType }]">
    <div :class="['menu-container', 'flex', 'flex-v']">
      <div
        :class="[
          'detail-left',
          'flex',
          'flex-1',
          { 'flex-reverse': rightHandType }
        ]"
      >
        <div class="menu flex-1">
          <el-menu :default-openeds="['menu-BQGZ']" @select="selectTab">
            <el-menu-item
              v-for="(relation, relationindex) in relationList"
              :key="relationindex"
              :index="relationindex + ''"
              :id="relationindex + ''"
            >
              <span slot="title">{{ relation.type }}</span>
            </el-menu-item>
            <el-submenu key="menu-BQGZ" index="menu-BQGZ" v-if="!hasBqgz">
              <template slot="title">
                <span>病区关注</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  v-for="(LisFocus, index) in LisFocusList"
                  :key="`content-${index}`"
                  :index="`lis-${LisFocus.jyzbxmdm}`"
                  :id="`lis-${LisFocus.jyzbxmdm}`"
                >
                  {{ LisFocus.jyzbxmmc }}
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu key="menu-BQGZ" index="menu-BQGZ" v-else>
              <template slot="title">
                <span>病区关注</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  v-for="(bqgz, bqgzIndex) in bqgzList"
                  :key="`content-${bqgzIndex}`"
                  :index="`bqgz-${bqgzIndex}`"
                  :id="`bqgz-${bqgzIndex}`"
                >
                  {{ bqgz.quotaName }}
                </el-menu-item>
                <el-menu-item
                  v-for="(LisFocus, index) in LisFocusList"
                  :key="`lis-${index}`"
                  :index="`lis-${LisFocus.jyzbxmdm}`"
                  :id="`lis-${LisFocus.jyzbxmdm}`"
                >
                  {{ LisFocus.jyzbxmmc }}
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </div>
        <div
          :class="[
            'bedbar',
            { 'mr-10': rightHandType },
            { 'ml-10': !rightHandType }
          ]"
          v-if="showBedbar"
        >
          <p :class="['reportType', `fs-${fontSize + 2}`]">
            {{ reportType === '1' ? '检验' : '检查' }}
          </p>
          <div class="list-container flex-1 flex flex-align-center">
            <bedNo
              class="mar"
              v-for="(report, reportIndex) in reportList"
              :key="`bedNo${reportIndex}`"
              :data="report.zyjzdjk"
              :jump="false"
              :highlight="report.bgdh === reportData.bgdh"
              @click.native="reportData = report || {}"
            />
            <div
              :class="['no-data', `fs-${fontSize}`]"
              v-if="!reportList.length"
            >
              {{ emptyText }}
            </div>
          </div>
        </div>
      </div>
      <goBack />
    </div>
    <div class="content-container flex flex-v">
      <transition name="el-fade-in-linear">
        <detailNormal
          v-if="activeQuota !== '' && activeQuota !== 'HZFZ' && !isReport"
          :quotaCode="activeQuota"
          :moduleCode="activeModule"
          :activeBedNo="activeBedNo"
        />
        <reportDetail
          v-else-if="activeQuota !== '' && activeQuota !== 'HZFZ' && isReport"
          :report="reportData"
          :moduleCode="activeModule"
          :reportType="reportType"
        />
        <patientGroup
          v-else
          :groupName="$route.query.groupName"
          :activeBedNo="activeBedNo"
        />
      </transition>
      <div
        v-if="!(activeModule === 'BQGZ' || activeModule === 'HZFZ')"
        class="selected-box flex flex-align-center"
      >
        <el-checkbox-group
          :min="1"
          v-model="selectedQuota"
          @change="changeSelectList"
        >
          <el-checkbox
            v-for="quota in moduleQuota"
            :label="quota.code"
            :key="quota.code"
            >{{ quota.name }}</el-checkbox
          >
        </el-checkbox-group>
      </div>
    </div>
    <gFoot />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import goBack from '../../components/goBack.vue'
import gFoot from '../../components/g-foot.vue'
import { sectionalizeArr } from '../../libs/utils'
import bedNo from '../../components/bedNoCell.vue'
import detailNormal from './components/detailNormal.vue'
import reportDetail from './components/reportDetail.vue'
import patientGroup from './components/patientGroup.vue'

@Component({
  name: 'areaDetail',
  components: {
    goBack,
    detailNormal,
    patientGroup,
    bedNo,
    reportDetail,
    gFoot
  }
})
export default class areaDetail extends Vue {
  @State yljgdm
  @State associationAreaCode
  @State associationOfficeCode
  @State fontSize
  @State rightHandType
  @State areaData

  private relationList: any[] = []
  private bqgzList: any[] = [] //病区关注指标集合
  private hasBqgz: boolean = false //是否有病区关注
  private LisFocusList: any[] = [] //检验指标关注
  private activeQuota: string = '' //激活的指标
  private activeModule: string = '' //激活的模块
  private hasHzfz: boolean = false //是否有患者分组
  private showBedbar: boolean = false //是否显示床位菜单
  private isReport: boolean = false //是否是检验检查报告
  private reportList: object[] = [] //报告集合
  private reportType: string = '' //1:检验 2：检查
  private reportData: object = {} //选中的报告
  private emptyText: string = '暂无数据'
  private activeBedNo: string = '' //默认的床位
  private selectedQuota: any[] = [] //选中的指标
  private moduleQuota: any[] = [] //模块所有指标
  private activeIndex: string = 'bqgz-0'

  created() {
    this.init()
  }

  private init(): void {
    this.getRelationList()
    const queryData: any = this.$route.query
    if (queryData.bedNo) {
      this.activeBedNo = queryData.bedNo
    }
  }

  /**
   * 获取默认打开指标的索引
   */
  private getActive(): string {
    if (!Object.keys(this.$route.query).length) {
      //this.selectTab('0', ['0'])
      return '0'
    }
    if (this.$route.query.moduleName === '病区关注') {
      if (!this.$route.query.groupName) {
        if (this.hasBqgz) {
          //this.selectTab('bqgz-0', ['menu-BQGZ', 'bqgz-0'])
          return 'bqgz-0'
        } else {
          //this.selectTab('lis-0', ['menu-BQGZ', 'lis-0'])
          return 'lis-0'
        }
      }
      let index = this.bqgzList.findIndex((item: any) => {
        return this.$route.query.groupName === item.quotaName
      })
      if (index === -1) {
        index = this.LisFocusList.findIndex((item: any) => {
          return this.$route.query.groupName === item.jyzbxmmc
        })
        if (index === -1) {
          //this.selectTab('0', ['0'])
          return '0'
        } else {
          if (this.LisFocusList[index]) {
            const jyzbxmdm = this.LisFocusList[index].jyzbxmdm || ''
            //this.selectTab('lis-' + jyzbxmdm, ['menu-BQGZ', 'lis-' + jyzbxmdm])
            return 'lis-' + jyzbxmdm
          } else {
            return '0'
          }
        }
      } else {
        //this.selectTab('bqgz-' + index, ['menu-BQGZ', 'bqgz-' + index])
        return 'bqgz-' + index
      }
    } else {
      let index = this.relationList.findIndex((item: any) => {
        return this.$route.query.moduleName === item.type
      })
      if (index !== -1) {
        //this.selectTab(index + '', [index + ''])
        return index + ''
      }
      //this.selectTab('0', ['0'])
      return '0'
    }
  }

  /**
   * 筛选框点击事件
   */
  private changeSelectList(quotaList): void {
    this.activeQuota = quotaList.join(',')
    let area = this.areaData.filter((item: any) => {
      return (
        item.ysbqdm === this.associationAreaCode &&
        item.ysksdm === this.associationOfficeCode
      )
    })
    const params = {
      ksdm: this.associationOfficeCode,
      bqdm: this.associationAreaCode,
      ksmc: area[0].ysksmc,
      bqmc: area[0].ysksmc,
      yljgdm: this.yljgdm,
      moduleCode: this.activeModule,
      quotaCodes: this.activeQuota
    }
    this.$api
      .saveDeptQuotaConfig(params)
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
   * tab点击事件
   */
  private selectTab(index: any, indexPath: any[]): void {
    //患者分组
    if (indexPath[0] === 'menu-BQGZ') {
      this.activeModule = 'BQGZ'
      if (index.split('-')[0] === 'lis') {
        //检验报告展示床位卡
        this.activeQuota = index.split('-')[1]
        this.showBedbar = true
        this.reportType = '1'
        let jyzbxmdm: string = index.split('-')[1]
        //处理指标代码包含-的情况
        if (index.split('-').length > 1) {
          const newArry: object[] = index.split('-').slice(1)
          jyzbxmdm = newArry.join('-')
        }
        const data = this.LisFocusList.find((lis: any) => {
          return lis.jyzbxmdm === jyzbxmdm
        })
        this.isReport = true
        this.getLisReportList(data)
      } else {
        const groupCode: string = this.bqgzList[parseInt(index.split('-')[1])]
          .groupCode
        this.activeQuota = this.bqgzList[
          parseInt(index.split('-')[1])
        ].quotaCode
        if (groupCode === 'JC') {
          //检查报告展示床位卡
          this.showBedbar = true
          this.isReport = true
          this.getRisReportList()
          this.reportType = '2'
        } else {
          this.showBedbar = false
          this.isReport = false
        }
      }
    } else {
      let moduleCode = this.relationList[parseInt(index)].list[0].moduleCode
      this.showBedbar = false
      if (moduleCode === 'HZFZ') {
        this.activeModule = 'HZFZ'
        this.activeQuota = 'HZFZ'
      } else {
        this.getModuleRelationList(moduleCode)
        this.getModuleQuota(moduleCode)
      }
    }
  }

  /**
   * 获取模块所有的指标
   */
  private getModuleQuota(moduleCode: string): void {
    this.moduleQuota = []
    const params = {
      moduleCode: moduleCode
    }
    this.$api
      .findQuotaByModuleCode(params)
      .then(res => {
        if (res.data) {
          this.moduleQuota = res.data
        }
        return
      })
      .catch(err => {})
  }

  /**
   * 获取病区模块配置的指标
   */
  private getModuleRelationList(moduleCode: string): void {
    const params = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm,
      moduleCode: moduleCode
    }
    this.$api
      .findRelationListByModuleCode(params)
      .then(res => {
        if (res.data) {
          this.selectedQuota = res.data.map(function(item) {
            return item.quotaCode
          })
          this.activeModule = moduleCode
          this.activeQuota = this.selectedQuota.join(',')
          this.showBedbar = false
          this.isReport = false
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
   * 获取菜单列表
   */
  private getRelationList(): void {
    const params = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm
    }
    this.$api
      .getRelations(params)
      .then(res => {
        if (res.data) {
          this.relationList = sectionalizeArr(res.data, 'moduleName')
          this.relationList.forEach((item: any) => {
            if (item.type === '病区关注') {
              this.bqgzList = this.bqgzList.concat(item.list)
            }
          })
          console.log(this.bqgzList)
          this.hasBqgz = this.relationList.some((i: any) => {
            return i.type === '病区关注'
          })
          this.hasHzfz = this.relationList.some((i: any) => {
            return i.type === '患者分组'
          })
          this.relationList = this.relationList.filter(module => {
            return module.type !== '病区概览' && module.type !== '病区关注'
          })
          this.activeModule = this.relationList[0].list[0].moduleCode
          this.activeQuota = this.relationList[0].list[0].quotaCode
          this.activeIndex = this.getActive()
          // 模块菜单单击事件
          let index = this.activeIndex
          this.$nextTick(() => {
            let dom = document.getElementById(index)
            if (dom) {
              dom.click()
            }
          })
        }
        return
      })
      .catch(err => {})

    this.$api
      .getLisFocusByDept(params)
      .then(res => {
        if (res.data) {
          this.LisFocusList = res.data
        }
        return
      })
      .catch(err => {})
  }

  /**
   * 获取检验报告列表
   */
  private getLisReportList(data: any): void {
    const params = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm,
      ckzLower: data.ckzLower,
      ckzUpper: data.ckzUpper,
      bglbdm: data.bglbdm,
      gzfw: data.gzfw,
      wswbgbz: data.wswbgbz,
      bblx: data.bblx,
      jyzbxmdm: data.jyzbxmdm,
      isDl: data.isDl
    }
    this.$api
      .getFocusLisReport(params)
      .then(res => {
        if (res.data) {
          this.reportList = res.data
          this.reportData = res.data[0]
        }
        return
      })
      .catch(err => {})
  }

  /**
   * 获取检查报告列表
   */
  private getRisReportList(): void {
    const params = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm,
      quotaCode: this.activeQuota
    }
    this.$api
      .getFocusRisReport(params)
      .then(res => {
        if (res.data) {
          this.reportList = res.data
          this.reportData = res.data[0]
        }
        return
      })
      .catch(err => {})
  }
}
</script>

<style lang="scss" scoped>
.area-detail {
  position: relative;
  height: 100%;
  overflow: hidden;
  padding: 15px 20px 40px;
  &.flex-reverse {
    .menu-container {
      margin-left: 15px;
      margin-right: 0;
    }
  }
  .menu-container {
    margin-right: 15px;
    overflow: hidden;
  }
  .detail-left {
    flex-shrink: 0;
    overflow-y: auto;
  }
  .menu {
    width: 300px;
    @include el-menu-bg;
    box-shadow: 0 2px 4px rgba(30, 60, 114, 0.6);
    border-radius: 4px;
    margin: 0 2px 10px;
    overflow: auto;
  }
  .bedbar {
    overflow: auto;
    @include el-menu-bg;
    width: 250px;
    box-shadow: 0 2px 4px rgba(30, 60, 114, 0.6);
    border-radius: 4px;
    margin-bottom: 10px;
    .reportType {
      @include remark-title-font-color;
      margin-left: 12px;
      margin-top: 10px;
      margin-bottom: 18px;
    }
    .list-container {
      margin-left: 12px;
      flex-wrap: wrap;
    }
  }
  .el-submenu__title span,
  .el-menu-item {
    font-size: 20px;
  }
  .content-container {
    @include home-content-bg;
    box-shadow: 0 2px 4px rgba(30, 60, 114, 0.6);
    border-radius: 4px;
    overflow: hidden;
    width: 100%;
    .selected-box {
      padding-left: 10px;
      height: 48px;
    }
  }
  .bed-no.mar[data-v-ab334678] {
    margin-right: 9px;
  }
  .el-submenu .el-menu-item {
    min-width: 1.04167rem;
    word-break: break-word;
    white-space: normal;
    height: auto;
  }
  .g-foot {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .no-data {
    width: 100%;
  }
  .ml-10 {
    margin-right: 2px;
  }
  .v-hidden {
    visibility: hidden;
  }
}
</style>
