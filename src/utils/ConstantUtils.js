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

export const whetherYN = {
  'N': '否',
  'Y': '是',
}

export const dateTimeType = {
  '1': '小时',
  '2': '天',
}

export const LastAfter = {
  '1': '上午',
  '2': '下午',
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
    billtypename: '销假单',
    billtype: '6QXJ',
  },
  {
    billtypename: '加班单',
    billtype: '6QJB',
  },
  {
    billtypename: '出差单',
    billtype: '6QCC',
  },
  {
    billtypename: '销差单',
    billtype: '6QXC',
  },

]

// 工作任务、 审批中心、我的申请使用
export const BillTypeMap = {
  '6QQJ': {
    billtypename: '请假单',  // 单据名称
    routerDetailPath: 'leaveDetail',  // 请假明细页路由
    routerApprovePath: 'leaveApprove',  // 请假审核页路由
  },
  '6QXJ': {
    billtypename: '销假单',
    routerDetailPath: 'leaveoffDetail',  // 请假明细页路由
    routerApprovePath: 'leaveoffApprove',  // 请假审核页路由
  },
  '6QJB': {
    billtypename: '加班单',
    routerDetailPath: 'overtimeDetail',  // 请假明细页路由
    routerApprovePath: 'overtimeApprove',  // 请假审核页路由
  },
  '6QCC': {
    billtypename: '出差单',
    routerDetailPath: 'awayDetail',  // 请假明细页路由
    routerApprovePath: 'awayApprove',  // 请假审核页路由
  },

  '6QXC': {
    billtypename: '销差单',
    routerDetailPath: 'awayoffDetail',  // 请假明细页路由
    routerApprovePath: 'awayoffApprove',  // 请假审核页路由
  }

}

export const BillTypeCode = {
  leave: {
    billtypecode: '6QQJ',  // 单据编码
    billtypename: '请假单'  // 单据名称
  },
  leaveOff: {
    billtypecode: '6QXJ',  // 单据编码
    billtypename: '销假单' // 单据名称
  },
  overtime: {
    billtypecode: '6QJB',  // 单据编码
    billtypename: '加班单'
  },
  away: {
    billtypecode: '6QCC',  // 单据编码
    billtypename: '出差单'
  },
  awayOff: {
    billtypecode: '6QXC',  // 单据编码
    billtypename: '销差单'
  }
}
