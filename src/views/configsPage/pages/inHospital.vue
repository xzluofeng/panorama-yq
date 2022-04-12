<!--
 * @Descripttion: 在院医生
 * @version:
 * @Author: wangqi
 * @Date: 2019-08-06 15:26:05
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-15 10:09:12
 -->
<template>
  <div class="in-hospital">
    <p class="title flex flex-align-center">
      在院医生人数：{{ doctorsList.length }}
      <el-button class="add-btn" type="primary" round @click="addDoctor">
        添加医生
      </el-button>
    </p>
    <el-table :data="doctorsList" style="width: 100%" :empty-text="emptyText">
      <el-table-column type="index" label="序号" :width="120 * sizeMultiple">
      </el-table-column>
      <el-table-column
        prop="fullname"
        label="医生姓名"
        :width="220 * sizeMultiple"
      >
      </el-table-column>
      <el-table-column prop="usercode" label="工号" :width="180 * sizeMultiple">
      </el-table-column>
      <el-table-column
        prop="mobilephone"
        label="联系方式"
        :width="220 * sizeMultiple"
      >
      </el-table-column>
      <el-table-column label="身份" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ exChangeIdentity(scope.row.idetity).join(',') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" :width="200 * sizeMultiple">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            @click="editDoctor(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click="deleteDoctor(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogVisible"
      width="35%"
      :title="title"
      :close-on-click-modal="false"
      top="20vh"
    >
      <el-form v-model="doctorObj">
        <el-form-item label="本院职工">
          <el-radio-group
            v-model="doctorObj.isInDept"
            :disabled="handleType === 1"
            @change="changeRadio"
          >
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="员工信息">
          <el-select
            v-model="doctorObj.usercode"
            v-if="doctorObj.isInDept === 1"
            :disabled="handleType === 1"
            filterable
          >
            <el-option
              v-for="item in outDeptList"
              :key="item.usercode"
              :label="item.fullname"
              :value="item.usercode"
            >
            </el-option>
          </el-select>
          <el-input
            v-else
            v-model="doctorObj.fullname"
            class="w-200"
            placeholder="请填写姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="doctorObj.mobilephone" class="w-200"></el-input>
        </el-form-item>
        <el-form-item label="身份">
          <div class="btn-group flex flex-align-center">
            <span
              v-for="(item, index) in doctorTypeArr"
              :key="index"
              :class="[
                'identity-btn',
                { active: doctorObj.idetity.includes(item.id.toString()) }
              ]"
              @click="chooseType(item.id.toString())"
            >
              {{ item.sfjsmc }}
            </span>
            <span class="no-data" v-if="!doctorTypeArr.length">
              {{ emptyText }}
            </span>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="affirm">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'

interface doctorObj {
  isInDept: number // 是否本院职工
  fullname: string // 医生姓名
  usercode: string // 医生id
  mobilephone: string // 医生电话
  idetity: number[] // 医生身份
}

@Component({
  name: 'inHospital'
})
export default class inHospital extends Vue {
  @State sizeMultiple
  @State yljgdm
  @State associationAreaCode
  @State associationOfficeCode

  private doctorsList: any[] = [] // 在区医生列表
  private outDeptList: any[] = [] // 不在区医生列表
  private doctorTypeMap = {}
  private doctorTypeArr: any[] = [] // 医生类型列表
  private handleType: number = 0 // 操作类型 0：新增 1：编辑
  private dialogVisible: boolean = false // 弹框控制
  private title: string = '' // 弹框标题
  private doctorObj: doctorObj = {
    isInDept: 1,
    fullname: '',
    usercode: '',
    mobilephone: '',
    idetity: []
  }
  private emptyText: string = '' // 无数据提示语

  mounted() {
    this.getDoctorData()
  }

