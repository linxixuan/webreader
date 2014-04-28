$(function () {
    var background = chrome.extension.getBackgroundPage();

    init();

    function init() {
        updateBookmark();
        bindEvent();
    }

    function updateBookmark() {
        var bookmarkList = JSON.parse(localStorage.getItem('bookmarkList')),
            ndBookMarkList = $('.J-bookmark-list'),
            index = 1,
            content = '',
            ndContainer;
        chrome.tabs.getSelected(null,function(tab) {
            for(var p in bookmarkList) {
                if (tab.url === p) {
                    var i = 0,
                        len = bookmarkList[p].length;
                    if (len === 0) {
                        content = '<li class="bookmark">暂无书签咯！<br />点击上面的小加号就可以添加书签啦</li>';
                    } else {
                        for(; i < len; i++) {
                            content += '<li class="bookmark J-use-bookmark" data-index="' + i + '"><a><span class="index">' + (i+1) + '.</span><span class="cor">' + bookmarkList[p][i] + '</span><span class="J-delete-bookmark delete-bookmark fa-minus-square"></span></a></li>';
                        }
                    }
                }
            }

            ndContainer = document.createElement('ul');
            $(ndContainer).addClass('bookmark-container');
            ndContainer.innerHTML = content;
            ndBookMarkList.html(ndContainer);
        });
    }

    function bindEvent() {
        var toggleFlag = 'on';
            ndswitchLight = $('.J-light-off'),
            ndCalKaoqin = $('.J-cal-kaoqin');

        bindBookMark();
        ndswitchLight.bind('click', function () {
            if (toggleFlag === 'on') {
                toggleFlag = 'off';
            } else {
                toggleFlag = 'on';
            }
            background.lightOff(toggleFlag);
        });
    }

    function bindBookMark() {
        var ndShowBookMark = $('.J-show-bookmark'),
            ndAddBookMark = $('.J-add-bookmark'),
            ndBookMarkList = $('.J-bookmark-list');

        ndShowBookMark.bind('click', function (e) {
            if (!$(e.target).hasClass('J-add-bookmark')) {
                ndBookMarkList.fadeToggle();
            }
        });

        ndAddBookMark.bind('click', function (e) {

        });

        ndBookMarkList.delegate('.J-use-bookmark', 'click', function (e) {
            var index = $('.J-use-bookmark').index(this);
            if (!$(e.target).hasClass('J-delete-bookmark')) {
                background.bookMark('use', index);
            }
        });

        $('.J-add-bookmark').bind('click', function () {
            background.bookMark('add', null, function () {
                updateBookmark();
                ndBookMarkList.fadeIn();
            });
        });

        ndBookMarkList.delegate('.J-delete-bookmark', 'click', function () {
            var index = $('.J-delete-bookmark').index(this);
            background.bookMark('delete', index, function () {
                updateBookmark();
            });
        });
    }
});
