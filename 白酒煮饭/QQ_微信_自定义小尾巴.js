"ui";
ui.layout(
  <vertical padding="16">
    //居中标题
    <text w="*" textClor="#fftthh" gravity="center" textSize="20sp">
      QQ_微信·小尾巴
    </text>
    //进度条
    <progressbar
      indeterminate="true"
      style="@style/Base.Widget.AppCompat.ProgressBar.Horizontal"
    />
    //小标题
    <text textSize="16sp" textColor="#993366">
      选择结束标识:
    </text>
    <horizontal>
      //下拉框
      <spinner id="sp1" entries="两个换行|两个空格|(英)！！|(英)？？|自定义:" />
    </horizontal>
    //自定义编辑框
    <input id="zdybs" w="*" maxLength="2" hint="请输入两个自定义标识符！" />
    //进度条
    <progressbar
      indeterminate="true"
      style="@style/Base.Widget.AppCompat.ProgressBar.Horizontal"
    />
    //小标题
    <text textSize="16sp" textColor="#993366">
      选择小尾巴内容:
    </text>
    //复选框
    <checkbox id="nlxx" checked="true" text="农历日期" />
    <checkbox id="sjxx" checked="true" text="时间信息" />
    <checkbox id="dlxx" checked="true" text="电量信息" />
    <checkbox id="zdyxx" text="自定义:" />
    //自定义编辑框
    <input id="zdy" w="*" hint="请输入自定义小尾巴内容！" />
    //进度条
    <progressbar
      indeterminate="true"
      style="@style/Base.Widget.AppCompat.ProgressBar.Horizontal"
    />
    //确定按钮
    <button id="qr" text="确  定" w="*" />
  </vertical>,
);

//自定义标识被点击事件
ui.zdybs.click(() => {
  //设置下拉框选项4
  ui.sp1.setSelection(4);
});

function uitc() {
  //关闭ui
  ui.finish();
}

//确认按钮被点击事件
ui.qr.click(() => {
  threads.shutDownAll();
  sleep(500);
  threads.start(function () {
    //console.show()
    //小尾巴内容定义
    var xwb = "\n\n";
    var gdbs;

    if (ui.sp1.getSelectedItemPosition() == 0) {
      log("标识符:两个换行");
      gdbs = "\n\n";
    } else if (ui.sp1.getSelectedItemPosition() == 1) {
      log("标识符:两个空格");
      gdbs = "  ";
    } else if (ui.sp1.getSelectedItemPosition() == 2) {
      log("标识符:(英)！！");
      gdbs = "!!";
    } else if (ui.sp1.getSelectedItemPosition() == 3) {
      log("标识符:(英)？？");
      gdbs = "??";
    } else if (ui.sp1.getSelectedItemPosition() == 4) {
      log("标识符:自定义\n标识符为:" + ui.zdybs.getText());
      gdbs = ui.zdybs.getText();
    }
    if (ui.nlxx.isChecked()) {
      log("选择了:农历");
      xwb = xwb + 农历(new Date()) + "\n";
    }
    if (ui.sjxx.isChecked()) {
      log("选择了:时间");
      xwb = xwb + new Date().toTimeString().substr(0, 8) + "\n";
    }
    if (ui.dlxx.isChecked()) {
      log("选择了:电量");
      xwb = xwb + "🔋" + device.getBattery() + "%";
    }
    if (ui.zdyxx.isChecked()) {
      log("选择了:自定义\n自定义内容为:" + ui.zdy.getText());
      xwb = xwb + "\n" + ui.zdy.getText();
    }
    home();

    //更新内容： 支持部分Emoji小表情。

    //默认结束标志为 两个换行符，即连续输入两次回车键。
    //最近修改时间：2018年2月27日 13:00
    //请在手机QQ中：设置→辅助功能→回车键发送消息  设置为关闭。
    var QQ结束标志 = gdbs;
    var 微信结束标志 = gdbs;
    //默认 连续输入两次回车键  发送消息。
    var QQ文本框id = "input";
    var 微信文本框id = "aab";
    log("循环外");
    while (true) {
      log("循环内");
      sleep(300);
      var 当前活动 = currentActivity();
      switch (true) {
        case 当前活动 == "com.tencent.mobileqq.activity.SplashActivity" ||
          当前活动 == "com.tencent.mobileqq.activity.ChatActivity":
          if (id(QQ文本框id).editable(true).textEndsWith(QQ结束标志).exists()) {
            var QQ文本框内容 = id(QQ文本框id).editable(true).findOne().text();
            QQ文本框内容 = QQ文本框内容.substr(0, QQ文本框内容.length - 2);
            if (/表情\//.test(QQ文本框内容)) {
              QQ文本框内容 = 表情1查找(QQ文本框内容);
            }
            if (/\[.{1,3}\]/.test(QQ文本框内容)) {
              QQ文本框内容 = 表情3查找(QQ文本框内容);
            }
            if (/ /.test(QQ文本框内容)) {
              QQ文本框内容 = 表情2查找(QQ文本框内容);
            }
            var date = new Date();
            var month = "0" + (date.getMonth() + 1);
            month = month.substring(month.length - 2);
            var day = "0" + date.getDate();
            day = day.substring(day.length - 2);
            var time = date.toTimeString().substr(0, 8);
            time = month + "月" + day + "日 " + time;
            var 充电状态 = "🔋";
            if (device.isCharging()) {
              充电状态 = "⚡";
            }
            var QQ小尾巴 = xwb;
            //"\n                       ————小七\n" + time + "  " + 充电状态 + device.getBattery() + "%";
            // 在上一行修改 QQ小尾巴内容。
            setText(QQ文本框内容 + QQ小尾巴);

            while (!click("发送")) {
              sleep(100);
            }
          }
          break;

        case 当前活动 == "com.tencent.mm.ui.chatting.ChattingUI" ||
          当前活动 == "com.tencent.mm.ui.LauncherUI":
          if (
            id(微信文本框id).editable(true).textEndsWith(微信结束标志).exists()
          ) {
            var 充电状态 = "🔋";
            if (device.isCharging()) {
              充电状态 = "⚡";
            }
            var 微信小尾巴 = xwb;
            //"小七 " + new Date().toTimeString().substr(0, 8) + "﹏﹏" + 充电状态 + device.getBattery() + "%";
            // 在上一行修改 微信小尾巴内容。
            input(微信小尾巴);
            while (!click("发送")) {
              sleep(100);
            }
          }
          break;

        default:
          sleep(700);
          break;
      }
    }
  });
});

