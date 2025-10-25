import request from '@/utils/request'

// 统计数据
export function getStatistics() {
  return request({
    url: '/admin/statistics',
    method: 'get'
  })
}

// 分类管理
export function getCategories() {
  return request({
    url: '/admin/categories',
    method: 'get'
  })
}

export function createCategory(data) {
  return request({
    url: '/admin/categories',
    method: 'post',
    data
  })
}

export function updateCategory(id, data) {
  return request({
    url: `/admin/categories/${id}`,
    method: 'put',
    data
  })
}

export function deleteCategory(id) {
  return request({
    url: `/admin/categories/${id}`,
    method: 'delete'
  })
}

// 菜品管理
export function getDishes(params) {
  return request({
    url: '/admin/dishes',
    method: 'get',
    params
  })
}

export function createDish(data) {
  return request({
    url: '/admin/dishes',
    method: 'post',
    data
  })
}

export function updateDish(id, data) {
  return request({
    url: `/admin/dishes/${id}`,
    method: 'put',
    data
  })
}

export function deleteDish(id) {
  return request({
    url: `/admin/dishes/${id}`,
    method: 'delete'
  })
}

// 订单管理
export function getOrders(params) {
  return request({
    url: '/admin/orders',
    method: 'get',
    params
  })
}

export function updateOrderStatus(id, status) {
  return request({
    url: `/admin/orders/${id}/status`,
    method: 'put',
    data: { status }
  })
}

// 文件上传
export function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  return request({
    url: '/admin/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

