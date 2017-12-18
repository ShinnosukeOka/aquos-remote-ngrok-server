var ngrok = require('ngrok');
var express = require('express');
var Aquos = require('sharp-aquos-remote-control').Aquos;

// AQUOS接続のための設定
// TODO: IPアドレス、ポート番号、ユーザーID、パスワードを入力する
var gw = new Aquos('192.168.xxx.xxx', 10002, 'UserID', 'Password');
var webapp = express();

// 電源をつける操作のエンドポイント 
webapp.get('/turnon', function(req, res) {
    gw.power(true, function(err, data) {
        console.log("power on.");
        res.send("power on finished.");
        return;
    });
});

// 電源を消す操作のエンドポイント 
webapp.get('/turnoff', function(req, res) {
    gw.power(false, function(err, data) {
        console.log("power off.");
        res.send("power off finished.");
        return;
    });
});

// サーバーの作成及び、ngrokを使用してサーバーを公開する
var server = webapp.listen(process.env.EXPRESS_PORT, function() {
    var host = server.address().address,
        port = server.address().port;

    console.log('listening at http://%s:%s', host, port);
    ngrok.connect({
        port: port
    },
    function (err, url) {
        gw.connect(function(err) {
            if (err) {
                console.log(err);
                return;
            }
        });
        console.log(url);
    });
});