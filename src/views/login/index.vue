<!--
 * @Descripttion: 选择本病区
 * @version: 
 * @Author: wangqi
 * @Date: 2019-07-16 13:27:16
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-14 09:28:42
 -->
<template>
  <div class="login flex flex-v">
    <div class="logo-container flex flex-align-center">
      <span class="logo-company"></span>
      <!-- <span class="logo-product"></span> -->
    </div>
    <div class="login-container flex-1 flex flex-pack-center flex-align-center">
      <span class="login-bg"></span>
      <div class="select-container">
        <p>卫视界</p>
        <p>可视化诊疗软件</p>
        <el-select
          class="select-area"
          v-model="selectArea"
          filterable
          placeholder="下拉选择病区"
          popper-class="login-select-popper"
        >
          <el-option
            v-for="item in permissionArea"
            :key="item.bqdm + '-' + item.ksdm"
            :label="item.bqmc"
            :value="item.bqdm + '-' + item.ksdm"
          >
            <span class="select-left">{{ item.bqmc }}</span>
            <span class="select-right">{{ item.ksmc }}</span>
          </el-option>
        </el-select>
        <el-button
          type="primary"
          class="login-btn"
          @click="login"
          :disabled="btnDisabled"
        >
          确&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;认
        </el-button>
        <div class="text-box">
          <span>卫宁健康</span>
          <span class="fr">沪ICP备17048553号</span>
        </div>
      </div>
    </div>
    <!-- 底部占位，防止选择病区区域太靠近底部 -->
    <div class="holder"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State, Action, Mutation } from 'vuex-class'

@Component({
  name: 'login'
})
export default class login extends Vue {
  @State hospitalName
  @State yljgdm
  @State currentAreaCode
  @State currentOfficeCode
  @State associationAreaCode

  @Action setCurrentArea
  @Action resetAreaCode
  @Action getToken

  @Mutation SET_HOSPITAL_NAME
  @Mutation SET_YLJGDM

  private selectArea: string = '' // 选中的病区代码
  private permissionArea: object[] = [] // 匹配通过的病区数据

  /**
   * @name: btnDisabled
   * @test: test font
   * @msg: 控制确认按钮disabled属性(未获取到医院信息，未获取到病区数据，未选中病区)
   * @param {void}
   * @return: boolean
   */
  get btnDisabled(): boolean {
    if (
      this.hospitalName == null ||
      this.hospitalName === '' ||
      !this.permissionArea.length ||
      this.selectArea === ''
    ) {
      return true
    } else {
      return false
    }
  }

  async created(): Promise<any> {
    // 手动清空token
    this.$store.commit('SET_TOKEN', '')
    // 如果已经选中过关联病区，那么直接跳转白板页面
    if (this.associationAreaCode !== '') {
      await this.getToken()
        .then(res => {
          this.$router.push('/wardWhiteboard')
          return
        })
        .catch(err => {})
    }
    if (this.currentAreaCode !== '') {
      this.selectArea = `${this.currentAreaCode}-${this.currentOfficeCode}`
    }
    await this.getHospitalConfig()
    await this.getToken()
    await this.getPermissionArea()
  }

  /**
   * @name: getHospitalConfig
   * @test: test font
   * @msg: 获取医院相关信息，医院名称,医疗机构代码等
   * @param {void}
   * @return: void
   */
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

  /**
   * @name:getPermissionArea
   * @test: test font
   * @msg: 获取医院已授权病区
   * @param {type}
   * @return:
   */
  private getPermissionArea(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.$api
        .getAuthorizedList({
          yljgdm: this.yljgdm
        })
        .then(res => {
          const _res = res.data || []
          this.permissionArea = _res
          resolve()
          return
        })
        .catch(err => {
          this.$message({
            message: '获取授权病区失败，请联系管理员！',
            type: 'error'
          })
          reject()
        })
    })
  }
  /**
   * @name: login
   * @test: test font
   * @msg: 跳转电子白板页面
   * @param {void}
   * @return: viod
   */
  // 登录
  private login(): void {
    const [bqdm, ksdm = ''] = this.selectArea.split('-')
    const formData = {
      bqdm,
      ksdm
    }
    this.setCurrentArea(formData)
    this.resetAreaCode()
    this.$router.push('/wardWhiteboard')
  }
}
</script>
<style lang="scss" scoped>
$loginBg: #253a8c;
.login {
  // background-color: #21d4fd;
  // background-image: linear-gradient(19deg, #21d4fd 0%, #e0c3fc 100%);
  background-color: $loginBg;
  height: 100%;
  .logo-container {
    padding-top: 56px;
  }
  // 上部公司logo及产品logo
  .logo-company {
    width: 354px;
    height: 113px;
    margin-right: 58px;
    margin-left: 53px;
    background-image: url('../../assets/images/logo-com.png');
    background-size: cover;
  }
  .logo-product {
    width: 272px;
    height: 72px;
    background-image: url('../../assets/images/logo-pro.png');
    background-size: cover;
  }

  // 下拉框及背景图片
  .login-bg {
    width: 524px;
    height: 627px;
    background-image: url('../../assets/images/login-bg.png');
    background-size: cover;
    background-position: center center;
    margin-right: 107px;
  }
  .select-container {
    position: relative;
    width: 488px;
    height: 606px;
    background-color: #fff;
    border-radius: 15px;
    padding: 107px 60px 50px 60px;
    p {
      color: #253a8c;
      font-weight: 500;
      line-height: 65px;
      font-size: 48px;
      @include puhui-m;
    }
    .select-area {
      width: 384px;
      height: 52px;
      line-height: 52px;
      margin-top: 65px;
      margin-bottom: 65px;
      font-size: 22px;
    }
    .login-btn {
      width: 100%;
      height: 54px;
      font-size: 22px;
      @include puhui-r;
      border-radius: 200px;
    }
    .text-box {
      position: absolute;
      bottom: -30px;
      width: 368px;
      color: #fff;
      font-size: 16px;
    }
    .fr {
      float: right;
    }
  }
  .holder {
    height: 50px;
    background-color: $loginBg;
  }
}
</style>
