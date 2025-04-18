"ui";
//by @Mannix_Wu
//QQ:3068758340
//修改来自:1811588980
ui.layout(
  <vertical>
    <canvas id="board" layout_weight="1" />
  </vertical>,
);
var degree = {
  x: 0,
  y: 0,
  z: 0,
};
var offset = {
  x: 0,
  y: 1000,
};

var star = new Array();
var count = 500;
var size = 2000;
for (let i = 0; i < count; i++) {
  let xy = RToxy(Math.random() * Math.PI * 2);
  let ss = getsd(Math.random() * size, xy);
  star.push(ss[0], ss[1]);
}
var paint = new Paint();
paint.setColor(colors.WHITE);
paint.setStrokeWidth(2);

var Y = 0;
var ASX = new XYToMatrix(null, 3);

ui.board.setMaxFps(60);
ui.board.on("draw", function (canvas) {
  let w = canvas.getWidth();
  let h = canvas.getHeight();
  canvas.translate(w / 2, h / 2);
  canvas.rotate(Y);
  Y += 0.3;
  let matrix = canvas.getMatrix();
  //绘制背景色
  canvas.drawColor(colors.argb(25, 0, 0, 0));
  matrix.postConcat(ASX.matrix);
  canvas.setMatrix(matrix);
  canvas.drawPoints(star, paint);
});

ui.board.setOnTouchListener(ASX.touchListener);

sensors
  .register("gyroscope", sensors.delay.game)
  .on("change", (event, azimuth, pitch, roll) => {
    degree.x = azimuth;
    degree.y = pitch;
    if (pitch < -90) {
      a = -roll - 180;
    } else if (pitch > 90) {
      a = -roll + 180;
    } else {
      a = roll;
    }
    degree.z = a;
  });

function RToxy(R) {
  var x = Math.cos(R);
  var y = Math.sin(R);
  return [x, y];
}

function weiyi(ary) {
  var sum = 0;
  for (var i = 0; i < ary.length; i++) {
    sum += Math.pow(ary[i], 2);
  }
  return Math.sqrt(sum);
}

function getsd(s, ary) {
  var sum = weiyi(ary);
  var S = s / sum;
  for (var i = 0; i < ary.length; i++) {
    ary[i] = ary[i] * S;
  }
  return ary;
}

