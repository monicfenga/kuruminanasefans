/* ========== 实用函数 ========== */
/**
 * 检查元素是否具有指定的 class。
 *
 * @param {Object} elem - 要检查的元素。
 * @param {string} cls - 要检查的 class。
 * @returns {boolean} - 如果元素具有指定的 class，返回 true，否则返回 false。
 */
function hasClass(elem, cls) {
    cls = cls || '';
    if (cls.replace(/\s/g, '').length == 0) return false;
    return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
}
/**
* 如果元素没有指定的 class，则添加一个 class。
*
* @param {Object} ele - 要添加 class 的元素。
* @param {string} cls - 要添加的 class。
*/
function addClass(ele, cls) {
    if (!hasClass(ele, cls)) {
        ele.className = ele.className == '' ? cls : ele.className + ' ' + cls;
    }
}
/**
* 如果元素有指定的 class，则从元素中删除该 class。
*
* @param {Object} ele - 要从中删除 class 的元素。
* @param {string} cls - 要删除的 class。
*/
function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
        var newClass = ' ' + ele.className.replace(/[\t\r\n]/g, '') + ' ';
        while (newClass.indexOf(' ' + cls + ' ') >= 0) {
            newClass = newClass.replace(' ' + cls + ' ', ' ');
        }
        ele.className = newClass.replace(/^\s+|\s+$/g, '');
    }
}

/**
 * 播放蜂鸣声
 * @param {number} frequency - 要播放的蜂鸣声频率，单位为Hz.
 * @param {number} duration - 蜂鸣声持续时间，单位为毫秒.
 */
function playBeep(frequency, duration) {
    const audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    setTimeout(() => oscillator.stop(), duration);
}

/** 
 * 获取当前日期和时间并以特定格式返回。 
 * 
 * @returns {string} - 字符串格式为 "yyyy-mm-dd hh:mm:ss"。 
 */
function getDatetime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hh = now.getHours();
    var mm = now.getMinutes();
    var ss = now.getSeconds();
    var clock = year + "-";
    if (month < 10) clock += "0";
    clock += month + "-";
    if (day < 10) clock += "0";
    clock += day + " ";
    if (hh < 10) clock += "0";
    clock += hh + ":";
    if (mm < 10) clock += '0';
    clock += mm + ":";
    if (ss < 10) clock += '0';
    clock += ss;
    return clock;
}

/** 
 * 将时间戳转换为特定格式的日期和时间。 
 * 
 * @returns {string} - 字符串格式为 "yyyy-mm-dd hh:mm:ss"。 
 */
function timestampToTime() {
    var date = new Date();
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() + ' ';
    var hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() + ':';
    var mm = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() + ':';
    var ss = date.getSeconds() < 10 ? '0' + date.getDate() : date.getSeconds();
    return Y + M + D + hh + mm + ss;
}

/**
 * 检测指定HTML元素是否在视口中出现
 * @param el 要检测的元素
 * @param isElementAtTheTopOfThePage 元素是否在页面顶部
 * @returns bool
 */
function isElementInViewport(el, isElementAtTheTopOfThePage = false) {
    let rect = el.getBoundingClientRect();
    if (isElementAtTheTopOfThePage) {
        return (rect.top <= 0 && rect.bottom <= 0);
    } else {
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
          );
    }

  }

/* ========== 业务函数 ========== */

/**
 * 获取b粉丝数量并更新到页面中
 * @returns 循环调用自身
 */
function get_fans_count_bili() {
    document.getElementById('get_bili_fans_count').classList.add('loading');
    $.ajax({
        url: "f_stats.php",
        async: true,
        type: "GET",
        dateType: "jsonp",
        success: function (data) {
            let data_raw = data;
            let follower = data_raw.follower;
            let followers_change = window.localStorage.getItem('followers_change_bili');
            $("#followers_count").html(follower);
            $("#followers_count").attr("value", follower);
            if (followers_change === null) {
                $("#followers_change").html((follower <= 0 ? "" : "+") + follower);
                $("#followers_change").attr("value", follower);
                window.localStorage.setItem('followers_change_bili', follower);
            } else {
                window.localStorage.setItem('followers_change_bili', follower);
                let increase_or_decrease = follower - followers_change;
                $("#followers_change").html((increase_or_decrease <= 0 ? "" : "+") + increase_or_decrease);
                $("#followers_change").attr("value", increase_or_decrease);
            }
            document.getElementById('get_bili_fans_count').classList.remove('loading');
        },
        error: function(xhr, status, error) {
            console.warn('暂时无法获取：'+status+' '+error);
        }
    });
    return get_fans_count_bili
}

