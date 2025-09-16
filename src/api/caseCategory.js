import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/caseCategory/list',
    method: 'get',
    params: params
  })
}

export function createCaseCategory(data) {
  return request({
    url: '/caseCategory/create',
    method: 'post',
    data: data
  })
}

export function updateCaseCategory(id, data) {
  return request({
    url: '/caseCategory/update/' + id,
    method: 'post',
    data: data
  })
}

export function getCaseCategory(id) {
  return request({
    url: '/caseCategory/' + id,
    method: 'get'
  })
}

export function deleteCaseCategory(id) {
  return request({
    url: '/caseCategory/delete/' + id,
    method: 'post'
  })
}

export function deleteBatch(data) {
  return request({
    url: '/caseCategory/delete/batch',
    method: 'post',
    params: data
  })
}

export function updateShowStatus(data) {
  return request({
    url: '/caseCategory/update/showStatus',
    method: 'post',
    params: data
  })
}

export function fetchAllList() {
  return request({
    url: '/caseCategory/listAll',
    method: 'get'
  })
}