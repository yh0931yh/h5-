// 商品信息
//idx 商品的id
window.gId=0;
var product={};
var products=[
    {"id":"1","name":"限量抢99元课时包","category":"英语","imgUrl":"../imgs/index/Bitmap Copy@2x.png","detailUrl":"../imgs/index/Bitmap Copy@2x.png",
    "price":"99","originPrice":"1299","tags":["2-8岁","全上海通用"],"remainNumber":"200","buyNeedKnow":{"validity":["2019-01-01","2019-12-31"],"useFlow":"第一步到门店核销码券，第二步预约课程，第三步上课",
            "needKnow":"该券为优惠特价，视频教程不可以退换"},"productDetail":"这是商品详情信息，详情信息"
    },
    {"id":"2","name":"100元美丽英文客堂","category":"英语","imgUrl":"../imgs/index/Bitmap Copy@2x.png","detailUrl":"../imgs/index/Bitmap Copy@2x.png",
        "price":"99","originPrice":"1299","tags":["2-8岁","全上海通用"],"remainNumber":"200","buyNeedKnow":{"validity":["2019-01-01","2019-12-31"],"useFlow":"第一步到门店核销码券，第二步预约课程，第三步上课",
            "needKnow":"该券为优惠特价，视频教程不可以退换"},"productDetail":"这是商品详情信息，详情信息"
    },
    {"id":"3","name":"99元思维导图","category":"数学","imgUrl":"../imgs/index/Bitmap Copy@2x.png","detailUrl":"../imgs/index/Bitmap Copy@2x.png",
        "price":"99","originPrice":"1299","tags":["2-8岁","全上海通用"],"remainNumber":"200","buyNeedKnow":{"validity":["2019-01-01","2019-12-31"],"useFlow":"第一步到门店核销码券，第二步预约课程，第三步上课",
            "needKnow":"该券为优惠特价，视频教程不可以退换"},"productDetail":"这是商品详情信息，详情信息"
    },
    {"id":"4","name":"书法练习版","category":"国学","imgUrl":"../imgs/index/Bitmap Copy@2x.png","detailUrl":"../imgs/index/Bitmap Copy@2x.png",
        "price":"99","originPrice":"1299","tags":["2-8岁","全上海通用"],"remainNumber":"200","buyNeedKnow":{"validity":["2019-01-01","2019-12-31"],"useFlow":"第一步到门店核销码券，第二步预约课程，第三步上课",
            "needKnow":"该券为优惠特价，视频教程不可以退换"},"productDetail":"这是商品详情信息，详情信息"
    }
]
// 首页展示分类商品列表信息
$.fn.uiShowProduct=function () {
  var ui=$(this);
    var str="";
  $.each(products,function (i,val) {

      str+="<a class='corse-link' href='productDetail.html?booksId="+val.id+"'><dl class=\"course-wrap\">\n" +
          "<dt class=\"course-pic\">\n" +
          "                        <img src=\""+val.detailUrl+"\" /></dt>\n" +
          "                    <dd class=\"course-name\">"+val.name+"</dd>\n" +
          "                    <dd class=\"course-tags\"><span class=\"tag\">12-18岁</span><span class=\"tag\">小学</span></dd>\n" +
          "                    <dd class=\"course-price\">\n" +
          "                        <span class=\"price-icon\">￥</span><span class=\"price\">"+val.price+"</span>&nbsp;\n" +
          "                        <span class=\"orign-txt\">价值</span><span class=\"orign-price\">"+val.originPrice+ "</span>\n" +
          "                    <button class=\"buy-btn\">购买</button>\n" +
          "                    </dd>\n" +
          "                </dl></a>"
  })
   ui.append(str);
}
//点击购买进入到商品详情页
$.fn.redirectProDetail=function(){
    var ui=$(this);
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }

    //接收URL中的参数booksId
     gId = getUrlParam('booksId');
    console.log('id:'+gId);

            $.each(products, function(idx,val) {
                //根据id获取详情数据
                if (gId == val.id) {
                    var str1 = "<dl class=\"course-wrap\">\n" +
                        "        <dt class=\"course-pic\">\n" +
                        "            <img src='" + val.detailUrl + "'/></dt>\n" +
                        "        <dd class=\"course-name\">"+val.name+"</dd>\n" +
                        "        <dd class=\"course-tags\"><span class=\"tag\">12-18岁</span><span class=\"tag\">小学</span></dd>\n" +
                        "        <dd class=\"course-price\">\n" +
                        "            <span class=\"price-icon\">￥</span><span class=\"price\">"+val.price+"</span>&nbsp;\n" +
                        "            <s><span class=\"orign-txt\">￥</span><span class=\"orign-price\">"+val.originPrice+"</span></s>\n" +
                        "            <span class=\"remainNumber\">剩余"+val.remainNumber+"份</span>\n" +
                        "        </dd>\n" +
                        "    </dl>";
                    var str2="<dl class=\"buyNeedKnow-content\">\n" +
                        "        <dt class=\"caption\">购买须知</dt>\n" +
                        "        <dd>有效期:</dd>\n" +
                        "        <dd class=\"validity-time\"><span class=\"start-time\">"+val.buyNeedKnow.validity[0]+"</span>至<span class=\"end-time\">"+val.buyNeedKnow.validity[1]+"</span></dd>\n" +
                        "        <dd>使用流程：</dd>\n" +
                        "        <dd class=\"use-flow\">"+val.buyNeedKnow.useFlow+"</dd>\n" +
                        "        <dd>购买须知：</dd>\n" +
                        "        <dd class=\"buy-need-know\">"+val.buyNeedKnow.needKnow+"</dd>\n" +
                        "    </dl>";
                    var str3="<p> "+val.productDetail+"</p> ";
                }
                ui.append(str1);
                ui.siblings('.buyNeedKnow').append(str2);
                ui.siblings('.proDetail').append(str3);
            });

            //点击支付跳转到购买商品确认页
    ui.siblings('.foot').children('.buyNow-btn').on('click',function () {
        window.location.href="confirmOrder.html";
    })
};
//订单确认页加载订单信息
$.fn.uiConfirmOrder=function(){
    var ui=$(this);
    console.log("uiConfirmOrder gid="+gId);
    $.each(products, function(idx,val){
        //根据id获取详情数据
        var str="";
        if (1 == val.id) {
           str="<dl class=\"course-wrap clear-float\">\n" +
              "        <dt class=\"course-pic\"><img src='"+ val.detailUrl+" '></dt>\n" +
              "        <dd class=\"course-name\">"+val.name+"</dd>\n" +
              "        <dd class=\"course-price\"><span class=\"price-icon\">￥</span><span class=\"price\">"+val.price+"</span></dd>\n" +
              "    </dl>"  ;
        }
        ui.append(str);
    })
}

$(document).ready(function () {
    $('#item1').uiShowProduct();
    $('.courseContent').redirectProDetail();
    $('.orderDetail').uiConfirmOrder();
})