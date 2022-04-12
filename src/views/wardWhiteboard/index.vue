<!--
 * @Descripttion: 电子白板页面
 * @version:
 * @Author: wangqi
 * @Date: 2019-07-16 15:42:07
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-15 13:21:38
 -->
<template>
  <section class="ward-board flex">
    <!-- 左边 echart以及概况，重点关注 -->
    <section class="board-left flex flex-v">
      <group />
      <keyArea class="flex-1" />
    </section>
    <!-- 病区信息列表展示，（备忘录，值班，分管床位）,消息提醒 -->
    <section class="board-right flex flex-v">
      <centralizedArea class="flex-1" />
      <other />
      <!-- 消息盒子 -->
      <div class="message-container flex flex-align-center">
        <i class="icon el-icon-message-solid"></i>
        <span class="type">消息</span>
        <!-- 消息内容 -->
        <div class="message-show flex-1">
          <ul :class="['message-content', { animat: textAnimationSwitch }]">
            <li
              v-for="(item, index) in messageList"
              :key="index"
              class="message-item flex flex-align-center"
            >
              <span :class="['time', `fs-${fontSize + 2}`]">{{
                item.fssj.slice(11, 16)
              }}</span>
              <bedNo :data="item" :jump="false" :highlight="true" />
              <div :class="['content', 'flex-1', `fs-${fontSize}`]">
                {{ item.value }}
              </div>
            </li>
            <span class="no-data" v-if="!messageList.length">暂无数据</span>
          </ul>
        </div>
        <!-- 点击 弹框 -->
        <el-popover
          v-model="showPopover"
          offset="-25"
          placement="top-end"
          trigger="click"
        >
          <div class="message-box">
            <i class="el-icon-close" @click="showPopover = false"></i>
            <div class="today">
              <p class="title">今日消息</p>
              <div
                v-for="(item, index) in todayRemind"
                :key="`today-${index}`"
                class="message-item flex"
              >
                <p :class="['time', `fs-${fontSize + 2}`]">
                  {{ item.fssj.slice(11, 16) }}
                </p>
                <div class="message-content">
                  <div>
                    <bedNo :data="item" />
                    <i class="icon-critical" v-if="item.txlb === '1'"></i>
                  </div>
                  <div
                    :class="[
                      'content',
                      'flex',
                      'flex-align-center',
                      `fs-${fontSize}`
                    ]"
                  >
                    <span class="describe">{{ item.txlbmc }}</span>
                    <span
                      class="doctor flex flex-align-center"
                      v-if="item.txlb === '3'"
                    >
                      <i class="icon-doctor"></i>
                      <span class="flex-1">{{ item.ysmc }}</span>
                    </span>
                    <span v-else>{{ item.value }}</span>
                  </div>
                </div>
              </div>
              <span class="no-data" v-if="!todayRemind.length">
                暂无今日消息数据
              </span>
            </div>
            <div class="yesterday">
              <p class="title">昨日消息</p>
              <div
                v-for="(item, index) in yesterdayRemind"
                :key="`yesterday-${index}`"
                class="message-item flex"
              >
                <p :class="['time', `fs-${fontSize + 2}`]">
                  {{ item.fssj.slice(11, 16) }}
                </p>
                <div class="message-content">
                  <div>
                    <bedNo :data="item" />
                    <i class="icon-critical" v-if="item.txlb === '1'"></i>
                  </div>
                  <div
                    :class="[
                      'content',
                      'flex',
                      'flex-align-center',
                      `fs-${fontSize}`
                    ]"
                  >
                    <span class="describe">{{ item.txlbmc }}</span>
                    <span
                      class="doctor flex flex-align-center"
                      v-if="item.txlb === '3'"
                    >
                      <i class="icon-doctor"></i>
                      <span class="flex-1">{{ item.ysmc }}</span>
                    </span>
                    <span v-else>{{ item.value }}</span>
                  </div>
                </div>
              </div>
              <span class="no-data" v-if="!yesterdayRemind.length">
                暂无昨日消息数据
              </span>
            </div>
          </div>
          <span class="show-box" slot="reference"></span>
        </el-popover>
      </div>
    </section>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'
import moment from 'moment'
import bedNo from '../../components/bedNoCell.vue'
import group from './components/group.vue'
import keyArea from './components/keyArea.vue'
import centralizedArea from './components/centralizedArea.vue'
import other from './components/other.vue'

@Component({
  name: 'wardWhiteboard',
  components: {
    bedNo,
    group,
    keyArea,
    centralizedArea,
    other
  }
})
// todo 点击弹框字段后续添加（床位号下面的内容）
export default class wardWhiteboard extends Vue {
  @State remindData
  @State fontSize

