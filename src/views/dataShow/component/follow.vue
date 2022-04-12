<template>
  <div class="main_index">
    <div v-for="item in dataList" :key="item.id" class="sub">
      <div :class="['sub_main', { last: item.id === dataList.length }]">
        <template v-if="item.position === 'right'">
          <div :class="['sub_right', 'flex']">
            <div class="circle"></div>
            <div class="triangle-left"></div>
            <div class="sub_content">
              <div class="sub_sj">{{ item.sj }}</div>
              <div class="sub_nr">
                <span class="text">服务单位：</span>
                {{ item.fwdw }}
              </div>
              <div class="sub_nr">
                <span class="text">服务医生：</span>
                {{ item.fwys }}
              </div>
            </div>
          </div>
        </template>
        <template v-if="item.position === 'left'">
          <div :class="['sub_left', 'flex']">
            <div class="left_content flex">
              <div class="sub_content">
                <div class="sub_sj">{{ item.sj }}</div>
                <div class="sub_nr">
                  <span class="text">服务单位：</span>{{ item.fwdw }}
                </div>
                <div class="sub_nr">
                  <span class="text">服务医生：</span> {{ item.fwys }}
                </div>
              </div>
              <div class="triangle-right"></div>
            </div>
            <div class="circle left_circle"></div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State } from 'vuex-class'
@Component({ name: 'follow' })
export default class follow extends Vue {
  @State patientInfo
  private dataList: any[] = []
  mounted() {
    this.getFollowupList()
  }
  private getFollowupList(): void {
    const params = {
      jzlsh: this.patientInfo.jzlsh,
      patid: this.patientInfo.patid,
      yljgdm: this.patientInfo.yljgdm,
    }
    this.$api
      .getFollowupList(params)
      .then((res) => {
        if (res.data && res.data.length) {
          this.dataList = res.data
        }
        return
      })
      .catch(() => {
        this.dataList = []
      })
  }
}
</script>

<style lang="scss" scoped>
.main_index {
  @include go-back-font-color;
  position: relative;
  left: 10%;
  height: 100%;
  width: 90%;
  .sub {
    height: 20%;
    margin-top: 10px;
    .sub_main {
      font-size: 14px;
      display: inline-flex;
      height: 100%;
      width: 100%;
      .sub_right {
        left: 40%;
        position: relative;
      }
      .sub_left {
        width: 40%;
      }
    }
  }
}
.sub_content {
  padding: 5px 20px;
  width: 300px;
  min-width: 200px;
  height: 136px;
  overflow-y: auto;
  // margin-top: -10px;
  // height: 90%;
  background: rgba(20, 232, 114, 0.25);
  .sub_sj {
    font-weight: bold;
    font-size: 20px;
    font-style: 'OPPOSans-H';
    padding: 7px 0;
  }
  .sub_nr {
    padding-bottom: 5px;
    font: 18px/1.25 SourceHanSansCN-Regular !important;
    font-size: 18px;
  }
  .text {
    font-size: 18px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #ffffff;
    line-height: 30px;
    opacity: 0.5;
  }
}
.left_content {
  // left: 20%;
  position: relative;
  width: 300px;
}
.circle {
  width: 22px;
  height: 22px;
  background: url('../../../assets/images/circle.png') center no-repeat;
  display: inline-flex;
  margin-left: -14px;
}
.left_circle {
  position: absolute;
  right: 59%;
}
.sub_right::before,
.sub_left::after {
  border-left: 1px solid white;
  content: '';
  top: 15px;
  left: -3px;
  position: relative;
  height: calc(100% + 10px);
}
.sub_left::after {
  left: 8.5%;
}
.last ::before,
.last ::after {
  border: none !important;
  content: '';
}
.triangle-left {
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-right: 10px solid rgba(20, 232, 114, 0.25);
  border-bottom: 5px solid transparent;
  margin-top: 7px;
  margin-left: 10px;
}
.triangle-right {
  margin-top: 9px;
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-left: 10px solid rgba(20, 232, 114, 0.25);
  border-bottom: 5px solid transparent;
}
</style>
