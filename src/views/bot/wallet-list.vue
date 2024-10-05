<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        width="80"
        align="center"
        label="ID"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="800px"
        align="center"
        label="Address"
      >
        <template slot-scope="{row}">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="240px"
        align="center"
        label="Created At"
      >
        <template slot-scope="{row}">
          <span>{{ row.createdAt  }}</span>
        </template>
      </el-table-column>

      <el-table-column
        class-name="status-col"
        label="Status"
        width="110"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.isActive ? 'success' : 'info'">
            {{ row.isActive ? 'active' : 'inactive' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        min-width="240px"
        label="Last Active At"
      >
        <template slot-scope="{row}">
          <span>{{ row.lastActiveAt }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="Actions"
        width="120"
      >
        <template slot-scope="{row}">
          <router-link :to="'/example/edit/'+row.id">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
            >
              Edit
            </el-button>
          </router-link>
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getBots } from '@/api/bots'
import { IBotData } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'WalletList',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private total = 0
  private list: IBotData[] = []
  private listLoading = true
  private listQuery = {
    page: 1,
    limit: 20
  }

  created() {
    this.getList()
  }

  private async getList() {
    this.listLoading = true
    const { data } = await getBots(this.listQuery)
    this.list = data.items
    this.total = data.total
    this.listLoading = false
  }
}
</script>

<style lang="scss" scoped>
.edit-input {
  padding-right: 100px;
}

.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
