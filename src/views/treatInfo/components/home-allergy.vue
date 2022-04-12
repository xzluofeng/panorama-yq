<template>
  <!-- 过敏模块 -->
  <ul class="home-allergy">
    <li :class="['flex', `fs-${fontSize}`]">
      <span class="title">药物过敏：</span>
      <span class="content flex-1">{{ drug || '-' }}</span>
    </li>
    <li :class="['flex', `fs-${fontSize}`]">
      <span class="title">食物过敏：</span>
      <span class="content flex-1">{{ food || '-' }}</span>
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State } from 'vuex-class'
@Component({
  name: 'homeAllergy'
})
export default class homeAllergy extends Vue {
  @State associationAreaCode
  @State associationOfficeCode
  @State patidList
  @State yljgdm
  @State patientInfo
  @State fontSize

  @Watch('patientInfo')
  changePatient(newVal) {
    this.food = ''
    this.drug = ''
    this.getAllergyData()
  }

  private food: string = '' //食物过敏
  private drug: string = '' //食物过敏

  mounted() {
    this.getAllergyData()
  }

  /**
   * @name: getAllergyData
   * @test: test font
   * @msg: 获取过敏数据
   * @param {void}
   * @return: void
   */
  private getAllergyData(): void {
    const formData = {
      psjgList: '1,2,3,4',
      keystrList: this.patidList
    }
    this.$api
      .getGroupedGmgmjlk(formData)
      .then(res => {
        const _res = res.data || {}
        const foodArr: string[] = []
        const drugArr: string[] = []
        for (let k in _res) {
          if (k === '药物过敏') {
            _res[k].forEach(item => {
              drugArr.push(item.gmymc)
            })
          } else if (k === '食物过敏') {
            _res[k].forEach(item => {
              foodArr.push(item.gmymc)
            })
          }
        }
        this.food = foodArr.join('，')
        this.drug = drugArr.join('，')
        return
      })
      .catch(err => {})
  }
}
</script>

<style lang="scss" scoped>
.home-allergy {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  @include puhui-r;
  margin-left: 15px;
  padding-top: 10px;
  li {
    min-height: 40px;
  }
  .title {
    @include el-menu-font-color;
    flex-shrink: 0;
  }
  .content {
    color: #ff336a;
  }
}
</style>
