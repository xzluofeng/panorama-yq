<!--
 * @Descripttion: 患者详情 - 脚部
 * @version:
 * @Author: wangqi
 * @Date: 2019-08-01 17:26:30
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-01 17:34:33
 -->
<template>
  <div
    :class="[
      't-foot',
      'flex',
      'flex-align-center',
      { 'flex-reverse': rightHandType }
    ]"
  >
    <span class="go-back item" @click="$router.back()"
      ><i class="icon"></i>返回</span
    >
    <!-- <span class="item icon" @click="startScreenShot">
      <i class="header-icon screenshot"></i>
    </span> -->
    <span class="item font icon" @click="ADD_FONT_SIZE">
      <i class="header-icon add-font"></i>
    </span>
    <span class="item font icon" @click="DECREASE_FONT_SIZE">
      <i class="header-icon cut-font"></i>
    </span>
    <span class="flex">
      <span class="item arrow icon" @click="changeSelectPatient(0)">
        <i class="header-icon previous"></i>
      </span>
      <span class="item arrow icon" @click="changeSelectPatient(1)">
        <i class="header-icon next"></i>
      </span>
    </span>
    <div
      :class="['bed-container', 'flex-1', { 'mr-15': rightHandType }]"
      ref="bedNoContainer"
    >
      <div class="bed-box flex flex-align-center" ref="bedNoBox">
        <bed-no
          ref="bed"
          v-for="(item, index) in bedList"
          :key="index"
          :jump="false"
          :data="item"
          :highlight="
            activeBedNo === item.rycw ||
              activeBedNo === item.cycw ||
              activeBedNo === item.cwdm
          "
          @click.native="changePatient(item)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State, Action, Mutation } from 'vuex-class'
import bedNo from '../../../components/bedNoCell.vue'
import mousewheel from '../../../mixin/mousewheel'
@Component({
  name: 'tFoot',
  components: {
    bedNo
  },
  mixins: [mousewheel]
})
export default class tFoot extends Vue {
  @State kscreenObj
  @State rightHandType
  @State yljgdm
  @State associationAreaCode
  @State associationOfficeCode
  @State patientInfo

  @Action getPatientInfo

  @Mutation CHANGE_HAND_TYPE
  @Mutation ADD_FONT_SIZE
  @Mutation DECREASE_FONT_SIZE

  private bedList: any = [] // 所有床位
  private activeBedNo: string = '' // 当前显示数据的index

  mounted() {
    this.activeBedNo = this.patientInfo.rycw || this.patientInfo.cycw
    this.getBedList()
  }

  /**
   * @name: startScreenShot
   * @test: test font
   * @msg: 开始截屏
   * @param {void}
   * @return: void
   */
  private startScreenShot(): void {
    // this.kscreenObj.startScreenShot()
    const val = !this.rightHandType
    this.CHANGE_HAND_TYPE(val)
  }

