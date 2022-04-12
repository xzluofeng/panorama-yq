<template>
  <div class="operation-box">
    <el-timeline>
      <template v-for="(operation, operationIndex) in operationData">
        <el-timeline-item
          v-for="(item, index) in operation.list"
          :key="`${operationIndex}-${index}`"
          :timestamp="item.apsj"
          hide-timestamp
        >
          <p
            :class="[
              'title',
              { blue: operation.time === todayStr },
              `fs-${fontSize + 2}`
            ]"
          >
            {{ hanlderTitle(operation.dayNum) }}
          </p>
          <!-- 主刀医生，手术时间 -->
          <div class="flex flex-align-center flex-pack-justify-between">
            <div :class="['doctor', 'flex', `fs-${fontSize}`]">
              <div class="icon-box">
                <div class="icon-doc"></div>
              </div>
              <span class="flex-1 doc-name">
                {{ item.zdysmc }}
              </span>
            </div>
            <span :class="['operate-time', `fs-${fontSize}`]">
              {{ item.apsj && item.apsj.substr(5, 11) }}
            </span>
          </div>
          <!-- 手术名称 -->
          <p :class="['operate-name', `fs-${fontSize + 2}`]">
            {{ item.nssczmc }}
          </p>
          <!-- 手术状态 -->
          <div
            v-if="item.apsj && item.apsj.substr(0, 10) === todayStr"
            :class="[
              'operate-state',
              'flex',
              'flex-align-center',
              'flex-pack-justify-between',
              `fs-${fontSize - 2}`
            ]"
          >
            <span :class="['state', { 'title-s': item.sszt === '1' }]">
              {{
                item.sszt === '0'
                  ? '未开始'
                  : item.sszt === '1'
                  ? '手术中'
                  : item.sszt === '2'
                  ? '手术结束'
                  : '手术取消'
              }}
            </span>
            <span class="method" v-if="item.mzfsmc">{{ item.mzfsmc }}</span>
          </div>
          <!-- 其他信息 -->
          <div
            :class="[
              'other-doc',
              'flex',
              `fs-${fontSize - 2}`,
              'flex-pack-justify-between'
            ]"
          >
            <p>
              <span class="title-s">Ⅰ助：</span>
              {{ item.ssysyzmc || '-' }}
            </p>
            <p>
              <span class="title-s">Ⅱ助：</span>
              {{ item.ssysezmc || '-' }}
            </p>
            <p>
              <span class="title-s">机械护士：</span>
              {{ item.qxhsmc || '-' }}
            </p>
          </div>
          <!-- 诊断信息 -->
          <p :class="['diagnosis', 'flex', `fs-${fontSize - 2}`]">
            <span class="title-s">术前诊断：</span>
            <span class="diagnosis-content flex-1">
              {{ item.sqzdmc || '-' }}
            </span>
          </p>
          <p :class="['diagnosis', 'flex', `fs-${fontSize - 2}`]">
            <span class="title-s">术后诊断：</span>
            <span class="diagnosis-content flex-1">
              {{ item.shzdmc || '-' }}
            </span>
          </p>
        </el-timeline-item>
      </template>
    </el-timeline>
    <p class="no-data" v-if="!operationData.length">{{ emptyText }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
@Component({
  name: 'homeOperation'
})
export default class app extends Vue {
  @State yljgdm
  @State patientInfo
  @State fontSize

  private todayStr: string = '' // 今天日期
  private operationData: any[] = [] // 手术数据
  private emptyText: string = '' //无数据显示内容
  private timer: any = null // 每分钟查询一次今日手术的手术状态

  @Watch('patientInfo')
  changePatient(newVal) {
    this.emptyText = ''
    this.operationData = []
    this.getOperationData()
  }

  mounted() {
    this.init()
  }

  private init() {
    this.todayStr = this.$moment().format('YYYY-MM-DD')
    this.getOperationData()
  }

  // 获取手术列表
  private getOperationData(): void {
    this.emptyText = ''
    const fromData = {
      jzlsh: this.patientInfo.jzlsh,
      yljgdm: this.yljgdm
    }
    this.$api
      .gethzsySsyyjlList(fromData)
      .then(res => {
        this.emptyText = '暂无数据'
        const _res = res.data || []
        const target: any[] = []
        _res.forEach(item => {
          // 通过时间自定数据
          const operateTime = item.apsj.substr(0, 10)
          const daysNum = this.$moment(this.todayStr).diff(
            this.$moment(operateTime),
            'days'
          )
          const theGroup = target.find(i => {
            return i.time === operateTime
          })
          if (theGroup == null) {
            let _obj = {
              time: operateTime,
              dayNum: daysNum,
              list: [item]
            }
            target.push(_obj)
          } else {
            theGroup.list.push(item)
          }
        })
        this.operationData = target.sort((a: any, b: any) => {
          return a.dayNum - b.dayNum
        })
        return
      })
      .catch(err => {
        this.emptyText = '页面无响应'
        console.log(err)
      })
  }

  // 通过安排时间进行分组
  private hanlderTitle(dayNum: number): string {
    let title = ''
    if (dayNum > 0) {
      title = `术后${Math.abs(dayNum)}天`
    } else if (dayNum < 0) {
      title = `术前${Math.abs(dayNum)}天`
    } else {
      title = '今日手术'
    }
    return title
  }
}
</script>

<style lang="scss" scoped>
.operation-box {
  width: 100%;
  height: 100%;
  @include puhui-m;
  overflow-y: auto;
  padding: 10px 15px;
  .title {
    @include home-font-color;
    font-weight: 600;
    &.blue {
      color: #0f60f1;
    }
  }
  .doctor {
    margin-top: 5px;
    .icon-box {
      width: 40px;
      padding: 3px 5px;
      background-color: #5d9fea;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      flex-shrink: 0;
    }
    .icon-doc {
      width: 100%;
      height: 100%;
      background-image: url('../../../assets/images/icon-male-doc.png');
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
    }
    .doc-name {
      padding: 3px 10px;
      white-space: nowrap;
      @include doctor-item-bg-color;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
  // 手术时间
  .operate-time {
    @include el-table-title-font-color;
  }
  // 手术状态
  .operate-state {
    margin-top: 8px;
  }
  .method {
    padding: 0 8px;
    color: #2f89ef;
    border-radius: 4px;
    border: 1px solid #2f89ef;
  }
  // 手术名称
  .operate-name {
    @include home-font-color;
    font-weight: 600;
    margin-top: 9px;
  }
  .other-doc {
    flex-wrap: wrap;
    margin-top: 8px;
  }
  // 小标题
  .title-s {
    @include title-s-font-color;
    flex-shrink: 0;
  }
  // 诊断
  .diagnosis {
    margin-top: 8px;
  }
  .diagnosis-content {
    word-break: break-word;
  }
}
</style>
