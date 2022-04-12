<!--
 * @Descripttion: 患者详情首页
 * @version:
 * @Author: wangqi
 * @Date: 2019-07-16 15:53:43
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-15 09:20:07
 -->
<template>
  <div class="treat-home flex flex-v">
    <tHeader @toggleTimeLine="toggleTimeLine" />
    <div :class="['time-line', { show: timeLineShow }]" ref="recordContainer">
      <div class="line" v-if="timeLineShow"></div>
      <div class="record-box flex" ref="recordBox">
        <div
          v-for="(item, index) in treatRecordList"
          :key="index"
          :class="[
            'record',
            {
              active:
                item.active || (index === activeHistoryIndex && cis === '0'),
            },
            `fs-${fontSize - 2}`,
          ]"
          @click="changeRecord(index)"
        >
          <span class="circle"></span>
          <p class="title">
            <i
              :class="[
                'treat-type',
                item.jzlb === '1' ? 'department ' : 'hospital',
              ]"
            ></i>
            {{ item.jzlb === '1' ? '门诊 ' : '住院' }}
            &nbsp;
            {{ item.jzkssj.substr(0, 10).replace(/\-/g, '/') }}
          </p>
          <p class="content">{{ item.jzksmc }}</p>
          <p class="content">
            {{
              item.zdmc == null || item.zdmc === '' ? '暂无诊断数据' : item.zdmc
            }}
          </p>
        </div>
      </div>
    </div>
    <div
      :class="[
        'content-container',
        'flex-1',
        'flex',
        { 'flex-reverse': rightHandType },
      ]"
    >
      <ul :class="['menu', { 'mr-10': !rightHandType }]">
        <li
          v-for="(item, index) in routerArr"
          :key="index"
          :class="[
            `fs-${fontSize}`,
            { active: $route.path.indexOf(item.url) > -1 },
          ]"
          @click="linkTo(item.path)"
        >
          {{ item.name }}
        </li>
      </ul>
      <div class="treat-content flex-1">
        <router-view></router-view>
        <!--<home v-if="now === '患者主页'"></home>-->
        <!--<case-history v-if="now === '电子病历'"></case-history>-->
        <!--<doctor-advices v-if="now === '医嘱处方'"></doctor-advices>-->
        <!--<examination-reports v-if="now === '检验报告'"></examination-reports>-->
        <!--<inspection-reports v-if="now === '检查报告'"></inspection-reports>-->
        <!--<nursing-doc v-if="now === '护理文书'"></nursing-doc>-->
        <!--<clinical-diagnose v-if="now === '临床诊断'"></clinical-diagnose>-->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State, Action, Mutation } from 'vuex-class'
import tHeader from './components/header.vue'
import tFoot from './components/foot.vue'
import gFoot from '../../components/g-foot.vue'
import home from '@/views/treatInfo/pages/home.vue'
import caseHistory from '@/views/treatInfo/pages/caseHistory.vue'
import doctorAdvices from '@/views/treatInfo/pages/doctorAdvices.vue'
import examinationReports from '@/views/treatInfo/pages/examinationReports.vue'
import inspectionReports from '@/views/treatInfo/pages/inspectionReports.vue'
import nursingDoc from '@/views/treatInfo/pages/nursingDoc.vue'
import clinicalDiagnose from '@/views/treatInfo/pages/clinicalDiagnose.vue'
import mousewheel from '../../mixin/mousewheel'
// 新增体温趋势
import temperatureTrend from '@/views/treatInfo/pages/temperatureTrend.vue'
@Component({
  name: 'treatHome',
  components: {
    tHeader,
    tFoot,
    gFoot,
    home,
    caseHistory,
    temperatureTrend,
    doctorAdvices,
    examinationReports,
    inspectionReports,
    nursingDoc,
    clinicalDiagnose,
  },
  mixins: [mousewheel],
})
export default class treatHome extends Vue {
  @State patientInfo
  @State patidList
  @State rightHandType
  @State fontSize
  @State cis
  @Mutation SET_TZ_CIS

  @Action getPatientInfo

  // 定义路由数组
  //  private routerArr: any = [
  //    { path: '/treatInfo/home', name: '患者主页' },
  //    // { path: '/treatInfo/signs', name: '患者体征' },
  //    { path: '/treatInfo/caseHistory', name: '电子病历' },
  //    { path: '/treatInfo/doctorAdvices', name: '医嘱处方' },
  //    { path: '/treatInfo/examinationReports', name: '检验报告' },
  //    { path: '/treatInfo/inspectionReports', name: '检查报告' },
  //    { path: '/treatInfo/nursingDoc', name: '护理文书' },
  //    { path: '/treatInfo/clinicalDiagnose', name: '临床诊断' }
  //    // { path: '/treatInfo/operation', name: '手术治疗' }
  //  ]
  private routerArr: any = [
    { url: 'home', path: 'menuHome', name: '患者主页' },
    {
      url: 'medicalRecordHome',
      path: 'menuMedicalRecordHome',
      name: '病案首页',
    },
    // 新增体温趋势
    {
      url: 'temperatureTrend',
      path: 'menuTemperatureTrend',
      name: '体温趋势',
    },
    { url: 'caseHistory', path: 'menuCaseHistory', name: '电子病历' },
    { url: 'doctorAdvices', path: 'menuDoctorAdvices', name: '医嘱处方' },
    {
      url: 'examinationReports',
      path: 'menuExaminationReports',
      name: '检验报告',
    },
    {
      url: 'inspectionReports',
      path: 'menuInspectionReports',
      name: '检查报告',
    },
    //{ url: 'nursingDoc', path: 'menuNursingDoc', name: '护理文书' },
    { url: 'clinicalDiagnose', path: 'menuClinicalDiagnose', name: '临床诊断' },
  ]
  private timeLineShow: boolean = false // 就诊时间轴是否显示
  private treatRecordList: any[] = [] // 就诊集合
  private activeHistoryIndex: number = 0 // 激活的就诊历史index
  private now: string = 'menuHome'
  @Watch('patientInfo')
  changePatient(newVal) {
    this.getRreatRecord()
  }

