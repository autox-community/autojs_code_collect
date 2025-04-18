/*
 * @Author: NickHopps
 * @Last Modified by: NickHopps
 * @Last Modified time: 2019-03-16 17:50:17
 * @Description: 文件更新（下载进度条显示）
 */

importClass(java.io.File);
importClass(java.io.IOException);
importClass(java.io.InputStream);
importClass(java.io.FileOutputStream);
importClass(java.security.MessageDigest);

/**
 * 向服务器查询可更新的文件列表
 *
 * @param {*} server 提供更新文件的服务器地址
 * @param {*} path 本地需要更新文件的目录路径
 */
function GetUpdateList(server, path) {
  const _server = server,
    _path = path,
    _processor = "服务器上的处理程序";

  let _ignore_list = [];

  const _generate_md5 = function (file) {
    let md5 = MessageDigest.getInstance("MD5");
    let hex = [];
    md5.update(file);
    md5.digest().forEach((byte) => {
      let temp = (0xff & byte).toString(16);
      while (temp.length < 2) temp = "0" + temp;
      hex.push(temp);
    });
    return hex.join("");
  };

  const _generate_postdata = function func(path, data) {
    data = data || {};
    files.listDir(path).forEach(function (file_name) {
      let new_path = files.join(path, file_name);
      if (_ignore_list.indexOf(file_name) < 0) {
        if (!files.isDir(new_path)) {
          let file = files.readBytes(new_path);
          data[file_name] = _generate_md5(file);
        } else {
          func(new_path, data);
        }
      }
    });
    return data;
  };

  return {
    get ignore_list() {
      return _ignore_list;
    },
    set ignore_list(arr) {
      _ignore_list = arr;
    },
    get_updateList: function () {
      const postdata = _generate_postdata(_path);
      if (Object.keys(postdata).length > 0) {
        let url = files.join(_server, _processor);
        let res = http.postJson(url, postdata);
        if (res.statusCode != 200) {
          toastLog("请求失败: " + res.statusCode + " " + res.statusMessage);
        } else {
          return res.body.json();
        }
      } else {
        toastLog("无法获取本地文件信息");
      }
    },
  };
}

/**
 * 下载工具类，可监听下载进度
 *
 * @param {*} url 下载链接
 * @param {*} path 保存地址
 * @param {*} listener 下载监听
 */
function DownloadUtil(url, path, listener) {
  const _url = url,
    _path = path,
    _listener = listener;

  let _len = -1,
    _temp = 0,
    _total_bytes = 0,
    _input_stream = null,
    _output_stream = null,
    _file_temp = null,
    _buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);

  return {
    download: function () {
      let client = new OkHttpClient();
      let request = new Request.Builder().url(_url).get().build();
      client.newCall(request).enqueue(
        new Callback({
          onFailure: function (call, err) {
            toast("请求失败");
            console.error("请求失败：" + err);
          },
          onResponse: function (call, res) {
            try {
              if (res.code() != 200) throw res.code() + " " + res.message();
              _total_bytes = res.body().contentLength();
              _input_stream = res.body().byteStream();
              _file_temp = new File(_path);
              _output_stream = new FileOutputStream(_file_temp);
              while ((_len = _input_stream.read(_buffer)) != -1) {
                _output_stream.write(_buffer, 0, _len);
                _listener.onDownloading(((_temp += _len) / _total_bytes) * 100);
              }
              _output_stream.flush();
              _listener.onDownloadSuccess(_file_temp);
            } catch (err) {
              _listener.onDownloadFailed(err);
            } finally {
              try {
                if (_input_stream != null) _input_stream.close();
              } catch (err) {
                toast("文件流处理失败");
                console.error("文件流处理失败：" + err);
              }
            }
          },
        }),
      );
    },
  };
}

(function main() {
  let get_update_list = new GetUpdateList("服务器地址", "本地查询更新的文件");
  get_update_list.ignore_list = [".", "..", ".git"]; // 忽略更新的目录
  let update_list = get_update_list.get_updateList(); // 获取可更新文件，应该返回一个包含可更新文件相对路径的数组

  if (update_list.length) {
    // 这里进行多文件下载的处理
  } else {
    toastLog("当前已经是最新版本了");
  }

  // 单文件下载示例
  let downloadDialog = null;
  let url = "下载地址"; // http://xxx/x.jpg
  let path = "本地保存地址"; // ./x.jpg
  dialogs
    .build({
      title: "发现新版本",
      content: "下载提示框中的文本内容",
      positive: "更新",
      negative: "取消",
    })
    .on("positive", () => {
      downloadDialog = dialogs
        .build({
          title: "更新中...",
          negative: "取消",
          progress: {
            max: 100,
            showMinMax: true,
          },
          autoDismiss: false,
        })
        .on("negative", () => {
          downloadDialog.dismiss();
          downloadDialog = null;
        })
        .show();

      new DownloadUtil(url, path, {
        onDownloadSuccess: function (file) {
          downloadDialog.dismiss();
          downloadDialog = null;
          toastLog("更新完成");
        },
        onDownloading: function (progress) {
          downloadDialog.setProgress(progress);
        },
        onDownloadFailed: function (err) {
          toast("下载失败");
          console.error("下载失败：" + err);
        },
      }).download();
    })
    .show();
})();
