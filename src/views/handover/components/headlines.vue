<template>
  <div :class="['headlines', 'flex', { 'flex-reverse': rightHandType }]">
    <div
      :class="[
        'menu-container flex flex-v',
        `fs-${fontSize + 2}`,
        { 'ml-10': rightHandType },
        { 'mr-10': !rightHandType }
      ]"
    >
      <ul class="flex flex-v flex-1">
        <li
          v-for="(item, index) in moduleList"
          :key="index"
          ref="menuList"
          :class="['menu-item', { active: index === activeIndex }]"
          @click="showInfo(index)"
        >
          <span class="type-name">{{ item.columnName }}</span>
        </li>
        <p
          :class="[
            'empty',
            'no-data',
            'flex flex-pack-center',
            `fs-${fontSize}`
          ]"
          v-if="!moduleList.length"
        >
          没有配置病区头条模块
        </p>
      </ul>
      <goBack />
    </div>
    <!-- 内容容器 -->
    <div
      class="content-container flex-1"
      ref="container"
      @scroll="handleScroll"
    >
      <div
        v-for="(module, moduleIndex) in moduleList"
        :key="moduleIndex"
        class="content-item"
        ref="contentItem"
      >
        <!-- 备忘录 -->
        <div v-if="module.columnCode === 'remark'">
          <p :class="['title', `fs-${fontSize + 2}`]">备忘录</p>
          <div :class="['content', `fs-${fontSize}`]">
            {{ memo }}
            <div class="mome-box flex">
              <div
                class="mome-cell flex flex-align-center"
                v-for="(patient, patientIndex) in patientMemo"
                :key="patientIndex"
              >
                <bed-no :data="patient"></bed-no>
                <span class="remark-content">{{ patient.bzms }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 医生信息 -->
        <div v-if="module.columnCode === 'ysxx'">
          <p :class="['title', `fs-${fontSize + 2}`]">医生信息</p>
          <div
            :class="['content', `fs-${fontSize}`]"
            v-if="treatGoup.length || dutyGroup.length"
          >
            <div class="group-box">
              <div v-for="(item, index) in treatGoup" :key="index" class="flex">
                <div
                  v-for="(doctor, docIndex) in item.zlzysysEntityList"
                  :key="docIndex"
                  :class="['doctor', 'mr-20', `fs-${fontSize}`]"
                >
                  {{
                    treatmentGroupHiddenTel
                      ? doctor.ysmc
                      : `${doctor.ysmc}(${doctor.mobilephone || ''})`
                  }}
                </div>
                <div class="bed-list">
                  <bedNo
                    v-for="(bed, bedIndex) in item.zlzcwysEntityList"
                    :key="bedIndex"
                    :data="bed"
                    :jump="false"
                    class="mar"
                  />
                </div>
              </div>
            </div>
            <div class="group-box">
              <div
                v-for="(item, index) in dutyGroup"
                :key="index"
                :class="['duty-item', 'flex', `group-${index % 3}`]"
              >
                <span :class="['group-name', `fs-${fontSize}`]">
                  {{ item.groupName }}
                </span>
                <div
                  :class="[
                    'doctor-list',
                    'flex-1',
                    'flex',
                    'flex-align-center',
                    `fs-${fontSize}`
                  ]"
                >
                  <div
                    v-for="(doctor, docIndex) in item.list"
                    :key="docIndex"
                    class="doctor-item flex flex-align-center"
                  >
                    <!-- todo 修改女医生字段判断 -->
                    <i :class="['icon', { female: doctor.sex === '女' }]"></i>
                    <span :class="['name', `fs-${fontSize}`]">
                      {{ doctor.ysmc }}
                    </span>
                    <span class="line" v-if="!dutyHiddenTel"></span>
                    <span
                      :class="['tel', `fs-${fontSize}`]"
                      v-if="!dutyHiddenTel"
                    >
                      {{ doctor.mobilephone || '' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <span v-else :class="['no-data', `fs-${fontSize}`]">
            暂无数据
          </span>
        </div>

        <!-- 集中区域，重点区域数据 -->
        <template v-else v-for="(handOver, handOverIndex) in handOverData">
          <div
            :key="handOverIndex"
            v-if="module.columnCode === (handOver.code || handOver.moduleCode)"
            ref="contentItem"
          >
            <p :class="['title', `fs-${fontSize}`]">
              {{ handOver.name || handOver.moduleName }}
            </p>
            <!-- 每个模块api返回的子代key关键字不一致（subList，detail），有subList的时候同时存在detail关键字 -->
            <div
              v-for="(listItem, index) in handOver.subList || handOver.detail"
              :key="index"
              :class="['content', 'flex', `fs-${fontSize}`]"
            >
              <p class="title-s">{{ listItem.name || listItem.type }}</p>
              <div class="bed-box flex flex-1">
                <bed-no
                  v-for="(bed, bedIndex) in listItem.detail || listItem.list"
                  :key="bedIndex"
                  :data="bed"
                />
                <span
                  v-if="
                    (listItem.detail && !listItem.detail.length) ||
                      (listItem.list && !listItem.list.length)
                  "
                >
                  暂无数据
                </span>
              </div>
            </div>
            <!-- 子代关键字为detail，不存在subList字段 -->
            <span
              v-if="
                (handOver.subList && !handOver.subList.length) ||
                  (handOver.detail &&
                    !handOver.subList &&
                    !handOver.detail.length)
              "
              :class="['no-data', `fs-${fontSize}`]"
            >
              暂无数据
            </span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import bedNo from '../../../components/bedNoCell.vue'
import goBack from '../../../components/goBack.vue'
import { sectionalizeArr, debounce } from '../../../libs/utils'
@Component({
  name: 'headlines',
  components: {
    bedNo,
    goBack
  }
})
export default class headlines extends Vue {
  @State associationAreaCode
  @State associationOfficeCode
  @State yljgdm
  @State rightHandType
  @State fontSize
  @State areaSurveyData
  @State centralizedData
  @State treatmentGroupHiddenTel
  @State dutyHiddenTel

  private patientGroupData: any[] = [] // 患者分组
  private memo: string = '' // 病区备忘
  private patientMemo: any[] = [] // 患者备忘录
  private treatGoup: any[] = [] // 患者备忘录patientMemo
  private scrollY: number = 0 // 患者备忘录
  private topList: any[] = [] // 值班医生
  private keyAreaData: any[] = [] // 重点区域菜单
  private containerDom: any = null
  private dutyGroup: any[] = []
  private moduleList: any[] = [] //模块列表

  mounted() {
    this.containerDom = this.$refs.container
    this.$nextTick(() => {
      this.getAreaConfig()
      this.getGroupData()
      this.getAreaRemark()
      this.getPatientsMemo()
      this.getTreatGroupData()
      this.getDutyData()
      this.getModuleList()
    })
  }

  get handOverData(): any[] {
    const patientGroup = {
      name: '患者分组',
      code: 'HZFZ',
      detail: this.handerPatientFroupData()
    }
    const areaSurvey = {
      name: '病区概览',
      code: 'BQGL',
      detail: this.areaSurveyData || []
    }
    const _centralizedData = this.centralizedData.filter(item => {
      return item.code !== 'BQGL' && item.code !== 'HZFZ'
    })
    const target = [
      patientGroup,
      areaSurvey,
      ..._centralizedData,
      ...this.keyAreaData
    ]
    if (target.length) {
      this.$nextTick(() => {
        this.initHeightArr()
      })
      return target
    } else {
      return []
    }
  }

  // 计算菜单激活index
  get activeIndex(): number {
    const { scrollY, topList } = this
    return topList.findIndex((tops, index) => {
      if (index < topList.length - 1) {
        return scrollY >= tops.top && scrollY < topList[index + 1].top
      } else {
        return scrollY >= tops.top
      }
    })
  }

  // 获取患者分组详情数据
  private getGroupData(): void {
    const params = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm,
      needGroup: false
    }
    this.$api
      .getChartData(params)
      .then(res => {
        const _res = res.data || []
        this.patientGroupData = _res
        this.handerPatientFroupData()
        return
      })
      .catch(err => {
        this.$message({
          message: '获取患者分组失败！',
          type: 'error'
        })
      })
  }

  private getModuleList() {
    const param = {
      yljgdm: this.yljgdm,
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      moduleCode: 'BQTT'
    }
    this.$api
      .getModuleColumnList(param)
      .then(res => {
        this.moduleList = res.data || []
        return
      })
      .catch(err => {
        this.$message({
          message: '获取模块列表失败！',
          type: 'error'
        })
      })
  }

  // 获取病区备注
  private getAreaRemark() {
    const param = {
      yljgdm: this.yljgdm,
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      bzlb: '1' // 备注类别 1：病区，0：病人
    }
    this.$api
      .getAreaRemark(param)
      .then(res => {
        const _data = res.data || []
        if (_data.length) {
          const _cheat = _data[0].bzms || ''
          this.memo = _cheat.replace(/<br>/g, '\n')
        }
        return
      })
      .catch(err => {
        this.$message({
          message: '获取病区备注失败！',
          type: 'error'
        })
      })
  }

  // 获取所有有标签的病人list
  private getPatientsMemo() {
    const param = {
      yljgdm: this.yljgdm,
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      bqmxmc: ''
    }
    this.$api
      .getBQList(param)
      .then(res => {
        const _data = res.data || []
        this.patientMemo = _data
        return
      })
      .catch(err => {
        this.$message({
          message: '获取患者备注失败！',
          type: 'error'
        })
      })
  }

  // 获取诊疗组信息
  private getTreatGroupData(): void {
    const params = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm
    }
    this.$api
      .getZlzxxList(params)
      .then(res => {
        const _res = res.data || []
        _res.forEach(item => {
          item.syzt = item.zlzcwysEntityList[0].syzt
        })
        this.treatGoup = _res.filter(item => {
          return item.syzt === '1'
        })
        return
      })
      .catch(err => {})
  }

  // 获取值班医生信息
  private getDutyData(): void {
    const params = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm
    }
    this.$api
      .getZbysList(params)
      .then(res => {
        const _res = res.data || {}
        // 返回数据为对象，转换成数组
        const _resArr: any = []
        for (const key in _res) {
          if (_res.hasOwnProperty(key)) {
            const element = _res[key]
            const _obj = {
              groupName: element[0].zbfzmc,
              syzt: element[0].syzt,
              list: element
            }
            _resArr.push(_obj)
          }
        }
        this.dutyGroup = _resArr.filter(item => {
          return item.syzt === '1'
        })
        return
      })
      .catch(err => {})
  }

  // 点击菜单触发事件
  private showInfo(index: number): void {
    this.containerDom.scrollTop = this.topList[index].top + 20
  }

  // 获取重点区域有哪些模块
  private getAreaConfig(): void {
    this.$api
      .getAreaConfig(
        'MAIN',
        this.associationAreaCode,
        this.associationOfficeCode,
        this.yljgdm
      )
      .then(res => {
        const _res = res.data || []
        _res.forEach(item => {
          this.getKeyAreaData(item.moduleCode)
        })
        return
      })
      .catch(err => {})
  }

  // 获取单个重点区域模块数据
  private getKeyAreaData(moduleCode: string): void {
    const param = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm,
      moduleCode: moduleCode
    }
    this.$api
      .getMainData(param)
      .then(res => {
        if (res.data && res.data != null) {
          res.data.detail = sectionalizeArr(res.data.detail, 'quotaName')
          this.keyAreaData.push(res.data)
        }
        return
      })
      .catch(err => {})
  }

  private handleScroll(): void {
    this.scrollY = this.containerDom.scrollTop
  }

  private initHeightArr(): void {
    this.topList = []
    let data = document.querySelectorAll('.content-item')
    data.forEach((item: any, index) => {
      this.topList.push({
        top: item.offsetTop - 84,
        height: item.offsetHeight,
        index: index
      })
    })
    let paddHeight = 0
    if (this.containerDom) {
      paddHeight =
        this.containerDom.offsetHeight -
        this.topList[this.topList.length - 1].height
    }
    if (paddHeight > 0) {
      this.containerDom.style.paddingBottom = paddHeight + 20 + 'px'
    }
  }

  private handerPatientFroupData(): any[] {
    let target: any = []
    this.patientGroupData.forEach(group => {
      const _arr = sectionalizeArr(group.detail, 'name')
      _arr.forEach((item: any) => {
        const _obj = {
          name: '',
          detail: []
        }
        _obj.name = (group.name || group.moduleName) + '-' + item.type
        _obj.detail = item.list
        target.push(_obj)
      })
    })
    return target
  }
}
</script>