  /**
   * @name: getBedList
   * @test: test font
   * @msg: 获取当前病区所有床位
   * @param {void}
   * @return: void
   */
  private getBedList(): void {
    const params = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm
    }
    this.$api
      .getZyCwList(params)
      .then(res => {
        const _res = res.data || {}
        this.bedList = _res.data || []
        this.$nextTick(() => {
          this.scroll(this.$refs.bedNoContainer, this.$refs.bedNoBox)
          if (
            this.patientInfo.rycw === '' ||
            this.patientInfo.rycw == null ||
            this.patientInfo.cycw === '' ||
            this.patientInfo.cycw == null
          ) {
            return
          }
          const _bed = Array.prototype.find.call(this.$refs.bed, item => {
            const itemCwdm = item.data.rycw || item.data.cycw || item.data.cwdm
            const CWDM =
              this.patientInfo.rycw ||
              this.patientInfo.cycw ||
              this.patientInfo.cwdm
            return itemCwdm === CWDM
          })
          const container: any = this.$refs.bedNoContainer
          const _width = container.offsetWidth
          if (_bed.$el.offsetLeft > _width) {
            container.scrollLeft = _bed.$el.offsetLeft - _width / 2
          }
        })
        return
      })
      .catch(err => {
        this.$message({
          message: '获取床位列表失败！',
          type: 'error'
        })
      })
  }

  /**
   * @name: changePatient
   * @test: test font
   * @msg: 切换患者
   * @param {void}
   * @return: void
   */
  private changePatient(patient: any) {
    this.activeBedNo = patient.rycw || patient.cycw || patient.cwdm
    this.getPatientInfo(patient)
      .then(() => {
        this.$emit('changeRecordIndex', true)
        return
      })
      .catch(() => {})
  }

  private changeSelectPatient(type: number): void {
    const bedNo =
      this.patientInfo.rycw || this.patientInfo.cycw || this.patientInfo.cwdm
    const _index = this.bedList.findIndex(item => {
      return item.rycw === bedNo || item.cycw === bedNo || item.cwdm === bedNo
    })
    if (type) {
      // 下一个
      if (_index === this.bedList.length - 1) {
        return
      } else {
        const next = this.bedList[_index + 1]
        this.getPatientInfo(next)
        this.activeBedNo = next.rycw || next.cycw || next.cwdm
        const _bed = Array.prototype.find.call(this.$refs.bed, item => {
          const CWDM =
            this.patientInfo.rycw ||
            this.patientInfo.cycw ||
            this.patientInfo.cwdmk
          const itemCwdm = item.data.rycw || item.data.cycw || item.data.cwdm
          return itemCwdm === CWDM
        })
        const container: any = this.$refs.bedNoContainer
        const _width = container.offsetWidth
        if (_bed.$el.offsetLeft > _width) {
          container.scrollLeft = _bed.$el.offsetLeft - _width / 2
        }
      }
    } else {
      // 上一个
      if (_index === 0) {
        return
      } else {
        const prev = this.bedList[_index - 1]
        this.activeBedNo = prev.rycw || prev.cycw || prev.cwdm
        this.getPatientInfo(prev)
        const _bed = Array.prototype.find.call(this.$refs.bed, item => {
          const itemCwdm = item.data.rycw || item.data.cycw || item.data.cwdm
          const CWDM =
            this.patientInfo.rycw ||
            this.patientInfo.cycw ||
            this.patientInfo.cwdm
          return itemCwdm === CWDM
        })
        const container: any = this.$refs.bedNoContainer
        const _width = container.offsetWidth
        if (_bed.$el.offsetLeft > _width) {
          container.scrollLeft = _bed.$el.offsetLeft - _width / 2
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.t-foot {
  height: 50px;
  padding: 0 15px;
  color: #5d77ab;
  span {
    margin-right: 10px;
  }
  .item {
    font-size: 21px;
    background: #f9fbff;
    border: 2px solid #d5e1f8;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(30, 60, 114, 0.4);
  }
  .go-back {
    width: 150px;
    height: 48px;
    line-height: 44px;
    padding-left: 32px;
    @include home-content-bg;
    @include button-border;
    .icon {
      display: inline-block;
      width: 24px;
      height: 18px;
      margin-right: 10px;
      background-image: url('../../../assets/images/go-back.png');
      background-size: contain;
      background-repeat: no-repeat;
    }
    cursor: pointer;
  }
  &.flex-reverse .go-back {
    margin-right: 0;
  }
  .header-icon {
    width: 44px;
    height: 44px;
  }
  .arrow,
  .font {
    @include home-content-bg;
    @include button-border;
  }
  .icon {
    width: 48px;
    height: 48px;
    cursor: pointer;
  }

  .previous,
  .next {
    background-size: 15px 24px;
    background-repeat: no-repeat;
    background-position: center;
  }
  .previous {
    background-image: url('../../../assets/images/icon-previous.png');
  }
  .next {
    background-image: url('../../../assets/images/icon-next.png');
  }

  .bed-container {
    position: relative;
    @include home-content-bg;
    box-shadow: 0 2px 4px rgba(30, 60, 114, 0.4);
    height: calc(100% + 2px);
    border-radius: 4px;
    overflow-x: auto;
  }
  .bed-box {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    flex-wrap: nowrap;
    overflow-y: hidden;
  }
  .bed-no {
    margin-right: 15px;
  }
  .mr-15 {
    margin-right: 15px;
  }
}
</style>
