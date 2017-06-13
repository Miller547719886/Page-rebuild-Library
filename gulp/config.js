module.exports = function () {
  var config = {
  	DEST:"build",                                 // 编译目录 
	CSS_DEST: "var/build/css",                    // css编译目录
	JS_DEST: "var/js",                           // js编译目录
	IMG_DEST: "var/img/minified",                // img编译目录
	HTML_DEST: "var/build/html",                       // html编译目录
	WEB_PORT: 80,                                // 服务器监听的端口
  };
  return config;
};