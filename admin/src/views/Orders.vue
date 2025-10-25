<template>
  <div>
    <el-card>
      <template #header>
        <span>订单列表</span>
      </template>
      
      <el-form :inline="true" style="margin-bottom: 20px">
        <el-form-item label="订单状态">
          <el-select v-model="searchForm.status" placeholder="全部状态" clearable @change="loadOrders">
            <el-option label="待支付" value="pending" />
            <el-option label="已支付" value="paid" />
            <el-option label="制作中" value="preparing" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="searchForm.order_no" placeholder="搜索订单号" clearable @keyup.enter="loadOrders" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadOrders">搜索</el-button>
        </el-form-item>
      </el-form>
      
      <el-table :data="orders.list" v-loading="loading">
        <el-table-column prop="order_no" label="订单号" width="200" />
        <el-table-column label="用户" width="150">
          <template #default="{ row }">
            {{ row.user?.nickname || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="total_amount" label="金额" width="100">
          <template #default="{ row }">
            ¥{{ row.total_amount }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="contact_name" label="联系人" width="100" />
        <el-table-column prop="contact_phone" label="联系电话" width="120" />
        <el-table-column prop="created_at" label="下单时间" width="180" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleViewDetail(row)">详情</el-button>
            <el-button
              v-if="row.status === 'paid'"
              type="success"
              size="small"
              @click="handleUpdateStatus(row, 'preparing')"
            >
              开始制作
            </el-button>
            <el-button
              v-if="row.status === 'preparing'"
              type="success"
              size="small"
              @click="handleUpdateStatus(row, 'completed')"
            >
              完成
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
        v-model:current-page="searchForm.page"
        v-model:page-size="searchForm.limit"
        :total="orders.total"
        layout="total, prev, pager, next"
        style="margin-top: 20px; justify-content: center"
        @current-change="loadOrders"
      />
    </el-card>
    
    <el-dialog v-model="detailVisible" title="订单详情" width="700px">
      <div v-if="currentOrder">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号">{{ currentOrder.order_no }}</el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag :type="getStatusType(currentOrder.status)">
              {{ getStatusText(currentOrder.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="总金额">¥{{ currentOrder.total_amount }}</el-descriptions-item>
          <el-descriptions-item label="支付方式">{{ currentOrder.payment_method || '-' }}</el-descriptions-item>
          <el-descriptions-item label="联系人">{{ currentOrder.contact_name || '-' }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ currentOrder.contact_phone || '-' }}</el-descriptions-item>
          <el-descriptions-item label="配送地址" :span="2">{{ currentOrder.delivery_address || '-' }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ currentOrder.remark || '-' }}</el-descriptions-item>
          <el-descriptions-item label="下单时间" :span="2">{{ currentOrder.created_at }}</el-descriptions-item>
        </el-descriptions>
        
        <h3 style="margin: 20px 0 10px">订单商品</h3>
        <el-table :data="currentOrder.items" border>
          <el-table-column label="图片" width="80">
            <template #default="{ row }">
              <el-image v-if="row.dish_image" :src="row.dish_image" style="width: 50px; height: 50px" fit="cover" />
            </template>
          </el-table-column>
          <el-table-column prop="dish_name" label="菜品名称" />
          <el-table-column prop="price" label="单价" width="100">
            <template #default="{ row }">
              ¥{{ row.price }}
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" width="80" />
          <el-table-column prop="subtotal" label="小计" width="100">
            <template #default="{ row }">
              ¥{{ row.subtotal }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getOrders, updateOrderStatus } from '@/api/admin'

const orders = ref({ list: [], total: 0 })
const loading = ref(false)
const detailVisible = ref(false)
const currentOrder = ref(null)

const searchForm = reactive({
  status: '',
  order_no: '',
  page: 1,
  limit: 20
})

const statusMap = {
  pending: { text: '待支付', type: 'warning' },
  paid: { text: '已支付', type: 'success' },
  preparing: { text: '制作中', type: 'primary' },
  completed: { text: '已完成', type: 'info' },
  cancelled: { text: '已取消', type: 'danger' }
}

const getStatusText = (status) => statusMap[status]?.text || status
const getStatusType = (status) => statusMap[status]?.type || 'info'

const loadOrders = async () => {
  loading.value = true
  try {
    const res = await getOrders(searchForm)
    orders.value = res.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleViewDetail = (row) => {
  currentOrder.value = row
  detailVisible.value = true
}

const handleUpdateStatus = async (row, status) => {
  try {
    await updateOrderStatus(row.id, status)
    ElMessage.success('状态更新成功')
    loadOrders()
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  loadOrders()
})
</script>

