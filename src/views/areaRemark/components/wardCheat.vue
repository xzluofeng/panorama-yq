<!--
 * @Descripttion: 病区备忘
 * @version:
 * @Author: wangqi
 * @Date: 2019-08-21 08:50:04
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-21 08:50:04
 -->
<template>
  <div class="ward-cheat">
    <p class="title">
      病区备忘
    </p>
    <div class="cheat-content">
      <el-input
        :class="`fs-${fontSize}`"
        type="textarea"
        placeholder="请输入内容"
        v-model="cheat"
        resize="none"
        @change="saveCheat"
      >
      </el-input>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'
@Component({
  name: 'wardCheat'
})
export default class wardCheat extends Vue {
  @State associationAreaCode
  @State associationOfficeCode
  @State yljgdm
  @State fontSize

  private cheat: string = '' // 病区备注

  mounted() {
    this.getCheat()
  }

  /**
   * @name: getCheat
   * @test: test font
   * @msg: 获取病区备忘录
   * @param {void}
   * @return: void
   */
  private getCheat(): void {
    const param = {
      yljgdm: this.yljgdm,
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      bzlb: '1' // 备注类别 1：病区，0：病人
    }
    this.$api
      .getAreaRemark(param)
      .then(res => {
        const _data = res.data || []
        if (_data.length) {
          const _cheat = _data[0].bzms || ''
          this.cheat = _cheat.replace(/<br>/g, '\n')
        }
        return
      })
      .catch(err => {
        this.$message({
          message: '获取病区备注失败！',
          type: 'error'
        })
      })
  }

  /**
   * @name: saveCheat
   * @test: test font
   * @msg: 失去焦点保存
   * @param {void}
   * @return: void
   */
  private saveCheat(): void {
    const fmartCheat = this.cheat.replace(/\n|\r\n/g, '<br>')
    const param = {
      yljgdm: this.yljgdm,
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      bzlb: '1',
      jzlsh: '',
      patid: '',
      cwdm: '',
      bzms: fmartCheat
    }
    this.$api
      .editRemark(param)
      .then(res => {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        return
      })
      .catch(err => {})
  }
}
</script>

<style lang="scss" scoped>
.ward-cheat {
  position: relative;
  width: 805px;
  .title {
    position: absolute;
    left: 25px;
    top: 15px;
    @include remark-title-font-color;
    font-size: 24px;
    @include puhui-m;
  }

  .cheat-content {
    height: 100%;
  }
  .el-textarea {
    height: 100%;
    @include puhui-r;
  }
}
</style>
