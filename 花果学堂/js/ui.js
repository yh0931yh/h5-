//首页点击不同分类显示对应分类课程
$.fn.uiShowSort=function(){
    var ui=$(this),
         captions=$('.caption',ui),
        courseList=$('.course-list',ui);
    $('.sort-link',captions).on('click',function () {
        $(this).addClass('sort-link-active').siblings().removeClass('sort-link-active');
        $('.item',courseList).eq($(this).index()).show().siblings().hide();
    })

}
//点击购买进入到商品详情
$(document).ready(function () {
    $('.content').uiShowSort();
})