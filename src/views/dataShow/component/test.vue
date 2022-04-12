<!--
 * @Descripttion: 核酸检测
 * @version:
 * @Author: 
 * @Date: 
 * @LastEditors: 
 * @LastEditTime: 
 -->
<template>
  <div class="main_index" ref="test">
    <div class="test-main">
      <div v-for="(item, index) in dataList" :key="item.id" class="sub">
        <div :class="['sub_main', { last: item.id === dataList.length }]">
          <template v-if="index % 2 !== 0">
            <div :class="['sub_right', 'flex']">
              <div class="circle"></div>
              <div class="triangle-left"></div>
              <div class="sub_content">
                <div class="sub_sj">
                  结果
                  <div
                    :class="[
                      { sub_yang_circle: item.jg },
                      { sub_yin_circle: !item.jg },
                    ]"
                  >
                    <span class="innerTitle">{{ item.jg ? '阳' : '阴' }}</span>
                  </div>
                </div>
                <div class="sub_nr">
                  <span class="sub_info_title">检测时间：</span>
                  {{ item.sj }}
                </div>
                <div class="sub_nr">
                  <span class="sub_info_title">检测机构：</span>
                  {{ item.dz }}
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div :class="['sub_left', 'flex']">
              <div class="left_content flex">
                <div class="sub_content">
                  <div class="sub_sj">
                    结果
                    <div
                      :class="[
                        { sub_yang_circle: item.jg },
                        { sub_yin_circle: !item.jg },
                      ]"
                    >
                      <span class="innerTitle">
                        {{ item.jg ? '阳' : '阴' }}
                      </span>
                    </div>
                  </div>
                  <div class="sub_nr">
                    <span class="sub_info_title">检测时间：</span>
                    {{ item.sj }}
                  </div>
                  <div class="sub_nr">
                    <span class="sub_info_title">检测机构：</span>
                    {{ item.dz }}
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
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State } from 'vuex-class'
@Component({
  name: 'test',
})
export default class test extends Vue {
  @State patientInfo
  private dataList: any[] = []
  private xqList: any[] = []
  private box: any = null
  mounted() {
    this.getHsjcList()
  }
  private getHsjcList(): void {
    const params = {
      jzlsh: this.patientInfo.jzlsh,
      patid: this.patientInfo.patid,
      yljgdm: this.patientInfo.yljgdm,
    }
    this.$api
      .getHsjcList(params)
      .then((res) => {
        if (res.data && res.data.length) {
          this.dataList = res.data
        }
        return
      })
      .catch((err) => {
        this.dataList = []
      })
  }
}
</script>

<style lang="scss" scoped>
.main_index {
  @include go-back-font-color;
  position: relative;
  left: 5%;
  height: 100%;
  width: 95%;
  .sub {
    height: 20%;
    // margin-top: 10px;
    .sub_main {
      font-size: 14px;
      display: inline-flex;
      height: 100%;
      width: 100%;
      .sub_right {
        left: 47%;
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
  width: 380px;
  height: 136px;
  overflow-y: auto;
  min-width: 200px;
  // margin-top: -10px;
  // height: 110%;
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
  .sub_info_title {
    font-size: 18px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #ffffff;
    line-height: 30px;
    opacity: 0.5;
  }
}
.left_content {
  // left: 32%;
  // right: 5%;
  position: relative;
  width: 380px;
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
  right: 52%;
}
.sub_right::before,
.sub_left::after {
  border-left: 1px solid white;
  content: '';
  top: 15px;
  left: -3px;
  position: relative;
  height: calc(100% + 1px);
}
.sub_left::after {
  left: 7.3%;
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

.innerTitle {
  font: 16px SourceHanSansCN-Bold !important;
}
.sub_yang_circle {
  display: inline-block;
  color: #fff;
  margin-left: 10px;
  background: #ae2325;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  line-height: 22px;
  padding-left: 4px;
}
.sub_yin_circle {
  display: inline-block;
  color: #fff;
  margin-left: 10px;
  background: #008f8e;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  line-height: 22px;
  padding-left: 4px;
}
</style>
