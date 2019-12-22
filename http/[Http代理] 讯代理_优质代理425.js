/**
 * Ѷ���� ���ʴ��� ʾ��
 * ��֧�ֶ��̻߳�ȡ
 * �ű��еĶ��� ��Ч���ڽ�ֹ��: 2018-10-15 15:28 ���ں󽫲�����
 * Ѷ�����ٷ���վ: http://www.xdaili.cn?invitationCode=254F07B05E464EEF9C76FAA4E66D5503
 */

var spiderId = "7ab204de5b7e403caada6398f29c2831"; //spiderId
var orderNo = "YZ20188145457DGCJTP"; //������

var getIp_api = http.get("http://pv.sohu.com/cityjson?ie=utf-8");
var InetIP = getIp_api.body.string();
eval(InetIP);
log("ʹ�ô���ǰ������IP:" + returnCitySN.cip);

var xdailiUrl =
  "http://api.xdaili.cn/xdaili-api//greatRecharge/getGreatIp?spiderId=" +
  spiderId +
  "&orderno=" +
  orderNo +
  "&returnType=2&count=1";

for (let i = 0; i < 3; i++) {
  try {
    var getProxy_json = http.get(xdailiUrl).body.json();

    if (
      getProxy_json.ERRORCODE == "10036" ||
      getProxy_json.ERRORCODE == "10038" ||
      getProxy_json.ERRORCODE == "10055"
    ) {
      throw {
        code: "-1",
        msg: "��ȡ�ٶȹ���",
      };
    }
    if (getProxy_json.ERRORCODE == "10036") {
      throw {
        code: "-2",
        msg: "��ȡ�����Ѵ�����",
      };
    }
    break;
  } catch (e) {
    if (e.code == "-1") {
      log(e.msg);
      sleep(5000);
    }
    if (e.code == "-2") {
      log(e.msg);
      exit();
    }
    if (i == 2) {
      //����3�κ�,û���õ�IP�ͶϿ� �������
      log("������δ֪����,��������...");
      exit();
    }
  }
}

// log(getProxy_json);
var xdaili_proxyIP = getProxy_json.RESULT[0].ip;
var xdaili_proxyPort = parseInt(getProxy_json.RESULT[0].port);
// log(xdaili_proxyIP+":"+xdaili_proxyPort);

httpProxy(xdaili_proxyIP, xdaili_proxyPort);

var getIp_api = http.get("http://pv.sohu.com/cityjson?ie=utf-8");
var InetIP = getIp_api.body.string();
eval(InetIP);
log("ʹ�ô����������IP:" + returnCitySN.cip);

function httpProxy(url, prot) {
  var Proxy = java.net.Proxy;
  var InetSocketAddress = java.net.InetSocketAddress;
  var okhttp = new Packages.okhttp3.OkHttpClient.Builder().proxy(
    new Proxy(Proxy.Type.HTTP, new InetSocketAddress(url, prot)),
  );
  http.__okhttp__.muteClient(okhttp);
}
