<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        :placeholder="$t('table.title')"
        style="width: 86%;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        v-waves
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t('table.search') }}
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 2cqb;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t('table.add') }}
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        label="ID"
        prop="id"
        align="center"
        width="400px"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Name"
        width="500px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Created At"
        min-width="150px"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.createdAt }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Status"
        class-name="status-col"
        width="100"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.isRunning ? 'success' : 'info'">
            {{ row.isRunning ? 'active' : 'inactive' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="Action"
        align="center"
        width="230"
        class-name="fixed-width"
      >
        <template slot-scope="{row, $index}">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(row)"
          >
            {{ $t('table.edit') }}
          </el-button>
          <el-button
            v-if="!row.isRunning"
            size="mini"
            type="success"
            @click="handleModifyStatus(row, true)"
          >
            {{ $t('table.publish') }}
          </el-button>
          <el-button
            v-if="row.isRunning"
            size="mini"
            @click="handleModifyStatus(row, false)"
          >
            {{ $t('table.draft') }}
          </el-button>
          <el-button
            v-if="row.status!=='deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="tempArticleData"
        label-position="left"
        label-width="100px"
        style="width: 800px; margin-left:50px;"
      >
        <el-form-item
          label="Name"
          prop="name"
          style="width: 50%;"
        >
          <el-input v-model="tempArticleData.name" />
        </el-form-item>
        <el-form-item
          label="Settings"
        >
          <el-button
            plain
            type="primary"
            size="small"
            @click="addRow"
          >
            <i class="el-icon-plus"></i>
          </el-button>
        </el-form-item>
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="list"
          fit
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column
            label="Name"
            prop="name"
            align="center"
            width="100px"
          >
            <template slot-scope="{row}">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Wallets"
            min-width="100px"
            align="center"
          >
          <el-select
            v-model="value4"
            multiple
            collapse-tags
            collapse-tags-tooltip
            :max-collapse-tags="3"
            placeholder="Select"
            style="width: 240px"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          </el-table-column>
          <el-table-column
            label="Schedule"
            width="200px"
            align="center"
          >
            <el-time-picker
              v-model="defaultTime"
              is-range
              range-separator="-"
              start-placeholder="Start time"
              end-placeholder="End time"
            />
          </el-table-column>
          <el-table-column
            label="Strategy"
            min-width="200px"
            align="center"
          >
            <el-select
              v-model="defaultStrategyValue"
              placeholder="Select"
              size="large"
            >
              <el-option
                v-for="item in defaultStrategies"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-table-column>
          <el-table-column
            label="Action"
            align="right"
            width="230"
            class-name="fixed-width"
          >
            <template slot-scope="{row, $index}">
              <el-button
                v-if="row.status!=='deleted'"
                size="mini"
                type="danger"
                @click="handleDelete(row, $index)"
              >
                {{ $t('table.delete') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogPageviewsVisible"
      title="Reading statistics"
    >
      <el-table
        :data="pageviewsData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column
          prop="key"
          label="Channel"
        />
        <el-table-column
          prop="pageviews"
          label="Pageviews"
        />
      </el-table>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialogPageviewsVisible = false"
        >{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { cloneDeep } from 'lodash'
import { getPageviews, createArticle, updateArticle, defaultArticleData } from '@/api/articles'
import { IGroupData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import TimePicker from '@/components/TimePicker/index.vue'
import { getGroups } from '@/api/bots'

@Component({
  name: 'BotList',
  components: {
    Pagination,
    TimePicker
  }
})
export default class extends Vue {
  private dynamicRows: Array<{ name: string }> = [];
  private tableKey = 0
  private list: IGroupData[] = []
  private total = 0
  private listLoading = true
  private listQuery = {
    page: 1,
    limit: 20,
    importance: undefined,
    title: undefined,
    type: undefined,
    sort: '+id'
  }

  private defaultTime: Date[] = [
    new Date(2016, 9, 10, 0, 0),
    new Date(2016, 9, 10, 23, 59)
  ]

  private defaultStrategyValue = null
  private defaultStrategies = [
    { value: 0, label: 'Buy' },
    { value: 1, label: 'Sell' },
    { value: 2, label: 'Buy and Sell' }
  ]

  private dialogFormVisible = false
  private dialogStatus = ''
  private textMap = {
    update: 'Edit',
    create: 'Create'
  }

  private dialogPageviewsVisible = false
  private pageviewsData = []
  private rules = {
    type: [{ required: true, message: 'type is required', trigger: 'change' }],
    timestamp: [{ required: true, message: 'timestamp is required', trigger: 'change' }],
    title: [{ required: true, message: 'title is required', trigger: 'blur' }]
  }

  private tempArticleData = defaultArticleData

  created() {
    this.getList()
  }

  private addRow() {
    this.dynamicRows.push({ name: '' })
  }

  private removeRow(index: number) {
    this.dynamicRows.splice(index, 1)
  }

  private async getList() {
    this.listLoading = true
    const { data } = await getGroups(this.listQuery)
    this.list = data.items
    this.total = data.total
    this.listLoading = false
  }

  private handleFilter() {
    this.listQuery.page = 1
    this.getList()
  }

  private handleModifyStatus(row: any, isRunning: boolean) {
    this.$message({
      message: 'Success',
      type: 'success'
    })
    row.isRunning = isRunning
  }

  private sortChange(data: any) {
    const { prop, order } = data
    if (prop === 'id') {
      this.sortByID(order)
    }
  }

  private sortByID(order: string) {
    if (order === 'ascending') {
      this.listQuery.sort = '+id'
    } else {
      this.listQuery.sort = '-id'
    }
    this.handleFilter()
  }

  private getSortClass(key: string) {
    const sort = this.listQuery.sort
    return sort === `+${key}` ? 'ascending' : 'descending'
  }

  private resetTempArticleData() {
    this.tempArticleData = cloneDeep(defaultArticleData)
  }

  private handleCreate() {
    this.resetTempArticleData()
    this.dialogStatus = 'create'
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate()
    })
  }

  private createData() {
    (this.$refs.dataForm as Form).validate(async(valid) => {
      if (valid) {
        const articleData = this.tempArticleData
        articleData.id = Math.round(Math.random() * 100) + 1024 // mock a id
        articleData.author = 'vue-typescript-admin'
        const { data } = await createArticle({ article: articleData })
        data.article.timestamp = Date.parse(data.article.timestamp)
        this.list.unshift(data.article)
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      }
    })
  }

  private handleUpdate(row: any) {
    this.tempArticleData = Object.assign({}, row)
    this.tempArticleData.timestamp = +new Date(this.tempArticleData.timestamp)
    this.dialogStatus = 'update'
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate()
    })
  }

  private updateData() {
    (this.$refs.dataForm as Form).validate(async(valid) => {
      if (valid) {
        const tempData = Object.assign({}, this.tempArticleData)
        tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
        const { data } = await updateArticle(tempData.id, { article: tempData })
        const index = this.list.findIndex(v => v.id === data.article.id)
        this.list.splice(index, 1, data.article)
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      }
    })
  }

  private handleDelete(row: any, index: number) {
    this.$notify({
      title: 'Success',
      message: 'Delete Successfully',
      type: 'success',
      duration: 2000
    })
    this.list.splice(index, 1)
  }

  private async handleGetPageviews(pageviews: string) {
    const { data } = await getPageviews({ pageviews })
    this.pageviewsData = data.pageviews
    this.dialogPageviewsVisible = true
  }
}
</script>

<style>
.demo-range .el-date-editor {
  margin: 8px;
}

.demo-range .el-range-separator {
  box-sizing: content-box;
}
</style>
