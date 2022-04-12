<!--
 * @Descripttion: 集中区域
 * @version:
 * @Author: wangqi
 * @Date: 2019-08-01 14:41:00
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-15 16:25:16
 -->
<template>
  <div class="centralized-area">
    <div
      class="centralized-box"
      ref="marqueeDom"
      @mousemove="mousemove"
      @click="setTimer"
      @mouseenter="setTimer"
    >
      <div
        v-for="(item, index) in showCentralizedData"
        :key="index"
        class="centralized-item"
      >
        <div
          class="title flex flex-align-center"
          @click="toDetail(item.name, '', '')"
        >
          <i :class="['module-icon', `module-${item.code}`]"></i>
          <span class="module-name">
            {{ item.name }}
          </span>
        </div>
        <div
          v-for="(typeItem, typeIndex) in item.subList"
          :key="`item-${typeIndex}`"
          class="list-box"
        >
          <div class="list-item flex">
            <div
              class="title-s"
              @click="toDetail(item.name, typeItem.name, '')"
            >
              <div class="item-type flex flex-pack-justify-end">
                <p :class="['flex-1', `fs-${fontSize}`]">
                  {{ typeItem.name }}
                </p>
                （{{ typeItem.detail.length }}）
              </div>
            </div>
            <div class="list-container flex-1 flex flex-align-center">
              <bedNo
                class="mar"
                v-for="(bedNoData, bedNoIndex) in typeItem.detail"
                :key="`bedNo${bedNoIndex}`"
                :data="bedNoData"
                :jump="false"
                @click.native="
                  toDetail(
                    item.name,
                    item.name === '患者分组' ? typeItem.type : typeItem.name,
                    bedNoData.rycw || bedNoData.cycw || bedNoData.cwdm,
                    '0'
                  )
                "
              />
            </div>
          </div>
        </div>
        <span
          :class="['no-data', `fs-${fontSize}`]"
          v-if="!item.subList.length"
        >
          {{ emptyText }}
        </span>
      </div>
      <span
        :class="['no-data', `fs-${fontSize}`]"
        v-if="!centralizedData.length"
      >
        {{ emptyText }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State, Mutation } from 'vuex-class'
import { sectionalizeArr, debounce } from '../../../libs/utils'
import bedNo from '../../../components/bedNoCell.vue'
import marquee from '../../../mixin/marquee'
@Component({
  name: 'centralizedArea',
  components: {
    bedNo
  },
  mixins: [marquee]
})
export default class centralizedArea extends Vue {
  @State updateData
  @State yljgdm
  @State associationAreaCode
  @State associationOfficeCode
  @State moduleMenu
  @State isScrolling
  @State fontSize

  @Mutation SET_CENTRALIZED_DATA

  private emptyText = '' // 没有数据提示语
  private centralizedData: any[] = [] // 集中区数据
  private update: boolean = false // 第一次updateData不请求

  @Watch('updateData')
  onChangeValue(newVal: any): void {
    if (this.update) {
      this.emptyText = ''
      if (newVal.showLoading) {
        this.centralizedData = []
      }
      this.getCentralizedData(newVal.showLoading)
    }
    this.update = true
  }

  @Watch('isScrolling')
  scrollChange(newVal) {
    if (newVal) {
      this.$nextTick(() => {
        this.domContainer = this.$refs.marqueeDom
        this.setTimer()
      })
    } else {
      this.$nextTick(() => {
        this.domContainer = this.$refs.marqueeDom
        this.cleanTimer()
      })
    }
  }

  @Watch('$route')
  routerChange(newVal) {
    if (this.isScrolling) {
      this.cleanTimer()
    }
    if (newVal.name === 'wardWhiteboard' && this.isScrolling) {
      this.$nextTick(() => {
        this.domContainer = this.$refs.marqueeDom
        this.setTimer()
      })
    }
  }

  mounted() {
    this.getCentralizedData(true)
  }

