/*jslint regexp: true, undef: true, sloppy: true, eqeq: true, vars: true, white: true, plusplus: true, maxerr: 50, indent: 4 */
/*global gdbbPressToolsInit,tinymce,tinyMCE,jQuery*/

;(function($, window, document, undefined) {
    window.wp = window.wp || {};
    window.wp.gdbto = window.wp.gdbto || {};

    window.wp.gdbto.front = {
        storage: { },
        get_selection: function() {
            var t = '';

            if (window.getSelection){
                t = window.getSelection();
            } else if (document.getSelection){
                t = document.getSelection();
            } else if (document.selection){
                t = document.selection.createRange().text;
            }

            return jQuery.trim(t.toString());
        },
        init: function() {
            $(document).on("click", ".d4p-bbt-quote-link", function(e){
                e.preventDefault();

                if ($("#bbp_reply_content").length > 0) {
                    var qout = wp.gdbto.front.get_selection();
                    var id = $(this).attr("href").substr(1);
                    var quote_id = '#d4p-bbp-quote-' + id;

                    if (qout === "") {
                        qout = $(quote_id).html();
                    }

                    qout = qout.replace(/&nbsp;/g, " ");
                    qout = qout.replace(/<p>|<br>/g, "");
                    qout = qout.replace(/<\/\s*p>/g, "\n");
                    qout = qout.replace(/(<img(?:(?!id|>).)*)(id[\=\"\'\s]+)?([^\"\'\s]*)([\"\']?)([^>]*>)/g, "[\u56fe]");
                    qout = qout.replace(/<div class=\"bbp-signature\">\s*(.*?)\s*<\/div>/g, " ");
                    qout = qout.trim();

                    if (gdbbPressToolsInit.quote_method === "bbcode") {
                        qout = "[quote quote=" + id + "]" + qout + "[/quote]";
                    } else {
                        var title = '<div class="d4p-bbp-quote-title"><a href="' + $(this).attr("bbp-url") + '">';
                        title+= $(this).attr("bbp-author") + ' ' + gdbbPressToolsInit.quote_wrote + ':</a></div>';
                        qout = '<blockquote class="d4pbbc-quote">' + title + qout + '</blockquote>';
                    }

                    if (gdbbPressToolsInit.wp_editor == 1 && !$("#bbp_reply_content").is(":visible")) {
                        tinymce.get("bbp_reply_content").execCommand("mceInsertContent", false, qout);
                    } else {
                        var txtr = $("#bbp_reply_content");
                        var cntn = txtr.val();

                        if ($.trim(cntn) != '') {
                            qout = "\n\n" + qout;
                        }

                        txtr.val(cntn + qout);
                    }

                    var old_ie = $.browser.msie && parseInt($.browser.version) < 9;

                    if (!old_ie) {
                        $("html, body").animate({scrollTop: $("#new-post").offset().top}, 1000);
                    } else {
                        document.location.href = "#new-post";
                    }
                }
            });
        }
    };

    $(document).ready(function() {
        wp.gdbto.front.init();
    });
})(jQuery, window, document);