/**
 * 显示问候语
 * @param {int} hour 当前时间（小时）
 */
function menhera_greeting(hour) {
	if (hour >= 0 && hour <= 4) {
		$("#the_greeting_img").attr("src", "https://enjoynet.co.jp/icon2/icon_menherashojo_emoji_2-08.jpg");
		$("#the_greeting_title").text("凌晨好！");
		$("#the_greeting_text").text("生活没有过去，也没有曾经，不管什么事只要过去了，就会慢慢忘掉。");
	} else if (hour >= 4 && hour <= 6) {
		$("#the_greeting_img").attr("src", "https://enjoynet.co.jp/icon2/icon_menherashojo_emoji_2-20.jpg");
		$("#the_greeting_title").text("清晨好！");
		$("#the_greeting_text").text("要相信，这个世界美好总要多过阴暗，欢乐总要多过苦难，还有很多事，值得你一如既往的相信。");
	} else if (hour >= 6 && hour <= 8) {
		$("#the_greeting_img").attr("src", "https://enjoynet.co.jp/icon2/icon_menherashojo_emoji-34.jpg");
		$("#the_greeting_title").text("早　安！");
		$("#the_greeting_text").text("愿你拥有一份好的心情开启崭新的一天。");
	} else if (hour >= 8 && hour <= 12) {
		$("#the_greeting_img").attr("src", "https://enjoynet.co.jp/icon2/icon_menherashojo_emoji-34.jpg");
		$("#the_greeting_title").text("上午好！");
		$("#the_greeting_text").text("今天你看上去好精神哦！");
	} else if (hour >= 12 && hour <= 13) {
		$("#the_greeting_img").attr("src", "https://enjoynet.co.jp/icon2/icon_menherashojo_emoji-05.jpg");
		$("#the_greeting_title").text("中午好！");
		$("#the_greeting_text").text("该吃午饭啦！有什么好吃的？您有中午休息的好习惯吗？");
	} else if (hour >= 13 && hour <= 16) {
		$("#the_greeting_img").attr("src", "https://enjoynet.co.jp/icon2/icon_menherashojo_emoji-03.jpg");
		$("#the_greeting_title").text("下午好！");
		$("#the_greeting_text").text("人生没有白走的路，每一步都算数。愿我们最终都用自己喜欢的方式过一生。");
	} else if (hour >= 16 && hour <= 17) {
		$("#the_greeting_img").attr("src", "https://enjoynet.co.jp/icon2/icon_menherashojo_emoji_2-29.jpg");
		$("#the_greeting_title").text("傍晚好！");
		$("#the_greeting_text").text("生命中某些珍贵的片段，其实都来自于一些微不足道的小事。");
	} else if (hour >= 17 && hour <= 21) {
		$("#the_greeting_img").attr("src", "https://enjoynet.co.jp/icon2/icon_menherashojo_emoji_2-09.jpg");
		$("#the_greeting_title").text("晚上好！");
		$("#the_greeting_text").text("把所有的不快给昨天；把所有的希望给明天；把所有的努力给今天。亲爱的朋友一起加油！");
	} else if (hour >= 21 && hour <= 22) {
		$("#the_greeting_img").attr("src", "https://enjoynet.co.jp/icon2/icon_menherashojo_emoji-19.jpg");
		$("#the_greeting_title").text("晚　安！");
		$("#the_greeting_text").text("唯有心静，身外的繁华才不至于扭曲和浮躁，才能倾听到内心真实的声音。");
	} else if (hour >= 22 && hour <= 23) {
		$("#the_greeting_img").attr("src", "https://enjoynet.co.jp/icon2/icon_menherashojo_emoji_2-08.jpg");
		$("#the_greeting_title").text("午夜好！");
		$("#the_greeting_text").text("不管从什么时候开始，重要的是开始以后不要停止；不管什么时候结束，重要的是结束以后不要后悔。");
	}
}

