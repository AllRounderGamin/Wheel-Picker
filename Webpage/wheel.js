class fortuneWheel extends HTMLElement{

    constructor() {
        super();
        this.angle = 0;
        this.colors = [];
    }
    // custom elements mdn page for checking attributes changed callback if needed

    connectedCallback(){
        this.shadow = this.attachShadow( {mode: "open"} )
        this.shadow.appendChild(document.querySelector("#wheel").content.cloneNode(true));
        this.drawWheel();
        this.drawPointer();
    }

    getValues(){

    }

    update(){
        this.drawWheel();
    }

    drawWheel(){
        this.wheel = this.shadow.querySelector(".wheelCanvas");
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
