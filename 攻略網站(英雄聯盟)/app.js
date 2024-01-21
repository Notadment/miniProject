var express = require("express");
var cors = require("cors");
var bodyParser = require('body-parser');
var app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

var fs = require("fs");
// var heroFileName = "./hero.json";
var dataFileName = "./data.json";

app.listen(8000);
console.log("連接網站: localhost:8000");
console.log("「Ctrl + C」可結束伺服器程式.");

// 文章資料庫
app.get("/title/list/", function (req, res) {
    var username = req.query.username;  // 從查詢參數中獲取使用者名稱
    var data = fs.readFileSync(dataFileName);
    var purpList = JSON.parse(data);
    res.set('Content-type', 'application/json');
    res.send(JSON.stringify(purpList));
});


// 找出purpList 內的其中一筆資料列
app.get("/title/item/:id", function (req, res) {
    var data = fs.readFileSync(dataFileName);
    var purpList = JSON.parse(data);
    var targetIndex = -1;
    for (let i = 0; i < purpList.length; i++) {
        if (purpList[i].titleId.toString() == req.params.id.toString()) {
            targetIndex = i;
            break;
        }
    }
    if (targetIndex < 0) {
        res.send("not found");
        return;
    }
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(purpList[targetIndex]));
});

// 新增文章
app.post("/title/create", function (req, res) {
    var data = fs.readFileSync(dataFileName);
    var purpList = JSON.parse(data);

    var item = {
        "titleId": new Date().getTime(),
        "enChamp": req.body.enChamp,//$(".champ").prop("id"),
        "cnChamp": req.body.cnChamp,//$(".figcaption").text(),
        "src": req.body.src, // 設定圖片路徑
        "author": req.body.author,
        "title": req.body.title,
        "upTotal": 0,
        "downTotal": 0,
        "contentTxt": req.body.contentTxt,
        "titleTime": req.body.titleTime
    }
    purpList.push(item);
    fs.writeFileSync("./data.json", JSON.stringify(purpList, null, "\t"))
    res.send("資料已傳入");
});





// 登入網頁
app.post('/login', (req, res) => {
    const { username } = req.body;

    // 簡單起見，始終返回登入成功
    res.json({ success: true, username: username });
});





// 顯示標題內文
// 處理 /ArticlePage 的 GET 請求
app.get('/ArticlePage', (req, res) => {
    const articleId = req.query.id; // 從查詢參數中獲取 id
    const article = articles.find(a => a.id == articleId); // 在文章陣列中找到對應的文章

    if (article) {
        // 如果找到文章，回傳 JSON 格式的文章資料
        res.json(article);
    } else {
        // 如果找不到文章，回傳 404 Not Found
        res.status(404).send('Article not found');
    }
});

// 編輯文章
app.put("/title/item", function (req, res) {
    var data = fs.readFileSync(dataFileName);
    var purpList = JSON.parse(data);
    for (let i = 0; i < purpList.length; i++) {
        if (purpList[i].titleId == req.body.titleId) {
            purpList[i].enChamp = req.body.enChamp;
            purpList[i].cnChamp = req.body.cnChamp;
            purpList[i].src = req.body.src;
            purpList[i].title = req.body.title;
            purpList[i].author = req.body.author;
            purpList[i].contentTxt = req.body.contentTxt;
            purpList[i].titleTime = req.body.titleTime;
            break;
        }
    }
    fs.writeFileSync("./data.json", JSON.stringify(purpList, null, "\t"));
    res.send("row updated.");
})


// 定義一個等待指定時間的函數
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

app.delete("/title/delete/:id", async function (req, res) {
    try {
        var data = fs.readFileSync(dataFileName);
        var purpList = JSON.parse(data);

        var deleteIndex = -1;
        for (let i = 0; i < purpList.length; i++) {
            if (purpList[i].titleId.toString() == req.params.id.toString()) {
                deleteIndex = i;
                break;
            }
        }
        if (deleteIndex < 0) {
            res.send("not found");
            return;
        }

        purpList.splice(deleteIndex, 1);
        fs.writeFileSync("./data.json", JSON.stringify(purpList, null, "\t"));

        // 使用 Promise 和 async/await 實現延遲效果
        await delay(1000);

        res.send("row deleted.");
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});


