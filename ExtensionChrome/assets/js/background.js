var timer;

function izpisi(str) {
    alert(str);
}

function izpisuj() {
    timer = setInterval(function () {
        alert("TEČEM")
    }, 3000);
}

function koncaj() {
    clearInterval(timer);
}

document.addEventListener("DOMContentLoaded", function () {
    izpisi("ZAČETEK");
});

//sprejema psoročila iz content skript
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    myVariabeInBackground = message;

    if (message == "RUN") {
        izpisuj();
    } else {
        koncaj();
    }

});