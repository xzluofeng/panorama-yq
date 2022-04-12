<!--
 * @Descripttion: 配置
 * @version:
 * @Author: wangqi
 * @Date: 2019-07-16 15:50:41
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-15 11:11:09
 -->
<template>
  <el-row
    type="flex"
    :class="['area-config', { 'flex-reverse': rightHandType }]"
  >
    <el-col class="menu-box flex flex-v flex-1" :span="4">
      <el-menu
        :default-active="$route.path"
        :default-openeds="['/configs/doctorInfo', '/configs/content']"
        class="el-menu-vertical-demo flex flex-v"
        router
      >
        <el-menu-item index="/configs/style">
          <span slot="title">页面风格</span>
        </el-menu-item>
        <el-submenu index="/configs/doctorInfo">
          <template slot="title">
            <span>医生信息</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/configs/doctorInfo/inHospital">
              在区医生
            </el-menu-item>
            <el-menu-item index="/configs/doctorInfo/group">
              分管床位
            </el-menu-item>
            <el-menu-item index="/configs/doctorInfo/duty">
              值班医生
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="/configs/content">
          <template slot="title">
            <span>显示内容</span>
          </template>
          <el-menu-item-group>
            <el-menu-item
              :key="`content-${moduleMenu.length}`"
              index="/configs/content/CWLB"
            >
              床位列表
            </el-menu-item>
            <el-menu-item
              v-for="(item, index) in moduleMenu"
              :key="`content-${index}`"
              :index="`/configs/content/${item.list[0].moduleCode}`"
            >
              {{ item.type }}
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="/configs/content/BQGZ" v-if="hasBqgz">
          <span slot="title">病区关注内容</span>
        </el-menu-item>
        <el-menu-item index="/configs/content/BQGL">
          <span slot="title">病区概览</span>
        </el-menu-item>
        <el-menu-item index="/configs/content/BQTT">
          <span slot="title">病区头条</span>
        </el-menu-item>
      </el-menu>
      <goBack />
    </el-col>

    <el-col class="content-box" :span="20">
      <transition name="el-fade-in-linear">
        <router-view :class="rightHandType ? 'right-hand' : 'left-hand'" />
      </transition>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'
import { sectionalizeArr } from '../../libs/utils'
import goBack from '../../components/goBack.vue'
@Component({
  name: 'areaConfig',
  components: {
    goBack
  }
})
export default class areaConfig extends Vue {
  @State yljgdm
  @State associationAreaCode
  @State associationOfficeCode
  @State rightHandType

  private moduleMenu: any[] = [] //菜单列表
  private hasBqgz: boolean = false //是否有病区关注

  mounted() {
    this.getModuleMenu()
  }

  /**
   * 获取模块菜单
   * */
  private getModuleMenu(): void {
    const params = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm
    }
    this.$api
      .getDeptModuleConfigList(params)
      .then(res => {
        if (res.data && res.data.length) {
          this.moduleMenu = sectionalizeArr(res.data, 'moduleName')
          this.hasBqgz = this.moduleMenu.some((i: any) => {
            return i.type === '病区关注'
          })
          this.moduleMenu = this.moduleMenu.filter(module => {
            return (
              module.type !== '病区关注' &&
              module.type !== '患者分组' &&
              module.type !== '病区概览' &&
              module.type !== '床位列表'
            )
          })
          // 默认打开显示内容
          if (
            this.moduleMenu.length &&
            this.$route.path === '/configs/content/1'
          ) {
            const path = `/configs/content/${this.moduleMenu[0].list[0].moduleCode}`
            this.$router.push(path)
          }
          return
        }
        return
      })
      .catch(err => {
        this.$message({
          message: err.data,
          type: 'error'
        })
      })
  }
}
</script>

<style lang="scss" scoped>
.area-config {
  // padding: 0 !important;
  .content-box {
    height: 100%;
  }
  .menu-box,
  .content-box > div {
    height: 100%;
    overflow-y: auto;
  }
  .content-box > div {
    @include home-content-bg;
    box-shadow: 0px 2px 4px rgba(30, 60, 114, 0.6);
    border-radius: 4px;
  }
  .menu-box .el-menu-vertical-demo {
    @include el-menu-bg;
    margin-bottom: 10px;
    box-shadow: 0px 2px 4px rgba(30, 60, 114, 0.6);
    border-radius: 4px;
  }

  .left-hand {
    margin-left: 20px;
  }
  .right-hand {
    margin-right: 20px;
  }

  .el-menu {
    @include el-menu-bg;
    height: 100%;
    overflow-y: auto;
  }

  .el-submenu__title span,
  .el-menu-item {
    font-size: 20px;
  }
}
</style>
