var str = "你好  这是一段测试代码";
var strArray = str.split("");
for (var i = 0; i < strArray.length; i++) {
  var char = strArray[i];
  input(char);
  sleep(random(300, 500));
}