function 表情1替换(表情名称) {
  var 表情代码 =
    "(+	j# ! \nQR%2*S\"1T'NUVW.X,Y0Z)$[3¤«¥¦¡§ª¬­¨¯<=\\]£B:9J;PFM>DKL-45678?IHA^@&/_G`abcdOefghilmnptuvwx{´¸°±¶³¹ º»¼½¾¿ÀÁÂÃÄÅÆÇÈ";
  var 表情名 = [
    "/微笑",
    "/撇嘴",
    "/色",
    "/发呆",
    "/得意",
    "/流泪",
    "/害羞",
    "/闭嘴",
    "/睡",
    "/尴尬",
    "/发怒",
    "/调皮",
    "/呲牙",
    "/惊讶",
    "/难过",
    "/酷",
    "/冷汗",
    "/抓狂",
    "/吐",
    "/偷笑",
    "/可爱",
    "/白眼",
    "/傲慢",
    "/饥饿",
    "/困",
    "/惊恐",
    "/流汗",
    "/憨笑",
    "/悠闲",
    "/奋斗",
    "/咒骂",
    "/疑问",
    "/嘘...",
    "/晕",
    "/折磨",
    "/衰",
    "/骷髅",
    "/敲打",
    "/再见",
    "/擦汗",
    "/抠鼻",
    "/鼓掌",
    "/糗大了",
    "/坏笑",
    "/左哼哼",
    "/右哼哼",
    "/哈欠",
    "/鄙视",
    "/委屈",
    "/快哭了",
    "/阴险",
    "/亲亲",
    "/吓",
    "/可怜",
    "/眨眼睛",
    "/doge",
    "/泪奔",
    "/无奈",
    "/托腮",
    "/卖萌",
    "/斜眼笑",
    "/惊喜",
    "/骚扰",
    "/小纠结",
    "/我最美",
    "/菜刀",
    "/西瓜",
    "/啤酒",
    "/篮球",
    "/乒乓",
    "/茶",
    "/咖啡",
    "/饭",
    "/猪头",
    "/玫瑰",
    "/凋谢",
    "/示爱",
    "/爱心",
    "/心碎",
    "/蛋糕",
    "/闪电",
    "/炸弹",
    "/刀",
    "/足球",
    "/瓢虫",
    "/便便",
    "/月亮",
    "/太阳",
    "/礼物",
    "/拥抱",
    "/赞",
    "/踩",
    "/握手",
    "/胜利",
    "/抱拳",
    "/勾引",
    "/拳头",
    "/差劲",
    "/爱你",
    "/NO",
    "/OK",
    "/爱情",
    "/飞吻",
    "/跳跳",
    "/发抖",
    "/怄火",
    "/转圈",
    "/磕头",
    "/回头",
    "/跳绳",
    "/挥手",
    "/激动",
    "/街舞",
    "/献吻",
    "/左太极",
    "/右太极",
    "/双喜",
    "/鞭炮",
    "/灯笼",
    "/K歌",
    "/喝彩",
    "/祈祷",
    "/爆筋",
    "/棒棒糖",
    "/喝奶",
    "/飞机",
    "/钞票",
    "/药",
    "/手枪",
    "/蛋",
    "/红包",
    "/河蟹",
    "/羊驼",
    "/菊花",
    "/幽灵",
    "/大笑",
    "/不开心",
    "/冷漠",
    "/呃",
    "/好棒",
    "/拜托",
    "/点赞",
    "/无聊",
    "/托脸",
    "/吃",
    "/送花",
    "/害怕",
    "/花痴",
    "/小样儿",
    "/飙泪",
    "/我不看",
    "/啵啵",
    "/糊脸",
    "/拍头",
    "/扯一扯",
    "/舔一舔",
    "/蹭一蹭",
    "/拽炸天",
    "/顶呱呱",
    "/抱抱",
    "/暴击",
    "/开枪",
    "/撩一撩",
    "/拍桌",
    "/拍手",
    "/恭喜",
  ];
  var a = 表情名.indexOf(表情名称);
  switch (a) {
    case -1:
      return false;
      break;

    default:
      return 表情代码.substr(2 * a, 2);
  }
}

function 表情1查找(文本内容) {
  var 表情 = "";
  var 检索符号 = ["表情/", "/"];
  for (var n = 0; n < 2; n++) {
    var 文本内容分割 = 文本内容.split(检索符号[n]);
    if (文本内容分割.length > 1) {
      for (var i = 1; i < 文本内容分割.length; i++) {
        for (var s = 1; s <= 文本内容分割[i].length && s < 5; s++) {
          表情 = 表情1替换("/" + 文本内容分割[i].substr(0, s));
          if (表情) {
            文本内容分割[i] = 表情 + 文本内容分割[i].substr(s);
            break;
          }
        }
        if (!表情) {
          文本内容分割[i] = 检索符号[n] + 文本内容分割[i];
        }
        表情 = false;
      }
      文本内容 = 文本内容分割.join("");
    }
  }
  return 文本内容;
}

