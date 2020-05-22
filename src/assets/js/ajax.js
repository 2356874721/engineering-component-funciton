/*
 * 请求参数说明：
 * url:请求地址
 * method:请求方式 get或post
 * dataType:服务器返回的数据类型 默认json,为jsonp时可做跨域请求
 * data:请求参数
 * success:请求成功的回调函数
 * fail:请求失败的回调函数
 * jsonp:跨域请求回调函数
 * async:请求是否是异步的
 */
export function ajax(params) {
  params = params || {};
  params.dataType === "jsonp" ? jsonp(params) : json(params);

  function json(options) {
    options.url = options.url || "";
    options.method = (options.method && options.method.toLowerCase()) || "get";
    options.data = options.data || {};
    options.success = options.success || "";
    options.fail = options.fail || "";
    options.async = options.async || true;

    // 参数拼接和参数序列化
    const query = [];
    for (const p of Object.keys(options.data)) {
      query.push(p + "=" + options.data[p]); // 得到["name=lwj","age=10"]这样的数组
    }
    options.data = query.join("&"); // 序列化name=lwj&age=26

    // 区分是get还是post请求，get请求，把参数拼接到url上
    if (options.method == "get") {
      options.url =
        options.url +
        (options.url.indexOf("?") == -1
          ? "?" + options.data
          : "&" + options.data);
    }

    // 创建XHR请求步骤如下
    // 1、创建XMLHttpRequest对象
    let xhr = window.XMLHttpRequest
      ? new XMLHttpRequest()
      : new ActiveXObject("Microsoft.XMLHTTP");

    // 2、open open(method,url,async)
    xhr.open(options.method, options.url, options.async);

    // 3、如果是post请求，要设置请求头 4、send发送请求
    if (options.method == "post") {
      xhr.setRequestHeader(
        "Content-Type",
        "application/x-www-form-urlencoded;charset=UTF-8"
      );
      xhr.send(options.data);
    } else {
      xhr.send(null);
    }

    // 5、监听返回
    if (options.async) {
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          // 请求完成，响应已经就绪
          callback();
        }
      };
    } else {
      callback();
    }

    function callback() {
      if (xhr.status == 200) {
        options.success &&
          typeof options.success == "function" &&
          options.success(JSON.parse(xhr.responseText));
      } else {
        options.fail &&
          typeof options.fail == "function" &&
          options.fail({
            // 针对错误的返回业务可以根据不同的状态码来做不同的处理
            status: xhr.status,
            msg: xhr.statusText,
          });
      }
    }
  }

  function jsonp(options) {
    callbackName = "callback_name_" + new Date().getTime();
    if (options.jsonp) {
      callbackName = options.jsonp + "_" + callbackName;
    }

    // 设置回调函数名
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    head.appendChild(script);
    options.data["callback"] = callbackName;
    var data = formatParams(params.data);

    // 发送请求
    if (options.url.indexOf("?") == -1) {
      script.src = options.url + "?" + data;
    } else {
      script.src = options.url + "&" + data;
    }

    // jsonp回调函数处理
    window[callbackName] = function(json) {
      head.removeChild(script);
      clearTimeout(script.timer);
      window[callbackName] = null;
      params.success && params.success(json);
    };

    // 设置超时处理
    if (params.time) {
      script.timer = setTimeout(function() {
        window[callbackName] = null;
        head.removeChild(script);
        params.error &&
          params.error({
            message: "超时",
          });
      }, time);
    }
  }

  // 格式化参数
  function formatParams(data) {
    var arr = [];
    for (var name in data) {
      arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    }
    // 添加一个随机数，防止缓存
    arr.push("v=" + random());
    return arr.join("&");
  }

  // 获取随机数
  function random() {
    return Math.floor(Math.random() * 10000 + 800);
  }
}

