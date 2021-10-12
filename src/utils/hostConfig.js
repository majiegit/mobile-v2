
const hostList = {
    'proxy' : '',  // 代理
    'ceshiHttps': 'https://test.bjcsjs.com:7001/', //主测试环境
    'proveHost': 'http://127.0.0.1:7011/', //证明办理环境
}

module.exports = {
	host: hostList.ceshiHttps,
  proveHost: hostList.proveHost
}
