// 复杂操作页面内容并把数据发给background.js
/**
 * 初始化函数
 */
init();

function init() {
    initBookmark();
    initLightOff();
    initShare();
    initCalculateKaoqin();
}

/**
 * 书签功能初始化
 */
function initBookmark() {
    chrome.extension.onMessage.addListener(function (req, sender, sendRequest) {
        if (req.type === 'bookmark') {
            if (req.op === 'add') {
                var currentHeight = document.body.scrollTop;
                sendRequest({currentHeight: currentHeight});
            } else {
                // 滚到指定位置
                scrollTo(0, req.targetHeight);
            }
        }
    });
}

/**
 * 开关灯功能初始化，插入一段css
 */
function initLightOff() {
    var id = 'webreader-light-off',
        ndStyle,
        styleContent,
        contentStyle = 'body,p,code,nav,div,span,table,h1,h2,h3,h4,h5,input,ul,li,var,section,aside,footer,header,blockquote,select {background:#022B37 !important;color:#5D8D98 !important}',
        titleStyle = 'h1,h2,h3,h4,h5,.title {color:#D7322D !important}',
        linkStyle = 'a,.link {color:#7D8F00 !important}';
    chrome.extension.onMessage.addListener(function (req, sender, sendRequest) {
        if (req.type === 'lightoff') {
            if (req.op === 'off') {

                if (document.getElementById(id)) return;
                styleContent = contentStyle + titleStyle + linkStyle;

                ndStyle = document.createElement('style');
                ndStyle.id = 'webreader-light-off';
                ndStyle.innerHTML = styleContent;

                document.head.appendChild(ndStyle);
            } else {
                if (!document.getElementById(id)) return;

                document.getElementById(id).remove();
            }
        }
    });
    $('body').click(function (e) {
        if (e.which === 2) {
            if (!document.getElementById(id)) {

                styleContent = contentStyle + titleStyle + linkStyle;

                ndStyle = document.createElement('style');
                ndStyle.id = 'webreader-light-off';
                ndStyle.innerHTML = styleContent;

                document.head.appendChild(ndStyle);
            } else {
                document.getElementById(id).remove();
            }
        }
    });
}

/**
 * 负责弹出对话框
 */
function popDialog(content, style) {
    if ($('.J-dialog').length > 0) {
        $('.J-dialog').remove();
    }
    var container =  document.createElement('div'),
        dialogCss = document.createElement('style');
    container.setAttribute('class', 'dialog J-dialog');
    container.innerHTML = '<span class="close-dialog J-close-dialog">关闭</span>';
    dialogCss.innerHTML = '.dialog {position:absolute;top:50%;left:50%;margin:-60px 0 0 -160px; padding:20px;width:300px;min-height:100px;z-index:20;font-size:14px;font-family:\'微软雅黑\';color:#EEE;background:radial-gradient(#2c3e50, #34495e);box-shadow:1px 1px 20px 5px #34495e;}.dialog .close-dialog {position:absolute;right:5px;top:5px;cursor:pointer;}p{word-break:break-all;word-wrapper:break-word;}.em{color:#e74c3c;font-size:18px;font-weight:bold;} .day{color:#f1c40f;}.tips{font-style:italic;color:#95a5a6;font-size:12px;} .link{color:#EEE;} .link:hover {color:#f39c12;}' + style;
    document.body.appendChild(container);

    $('.J-close-dialog').bind('click', function () {
        $('.J-dialog').remove();
    });

    $('.J-dialog').append(dialogCss);
    $('.J-dialog').append(content);

    $('body').keydown(function (e) {
        if(e.which === 27 && $('.J-dialog').length > 0) {
            $('.J-dialog').remove();
        }
    });
}
/**
 * 分享功能初始化
 */
function initShare() {
    chrome.extension.onMessage.addListener(function (req, sender, sendRequest) {
    });
}

/**
 * 插入样式
 * @param styleHash {array} 由“样式对象”构成的hash表，但是因为样式的缘故，必须保证顺序一致
 */
function insertCSS(styleList) {

}
