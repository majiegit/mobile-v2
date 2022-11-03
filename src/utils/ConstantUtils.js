export const approveStateName = {
  '0': '审批未通过',
  '1': '审批通过',
  '2': '审批进行中',
  '3': '提交',
  '-1': '自由'
}

export const approveStateColorList = {
  '0': '#E9AE24',
  '1': '#3FC691',
  '2': '#2479ED',
  '3': '#2479ED',
  '-1': '#2479ED'
}

// 我的申请 审批中心使用
export const BillTypeList = [
  {
    billtypename: '全部',
    billtype: '',
  },
  {
    billtypename: '请假单',
    billtype: '6QQJ'
  },
  {
    billtypename: '加班单',
    billtype: '6QJB',
  },
  {
    billtypename: '出差单',
    billtype: '6QCC',
  }
]

// 工作任务、 审批中心、我的申请使用
export const BillTypeMap = {
  '6QQJ': {
    billtypename: '请假单',  // 单据名称
    routerPath: '',          // 单据路由
  },
  '6QJB': {
    billtypename: '加班单',
    routerPath: '',
  },
  '6QCC': {
    billtypename: '出差单',
    routerPath: '',
  },
}

