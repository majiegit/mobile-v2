
const hostList = {
    'host' : 'https://test.bjcsjs.com:7001/',  // 代理
    'proveHost': 'http://127.0.0.1:7011/', //证明办理环境
    'questHost': 'https://test.bjcsjs.com:8999/', // 问卷接口地址
    'questWirtePath': 'https://test.bjcsjs.com:8888/'  // 问卷填写地址
}

module.exports = {
	host: hostList.host,
  proveHost: hostList.proveHost,
  questHost: hostList.questHost,
  questWirtePath: hostList.questWirtePath
}
