const WHEELTEMP = document.createElement("template");
WHEELTEMP.innerHTML='<link href="./stylesheet.css" rel="stylesheet">\n' +
    '    <div class="container">\n' +
    '        <div class="wheelContainer">\n' +
    '            <canvas class="wheelCanvas" width="400" height="400"></canvas>\n' +
    '            <canvas class="pointerCanvas" width="400" height="400"></canvas>\n' +
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
        this.wheelCtx.font = "32px serif";
        this.wheelCtx.textBaseline = "middle";
        // Draws each part of the circle arc by arc, minus Math.PI/2 so that it starts at the top
        for (let i = 0; i < this.items.length; i++){
            this.wheelCtx.fillStyle = this.colors[i];
            this.wheelCtx.beginPath();
            this.wheelCtx.arc(200, 200, 150, ((completion)- Math.PI/2), ((completion + this.arcSize)  - (Math.PI / 2)));
            this.wheelCtx.lineTo(200, 200);
            this.wheelCtx.fill();
            this.wheelCtx.closePath();
            completion += this.arcSize;

            // Draws rotated text
            this.wheelCtx.save();
            this.wheelCtx.translate(this.wheel.width / 2, this.wheel.height / 2);
            this.wheelCtx.rotate(-Math.PI/2 + (completion - (this.arcSize/2)));
            this.wheelCtx.fillStyle = "black";
            this.wheelCtx.fillText("     " + this.items[i], 0, 0, 130);
            this.wheelCtx.restore();

        }
    }

    drawPointer(){
        // Draws triangle at 90deg point of wheel
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
        this.pointCtx.clearRect(0, 300, 400, 100);
        this.pointCtx.font = "32px serif";
        this.pointCtx.strokeText("Winner is " + this.items[winnerPos], 30, 385, 360)
        this.pointCtx.fillStyle = this.colors[winnerPos]
        this.pointCtx.fillText("Winner is " + this.items[winnerPos], 30, 385, 360);
    }

    deleteWheel(){
        const wheelList = JSON.parse(localStorage.getItem("wheels"));
        for (let wheel of wheelList){
            if (wheel.id === this.getAttribute("id")){
                wheelList.splice(wheelList.indexOf(wheel), 1);
            }
        }
        localStorage.setItem("wheels", JSON.stringify(wheelList));
        this.shadowRoot.host.remove();
    }

}

customElements.define("wheel-picker", fortuneWheel);
