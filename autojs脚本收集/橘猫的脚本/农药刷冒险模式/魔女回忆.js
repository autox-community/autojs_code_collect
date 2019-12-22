auto();
requestScreenCapture();
//打开魔女回忆的副本(挂机能过的难度)
//先跑一遍，打开自动，记下阿狸第一次说话是什么时候。
var 等待 = dialogs.input("阿狸第一次说话是多少秒？", "50");
var 次数 = dialogs.input("要刷多少次？", "60");

for (x = 0; x < 次数; x++) {
  cg();
  sleep(等待 * 1000);
  tg();
  sleep(3000);
  tg();
  sleep(1000);
  dj();
  sleep(1000);
  zc();
  sleep(1000);
}

function tg() {
  for (let a = 0; a < 10; a++) {
    var 跳过 = images.read("./tg.jpg");
    var t = findImage(captureScreen(), 跳过);
    if (t) {
      let x = t.x + random(1, 跳过.width * 0.9),
        y = t.y + random(1, 跳过.height * 0.9);
      click(x, y);
      break;
    } else {
      toast("没找到");
      sleep(500);
    }
  }
}

function cg() {
  do {
    var 闯关 = images.read("./cg.jpg");
    var c = findImage(captureScreen(), 闯关);
    if (c) {
      let x = c.x + random(1, 闯关.width * 0.9),
        y = c.y + random(1, 闯关.height * 0.9);
      click(x, y);
    } else {
      toastLog("加载中");
      sleep(500);
    }
  } while (!c);
}

function dj() {
  do {
    var 点击 = images.read("./dj.jpg");
    var d = findImage(captureScreen(), 点击);
    if (d) {
      sleep(500);
      let x = random(50, 点击.width * 0.9),
        y = random(50, 点击.height * 0.9);
      click(x, y);
    } else {
      sleep(500);
    }
  } while (!d);
}

function zc() {
  do {
    var 再次 = images.read("./zc.jpg");
    var z = findImage(captureScreen(), 再次);
    if (z) {
      let x = z.x + random(1, 再次.width * 0.9),
        y = z.y + random(1, 再次.height * 0.9);
      click(x, y);
    } else {
      sleep(500);
    }
  } while (!z);
}
