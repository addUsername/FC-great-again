let mode = 0
applyChanges()

chrome.runtime.onMessage.addListener(function (response, sendResponse) {
    mode = (mode + 1) % 3
    applyChanges()
    return true
});


function applyChanges(){
    let body = document.getElementById("threadbits_forum_2")
    if(mode !== 2){
        for (let idx = 0; idx < body.children.length; idx++) {
            const title = body.children[idx].children[2].getAttribute("title")
            if(title.match(/twitter|tiktok|instagram/g)){
                if(mode === 0){
                    body.children[idx].children[2].children[0].children[0].innerHTML = "🤢🤢 <s>" +body.children[idx].children[2].children[0].children[0].innerHTML + "</s>"
                }
                if(mode === 1){
                    body.children[idx].remove()
                }
            }
        }
    }else{
        window.location.reload()
    }
}


