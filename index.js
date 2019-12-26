// 需要提前 npm 安装的 nodeJS 两个依赖包
// npm install request request-promise --save
// npm install cheerio --save

// 用于操作本地文件的包
const fs = require('fs');
// 这个是 nodeJS 中用于发请求的包，类似网页编程时候的 axios
const request = require('request-promise');
// 把html文本解析成类似 jquery 方式选取内容
const cheerio = require('cheerio');

const urls = [
    'http://wufazhuce.com/one/2676',
    'http://wufazhuce.com/one/2675',
    'http://wufazhuce.com/one/2674',
    'http://wufazhuce.com/one/2673',
    'http://wufazhuce.com/one/2672',
    'http://wufazhuce.com/one/2671',
];

async function getData(url){
    // 利用 request 发送请求，获取页面
    const page = await request.get(url);
    // console.log(page);
    // 利用 cheerio 把 html 字符串解析可以用 jQuery 方式选取数据的对象
    const $ = cheerio.load(page);

    // 获取页面关键数据
    const img_src =  $('.one-imagen img').attr('src');
    const vol =  $('.one-titulo').text().trim();
    const type =  $('.one-imagen-leyenda').text().trim();
    const cita =  $('.one-cita').text().trim();
    const time =  +new Date($('.one-pubdate').text().trim());

    // 内部返回一个 obj 对象
    return {
        img_src,
        vol,
        type,
        cita,
        time
    }
}

urls.forEach(v=>{
    // 调用封装好获取数据的函数
    getData(v)
    // 获取数据成功
    .then(res=>{
        // 文件追加
        fs.appendFile('./one.json',JSON.stringify(res) + '\n',err=>{
            // 保存文件的错误捕获
            if(err){
                console.log(err.message,'数据保存错误');
            }else{
                console.log(v,'数据保存成功');
            }
        })
    })
    // 请求错误的捕获
    .catch(err=>{
        console.log(v,err.message,'请求失败');
    })
});
// debugger;

