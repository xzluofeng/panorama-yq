<!--
 * @Descripttion: 备忘录，值班医生，分管床位
 * @version:
 * @Author: wangqi
 * @Date: 2019-08-01 14:56:29
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-14 08:56:07
 -->
<template>
  <div class="other flex flex-v">
    <p class="title" @click="$router.push('/areaRemark')">
      <i class="icon icon-note"></i>
      {{
        wardContentType === 1
          ? '备忘录'
          : wardContentType === 2
          ? '诊疗组'
          : '值班组'
      }}
      <i class="el-icon-video-play"> </i>
    </p>
    <!-- 备忘录 -->
    <div
      :class="['content', 'flex-1', `fs-${fontSize}`]"
      v-if="wardContentType === 1"
    >
      <span v-html="noteContent"></span>
    </div>
    <!-- 诊疗组 -->
    <div class="content flex-1 treat" v-else-if="wardContentType === 2">
      <div
        v-for="(item, index) in treatGroup"
        :key="index"
        class="group-item flex"
      >
        <div class="doctor-list">
          <span
            v-for="(doctor, docIndex) in item.zlzysysEntityList"
            :key="docIndex"
            class="doctor"
          >
            {{ doctor.ysmc }}
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
      <span class="no-data" v-if="!treatGroup.length">{{ emptyText }}</span>
    </div>
    <!-- 值班医生 -->
    <div class="content flex-1 duty" v-else>
      <div
        v-for="(item, index) in dutyGroup"
        :key="index"
        :class="['group-item', 'flex', `group-${index % 3}`]"
      >
        <span class="group-name">{{ item.groupName }}</span>
        <div class="doctor-list flex-1 flex flex-align-center">
          <div
            v-for="(doctor, docIndex) in item.list"
            :key="docIndex"
            class="doctor-item flex flex-align-center"
          >
            <!-- todo 修改女医生字段判断 -->
            <i :class="['icon', { female: doctor.sex === '女' }]"></i>
            <span class="name">{{ doctor.ysmc }}</span>
          </div>
        </div>
      </div>
      <span class="no-data" v-if="!dutyGroup.length">
        {{ emptyText }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State } from 'vuex-class'
import bedNo from '../../../components/bedNoCell.vue'
@Component({
  name: 'other',
  components: {
    bedNo
  }
})
export default class other extends Vue {
  @State updateData
  @State wardContentType
  @State yljgdm
  @State associationAreaCode
  @State associationOfficeCode
  @State fontSize

  private emptyText = '' // 无数据提示语
  private noteContent: string = '' // 病区备忘录
  private treatGroup: any[] = [] // 诊疗组
  private dutyGroup: any = [] // 值班组
  private update: boolean = false // 第一次updateData不请求

  @Watch('updateData')
  onChangeValue(newVal: any): void {
    if (this.update) {
      this.emptyText = ''
      if (newVal.showLoading) {
        if (this.wardContentType === 1) {
          this.noteContent = ''
        } else if (this.wardContentType === 2) {
          this.treatGroup = []
        } else if (this.wardContentType === 3) {
          this.dutyGroup = []
        }
      }
      this.getOtherData(newVal.showLoading)
    }
    this.update = true
  }

  @Watch('wardContentType')
  typeChange(newVal) {
    this.getOtherData(false)
  }

  @Watch('$route')
  routerChange(newVal) {
    if (newVal.path === '/wardWhiteboard') {
      this.getOtherData(false)
    }
  }

  created() {
    this.getOtherData(true)
  }

  /**
   * @name: getOtherData
   * @test: test font
   * @msg: 获取本模块数据
   * @param {void}
   * @return: void
   */
  private getOtherData(showLoading: boolean): void {
    switch (this.wardContentType) {
      case 1:
        this.getNote(showLoading)
        break
      case 2:
        this.getTreat(showLoading)
        break
      case 3:
        this.getDuty(showLoading)
        break
    }
  }

  /**
   * @name: getNote
   * @test: test font
   * @msg: 获取备忘录数据
   * @param {void}
   * @return: void
   */
  private getNote(showLoading: boolean): void {
    const param = {
      yljgdm: this.yljgdm,
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      bzlb: '1' // 备注类别 1：病区，0：病人
    }
    this.$api
      .getAreaRemark(param, showLoading)
      .then(res => {
        this.emptyText = '暂无数据'
        const _data = res.data || []
        if (_data.length) {
          // const _concent = _data[0].bzms.replace('\n', '<br>')
          this.noteContent = _data[0].bzms || ''
        }
        return
      })
      .catch(err => {
        this.emptyText = '页面无响应'
        this.$message({
          message: '获取病区备注失败！',
          type: 'error'
        })
      })
  }

  /**
   * @name: getNote
   * @test: test font
   * @msg: 获取诊断录数据
   * @param {void}
   * @return: void
   */
  private getTreat(showLoading: boolean): void {
    const params = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm
    }
    this.$api
      .getZlzxxList(params, showLoading)
      .then(res => {
        this.emptyText = '暂无数据'
        const _res = res.data || []
        _res.forEach(item => {
          item.syzt = item.zlzcwysEntityList[0].syzt
        })
        this.treatGroup = _res.filter(item => {
          return item.syzt === '1'
        })
        return
      })
      .catch(err => {
        this.emptyText = '页面无响应'
      })
  }

  /**
   * @name: getNote
   * @test: test font
   * @msg: 获取值班数据
   * @param {void}
   * @return: void
   */
  private getDuty(showLoading: boolean): void {
    const params = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm
    }
    this.$api
      .getZbysList(params, showLoading)
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
        this.dutyGroup = _resArr.filter(item => {
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
.other {
  height: 205px;
  margin-top: 15px;
  margin-bottom: 10px;
  padding: 15px 25px 20px 25px;
  border-radius: 4px;
  @include home-content-bg;
  .title {
    @include puhui-r;
    @include home-title-font-color;
    font-size: 24px;
    .icon {
      display: inline-block;
      width: 22px;
      height: 24px;
      background-size: cover;
      vertical-align: middle;
      margin-right: 5px;
    }
    .icon-note {
      @include module-icon-zlz;
    }
  }
  .content {
    @include puhui-r;
    @include home-title-s-font-color;
    margin-top: 5px;
    overflow-y: auto;
    word-break: break-word;
  }
  // 诊疗组
  .treat {
    .doctor-list {
      margin-right: 15px;
      line-height: 30px;
    }
    .doctor {
      font-size: 18px;
      @include home-title-s-font-color;
      @include puhui-m;
      margin-right: 10px;
    }

    .bed-list {
      padding-top: 2px;
    }
  }
  // 值班组
  .duty {
    .group-item {
      margin-bottom: 15px;
    }
    .group-name {
      display: inline-block;
      width: 100px;
      text-align: right;
      @include home-title-s-font-color;
      font-size: 21px;
      @include puhui-m;
      margin-right: 15px;
      line-height: 40px;
    }

    .doctor-list {
      flex-wrap: wrap;
      font-size: 21px;
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
    }
    .group-1 {
      .icon {
        background-color: #9cc7f7;
      }
      .doctor-item {
        @include doctor-item-bg-color;
        color: #3b81cf;
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
        width: 115px;
        text-align: center;
        white-space: nowrap;
      }
    }
  }
  .no-data {
    margin-left: 30px;
  }
}
</style>
