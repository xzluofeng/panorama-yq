<!--
 * @Descripttion: 值班医生
 * @version:
 * @Author: wangqi
 * @Date: 2019-08-21 08:50:04
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-21 08:50:04
 -->
<template>
  <div class="duty-group">
    <p class="title" @click="$router.push('/configs/doctorInfo/duty')">
      值班医生
      <i class="el-icon-video-play"></i>
    </p>
    <div class="group-box">
      <div
        v-for="(item, index) in groupData"
        :key="index"
        :class="['group-item', 'flex', `group-${index % 3}`]"
      >
        <span :class="['group-name', `fs-${fontSize + 2}`]">
          {{ item.groupName }}
        </span>
        <div
          :class="[
            'doctor-list',
            'flex-1',
            'flex',
            'flex-align-center',
            `fs-${fontSize + 2}`
          ]"
        >
          <div
            v-for="(doctor, docIndex) in item.list"
            :key="docIndex"
            class="doctor-item flex flex-align-center"
          >
            <!-- todo 修改女医生字段判断 -->
            <i :class="['icon', { female: doctor.sex === '女' }]"></i>
            <span :class="['name', `fs-${fontSize}`]">{{ doctor.ysmc }}</span>
            <span class="line" v-if="!dutyHiddenTel"></span>
            <span :class="['tel', `fs-${fontSize}`]" v-if="!dutyHiddenTel">
              {{ doctor.mobilephone || '' }}
            </span>
          </div>
        </div>
      </div>
      <span class="no-data" v-if="!groupData.length">
        {{ emptyText }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import bedNo from '../../../components/bedNoCell.vue'
@Component({
  name: 'dutyGroup',
  components: {
    bedNo
  }
})
export default class dutyGroup extends Vue {
  @State associationAreaCode
  @State associationOfficeCode
  @State yljgdm
  @State dutyHiddenTel
  @State fontSize

  private groupData: any[] = [] // 值班组数据
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
      .getZbysList(params)
      .then(res => {
        this.emptyText = '暂无数据'
        const _res = res.data || {}
        // 返回数据为对象，转换成数组
        const _resArr: any = []
        for (const key in _res) {
          if (_res.hasOwnProperty(key)) {
            const element = _res[key]
            const _obj = {
              groupName: element[0].zbfzmc,
              syzt: element[0].syzt,
              list: element
            }
            _resArr.push(_obj)
          }
        }
        this.groupData = _resArr.filter(item => {
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
.duty-group {
  position: relative;
  width: 805px;
  padding-right: 0 !important;
  padding-left: 10px !important;
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
    overflow-x: hidden;
  }

  .group-item {
    margin-bottom: 15px;
  }
  .group-name {
    display: inline-block;
    text-align: right;
    @include home-title-s-font-color;
    @include puhui-m;
    margin-right: 15px;
    line-height: 40px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    flex-shrink: 0;
    &.fs-20 {
      width: 100px;
    }
    &.fs-22 {
      width: 111px;
    }
    &.fs-24 {
      width: 122px;
    }
    &.fs-26 {
      width: 133px;
    }
    &.fs-28 {
      width: 144px;
    }
  }

  .doctor-list {
    flex-wrap: wrap;
    margin-bottom: -10px;
    margin-right: -10px;
  }
  // 医生姓名，联系方式，三组样式
  .group-0 {
    .icon {
      background-color: #c6d0f8;
    }
    .doctor-item {
      @include doctor-item-bg-color;
      color: #5d77dd;
    }
    .line {
      background-color: #b2c1f3;
    }
  }
  .group-1 {
    .icon {
      background-color: #9cc7f7;
    }
    .doctor-item {
      @include doctor-item-bg-color;
      color: #3b81cf;
    }
    .line {
      background-color: #c3d3ed;
    }
  }
  .group-2 {
    .icon {
      background-color: #81d7ea;
    }
    .doctor-item {
      @include doctor-item-bg-color;
      color: #1aadcd;
    }
    .line {
      background-color: #b2e4ee;
    }
  }

  .doctor-item {
    border-radius: 4px;
    overflow: hidden;
    height: 40px;
    margin-right: 15px;
    margin-bottom: 10px;
    .icon {
      width: 45px;
      height: 40px;
      background-image: url('../../../assets/images/icon-male-doc.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: 28px 30px;
      &.female {
        background-image: url('../../../assets/images/icon-female-doc.png');
      }
    }
    .name {
      text-align: center;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      &.fs-18 {
        width: 100px;
      }
      &.fs-20 {
        width: 110px;
      }
      &.fs-22 {
        width: 120px;
      }
      &.fs-24 {
        width: 130px;
      }
      &.fs-26 {
        width: 140px;
      }
    }
    .tel {
      text-align: center;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      &.fs-18 {
        width: 140px;
      }
      &.fs-20 {
        width: 150px;
      }
      &.fs-22 {
        width: 160px;
      }
      &.fs-24 {
        width: 170px;
      }
      &.fs-26 {
        width: 180px;
      }
    }
    .line {
      width: 1px;
      height: 18px;
    }
  }

  .no-data {
    margin-left: 15px;
  }
}
</style>
