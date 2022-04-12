<!--
 * @Descripttion: 诊疗组分管床位
 * @version:
 * @Author: wangqi
 * @Date: 2019-08-06 15:28:13
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-15 10:17:19
 -->
<template>
  <div class="doctor-group">
    <p class="title flex flex-align-center">
      诊疗组数量：{{ groupsList.length }}
      <el-button class="add-btn" type="primary" round @click="addGroups">
        添加诊疗组
      </el-button>
    </p>
    <el-table :data="groupsList" style="width: 100%" :empty-text="emptyText">
      <el-table-column prop="zlzxh" label="序号" :width="100 * sizeMultiple">
      </el-table-column>
      <el-table-column label="医生/诊疗组人员">
        <template slot-scope="scope">
          {{ scope.row.ysmcList.join(',') }}
        </template>
      </el-table-column>
      <el-table-column label="分管床位">
        <template slot-scope="scope">
          {{ scope.row.cwdmList.join(',') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" :width="260 * sizeMultiple">
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
      custom-class="config-group-dialog"
      width="38%"
      :title="title"
      top="20vh"
    >
      <el-form v-model="groupObj">
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
        <el-form-item label="选择床位">
          <div class="btn-group flex flex-align-center">
            <span
              v-for="(item, index) in bedList"
              :key="index"
              :class="[
                'identity-btn',
                { active: groupObj.cwdmList.includes(item.cwdm) }
              ]"
              @click="selectBed(item.cwdm)"
            >
              {{ item.cwdm }}
            </span>
            <span class="no-data" v-if="!bedList.length">
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
import { State, Mutation } from 'vuex-class'
@Component({
  name: 'doctorGroup'
})
export default class doctorGroup extends Vue {
  @State sizeMultiple
  @State yljgdm
  @State associationAreaCode
  @State associationOfficeCode
  @State treatmentGroupHiddenTel

  @Mutation CHANGE_GROUP_HIDDEN_TEL

  private groupsList: any[] = [] // 诊断组数据
  private doctorsList: any[] = [] // 医生列表
  private dialogVisible: boolean = false
  private handleType: number = 0 // 操作类型 0：新增 1：编辑
  private bedList: any[] = [] // 床位列表
  private title: string = '' // 弹框标题
  private groupObj: any = {
    zlzxh: 0, //诊疗组序号
    ysdmList: [], //医生代码集合
    syzt: true, //是否展示
    ysmcList: [], //医生名称集合
    cwdmList: [] //床位代码集合
  }
  private emptyText: string = '' // 无数据提示语
  private hiddenTel: boolean = false // 隐藏联系方式

  created() {
    this.hiddenTel = this.treatmentGroupHiddenTel
  }

  mounted() {
    this.getGroupsList()
    this.getDoctorsList()
    this.getBedList()
  }

  /**
   * @name: getGroupsList
   * @test: test font
   * @msg: 获取诊疗组数据
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
      .getZlzxxList(params)
      .then(res => {
        this.emptyText = '暂无数据'
        if (res.data && res.data.length) {
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

  //获取床位列表
  private getBedList(): void {
    const params = {
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      yljgdm: this.yljgdm
    }
    this.$api
      .getCwmlList(params)
      .then(res => {
        if (res.data && res.data.length) {
          this.bedList = res.data
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

  /*
   * 组装诊疗组数据
   * */
  private buildGroupsList(data: any[]): void {
    this.groupsList = []
    //取出每个组的ysdm列表、ysmc列表和cwdm列表
    data.forEach(i => {
      let ysdmList: any[] = []
      let ysmcList: any[] = []
      let cwdmList: any[] = []
      let syzt = true
      if (i.zlzcwysEntityList && i.zlzcwysEntityList.length) {
        i.zlzcwysEntityList[0].syzt === '1' ? (syzt = true) : (syzt = false)
        i.zlzcwysEntityList.forEach((zlzcw: any) => {
          cwdmList.push(zlzcw.cwdm)
        })
      }
      if (i.zlzysysEntityList && i.zlzysysEntityList.length) {
        i.zlzysysEntityList.forEach((zlzys: any) => {
          ysdmList.push(zlzys.ysdm)
          ysmcList.push(zlzys.ysmc)
        })
      }
      this.groupsList.push({
        zlzxh: i.zlzxh,
        syzt: syzt,
        ysdmList: ysdmList,
        ysmcList: ysmcList,
        cwdmList: cwdmList
      })
    })
  }

  /**
   * @name: addGroups
   * @test: test font
   * @msg: 添加诊断分组
   * @param {void}
   * @return: void
   */
  private addGroups(): void {
    this.handleType = 0
    this.title = '新增诊疗组'
    this.groupObj.zlzxh = 0
    this.groupObj.syzt = true
    this.groupObj.ysdmList = []
    this.groupObj.ysmcList = []
    this.groupObj.cwdmList = []
    this.dialogVisible = true
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
    this.groupObj.zlzxh = group.zlzxh
    this.groupObj.syzt = !group.syzt
    this.groupObj.ysdmList = group.ysdmList
    this.groupObj.ysmcList = group.ysmcList
    this.groupObj.cwdmList = group.cwdmList
    this.intoZlzxx()
  }

  /**
   * @name: editGroup
   * @test: test font
   * @msg: 编辑诊断分组
   * @param {void}
   * @return: void
   */
  private editGroup(group: any): void {
    this.handleType = 0
    this.title = '编辑诊疗组'
    this.groupObj.zlzxh = group.zlzxh
    this.groupObj.syzt = group.syzt
    this.groupObj.ysdmList = group.ysdmList
    this.groupObj.ysmcList = group.ysmcList
    this.groupObj.cwdmList = group.cwdmList
    this.groupObj.cwdmList = this.groupObj.cwdmList.filter(item => {
      return this.bedList.find(bed => {
        return item === bed.cwdm
      })
    })
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
        this.deleteZlzxx(group)
        return
      })
      .catch(() => {})
  }

  /**
   * 删除诊疗组
   */
  private deleteZlzxx(group: any): void {
    const params = {
      ksdm: this.associationOfficeCode,
      bqdm: this.associationAreaCode,
      yljgdm: this.yljgdm,
      zlzxh: group.zlzxh
    }
    this.$api
      .deleteZlzxx(params)
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
   * @name: selectBed
   * @test: test font
   * @msg: 点击床位
   * @param {string}
   * @return: void
   */
  private selectBed(cwdm: string): void {
    if (this.groupObj.cwdmList.includes(cwdm)) {
      const index = this.groupObj.cwdmList.findIndex(item => {
        return item === cwdm
      })
      this.groupObj.cwdmList.splice(index, 1)
    } else {
      this.groupObj.cwdmList.push(cwdm)
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
    if (!this.groupObj.ysdmList.length) {
      this.$alert('请选择医生！')
      return
    }
    if (!this.groupObj.cwdmList.length) {
      this.$alert('请选择床位！')
      return
    }
    this.intoZlzxx()
  }

  /*
   * 新增/修改诊疗组信息
   * */
  private intoZlzxx(): void {
    const params = {
      ksdm: this.associationOfficeCode,
      bqdm: this.associationAreaCode,
      yljgdm: this.yljgdm,
      zlzxh: this.groupObj.zlzxh,
      syzt: this.groupObj.syzt ? '1' : '0',
      ysdmList: this.groupObj.ysdmList.join(','),
      cwdmList: this.groupObj.cwdmList.join(','),
      phonezt: '1'
    }
    this.$api
      .intoZlzxx(params)
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
          message: err.data,
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
    this.CHANGE_GROUP_HIDDEN_TEL(this.hiddenTel)
  }
}
</script>

<style lang="scss" scoped>
.doctor-group {
  position: relative;
  height: 100%;
  overflow: hidden;
  padding: 75px 25px 50px;
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
}
</style>
