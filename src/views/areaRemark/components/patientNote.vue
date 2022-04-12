<!--
 * @Descripttion: 患者备忘
 * @version:
 * @Author: wangqi
 * @Date: 2019-08-21 08:47:04
 * @LastEditors: wangqi
 * @LastEditTime: 2019-08-21 08:47:04
 -->
<template>
  <div class="patient-note flex flex-v">
    <p class="title">患者备忘</p>
    <span class="edit-btn tag active" @click="showDialog">编辑便捷短语</span>
    <div class="tag-box">
      <span
        :class="['tag-all', { active: selectTag === -1 }, `fs-${fontSize - 2}`]"
        @click="changeSelectTag(-1, '')"
      >
        全部
      </span>
      <span
        v-for="(item, index) in tags"
        :key="index"
        :class="[
          'tag',
          { active: selectTag === index },
          `color-${index % 8}`,
          `fs-${fontSize - 2}`
        ]"
        @click="changeSelectTag(index, item.bqmxmc)"
      >
        {{ item.bqmxmc }}
      </span>
    </div>
    <div class="note-box flex-1">
      <div
        v-for="(item, index) in noteData"
        :key="index"
        class="note-item flex"
      >
        <bedNo :data="item" />
        <p :class="['note-content', `fs-${fontSize}`]">{{ item.bzms }}</p>
      </div>
      <span class="no-data" v-if="!noteData.length">{{ emptyText }}</span>
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
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'
import bedNo from '../../../components/bedNoCell.vue'

@Component({
  name: 'patientNote',
  components: {
    bedNo
  }
})
export default class patientNote extends Vue {
  @State associationAreaCode
  @State associationOfficeCode
  @State yljgdm
  @State fontSize

  private selectTag: number = -1 // 标签激活index
  private tags: any[] = [] // tags容器
  private noteData: any[] = [] // 患者备忘数据
  private dialogVisible: boolean = false // 标签编辑弹框展示控制
  private dialogTagsData: any = [] // 弹出框标签
  private emptyText: string = '' // 无数据提醒

  mounted() {
    this.getTags()
    this.getNoteData('')
  }

  /**
   * @name: getTags
   * @test: test font
   * @msg: 获取病区标签
   * @param {void}
   * @return: void
   */
  private getTags(): void {
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
  private getNoteData(bqmxmc: string): void {
    this.emptyText = ''
    const param = {
      yljgdm: this.yljgdm,
      bqdm: this.associationAreaCode,
      ksdm: this.associationOfficeCode,
      bqmxmc: bqmxmc
    }
    this.$api
      .getBQList(param)
      .then(res => {
        this.emptyText = '暂无数据'
        const _data = res.data || []
        this.noteData = _data
        return
      })
      .catch(err => {
        this.emptyText = '页面无响应'
        this.$message({
          message: '获取患者备注失败！',
          type: 'error'
        })
      })
  }

  /**
   * @name: changeSelectTag
   * @test: test font
   * @msg: 点击切换备忘标签
   * @param {void}
   * @return: void
   */
  private changeSelectTag(tagIndex: number, bqmxmc: string) {
    this.selectTag = tagIndex
    this.getNoteData(bqmxmc)
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
}
</script>

<style lang="scss" scoped>
.patient-note {
  position: relative;
  width: 1065px;
  margin-right: 15px;
  .title {
    position: absolute;
    left: 25px;
    top: 15px;
    @include remark-title-font-color;
    font-size: 24px;
    @include puhui-m;
  }

  .note-box {
    padding-top: 2px;
    overflow-y: auto;
  }

  .note-item {
    @include home-title-s-font-color;
    margin-bottom: 15px;
    padding-left: 2px;
    .note-content {
      overflow: hidden;
    }
  }
  .bed-no {
    margin-right: 10px;
  }

  // 编辑标签样式
  .edit-btn {
    position: absolute;
    top: 25px;
    right: 20px;
    font-size: 18px;
    border-radius: 4px;
  }

  .tag.active {
    @include button-bg-pri-color;
  }
}
</style>
