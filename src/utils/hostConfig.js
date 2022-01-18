
const hostList = {
    'host' : 'http://8.140.136.205:8080/',  // 代理
    'proveHost': 'http://8.140.136.205:7011/', //证明办理环境
    'questHost': 'http://8.140.136.205:8999/', // 问卷接口地址
    'questWirtePath': 'http://8.140.136.205:8888/'  // 问卷填写地址
}

module.exports = {
	host: hostList.host,
  proveHost: hostList.proveHost,
  questHost: hostList.questHost,
  questWirtePath: hostList.questWirtePath
}