  mounted() {
    this.getRreatRecord()
  }

  /**
   * @name: getRreatRecord
   * @test: test font
   * @msg: 获取就诊记录
   * @param {void}
   * @return: void
   */
  private getRreatRecord(): void {
    let param = {
      patid: this.patientInfo.patid,
      jzlb: this.patientInfo.jzlb,
      yljgdm: this.patientInfo.yljgdm,
      yexh: this.patientInfo.yexh,
      patidList: this.patidList,
    }
    this.$api
      .getTimeline(param)
      .then((res) => {
        const _res = res.data || []
        this.treatRecordList = _res
        if (this.cis === '1') {
          this.treatRecordList.forEach((item) => {
            if (
              item.patid === this.patientInfo.patid &&
              item.jzlb === this.patientInfo.jzlb &&
              item.jzlsh === sessionStorage.getItem('jzlsh')
            ) {
              item.active = true
            }
          })
        }
        // 绑定鼠标滚轴横向滚动
        this.$nextTick(() => {
          this.scroll(this.$refs.recordContainer, this.$refs.recordBox)
        })
        return
      })
      .catch((err) => {
        this.$message({
          message: '获取历次就诊失败！',
          type: 'error',
        })
      })
  }

  /**
   * @name: linkTo
   * @test: test font
   * @msg: 跳转患者诊断相关详情页面
   * @param {path} 目标路径
   * @return: void
   */
  private linkTo(tarrgetPath: string): void {
    console.log('==tarrgetPath', tarrgetPath)
    //      this.now = tarrgetPath
    //     const path = this.$route.path
    //     if (path === tarrgetPath) {
    //       return
    //     } else {
    //       this.$router.push(tarrgetPath)
    //     }
    this.$router.push({ name: tarrgetPath })
  }

  /**
   * @name: changeRecord
   * @test: test font
   * @msg: 切换
   * @param {void}
   * @return: void
   */
  private changeRecord(index: number): void {
    this.SET_TZ_CIS('0')
    this.activeHistoryIndex = index
    this.getPatientInfo(this.treatRecordList[index])
  }

  /**
   * @name: toggleTimeLine
   * @test: test font
   * @msg: 切换就诊时间轴展示隐藏
   * @param {void}
   * @return: void
   */
  private toggleTimeLine(): void {
    this.timeLineShow = !this.timeLineShow
  }

  private changeRecordIndex(val) {
    if (val) {
      this.activeHistoryIndex = 0
    }
  }
}
</script>

<style lang="scss" scoped>
.treat-home {
  height: 100%;
  width: 100%;
  overflow: hidden;
  .content-container {
    overflow: hidden;
    &.flex-reverse {
      .menu {
        margin-left: 10px;
      }
    }
    .menu {
      width: 150px;
      @include home-content-bg;
      box-shadow: 0 2px 4px rgba(30, 60, 114, 0.4);
      @include puhui-m;
      border-radius: 0 4px 4px 4px;
      overflow-y: auto;
      margin-top: 2px;
      margin-bottom: 2px;
      flex-shrink: 0;
      li {
        @include el-menu-font-color;
        text-align: center;
        margin: 25px 0 0 0;
        cursor: pointer;
        border-bottom: 5px solid transparent;
        &.active {
          background: url('../../assets/images/active.png') center no-repeat;
        }
      }
    }
    // 内容
    .treat-content {
      position: relative;
      height: 100%;
      overflow: auto;
      @include puhui-m;
      padding: 2px;
    }
  }
  // 时间轴
  .time-line {
    position: relative;
    max-height: 0;
    overflow: hidden;
    transition: all 0.5s linear;
    margin: 10px 15px;
    @include time-history-bg-color;
    box-shadow: 0px 2px 4px rgba(30, 60, 114, 0.4);
    @include puhui-m;
    border-radius: 0 4px 4px 4px;
    overflow-x: auto;
    padding: 0 10px;
    &.show {
      max-height: 200px;
      padding: 10px;
    }
    .line {
      position: absolute;
      height: 2px;
      left: 30px;
      right: 30px;
      top: 20px;
      @include time-history-line;
    }
    .record-box {
      display: inline-block;
      white-space: nowrap;
      height: 100%;
    }
    .record {
      position: relative;
      display: inline-block;
      width: 200px;
      margin-left: 50px;
      padding-top: 20px;
      cursor: pointer;
      @include time-history-font-color;
      flex-shrink: 0;
      &.active {
        @include time-history-active-font-color;
        font-weight: 600;
        .circle {
          background-color: #00938b;
          box-shadow: 0 0 4px rgba(0, 147, 139, 0.8);
          border-color: #00938b;
        }
      }
    }
    .circle {
      position: absolute;
      width: 12px;
      height: 12px;
      left: 7px;
      top: 4px;
      border-radius: 50%;
      border: 2px solid #819dc4;
    }
    .content {
      max-height: 46px;
      @include overflow(2);
    }
    .treat-type {
      display: inline-block;
      width: 27px;
      height: 27px;
      background-size: cover;
      vertical-align: bottom;
      &.department {
        background-image: url('../../assets/images/department .png');
      }
      &.hospital {
        background-image: url('../../assets/images/in-hospital.png');
      }
    }
  }
  .mr-10 {
    margin-right: 10px;
  }
}
</style>
