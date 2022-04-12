<template>
  <div class="main_index">
    <div v-for="item in dataList" :key="item.id" class="sub">
      <div :class="['sub_main', { last: item.id === dataList.length }]">
        <template v-if="item.position === 'right'">
          <div :class="['sub_right', 'flex']">
            <div class="circle"></div>
            <div class="sub_title">
              {{ item.dqlc }}
              <div :class="[item.dqlcColor, 'title_color']"></div>
            </div>
            <div class="sub_content" :style="{ background: item.color }">
              <div class="flex flex-align-center">
                <div
                  :class="[
                    item.dqlcColor === 'green'
                      ? 'triangle_arrow'
                      : 'triangle_arrow_null',
                  ]"
                ></div>
                <div class="sub_sj">{{ item.sj }}</div>
              </div>
              <div class="sub_jc">{{ item.jc }}</div>
              <div class="flex">
                <div
                  class="circle_zy first_circle"
                  v-if="item.qxdz && item.qxdz !== ''"
                ></div>
                <div
                  class="sub_dz"
                  :style="{
                    color:
                      item.qxdz && item.qxdz !== '' ? '#c1c1c1' : '#ffffff',
                  }"
                >
                  {{ item.dz }}
                </div>
              </div>
              <div class="sub_ksmc">{{ item.ksmc }}</div>
              <div v-if="item.qxdz && item.qxdz !== ''" class="flex qxdz">
                <div class="circle_zy"></div>
                <div class="sub_qxdz">
                  {{ item.qxdz }}
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="item.position === 'left'">
          <div :class="['sub_left', 'flex']">
            <div class="sub_content" :style="{ background: item.color }">
              <div class="flex flex-align-center">
                <div class="triangle_arrow"></div>
                <div class="sub_sj">{{ item.sj }}</div>
                <div
                  :class="[
                    { sub_yang_circle: item.jg === '阳' },
                    { sub_yin_circle: item.jg === '阴' },
                  ]"
                  v-if="item.jg"
                >
                  {{ item.jg }}
                </div>
              </div>
              <div class="sub_dz left_dz">检测机构<br />{{ item.dz }}</div>
            </div>
            <div class="circle left_circle"></div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'
@Component({
  name: 'main',
})
export default class main extends Vue {
  @State patientInfo
  private dataList: any[] = []
  mounted() {
    this.getMainDataList()
  }
  private getMainDataList(): void {
    const params = {
      jzlsh: this.patientInfo.jzlsh,
      patid: this.patientInfo.patid,
      yljgdm: this.patientInfo.yljgdm,
    }
    this.$api
      .getMainDataList(params)
      .then((res) => {
        if (res.data && res.data.length) {
          this.dataList = res.data
          let a = 1
          this.dataList.forEach((item) => {
            item.id = a
            a = a + 1
          })
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
  .sub_main {
    font-size: 16px;
    display: inline-flex;
    height: 100%;
    width: 100%;
  }
  .sub {
    height: 22%;
    margin-top: 10px;
    .sub_right {
      left: 38%;
      position: relative;
      .sub_title {
        font-family: 'SourceHanSansCN-Bold';
        width: 150px;
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        letter-spacing: 2px;
        margin-top: -10px;
        margin-left: -2px;
        .title_color {
          width: 60px;
          height: 40px;
          margin-left: 46px;
          background-size: 100%;
          margin-top: -18px;
        }
        .green {
          background: url('../../../assets/images/green.png') center no-repeat;
        }
        .violet {
          background: url('../../../assets/images/violet.png') center no-repeat;
        }
        .yellow {
          background: url('../../../assets/images/yellow.png') center no-repeat;
        }
        .grey {
          background: url('../../../assets/images/grey.png') center no-repeat;
        }
        .blue {
          background: url('../../../assets/images/blue.png') center no-repeat;
        }
      }
      .sub_title:before,
      .sub_title:after {
        content: '';
        position: absolute;
        top: 7%;
        // background-color: #ffffff;
        background: linear-gradient(to right, #ccc, #02122c) !important;
        width: 6%;
        height: 1px;
      }
      .sub_title:before {
        left: 6px;
      }
      .sub_title:after {
        left: 128px;
      }
    }
    .sub_left {
      width: calc(40% - 110px);
      // width: 40%;
    }
  }
}
.sub_content {
  width: 324px;
  margin-top: -10px;
  height: 90%;
  // 太多内容设置滚动条
  overflow-y: auto;
  .triangle_arrow {
    width: 22px;
    height: 23px;
    background: url('../../../assets/images/triangle -arrow.png') center
      no-repeat;
    background-size: 100%;
    display: inline-flex;
    margin-right: 4px;
  }
  .triangle_arrow_null {
    width: 22px;
    height: 23px;
    background-size: 100%;
    display: inline-flex;
    margin-right: 4px;
  }
  .sub_sj {
    // font-weight: bold;
    font-family: 'OPPOSans-B';
    font-size: 20px;
    padding: 5px 0;
  }
  .sub_yang_circle {
    font-family: 'SourceHanSansCN-Bold';
    display: inline-block;
    color: #fff;
    margin-left: 50px;
    background: #ae2325;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    line-height: 24px;
    padding-left: 4px;
  }
  .sub_yin_circle {
    font-family: 'SourceHanSansCN-Bold';
    display: inline-block;
    color: #fff;
    margin-left: 50px;
    background: #008f8e;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    line-height: 24px;
    padding-left: 4px;
  }

  .left_dz {
    font-family: 'SourceHanSansCN-Regular';
    margin-left: 22px;
  }
  .qxdz {
    margin-top: 0.05rem;
  }
  .sub_qxdz,
  .sub_dz,
  .sub_jc,
  .sub_ksmc {
    font-size: 18px;
    margin-left: 12px;
  }
  .sub_dz,
  .sub_qxdz,
  .sub_ksmc {
    font-size: 18px;
    margin-left: 25px;
  }
  .first_circle {
    border: 3px solid #c1c1c1 !important;
  }
  .circle_zy {
    transform: translateX(5px);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    border: 3px solid #ffffff;
    display: inline-flex;
    margin-top: 10px;
  }
  .first_circle::after {
    width: 1px;
    // background: #c1c1c1;
    content: '';
    position: absolute;
    height: 0.18rem;
    background: linear-gradient(to bottom, #ccc, #02122c) !important;
  }
}

.circle {
  width: 22px;
  height: 22px;
  background: url('../../../assets/images/circle.png') center no-repeat;
  background-size: 100%;
  display: inline-flex;
  margin-left: -14px;
}
.left_circle {
  position: absolute;
  right: 61%;
}
.left_circle::before {
  position: absolute;
  right: 90%;
  content: '';
  height: 1px;
  width: 80px;
  margin-top: 11px;
  // background-color: red;
  background: linear-gradient(to right, #ccc, #02122c) !important;
}

.sub_right::before,
.sub_left::after {
  border-left: 1px solid #ffffff;
  content: '';
  top: 15px;
  left: -3px;
  position: relative;
  height: calc(100% + 10px);
}
.sub_left::after {
  left: 38.5%;
}
.last ::before,
.last ::after {
  border: none !important;
  content: '';
}
</style>
