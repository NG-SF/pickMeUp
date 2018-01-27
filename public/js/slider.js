$(document).ready(function() {
  $('.slider').slick({
    autoplay: false,
    accessibility: true,
    adaptiveHeight: true,
    arrows: true,
    mobileFirst: true,
    dots: true
  });

$(window).resize(function() {
  $('.slider')[0].slick.refresh();
});

$(window).on('orientationchange', function() {
  $('.slider').slick('resize');
});
});