/* ========== 初始化 ========== */
window.onload = function () {
    if (window.localStorage.getItem("enable_music") !== null && window.localStorage.getItem("enable_sfx") !== null) {
        document.getElementById('preload_question').setAttribute('hidden', 'hidden');
    }
    removeClass(document.querySelector('body'), 'is-preload');
    // 生日专属主题
    document.getElementById("now_time").innerText = timestampToTime();
    if (("7" == new Date().getMonth() && ("22" == new Date().getDate() || "21" == new Date().getDate()))) {
        addClass(document.getElementById("nav"), "birthday");
    }
    // 根据季节切换主题
    switch (new Date().getMonth() + 1) {
        case 3:
        case 4:
        case 5:
            addClass(document.body, "theme-spring");
            break;
        case 6:
        case 7:
        case 8:
            addClass(document.body, "theme-summer");
            break;
        case 9:
        case 10:
            addClass(document.body, "theme-autumn");
            break;
        case 11:
        case 12:
        case 1:
        case 2:
            addClass(document.body, "theme-winter");
            break;
        default:
            break;
    }
    //图片懒加载
    lazyload();
    //滚动监听
    scrollSpy('#main_nav', {
        offset: 128,
        sectionClass: 'section,header'
    });
    //问候语
    menhera_greeting(new Date().getHours());
    //图标状态更新
    if (window.localStorage.getItem("enable_music") == 1) {
        addClass(document.getElementById("toggle_music"), 'active');
        bgm.play();
    }
    if (window.localStorage.getItem("enable_sfx") == 1) {
        addClass(document.getElementById("toggle_sfx"), 'active');
    }
    // 壁纸筛选
    var portfolioIsotope = $('.wallpapers-container').isotope({
        itemSelector: '.wallpapers-item',
        layoutMode: 'fitRows'
    });
    $('#wallpapers-flters li').on('click', function () {
        $("#wallpapers-flters li").removeClass('active');
        $(this).addClass('active');
        $("#wallpapers .wallpapers-container").addClass('active');
        portfolioIsotope.isotope({
            filter: $(this).data('filter')
        });
    });


    // 动画效果
    if (document.body.classList.contains("has-animations") && typeof(ScrollReveal) === "function") {
        (window.sr = ScrollReveal()).reveal("section:not(.navigation):not(.navigation-nav):not(.pure-u-1),section:not(.navigation):not(.navigation-nav):not(.pure-u-1) .pure-g", {
            duration: 500,
            distance: "20px",
            easing: "cubic-bezier(0.5, -0.01, 0, 1.005)",
            origin: "bottom",
            interval: 100
        });
        (window.sr = ScrollReveal()).reveal("section:not(.navigation):not(.navigation-nav) .pure-g>div,section:not(.navigation):not(.navigation-nav) .pure-g>article,section:not(.navigation):not(.navigation-nav) .pure-g>li,section:not(.navigation):not(.navigation-nav) main ul,section:not(.navigation):not(.navigation-nav) main ol,section:not(.navigation):not(.navigation-nav) main dl,section:not(.navigation):not(.navigation-nav) aside", {
            duration: 500,
            distance: "10px",
            easing: "cubic-bezier(0.5, -0.01, 0, 1.005)",
            origin: "bottom",
            interval: 50
        });
        (window.sr = ScrollReveal()).reveal("body>section:not(.navigation):not(.navigation-nav) main h2,section:not(.navigation):not(.navigation-nav) main h3,section:not(.navigation):not(.navigation-nav) main h4,section:not(.navigation):not(.navigation-nav) main p,section:not(.navigation):not(.navigation-nav) main ul:not(.list-inline)>li,section:not(.navigation):not(.navigation-nav) main ol:not(.list-inline)>li,section:not(.navigation):not(.navigation-nav) main img,section:not(.navigation):not(.navigation-nav) main .pure-button", {
            duration: 500,
            distance: "6px",
            easing: "cubic-bezier(0.5, -0.01, 0, 1.005)",
            origin: "bottom",
            interval: 25
        });
    }

    // ajax load page
    let xhr = new XMLHttpRequest(); // 创建XMLHttpRequest 实例
    xhr.open("get", "./counter/index.php?ajax=1", false); //设置为同步get请求
    xhr.send(null); // 开始发送请求，并且阻塞后续代码执行，直到拿到响应
    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        console.info('感谢您的访问');
    } else {
        console.log('请求失败');
    }
    // $.ajax({
    //     async: true,
    //     url: './f_videos.php?ajax=1',
    //     type: 'GET',
    //     success: function (data) { $('#videos_wrapper').html(data); }
    // });
    
    $.ajax({
        async: true,
        url: './f_discuss.php?ajax=1&endpoint=story',
        type: 'GET',
        success: function (data) { $('#story_wrapper').html(data); },
        error: function(xhr, status, error) {
            console.warn('暂时无法获取：'+status+' '+error);
        }
    });

}


