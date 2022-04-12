<template>
  <!-- 隔离信息 -->
  <div class="isolate_container">
    <el-card class="box-card">
      <div class="isolate-info" v-for="item in dataList" :key="item.index">
        <div class="card-left">
          <div>
            <span>
              隔离时间
              <span class="sub_content">
                <span>
                  {{ item.rzsj | tiemBeatys }}-{{ item.zcsj | tiemBeatys }}
                </span>
              </span>
            </span>
          </div>
          <div>
            <span>
              隔离地点
              <span class="sub_content">
                <span>{{ item.gldmc }}</span>
              </span>
            </span>
          </div>
          <div>
            <span>
              临床表现
              <span class="sub_content">
                <span>{{ item.lcbx }}</span>
              </span>
            </span>
          </div>
          <div v-for="items in item.hsjcList" :key="items.id">
            <!-- 可以能多次，v-for -->
            <span>
              核酸检测
              <span class="sub_content">
                <span>{{ items.sj | tiemBeatys }}</span>
              </span>
              <!-- 动态class渲染不同背景色 三元-->
              <span
                :class="[items.jg ? 'sub_yang_circle' : 'sub_yin_circle']"
                >{{ items.jg ? '阳' : '阴' }}</span
              >
            </span>
          </div>
          <div>
            <span>
              转院信息
              <span class="sub_content">
                <span>{{ item.zcsj | tiemBeatys }}</span>
                <span>{{ item.qxdz }}</span>
              </span>
            </span>
          </div>
        </div>
        <div class="card-right">
          {{ item.brlx }}
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'
import moment from 'moment'
@Component({
  name: 'isolate',
  filters: {
    tiemBeatys(val) {
      return moment(val).format('YYYY.MM.DD')
    },
  },
})
export default class Test extends Vue {
  @State patientInfo
  // 定义data属性
  private dataList: any[] = [] //承接后台数据

  mounted() {
    this.getGldryxxList()
  }
  private getGldryxxList(): void {
    const params = {
      jzlsh: this.patientInfo.jzlsh,
      yljgdm: this.patientInfo.yljgdm,
    }
    this.$api
      .getGldryxxList(params)
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
.isolate_container {
  height: calc(100% - 0.26042rem);
  overflow-y: auto;
  /deep/.el-card__body {
    padding: 0px !important;
  }
  .box-card {
    width: 60%;
    margin-left: 5%;
    border: 0px;
    cursor: pointer;
    background-color: transparent !important;
    margin-top: 10px;
    font: 18px / 1.25 Source Han Sans CN !important;
    letter-spacing: 1px;
    .isolate-info {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
      .sub_content {
        // font-weight: 600 !important;
        font: 18px / 1.25 OPPOSans;
        letter-spacing: 2px;
      }
      .card-left {
        flex: 95%;
        background-color: #074a5a;

        div {
          margin: 15px 0px 10px 34px;
          vertical-align: middle;
          .sub_yang_circle {
            display: inline-block;
            color: #fff;
            // text-shadow: 1px 1px 1px #fff;
            margin-left: 10px;
            background: #dd700c;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            line-height: 28px;
            text-align: center;
            transform: translateY(1px);
          }
          .sub_yin_circle {
            display: inline-block;
            color: #fff;
            margin-left: 10px;
            background: #008f8e;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            // text-shadow: 1px 1px 1px #fff;
            line-height: 28px;
            text-align: center;
            // padding-left: 4px;
            transform: translateY(1px);
          }
        }
        div:nth-child(1) {
          margin-left: 5px;
        }
        div:nth-child(1)::before {
          content: '';
          width: 22px;
          height: 23px;
          background: url('../../../assets/images/triangle -arrow.png') center
            no-repeat;
          background-size: 100%;
          display: inline-flex;
          margin-right: 2px;
          vertical-align: middle;
        }
        div > span {
          color: #859aa2;
          span {
            color: aliceblue;
            margin-left: 6px;
            // font-weight: bold;
          }
        }
      }
      .card-right {
        flex: 5%;
        // background-color: #04b5a3;
        background: linear-gradient(to bottom, #01b7a1, #12b5af 50%, #28b5bf);
        font-weight: bold;
        color: #005e59;
        // 设置文字垂直排列
        line-height: 250%;
        text-align: center;
        -webkit-writing-mode: vertical-lr;
        writing-mode: vertical-lr;
        letter-spacing: 3px;
      }
    }
  }
}
</style>
