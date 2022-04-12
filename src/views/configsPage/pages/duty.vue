<!--
 * @Descripttion: 值班医生
 * @version:
 * @Author: wangqi
 * @Date: 2019-08-06 15:29:44
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-15 10:21:14
 -->
<template>
  <div class="doctor-duty">
    <p class="title flex flex-align-center">
      值班组数量：{{ groupsList.length }}
      <el-button class="add-btn" type="primary" round @click="addGroups">
        添加值班组
      </el-button>
    </p>
    <el-table :data="groupsList" style="width: 100%" :empty-text="emptyText">
      <el-table-column prop="position" label="序号" :width="100 * sizeMultiple">
      </el-table-column>
      <el-table-column prop="zbfzmc" label="标题" :width="260 * sizeMultiple">
      </el-table-column>
      <el-table-column label="医生/诊疗组">
        <template slot-scope="scope">
          {{ scope.row.ysmcList.join(',') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" :width="200 * sizeMultiple">
        <template slot-scope="scope">
          <el-button type="primary" @click="changeShow(scope.row)" round>
            {{ scope.row.syzt ? '隐藏' : '展示' }}
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            @click="editGroup(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click="deleteGroup(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="hidden-tel">
      备忘录显示：
      <el-checkbox v-model="hiddenTel" @change="changeHidden">
        隐藏联系方式
      </el-checkbox>
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      width="35%"
      :title="title"
      top="20vh"
    >
      <el-form v-model="groupObj">
        <el-form-item label="标题">
          <el-input
            v-model="groupObj.zbfzmc"
            placeholder="请输入标题"
            class="w-200"
          ></el-input>
        </el-form-item>
        <el-form-item label="选择医生">
          <div class="btn-group flex flex-align-center">
            <span
              v-for="(item, index) in doctorsList"
              :key="index"
              :class="[
                'identity-btn',
                { active: groupObj.ysdmList.includes(item.usercode) }
              ]"
              @click="selectDoctor(item.usercode)"
            >
              {{ item.fullname }}
            </span>
            <span class="no-data" v-if="!doctorsList.length">
              {{ emptyText }}
            </span>
          </div>
        </el-form-item>
        <el-form-item label="是否展示">
          <el-switch
            v-model="groupObj.syzt"
            active-text="是"
            inactive-text="否"
            class="switch"
          >
          </el-switch>
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
import { State, Action, Mutation } from 'vuex-class'
@Component({
  name: 'doctorDuty'
})
export default class doctorDuty extends Vue {
  @State sizeMultiple
  @State yljgdm
  @State associationAreaCode
  @State associationOfficeCode
  @State dutyHiddenTel

  @Mutation CHANGE_DUTY_HIDDEN_TEL

  private groupsList: any[] = [] // 值班组数据
  private doctorsList: any[] = [] // 医生列表
  private dialogVisible: boolean = false
  private handleType: number = 0 // 操作类型 0：新增 1：编辑
  private title: string = '' // 弹框标题
  private groupObj: any = {
    position: 0,
    zbfzmc: '', // 值班组标题
    syzt: true, // 值班组是否展示
    ysdmList: [], //医生代码集合
    ysmcList: [] //医生名称集合
  }
  private emptyText: string = '' // 无数据提示语
  private hiddenTel: boolean = false // 隐藏联系方式

  created() {
    this.hiddenTel = this.dutyHiddenTel
  }

  mounted() {
    this.getGroupsList()
    this.getDoctorsList()
  }

  /**
   * @name: getGroupsList
   * @test: test font
   * @msg: 获取值班组数据
   * @param {void}
   * @return: void
   */
  private getGroupsList(): void {
    const params = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm
    }
    this.$api
      .getZbysList(params)
      .then(res => {
        this.emptyText = '暂无数据'
        if (res.data) {
          this.buildGroupsList(res.data)
        }
        return
      })
      .catch(err => {
        this.groupsList = []
        this.emptyText = '页面无响应'
      })
  }

  //获取医生列表
  private getDoctorsList(): void {
    const params = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm
    }
    this.$api
      .getDoctorList(params)
      .then(res => {
        if (res.data && res.data.userList && res.data.userList.length) {
          this.doctorsList = res.data.userList.filter(u => {
            return u.isInDept === 1
          })
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

  /**
   * @name: buildGroupsList
   * @test: test font
   * @msg: 组装值班医生组集合
   * @param {void}
   * @return: void
   */
  private buildGroupsList(data): void {
    // 将ysdm和ysmc取出集合
    this.groupsList = []
    for (var key in data) {
      let ysdmList: string[] = []
      let ysmcList: string[] = []
      data[key].forEach((p: any) => {
        ysdmList.push(p.ysdm)
        ysmcList.push(p.ysmc)
      })
      this.groupsList.push({
        position: key,
        zbfzmc: data[key][0].zbfzmc,
        syzt: data[key][0].syzt === '1',
        ysdmList: ysdmList,
        ysmcList: ysmcList
      })
    }
  }
  /**
   * @name: addGroups
   * @test: test font
   * @msg: 添加值班分组
   * @param {void}
   * @return: void
   */
  private addGroups(): void {
    this.handleType = 0
    this.title = '新增值班组'
    this.dialogVisible = true
    this.groupObj.position = 0
    this.groupObj.zbfzmc = ''
    this.groupObj.syzt = true
    this.groupObj.ysdmList = []
    this.groupObj.ysmcList = []
  }

  /**
   * @name: changeShow
   * @test: test font
   * @msg: 展示隐藏该诊断分组
   * @param {void}
   * @return: void
   */
  private changeShow(group: any): void {
    this.handleType = 0
    this.groupObj.position = group.position
    this.groupObj.zbfzmc = group.zbfzmc
    this.groupObj.syzt = !group.syzt
    this.groupObj.ysdmList = group.ysdmList
    this.groupObj.ysmcList = group.ysmcList
    this.intoZbysList()
  }

  /**
   * @name: editGroup
   * @test: test font
   * @msg: 编辑值班分组
   * @param {void}
   * @return: void
   */
  private editGroup(group: any): void {
    this.handleType = 0
    this.title = '编辑值班组'
    this.groupObj.position = group.position
    this.groupObj.zbfzmc = group.zbfzmc
    this.groupObj.syzt = group.syzt
    this.groupObj.ysdmList = group.ysdmList
    this.groupObj.ysmcList = group.ysmcList
    this.groupObj.ysdmList = this.groupObj.ysdmList.filter(item => {
      return this.doctorsList.find(doc => {
        return item === doc.usercode
      })
    })
    this.dialogVisible = true
  }

  /**
   * @name: deleteGroup
   * @test: test font
   * @msg: 删除该分组
   * @param {void}
   * @return: void
   */
  private deleteGroup(group: any): void {
    this.$confirm('确定删除吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        this.deleteZbysList(group)
        return
      })
      .catch(() => {})
  }

  /**
   * @name: deleteZbysList
   * @test: test font
   * @msg: 删除值班医生组
   * @return: void
   */
  private deleteZbysList(group: any): void {
    const params = {
      ksdm: this.associationOfficeCode,
      bqdm: this.associationAreaCode,
      yljgdm: this.yljgdm,
      position: group.position
    }
    this.$api
      .deleteZbysList(params)
      .then(res => {
        this.$message({
          message: res.data,
          type: 'success'
        })
        this.getGroupsList()
        return
      })
      .catch(err => {
        this.$message({
          message: err.data,
          type: 'error'
        })
      })
  }

  /**
   * @name: selectDoctor
   * @test: test font
   * @msg: 点击医生
   * @param {string}
   * @return: void
   */
  private selectDoctor(usercode: string): void {
    if (this.groupObj.ysdmList.includes(usercode)) {
      const index = this.groupObj.ysdmList.findIndex(item => {
        return item === usercode
      })
      this.groupObj.ysdmList.splice(index, 1)
    } else {
      this.groupObj.ysdmList.push(usercode)
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
    if (this.groupObj.title === '') {
      this.$alert('请填写标题！')
      return
    }
    if (!this.groupObj.ysdmList.length) {
      this.$alert('请选择医生！')
      return
    }
    this.intoZbysList()
  }

  /*
   * 新增/修改值班医生组
   * */
  private intoZbysList(): void {
    const params = {
      ksdm: this.associationOfficeCode,
      bqdm: this.associationAreaCode,
      yljgdm: this.yljgdm,
      position: this.groupObj.position,
      zbfzmc: this.groupObj.zbfzmc,
      ysdmList: this.groupObj.ysdmList.join(','),
      syzt: this.groupObj.syzt ? '1' : '0',
      phonezt: '1'
    }
    this.$api
      .intoZbysList(params)
      .then(res => {
        this.$message({
          message: res.data,
          type: 'success'
        })
        this.dialogVisible = false
        this.getGroupsList()
        return
      })
      .catch(err => {
        this.$message({
          message: err.message,
          type: 'error'
        })
      })
  }

  /**
   * @name: changeHidden
   * @test: test font
   * @msg: 点击隐藏联系方式
   * @param {void}
   * @return: void
   */
  private changeHidden(): void {
    this.CHANGE_DUTY_HIDDEN_TEL(this.hiddenTel)
  }
}
</script>

<style lang="scss" scoped>
.doctor-duty {
  position: relative;
  height: 100%;
  overflow: hidden;
  padding: 75px 25px 20px;

  .hidden-tel {
    @include home-font-color;
  }

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
  .switch {
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
