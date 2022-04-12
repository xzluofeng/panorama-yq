<!--
 * 病案首页
 *
 -->
<template>
  <div id="app">
    <!-- <iframe
      style="border: none"
      :width="searchTableWidth"
      :height="searchTableHeight"
      v-bind:src="reportUrl"
    /> -->
    <MedicalList :patientInfo="patientInfo" :yljgdm="yljgdm" ref="child" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { State } from 'vuex-class'
import { sectionalizeArr } from '../../../libs/utils'
// 引入组件
import MedicalList from '../components/medicalList.vue'
@Component({
  name: 'inspectionReports',
  // 导入组件
  components: {
    MedicalList,
  },
})
export default class medicalRecordHome extends Vue {
  @State yljgdm
  @State associationAreaCode
  @State associationOfficeCode
  @State patientInfo
  @State sizeMultiple
  @State rightHandType
  @State fontSize

  private searchTableHeight: number = 0
  private searchTableWidth: number = 0
  private reportUrl: string = ''

  mounted() {
    window.onresize = () => {
      this.widthHeight() // 自适应高宽度
    }
    this.$nextTick(function () {
      this.widthHeight()
    })
  }
  // @Watch('patientInfo')
  // changePatient(newVal) {
  //   // this.reportList = []
  //   // this.jcjgList = []
  //   // this.imgUrl = ''
  //   // this.getCheckList()
  //   console.log(this.$refs.child)
  // }
  // created() {
  //   // console.log(this.patientInfo, 222)
  //   // this.patientInfo.jzlb
  //   //   this.reportUrl =
  //   //     'http://127.0.0.1:8762/p/portal/html/zybasy/index-panorama.html?' +
  //   //     'jzlsh=' +
  //   //     this.patientInfo.jzlsh +
  //   //     '&yljgdm=' +
  //   //     this.patientInfo.yljgdm +
  //   //     '&jzlb=' +
  //   //     this.patientInfo.jzlb
  // }

  // 自适应高度和宽度
  private widthHeight(): void {
    this.searchTableHeight = window.innerHeight - 180
    this.searchTableWidth = window.innerWidth - 230
  }
}
</script>

<style lang="scss" scoped>
.case-history {
  position: relative;
  overflow-y: auto;
  padding-bottom: 2px;
  height: 100%;

  .title-list {
    height: 100%;
    width: 250px;
    @include home-content-bg;
    overflow-y: auto;
    border-radius: 0 4px 4px 4px;
    box-shadow: 0 2px 4px rgba(30, 60, 114, 0.4);
    .title-card {
      overflow-y: auto;
      height: 94%;
      position: relative;
      .card {
        margin-top: 15px;
        .group-title {
          margin-left: 10px;
          @include el-table-title-font-color;
          opacity: 1;
        }
        .doc-name {
          padding-left: 20px;
          margin-top: 10px;
          @include el-menu-font-color;
        }
        .active {
          @include treat-menu-bg-color;
          color: white !important;
        }
      }
    }
  }

  .sort-rule {
    position: absolute;
    left: 15px;
    bottom: 0;
    @include title-s-font-color;
    font-size: 15px;
    line-height: 36px;
    bottom: 5px;
    .el-select {
      width: 112px;
    }
  }

  .content {
    position: relative;
    height: 100%;
    overflow-y: auto;
    border-radius: 0 4px 4px 4px;
    box-shadow: 0 2px 4px rgba(30, 60, 114, 0.4);
    @include home-content-bg;
    padding-bottom: 50px;
    margin-left: 10px;
    font-size: 20px;

    .out {
      overflow-y: auto;
      height: 100%;

      .pdf {
        width: 100%;
        height: 100%;
      }

      .html {
        width: 100%;
        margin-top: 25px;

        table {
          width: 90% !important;
        }
      }

      .blnr {
        @include el-menu-font-color;
        padding-left: 60px;
        padding-right: 45px;
        background: rgba(99, 145, 193, 0.1);
        margin-right: 39px;
        margin-left: 56px;
      }

      .wddmc {
        padding-left: 116px;
        margin-top: 16px;
        color: rgba(73, 150, 226, 1);
        opacity: 1;
        margin-bottom: 8px;
      }

      .btn {
        position: absolute;
        bottom: 15px;
        right: 20px;
        @include el-menu-font-color;
        text-decoration: underline;
        .first {
          @include a-not-active-color;
          text-decoration: underline;
        }

        .last {
          @include a-not-active-color;
          text-decoration: underline;
        }

        .up {
          margin-right: 46px;
        }
      }
    }
  }

  .empty {
    margin-top: 50px;
  }
}
</style>
