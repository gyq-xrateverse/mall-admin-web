import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/caseData/list',
    method: 'get',
    params: params
  })
}

export function createCaseData(data) {
  return request({
    url: '/caseData/create',
    method: 'post',
    data: data
  })
}

export function updateCaseData(id, data) {
  return request({
    url: '/caseData/update/' + id,
    method: 'post',
    data: data
  })
}

export function getCaseData(id) {
  return request({
    url: '/caseData/' + id,
    method: 'get'
  })
}

export function deleteCaseData(id) {
  return request({
    url: '/caseData/delete/' + id,
    method: 'post'
  })
}

export function deleteBatch(data) {
  return request({
    url: '/caseData/delete/batch',
    method: 'post',
    params: data
  })
}

export function updateStatus(data) {
  return request({
    url: '/caseData/update/status',
    method: 'post',
    params: data
  })
}

export function updateShowStatus(data) {
  return request({
    url: '/caseData/update/showStatus',
    method: 'post',
    params: data
  })
}

export function approve(id, status) {
  return request({
    url: '/caseData/approve/' + id,
    method: 'post',
    params: { status: status }
  })
}