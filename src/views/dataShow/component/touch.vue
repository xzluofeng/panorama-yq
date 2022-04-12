<!--
 * @Descripttion: 密接
 * @version:
 * @Author: 
 * @Date: 
 * @LastEditors: 
 * @LastEditTime: 
 -->
<template>
  <div class="main_index">
    <div v-for="item in dataList" :key="item.id" class="sub">
      <div :class="['sub_main', { last: item.id === dataList.length }]">
        <template v-if="item.position === 'right'">
          <div :class="['sub_right', 'flex']">
            <div class="circle right_circle"></div>
            <div
              class="sub_content right_content flex"
              :style="{ background: item.color }"
            >
              <div class="min_triangle-right"></div>
              <div class="triangle-right"></div>
              <div class="content_main">
                <div class="sub_sj">{{ item.sj }}</div>
                <div class="sub_nr">{{ item.dz }}</div>
              </div>
            </div>
            <div
              class="sub_children"
              v-if="item.children && item.children.length > 0"
            >
              <div
                v-for="subItem in item.children"
                :key="subItem.id"
                class="children_main"
              >
                <div
                  :class="['horizontal_line', { right_line: subItem.id !== 1 }]"
                  :style="[
                    { width: subItem.id === 1 ? '0.3rem' : '0.15rem' },
                    { 'margin-left': subItem.id === 1 ? '0' : '0.15rem' },
                  ]"
                ></div>
                <div
                  class="subItem_content"
                  :style="{ background: subItem.color }"
                >
                  <div class="sub_name">{{ subItem.name }}</div>
                  <div class="sub_message flex">
                    <div
                      :class="[
                        { male: subItem.sex === '1' },
                        { female: subItem.sex === '2' },
                        'people',
                      ]"
                    ></div>
                    <div class="sub_phone">{{ subItem.phone }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-if="item.position === 'left'">
          <div :class="['sub_left', 'flex']">
            <div
              class="sub_children left_children"
              v-if="item.children && item.children.length > 0"
            >
              <div
                v-for="subItem in item.children"
                :key="subItem.id"
                class="children_main"
              >
                <div
                  class="subItem_content left_subItem"
                  :style="{ background: subItem.color }"
                >
                  <div class="sub_name">{{ subItem.name }}</div>
                  <div class="sub_message flex">
                    <div
                      :class="[
                        { male: subItem.sex === '1' },
                        { female: subItem.sex === '2' },
                        'people',
                      ]"
                    ></div>
                    <div class="sub_phone">{{ subItem.phone }}</div>
                  </div>
                </div>
                <div
                  :class="['horizontal_line', { left_line: subItem.id !== 1 }]"
                  :style="[{ width: subItem.id === 1 ? '0.3rem' : '0.15rem' }]"
                ></div>
              </div>
            </div>
            <div
              class="sub_content flex left_content"
              :style="{ background: item.color }"
            >
              <div class="min_triangle-right"></div>
              <div class="triangle-right"></div>
              <div class="content_main">
                <div class="sub_sj">{{ item.sj }}</div>
                <div class="sub_nr">{{ item.dz }}</div>
              </div>
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
@Component({ name: 'touch' })
export default class touch extends Vue {
  @State patientInfo
  private dataList: any[] = []
  mounted() {
    this.getMjryxxList()
  }
  private getMjryxxList(): void {
    const params = {
      jzlsh: this.patientInfo.jzlsh,
      patid: this.patientInfo.patid,
      yljgdm: this.patientInfo.yljgdm,
    }
    this.$api
      .getMjryxxList(params)
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
  height: 100%;
  width: 100%;
  .sub_main {
    font-size: 14px;
    display: inline-flex;
    height: 100%;
    width: 100%;
  }
  .sub {
    height: 30%;
    margin-top: 10px;
    .sub_right {
      left: 50%;
      position: relative;
      .sub_title {
        width: 150px;
        text-align: center;
      }
      .sub_title:before,
      .sub_title:after {
        content: '';
        position: absolute;
        top: 12%;
        background-color: #eee;
        width: 10%;
        height: 1px;
      }
      .sub_title:before {
        left: 10px;
      }
    }
    .sub_left {
      width: 50%;
    }
  }
}
.right_content {
  margin-left: 30px;
}
.left_content {
  position: absolute;
  right: 54.8%;
}
.sub_content {
  width: 200px;
  height: 100px;
  overflow-y: auto;
  min-width: 180px;
  margin-top: -10px;
  border-radius: 4px;
  padding: 0px 10px;
  .content_main {
    padding-left: 5px;
    .sub_sj {
      font-weight: bold;
      padding: 10px 0;
      font: 20px / 1.25 OPPOSans-B;
    }
    .sub_nr {
      padding-bottom: 5px;
      font: 16px / 1.25 Source Han Sans CN !important;
      font-size: 18px;
      color: #ffff;
    }
  }
  .min_triangle-right {
    margin-top: 15px;
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-left: 10px solid rgba(255, 255, 230, 1);
    border-bottom: 5px solid transparent;
    box-shadow: 0px 0px 6px #c1d234;
  }

  .triangle-right {
    margin-top: 15px;
    margin-left: -4px;
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-left: 10px solid #ffffb2;
    border-bottom: 5px solid transparent;
  }
}
.left_children {
  position: absolute;
  right: 76%;
}
.sub_children {
  margin-top: -10px;
  .children_main {
    display: flex;
    .right_line::before,
    .left_line::after {
      content: '';
      height: 80px;
      width: 1px;
      background-color: #eee;
      position: absolute;
      margin-top: -80px;
    }
    .left_line::after {
      margin-left: 0.15rem;
    }
    .horizontal_line {
      height: 1px;
      background-color: #eee;
      margin-top: 24px;
    }
    .left_subItem {
      padding-left: 50px;
    }
    .subItem_content {
      height: 70px;
      width: 140px;
      border-radius: 4px;
      margin-bottom: 10px;
      line-height: 25px;
      padding: 5px 10px;
      .sub_name {
        font: 16px / 1.25 Source Han Sans CN !important;
        padding: 4px 0px;
      }
      .sub_message {
        height: 20px;
        font: 16px / 1.25 OPPOSans;
        .male {
          background: url('../../../assets/images/male.png') center no-repeat;
        }
        .female {
          background: url('../../../assets/images/female.png') center no-repeat;
        }
        .people {
          width: 8px;
          height: 18px;
          background-size: 100%;
          margin-right: 5px;
        }
      }
    }
  }
}

.circle {
  width: 22px;
  height: 22px;
  background: url('../../../assets/images/circle.png') center no-repeat;
  background-size: 100%;
  display: inline-flex;
  margin-left: -0.068rem;
}
.left_circle {
  position: absolute;
  right: 49%;
}
.left_circle::before {
  right: 49%;
}
.right_circle::before,
.left_circle::before {
  position: absolute;
  content: '';
  height: 1px;
  width: 30px;
  margin-top: 9px;
  // background-color: #eee;
}
.right_circle::before {
  margin-left: 16px;
  background: linear-gradient(to right, #02122c, #ccc) !important;
}
.left_circle::before {
  margin-right: 10px;
  background: linear-gradient(to right, #ccc, #02122c) !important;
}
.sub_right::before,
.sub_left::after {
  border-left: 1px solid white;
  content: '';
  top: 15px;
  left: -3px;
  position: relative;
  height: calc(100% + 11px);
}
.sub_left::after {
  left: 99.5%;
}
.last ::before,
.last ::after {
  border: none !important;
  content: '';
}
</style>
