<template>
  <div class="patient-group " ref="content">
    <div class="group-content">
      <div
        v-for="(typeItem, typeIndex) in tableList"
        :key="`item-${typeIndex}`"
        class="list-box"
      >
        <div
          v-for="(quota, quotaIndex) in typeItem.detail"
          :key="`item-${quotaIndex}`"
          class="list-group"
          :data="`${typeItem.name}(${quota.type})`"
        >
          <div class="list-item">
            <div :class="['title-s', `fs-${fontSize + 2}`]">
              <div class="item-type flex flex-pack-justify-end">
                <p class="flex-1">
                  {{ typeItem.name + '(' + quota.type + ')' }}
                </p>
              </div>
            </div>
            <div class="list-container flex-1 flex flex-align-center">
              <bedNo
                class="mar"
                :highlight="bedNoData.rycw === activeBedNo"
                v-for="(bedNoData, bedNoIndex) in quota.list"
                :key="`bedNo${bedNoIndex}`"
                :data="bedNoData"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import bedNo from '../../../components/bedNoCell.vue'
import { sectionalizeArr } from '../../../libs/utils'
@Component({
  name: 'patientGroup',
  components: {
    bedNo
  }
})
export default class patientGroup extends Vue {
  @State yljgdm
  @State associationAreaCode
  @State associationOfficeCode
  @State sizeMultiple
  @State fontSize

  @Prop(String)
  groupName!: string

  @Prop(String)
  activeBedNo!: string

  private tableList: object[] = [] //数据

  private contentContainer: any = null

  private offsetTopList: any[] = []

  mounted() {
    this.getDetailList()
  }

  /**
   * @name: getDetailList
   * @test: test font
   * @msg: 获取数据列表
   * @param {void}
   * @return: void
   */
  private getDetailList(): void {
    const params = {
      ksdm: this.associationOfficeCode,
      bqdm: this.associationAreaCode,
      yljgdm: this.yljgdm,
      needGroup: false
    }
    this.$api
      .getHzfzData(params)
      .then(res => {
        if (res.data) {
          this.tableList = res.data
          this.tableList.forEach((item: any) => {
            item.detail = sectionalizeArr(item.detail, 'name')
          })
          this.contentContainer = this.$refs.content
          this.$nextTick(() => {
            this.getDefaultCwdm()
          })
        }
        return
      })
      .catch(err => {
        this.$message({
          message: err.message,
          type: 'error'
        })
      })
  }

  //定位默认的床位
  private getDefaultCwdm(): void {
    this.offsetTopList = []
    let group = document.querySelectorAll('.list-group')
    group.forEach((item: any, index) => {
      this.offsetTopList.push({
        top: item.offsetTop,
        height: item.offsetHeight,
        data: item.getAttribute('data'),
        index: index
      })
    })
    let paddHeight = 0
    if (this.contentContainer) {
      paddHeight =
        this.contentContainer.offsetHeight -
        this.offsetTopList[this.offsetTopList.length - 1].height
    }

    if (paddHeight > 0) {
      this.contentContainer.style.paddingBottom = paddHeight + 20 + 'px'
    }
    if (this.groupName) {
      const index = this.offsetTopList.findIndex(item => {
        return item.data === this.groupName
      })
      this.contentContainer.scrollTop = this.offsetTopList[index].top - 10
    }
  }
}
</script>

<style lang="scss" scoped>
.patient-group {
  height: 100%;
  overflow: auto;
  // 小分组样式
  .list-group {
    padding-bottom: 10px;
    padding-top: 10px;
    @include el-menu-font-color;
    border-bottom: 1px dashed rgba(112, 112, 112, 1);
  }
  .list-group:nth-child(2n) {
    @include hzfz-2n-bg-color;
  }

  .list-box {
    padding: 14px;
  }
  .list-item {
    margin-bottom: 15px;
    @include puhui-m;
  }

  .title-s {
    p {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .list-container {
    flex-wrap: wrap;
    margin: 14px 0 -15px 10px;
  }
  .content-container {
    overflow-y: auto;
  }
}
</style>