<style lang="scss" scoped>
.headlines {
  padding: 2px;
  overflow: hidden;
  @include puhui-m;

  .content-container {
    @include home-content-bg;
    box-shadow: 0 2px 4px rgba(30, 60, 114, 0.4);
    border-radius: 4px;
    overflow-y: auto;
  }
  .menu-container {
    width: 250px;
    li {
      padding: 8px 25px;
      @include el-table-title-font-color;
      &.active {
        @include treat-menu-bg-color;
        color: #fff !important;
      }
    }
  }
  .menu-container ul {
    @include home-content-bg;
    box-shadow: 0 2px 4px rgba(30, 60, 114, 0.4);
    border-radius: 4px;
    overflow-y: auto;
    margin-bottom: 10px;
  }
  .content-container {
    padding: 15px 25px;
    .content-item {
      padding-top: 15px;
    }
    .title {
      @include bqtt-content-title-font-color;
    }
    .content-text {
      padding-left: 30px;
      margin: 15px 0;
    }
    .mome-box {
      flex-wrap: wrap;
      padding-left: 45px;
      .bed-no {
        margin-right: 10px;
      }
    }
    .mome-cell {
      width: 48%;
      margin-bottom: 10px;
      margin-right: 20px;
    }
    .content {
      @include el-menu-font-color;
      overflow-wrap: break-word;
      margin-top: 15px;
      margin-left: 15px;
      .title-s {
        flex-shrink: 0;
        width: 140px;
        margin-right: 15px;
        text-align: right;
      }
      .bed-box {
        flex-wrap: wrap;
        .bed-no {
          margin-right: 10px;
          margin-bottom: 15px;
        }
      }
    }
  }

  .duty-item {
    margin-bottom: 10px;
  }

  .group-name {
    width: 140px;
    text-align: right;
    margin-right: 15px;
    flex-shrink: 0;
    &.fs-20 {
      width: 100px;
    }
    &.fs-22 {
      width: 111px;
    }
    &.fs-24 {
      width: 122px;
    }
    &.fs-26 {
      width: 133px;
    }
    &.fs-28 {
      width: 144px;
    }
  }

  .doctor-list {
    flex-wrap: wrap;
    margin-bottom: -10px;
    margin-right: -10px;
  }
  // 医生姓名，联系方式，三组样式
  .group-0 {
    .icon {
      background-color: #c6d0f8;
    }
    .doctor-item {
      @include doctor-item-bg-color;
      color: #5d77dd;
    }
    .line {
      background-color: #b2c1f3;
    }
  }
  .group-1 {
    .icon {
      background-color: #9cc7f7;
    }
    .doctor-item {
      @include doctor-item-bg-color;
      color: #3b81cf;
    }
    .line {
      background-color: #c3d3ed;
    }
  }
  .group-2 {
    .icon {
      background-color: #81d7ea;
    }
    .doctor-item {
      @include doctor-item-bg-color;
      color: #1aadcd;
    }
    .line {
      background-color: #b2e4ee;
    }
  }

  .doctor-item {
    border-radius: 4px;
    overflow: hidden;
    height: 40px;
    margin-right: 15px;
    margin-bottom: 10px;
    .icon {
      width: 45px;
      height: 40px;
      background-image: url('../../../assets/images/icon-male-doc.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: 28px 30px;
      &.female {
        background-image: url('../../../assets/images/icon-female-doc.png');
      }
    }
    .name {
      text-align: center;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      &.fs-18 {
        width: 100px;
      }
      &.fs-20 {
        width: 110px;
      }
      &.fs-22 {
        width: 120px;
      }
      &.fs-24 {
        width: 130px;
      }
      &.fs-26 {
        width: 140px;
      }
    }
    .tel {
      text-align: center;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      &.fs-18 {
        width: 140px;
      }
      &.fs-20 {
        width: 150px;
      }
      &.fs-22 {
        width: 160px;
      }
      &.fs-24 {
        width: 170px;
      }
      &.fs-26 {
        width: 180px;
      }
    }
    .line {
      width: 1px;
      height: 18px;
    }
  }

  .no-data {
    display: inline-block;
    margin-left: 25px;
    margin-top: 15px;
  }
}
</style>
