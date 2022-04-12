<!--
 * @Descripttion: 责任组
 * @version:
 * @Author: wangqi
 * @Date: 2019-08-21 08:48:04
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-21 08:48:04
 -->
<template>
  <div class="responsibility-group">
    <p class="title" @click="$router.push('/configs/doctorInfo/group')">
      诊疗组
      <i class="el-icon-video-play"></i>
    </p>
    <div class="group-box">
      <div
        v-for="(item, index) in groupData"
        :key="index"
        class="group-item flex"
      >
        <div class="doctor-list">
          <span
            v-for="(doctor, docIndex) in item.zlzysysEntityList"
            :key="docIndex"
            :class="['doctor', `fs-${fontSize}`]"
          >
            {{
              treatmentGroupHiddenTel
                ? doctor.ysmc
                : `${doctor.ysmc}(${doctor.mobilephone || ''})`
            }}
          </span>
        </div>
        <div class="bed-list">
          <bedNo
            v-for="(bed, bedIndex) in item.zlzcwysEntityList"
            :key="bedIndex"
            :data="bed"
            :jump="false"
            class="mar"
          />
        </div>
      </div>
      <span class="no-data" v-if="!groupData.length">{{ emptyText }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'
import bedNo from '../../../components/bedNoCell.vue'
@Component({
  name: 'responsibilityGroup',
  components: {
    bedNo
  }
})
export default class responsibilityGroup extends Vue {
  @State associationAreaCode
  @State associationOfficeCode
  @State yljgdm
  @State fontSize
  @State treatmentGroupHiddenTel // true隐藏

  private groupData: any[] = [] // 诊疗组数据
  private emptyText: string = '' // 无数据提示语

  mounted() {
    this.getGroupData()
  }

  /**
   * @name: getGroupData
   * @test: test font
   * @msg: 获取诊疗组数据
   * @param {void}
   * @return: void
   */
  private getGroupData(): void {
    const params = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm
    }
    this.$api
      .getZlzxxList(params)
      .then(res => {
        this.emptyText = '暂无数据'
        const _res = res.data || []
        _res.forEach(item => {
          item.syzt = item.zlzcwysEntityList[0].syzt
        })
        this.groupData = _res.filter(item => {
          return item.syzt === '1'
        })
        return
      })
      .catch(err => {
        this.emptyText = '页面无响应'
      })
  }
}
</script>

<style lang="scss" scoped>
.responsibility-group {
  position: relative;
  width: 1065px;
  margin-right: 15px;
  .title {
    position: absolute;
    left: 25px;
    top: 15px;
    @include remark-title-font-color;
    font-size: 24px;
    @include puhui-m;
    cursor: pointer;
  }

  .group-box {
    height: 100%;
    overflow-y: auto;
  }
  .doctor-list {
    margin-right: 15px;
  }
  .doctor {
    @include home-title-s-font-color;
    @include puhui-m;
    margin-right: 10px;
  }

  .bed-list {
    padding-top: 2px;
  }
}
</style>