function 表情2替换(表情名) {
  var 表情名列表 = [
    "大哭",
    "嘿嘿",
    "吐舌",
    "呲牙",
    "淘气",
    "可爱",
    "媚眼",
    "花痴",
    "失落",
    "高兴",
    "哼哼",
    "不屑",
    "瞪眼",
    "飞吻",
    "大哭",
    "害怕",
    "激动",
    "拳头",
    "厉害",
    "向上",
    "鼓掌",
    "胜利",
    "鄙视",
    "合十",
    "好的",
    "向左",
    "向右",
    "向上",
    "向下",
    "眼睛",
    "鼻子",
    "嘴唇",
    "耳朵",
    "米饭",
    "意面",
    "拉面",
    "饭团",
    "刨冰",
    "寿司",
    "蛋糕",
    "起司",
    "汉堡",
    "煎蛋",
    "薯条",
    "啤酒",
    "干杯",
    "高脚杯",
    "咖啡",
    "苹果",
    "橙子",
    "草莓",
    "西瓜",
    "药丸",
    "吸烟",
    "圣诞树",
    "玫瑰",
    "庆祝",
    "椰子树",
    "礼物",
    "蝴蝶结",
    "气球",
    "海螺",
    "戒指",
    "炸弹",
    "皇冠",
    "铃铛",
    "星星",
    "闪光",
    "吹气",
    "水",
    "火",
    "奖杯",
    "钱",
    "睡觉",
    "闪电",
    "脚印",
    "便便",
    "打针",
    "热",
    "文件",
    "钥匙",
    "锁",
    "飞机",
    "列车",
    "汽车",
    "自行车",
    "骑马",
    "火箭",
    "公交",
    "船",
    "妈妈",
    "爸爸",
    "女孩",
    "男孩",
    "猴",
    "章鱼",
    "猪",
    "骷髅",
    "小鸡",
    "树懒",
    "牛",
    "公鸡",
    "青蛙",
    "幽灵",
    "虫",
    "鱼",
    "狗",
    "老虎",
    "天使",
    "企鹅",
    "海豚",
    "老鼠",
    "帽子",
    "连衣裙",
    "口红",
    "云朵",
    "晴天",
    "雨天",
    "月亮",
    "雪人",
    "正确",
    "错误",
    "问好",
    "叹号",
    "电话",
    "相机",
    "手机",
    "电脑",
    "摄影机",
    "话筒",
    "手枪",
    "光碟",
    "爱心",
    "扑克",
    "麻将",
  ];

  var 表情列表 = [
    "😭",
    "😊",
    "😝",
    "😁",
    "😜",
    "☺",
    "😉",
    "😍",
    "😔",
    "😄",
    "😏",
    "😒",
    "😳",
    "😘",
    "😭",
    "😱",
    "😂",
    "👊",
    "👍",
    "☝",
    "👏",
    "✌",
    "👎",
    "🙏",
    "👌",
    "👈",
    "👉",
    "👆",
    "👇",
    "👀",
    "👃",
    "👄",
    "👂",
    "🍚",
    "🍝",
    "🍜",
    "🍙",
    "🍧",
    "🍣",
    "🎂",
    "🍞",
    "🍔",
    "🍳",
    "🍟",
    "🍺",
    "🍻",
    "🍸",
    "☕",
    "🍎",
    "🍊",
    "🍓",
    "🍉",
    "💊",
    "🚬",
    "🎄",
    "🌹",
    "🎉",
    "🌴",
    "💝",
    "🎀",
    "🎈",
    "🐚",
    "💍",
    "💣",
    "👑",
    "🔔",
    "⭐",
    "✨",
    "💨",
    "💦",
    "🔥",
    "🏆",
    "💰",
    "💤",
    "⚡",
    "👣",
    "💩",
    "💉",
    "♨",
    "📫",
    "🔑",
    "🔒",
    "✈",
    "🚄",
    "🚗",
    "🚲",
    "🐎",
    "🚀",
    "🚌",
    "⛵",
    "👩",
    "👨",
    "👧",
    "👦",
    "🐵",
    "🐙",
    "🐷",
    "💀",
    "🐤",
    "🐨",
    "🐮",
    "🐔",
    "🐸",
    "👻",
    "🐛",
    "🐠",
    "🐶",
    "🐯",
    "👼",
    "🐧",
    "🐳",
    "🐭",
    "👒",
    "👗",
    "💄",
    "☁",
    "☀",
    "☔",
    "🌙",
    "⛄",
    "⭕",
    "❌",
    "❔",
    "❕",
    "☎",
    "📷",
    "📱",
    "💻",
    "🎥",
    "🎤",
    "🔫",
    "💿",
    "💓",
    "♣",
    "🀄",
  ];

  var 表情 = 表情名列表.indexOf(表情名);
  if (表情 != -1) {
    return 表情列表[表情];
  } else {
    return false;
  }
}

function 表情2查找(文本内容) {
  var 检索符号 = " ";
  var 文本内容分割 = 文本内容.split(检索符号);
  if (文本内容分割.length > 1) {
    for (var i = 0; i < 文本内容分割.length - 1; i++) {
      var 表情 = false;
      var s = 文本内容分割[i].length;
      var n = "";
      if (s > 0) {
        n = Math.min(s, 3) * -1;
        for (; n < 0; n++) {
          表情 = 表情2替换(文本内容分割[i].substr(n));
          if (表情) {
            文本内容分割[i] = 文本内容分割[i].substr(0, s + n) + 表情;
            break;
          }
        }
      }
      if (!表情) {
        文本内容分割[i] += 检索符号;
      }
    }
    文本内容 = 文本内容分割.join("");
  }
  return 文本内容;
}

function 表情3替换(表情名) {
  var 表情名列表 = [
    "\[拜拜\]",
    "\[鄙视\]",
    "\[菜刀\]",
    "\[沧桑\]",
    "\[馋了\]",
    "\[吃惊\]",
    "\[微笑\]",
    "\[得意\]",
    "\[嘚瑟\]",
    "\[瞪眼\]",
    "\[震惊\]",
    "\[鼓掌\]",
    "\[害羞\]",
    "\[好的\]",
    "\[惊呆了\]",
    "\[静静看\]",
    "\[可爱\]",
    "\[困\]",
    "\[脸红\]",
    "\[你懂的\]",
    "\[期待\]",
    "\[亲亲\]",
    "\[伤心\]",
    "\[生气\]",
    "\[摇摆\]",
    "\[帅\]",
    "\[思考\]",
    "\[震惊哭\]",
    "\[痛心\]",
    "\[偷笑\]",
    "\[挖鼻孔\]",
    "\[抓狂\]",
    "\[笑着哭\]",
    "\[无语\]",
    "\[捂脸\]",
    "\[喜欢\]",
    "\[笑哭\]",
    "\[疑惑\]",
    "\[赞\]",
    "\[眨眼\]",
  ];
  var 表情列表 = "ÿ ÿ ÿ ÿ ÿ ÿ ÿ ÿ ÿ	 ÿú ÿ ÿ ÿþ ÿ ÿ ÿ ÿ ÿ ÿ ÿ ÿ ÿ ÿ ÿ ÿ ÿ ÿ ÿ ÿ ÿ ÿ ÿ  ÿ! ÿ\" ÿ# ÿ$ ÿ% ÿ& ÿ' ÿ( ";
  表情名 = 表情名列表.indexOf(表情名);
  if (表情名 < 0) {
    return false;
  } else {
    return 表情列表.substr(5 * 表情名, 5);
  }
}

function 表情3查找(文本内容) {
  var 表情 = false;
  var 检索符号 = "\[";
  var 文本内容分割 = 文本内容.split(检索符号);
  if (文本内容分割.length > 1) {
    for (var i = 1; i < 文本内容分割.length; i++) {
      var s = 文本内容分割[i].search("\]");
      if (s < 4 && s > 0) {
        表情 = 表情3替换("\[" + 文本内容分割[i].substr(0, s + 1));
        if (表情) {
          文本内容分割[i] = 表情 + 文本内容分割[i].substr(s + 1);
        } else {
          文本内容分割[i] = 检索符号 + 文本内容分割[i];
        }
      } else {
        文本内容分割[i] = 检索符号 + 文本内容分割[i];
      }
    }
    文本内容 = 文本内容分割.join("");
  }
  return 文本内容;
}

