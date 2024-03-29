const WHEELTEMP = document.createElement("template");
WHEELTEMP.innerHTML='<link href="./stylesheet.css" rel="stylesheet">\n' +
    '    <div class="container">\n' +
    '        <div class="wheelContainer">\n' +
    '            <canvas class="wheelCanvas" width="800" height="800"></canvas>\n' +
    '            <canvas class="pointerCanvas" width="800" height="800"></canvas>\n' +
    '        </div>\n' +
    '        <div class="buttonGroup">\n' +
    '            <button class="spinButton" type="button">Spin Wheel</button>\n' +
    '            <button class="deleteButton" type="button">Delete Wheel</button>\n' +
    '            <button class="settingsButton" type="button">Settings</button>\n' +
    '        </div>\n' +
    '    </div>'

class fortuneWheel extends HTMLElement{

    constructor() {
        super();
        this.currentAngle = 0;
        this.colors = [];
        this.items = [];
        this.initialise();
    }

    initialise(){
        // Sets up shadow DOM and creates wheel
        this.shadow = this.attachShadow( {mode: "open"} )
        this.shadow.appendChild(WHEELTEMP.content.cloneNode(true));
        this.wheel = this.shadow.querySelector(".wheelCanvas");
        this.wheelCtx = this.wheel.getContext("2d");
        this.shadow.querySelector(".spinButton").addEventListener("click", this.spinWheel.bind(this));
        this.shadow.querySelector(".deleteButton").addEventListener("click", this.deleteWheel.bind(this));
        this.drawPointer();
    }

    static get observedAttributes(){
        return ["customising"];
    }

    attributeChangedCallback(){
        // Will be called when wheel settings are updated
        this.getValues();
        this.drawWheel();
    }

    getValues(){
        this.items = JSON.parse(this.getAttribute("items"));
        this.colors = JSON.parse(this.getAttribute("colors"));
    }

    drawWheel(){
        this.wheelCtx.clearRect(0, 0, this.wheel.height, this.wheel.width);
        this.arcSize = 2*Math.PI / this.items.length;
        let completion = 0;
        this.wheelCtx.font = "64px serif";
        this.wheelCtx.textBaseline = "middle";
        // Draws each part of the circle arc by arc, minus Math.PI/2 so that it starts at the top
        this.wheelCtx.lineWidth = 5;
        for (let i = 0; i < this.items.length; i++){
            this.wheelCtx.beginPath();
            this.wheelCtx.arc(400, 400, 315, ((completion)- Math.PI/2), ((completion + this.arcSize)  - (Math.PI / 2)));
            this.wheelCtx.stroke();
            this.wheelCtx.lineTo(400, 400);
            this.wheelCtx.fillStyle = this.colors[i];
            this.wheelCtx.fill();
            this.wheelCtx.closePath();
            completion += this.arcSize;

            // Draws rotated text
            if (this.items.length < 10) {
                this.wheelCtx.save();
                this.wheelCtx.translate(this.wheel.width / 2, this.wheel.height / 2);
                this.wheelCtx.rotate(-Math.PI / 2 + (completion - (this.arcSize / 2)));
                this.wheelCtx.fillStyle = "black";
                this.wheelCtx.fillText("     " + this.items[i], 0, 0, 260);
                this.wheelCtx.restore();
            }
        }
    }

    drawPointer(){
        // Draws triangle at 90deg point of wheel
        this.pointer = this.shadow.querySelector(".pointerCanvas");
        this.pointCtx = this.pointer.getContext("2d");
        this.pointCtx.fillStyle = "black";

        this.pointCtx.beginPath();
        this.pointCtx.moveTo(790, 370)
        this.pointCtx.lineTo(790, 430)
        this.pointCtx.lineTo(730, 400);
        this.pointCtx.fill();
    }

    spinWheel(){
        // Adjusts CSS properties to and adds class to trigger animation
        const toSpin = 1080 + (Math.random() * 360);
        this.wheel.style.setProperty("--s", (this.currentAngle + "deg"));
        this.wheel.style.setProperty("--e", (Math.floor(this.currentAngle+toSpin) + "deg"));
        this.wheel.classList.add("active");
        this.currentAngle = Math.floor(this.currentAngle +toSpin) % 360;
        this.wheel.style.setProperty("--r", this.currentAngle + "deg");
        this.wheel.addEventListener("animationend", this.verifyAnswer.bind(this), {once: true})
    }

    verifyAnswer(){
        // calculates what arc is at the 90 degree point / pointer arrow
        this.wheel.classList.remove("active");
        const winnerPos = Math.floor((((450-this.currentAngle) % 360) * Math.PI/180) / this.arcSize);
        // Announces Winner
        this.pointCtx.clearRect(0, 600, 800, 200);
        this.pointCtx.font = "64px serif";
        this.pointCtx.lineWidth = 3;
        const text = "Winner is " + this.items[winnerPos];
        this.pointCtx.strokeText(text, 400 - this.pointCtx.measureText(text).width / 2, 770, 720)
        this.pointCtx.fillStyle = this.colors[winnerPos]
        this.pointCtx.fillText(text, 400 - this.pointCtx.measureText(text).width / 2, 770, 720);
    }

    deleteWheel(){
        // if revisiting, move this to index.js
        const wheelList = JSON.parse(localStorage.getItem("wheels"));
        for (let wheel of wheelList){
            if (wheel.id === this.getAttribute("id")){
                wheelList.splice(wheelList.indexOf(wheel), 1);
            }
        }
        const area = document.querySelector("#settingsArea");
        while (area.hasChildNodes()){
            area.removeChild(area.firstChild);
        }
        localStorage.setItem("wheels", JSON.stringify(wheelList));
        this.shadowRoot.host.remove();
    }

}

customElements.define("wheel-picker", fortuneWheel);
