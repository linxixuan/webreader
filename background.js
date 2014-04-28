/**
 * 书签功能
 * @method bookMark
 * @param type {sring} [add, use]
 * @param index {integer} [num,null]
 * @param call {function}
 */
function bookMark(type, index, callback) {
    // 添加书签
    if (type === 'add') {
        sendCommand({type: 'bookmark', op: 'add'}, function (response) {
            chrome.tabs.getSelected(null,function(tab) {
                var bookmarkList = localStorage.getItem('bookmarkList') ? JSON.parse(localStorage.getItem('bookmarkList')): {},
                    tabUrl = tab.url,
                    currentHeight = response.currentHeight;
                if (!bookmarkList[tabUrl]) {
                    bookmarkList[tabUrl] = [response.currentHeight];
                } else {
                    // 防止重复加入书签
                    if (bookmarkList[tabUrl].indexOf(currentHeight) < 0) {
                        bookmarkList[tabUrl].push(response.currentHeight);
                    }
                }
                localStorage.setItem('bookmarkList', JSON.stringify(bookmarkList));
                callback();
            });
        });
    // 使用书签
    }
    if (type === 'use') {
        chrome.tabs.getSelected(null, function (tab) {
            var tabUrl = tab.url,
                targetHeight = JSON.parse(localStorage.getItem('bookmarkList'))[tabUrl][index];
            sendCommand({type: 'bookmark', op: 'use', targetHeight:targetHeight}, function (response) {
            });
        });
    }
    if (type === 'delete') {
        chrome.tabs.getSelected(null,function(tab) {
            var tabUrl = tab.url,
                bookmarkList = JSON.parse(localStorage.getItem('bookmarkList'));

            bookmarkList[tabUrl].splice(index, 1);
            localStorage.setItem('bookmarkList', JSON.stringify(bookmarkList));
            callback();
        });
    }
}

/**
 * 开关灯任务
 */
function lightOff(type) {
    sendCommand({type: 'lightoff', op: type}, function (response) {
    });
}

/**
 * 计算考勤日期
 */
function calculateKaoqin() {
    chrome.tabs.getSelected(null, function (tab) {
        if (tab.url.indexOf('http://hr.sankuai.com/kaoqin') !== -1) {
            sendCommand({type: 'calculateKaoqin'}, function (response) {
            });
        } else {
            chrome.tabs.create({url:'http://hr.sankuai.com/kaoqin'}, function (tab) {
                setTimeout(function () {
                    if (tab.url.indexOf('http://hr.sankuai.com/kaoqin') !== -1) {
                        sendCommand({type: 'calculateKaoqin'}, function (response) {
                        });
                    }
                }, 3000);
            });
        }
    });
}

/**
 * 发送命令
 */
 function sendCommand(msg, callback) {
    chrome.tabs.query({active: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, msg, function(response) {
          callback(response);
        });
    });
 }
