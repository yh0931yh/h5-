// 商品信息
var product={};
var products=[
    {"id":"1","name":"限量抢99元课时包","category":"英语","imgUrl":"../imgs/index/Bitmap Copy@2x.png","detailUrl":"../imgs/index/Bitmap Copy@2x.png",
    "price":"99","originPrice":"1299","tags":["2-8岁","全上海通用"],"remainNumber":"200","buyNeedKnow":{"validity":["2019-01-01","2019-12-31"],"useFlow":"第一步到门店核销码券，第二步预约课程，第三步上课",
            "needKnow":"该券为优惠特价，视频教程不可以退换","productDetail":"这是商品详情信息，详情信息"},
    },
    {"id":"2","name":"100元美丽英文客堂","category":"英语","imgUrl":"../imgs/index/Bitmap Copy@2x.png","detailUrl":"../imgs/index/Bitmap Copy@2x.png",
        "price":"99","originPrice":"1299","tags":["2-8岁","全上海通用"],"remainNumber":"200","buyNeedKnow":{"validity":["2019-01-01","2019-12-31"],"useFlow":"第一步到门店核销码券，第二步预约课程，第三步上课",
            "needKnow":"该券为优惠特价，视频教程不可以退换","productDetail":"这是商品详情信息，详情信息"},
    },
    {"id":"3","name":"99元思维导图","category":"数学","imgUrl":"../imgs/index/Bitmap Copy@2x.png","detailUrl":"../imgs/index/Bitmap Copy@2x.png",
        "price":"99","originPrice":"1299","tags":["2-8岁","全上海通用"],"remainNumber":"200","buyNeedKnow":{"validity":["2019-01-01","2019-12-31"],"useFlow":"第一步到门店核销码券，第二步预约课程，第三步上课",
            "needKnow":"该券为优惠特价，视频教程不可以退换","productDetail":"这是商品详情信息，详情信息"},
    },
    {"id":"4","name":"书法练习版","category":"国学","imgUrl":"../imgs/index/Bitmap Copy@2x.png","detailUrl":"../imgs/index/Bitmap Copy@2x.png",
        "price":"99","originPrice":"1299","tags":["2-8岁","全上海通用"],"remainNumber":"200","buyNeedKnow":{"validity":["2019-01-01","2019-12-31"],"useFlow":"第一步到门店核销码券，第二步预约课程，第三步上课",
            "needKnow":"该券为优惠特价，视频教程不可以退换","productDetail":"这是商品详情信息，详情信息"},
    }
]
// 首页展示分类商品列表信息
$.fn.uiShowProduct=function () {
  var ui=$(this);
    var str="";
  $.each(products,function (i,val) {

      str+="<dl class=\"course-wrap\">\n" +
          "<dt class=\"course-pic\">\n" +
          "                        <img src=\""+val.detailUrl+"\" /></dt>\n" +
          "                    <dd class=\"course-name\">"+val.name+"</dd>\n" +
          "                    <dd class=\"course-tags\"><span class=\"tag\">12-18岁</span><span class=\"tag\">小学</span></dd>\n" +
          "                    <dd class=\"course-price\">\n" +
          "                        <span class=\"price-icon\">￥</span><span class=\"price\">"+val.price+"</span>&nbsp;\n" +
          "                        <span class=\"orign-txt\">价值</span><span class=\"orign-price\">"+val.originPrice+"</span>\n" +
          "                    <button class=\"buy-btn\">购买</button>\n" +
          "                    </dd>\n" +
          "                </dl>"
  })
   ui.append(str);
}
$(document).ready(function () {
    $('#item').uiShowProduct();
})