function XYToMatrix(matrix, maxPoints) {
  this.matrix = matrix || new android.graphics.Matrix();
  this.invertMatrix = new android.graphics.Matrix();
  this.matrix.invert(this.invertMatrix);
  this.getScaling = function (ary) {
    ary = Array.isArray(ary) ? ary : [0, 0, 100, 100];
    try {
      var Ary = this.matrixPoints(this.matrix, ary);
      return this.weiyi([Ary[2] - Ary[0], Ary[3] - Ary[1]]) / this.weiyi(ary);
    } catch (e) {
      toastLog(e);
    }
  };
  this.maxPoints = maxPoints || 2;
  this.maxPointsListener = () => {};
  this.Touch = {
    Matrix: this.matrix,
    PointStart: new Array(),
    PointCurrent: new Array(),
  };
  this.touchListener = new android.view.View.OnTouchListener((view, event) => {
    try {
      var W = view.getWidth();
      var H = view.getHeight();
      var PC = event.getPointerCount();
      switch (event.getActionMasked()) {
        case event.ACTION_MOVE:
          try {
            for (let i = 0; i < PC; i++) {
              let id = event.getPointerId(i);
              let x = event.getX(i);
              let y = event.getY(i);
              this.Touch.PointCurrent[i * 2] = x;
              this.Touch.PointCurrent[i * 2 + 1] = y;
            }

            //记录当前各手指坐标信息。
            if (PC > this.maxPoints) {
              //手指数大于4个虽然记录坐标信息，但是不进行矩阵操作。
              this.maxPointsListener(view, event);
              break;
            }

            var Matrix = new android.graphics.Matrix();
            Matrix.setPolyToPoly(
              this.Touch.PointStart,
              0,
              this.Touch.PointCurrent,
              0,
              PC > 4 ? 4 : PC,
            );
            this.matrix = new android.graphics.Matrix();
            this.matrix.setConcat(Matrix, this.Touch.Matrix);
            //进行矩阵运算并刷新矩阵。
            this.matrix.invert(this.invertMatrix);
            //反矩阵
          } catch (e) {
            throw "MOVE " + e;
          }

          break;
        case event.ACTION_CANCEL:
          //log("CANCEL");
          this.Touch.PointStart = new Array();
          this.Touch.PointCurrent = new Array();

          break;
        case event.ACTION_OUTSIDE:
          //log("OUTSIDE");

          break;
        default:
          var I = Math.floor(event.getAction() / 256);
          var ID = event.getPointerId(I);
          var X = event.getX(I);
          var Y = event.getY(I);
          switch (event.getActionMasked()) {
            case event.ACTION_DOWN:
              try {
                log("down");
                //当有新的手指按下时使坐标差为零。//开始新的多指矩阵运算方式
                this.Touch.PointStart.splice(I * 2, 0, X, Y);
                this.Touch.PointCurrent.splice(I * 2, 0, X, Y);
                this.Touch.Matrix = this.matrix;
                //log(this.Touch.Matrix);
              } catch (e) {
                throw "DOWN " + e;
              }
              break;
            case event.ACTION_UP:
              //最后一个手指抬起。
              log("up");
              this.Touch.PointStart = new Array();
              this.Touch.PointCurrent = new Array();

              break;
            case event.ACTION_POINTER_DOWN:
              log("POINTER_DOWN");
              try {
                //当有新的手指按下时使坐标差为零。//开始新的多指矩阵运算方式
                this.Touch.PointStart.splice(I * 2, 0, X, Y);
                this.Touch.PointCurrent.splice(I * 2, 0, X, Y);
                //获取点的总数量。
                this.Touch.Matrix = this.matrix;
                for (let i = 0; i < PC; i++) {
                  this.Touch.PointStart[i * 2] = this.Touch.PointCurrent[i * 2];
                  this.Touch.PointStart[i * 2 + 1] =
                    this.Touch.PointCurrent[i * 2 + 1];
                }
                //保存坐标的数组。
                if (PC > this.maxPoints) {
                  //手指数大于4个化为原始矩阵虽然记录坐标信息，但是不进行矩阵操作。
                  this.maxPointsListener(view, event);
                  break;
                }

                var Matrix = new android.graphics.Matrix();
                Matrix.setPolyToPoly(
                  this.Touch.PointStart,
                  0,
                  this.Touch.PointCurrent,
                  0,
                  PC > 4 ? 4 : PC,
                );
                this.matrix = new android.graphics.Matrix();
                this.matrix.setConcat(Matrix, this.Touch.Matrix);
                //进行矩阵运算并刷新矩阵。
                this.matrix.invert(this.invertMatrix);
                //反矩阵
              } catch (e) {
                throw "P_DOWN " + e;
              }

              break;
            case event.ACTION_POINTER_UP:
              log("POINTER_UP");
              try {
                this.Touch.Matrix = this.matrix;
                for (let i = 0; i < PC; i++) {
                  this.Touch.PointStart[i * 2] = this.Touch.PointCurrent[i * 2];
                  this.Touch.PointStart[i * 2 + 1] =
                    this.Touch.PointCurrent[i * 2 + 1];
                }
                this.Touch.PointStart.splice(I * 2, 2);
                this.Touch.PointCurrent.splice(I * 2, 2);
              } catch (e) {
                throw "P_UP " + e;
              }
              break;
          }
      }
    } catch (e) {
      throw "imgTouch: " + e;
    }

    return true;
  });

  this.matrixPoints = function (matrix, ary) {
    //通过矩阵运算坐标数组。但是需要转换为浮点数组。
    var ary = this.toJavaArray("float", ary);
    matrix.mapPoints(ary);
    return this.toJsArray(ary);
  };
  this.toJavaArray = function (type, ary) {
    //var Ary = java.lang.reflect.Array.newInstance(		java.lang.Float.TYPE, 4);
    var Ary = util.java.array(type, ary.length);
    for (let i in ary) {
      Ary[i] = ary[i];
    }
    return Ary;
  };
  this.toJsArray = function (ary) {
    var Ary = new Array(ary.length);
    for (let i in ary) {
      Ary[i] = ary[i];
    }
    return Ary;
  };
  this.getsd = (s, ary) => {
    var sum = this.weiyi(ary);
    var S = s / sum || 0;
    for (var i = 0; i < ary.length; i++) {
      ary[i] = ary[i] * S;
    }
    return ary;
  };
  this.weiyi = function (ary) {
    var sum = 0;
    for (var i = 0; i < ary.length; i++) {
      sum += Math.pow(ary[i], 2);
    }
    return Math.sqrt(sum);
  };
  this.kdfx = function (Y) {
    var x = Math.cos(((Y % 360) / 360) * 2 * Math.PI);
    var y = Math.sin(((Y % 360) / 360) * 2 * Math.PI);
    return [x, y];
  };
  this.ydfx = (ary) => {
    var ary = this.getsd(1, ary);
    var x = ary[0],
      y = ary[1];
    var Y = (Math.asin(y) / (2 * Math.PI)) * 360;
    if (x < 0) {
      Y = 180 - Y;
    }
    return Y;
  };
}
