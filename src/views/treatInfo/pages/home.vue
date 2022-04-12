<!--
 * @Descripttion: 患者详情 - 首页
 * @version:
 * @Author: wangqi
 * @Date: 2019-08-01 17:41:11
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-02 09:39:49
 -->
<template>
  <div class="treat-home flex">
    <div class="l-left flex flex-v">
      <div class="sign module-item flex-1">
        <p class="title">患者体征</p>
        <sign />
      </div>
      <div class="allergy module-item">
        <p class="title">过敏信息</p>
        <allergy />
      </div>
      <div class="operation module-item flex-1">
        <p class="title">手术</p>
        <operation />
      </div>
    </div>
    <div class="l-center flex flex-v">
      <div class="case module-item">
        <div class="title" @click="$router.push('/treatInfo/caseHistory')">
          电子病历
        </div>
        <the-case />
      </div>
    </div>
    <div class="l-right flex flex-v">
      <div class="examine module-item flex-1">
        <p class="title" @click="$router.push('/treatInfo/examinationReports')">
          检验
        </p>
        <examine />
      </div>
      <div class="inspection module-item ">
        <p class="title" @click="$router.push('/treatInfo/inspectionReports')">
          检查
        </p>
        <inspection />
      </div>
    </div>

    <el-dialog title="编辑备忘标签" :visible.sync="dialogVisible" width="30%">
      <ul class="tag-box">
        <li v-for="(item, index) in dialogTagsData" :key="index" class="tag">
          <span class="dia-title">{{ `标签${index + 1}` }}</span>
          <el-input v-model="item.bqmxmc"></el-input>
        </li>
      </ul>
      <span class="no-data" v-if="!dialogTagsData.length">暂无数据</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogMakeSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { State } from 'vuex-class'
import sign from '../components/home-sign.vue'
import allergy from '../components/home-allergy.vue'
import theCase from '../components/home-case.vue'
import examine from '../components/home-examine.vue'
import inspection from '../components/home-inspection.vue'
import operation from '../components/home-operation.vue'

@Component({
  name: 'treatHome',
  components: {
    sign,
    allergy,
    theCase,
    operation,
    examine,
    inspection
  }
})
export default class treatHome extends Vue {
  @State associationAreaCode
  @State associationOfficeCode
  @State yljgdm
  @State patientInfo
  @State sizeMultiple
  @State fontSize

  @Watch('patientInfo')
  changePatien(newVal) {
    this.memo = ''
    this.getNoteData()
  }
  private oldMemo: string = '' // 用来判断是否修改过了备注
  private memo: string = '' // 病人备注
  private tags: any[] = [] // 标签liest
  private dialogVisible: boolean = false // 标签编辑弹框展示控制
  private dialogTagsData: any = [] // 弹出框标签

  mounted() {
    this.getNoteData()
    this.getTags()
  }

  beforeDestroy() {
    this.saveMemo()
  }

  /**
   * @name: getTags
   * @test: test font
   * @msg: 获取病区标签
   * @param {void}
   * @return: void
   */
  private getTags() {
    const param = {
      yljgdm: this.yljgdm,
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode
    }
    this.$api
      .getTagList(param)
      .then(res => {
        const _data = res.data || []
        this.tags = _data
        return
      })
      .catch(err => {
        this.$message({
          message: '获取备注标签失败！',
          type: 'error'
        })
      })
  }

  /**
   * @name: getNoteData
   * @test: test font
   * @msg: 获取患者备忘数据
   * @param {void}
   * @return: void
   */
  private getNoteData(): void {
    const param = {
      yljgdm: this.yljgdm,
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      jzlsh: this.patientInfo.jzlsh
    }
    this.$api
      .getRemarkEntity(param)
      .then(res => {
        const _data = res.data || []
        if (_data.length) {
          this.memo = _data[0].bzms || ''
          this.oldMemo = this.memo
        }
        return
      })
      .catch(err => {
        this.$message({
          message: '获取患者备注失败！',
          type: 'error'
        })
      })
  }

  /**
   * @name: addMome
   * @test: test font
   * @msg: 添加备注
   * @param {void}
   * @return: void
   */
  private addMome(mome: string): void {
    if (this.memo === '') {
      this.memo = mome
    } else {
      this.memo += '，' + mome
    }
    this.saveMemo()
  }

  /**
   * @name: showDialog
   * @test: test font
   * @msg: 修改备忘标签弹出
   * @param {void}
   * @return: void
   */
  private showDialog() {
    this.dialogTagsData = JSON.parse(JSON.stringify(this.tags))
    this.dialogVisible = true
  }

  /**
   * @name: dialogMakeSure
   * @test: test font
   * @msg: 保存标签
   * @param {void}
   * @return: void
   */
  private dialogMakeSure() {
    const param = {
      yljgdm: this.yljgdm,
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      list: JSON.stringify(this.dialogTagsData)
    }
    this.$api
      .editTagList(param)
      .then(res => {
        this.dialogVisible = false
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.getTags()
        return
      })
      .catch(err => {
        this.dialogVisible = false
        this.$message({
          message: '保存失败',
          type: 'error'
        })
      })
  }

  /**
   * @name: saveMemo
   * @test: test font
   * @msg: 保存备注
   * @param {void}
   * @return: void
   */
  private saveMemo() {
    if (this.memo === this.oldMemo) {
      return
    }
    const param = {
      bzlb: '0',
      yljgdm: this.yljgdm,
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      jzlsh: this.patientInfo.jzlsh,
      patid: this.patientInfo.patid,
      cwdm: this.patientInfo.cycw || this.patientInfo.rycw,
      bzms: this.memo
    }
    this.$api
      .editRemark(param)
      .then(res => {
        this.oldMemo = this.memo
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        return
      })
      .catch(err => {})
  }
}
</script>

<style lang="scss" scoped>
.treat-home {
  .l-left,
  .l-center,
  .l-right {
    width: 33%;
    height: 100%;
    & > div {
      overflow-y: auto;
    }
  }
  .l-left,
  .l-center {
    margin-right: 10px;
  }
  .module-item {
    position: relative;
    padding: 55px 15px 10px;
    @include home-content-bg;
    box-shadow: 0px 2px 4px rgba(30, 60, 114, 0.4);
    border-radius: 0 4px 4px 4px;
    overflow-y: auto;
  }
  .title {
    position: absolute;
    left: 0;
    top: 0;
    font-size: 22px;
    width: 100%;
    @include home-title-s-font-color;
    font-weight: 600;
    background-color: #032c74;
  }

  // 体征
  .sign {
    margin-bottom: 10px;
    overflow: hidden;
    flex: 2;
  }
  // 过敏
  .allergy {
    height: 190px;
    margin-bottom: 10px;
  }
  // 备忘
  .mome {
    @include puhui-r;
    color: #000;
    font-size: 18px;
    flex: 1;
    .memo-box {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      padding-top: 6px;
    }
    .mome-content {
      background: transparent;
      @include remark-title-font-color;
      width: 100%;
      height: 90%;
      border: none;
      resize: none;
      overflow-y: auto;
      outline: none;
    }
    .tag-btn,
    .edit-btn {
      position: absolute;
      top: 20px;
      @include remark-title-font-color;
      font-size: 16px;
      cursor: pointer;
    }
    .tag-btn {
      right: 140px;
    }
    .edit-btn {
      right: 20px;
    }
  }
  // 电子病例
  .case {
    height: 100%;
    margin-bottom: 10px;
  }
  // 手术
  .operation {
  }
  // 检验
  .examine {
    margin-bottom: 10px;
  }
  // 检查
  .inspection {
    height: 50%;
  }
}
</style>
