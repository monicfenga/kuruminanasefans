jQuery(document).ready(function($){

  // Opens and closes spoiler content
  $(".tmc4bpp-spoiler-head").on('click', function () {

    // Opens and closes the selected spoiler

    $(this).toggleClass("open");
    $(this).next(".tmc4bpp-spoiler-body").toggle(400);

    // Toggles the font awesome icon between plus and minus
    $(this).children(".svg-inline--fa").toggleClass("fa-plus");
    $(this).children(".svg-inline--fa").toggleClass("fa-minus");

    // Resets other spoilers in the same post to 'display: none', with a font awesome plus icon
    $(this).parent().siblings().find(".tmc4bpp-spoiler-head").removeClass("open");
    $(this).parent().siblings().find(".tmc4bpp-spoiler-body").hide(400);
    $(this).parent().siblings().find(".svg-inline--fa").removeClass("fa-minus");
    $(this).parent().siblings().find(".svg-inline--fa").addClass("fa-plus");

  });

  
});