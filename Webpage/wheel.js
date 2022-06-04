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
    }

    update(){

    }

    drawWheel(){
        this.canvas = this.shadow.querySelector(".wheelCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.fillStyle = "darkblue";
        this.ctx.arc(200,200,175,0, Math.PI*2);
        this.ctx.fill();
    }

    drawPointer(){

    }

    spinWheel(){

    }

    verifyAnswer(){

    }

}

customElements.define("wheel-picker", fortuneWheel);
