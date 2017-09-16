if (screen.width > 1000) {
    var href = window.location.href;
    var index = href.indexOf('3000');
    window.location.href = href.replace(href.slice(index+5), 'limit');
}