// 性别校验规则
function validatorSex(val) {
  let sex = false
  switch (val) {
    case '男':
      sex = true
      break;
    case '女':
      sex = true
      break;
  }
  return sex
}

// 年龄校验规则
function validatorAge(val) {
  var pattern = /[1-9]\d*/;
  let isTrue = pattern.test(val)
  return isTrue
}
// 年龄校验规则
function validatorAgeNumber(val) {
  if (val > 100) {
    return false
  } else {
    return true
  }
}

// 身份证校验规则
function validatorIdCard(val) {
  var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(val)
}


// 联系电话校验规则
function validatorPhone(val) {
  var pattern = /0?(13|14|15|18)[0-9]{9}/
  return pattern.test(val)
}


module.exports = {
  validatorSex: validatorSex,
  validatorAge: validatorAge,
  validatorAgeNumber: validatorAgeNumber,
  validatorIdCard: validatorIdCard,
  validatorPhone: validatorPhone,
}
