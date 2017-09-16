function $$(ele) {
    return document.querySelector(ele);
}
function Ajax(obj) {
    var request = new XMLHttpRequest(),
        defaults = {
        method: "GET",
        url: "",
        async: true,
        success: function success() {},
        errer: function errer() {},
        sendContent: null
    };

    for (var key in obj) {
        defaults[key] = obj[key];
    }
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var responseText;
            // if (request.responseText) {
            responseText = JSON.parse(request.responseText);
            // } else {
            //     responseText = null;
            // }
            defaults.success.call(request, responseText);
        } 
    };

    request.open(defaults.method, defaults.url, defaults.async);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    request.send(defaults.sendContent);
}