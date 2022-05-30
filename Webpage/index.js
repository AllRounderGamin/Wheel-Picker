function init(){
    const canvas = document.querySelector("#wheelCanvas");
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "darkblue";
    ctx.arc(250,250,200,0, Math.PI*2)
    ctx.fill()
}

window.addEventListener("load", init);