  private textAnimation: any = null // 文字滚动计时器容器
  private textAnimationSwitch: boolean = false // 文字滚动开关

  private showPopover: boolean = false // popover控制

  created() {
    // 一分钟滚动一次
    this.textAnimation = setInterval(() => {
      this.textScroll()
    }, 60000)
  }

  beforeDestroy() {
    clearInterval(this.textAnimation)
  }

  get messageList(): object[] {
    // 电子白板底部，选取两条数据展示
    return this.remindData.slice(0, 2) || []
  }

  /**
   * @name: todayRemind
   * @test: test font
   * @msg: popover-今日数据
   * @param {void}
   * @return:[]
   */
  get todayRemind(): object[] {
    return this.remindData.filter(item => {
      return moment(moment(Date.now()).format('YYYY-MM-DD')) < moment(item.lrrq)
    })
  }

  /**
   * @name: yesterday
   * @test: test font
   * @msg: popover-昨日数据
   * @param {void}
   * @return:[]
   */
  get yesterdayRemind(): object[] {
    return this.remindData.filter(item => {
      return moment(moment(Date.now()).format('YYYY-MM-DD')) > moment(item.lrrq)
    })
  }

  /**
   * @name: textScroll
   * @test: test font
   * @msg: 文字滚动函数
   * @param {void}
   * @return:void
   */
  private textScroll(): void {
    if (this.messageList.length < 2) {
      return
    }
    this.textAnimationSwitch = true
    setTimeout(() => {
      this.messageList.push(this.messageList[0])
      this.messageList.shift()
      this.textAnimationSwitch = false
    }, 500)
  }
}
</script>
<style lang="scss" scoped>
.ward-board {
  height: 100%;
  .board-left {
    width: 1150px;
    height: 100%;
    margin-right: 15px;
    & > div {
      box-shadow: 0 2px 4px rgba(30, 60, 114, 0.6);
      border-radius: 4px;
    }
  }
  .board-right {
    width: 720px;
    & > div {
      box-shadow: 0 2px 4px rgba(30, 60, 114, 0.6);
      border-radius: 4px;
    }
  }
  // 消息盒子
  .message-container {
    height: 60px;
    padding: 0 25px;
    @include home-title-font-color;
    @include puhui-r;
    @include home-content-bg;
    border-radius: 4px;
    background-color: #fff;
    .message-show {
      height: 30px;
      overflow: hidden;
    }
    .message-content {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      &.animat {
        transition: all 0.5s;
        margin-top: -30px;
      }
      li {
        height: 30px;
        line-height: 30px;
      }
      .no-data {
        position: absolute;
      }
    }
    .icon {
      font-size: 26px;
      margin-right: 10px;
    }
    .type {
      font-size: 24px;
      margin-right: 10px;
      flex-shrink: 0;
    }
    .time {
      margin-right: 17px;
    }
    .bed-no {
      margin-right: 10px;
    }
    .content {
      @include home-title-s-font-color;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .show-box {
      display: inline-block;
      width: 32px;
      height: 32px;
      background-image: url('../../assets/images/icon-message.png');
      background-size: cover;
    }
  }
}
.message-box {
  position: relative;
  width: 490px;
  height: 550px;
  overflow-y: auto;
  .el-icon-close {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 20px;
    cursor: pointer;
  }
  .today,
  .yesterday {
    margin-left: 20px;
  }
  .today {
    margin-bottom: 20px;
  }
  .title {
    @include home-title-font-color;
    font-size: 24px;
    @include puhui-r;
    margin-bottom: 15px;
  }

  // 弹框里面message单个样式
  .message-item {
    margin-bottom: 15px;
  }

  .time {
    @include el-table-title-font-color;
    @include puhui-r;
    margin-right: 20px;
  }
  // 危急值
  .icon-critical {
    display: inline-block;
    width: 28px;
    height: 28px;
    background-image: url('../../assets/images/icon-critical.png');
    background-size: cover;
    vertical-align: bottom;
    margin-left: 15px;
  }
  .content {
    @include el-menu-font-color;
    @include puhui-r;
    margin-top: 10px;
  }
  .describe {
    margin-right: 20px;
  }
  .doctor {
    width: 140px;
    height: 40px;
    line-height: 40px;
    overflow: hidden;
    background-color: #e8f2ff;
    border-radius: 4px;
    .icon-doctor {
      display: inline-block;
      width: 40px;
      height: 40px;
      background-color: #9cc7f7;
      background-image: url('../../assets/images/icon-male-doc.png');
      background-size: 30px;
      background-position: center;
      background-repeat: no-repeat;
      margin-right: 10px;
    }
  }
}
</style>
