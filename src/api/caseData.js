import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/admin/case/list',
    method: 'get',
    params: params
  })
}

export function createCaseData(data) {
  return request({
    url: '/admin/case/create',
    method: 'post',
    data: data
  })
}

export function updateCaseData(id, data) {
  return request({
    url: '/admin/case/update/' + id,
    method: 'post',
    data: data
  })
}

export function getCaseData(id) {
  return request({
    url: '/admin/case/' + id,
    method: 'get'
  })
}

export function deleteCaseData(id) {
  return request({
    url: '/admin/case/delete/' + id,
    method: 'post'
  })
}

export function deleteBatch(data) {
  return request({
    url: '/admin/case/delete/batch',
    method: 'post',
    params: data
  })
}

export function updateStatus(data) {
  return request({
    url: '/admin/case/update/status',
    method: 'post',
    params: data
  })
}

export function updateShowStatus(data) {
  return request({
    url: '/admin/case/update/showStatus',
    method: 'post',
    params: data
  })
}

export function approve(id, status) {
  return request({
    url: '/admin/case/approve/' + id,
    method: 'post',
    params: { status: status }
  })
}