<template>
  <div>
    <div class="brxx">
      <div class="patient"></div>
      <span class="bold">{{ patientInfo.brxxkJz.hzxm }}</span>
      <span class="bold">{{ patientInfo.brxxkJz.xbmc }}</span>
      <span class="bold">{{ patientInfo.age }}</span>
      <div class="qz">
        <span>{{ blflmc }}</span>
      </div>
      <div class="phone"></div>
      <span class="mobile_text">{{ patientInfo.brxxkJz.lxdh }}</span>
      <span @click="clickHzsf">{{ sf }}</span>
    </div>
    <div class="brxx" v-if="showYwryxx==='1'">
        <span class="showHospital">
          <span>{{ ssyymc }}</span>
          <span class="level" v-if="ssyyjb&&ssyyjb!==''">{{ ssyyjb }}</span>
          <span>{{ ssyyds }}</span>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'
@Component({
  name: 'brxx',
})
export default class brxx extends Vue {
  @State patientInfo
  private sf: string = '群众'
  private blflmc: string = '未分类'

  private showYwryxx: string = '0' //是否显示义务人员信息 0 不显示  显示

  private ssyymc: string = '' //所属医院名称
  private ssyyjb: string = '' //所属医院级别
  private ssyyds: string = '' //所属医院地市

  mounted() {
    this.getHzsfxx()
  }

  private getHzsfxx(): void {
    const params = {
      jzlsh: this.patientInfo.jzlsh,
      patid: this.patientInfo.patid,
      yljgdm: this.patientInfo.yljgdm,
    }
    this.$api
      .getHzsfxx(params)
      .then((res) => {
        if (res.data) {
          this.sf = res.data.rqflmc
          this.blflmc = res.data.blflmc
          // 新增显示医院和医院级别的信息  (添加数据后删除||后内容即可)
          this.ssyymc = res.data.bgdwmc
          this.ssyyjb = res.data.bgdwjb
          this.ssyyds = res.data.bgdwds
        }
        return
      })
      .catch(() => {})
  }

  private clickHzsf():void{
      if(this.sf === "医务人员" ){
          this.showYwryxx = this.showYwryxx==='1'?'0':'1'
      }
  }
}
</script>

<style lang="scss" scoped>
.brxx {
  @include go-back-font-color;
  width: 100%;
  font-size: 14px;
  height: 50px;
  line-height: 50px;
  display: inline-flex;
  .bold {
    font-size: 20px !important;
    font-weight: 900;
  }
  .patient {
    width: 30px;
    height: 50px;
    background: url('../../../assets/images/patient.png') center no-repeat;
    background-size: 100%;
  }
  .qz {
    width: 90px;
    height: 50px;
    background: url('../../../assets/images/qz.png') center no-repeat;
    background-size: 100%;
    margin-right: 20px;
  }
  .qz > span {
    padding-left: 15%;
  }
  .phone {
    width: 20px;
    height: 50px;
    background: url('../../../assets/images/phone.png') center no-repeat;
    background-size: 100%;
  }
  .mobile_text {
    padding: 0;
  }
  .showHospital {
    padding-left: 0px;
    span {
      padding: 0 10px;
    }
    .level {
      font-style: italic;
      display: inline-block;
      height: 26px;
      line-height: 26px;
      background-color: #0c4fa4;
      font-size: 12px;
      border-radius: 10px;
    }
  }
}
.brxx > span {
  padding: 0 20px;
}
</style>