setInterval(get_fans_count_bili(), 600000);

window.onscroll = function () {
    if (isElementInViewport(document.getElementById("top"),true)) {
        addClass(document.body, 'scrolled');
    } else {
        removeClass(document.body, 'scrolled');
        
    }
}
/* ========== 导航菜单 ========== */
document.querySelectorAll('.navigation-list a').forEach(navLink => {
    navLink.addEventListener('click', () => {
        if (document.getElementById('navi-toggle').checked) {
            // 如果 naviToggle 被勾选，则取消勾选
            document.getElementById('navi-toggle').checked = false;
            // 菜单滚动归零
            document.querySelector('.navigation-nav').scrollTop = 0;
        }
    });
});

/* ========== 音效控制 ========== */
let sfx_button = new Audio("./assets/sfx/戳戳胡桃.WAV");
let sfx_link = new Audio("./assets/sfx/物品购买.WAV");
let sfx_toggle = new Audio("./assets/sfx/点击1.WAV");
let bgm = new Audio("https://www.orangefreesounds.com/wp-content/uploads/2014/05/Sweet-lullaby-beautiful-childrens-song-for-dreaming.mp3");

function toggle_localStorage_item(item) {
    the_item = window.localStorage.getItem(item);
    if (the_item == null || the_item == 0) {
        window.localStorage.setItem(item, 1);
        console.info(item + ' 已开启');
    } else {
        window.localStorage.setItem(item, 0);
        console.info(item + ' 已关闭');
    }
}
100*150
document.getElementById("toggle_sfx").onclick = function() {
    toggle_localStorage_item("enable_sfx");
    if (hasClass(document.getElementById("toggle_sfx"), 'active')) {
        removeClass(document.getElementById("toggle_sfx"), 'active');
    } else {
        addClass(document.getElementById("toggle_sfx"), 'active');
    }
};
document.getElementById("toggle_music").onclick = function() {
    toggle_localStorage_item("enable_music");
    if (hasClass(document.getElementById("toggle_music"), 'active')) {
        removeClass(document.getElementById("toggle_music"), 'active');
        bgm.pause();
        bgm.currentTime = 0;
    } else {
        addClass(document.getElementById("toggle_music"), 'active');
        bgm.play();
    }
};
document.querySelectorAll("section a:not(.glass-button):not(.pure-button),#nav a").forEach(ele => {
    ele.addEventListener("click", () => {
        if (window.localStorage.getItem("enable_sfx") == 1) {
            sfx_link.play();
        }
    })
});
document.querySelectorAll("section .glass-button, section .pure-button, .navigation-button ").forEach(ele => {
    ele.addEventListener("click", () => {
        if (window.localStorage.getItem("enable_sfx") == 1) {
            sfx_button.play();
        }
    })
});
document.querySelectorAll(".nav-button, a.mouse-link").forEach(ele => {
    ele.addEventListener("click", () => {
        if (window.localStorage.getItem("enable_sfx") == 1) {
            sfx_toggle.play();
        }
    })
});
document.getElementById("enableSound_yes").onclick = function() {
    toggle_localStorage_item("enable_sfx");
    toggle_localStorage_item("enable_music");
    addClass(document.getElementById("toggle_music"), 'active');
    addClass(document.getElementById("toggle_sfx"), 'active');
    sfx_toggle.play();
    bgm.play();
    document.getElementById('preload_question').setAttribute('hidden', 'hidden');
    removeClass(document.querySelector('body'), 'is-preload');
}
document.getElementById("enableSound_no").onclick = function () {
    window.localStorage.setItem('enable_sfx', 0);
    window.localStorage.setItem('enable_music', 0);
    document.getElementById('preload_question').setAttribute('hidden', 'hidden');
    removeClass(document.querySelector('body'), 'is-preload');
}