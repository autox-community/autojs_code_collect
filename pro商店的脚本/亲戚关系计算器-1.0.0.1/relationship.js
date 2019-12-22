/**
 * BY: haole zheng
 * http://passer-by.com
 */
//https://github.com/mumuy/relationship
!(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.relationship = factory();
  }
})(typeof window !== "undefined" ? window : this, function () {
  //简写
  var _filter = [
    /* 表亲 */
    {
      //表亲的关系
      exp: /^(.+)&o([^#]+)&l/g,
      str: "$1$2",
    },
    {
      //表亲的关系
      exp: /^(.+)&l([^#]+)&o/g,
      str: "$1$2",
    },
    {
      //表亲的关系
      exp: /(,[ds],(.+),[ds])&[ol]/g,
      str: "$1",
    },
    /* 兄弟姐妹 */
    {
      //哥哥姐姐的哥哥姐姐还是自己的哥哥姐姐(年龄判断)
      exp: /(,o[sb])+(,o[sb])/,
      str: "$2",
    },
    {
      //弟弟妹妹的弟弟妹妹还是自己的弟弟妹妹(年龄判断)
      exp: /(,l[sb])+(,l[sb])/,
      str: "$2",
    },
    {
      //如果自己是男性,兄弟姐妹的兄弟就是自己的兄弟或自己
      exp: /^(.*)(,[fh1])(,[olx][sb])+,[olx]b(.*)$/,
      str: "$1$2,xb$4#$1$2$4",
    },
    {
      //如果自己是女性,兄弟姐妹的姐妹就是自己的姐妹或自己
      exp: /^(.*)(,[mw0])(,[olx][sb])+,[olx]s(.*)$/,
      str: "$1$2,xs$4#$1$2$4",
    },
    {
      //如果自己是男性,兄弟姐妹的姐妹就是自己的姐妹
      exp: /(,[fh1])(,[olx][sb])+,[olx]s/g,
      str: "$1,xs",
    },
    {
      //如果自己是女性,兄弟姐妹的兄弟就是自己的兄弟
      exp: /(,[mw0])(,[olx][sb])+,[olx]b/g,
      str: "$1,xb",
    },
    {
      //不知道性别，兄弟姐妹的兄弟是自己或兄弟
      exp: /^,[olx][sb],[olx]b(.+)?$/,
      str: "$1#,xb$1",
    },
    {
      //不知道性别，兄弟姐妹的姐妹是自己或姐妹
      exp: /^,[olx][sb],[olx]s(.+)?$/,
      str: "$1#,xs$1",
    },
    {
      //将复合称谓拆分
      exp: /^,x([sb])$/,
      str: ",o$1#,l$1",
    },
    /* 父母 */
    {
      //母亲的丈夫是自己的父亲
      exp: /m,h/g,
      str: "f",
    },
    {
      //父亲的妻子是自己的母亲
      exp: /f,w/g,
      str: "m",
    },
    {
      //兄弟的父母就是自己的父母
      exp: /,[xol][sb](,[mf])/g,
      str: "$1",
    },
    /* 父母的子女 */
    {
      //父母的女儿年龄判断是姐姐还是妹妹
      exp: /,[mf],d&([ol])/,
      str: ",$1s",
    },
    {
      //父母的儿子年龄判断是哥哥还是弟弟
      exp: /,[mf],s&([ol])/,
      str: ",$1b",
    },
    {
      //如果自己是男性,父母的儿子是自己或者兄弟
      exp: /^(.*)(,[fh1]|[xol]b),[mf],s(.*)$/,
      str: "$1$2,xb$3#$1$2$3",
    },
    {
      //如果自己是女性,父母的女儿是自己或者姐妹
      exp: /^(.*)(,[mw0]|[xol]s),[mf],d(.*)$/,
      str: "$1$2,xs$3#$1$2$3",
    },
    {
      //如果自己是女性,父母的儿子是自己兄弟
      exp: /(,[mw0]|[xol]s),[mf],s/,
      str: "$1,xb",
    },
    {
      //如果自己是男性,父母的女儿是自己姐妹
      exp: /(,[fh1]|[xol]b),[mf],d/,
      str: "$1,xs",
    },
    {
      //父母的儿子是自己或兄弟
      exp: /^,[mf],s(.+)?$/,
      str: ",1$1#,xb$1",
    },
    {
      //父母的女儿是自己或者姐妹
      exp: /^,[mf],d(.+)?$/,
      str: ",0$1#,xs$1",
    },
    /* 孩子 */
    {
      //孩子的姐妹是自己的女儿(年龄判断)
      exp: /,[ds]&o,ob/g,
      str: ",s&o",
    },
    {
      //孩子的姐妹是自己的女儿(年龄判断)
      exp: /,[ds]&o,os/g,
      str: ",d&o",
    },
    {
      //孩子的兄弟是自己的儿子(年龄判断)
      exp: /,[ds]&l,lb/g,
      str: ",s&l",
    },
    {
      //孩子的兄弟是自己的儿子(年龄判断)
      exp: /,[ds]&l,ls/g,
      str: ",d&l",
    },
    {
      //孩子的姐妹是自己的女儿
      exp: /,[ds](&[ol])?,[olx]s/g,
      str: ",d",
    },
    {
      //孩子的兄弟是自己的儿子
      exp: /,[ds](&[ol])?,[olx]b/g,
      str: ",s",
    },
    /* 夫妻 */
    {
      //自己是女性，女儿或儿子的妈妈是自己
      exp: /(,[mwd0](&[ol])?|[olx]s),[ds](&[ol])?,m/g,
      str: "$1",
    },
    {
      //自己是女性，女儿或儿子的爸爸是自己的丈夫
      exp: /(,[mwd0](&[ol])?|[olx]s),[ds](&[ol])?,f/g,
      str: "$1,h",
    },
    {
      //自己是男性，女儿或儿子的爸爸是自己
      exp: /(,[fhs1](&[ol])?|[olx]b),[ds](&[ol])?,f/g,
      str: "$1",
    },
    {
      //自己是男性，女儿或儿子的妈妈是自己的妻子
      exp: /(,[fhs1](&[ol])?|[olx]b),[ds](&[ol])?,m/g,
      str: "$1,w",
    },
    {
      //不知道性别，子女的妈妈是自己或妻子
      exp: /^,[ds],m(.+)?$/,
      str: "$1#,w$1",
    },
    {
      //不知道性别，子女的爸爸是自己或丈夫
      exp: /^,[ds],f(.+)?$/,
      str: "$1#,h$1",
    },
    {
      //夫妻的孩子就是自己的孩子
      exp: /,[wh](,[ds])/g,
      str: "$1",
    },
    {
      //夫妻的对方是自己
      exp: /,w,h|,h,w/g,
      str: "",
    },
    {
      //并列关系处理
      exp: /(.+)?\[(.+)\|(.+)\](.+)?/g,
      str: "$1$2$4#$1$3$4",
    },
  ];

  //关系数据
  //语法说明：
  //【关系】f:父,m:母,h:夫,w:妻,s:子,d:女,xb:兄弟,ob:兄,lb:弟,xs:姐妹,os:姐,ls:妹
  //【修饰符】 1:男性,0:女性,&o:年长,&l:年幼,#:隔断,[a|b]:并列
  var _data = {
    "": ["自己", "我"],
    //并称
    "[f|m]": ["父母", "爹娘", "爹妈", "爸妈", "双亲", "二老", "高堂"],
    "[h,f|h,m]": ["公婆"],
    "[xb|xs]": ["兄弟姐妹"],
    "[s|d]": ["子女", "儿女", "小孩", "孩子"],
    //本家
    f: [
      "爸爸",
      "父亲",
      "阿爸",
      "老爸",
      "老窦",
      "爸",
      "父",
      "爹",
      "爹爹",
      "爹地",
      "爹啲",
      "老爹",
      "大大",
      "老爷子",
      "老头子",
    ],
    "f,f": ["爷爷", "祖父", "阿爷", "奶爷", "阿公", "老爷"],
    "f,f,f": ["曾祖父", "太爷", "太爷爷", "太公", "祖公", "祖奶爷", "太老爷"],
    "f,f,f,f": ["高祖父", "老太爷", "祖太爷", "祖太爷爷", "祖太公"],
    "f,f,f,f,f": ["天祖父"],
    "f,f,f,f,f,f": ["烈祖父"],
    "f,f,f,f,f,m": ["烈祖母"],
    "f,f,f,f,f,f,f": ["太祖父"],
    "f,f,f,f,f,f,m": ["太祖母"],
    "f,f,f,f,f,f,f,f": ["远祖父"],
    "f,f,f,f,f,f,f,m": ["远祖母"],
    "f,f,f,f,f,f,f,f,f": ["鼻祖父"],
    "f,f,f,f,f,f,f,f,m": ["鼻祖母"],
    "f,f,f,f,m": ["天祖母"],
    "f,f,f,f,ob": ["伯高祖父"],
    "f,f,f,f,ob,w": ["伯高祖母"],
    "f,f,f,f,lb": ["叔高祖父"],
    "f,f,f,f,lb,w": ["叔高祖母"],
    "f,f,f,f,xs": ["姑高祖母"],
    "f,f,f,f,xs,h": ["姑高祖父"],
    "f,f,f,m": ["高祖母", "老太太", "祖太太", "祖太奶", "祖太奶奶", "祖太婆"],
    "f,f,f,m,xs": ["姨高祖母"],
    "f,f,f,m,xs,h": ["姨高祖父"],
    "f,f,f,m,xb": ["舅高祖父"],
    "f,f,f,m,xb,w": ["舅高祖母"],
    "f,f,f,ob": [
      "曾伯祖父",
      "曾伯父",
      "伯曾祖父",
      "伯公太",
      "伯太爷",
      "伯公老爷",
    ],
    "f,f,f,ob,w": [
      "曾伯祖母",
      "曾伯母",
      "伯曾祖母",
      "伯婆太",
      "伯太太",
      "伯婆奶奶",
    ],
    "f,f,f,lb": [
      "曾叔祖父",
      "曾叔父",
      "叔曾祖父",
      "叔公太",
      "叔太爷",
      "叔公老爷",
    ],
    "f,f,f,lb,w": [
      "曾叔祖母",
      "曾叔母",
      "叔曾祖母",
      "叔婆太",
      "叔太太",
      "叔婆奶奶",
    ],
    "f,f,f,xb,s&o": ["堂伯祖父", "族伯祖父"],
    "f,f,f,xb,s&o,w": ["堂伯祖母", "族伯祖母"],
    "f,f,f,xb,s&l": ["堂叔祖父", "族叔祖父"],
    "f,f,f,xb,s&l,w": ["堂叔祖母", "族叔祖母"],
    "f,f,f,xb,s,s&o": ["从伯父", "族伯父"],
    "f,f,f,xb,s,s&o,w": ["从伯母", "族伯母"],
    "f,f,f,xb,s,s&l": ["从叔父", "族叔父"],
    "f,f,f,xb,s,s&l,w": ["从叔母", "族叔母"],
    "f,f,f,xb,s,s,s&o": ["族兄"],
    "f,f,f,xb,s,s,s&l": ["族弟"],
    "f,f,f,xb,d": ["堂姑祖母"],
    "f,f,f,xb,d,h": ["堂姑祖父"],
    "f,f,f,xs": [
      "曾祖姑母",
      "姑曾祖母",
      "太姑婆",
      "姑婆太",
      "姑太太",
      "曾祖姑",
      "姑婆奶奶",
    ],
    "f,f,f,xs,h": [
      "曾祖姑丈",
      "姑曾祖父",
      "太姑丈公",
      "姑丈公太",
      "姑太爷",
      "姑公老爷",
    ],
    "f,f,f,xs,s&o": ["表伯祖父"],
    "f,f,f,xs,s&o,w": ["表伯祖母"],
    "f,f,f,xs,s&l": ["表叔祖父"],
    "f,f,f,xs,s&l,w": ["表叔祖母"],
    "f,f,f,xs,d": ["表姑祖母", "族祖姑"],
    "f,f,f,xs,d,h": ["表姑祖父"],
    "f,f,m": ["曾祖母", "太奶奶", "太婆", "祖婆", "祖奶奶"],
    "f,f,m,f": ["高外祖父", "祖太姥爷", "祖太公"],
    "f,f,m,m": ["高外祖母", "祖太姥姥", "祖太姥娘", "祖太婆"],
    "f,f,m,xb": [
      "舅曾祖父",
      "太舅公",
      "太舅爷",
      "舅太爷",
      "舅太爷爷",
      "舅公老爷",
    ],
    "f,f,m,xb,w": ["舅曾祖母", "太舅婆", "舅太太", "舅太奶奶", "舅婆奶奶"],
    "f,f,m,xb,s&o": ["表伯祖父"],
    "f,f,m,xb,s&o,w": ["表伯祖母"],
    "f,f,m,xb,s&l": ["表叔祖父"],
    "f,f,m,xb,s&l,w": ["表叔祖母"],
    "f,f,m,xb,d": ["表姑祖母"],
    "f,f,m,xb,d,h": ["表姑祖父"],
    "f,f,m,xs": [
      "姨曾祖母",
      "太姨奶",
      "姨太太",
      "曾姨奶奶",
      "姨太奶奶",
      "姨婆奶奶",
    ],
    "f,f,m,xs,h": ["姨曾祖父", "太姨爷", "姨太爷", "姨太爷爷"],
    "f,f,m,xs,s&o": ["表伯祖父"],
    "f,f,m,xs,s&o,w": ["表伯祖母"],
    "f,f,m,xs,s&l": ["表叔祖父"],
    "f,f,m,xs,s&l,w": ["表叔祖母"],
    "f,f,m,xs,d": ["表姑祖母"],
    "f,f,m,xs,d,h": ["表姑祖父"],
    "f,f,xb": ["堂祖父", "x爷爷"],
    "f,f,xb,w": ["堂祖母"],
    "f,f,xb,s&o": ["堂伯", "堂伯父", "从父伯父"],
    "f,f,xb,s&o,w": ["堂伯母", "从父伯母"],
    "f,f,xb,s&l": ["堂叔", "从父叔父"],
    "f,f,xb,s,w": ["堂婶", "堂叔母", "堂婶母", "从父叔母"],
    "f,f,xb,s,s&o": ["从兄", "再从兄", "从兄弟"],
    "f,f,xb,s,s&o,w": ["从嫂", "再从嫂"],
    "f,f,xb,s,s&l": ["从弟", "再从弟", "从兄弟"],
    "f,f,xb,s,s&l,w": ["从弟妹", "再从弟妹", "再从兄"],
    "f,f,xb,s,s,s": ["从侄", "再从侄", "从侄子"],
    "f,f,xb,s,s,s,w": ["从侄媳妇", "再从侄妇"],
    "f,f,xb,s,s,s,s": ["从侄孙"],
    "f,f,xb,s,s,s,d": ["从侄孙女"],
    "f,f,xb,s,s,d": ["从侄女", "再从侄女"],
    "f,f,xb,s,s,d,h": ["从侄女婿", "再从侄女婿", "姻家侄婿"],
    "f,f,xb,s,d&o": ["从姐", "再从姐", "从姐妹"],
    "f,f,xb,s,d&o,h": ["从姐夫", "再从姐夫"],
    "f,f,xb,s,d&l": ["从妹", "再从妹", "从姐妹"],
    "f,f,xb,s,d&l,h": ["从妹夫", "再妹夫"],
    "f,f,xb,d": ["堂姑", "堂姑妈", "堂姑母", "从父姑母"],
    "f,f,xb,d,h": ["堂姑丈", "堂姑爸", "堂姑父", "从父姑父"],
    "f,f,xb,d,s&o": ["堂姑表兄"],
    "f,f,xb,d,s&l": ["堂姑表弟"],
    "f,f,xb,d,d&o": ["堂姑表姐"],
    "f,f,xb,d,d&l": ["堂姑表妹"],
    "f,f,ob": [
      "伯祖父",
      "伯老爷",
      "伯公",
      "大爷爷",
      "大爷",
      "堂祖父",
      "伯爷爷",
    ],
    "f,f,ob,w": ["伯祖母", "伯奶奶", "伯婆", "大奶奶", "堂祖母", "姆婆"],
    "f,f,lb": [
      "叔祖父",
      "叔老爷",
      "叔公",
      "小爷爷",
      "堂祖父",
      "叔爷爷",
      "叔奶爷",
    ],
    "f,f,lb,w": ["叔祖母", "叔奶奶", "叔婆", "小奶奶", "堂祖母", "婶婆"],
    "f,f,xs": [
      "姑奶奶",
      "姑内祖母",
      "祖姑母",
      "姑祖母",
      "姑奶",
      "姑婆",
      "祖姑",
    ],
    "f,f,xs,h": [
      "姑爷爷",
      "姑内祖父",
      "祖姑父",
      "姑祖父",
      "姑老爷",
      "姑公",
      "姑奶爷",
      "姑丈公",
    ],
    "f,f,xs,s&o": ["姑表伯父", "表伯父", "表伯"],
    "f,f,xs,s&o,w": ["姑表伯母", "表伯母"],
    "f,f,xs,s&l": ["姑表叔父", "表叔父", "表叔爸", "表叔"],
    "f,f,xs,s&l,w": ["姑表叔母", "表叔母", "表叔妈", "表婶"],
    "f,f,xs,s,s": ["从表兄弟"],
    "f,f,xs,s,d": ["从表姐妹"],
    "f,f,xs,d": ["姑表姑母", "表姑妈", "表姑母", "表姑姑", "表姑"],
    "f,f,xs,d,h": ["姑表姑父", "表姑爸", "表姑父", "表姑丈"],
    "f,f,xs,d,s": ["从表兄弟"],
    "f,f,xs,d,d": ["从表姐妹"],
    "f,m": ["奶奶", "祖母", "阿嫲", "阿嬷", "嫲嫲"],
    "f,m,f": ["曾外祖父", "外太公", "太姥爷"],
    "f,m,f,f": ["曾外曾祖父", "祖太爷", "祖太爷爷", "祖太公"],
    "f,m,f,m": ["曾外曾祖母", "祖太太", "祖太奶奶", "祖太婆"],
    "f,m,f,xb,s": ["堂舅祖父"],
    "f,m,f,xb,s,w": ["堂舅祖母"],
    "f,m,f,xb,d": ["堂姨祖母"],
    "f,m,f,xb,d,h": ["堂姨祖父"],
    "f,m,f,ob": ["伯曾外祖父", "伯太姥爷", "伯太奶爷"],
    "f,m,f,ob,w": ["伯曾外祖母", "伯太姥姥", "伯太奶奶"],
    "f,m,f,lb": ["叔曾外祖父", "叔太姥爷", "叔太奶爷"],
    "f,m,f,lb,w": ["叔曾外祖母", "叔太姥姥", "叔太奶奶"],
    "f,m,f,xs": ["姑曾外祖母", "姑太姥姥", "姑太奶奶"],
    "f,m,f,xs,h": ["姑曾外祖父", "姑太姥爷", "姑太奶爷", "姑太爷爷"],
    "f,m,f,xs,s": ["表舅祖父"],
    "f,m,f,xs,s,w": ["表舅祖母"],
    "f,m,m": ["曾外祖母", "外太婆", "太姥姥"],
    "f,m,m,f": ["曾外曾外祖父", "祖太姥爷", "祖太公"],
    "f,m,m,m": ["曾外曾外祖母", "祖太姥姥", "祖太姥娘", "祖太婆"],
    "f,m,m,xb": ["舅曾外祖父", "舅太姥爷", "舅太奶爷"],
    "f,m,m,xb,w": ["舅曾外祖母", "舅太姥姥", "舅太奶奶"],
    "f,m,m,xb,s": ["表舅祖父"],
    "f,m,m,xb,s,w": ["表舅祖母"],
    "f,m,m,xb,d": ["表姨祖母"],
    "f,m,m,xb,d,h": ["表姨祖父"],
    "f,m,m,xs": ["姨曾外祖母", "姨太姥姥", "姨太奶奶"],
    "f,m,m,xs,h": ["姨曾外祖父", "姨太姥爷", "姨太奶爷"],
    "f,m,m,xs,d": ["表姨祖母"],
    "f,m,m,xs,d,h": ["表姨祖父"],
    "f,m,m,xs,s": ["表舅祖父"],
    "f,m,m,xs,s,w": ["表舅祖母"],
    "f,m,m,xs,d": ["表姨祖母"],
    "f,m,m,xs,d,h": ["表姨祖父"],
    "f,m,xb": [
      "舅公",
      "舅祖父",
      "舅老爷",
      "舅爷爷",
      "舅爷",
      "舅祖",
      "舅奶爷",
      "太舅父",
    ],
    "f,m,xb,w": ["舅婆", "舅祖母", "舅奶奶", "舅奶", "妗婆", "太舅母"],
    "f,m,xb,s&o": ["舅表伯父", "表伯父", "表伯"],
    "f,m,xb,s&o,w": ["舅表伯母", "表伯母"],
    "f,m,xb,s&l": ["舅表叔父", "表叔父", "表叔爸", "表叔"],
    "f,m,xb,s&l,w": ["舅表叔母", "表叔母", "表叔妈", "表婶"],
    "f,m,xb,s,s": ["从表兄弟"],
    "f,m,xb,s,d": ["从表姐妹"],
    "f,m,xb,d": ["舅表姑母", "表姑妈", "表姑母", "表姑姑", "表姑"],
    "f,m,xb,d,h": ["舅表姑父", "表姑爸", "表姑父", "表姑丈"],
    "f,m,xb,d,s": ["从表兄弟"],
    "f,m,xb,d,d": ["从表姐妹"],
    "f,m,xs": ["姨奶奶", "祖姨母", "姨祖母", "姨婆", "姨奶"],
    "f,m,xs,h": [
      "姨爷爷",
      "祖姨父",
      "姨祖父",
      "姨公",
      "姨丈公",
      "姨爷",
      "姨老爷",
      "姨奶爷",
    ],
    "f,m,xs,s&o": ["姨表伯父", "表伯", "表伯父", "从母伯父"],
    "f,m,xs,s&o,w": ["姨表伯母", "表伯母", "从母伯母"],
    "f,m,xs,s&l": ["姨表叔父", "表叔父", "表叔爸", "表叔", "从母叔父"],
    "f,m,xs,s&l,w": ["姨表叔母", "表叔母", "表叔妈", "表婶", "从母叔母"],
    "f,m,xs,s,s": ["从表兄弟"],
    "f,m,xs,s,d": ["从表姐妹"],
    "f,m,xs,d": ["姨表姑母", "表姑妈", "表姑母", "表姑姑", "表姑", "从母姑母"],
    "f,m,xs,d,h": ["姨表姑父", "表姑爸", "表姑父", "表姑丈", "从母姑父"],
    "f,m,xs,d,s": ["从表兄弟"],
    "f,m,xs,d,d": ["从表姐妹"],
    "f,xb,w,f": ["姻伯公"],
    "f,xb,w,m": ["姻伯婆"],
    "f,xb,w,xb": ["姻世伯"],
    "f,xb,w,xb,w": ["姻伯母"],
    "f,xb,w,xs": ["姻伯母"],
    "f,xb,w,xs,h": ["姻世伯"],
    "f,xb,s&o": ["堂哥", "堂兄", "堂阿哥", "叔伯兄弟"],
    "f,xb,s&o,w": ["堂嫂"],
    "f,xb,s&l": ["堂弟", "堂阿弟", "叔伯兄弟"],
    "f,xb,s&l,w": ["堂弟媳", "堂弟妹"],
    "f,xb,s,s": ["堂侄", "堂侄子", "叔伯侄子"],
    "f,xb,s,s,w": ["堂侄媳妇"],
    "f,xb,s,s,s": ["堂侄孙"],
    "f,xb,s,s,s,w": ["堂侄孙媳妇"],
    "f,xb,s,s,d": ["堂侄孙女"],
    "f,xb,s,s,d,h": ["堂侄孙女婿"],
    "f,xb,s,d": ["堂侄女"],
    "f,xb,s,d,h": ["堂侄女婿", "姻家侄"],
    "f,xb,d&o": ["堂姐", "堂阿姐", "叔伯姐妹"],
    "f,xb,d&o,h": ["堂姐夫"],
    "f,xb,d&l": ["堂妹", "堂阿妹", "叔伯姐妹"],
    "f,xb,d&l,h": ["堂妹夫"],
    "f,xb,d,s": ["堂外甥"],
    "f,xb,d,d": ["堂外甥女"],
    "f,ob": ["伯父", "伯伯", "阿伯", "大伯", "x伯"],
    "f,ob,w": ["伯母", "大娘", "大妈", "x妈"],
    "f,lb": ["叔叔", "叔父", "阿叔", "叔爸", "叔爹", "仲父", "x叔", "叔"],
    "f,lb,w": [
      "婶婶",
      "婶母",
      "阿婶",
      "家婶",
      "叔母",
      "叔妈",
      "叔娘",
      "季母",
      "x婶",
      "婶",
    ],
    //姑家
    "f,xs": ["姑妈", "姑姑", "姑娘", "大姑妈", "x姑妈", "姑"],
    "f,xs,h": ["姑丈", "姑父", "姑爸", "姑夫"],
    "f,xs,h,f": ["姻伯公"],
    "f,xs,h,m": ["姻伯婆"],
    "f,xs,h,xb": ["姻世伯"],
    "f,xs,h,xb,w": ["姻伯母"],
    "f,xs,h,xs": ["姻伯母"],
    "f,xs,h,xs,h": ["姻世伯"],
    "f,xs,s&o": ["姑表哥", "表哥"],
    "f,xs,s&o,w": ["姑表嫂", "表嫂"],
    "f,xs,s&l": ["姑表弟", "表弟"],
    "f,xs,s&l,w": ["姑表弟媳", "表弟媳", "表弟妹"],
    "f,xs,s,s": ["表侄", "表侄子", "姑表侄男", "表侄男"],
    "f,xs,s,s,s": ["表侄孙"],
    "f,xs,s,s,s,w": ["表侄孙媳妇"],
    "f,xs,s,s,d": ["表侄孙女"],
    "f,xs,s,s,d,h": ["表侄孙女婿"],
    "f,xs,s,d": ["表侄女", "姑表侄女"],
    "f,xs,s,d,s": ["外表侄孙"],
    "f,xs,s,d,s,w": ["外表侄孙媳妇"],
    "f,xs,s,d,d": ["外表侄孙女"],
    "f,xs,s,d,d,h": ["外表侄孙女婿"],
    "f,xs,d&o": ["姑表姐", "表姐"],
    "f,xs,d&o,h": ["姑表姐夫", "表姐夫", "表姐丈"],
    "f,xs,d&l": ["姑表妹", "表妹"],
    "f,xs,d&l,h": ["姑表妹夫", "表妹夫"],
    "f,xs,d,s": ["表外甥", "姑表甥男", "表甥男"],
    "f,xs,d,d": ["表外甥女", "姑表甥女", "表甥女"],
    "f,os": ["姑妈", "姑母"],
    "f,ls": ["姑妈", "姑姐"],
    //外家
    m: [
      "妈妈",
      "母亲",
      "老妈",
      "阿妈",
      "老母",
      "老妈子",
      "妈",
      "母",
      "娘",
      "娘亲",
      "妈咪",
    ],
    "m,f": ["外公", "外祖父", "姥爷"],
    "m,f,f": ["外曾祖父", "外太祖父", "外太公", "外太爷爷", "太外祖父"],
    "m,f,f,f": ["外高祖父", "祖太爷", "祖太爷爷", "祖太公"],
    "m,f,f,m": ["外高祖母", "祖太太", "祖太奶奶", "祖太婆"],
    "m,f,f,xb,s&o": ["堂伯外祖父"],
    "m,f,f,xb,s&o,w": ["堂伯外祖母"],
    "m,f,f,xb,s&l": ["堂叔外祖父"],
    "m,f,f,xb,s&l,w": ["堂叔外祖母"],
    "m,f,f,xb,d": ["堂姑外祖母"],
    "m,f,f,xb,d,h": ["堂姑外祖父"],
    "m,f,f,ob": ["伯外曾祖父", "外太伯公", "伯太姥爷", "伯太奶爷", "伯太爷爷"],
    "m,f,f,ob,w": ["伯外曾祖母", "外太伯母", "伯太姥姥", "伯太奶奶"],
    "m,f,f,lb": ["叔外曾祖父", "外太叔公", "叔太姥爷", "叔太奶爷", "叔太爷爷"],
    "m,f,f,lb,w": ["叔外曾祖母", "外太叔母", "叔太姥姥", "叔太奶奶"],
    "m,f,f,xs": ["姑外曾祖母", "外太姑婆", "姑太姥姥", "姑太奶奶"],
    "m,f,f,xs,h": [
      "姑外曾祖父",
      "外太姑丈公",
      "姑太姥爷",
      "姑太奶爷",
      "姑太爷爷",
    ],
    "m,f,f,xs,s&o": ["表伯外祖父", "外表伯祖父"],
    "m,f,f,xs,s&o,w": ["表伯外祖母", "外表伯祖母"],
    "m,f,f,xs,s&l": ["表叔外祖父", "外表叔祖父"],
    "m,f,f,xs,s&l,w": ["表叔外祖母", "外表叔祖母"],
    "m,f,f,xs,d": ["表姑外祖母"],
    "m,f,f,xs,d,h": ["表姑外祖父"],
    "m,f,m": ["外曾祖母", "外太祖母", "太外祖母", "外太奶奶", "外太婆"],
    "m,f,m,f": ["外高外祖父", "祖太姥爷", "祖太公"],
    "m,f,m,m": ["外高外祖母", "祖太姥姥", "祖太姥娘", "祖太婆"],
    "m,f,m,xb": ["舅外曾祖父", "外太舅公", "舅太姥爷", "舅太奶爷"],
    "m,f,m,xb,w": [
      "舅外曾祖母",
      "外太舅母",
      "舅太姥姥",
      "舅太奶奶",
      "外太舅婆",
    ],
    "m,f,m,xb,s&o": ["表伯外祖父", "外表伯祖父"],
    "m,f,m,xb,s&o,w": ["表伯外祖母", "外表伯祖母"],
    "m,f,m,xb,s&l": ["表叔外祖父", "外表叔祖父"],
    "m,f,m,xb,s&l,w": ["表叔外祖母", "外表叔祖母"],
    "m,f,m,xb,d": ["表姑外祖母"],
    "m,f,m,xb,d,h": ["表姑外祖父"],
    "m,f,m,xs": ["姨外曾祖母", "外太姨婆", "姨太姥姥", "姨太奶奶"],
    "m,f,m,xs,h": [
      "姨外曾祖父",
      "外太姑姨公",
      "姨太姥爷",
      "姨太奶爷",
      "姨太爷爷",
    ],
    "m,f,m,xs,s&o": ["表伯外祖父", "外表伯祖父"],
    "m,f,m,xs,s&o,w": ["表伯外祖母", "外表伯祖母"],
    "m,f,m,xs,s&l": ["表叔外祖父", "外表叔祖父"],
    "m,f,m,xs,s&l,w": ["表叔外祖母", "外表叔祖母"],
    "m,f,m,xs,d": ["表姑外祖母"],
    "m,f,m,xs,d,h": ["表姑外祖父"],
    "m,f,xb": ["大姥爷/小姥爷", "x姥爷"],
    "m,f,xb,s": ["堂舅", "堂舅爸", "堂舅父", "堂舅舅", "从父舅父"],
    "m,f,xb,s,w": ["堂舅妈", "堂舅母", "从父舅母"],
    "m,f,xb,s,s&o": ["堂舅表兄"],
    "m,f,xb,s,s&l": ["堂舅表弟"],
    "m,f,xb,s,d&o": ["堂舅表姐"],
    "m,f,xb,s,d&l": ["堂舅表妹"],
    "m,f,xb,d": ["堂姨", "堂姨妈", "堂姨母", "从父姨母"],
    "m,f,xb,d,h": ["堂姨丈", "堂姨爸", "堂姨父", "从父姨父"],
    "m,f,xb,d,s&o": ["堂姨表兄"],
    "m,f,xb,d,s&l": ["堂姨表弟"],
    "m,f,xb,d,d&o": ["堂姨表姐"],
    "m,f,xb,d,d&l": ["堂姨表妹"],
    "m,f,ob": ["伯外祖父", "外伯祖父", "伯姥爷", "大姥爷", "外伯祖", "外伯公"],
    "m,f,ob,w": [
      "伯外祖母",
      "外伯祖母",
      "伯姥姥",
      "大姥姥",
      "外姆婆",
      "外伯婆",
    ],
    "m,f,lb": [
      "叔外祖父",
      "外叔祖父",
      "叔姥爷",
      "小姥爷",
      "外叔祖",
      "叔外祖",
      "外叔公",
    ],
    "m,f,lb,w": [
      "叔外祖母",
      "外叔祖母",
      "叔姥姥",
      "小姥姥",
      "外姆婆",
      "外叔婆",
    ],
    "m,f,xs": [
      "姑姥姥",
      "姑外祖母",
      "外姑祖母",
      "外太姑母",
      "外姑婆",
      "外姑母",
    ],
    "m,f,xs,h": [
      "姑姥爷",
      "姑外祖父",
      "外姑祖父",
      "外太姑父",
      "外姑公",
      "外姑丈",
    ],
    "m,f,xs,s": [
      "姑表舅父",
      "姑表舅爸",
      "表舅父",
      "表舅爸",
      "表舅",
      "表舅舅",
      "姑表舅舅",
    ],
    "m,f,xs,s,w": ["姑表舅母", "姑表舅妈", "表舅母", "表舅妈"],
    "m,f,xs,s,s": ["从表兄弟"],
    "m,f,xs,s,d": ["从表姐妹"],
    "m,f,xs,d": [
      "姑表姨母",
      "姑表姨妈",
      "表姨母",
      "表姨妈",
      "表姨",
      "表阿姨",
      "姑表姨姨",
    ],
    "m,f,xs,d,h": ["姑表姨父", "姑表姨父", "表姨丈", "表姨父"],
    "m,f,xs,d,s": ["从表兄弟"],
    "m,f,xs,d,d": ["从表姐妹"],
    "m,m": ["外婆", "外祖母", "姥姥", "阿婆"],
    "m,m,f": ["外曾外祖父", "外太外公", "外太姥爷"],
    "m,m,f,f": ["外曾外曾祖父", "祖太爷", "祖太爷爷", "祖太公"],
    "m,m,f,m": ["外曾外曾祖母", "祖太太", "祖太奶奶", "祖太婆"],
    "m,m,f,xb,s": ["堂舅外祖父"],
    "m,m,f,xb,s,w": ["堂舅外祖母"],
    "m,m,f,xb,d": ["堂姨外祖母"],
    "m,m,f,xb,d,h": ["堂姨外祖父"],
    "m,m,f,ob": ["伯外曾外祖父", "伯太姥爷"],
    "m,m,f,ob,w": ["伯外曾外祖母", "伯太姥姥"],
    "m,m,f,lb": ["叔外曾外祖父", "叔太姥爷"],
    "m,m,f,lb,w": ["叔外曾外祖母", "叔太姥姥"],
    "m,m,f,xs": ["姑外曾外祖母", "姑太姥姥"],
    "m,m,f,xs,h": ["姑外曾外祖父", "姑太姥爷"],
    "m,m,f,xs,s": ["表舅外祖父"],
    "m,m,f,xs,s,w": ["表舅外祖母"],
    "m,m,f,xs,d": ["表姨外祖母"],
    "m,m,f,xs,d,h": ["表姨外祖父"],
    "m,m,m": ["外曾外祖母", "外太外婆", "外太姥姥"],
    "m,m,m,f": ["外曾外曾外祖父", "祖太姥爷", "祖太公"],
    "m,m,m,m": ["外曾外曾外祖母", "祖太姥姥", "祖太姥娘", "祖太婆"],
    "m,m,m,xb": ["舅外曾外祖父", "舅太姥爷"],
    "m,m,m,xb,w": ["舅外曾外祖母", "舅太姥姥"],
    "m,m,m,xb,s": ["表舅外祖父"],
    "m,m,m,xb,s,w": ["表舅外祖母"],
    "m,m,m,xb,d": ["表姨外祖母"],
    "m,m,m,xb,d,h": ["表姨外祖父"],
    "m,m,m,xs": ["姨外曾外祖母", "姨太姥姥"],
    "m,m,m,xs,h": ["姨外曾外祖父", "姨太姥爷"],
    "m,m,m,xs,s": ["表舅外祖父"],
    "m,m,m,xs,s,w": ["表舅外祖母"],
    "m,m,m,xs,d": ["表姨外祖母"],
    "m,m,m,xs,d,h": ["表姨外祖父"],
    "m,m,xb": [
      "外舅公",
      "外舅祖父",
      "外太舅父",
      "舅外祖父",
      "舅姥爷",
      "舅外公",
      "舅公",
      "x舅姥爷",
    ],
    "m,m,xb,w": [
      "外舅婆",
      "外舅祖母",
      "外太舅母",
      "舅外祖母",
      "舅姥姥",
      "舅婆",
      "外妗婆",
    ],
    "m,m,xb,s": [
      "舅表舅父",
      "舅表舅爸",
      "表舅父",
      "表舅爸",
      "表舅",
      "表舅舅",
      "舅表舅舅",
    ],
    "m,m,xb,s,w": ["舅表舅母", "舅表舅妈", "表舅母", "表舅妈"],
    "m,m,xb,s,s": ["从表兄弟"],
    "m,m,xb,s,d": ["从表姐妹"],
    "m,m,xb,d": [
      "舅表姨母",
      "舅表姨妈",
      "表姨母",
      "表姨妈",
      "表姨",
      "表阿姨",
      "舅表姨姨",
    ],
    "m,m,xb,d,h": ["舅表姨父", "舅表姨丈", "表姨父", "表姨丈"],
    "m,m,xb,d,s": ["从表兄弟"],
    "m,m,xb,d,d": ["从表姐妹"],
    "m,m,xs": ["姨姥姥", "姨外祖母", "外姨婆", "外姨祖母", "姨婆", "姨姥"],
    "m,m,xs,h": ["姨姥爷", "姨外祖父", "外姨丈公", "外姨祖父", "姨公"],
    "m,m,xs,s": [
      "姨表舅父",
      "姨表舅爸",
      "表舅父",
      "表舅爸",
      "表舅",
      "表舅舅",
      "姨表舅舅",
      "从母舅父",
    ],
    "m,m,xs,s,w": ["姨表舅母", "姨表舅妈", "表舅母", "表舅妈", "从母舅母"],
    "m,m,xs,s,s": ["从表兄弟"],
    "m,m,xs,s,d": ["从表姐妹"],
    "m,m,xs,d": [
      "姨表姨母",
      "姨表姨妈",
      "表姨母",
      "表姨妈",
      "表姨",
      "表阿姨",
      "姨表姨姨",
      "从母姨母",
    ],
    "m,m,xs,d,h": ["姨表姨父", "姨表姨丈", "表姨父", "表姨丈", "从母姨父"],
    "m,m,xs,d,s": ["从表兄弟"],
    "m,m,xs,d,d": ["从表姐妹"],
    //舅家
    "m,xb": [
      "舅舅",
      "舅父",
      "舅",
      "娘舅",
      "舅仔",
      "母舅",
      "舅爸",
      "舅爹",
      "阿舅",
      "x舅",
    ],
    "m,xb,w": ["舅妈", "舅母", "妗子", "妗妗", "妗母", "阿妗", "x舅妈"],
    "m,xb,w,f": ["姻伯公"],
    "m,xb,w,m": ["姻伯婆"],
    "m,xb,w,xb": ["姻世伯"],
    "m,xb,w,xb,w": ["姻伯母"],
    "m,xb,w,xs": ["姻伯母"],
    "m,xb,w,xs,h": ["姻世伯"],
    "m,xb,s&o": ["舅表哥", "表哥"],
    "m,xb,s&o,w": ["舅表嫂", "表嫂"],
    "m,xb,s&l": ["舅表弟", "表弟"],
    "m,xb,s&l,w": ["舅表弟媳", "表弟媳", "表弟妹"],
    "m,xb,s,s": ["表侄", "表侄子", "舅表侄男", "表侄男"],
    "m,xb,s,s,s": ["表侄孙"],
    "m,xb,s,s,s,w": ["表侄孙媳妇"],
    "m,xb,s,s,d": ["表侄孙女"],
    "m,xb,s,s,d,h": ["表侄孙女婿"],
    "m,xb,s,d": ["表侄女", "舅表侄女"],
    "m,xb,s,d,s": ["外表侄孙"],
    "m,xb,s,d,s,w": ["外表侄孙媳妇"],
    "m,xb,s,d,d": ["外表侄孙女"],
    "m,xb,s,d,d,h": ["外表侄孙女婿"],
    "m,xb,d&o": ["舅表姐", "表姐"],
    "m,xb,d&o,h": ["舅表姐夫", "表姐夫", "表姐丈"],
    "m,xb,d&l": ["舅表妹", "表妹"],
    "m,xb,d&l,h": ["舅表妹夫", "表妹夫"],
    "m,xb,d,s": ["表外甥", "舅表甥男", "表甥男"],
    "m,xb,d,d": ["表外甥女", "舅表甥女", "表甥女"],
    "m,ob": ["大舅"],
    "m,ob,w": ["大舅妈"],
    "m,lb": ["小舅", "舅父仔"],
    "m,lb,w": ["小舅妈"],
    //姨家
    "m,xs": ["姨妈", "姨母", "姨姨", "姨娘", "阿姨", "姨", "x姨", "x姨妈"],
    "m,xs,h": ["姨丈", "姨父", "姨爸", "姨爹", "x姨父"],
    "m,xs,h,f": ["姻伯公"],
    "m,xs,h,m": ["姻伯婆"],
    "m,xs,h,xb": ["姻世伯"],
    "m,xs,h,xb,w": ["姻伯母"],
    "m,xs,h,xs": ["姻伯母"],
    "m,xs,h,xs,h": ["姻世伯"],
    "m,xs,s&o": ["姨表哥", "表哥"],
    "m,xs,s&o,w": ["姨表嫂", "表嫂"],
    "m,xs,s&l": ["姨表弟", "表弟"],
    "m,xs,s&l,w": ["姨表弟媳", "表弟媳", "表弟妹"],
    "m,xs,s,s": ["表侄", "表侄子", "姨表侄男", "表侄男"],
    "m,xs,s,s,s": ["表侄孙"],
    "m,xs,s,s,s,w": ["表侄孙媳妇"],
    "m,xs,s,s,d": ["表侄孙女"],
    "m,xs,s,s,d,h": ["表侄孙女婿"],
    "m,xs,s,d": ["表侄女", "姨表侄女"],
    "m,xs,s,d,s": ["外表侄孙"],
    "m,xs,s,d,s,w": ["外表侄孙媳妇"],
    "m,xs,s,d,d": ["外表侄孙女"],
    "m,xs,s,d,d,h": ["外表侄孙女婿"],
    "m,xs,d&o": ["姨表姐", "表姐"],
    "m,xs,d&o,h": ["姨表姐夫", "表姐夫", "表姐丈"],
    "m,xs,d&l": ["姨表妹", "表妹"],
    "m,xs,d&l,h": ["姨表妹夫", "表妹夫"],
    "m,xs,d,s": ["表外甥", "姨表甥男", "姨表甥男"],
    "m,xs,d,d": ["表外甥女", "姨表甥女", "表甥女"],
    "m,os": ["大姨", "大姨妈"],
    "m,os,h": ["大姨父", "大姨丈"],
    "m,ls": ["小姨", "小姨妈", "姨仔"],
    "m,ls,h": ["小姨父", "小姨丈"],
    //婆家
    h: [
      "老公",
      "丈夫",
      "先生",
      "官人",
      "男人",
      "汉子",
      "夫",
      "夫君",
      "相公",
      "夫婿",
      "爱人",
      "老伴",
    ],
    "h,f": ["公公", "翁亲", "老公公"],
    "h,f,f": ["祖翁"],
    "h,f,f,ob": ["伯祖翁"],
    "h,f,f,ob,w": ["伯祖婆"],
    "h,f,f,lb": ["叔祖翁"],
    "h,f,f,lb,w": ["叔祖婆"],
    "h,f,f,f": ["太公翁"],
    "h,f,f,f,ob": ["太伯翁"],
    "h,f,f,f,ob,w": ["太姆婆"],
    "h,f,f,f,lb": ["太叔翁"],
    "h,f,f,f,lb,w": ["太婶婆"],
    "h,f,f,m": ["太奶亲"],
    "h,f,m": ["祖婆"],
    "h,f,ob": ["伯翁"],
    "h,f,ob,w": ["伯婆"],
    "h,f,lb": ["叔公", "叔翁", "叔祖"],
    "h,f,lb,w": ["叔婆", "婶婆", "婶亲"],
    "h,f,xb,s&o": ["堂大伯", "堂兄", "堂大伯哥"],
    "h,f,xb,s&o,w": ["堂嫂", "堂大伯嫂"],
    "h,f,xb,s&l": ["堂叔仔", "堂弟", "堂小叔弟"],
    "h,f,xb,s&l,w": ["堂小弟", "堂弟妇", "堂小叔弟妇"],
    "h,f,xb,s,s": ["堂夫侄男"],
    "h,f,xb,s,d": ["堂夫侄女"],
    "h,f,xb,d&o": ["堂大姑姐"],
    "h,f,xb,d&o,h": ["堂大姑姐夫"],
    "h,f,xb,d&l": ["堂小姑妹"],
    "h,f,xb,d&l,h": ["堂小姑妹夫"],
    "h,f,xb,d,s": ["堂夫甥男"],
    "h,f,xb,d,d": ["堂夫甥女"],
    "h,f,xs": ["姑婆"],
    "h,f,xs,h": ["姑公"],
    "h,f,xs,s&o": ["姑表大伯子", "表大伯"],
    "h,f,xs,s&o,w": ["姑表大伯嫂", "表大姆"],
    "h,f,xs,s&l": ["姑表小叔弟", "表叔仔"],
    "h,f,xs,s&l,w": ["姑表小叔弟妇"],
    "h,f,xs,s,s": ["姑表夫侄男"],
    "h,f,xs,s,d": ["姑表夫侄女"],
    "h,f,xs,d&o": ["姑表大姑姐", "表大姑"],
    "h,f,xs,d&o,h": ["姑表大姑姐夫"],
    "h,f,xs,d&l": ["姑表小姑妹", "表姑仔"],
    "h,f,xs,d&l,h": ["姑表小姑妹夫"],
    "h,f,xs,d,s": ["姑表夫甥男"],
    "h,f,xs,d,d": ["姑表夫甥女"],
    "h,m": ["婆婆", "婆母", "姑亲", "老婆婆"],
    "h,m,xb": ["舅公"],
    "h,m,xb,w": ["舅婆"],
    "h,m,xb,s&o": ["舅表大伯子", "表大伯"],
    "h,m,xb,s&o,w": ["舅表大伯嫂", "表大姆"],
    "h,m,xb,s&l": ["舅表小叔弟", "表叔仔"],
    "h,m,xb,s&l,w": ["舅表小叔弟妇"],
    "h,m,xb,s,s": ["舅表夫侄男"],
    "h,m,xb,s,d": ["舅表夫侄女"],
    "h,m,xb,d&o": ["舅表大姑姐", "表大姑"],
    "h,m,xb,d&o,h": ["舅表大姑姐夫"],
    "h,m,xb,d&l": ["舅表小姑妹", "表姑仔"],
    "h,m,xb,d&l,h": ["舅表小姑妹夫"],
    "h,m,xb,d,s": ["舅表夫甥男"],
    "h,m,xb,d,d": ["舅表夫甥女"],
    "h,m,xs": ["姨婆"],
    "h,m,xs,h": ["姨公"],
    "h,m,xs,s&o": ["姨表大伯子", "表大伯"],
    "h,m,xs,s&o,w": ["姨表大伯嫂", "表大姆"],
    "h,m,xs,s&l": ["姨表小叔弟", "表叔仔"],
    "h,m,xs,s&l,w": ["姨表小叔弟妇"],
    "h,m,xs,s,s": ["姨表夫侄男"],
    "h,m,xs,s,d": ["姨表夫侄女"],
    "h,m,xs,d&o": ["姨表大姑姐", "表大姑"],
    "h,m,xs,d&o,h": ["姨表大姑姐夫"],
    "h,m,xs,d&l": ["姨表小姑妹", "表姑仔"],
    "h,m,xs,d&l,h": ["姨表小姑妹夫"],
    "h,m,xs,d,s": ["姨表夫甥男"],
    "h,m,xs,d,d": ["姨表夫甥女"],
    "h,ob": ["大伯子", "大伯哥", "大伯兄", "夫兄"],
    "h,ob,w": [
      "大婶子",
      "大伯嫂",
      "大伯妇",
      "伯娘",
      "大伯娘",
      "大嫂",
      "夫兄嫂",
      "妯娌",
    ],
    "h,lb": ["小叔子", "小叔弟"],
    "h,lb,w": ["小婶子", "小叔妇", "小叔媳妇", "小叔弟妇", "妯娌"],
    "h,xb,s": ["叔侄", "婆家侄"],
    "h,os": ["大姑子", "大姑", "大娘姑", "大姑姊"],
    "h,os,h": ["大姑夫", "姊丈", "大姑姐夫", "大姑姊夫"],
    "h,ls": ["小姑子", "小姑", "小姑妹", "姑仔"],
    "h,ls,h": ["小姑夫", "小亘子", "小姑妹夫"],
    "h,xs,s": ["姑甥", "婆家甥"],
    //岳家
    w: [
      "老婆",
      "妻子",
      "太太",
      "媳妇儿",
      "媳妇",
      "夫人",
      "女人",
      "婆娘",
      "妻",
      "内人",
      "娘子",
      "爱人",
      "老伴",
    ],
    "w,f": ["岳父", "岳丈", "老丈人", "丈人", "泰山", "妻父"],
    "w,f,f": ["太岳父", "祖岳父"],
    "w,f,f,f,xb,s,s&o": ["姻伯丈"],
    "w,f,f,f,xb,s,s&o,w": ["姻伯丈"],
    "w,f,f,f,xb,s,s&l": ["姻叔丈"],
    "w,f,f,f,xb,s,s&l,w": ["姻婶"],
    "w,f,f,ob": ["太伯岳"],
    "w,f,f,ob,w": ["太伯岳母"],
    "w,f,f,lb,": ["太叔岳"],
    "w,f,f,lb,w": ["太叔岳母"],
    "w,f,f,xb,s&o": ["姻伯"],
    "w,f,f,xb,s&o,w": ["姻姆"],
    "w,f,f,xb,s&l": ["姻叔"],
    "w,f,f,xb,s&l,w": ["姻婶"],
    "w,f,f,xs": ["太姑岳母"],
    "w,f,f,xs,h": ["太姑岳父"],
    "w,f,m": ["太岳母", "祖岳母"],
    "w,f,m,xb": ["太舅岳父"],
    "w,f,m,xb,w": ["太舅岳母"],
    "w,f,m,xs": ["太姨岳母"],
    "w,f,m,xs,h": ["太姨岳父"],
    "w,f,xb,s&o": ["堂大舅", "姻家兄"],
    "w,f,xb,s&l": ["堂舅仔", "姻家弟"],
    "w,f,xb,d&o": ["堂大姨"],
    "w,f,xb,d&l": ["堂姨仔"],
    "w,f,ob": ["伯岳", "伯岳父"],
    "w,f,ob,w": ["伯岳母"],
    "w,f,lb": ["叔岳", "叔岳父"],
    "w,f,lb,w": ["叔岳母"],
    "w,f,xs": ["姑岳母"],
    "w,f,xs,h": ["姑岳父"],
    "w,f,xs,s&o": ["表大舅", "表内兄"],
    "w,f,xs,s&o,w": ["表内嫂"],
    "w,f,xs,s&l": ["表舅仔", "表内弟"],
    "w,f,xs,s&l,w": ["表内弟妇"],
    "w,f,xs,d&o": ["表大姨", "表内姐"],
    "w,f,xs,d&o,h": ["表襟兄"],
    "w,f,xs,d&l": ["表姨仔", "表内妹"],
    "w,f,xs,d&l,w": ["表襟弟"],
    "w,m": ["岳母", "丈母娘", "丈母", "泰水"],
    "w,m,f": ["外太岳父"],
    "w,m,m": ["外太岳母"],
    "w,m,xb": ["舅岳父"],
    "w,m,xb,w": ["舅岳母"],
    "w,m,xb,s&o": ["表大舅"],
    "w,m,xb,s&l": ["表舅仔"],
    "w,m,xb,d&o": ["表大姨"],
    "w,m,xb,d&l": ["表姨仔"],
    "w,m,xs": ["姨岳母"],
    "w,m,xs,h": ["姨岳父"],
    "w,m,xs,s&o": ["表大舅"],
    "w,m,xs,s&l": ["表舅仔"],
    "w,m,xs,d&o": ["表大姨"],
    "w,m,xs,d&l": ["表姨仔"],
    "w,xb,s": ["内侄", "妻侄", "舅侄"],
    "w,xb,s,w": ["内侄媳妇"],
    "w,xb,s,s": ["内侄孙"],
    "w,xb,s,s,w": ["内侄孙媳妇"],
    "w,xb,s,d": ["内侄孙女"],
    "w,xb,s,d,h": ["内侄孙女婿"],
    "w,xb,d": ["内侄女", "妻侄女"],
    "w,xb,d,h": ["内侄女婿"],
    "w,xb,d,s": ["外侄孙"],
    "w,xb,d,s,w": ["外侄孙媳妇"],
    "w,xb,d,d": ["外侄孙女"],
    "w,xb,d,d,h": ["外侄孙女婿"],
    "w,ob": ["大舅子", "大舅哥", "大舅兄", "内兄", "妻兄", "妻舅", "舅兄"],
    "w,ob,w": [
      "舅嫂",
      "大舅妇",
      "大舅嫂",
      "大舅媳妇",
      "大妗子",
      "内嫂",
      "妻兄嫂",
    ],
    "w,lb": ["小舅子", "小舅弟", "内弟", "妻弟", "妻舅", "舅弟"],
    "w,lb,w": ["舅弟媳", "小舅妇", "小舅弟妇", "小舅媳妇", "小妗子", "妻妹夫"],
    "w,xs,s": ["内甥", "姨甥", "妻外甥"],
    "w,xs,s,w": ["姨甥媳妇"],
    "w,xs,s,s": ["姨甥孙"],
    "w,xs,s,s,w": ["姨甥孙媳妇"],
    "w,xs,s,d": ["姨甥孙女"],
    "w,xs,s,d,h": ["姨甥孙女婿"],
    "w,xs,d": ["姨甥女", "妻外甥女"],
    "w,xs,d,h": ["姨甥女婿"],
    "w,xs,d,s": ["姨甥孙"],
    "w,xs,d,s,w": ["姨甥孙媳妇"],
    "w,xs,d,d": ["姨甥孙女"],
    "w,xs,d,d,h": ["姨甥孙女婿"],
    "w,os": ["大姨子", "大姨姐", "大姨姊", "妻姐"],
    "w,os,h": ["大姨夫", "大姨姐夫", "大姨姊夫", "襟兄", "连襟", "姨夫"],
    "w,ls": ["小姨子", "小姨妹", "妻妹", "小妹儿"],
    "w,ls,h": ["小姨夫", "小姨妹夫", "襟弟", "连襟", "姨夫"],
    //旁支
    xb: ["兄弟"],
    "xb,w,f": ["姻世伯", "亲家爷", "亲爹", "亲伯"],
    "xb,w,f,f": ["姻伯祖/姻叔祖"],
    "xb,w,m": ["姻伯母", "亲家娘", "亲娘"],
    "xb,w,xb": ["姻兄/姻弟"],
    "xb,w,xs": ["姻姐/姻妹"],
    "xb,s": ["侄子", "侄儿", "阿侄"],
    "xb,s,w": ["侄媳", "侄媳妇"],
    "xb,s,s": ["侄孙", "侄孙子"],
    "xb,s,s,w": ["侄孙媳"],
    "xb,s,s,s": ["侄曾孙"],
    "xb,s,s,s,w": ["侄曾孙媳"],
    "xb,s,s,d": ["侄曾孙女"],
    "xb,s,s,d,h": ["侄曾孙女婿"],
    "xb,s,d": ["侄孙女"],
    "xb,s,d,h": ["侄孙女婿", "侄孙婿"],
    "xb,d": ["侄女", "侄囡"],
    "xb,d,h": ["侄女婿", "侄婿"],
    "xb,d,s": ["外侄孙", "外侄孙子", "侄外孙男"],
    "xb,d,s,w": ["外侄孙媳妇"],
    "xb,d,d": ["外侄孙女", "侄外孙女"],
    "xb,d,d,h": ["外侄孙女婿"],
    ob: [
      "哥哥",
      "哥",
      "兄",
      "阿哥",
      "大佬",
      "老哥",
      "兄长",
      "胞哥",
      "大哥",
      "x哥",
    ],
    "ob,w": ["嫂子", "嫂", "嫂嫂", "阿嫂", "兄嫂", "大嫂", "x嫂"],
    "ob,w,f": ["姻伯父"],
    "ob,w,m": ["姻伯母"],
    lb: ["弟弟", "弟", "细佬", "胞弟", "老弟", "x弟"],
    "lb,w": ["弟妹", "弟媳", "弟媳妇", "弟妇", "x弟妹"],
    "lb,w,f": ["姻叔父"],
    "lb,w,m": ["姻叔母"],
    xs: ["姐妹", "姊妹"],
    "xs,h,f": ["姻世伯", "亲家爷", "亲爹", "亲伯"],
    "xs,h,f,f": ["姻伯祖/姻叔祖"],
    "xs,h,m": ["姻伯母", "亲家娘", "亲娘"],
    "xs,h,xb": ["姻兄/姻弟"],
    "xs,h,xs": ["姻姐/姻妹"],
    "xs,s": ["外甥", "甥男", "甥儿", "甥子", "外甥儿", "外甥子", "外甥儿子"],
    "xs,s,w": ["外甥媳妇"],
    "xs,s,s": ["外甥孙", "甥孙男", "甥孙"],
    "xs,s,s,w": ["外甥孙媳妇"],
    "xs,s,s,s": ["外曾甥孙"],
    "xs,s,s,d": ["外曾甥孙女"],
    "xs,s,d": ["外甥孙女", "甥孙女", "甥孙"],
    "xs,s,d,h": ["外甥孙女婿"],
    "xs,s,d,s": ["外曾甥孙"],
    "xs,s,d,d": ["外曾甥孙女"],
    "xs,d": ["外甥女", "外甥囡"],
    "xs,d,h": ["外甥女婿"],
    "xs,d,s": ["外甥孙", "甥孙男", "甥孙", "甥外孙男", "外弥甥"],
    "xs,d,s,w": ["外甥孙媳妇"],
    "xs,d,s,s": ["外曾甥孙"],
    "xs,d,s,d": ["外曾甥孙女"],
    "xs,d,d": ["外甥孙女", "甥孙女", "甥孙", "甥外孙女", "外弥甥女"],
    "xs,d,d,h": ["外甥孙女婿"],
    "xs,d,d,s": ["外曾甥孙"],
    "xs,d,d,d": ["外曾甥孙女"],
    os: ["姐姐", "姐", "家姐", "阿姐", "阿姊", "胞姐", "大姐", "x姐"],
    "os,h": ["姐夫", "姊夫", "姊丈", "姊婿", "大姐夫", "x姐夫"],
    ls: ["妹妹", "妹", "胞妹", "老妹", "x妹"],
    "ls,h": ["妹夫", "妹丈", "妹婿", "x妹夫"],
    //自家
    s: ["儿子", "仔", "阿仔", "仔仔", "x儿子", "孩子", "孩儿"],
    "s,w": ["儿媳妇", "儿媳", "新妇"],
    "s,w,xb": ["姻侄"],
    "s,w,xb,s": ["姻侄孙"],
    "s,w,xb,d": ["姻侄孙女"],
    "s,w,xs": ["姻侄女"],
    "s,w,xs,s": ["姻侄孙"],
    "s,w,xs,d": ["姻侄孙女"],
    "s,s": ["孙子", "孙儿", "x孙子", "孙"],
    "s,s,w": ["孙媳妇", "孙媳"],
    "s,s,w,xb": ["姻家再侄"],
    "s,s,w,xs": ["姻家再侄"],
    "s,s,s": ["曾孙"],
    "s,s,s,w": ["曾孙媳妇"],
    "s,s,s,s": ["玄孙", "元孙", "膀孙"],
    "s,s,s,d": ["玄孙女"],
    "s,s,s,s,s": ["来孙"],
    "s,s,s,s,d": ["来孙女"],
    "s,s,s,s,s,s": ["晜孙"],
    "s,s,s,s,s,d": ["晜孙女"],
    "s,s,s,s,s,s,s": ["仍孙"],
    "s,s,s,s,s,s,d": ["仍孙女"],
    "s,s,s,s,s,s,s,s": ["云孙"],
    "s,s,s,s,s,s,s,d": ["云孙女"],
    "s,s,s,s,s,s,s,s,s": ["耳孙"],
    "s,s,s,s,s,s,s,s,d": ["耳孙女"],
    "s,s,d": ["曾孙女"],
    "s,s,d,h": ["曾孙女婿"],
    "s,s,d,s": ["外玄孙"],
    "s,s,d,d": ["外玄孙女"],
    "s,d": ["孙女", "孙囡"],
    "s,d,h": ["孙女婿", "孙婿"],
    "s,d,h,xb": ["姻家再侄"],
    "s,d,h,xs": ["姻家再侄"],
    "s,d,s": ["曾外孙"],
    "s,d,d": ["曾外孙女"],
    d: [
      "女儿",
      "千金",
      "闺女",
      "女",
      "阿女",
      "女女",
      "掌上明珠",
      "乖囡",
      "囡囡",
      "姑娘",
      "x女儿",
      "孩子",
      "孩儿",
    ],
    "d,h": ["女婿", "姑爷", "女婿子", "女婿儿", "儿婿"],
    "d,h,xb": ["姻侄"],
    "d,h,xb,w": ["姻侄妇"],
    "d,h,xb,s": ["姻侄孙"],
    "d,h,xb,d": ["姻侄孙女"],
    "d,h,xs": ["姻侄女"],
    "d,h,xs,w": ["姻侄女婿"],
    "d,h,xs,s": ["姻侄孙"],
    "d,h,xs,d": ["姻侄孙女"],
    "d,s": ["外孙"],
    "d,s,w": ["外孙媳"],
    "d,s,s": ["外曾孙", "重外孙"],
    "d,s,d": ["外曾孙女", "重外孙女"],
    "d,d": ["外孙女", "外孙囡"],
    "d,d,h": ["外孙女婿"],
    "d,d,s": ["外曾外孙"],
    "d,d,d": ["外曾外孙女"],
    //亲家
    "s,w,m": ["亲家母", "亲家"],
    "s,w,f": ["亲家公", "亲家翁", "亲家"],
    "s,w,f,f": ["太姻翁"],
    "s,w,f,m": ["太姻姆"],
    "s,w,f,ob": ["姻兄", "姻亲"],
    "s,w,f,lb": ["姻弟", "姻亲"],
    "s,w,f,os": ["姻姐", "姻亲"],
    "s,w,f,ls": ["姻妹", "姻亲"],
    "d,h,m": ["亲家母", "亲家"],
    "d,h,f": ["亲家公", "亲家翁", "亲家"],
    "d,h,f,f": ["太姻翁"],
    "d,h,f,m": ["太姻姆"],
    "d,h,f,ob": ["姻兄", "姻亲"],
    "d,h,f,lb": ["姻弟", "姻亲"],
    "s,w,f,os": ["姻姐", "姻亲"],
    "s,w,f,ls": ["姻妹", "姻亲"],
    //其他
    t: ["老师", "师父", "师"],
    "t,w": ["师娘", "师母"],
    "t,t": ["师祖", "师公", "师爷", "太师父"],
    "t,t,t": ["太师祖"],
  };

  //数组去重
  var unique = function (arr) {
    var result = [],
      hash = {};
    var item;
    for (var i = 0; (item = arr[i]) != null; i++) {
      var temp = item.replace(/[ol](?=s|b)/, "x").replace(/&[ol]/, ""); //对特殊语法标识相互包含的行为去重
      if (!hash[item] && !hash[temp]) {
        result.push(item);
        hash[item] = true;
      }
    }
    return result;
  };

  //分词解析
  function getSelectors(str) {
    str = str.replace(/[二|三|四|五|六|七|八|九|十]{1,2}/g, "x");
    var lists = str
      .replace("我", "")
      .replace("家的", "的")
      .replace("家", "的")
      .split("的");
    var result = []; //所有可能性
    var match = true;
    while (lists.length) {
      var name = lists.shift(); //当前匹配词
      var arr = []; //当前匹配词可能性
      var has = false;
      for (var i in _data) {
        var value = _data[i];
        if (value.indexOf(name) > -1) {
          //是否存在该关系
          if (i || !lists.length) {
            //对‘我’的优化
            arr.push(i);
          }
          has = true;
        }
      }
      if (!has) {
        match = false;
      }
      if (result.length) {
        //当前匹配词与之前可能性组合
        var res = [];
        for (var i = 0; i < result.length; i++) {
          for (var j = 0; j < arr.length; j++) {
            res.push(result[i] + "," + arr[j]);
          }
        }
        result = res;
      } else {
        for (var i = 0; i < arr.length; i++) {
          result.push("," + arr[i]);
        }
      }
    }
    return match ? result : [];
  }

  //简化选择器
  function selector2id(selector, sex) {
    var result = [];
    var hash = {};
    if (sex < 0) {
      //如果自己的性别不确定
      if (selector.indexOf(",w") == 0) {
        sex = 1;
      } else if (selector.indexOf(",h") == 0) {
        sex = 0;
      }
    }
    if (sex > -1) {
      selector = "," + sex + selector;
    }
    if (selector.match(/,[w0],w|,[h1],h/)) {
      //同志关系去除
      return false;
    }
    var getId = function (selector) {
      var s = "";
      if (!hash[selector]) {
        hash[selector] = true;
        var status = true;
        do {
          s = selector;
          for (var i in _filter) {
            var item = _filter[i];
            // console.log('filter#',item['exp'],selector);
            selector = selector.replace(item["exp"], item["str"]);
            if (selector.indexOf("#") > -1) {
              var arr = selector.split("#");
              for (var j = 0; j < arr.length; j++) {
                getId(arr[j]);
              }
              status = false;
              break;
            }
          }
        } while (s != selector);
        if (status) {
          if (selector.match(/,[w0],w|,[h1],h/)) {
            //同志关系去除
            return false;
          }
          selector = selector.replace(/,[01]/, "").substr(1); //去前面逗号和性别信息
          result.push(selector);
        }
      }
    };
    getId(selector);
    return unique(result);
  }

  //获取数据
  function getDataById(id) {
    var items = [];
    var filter = /&[olx]/g; //忽略属性
    var getData = function (d) {
      var res = [];
      for (var i in _data) {
        if (i.replace(filter, "") == d) {
          res.push(_data[i][0]);
        }
      }
      return res;
    };
    if (_data[id]) {
      //直接匹配称呼
      items.push(_data[id][0]);
    } else {
      items = getData(id);
      if (!items.length) {
        //忽略年龄条件查找
        id = id.replace(/&[ol]/g, "");
        items = getData(id);
      }
      if (!items.length) {
        //忽略年龄条件查找
        id = id.replace(/[ol]/g, "x");
        items = getData(id);
      }
      if (!items.length) {
        //缩小访问查找
        var l = id.replace(/x/g, "l");
        items = getData(l);
        var o = id.replace(/x/g, "o");
        items = items.concat(getData(o));
      }
    }
    return items;
  }

  //逆转ID
  function reverseId(id, sex) {
    var hash = {
      f: ["d", "s"],
      m: ["d", "s"],
      h: ["w", ""],
      w: ["", "h"],
      s: ["m", "f"],
      d: ["m", "f"],
      lb: ["os", "ob"],
      ob: ["ls", "lb"],
      xb: ["xs", "xb"],
      ls: ["os", "ob"],
      os: ["ls", "lb"],
      xs: ["xs", "xb"],
    };
    var age = "";
    if (id.indexOf("&o") > -1) {
      age = "&l";
    } else if (id.indexOf("&l") > -1) {
      age = "&o";
    }
    if (id) {
      id = id.replace(/&[ol]/g, "");
      sex = sex ? 1 : 0; //逆转运算自身性别必须确定
      var sid = ("," + sex + "," + id)
        .replace(/,[fhs]|,[olx]b/g, ",1")
        .replace(/,[mwd]|,[olx]s/g, ",0");
      sid = sid.substring(0, sid.lastIndexOf(","));
      var id_arr = id.split(",").reverse();
      var sid_arr = sid.split(",").reverse();
      var arr = [];
      for (var i = 0; i < id_arr.length; i++) {
        arr.push(hash[id_arr[i]][sid_arr[i]]);
      }
      return arr.join(",") + age;
    }
    return "";
  }

  //获取关系链条
  function getChainById(id) {
    var arr = id.split(",");
    var items = [];
    for (var i = 0; i < arr.length; i++) {
      var key = arr[i].replace(/&[ol]/, "");
      items.push(_data[key][0]);
    }
    return items.join("的");
  }

  return function (parameter) {
    var options = {
      text: "",
      sex: -1,
      type: "default", //为'chain'时,reverse无效
      reverse: false,
    };
    for (var p in parameter) {
      options[p] = parameter[p];
    }
    var selectors = getSelectors(options.text);
    // console.log('selectors#',selectors);
    var result = []; //匹配结果
    for (var i = 0; i < selectors.length; i++) {
      //遍历所有可能性
      var ids = selector2id(selectors[i], options.sex);
      // console.log('ids#',ids);
      for (var j = 0; j < ids.length; j++) {
        var id = ids[j];
        if (options.type == "chain") {
          var item = getChainById(id);
          if (item) {
            result.push(item);
          }
        } else {
          if (options.reverse) {
            id = reverseId(id, options.sex);
          }
          var items = getDataById(id);
          if (items.length) {
            result = result.concat(items);
          } else if (id.indexOf("w") == 0 || id.indexOf("h") == 0) {
            //找不到关系，随爱人叫
            items = getDataById(id.substr(2));
            if (items.length) {
              result = result.concat(items);
            }
          }
        }
      }
    }
    return unique(result);
  };
});
