
const hostList = {
    'proxy' : '',  // 代理
    'ceshiHttps': 'https://test.bjcsjs.com:7001/', //主测试环境
    'proveHost': 'http://8.140.136.205:7011/', //证明办理环境
    'questHost': 'http://8.140.136.205:8999/'      // 问卷接口地址
}

module.exports = {
	host: hostList.ceshiHttps,
  proveHost: hostList.proveHost,
  questHost: hostList.questHost
}
