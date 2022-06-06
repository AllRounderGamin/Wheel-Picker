const WHEELTEMP = document.createElement("template");
WHEELTEMP.innerHTML='<link href="./stylesheet.css" rel="stylesheet">\n' +
    '    <div class="container">\n' +
    '        <div class="wheelContainer">\n' +
    '            <canvas class="wheelCanvas" width="400" height="400"></canvas>\n' +
    '            <canvas class="pointerCanvas" width="400" height="400"></canvas>\n' +
    '        </div>\n' +
    '        <div class="buttonGroup">\n' +
    '            <button class="spinButton">Spin Wheel</button>\n' +
    '            <button>Delete Wheel</button>\n' +
    '            <button>Settings</button>\n' +
    '        </div>\n' +
    '    </div>'
const RADIANCONVERTION = Math.PI / 180;


class fortuneWheel extends HTMLElement{

    constructor() {
        super();
        this.currentAngle = 0;
        this.colors = [];
        this.items = [];
    }
    // custom elements mdn page for checking attributes changed callback if needed

    connectedCallback(){
        this.shadow = this.attachShadow( {mode: "open"} )
        this.shadow.appendChild(WHEELTEMP.content.cloneNode(true));
        this.wheel = this.shadow.querySelector(".wheelCanvas");
        this.wheelCtx = this.wheel.getContext("2d");
        this.shadow.querySelector(".spinButton").addEventListener("click", this.spinWheel.bind(this));
        this.getValues();
        this.drawWheel();
        this.drawPointer();
    }

    getValues(){
        this.items = JSON.parse(this.getAttribute("items"));
        this.colors = JSON.parse(this.getAttribute("colors"));
    }

    update(){
        this.wheel.clearRect(0, 0, this.wheel.height, this.wheel.width);
        this.getValues();
        this.drawWheel();
    }

    drawWheel(){
        const arcSize = 360 / this.items.length;
        let completion = 0;
        // Draws each part of the circle arc by arc, minuses 90 * RADIANCONVERSION so that it starts at the top
        for (let i = 0; i < this.items.length; i++){
            this.wheelCtx.beginPath();
            this.wheelCtx.fillStyle = this.colors[i]
            this.wheelCtx.arc(200, 200, 150, ((completion * RADIANCONVERTION)-90 * RADIANCONVERTION), ((completion + arcSize) * RADIANCONVERTION  - 90 * RADIANCONVERTION));
            this.wheelCtx.fill();
            this.wheelCtx.closePath();
            completion += arcSize;
        }
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
        const toSpin = 1080 + (Math.random() * 360);
        this.wheel.style.setProperty("--s", (this.currentAngle + "deg"));
        this.wheel.style.setProperty("--e", (Math.floor(this.currentAngle+toSpin) + "deg"));
        this.wheel.classList.add("active");
        this.currentAngle = Math.floor(this.currentAngle+toSpin);
        this.wheel.addEventListener("animationend", this.verifyAnswer.bind(this), {once: true})
    }

    verifyAnswer(){
        this.wheel.classList.remove("active");
        this.wheel.style.setProperty("--r", this.currentAngle + "deg");
        const winnerPos = ((360 - (this.currentAngle % 360) - 180) % this.items.length);
        //console.log("Winner is:", this.items[winnerPos]);
    }

}

customElements.define("wheel-picker", fortuneWheel);
