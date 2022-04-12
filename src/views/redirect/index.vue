<!--
 * @Descripttion: 应用默认跳转页面，重定向
 * @version: 
 * @Author: wangqi
 * @Date: 2019-07-31 13:42:37
 * @LastEditors: wangqi
 * @LastEditTime: 2019-07-31 16:09:10
 -->
<template>
  <div class="redirect"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State, Action, Mutation } from 'vuex-class'

@Component({
  name: 'redirect'
})
export default class redirect extends Vue {
  private param: any
  @State customConfig
  @State currentAreaCode

  @State hospitalName
  @State yljgdm

  @Action resetAreaCode

  @Action getPatientInfoByZjhm

  @Action getToken

  @Action getCustomConfig

  @Action changeTheme

  @Mutation SET_HOSPITAL_NAME
  @Mutation SET_YLJGDM
  @Mutation SET_THEME

  private init() {
    const params = {
//      patid: this.param.patid,
//      jzlb: this.param.jzlb,
//      yljgdm: this.yljgdm,
//      jzlsh: this.param.jzlsh,
//      yexh: this.param.yexh || 0
      hzxm:this.param.hzxm,
      zjhm:this.param.zjhm
    }
    this.getPatientInfoByZjhm(params)
      .then(() => {
        this.$router.push('/menu')
        return
      })
      .catch(err => {})
  }
  private getHospitalConfig(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.$api
        .getMasterInstitution()
        .then(res => {
          const _res = res.data
          if (_res != null) {
            this.SET_HOSPITAL_NAME(_res.name)
            this.SET_YLJGDM(_res.code)
            resolve()
          } else {
            reject()
          }
          return
        })
        .catch(err => {
          reject()
        })
    })
  }
  async created(): Promise<any> {
    // 如果把重定向放到login中，容易渲染login页面，并有闪烁效果，所以单独提取出来，提升用户体验
    await this.getHospitalConfig()
    await this.getToken()
    await this.getCustomConfig()
    var all = this.$route.params.param || JSON.stringify(this.$route.query)
    this.param = JSON.parse(all)
    if (all && this.param.zjhm) {
      this.init()
    } else {
      if (this.currentAreaCode === '') {
        this.$router.push('/login')
      } else {
        // 每次默认
        this.resetAreaCode()
        this.$router.push('/wardWhiteboard')
      }
    }
  }
}
</script>

<style lang="scss"></style>