function 农历(date) {
  var 农历 = "";
  if (date < new Date(2018, 0, 1) || date > new Date(2020, 0, 25)) {
    农历 = false;
  } else {
    var 农历列表 = [
      "(鸡)十一月十五",
      "(鸡)十一月十六",
      "(鸡)十一月十七",
      "(鸡)十一月十八",
      "(鸡)十一月十九",
      "(鸡)十一月二十",
      "(鸡)十一月廿一",
      "(鸡)十一月廿二",
      "(鸡)十一月廿三",
      "(鸡)十一月廿四",
      "(鸡)十一月廿五",
      "(鸡)十一月廿六",
      "(鸡)十一月廿七",
      "(鸡)十一月廿八",
      "(鸡)十一月廿九",
      "(鸡)十一月三十",
      "(鸡)腊月初一",
      "(鸡)腊月初二",
      "(鸡)腊月初三",
      "(鸡)腊月初四",
      "(鸡)腊月初五",
      "(鸡)腊月初六",
      "(鸡)腊月初七",
      "(鸡)腊月初八",
      "(鸡)腊月初九",
      "(鸡)腊月初十",
      "(鸡)腊月十一",
      "(鸡)腊月十二",
      "(鸡)腊月十三",
      "(鸡)腊月十四",
      "(鸡)腊月十五",
      "(鸡)腊月十六",
      "(鸡)腊月十七",
      "(鸡)腊月十八",
      "(鸡)腊月十九",
      "(鸡)腊月二十",
      "(鸡)腊月廿一",
      "(鸡)腊月廿二",
      "(鸡)腊月廿三",
      "(鸡)腊月廿四",
      "(鸡)腊月廿五",
      "(鸡)腊月廿六",
      "(鸡)腊月廿七",
      "(鸡)腊月廿八",
      "(鸡)腊月廿九",
      "(鸡)腊月三十",
      "(狗)正月初一",
      "(狗)正月初二",
      "(狗)正月初三",
      "(狗)正月初四",
      "(狗)正月初五",
      "(狗)正月初六",
      "(狗)正月初七",
      "(狗)正月初八",
      "(狗)正月初九",
      "(狗)正月初十",
      "(狗)正月十一",
      "(狗)正月十二",
      "(狗)正月十三",
      "(狗)正月十四",
      "(狗)正月十五",
      "(狗)正月十六",
      "(狗)正月十七",
      "(狗)正月十八",
      "(狗)正月十九",
      "(狗)正月二十",
      "(狗)正月廿一",
      "(狗)正月廿二",
      "(狗)正月廿三",
      "(狗)正月廿四",
      "(狗)正月廿五",
      "(狗)正月廿六",
      "(狗)正月廿七",
      "(狗)正月廿八",
      "(狗)正月廿九",
      "(狗)二月初一",
      "(狗)二月初二",
      "(狗)二月初三",
      "(狗)二月初四",
      "(狗)二月初五",
      "(狗)二月初六",
      "(狗)二月初七",
      "(狗)二月初八",
      "(狗)二月初九",
      "(狗)二月初十",
      "(狗)二月十一",
      "(狗)二月十二",
      "(狗)二月十三",
      "(狗)二月十四",
      "(狗)二月十五",
      "(狗)二月十六",
      "(狗)二月十七",
      "(狗)二月十八",
      "(狗)二月十九",
      "(狗)二月二十",
      "(狗)二月廿一",
      "(狗)二月廿二",
      "(狗)二月廿三",
      "(狗)二月廿四",
      "(狗)二月廿五",
      "(狗)二月廿六",
      "(狗)二月廿七",
      "(狗)二月廿八",
      "(狗)二月廿九",
      "(狗)二月三十",
      "(狗)三月初一",
      "(狗)三月初二",
      "(狗)三月初三",
      "(狗)三月初四",
      "(狗)三月初五",
      "(狗)三月初六",
      "(狗)三月初七",
      "(狗)三月初八",
      "(狗)三月初九",
      "(狗)三月初十",
      "(狗)三月十一",
      "(狗)三月十二",
      "(狗)三月十三",
      "(狗)三月十四",
      "(狗)三月十五",
      "(狗)三月十六",
      "(狗)三月十七",
      "(狗)三月十八",
      "(狗)三月十九",
      "(狗)三月二十",
      "(狗)三月廿一",
      "(狗)三月廿二",
      "(狗)三月廿三",
      "(狗)三月廿四",
      "(狗)三月廿五",
      "(狗)三月廿六",
      "(狗)三月廿七",
      "(狗)三月廿八",
      "(狗)三月廿九",
      "(狗)四月初一",
      "(狗)四月初二",
      "(狗)四月初三",
      "(狗)四月初四",
      "(狗)四月初五",
      "(狗)四月初六",
      "(狗)四月初七",
      "(狗)四月初八",
      "(狗)四月初九",
      "(狗)四月初十",
      "(狗)四月十一",
      "(狗)四月十二",
      "(狗)四月十三",
      "(狗)四月十四",
      "(狗)四月十五",
      "(狗)四月十六",
      "(狗)四月十七",
      "(狗)四月十八",
      "(狗)四月十九",
      "(狗)四月二十",
      "(狗)四月廿一",
      "(狗)四月廿二",
      "(狗)四月廿三",
      "(狗)四月廿四",
      "(狗)四月廿五",
      "(狗)四月廿六",
      "(狗)四月廿七",
      "(狗)四月廿八",
      "(狗)四月廿九",
      "(狗)四月三十",
      "(狗)五月初一",
      "(狗)五月初二",
      "(狗)五月初三",
      "(狗)五月初四",
      "(狗)五月初五",
      "(狗)五月初六",
      "(狗)五月初七",
      "(狗)五月初八",
      "(狗)五月初九",
      "(狗)五月初十",
      "(狗)五月十一",
      "(狗)五月十二",
      "(狗)五月十三",
      "(狗)五月十四",
      "(狗)五月十五",
      "(狗)五月十六",
      "(狗)五月十七",
      "(狗)五月十八",
      "(狗)五月十九",
      "(狗)五月二十",
      "(狗)五月廿一",
      "(狗)五月廿二",
      "(狗)五月廿三",
      "(狗)五月廿四",
      "(狗)五月廿五",
      "(狗)五月廿六",
      "(狗)五月廿七",
      "(狗)五月廿八",
      "(狗)五月廿九",
      "(狗)六月初一",
      "(狗)六月初二",
      "(狗)六月初三",
      "(狗)六月初四",
      "(狗)六月初五",
      "(狗)六月初六",
      "(狗)六月初七",
      "(狗)六月初八",
      "(狗)六月初九",
      "(狗)六月初十",
      "(狗)六月十一",
      "(狗)六月十二",
      "(狗)六月十三",
      "(狗)六月十四",
      "(狗)六月十五",
      "(狗)六月十六",
      "(狗)六月十七",
      "(狗)六月十八",
      "(狗)六月十九",
      "(狗)六月二十",
      "(狗)六月廿一",
      "(狗)六月廿二",
      "(狗)六月廿三",
      "(狗)六月廿四",
      "(狗)六月廿五",
      "(狗)六月廿六",
      "(狗)六月廿七",
      "(狗)六月廿八",
      "(狗)六月廿九",
      "(狗)七月初一",
      "(狗)七月初二",
      "(狗)七月初三",
      "(狗)七月初四",
      "(狗)七月初五",
      "(狗)七月初六",
      "(狗)七月初七",
      "(狗)七月初八",
      "(狗)七月初九",
      "(狗)七月初十",
      "(狗)七月十一",
      "(狗)七月十二",
      "(狗)七月十三",
      "(狗)七月十四",
      "(狗)七月十五",
      "(狗)七月十六",
      "(狗)七月十七",
      "(狗)七月十八",
      "(狗)七月十九",
      "(狗)七月二十",
      "(狗)七月廿一",
      "(狗)七月廿二",
      "(狗)七月廿三",
      "(狗)七月廿四",
      "(狗)七月廿五",
      "(狗)七月廿六",
      "(狗)七月廿七",
      "(狗)七月廿八",
      "(狗)七月廿九",
      "(狗)七月三十",
      "(狗)八月初一",
      "(狗)八月初二",
      "(狗)八月初三",
      "(狗)八月初四",
      "(狗)八月初五",
      "(狗)八月初六",
      "(狗)八月初七",
      "(狗)八月初八",
      "(狗)八月初九",
      "(狗)八月初十",
      "(狗)八月十一",
      "(狗)八月十二",
      "(狗)八月十三",
      "(狗)八月十四",
      "(狗)八月十五",
      "(狗)八月十六",
      "(狗)八月十七",
      "(狗)八月十八",
      "(狗)八月十九",
      "(狗)八月二十",
      "(狗)八月廿一",
      "(狗)八月廿二",
      "(狗)八月廿三",
      "(狗)八月廿四",
      "(狗)八月廿五",
      "(狗)八月廿六",
      "(狗)八月廿七",
      "(狗)八月廿八",
      "(狗)八月廿九",
      "(狗)九月初一",
      "(狗)九月初二",
      "(狗)九月初三",
      "(狗)九月初四",
      "(狗)九月初五",
      "(狗)九月初六",
      "(狗)九月初七",
      "(狗)九月初八",
      "(狗)九月初九",
      "(狗)九月初十",
      "(狗)九月十一",
      "(狗)九月十二",
      "(狗)九月十三",
      "(狗)九月十四",
      "(狗)九月十五",
      "(狗)九月十六",
      "(狗)九月十七",
      "(狗)九月十八",
      "(狗)九月十九",
      "(狗)九月二十",
      "(狗)九月廿一",
      "(狗)九月廿二",
      "(狗)九月廿三",
      "(狗)九月廿四",
      "(狗)九月廿五",
      "(狗)九月廿六",
      "(狗)九月廿七",
      "(狗)九月廿八",
      "(狗)九月廿九",
      "(狗)九月三十",
      "(狗)十月初一",
      "(狗)十月初二",
      "(狗)十月初三",
      "(狗)十月初四",
      "(狗)十月初五",
      "(狗)十月初六",
      "(狗)十月初七",
      "(狗)十月初八",
      "(狗)十月初九",
      "(狗)十月初十",
      "(狗)十月十一",
      "(狗)十月十二",
      "(狗)十月十三",
      "(狗)十月十四",
      "(狗)十月十五",
      "(狗)十月十六",
      "(狗)十月十七",
      "(狗)十月十八",
      "(狗)十月十九",
      "(狗)十月二十",
      "(狗)十月廿一",
      "(狗)十月廿二",
      "(狗)十月廿三",
      "(狗)十月廿四",
      "(狗)十月廿五",
      "(狗)十月廿六",
      "(狗)十月廿七",
      "(狗)十月廿八",
      "(狗)十月廿九",
      "(狗)十一月初一",
      "(狗)十一月初二",
      "(狗)十一月初三",
      "(狗)十一月初四",
      "(狗)十一月初五",
      "(狗)十一月初六",
      "(狗)十一月初七",
      "(狗)十一月初八",
      "(狗)十一月初九",
      "(狗)十一月初十",
      "(狗)十一月十一",
      "(狗)十一月十二",
      "(狗)十一月十三",
      "(狗)十一月十四",
      "(狗)十一月十五",
      "(狗)十一月十六",
      "(狗)十一月十七",
      "(狗)十一月十八",
      "(狗)十一月十九",
      "(狗)十一月二十",
      "(狗)十一月廿一",
      "(狗)十一月廿二",
      "(狗)十一月廿三",
      "(狗)十一月廿四",
      "(狗)十一月廿五",
      "(狗)十一月廿六",
      "(狗)十一月廿七",
      "(狗)十一月廿八",
      "(狗)十一月廿九",
      "(狗)十一月三十",
      "(狗)腊月初一",
      "(狗)腊月初二",
      "(狗)腊月初三",
      "(狗)腊月初四",
      "(狗)腊月初五",
      "(狗)腊月初六",
      "(狗)腊月初七",
      "(狗)腊月初八",
      "(狗)腊月初九",
      "(狗)腊月初十",
      "(狗)腊月十一",
      "(狗)腊月十二",
      "(狗)腊月十三",
      "(狗)腊月十四",
      "(狗)腊月十五",
      "(狗)腊月十六",
      "(狗)腊月十七",
      "(狗)腊月十八",
      "(狗)腊月十九",
      "(狗)腊月二十",
      "(狗)腊月廿一",
      "(狗)腊月廿二",
      "(狗)腊月廿三",
      "(狗)腊月廿四",
      "(狗)腊月廿五",
      "(狗)腊月廿六",
      "(狗)腊月廿七",
      "(狗)腊月廿八",
      "(狗)腊月廿九",
      "(狗)腊月三十",
      "(猪)正月初一",
      "(猪)正月初二",
      "(猪)正月初三",
      "(猪)正月初四",
      "(猪)正月初五",
      "(猪)正月初六",
      "(猪)正月初七",
      "(猪)正月初八",
      "(猪)正月初九",
      "(猪)正月初十",
      "(猪)正月十一",
      "(猪)正月十二",
      "(猪)正月十三",
      "(猪)正月十四",
      "(猪)正月十五",
      "(猪)正月十六",
      "(猪)正月十七",
      "(猪)正月十八",
      "(猪)正月十九",
      "(猪)正月二十",
      "(猪)正月廿一",
      "(猪)正月廿二",
      "(猪)正月廿三",
      "(猪)正月廿四",
      "(猪)正月廿五",
      "(猪)正月廿六",
      "(猪)正月廿七",
      "(猪)正月廿八",
      "(猪)正月廿九",
      "(猪)正月三十",
      "(猪)二月初一",
      "(猪)二月初二",
      "(猪)二月初三",
      "(猪)二月初四",
      "(猪)二月初五",
      "(猪)二月初六",
      "(猪)二月初七",
      "(猪)二月初八",
      "(猪)二月初九",
      "(猪)二月初十",
      "(猪)二月十一",
      "(猪)二月十二",
      "(猪)二月十三",
      "(猪)二月十四",
      "(猪)二月十五",
      "(猪)二月十六",
      "(猪)二月十七",
      "(猪)二月十八",
      "(猪)二月十九",
      "(猪)二月二十",
      "(猪)二月廿一",
      "(猪)二月廿二",
      "(猪)二月廿三",
      "(猪)二月廿四",
      "(猪)二月廿五",
      "(猪)二月廿六",
      "(猪)二月廿七",
      "(猪)二月廿八",
      "(猪)二月廿九",
      "(猪)三月初一",
      "(猪)三月初二",
      "(猪)三月初三",
      "(猪)三月初四",
      "(猪)三月初五",
      "(猪)三月初六",
      "(猪)三月初七",
      "(猪)三月初八",
      "(猪)三月初九",
      "(猪)三月初十",
      "(猪)三月十一",
      "(猪)三月十二",
      "(猪)三月十三",
      "(猪)三月十四",
      "(猪)三月十五",
      "(猪)三月十六",
      "(猪)三月十七",
      "(猪)三月十八",
      "(猪)三月十九",
      "(猪)三月二十",
      "(猪)三月廿一",
      "(猪)三月廿二",
      "(猪)三月廿三",
      "(猪)三月廿四",
      "(猪)三月廿五",
      "(猪)三月廿六",
      "(猪)三月廿七",
      "(猪)三月廿八",
      "(猪)三月廿九",
      "(猪)三月三十",
      "(猪)四月初一",
      "(猪)四月初二",
      "(猪)四月初三",
      "(猪)四月初四",
      "(猪)四月初五",
      "(猪)四月初六",
      "(猪)四月初七",
      "(猪)四月初八",
      "(猪)四月初九",
      "(猪)四月初十",
      "(猪)四月十一",
      "(猪)四月十二",
      "(猪)四月十三",
      "(猪)四月十四",
      "(猪)四月十五",
      "(猪)四月十六",
      "(猪)四月十七",
      "(猪)四月十八",
      "(猪)四月十九",
      "(猪)四月二十",
      "(猪)四月廿一",
      "(猪)四月廿二",
      "(猪)四月廿三",
      "(猪)四月廿四",
      "(猪)四月廿五",
      "(猪)四月廿六",
      "(猪)四月廿七",
      "(猪)四月廿八",
      "(猪)四月廿九",
      "(猪)五月初一",
      "(猪)五月初二",
      "(猪)五月初三",
      "(猪)五月初四",
      "(猪)五月初五",
      "(猪)五月初六",
      "(猪)五月初七",
      "(猪)五月初八",
      "(猪)五月初九",
      "(猪)五月初十",
      "(猪)五月十一",
      "(猪)五月十二",
      "(猪)五月十三",
      "(猪)五月十四",
      "(猪)五月十五",
      "(猪)五月十六",
      "(猪)五月十七",
      "(猪)五月十八",
      "(猪)五月十九",
      "(猪)五月二十",
      "(猪)五月廿一",
      "(猪)五月廿二",
      "(猪)五月廿三",
      "(猪)五月廿四",
      "(猪)五月廿五",
      "(猪)五月廿六",
      "(猪)五月廿七",
      "(猪)五月廿八",
      "(猪)五月廿九",
      "(猪)五月三十",
      "(猪)六月初一",
      "(猪)六月初二",
      "(猪)六月初三",
      "(猪)六月初四",
      "(猪)六月初五",
      "(猪)六月初六",
      "(猪)六月初七",
      "(猪)六月初八",
      "(猪)六月初九",
      "(猪)六月初十",
      "(猪)六月十一",
      "(猪)六月十二",
      "(猪)六月十三",
      "(猪)六月十四",
      "(猪)六月十五",
      "(猪)六月十六",
      "(猪)六月十七",
      "(猪)六月十八",
      "(猪)六月十九",
      "(猪)六月二十",
      "(猪)六月廿一",
      "(猪)六月廿二",
      "(猪)六月廿三",
      "(猪)六月廿四",
      "(猪)六月廿五",
      "(猪)六月廿六",
      "(猪)六月廿七",
      "(猪)六月廿八",
      "(猪)六月廿九",
      "(猪)七月初一",
      "(猪)七月初二",
      "(猪)七月初三",
      "(猪)七月初四",
      "(猪)七月初五",
      "(猪)七月初六",
      "(猪)七月初七",
      "(猪)七月初八",
      "(猪)七月初九",
      "(猪)七月初十",
      "(猪)七月十一",
      "(猪)七月十二",
      "(猪)七月十三",
      "(猪)七月十四",
      "(猪)七月十五",
      "(猪)七月十六",
      "(猪)七月十七",
      "(猪)七月十八",
      "(猪)七月十九",
      "(猪)七月二十",
      "(猪)七月廿一",
      "(猪)七月廿二",
      "(猪)七月廿三",
      "(猪)七月廿四",
      "(猪)七月廿五",
      "(猪)七月廿六",
      "(猪)七月廿七",
      "(猪)七月廿八",
      "(猪)七月廿九",
      "(猪)八月初一",
      "(猪)八月初二",
      "(猪)八月初三",
      "(猪)八月初四",
      "(猪)八月初五",
      "(猪)八月初六",
      "(猪)八月初七",
      "(猪)八月初八",
      "(猪)八月初九",
      "(猪)八月初十",
      "(猪)八月十一",
      "(猪)八月十二",
      "(猪)八月十三",
      "(猪)八月十四",
      "(猪)八月十五",
      "(猪)八月十六",
      "(猪)八月十七",
      "(猪)八月十八",
      "(猪)八月十九",
      "(猪)八月二十",
      "(猪)八月廿一",
      "(猪)八月廿二",
      "(猪)八月廿三",
      "(猪)八月廿四",
      "(猪)八月廿五",
      "(猪)八月廿六",
      "(猪)八月廿七",
      "(猪)八月廿八",
      "(猪)八月廿九",
      "(猪)八月三十",
      "(猪)九月初一",
      "(猪)九月初二",
      "(猪)九月初三",
      "(猪)九月初四",
      "(猪)九月初五",
      "(猪)九月初六",
      "(猪)九月初七",
      "(猪)九月初八",
      "(猪)九月初九",
      "(猪)九月初十",
      "(猪)九月十一",
      "(猪)九月十二",
      "(猪)九月十三",
      "(猪)九月十四",
      "(猪)九月十五",
      "(猪)九月十六",
      "(猪)九月十七",
      "(猪)九月十八",
      "(猪)九月十九",
      "(猪)九月二十",
      "(猪)九月廿一",
      "(猪)九月廿二",
      "(猪)九月廿三",
      "(猪)九月廿四",
      "(猪)九月廿五",
      "(猪)九月廿六",
      "(猪)九月廿七",
      "(猪)九月廿八",
      "(猪)九月廿九",
      "(猪)十月初一",
      "(猪)十月初二",
      "(猪)十月初三",
      "(猪)十月初四",
      "(猪)十月初五",
      "(猪)十月初六",
      "(猪)十月初七",
      "(猪)十月初八",
      "(猪)十月初九",
      "(猪)十月初十",
      "(猪)十月十一",
      "(猪)十月十二",
      "(猪)十月十三",
      "(猪)十月十四",
      "(猪)十月十五",
      "(猪)十月十六",
      "(猪)十月十七",
      "(猪)十月十八",
      "(猪)十月十九",
      "(猪)十月二十",
      "(猪)十月廿一",
      "(猪)十月廿二",
      "(猪)十月廿三",
      "(猪)十月廿四",
      "(猪)十月廿五",
      "(猪)十月廿六",
      "(猪)十月廿七",
      "(猪)十月廿八",
      "(猪)十月廿九",
      "(猪)十一月初一",
      "(猪)十一月初二",
      "(猪)十一月初三",
      "(猪)十一月初四",
      "(猪)十一月初五",
      "(猪)十一月初六",
      "(猪)十一月初七",
      "(猪)十一月初八",
      "(猪)十一月初九",
      "(猪)十一月初十",
      "(猪)十一月十一",
      "(猪)十一月十二",
      "(猪)十一月十三",
      "(猪)十一月十四",
      "(猪)十一月十五",
      "(猪)十一月十六",
      "(猪)十一月十七",
      "(猪)十一月十八",
      "(猪)十一月十九",
      "(猪)十一月二十",
      "(猪)十一月廿一",
      "(猪)十一月廿二",
      "(猪)十一月廿三",
      "(猪)十一月廿四",
      "(猪)十一月廿五",
      "(猪)十一月廿六",
      "(猪)十一月廿七",
      "(猪)十一月廿八",
      "(猪)十一月廿九",
      "(猪)十一月三十",
      "(猪)腊月初一",
      "(猪)腊月初二",
      "(猪)腊月初三",
      "(猪)腊月初四",
      "(猪)腊月初五",
      "(猪)腊月初六",
      "(猪)腊月初七",
      "(猪)腊月初八",
      "(猪)腊月初九",
      "(猪)腊月初十",
      "(猪)腊月十一",
      "(猪)腊月十二",
      "(猪)腊月十三",
      "(猪)腊月十四",
      "(猪)腊月十五",
      "(猪)腊月十六",
      "(猪)腊月十七",
      "(猪)腊月十八",
      "(猪)腊月十九",
      "(猪)腊月二十",
      "(猪)腊月廿一",
      "(猪)腊月廿二",
      "(猪)腊月廿三",
      "(猪)腊月廿四",
      "(猪)腊月廿五",
      "(猪)腊月廿六",
      "(猪)腊月廿七",
      "(猪)腊月廿八",
      "(猪)腊月廿九",
      "(猪)腊月三十",
      "(鼠)正月初一",
    ];
    var 公历列表 =
      "20180101,,20180102,,20180103,,20180104,,20180105,,20180106,,20180107,,20180108,,20180109,,20180110,,20180111,,20180112,,20180113,,20180114,,20180115,,20180116,,20180117,,20180118,,20180119,,20180120,,20180121,,20180122,,20180123,,20180124,,20180125,,20180126,,20180127,,20180128,,20180129,,20180130,,20180131,,20180201,,20180202,,20180203,,20180204,,20180205,,20180206,,20180207,,20180208,,20180209,,20180210,,20180211,,20180212,,20180213,,20180214,,20180215,,20180216,,20180217,,20180218,,20180219,,20180220,,20180221,,20180222,,20180223,,20180224,,20180225,,20180226,,20180227,,20180228,,20180301,,20180302,,20180303,,20180304,,20180305,,20180306,,20180307,,20180308,,20180309,,20180310,,20180311,,20180312,,20180313,,20180314,,20180315,,20180316,,20180317,,20180318,,20180319,,20180320,,20180321,,20180322,,20180323,,20180324,,20180325,,20180326,,20180327,,20180328,,20180329,,20180330,,20180331,,20180401,,20180402,,20180403,,20180404,,20180405,,20180406,,20180407,,20180408,,20180409,,20180410,,20180411,,20180412,,20180413,,20180414,,20180415,,20180416,,20180417,,20180418,,20180419,,20180420,,20180421,,20180422,,20180423,,20180424,,20180425,,20180426,,20180427,,20180428,,20180429,,20180430,,20180501,,20180502,,20180503,,20180504,,20180505,,20180506,,20180507,,20180508,,20180509,,20180510,,20180511,,20180512,,20180513,,20180514,,20180515,,20180516,,20180517,,20180518,,20180519,,20180520,,20180521,,20180522,,20180523,,20180524,,20180525,,20180526,,20180527,,20180528,,20180529,,20180530,,20180531,,20180601,,20180602,,20180603,,20180604,,20180605,,20180606,,20180607,,20180608,,20180609,,20180610,,20180611,,20180612,,20180613,,20180614,,20180615,,20180616,,20180617,,20180618,,20180619,,20180620,,20180621,,20180622,,20180623,,20180624,,20180625,,20180626,,20180627,,20180628,,20180629,,20180630,,20180701,,20180702,,20180703,,20180704,,20180705,,20180706,,20180707,,20180708,,20180709,,20180710,,20180711,,20180712,,20180713,,20180714,,20180715,,20180716,,20180717,,20180718,,20180719,,20180720,,20180721,,20180722,,20180723,,20180724,,20180725,,20180726,,20180727,,20180728,,20180729,,20180730,,20180731,,20180801,,20180802,,20180803,,20180804,,20180805,,20180806,,20180807,,20180808,,20180809,,20180810,,20180811,,20180812,,20180813,,20180814,,20180815,,20180816,,20180817,,20180818,,20180819,,20180820,,20180821,,20180822,,20180823,,20180824,,20180825,,20180826,,20180827,,20180828,,20180829,,20180830,,20180831,,20180901,,20180902,,20180903,,20180904,,20180905,,20180906,,20180907,,20180908,,20180909,,20180910,,20180911,,20180912,,20180913,,20180914,,20180915,,20180916,,20180917,,20180918,,20180919,,20180920,,20180921,,20180922,,20180923,,20180924,,20180925,,20180926,,20180927,,20180928,,20180929,,20180930,,20181001,,20181002,,20181003,,20181004,,20181005,,20181006,,20181007,,20181008,,20181009,,20181010,,20181011,,20181012,,20181013,,20181014,,20181015,,20181016,,20181017,,20181018,,20181019,,20181020,,20181021,,20181022,,20181023,,20181024,,20181025,,20181026,,20181027,,20181028,,20181029,,20181030,,20181031,,20181101,,20181102,,20181103,,20181104,,20181105,,20181106,,20181107,,20181108,,20181109,,20181110,,20181111,,20181112,,20181113,,20181114,,20181115,,20181116,,20181117,,20181118,,20181119,,20181120,,20181121,,20181122,,20181123,,20181124,,20181125,,20181126,,20181127,,20181128,,20181129,,20181130,,20181201,,20181202,,20181203,,20181204,,20181205,,20181206,,20181207,,20181208,,20181209,,20181210,,20181211,,20181212,,20181213,,20181214,,20181215,,20181216,,20181217,,20181218,,20181219,,20181220,,20181221,,20181222,,20181223,,20181224,,20181225,,20181226,,20181227,,20181228,,20181229,,20181230,,20181231,,20190101,,20190102,,20190103,,20190104,,20190105,,20190106,,20190107,,20190108,,20190109,,20190110,,20190111,,20190112,,20190113,,20190114,,20190115,,20190116,,20190117,,20190118,,20190119,,20190120,,20190121,,20190122,,20190123,,20190124,,20190125,,20190126,,20190127,,20190128,,20190129,,20190130,,20190131,,20190201,,20190202,,20190203,,20190204,,20190205,,20190206,,20190207,,20190208,,20190209,,20190210,,20190211,,20190212,,20190213,,20190214,,20190215,,20190216,,20190217,,20190218,,20190219,,20190220,,20190221,,20190222,,20190223,,20190224,,20190225,,20190226,,20190227,,20190228,,20190301,,20190302,,20190303,,20190304,,20190305,,20190306,,20190307,,20190308,,20190309,,20190310,,20190311,,20190312,,20190313,,20190314,,20190315,,20190316,,20190317,,20190318,,20190319,,20190320,,20190321,,20190322,,20190323,,20190324,,20190325,,20190326,,20190327,,20190328,,20190329,,20190330,,20190331,,20190401,,20190402,,20190403,,20190404,,20190405,,20190406,,20190407,,20190408,,20190409,,20190410,,20190411,,20190412,,20190413,,20190414,,20190415,,20190416,,20190417,,20190418,,20190419,,20190420,,20190421,,20190422,,20190423,,20190424,,20190425,,20190426,,20190427,,20190428,,20190429,,20190430,,20190501,,20190502,,20190503,,20190504,,20190505,,20190506,,20190507,,20190508,,20190509,,20190510,,20190511,,20190512,,20190513,,20190514,,20190515,,20190516,,20190517,,20190518,,20190519,,20190520,,20190521,,20190522,,20190523,,20190524,,20190525,,20190526,,20190527,,20190528,,20190529,,20190530,,20190531,,20190601,,20190602,,20190603,,20190604,,20190605,,20190606,,20190607,,20190608,,20190609,,20190610,,20190611,,20190612,,20190613,,20190614,,20190615,,20190616,,20190617,,20190618,,20190619,,20190620,,20190621,,20190622,,20190623,,20190624,,20190625,,20190626,,20190627,,20190628,,20190629,,20190630,,20190701,,20190702,,20190703,,20190704,,20190705,,20190706,,20190707,,20190708,,20190709,,20190710,,20190711,,20190712,,20190713,,20190714,,20190715,,20190716,,20190717,,20190718,,20190719,,20190720,,20190721,,20190722,,20190723,,20190724,,20190725,,20190726,,20190727,,20190728,,20190729,,20190730,,20190731,,20190801,,20190802,,20190803,,20190804,,20190805,,20190806,,20190807,,20190808,,20190809,,20190810,,20190811,,20190812,,20190813,,20190814,,20190815,,20190816,,20190817,,20190818,,20190819,,20190820,,20190821,,20190822,,20190823,,20190824,,20190825,,20190826,,20190827,,20190828,,20190829,,20190830,,20190831,,20190901,,20190902,,20190903,,20190904,,20190905,,20190906,,20190907,,20190908,,20190909,,20190910,,20190911,,20190912,,20190913,,20190914,,20190915,,20190916,,20190917,,20190918,,20190919,,20190920,,20190921,,20190922,,20190923,,20190924,,20190925,,20190926,,20190927,,20190928,,20190929,,20190930,,20191001,,20191002,,20191003,,20191004,,20191005,,20191006,,20191007,,20191008,,20191009,,20191010,,20191011,,20191012,,20191013,,20191014,,20191015,,20191016,,20191017,,20191018,,20191019,,20191020,,20191021,,20191022,,20191023,,20191024,,20191025,,20191026,,20191027,,20191028,,20191029,,20191030,,20191031,,20191101,,20191102,,20191103,,20191104,,20191105,,20191106,,20191107,,20191108,,20191109,,20191110,,20191111,,20191112,,20191113,,20191114,,20191115,,20191116,,20191117,,20191118,,20191119,,20191120,,20191121,,20191122,,20191123,,20191124,,20191125,,20191126,,20191127,,20191128,,20191129,,20191130,,20191201,,20191202,,20191203,,20191204,,20191205,,20191206,,20191207,,20191208,,20191209,,20191210,,20191211,,20191212,,20191213,,20191214,,20191215,,20191216,,20191217,,20191218,,20191219,,20191220,,20191221,,20191222,,20191223,,20191224,,20191225,,20191226,,20191227,,20191228,,20191229,,20191230,,20191231,,20200101,,20200102,,20200103,,20200104,,20200105,,20200106,,20200107,,20200108,,20200109,,20200110,,20200111,,20200112,,20200113,,20200114,,20200115,,20200116,,20200117,,20200118,,20200119,,20200120,,20200121,,20200122,,20200123,,20200124,,20200125,,";
    var year = date.getFullYear();
    var month = "0" + (date.getMonth() + 1);
    month = month.substring(month.length - 2);
    var day = "0" + date.getDate();
    day = day.substring(day.length - 2);
    var 搜索词 = year + month + day;
    var t = 公历列表.indexOf(搜索词);
    农历 = 农历列表[t / 10];
  }
  return 农历;
}
