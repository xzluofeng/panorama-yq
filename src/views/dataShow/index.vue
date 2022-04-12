<template>
  <div class="menu-body">
    <div class="menu-main">
      <div class="menu-header">
        <div class="left-header">患者详情</div>
        <div class="right-header"></div>
      </div>
      <div class="main">
        <template v-if="menu === '临床'">
          <home></home>
        </template>
        <template v-else>
          <video
            style="width: 40%; height: calc(100% - 8px)"
            autoplay="autoplay"
            loop="loop"
            muted="muted"
            :src="hzStateUrl"
          >
            <!-- <source :src="hzState" type="video/mp4" /> -->
          </video>
          <div class="hzState_heart" @click="otherClick">
            <div class="hzState_heart_contain" @click.stop="heartClick"></div>
          </div>
          <div class="hzState_other" @click="otherClick"></div>

          <div v-if="hzStateInfo" class="right-main heart-contain">
            <brxx></brxx>
            <el-table
              stripe
              :border="false"
              v-if="hzStateInfoType === 'heart'"
              :class="`fs-18`"
              :data="risreports"
              style="width: 100%"
            >
              <el-table-column prop="bglbmc" label="类型"> </el-table-column>
              <el-table-column prop="bgfbsj" label="报告时间">
              </el-table-column>
              <el-table-column prop="dicom">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="link(scope.row.dicom)"
                    >影像</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <div
              v-if="hzStateInfoType === 'other'"
              style="font-size: 18px; padding: 20px 50px"
            >
              <div>
                <span>
                  <span class="other_contain_title">密接</span
                  ><span class="info_value" @click="valSelect('密接')">{{
                    mjryCount
                  }}</span
                  >人
                </span>
              </div>
              <div style="margin-top: 20px">
                <span>
                  <span class="other_contain_title">检查</span
                  ><span class="info_value" @click="valSelect('检查')">{{
                    jcha
                  }}</span
                  >次 {{ jcha_info }}
                </span>
              </div>
              <div style="margin-top: 20px">
                <span>
                  <span class="other_contain_title">检验</span
                  ><span class="info_value" @click="valSelect('检验')">{{
                    jce
                  }}</span
                  >次 {{ jce_info }}
                </span>
              </div>
              <div style="margin-top: 20px">
                <span>
                  <span class="other_contain_title">核酸检测</span
                  ><span class="info_value" @click="valSelect('核酸')">{{
                    hsjcCount
                  }}</span
                  >次 {{ hsjcCount_info }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="!hzStateInfo" class="right-main">
            <brxx></brxx>
            <main-index v-if="menu === '主页'"></main-index>
            <touch v-if="menu === '密接'"></touch>
            <follow v-if="menu === '随访'"></follow>
            <test v-if="menu === '核酸'"></test>
            <isolate v-if="menu === '隔离'"></isolate>
          </div>
        </template>
      </div>
    </div>
    <div class="menu-aside">
      <div
        v-for="item in menuList"
        :key="item.name"
        :class="{ 'menu-sub': true, active: item.zt === 1 }"
        @click="change(item.name)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import mainIndex from '@/views/dataShow/component/main.vue'
import touch from '@/views/dataShow/component/touch.vue'
import test from '@/views/dataShow/component/test.vue'
import follow from '@/views/dataShow/component/follow.vue'
import brxx from '@/views/dataShow/component/brxx.vue'
import home from '@/views/treatInfo/index.vue'
import isolate from '@/views/dataShow/component/isolate.vue'
import { State } from 'vuex-class'
@Component({
  name: 'menu',
  components: {
    mainIndex,
    brxx,
    touch,
    test,
    follow,
    home,
    isolate,
  },
})
export default class menu extends Vue {
  @State sizeMultiple
  @State patientInfo
  @State patidList
  mjryCount = 0
  jcha = 0
  jce = 0
  hsjcCount = 0
  jcha_info = ''
  jce_info = ''
  hsjcCount_info = ''
  allreports = []
  nowName = ''
  private risreports = []
  private menu = '主页'
  private hzStateUrl = ''
  private hzStateInfo = false
  private hzStateInfoType = 'other'
  private menuList: any[] = [
    { name: '主页', zt: 1 },
    { name: '密接', zt: 0 },
    { name: '临床', zt: 0 },
    { name: '随访', zt: 0 },
    { name: '核酸', zt: 0 },
    { name: '隔离', zt: 0 },
  ]

  private change(name) {
    this.hzStateInfo = false
    this.menuList.forEach((item) => {
      if (item.name === name) {
        this.menu = name
        item.zt = 1
      } else {
        item.zt = 0
      }
    })
  }

  created() {
    this.getHzsfxx()
  }

  public heartClick() {
    this.hzStateInfoType = 'heart'
    this.hzStateInfo = true
    this.getRisreport()
  }

  public otherClick() {
    this.hzStateInfoType = 'other'
    this.hzStateInfo = true
    this.getPatientOverview()
    this.getRisreport()
    this.getInspectList()
  }

  public valSelect(val) {
    switch (val) {
      case '密接':
        this.change(val)
        break
      case '核酸':
        this.change(val)
        break
      case '检查':
        this.$router.push('/menu/inspectionReports')
        this.change('临床')
        break
      case '检验':
        this.$router.push('/menu/examinationReports')
        this.change('临床')
        break
      default:
        break
    }
  }

  private getPatientOverview() {
    let params = {
      jzlsh: this.patientInfo.jzlsh,
      yljgdm: this.patientInfo.yljgdm,
    }
    this.$api
      .getPatientOverview(params)
      .then((res) => {
        let { mjryCount, xxgzbdhsjcNegativeCount, xxgzbdhsjcPositiveCount } =
          res.data
        this.mjryCount = mjryCount
        this.hsjcCount = xxgzbdhsjcNegativeCount + xxgzbdhsjcPositiveCount
        this.hsjcCount_info = `(阳性：${xxgzbdhsjcNegativeCount}次，阴性：${xxgzbdhsjcPositiveCount}次)`
        return
      })
      .catch(() => {})
  }

  private getInspectList(): void {
    let param = {
      patidList: this.patidList,
      yexh: this.patientInfo.yexh,
      jzlsh: this.patientInfo.jzlsh,
      jzlb: this.patientInfo.jzlb,
      yljgdm: this.patientInfo.yljgdm,
    }
    this.$api
      .getLisreport(param)
      .then((res) => {
        let { lisreportEntityList } = res.data.reportList[0]
        this.jce = lisreportEntityList.length
        this.jce_info = `(血常规：${
          lisreportEntityList.filter((i) => i.bblx.indexOf('血') > -1).length
        }次，其它：${
          lisreportEntityList.filter((i) => i.bblx.indexOf('血') === -1).length
        }次)`
        return
      })
      .catch(() => {})
  }

  private getRisreport(): void {
    let params = {
      patidList: this.patidList,
      jzlsh: this.patientInfo.jzlsh,
      jzlb: this.patientInfo.jzlb,
      yljgdm: this.patientInfo.yljgdm,
      yexh: this.patientInfo.yexh,
    }
    this.$api
      .getRisreport(params)
      .then((res) => {
        let { risreports } = res.data.reportList[0]
        this.risreports = risreports.filter((i) => i.dicom)
        this.allreports = risreports
        // 计算总数
        this.jcha = this.allreports.length
        this.jcha_info = `(CT：${
          this.allreports.filter((i: any) => i.bglbmc === 'CT').length
        }次，其它：${
          this.allreports.filter((i: any) => i.bglbmc !== 'CT').length
        }次)`
        return
      })
      .catch(() => {})
  }

  private link(src) {
    window.open(src)
  }

  private getHzsfxx(): void {
    const params = {
      jzlsh: this.patientInfo.jzlsh,
      patid: this.patientInfo.patid,
      yljgdm: this.patientInfo.yljgdm,
    }
    this.$api
      .getHzsfxx(params)
      .then((res) => {
        let prefix =
          this.patientInfo.brxxkJz.xbmc.trim() !== '男' ? 'woman_' : 'man_'
        if (res.data) {
          switch (res.data.lzyzcd) {
            case '1':
            case '2':
            case '3':
            case '4':
            case '9':
              this.hzStateUrl = require('@/assets/video/' +
                prefix +
                res.data.lzyzcd +
                '.mp4')
              break
            default:
              this.hzStateUrl = require('@/assets/video/' + prefix + '9.mp4')
              break
          }
        } else {
          this.hzStateUrl = require('@/assets/video/' + prefix + '9.mp4')
        }
        return
      })
      .catch(() => {})
  }
}
</script>

<style lang="scss" scoped>
.menu-body {
  height: 100%;
  width: 100%;
  @include go-back-font-color;
  display: inline-flex;
  .menu-main {
    width: 80%;
    height: 100%;
    position: relative;
    left: 10%;
    top: 8%;
    .menu-header {
      height: 40px;
      width: 100%;
      display: inline-flex;
      .left-header {
        width: 120px;
        font-size: 24px;
        font-weight: 900;
        font-style: italic;
        padding: 3px;
        height: 100%;
        border-bottom: 1px solid #409eff;
      }
      .right-header {
        width: calc(100% - 120px);
        position: relative;
        top: 50%;
        height: 50%;
        border: 1px solid #409eff;
        border-bottom: none;
      }
    }
    .main {
      width: 100%;
      height: 80%;
      border: 1px solid #409eff;
      border-top: none;
      box-shadow: #0863c2 0 -3px 2px 2px inset;
      display: inline-flex;
      .left-main-man {
        width: 40%;
        height: 100%;
        background: url('../../assets/images/man.png') center no-repeat;
        background-size: 100%;
      }
      .left-main-woman {
        width: 40%;
        height: 100%;
        background: url('../../assets/images/woman.png') center no-repeat;
        background-size: 100%;
      }
      .right-main {
        height: 100%;
        width: 60%;
        padding-bottom: 10px;
        .main_index {
          height: calc(100% - 50px);
          overflow-y: auto;
        }
      }
    }
  }

  .menu-aside {
    position: relative;
    width: 10%;
    left: 10%;
    top: 20%;
    .menu-sub {
      height: 60px;
      width: 30%;
      margin: 20px 0;
      background-color: #0c1680;
      border-radius: 10%;
      text-align: center;
      font-size: 18px;
      line-height: 60px;
    }
    .active {
      background-color: #409eff;
    }
  }
  .hzState_heart {
    justify-content: center;
    position: absolute;
    height: 80px;
    width: 40%;
    top: 25%;
    z-index: 101;
    display: flex;
  }
  .hzState_heart_contain {
    cursor: pointer;
    height: 80px;
    width: 80px;
  }
  .hzState_other {
    z-index: 100;
    position: absolute;
    height: 100%;
    width: 40%;
  }
  .heartTable {
    .el-table td.el-table__cell,
    .el-table th.el-table__cell.is-leaf {
      background: rgb(3, 25, 61);
    }
  }
  .info_value {
    padding: 0 30px;
    font-size: 26px;
    color: #1370e6;
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
  }
  .other_contain_title {
    width: 80px;
    display: inline-block;
    text-align: right;
  }
}
</style>