  changeRadio() {
    this.doctorObj.fullname = ''
    this.doctorObj.usercode = ''
    this.doctorObj.mobilephone = ''
    this.doctorObj.idetity = []
  }
  /**
   * @name: getDoctorData
   * @test: test font
   * @msg: 获取医生列表数据
   * @param {void}
   * @return:void
   */
  private getDoctorData(): void {
    this.emptyText = ''
    const params = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm
    }
    this.$api
      .getDoctorList(params)
      .then(res => {
        if (res.data && res.data.userList && res.data.userList.length) {
          res.data.userList.forEach(u => {
            if (u.idetity) {
              u.idetity = u.idetity.split(',')
            } else {
              u.idetity = []
            }
          })
          // 筛选本科室的医生
          this.doctorsList = res.data.userList.filter(u => {
            return u.isInDept === 1
          })
          // 筛选不在本科室的医生
          this.outDeptList = res.data.userList.filter(u => {
            return u.isInDept !== 1
          })
        }
        if (res.data && res.data.identities && res.data.identities.length) {
          this.doctorTypeArr = res.data.identities
          res.data.identities.forEach(i => {
            this.doctorTypeMap[i.id.toString()] = i.sfjsmc
          })
        }
        this.emptyText = '暂无数据'
        return
      })
      .catch(err => {
        this.emptyText = '页面无响应'
      })
  }

  /**
   * @name: exChangeIdentity
   * @msg: 获取医生身份
   */
  private exChangeIdentity(identity: String[] | String): String[] {
    const resultList: any[] = []
    if (!(identity instanceof Array)) {
      identity = identity.split(',')
    }
    identity.forEach(i => {
      resultList.push(this.doctorTypeMap[i.toString()])
    })
    return resultList
  }
  /**
   * @name: addDoctor
   * @test: test font
   * @msg: 新增医生
   * @param {void}
   * @return: void
   */
  private addDoctor(): void {
    this.handleType = 0
    this.title = '新增医生'
    this.doctorObj.isInDept = 1
    this.doctorObj.fullname = ''
    this.doctorObj.usercode = ''
    this.doctorObj.mobilephone = ''
    this.doctorObj.idetity = []
    this.dialogVisible = true
  }

  /**
   * @name: editDoctor
   * @test: test font
   * @msg: 编辑医生信息
   * @param {void}
   * @return: void
   */
  private editDoctor(doctor): void {
    this.handleType = 1
    this.title = '编辑医生信息'
    this.doctorObj = JSON.parse(JSON.stringify(doctor))
    this.dialogVisible = true
  }

  /**
   * @name: deleteDoctor
   * @test: test font
   * @msg: 删除医生信息弹框
   * @param {void}
   * @return: void
   */
  private deleteDoctor(doctor: any): void {
    this.$confirm('确定删除吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        this.deleteDoctorConfig(doctor)
        return
      })
      .catch(() => {})
  }

  /**
   * @name: deleteDoctorConfig
   * @test: test font
   * @msg: 删除医生
   * @param {object}医生对象
   * @return: void
   */
  deleteDoctorConfig(doctor) {
    const params = {
      ksdm: this.associationOfficeCode,
      bqdm: this.associationAreaCode,
      userCode: doctor.usercode
    }
    this.$api
      .deleteDoctorConfig(params)
      .then(res => {
        this.$message({
          message: res.data,
          type: 'success'
        })
        this.getDoctorData()
        return
      })
      .catch(err => {
        this.$message({
          message: err.toString(),
          type: 'error'
        })
      })
  }

  /**
   * @name: chooseType
   * @test: test font
   * @msg: 点击医生身份
   * @param {void}
   * @return: void
   */
  private chooseType(id): void {
    if (this.doctorObj.idetity.includes(id)) {
      const index = this.doctorObj.idetity.findIndex(item => {
        return item === id
      })
      this.doctorObj.idetity.splice(index, 1)
    } else {
      this.doctorObj.idetity.push(id)
    }
  }

  /**
   * @name: affirm
   * @test: test font
   * @msg: 弹框 - 确认
   * @param {void}
   * @return: void
   */
  private affirm(): void {
    if (
      (this.doctorObj.isInDept === 1 && this.doctorObj.usercode === '') ||
      (this.doctorObj.isInDept === 0 && this.doctorObj.fullname === '')
    ) {
      this.$alert('姓名不能为空！', '提示')
      return
    }
    if (this.doctorObj.mobilephone === '') {
      this.$alert('手机号码不能为空！', '提示')
      return
    } else {
      const reg = /^[1][3-9][0-9]{9}$/
      if (!reg.test(this.doctorObj.mobilephone)) {
        this.$alert('手机号码不正确！', '提示')
        return
      }
    }
    if (!this.doctorObj.idetity.length) {
      this.$alert('请选择身份！', '提示')
      return
    }
    this.intoDoctorConfig()
  }

  //新增/修改医生信息
  private intoDoctorConfig(): void {
    if (this.handleType === 0) {
      const params = {
        idetity: this.doctorObj.idetity.join(','),
        yljgdm: this.yljgdm,
        ksdm: this.associationOfficeCode,
        bqdm: this.associationAreaCode,
        userCode: this.doctorObj.isInDept === 1 ? this.doctorObj.usercode : '',
        userName: this.doctorObj.fullname,
        phoneNumber: this.doctorObj.mobilephone
      }
      this.$api
        .addDoctorConfig(params)
        .then(res => {
          this.$message({
            message: res.data,
            type: 'success'
          })
          this.dialogVisible = false
          this.getDoctorData()
          return
        })
        .catch(err => {
          this.$message({
            message: err.toString(),
            type: 'error'
          })
        })
    } else if (this.handleType === 1) {
      const params = {
        idetity: this.doctorObj.idetity.join(','),
        yljgdm: this.yljgdm,
        userCode: this.doctorObj.usercode,
        phoneNumber: this.doctorObj.mobilephone
      }
      this.$api
        .updateDoctorConfig(params)
        .then(res => {
          this.$message({
            message: res.data,
            type: 'success'
          })
          this.dialogVisible = false
          this.getDoctorData()
          return
        })
        .catch(err => {
          this.$message({
            message: err.toString(),
            type: 'error'
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.in-hospital {
  position: relative;
  height: 100%;
  overflow: hidden;
  padding: 75px 25px 20px;
  .title {
    position: absolute;
    top: 20px;
    left: 25px;
    @include home-title-font-color;
    font-size: 24px;
  }
  .add-btn {
    margin-left: 40px;
  }

  .w-200 {
    width: 244px;
    font-size: 18px;
  }

  .btn-group {
    flex-wrap: wrap;
    margin-right: -15px;
    margin-bottom: -10px;
    .identity-btn {
      width: 120px;
      height: 36px;
      line-height: 34px;
      text-align: center;
      border: 1px solid#DCDFE6;
      border-radius: 50px;
      @include menu-font-color;
      margin-right: 15px;
      margin-bottom: 10px;
      font-size: 18px;
      &.active {
        color: #fff;
        background-color: #409eff;
        border-color: #409eff;
      }
    }
  }
}
</style>
