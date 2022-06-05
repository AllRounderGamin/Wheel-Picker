const WHEELTEMP = document.createElement("template");
WHEELTEMP.innerHTML='<link href="./stylesheet.css" rel="stylesheet">\n' +
    '    <div class="container">\n' +
    '        <div class="wheelContainer">\n' +
    '            <canvas class="wheelCanvas" width="400" height="400"></canvas>\n' +
    '            <canvas class="pointerCanvas" width="400" height="400"></canvas>\n' +
    '        </div>\n' +
    '        <div class="buttonGroup">\n' +
    '            <button>Spin Wheel</button>\n' +
    '            <button>Delete Wheel</button>\n' +
    '            <button>Settings</button>\n' +
    '        </div>\n' +
    '    </div>'

class fortuneWheel extends HTMLElement{

    constructor() {
        super();
        this.angle = 0;
        this.colors = [];
        this.items = [];
    }
    // custom elements mdn page for checking attributes changed callback if needed

    connectedCallback(){
        this.shadow = this.attachShadow( {mode: "open"} )
        this.shadow.appendChild(WHEELTEMP.content.cloneNode(true));
        this.wheel = this.shadow.querySelector(".wheelCanvas");
        this.drawWheel();
        this.drawPointer();
    }

    getValues(){

    }

    update(){
        this.wheel.clearRect(0, 0, this.wheel.height, this.wheel.width);
        this.drawWheel();
    }

    drawWheel(){
        this.wheelCtx = this.wheel.getContext("2d");
        this.wheelCtx.fillStyle = "darkblue";
        this.wheelCtx.arc(200,200,150,0, Math.PI*2);
        this.wheelCtx.fill();
    }

    drawPointer(){
        this.pointer = this.shadow.querySelector(".pointerCanvas");
        this.pointCtx = this.pointer.getContext("2d");
        this.pointCtx.fillStyle = "black";

        this.pointCtx.beginPath();
        this.pointCtx.moveTo(380, 185)
        this.pointCtx.lineTo(380, 215)
        this.pointCtx.lineTo(350, 200);
        this.pointCtx.fill();
    }

    spinWheel(){

    }

    verifyAnswer(){

    }

}

customElements.define("wheel-picker", fortuneWheel);