  mousemove() {
    if (this.isScrolling) {
      debounce(this.setTimer, 100)
    }
  }

  /**
   * @name:showCentralizedData
   * @test: test font
   * @msg: 对患者分组进行处理
   * @param {void}
   * @return: void
   */
  get showCentralizedData(): any[] {
    const target: any = []
    if (this.centralizedData.length) {
      // 患者分组的code
      const groupId = this.moduleMenu.find(item => {
        return item.name === '患者分组'
      }).code
      // 将患者分组的subList中的每项detail，进行一次分组，并返回
      // 返回数据结构 {name: 小标题，detail：床位}
      this.centralizedData.forEach(item => {
        if (item.code === groupId) {
          interface groupObj {
            name: string
            code: string
            subList: any[]
          }
          const groupObj: groupObj = {
            name: '患者分组',
            code: 'HZFZ',
            subList: []
          }
          const list = item.subList || []
          list.forEach(groupItem => {
            const groupName = groupItem.name || ''
            // 通过name值来分组
            const _item = sectionalizeArr(groupItem.detail, 'name')
            _item.forEach((newItem: any) => {
              groupObj.subList.push({
                name: `${newItem.type}`,
                type: newItem.list[0].quotaName + '(' + `${newItem.type}` + ')',
                detail: newItem.list
              })
            })
          })
          target.push(groupObj)
        } else {
          target.push(item)
        }
      })
      this.centralizedData = target
      this.SET_CENTRALIZED_DATA(target)
    }
    return target
  }

  /**
   * @name:getCentralizedData
   * @test: test font
   * @msg: 获取集中区域数据
   * @param {void}
   * @return: void
   */
  private getCentralizedData(showLoading: boolean) {
    this.emptyText = ''
    const parmas = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm
    }
    this.$api
      .getListData(parmas, showLoading)
      .then(res => {
        this.emptyText = '暂无数据'
        const _arr = res.data || []
        this.centralizedData = _arr.filter(item => {
          return item != null
        })
        if (this.isScrolling) {
          this.$nextTick(() => {
            this.domContainer = this.$refs.marqueeDom
            this.setTimer()
          })
        }
        return
      })
      .catch(err => {
        this.emptyText = '页面无响应'
        this.centralizedData = []
      })
  }

  /**
   * @name: toDetail
   * @test: test font
   * @msg: 跳转二级页面
   * @param {typeIndex} number
   * @return: void
   */
  // todo 验证检验传参
  toDetail(
    moduleName: string,
    groupName: string,
    bedNo: string,
    isJy: string,
    jyzbxmdm: string
  ): void {
    // 如果是检验项目，需要传参 jyzbxmdm
    // isJy 1、检验  0、非检验
    let param = {
      moduleName: moduleName,
      groupName: groupName,
      bedNo: bedNo,
      isJy: isJy,
      jyzbxmdm: jyzbxmdm
    }
    this.$router.push({
      path: '/areaDetail',
      query: param
    })
  }
}
</script>

<style lang="scss" scoped>
.centralized-area {
  @include puhui-r;
  padding: 15px 15px 20px 25px;
  overflow: hidden;
  border-radius: 4px;
  @include home-content-bg;

  .centralized-box {
    height: 100%;
    overflow-y: auto;
  }
  // 大分组样式
  .centralized-item {
    margin-bottom: 20px;
  }

  .title {
    @include home-title-font-color;
    font-size: 24px;
    margin-bottom: 15px;
    .module-name {
      margin-left: 10px;
      margin-right: 5px;
    }
  }
  // 小分组样式

  .list-item {
    margin-bottom: 15px;
    @include puhui-m;
  }

  .title-s {
    @include home-title-s-font-color;
    font-size: 18px;
    width: 155px;
    p {
      text-align: right;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .list-container {
    flex-wrap: wrap;
    margin: 0 0 -15px 10px;
  }
  .no-data {
    margin-left: 30px;
  }
}
</style>
