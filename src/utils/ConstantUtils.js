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
    routerEditPath: 'leaveEdit',  // 请假编辑页路由
    routerDetailPath: 'leaveDetail',  // 请假明细页路由
    routerApprovePath: 'leaveApprove',  // 请假审核页路由
  },
  '6QXJ': {
    billtypename: '销假单',
    routerEditPath: 'leaveoffEdit',  // 销假编辑页路由
    routerDetailPath: 'leaveoffDetail',  // 销假明细页路由
    routerApprovePath: 'leaveoffApprove',  // 销假审核页路由
  },
  '6QJB': {
    billtypename: '加班单',
    routerEditPath: 'overtimeEdit',  // 加班编辑页路由
    routerDetailPath: 'overtimeDetail',  // 加班明细页路由
    routerApprovePath: 'overtimeApprove',  // 加班审核页路由
  },
  '6QCC': {
    billtypename: '出差单',
    routerEditPath: 'awayEdit',  // 出差编辑页路由
    routerDetailPath: 'awayDetail',  // 出差明细页路由
    routerApprovePath: 'awayApprove',  // 出差审核页路由
  },
  '6QXC': {
    billtypename: '销差单',
    routerEditPath: 'awayoffEdit',  // 销差编辑页路由
    routerDetailPath: 'awayoffDetail',  // 销差明细页路由
    routerApprovePath: 'awayoffApprove',  //销差审核页路由
  },
  '6QLZ': {
    billtypename: '离职单',
    routerEditPath: 'dimissionEdit',  // 离职编辑页路由
    routerDetailPath: 'dimissionDetail',  // 离职明细页路由
    routerApprovePath: 'dimissionApprove',  //离职审核页路由
  },
  '6QQK': {
    billtypename: '签卡单',
    routerEditPath: 'signcardEdit',  // 签卡编辑页路由
    routerDetailPath: 'signcardDetail',  // 签卡明细页路由
    routerApprovePath: 'signcardApprove',  // 签卡审核页路由
  },
  '6QDP': {
    billtypename: '调配单',
    routerEditPath: 'transEdit',  // 调配编辑页路由
    routerDetailPath: 'transDetail',  // 调配明细页路由
    routerApprovePath: 'transApprove',  // 调配审核页路由
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
  },
  dimission: {
    billtypecode: '6QLZ',  // 单据编码
    billtypename: '离职单'
  },
  signcard: {
    billtypecode: '6QQK',  // 单据编码
    billtypename: '签卡单'
  },
  trans: {
    billtypecode: '6QDP',  // 单据编码
    billtypename: '调配'
  }
}
