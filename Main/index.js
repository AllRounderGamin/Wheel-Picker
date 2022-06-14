function init(){
    const wheelList = JSON.parse(localStorage.getItem("wheels"));
    if (wheelList && wheelList.length > 0){
        for (let wheel of wheelList){
            makeCustomWheel(wheel);
        }
    } else{
        makeDefaultWheel();
    }
    if (!localStorage.getItem("next-id")){
        localStorage.setItem("next-id", "1");
    }
    document.querySelector("#addWheelButton").addEventListener("click", makeNewWheel);
}

function makeDefaultWheel(){
    const wheel = document.createElement("wheel-picker");
    const wheelList = [];
    wheel.setAttribute("id", "0");
    wheel.setAttribute("items", '["Placeholder", "Lorem Ipsum", "Test"]');
    wheel.setAttribute("colors", '["red", "blue", "green"]');
    wheel.setAttribute("customising", "false");
    const wheelObj = {
        "id": "0",
        "items": '["Placeholder", "Lorem Ipsum", "Test"]',
        "colors": '["red", "blue", "green"]'
    };
    wheelList.push(wheelObj);
    localStorage.setItem("wheels", JSON.stringify(wheelList));
    document.querySelector("#wheelArea").appendChild(wheel);
}

function makeNewWheel(){
    const wheel = document.createElement("wheel-picker");
    const LS = JSON.parse(localStorage.getItem("wheels"));
    const id = (localStorage.getItem("next-id"));
    wheel.setAttribute("id", id);
    wheel.setAttribute("items", '["Click Settings", "To Customise"]');
    wheel.setAttribute("colors", '["red", "blue"]');
    wheel.setAttribute("customising", "false");
    const wheelObj = {
        "id": id,
        "items": '["Click Settings", "To Customise"]',
        "colors": '["red", "blue"]'
    };
    LS.push(wheelObj);
    localStorage.setItem("wheels", JSON.stringify(LS));
    localStorage.setItem("next-id", (parseInt(id) + 1).toString());
    const settings = wheel.shadowRoot.querySelector(".settingsButton");
    settings.setAttribute("id", id);
    settings.addEventListener("click", loadSettings);
    document.querySelector("#wheelArea").appendChild(wheel);
}

function makeCustomWheel(wheelInfo){
    const wheel = document.createElement("wheel-picker");
    wheel.setAttribute("id", wheelInfo.id);
    wheel.setAttribute("items", wheelInfo.items);
    wheel.setAttribute("colors", wheelInfo.colors);
    wheel.setAttribute("customising", "false");
    const settings = wheel.shadowRoot.querySelector(".settingsButton");
    settings.setAttribute("id", wheelInfo.id);
    settings.addEventListener("click", loadSettings);
    document.querySelector("#wheelArea").appendChild(wheel);
}

function loadSettings(e){
    const settingArea = document.querySelector("#settingsArea");
    clearArea(settingArea);

    let wheelSettings;
    const wheelId = e.target.id;
    const wheelList = document.querySelectorAll("wheel-picker");
    for (let wheel of wheelList){
        if (wheel.id === wheelId){
            wheelSettings = wheel;
        }
    }

    wheelSettings.setAttribute("customising", "true");
    const items = wheelSettings.items;
    const colors = wheelSettings.colors;
    for (let i = 0; i < wheelSettings.items.length; i++){
        let option = document.createElement("div");
        option.setAttribute("class", "setting");
        option.appendChild(document.querySelector("#option").content.cloneNode(true));
        option.querySelector(".item").value = items[i];
        option.querySelector(".color").value = colors[i];
        settingArea.appendChild(option);
    }

    const submit = document.createElement("button");
    submit.setAttribute("id", wheelId);
    submit.textContent = "Save Settings";
    submit.setAttribute("type", "button");
    submit.addEventListener("click", saveSettings);
    settingArea.appendChild(submit);
}

function saveSettings(e){
    const wheelId = e.target.id;
    let wheelSettings;
    const wheelList = document.querySelectorAll("wheel-picker");
    for (let wheel of wheelList){
        if (wheel.id === wheelId){
            wheelSettings = wheel;
        }
    }
    const items = document.querySelectorAll(".item");
    const colors = document.querySelectorAll(".color");
    const itemList = [];
    const colorList = [];

    for (let node of items){
        itemList.push(node.value);
    }
    for (let node of colors){
        colorList.push(node.value);
    }

    wheelSettings.setAttribute("items", JSON.stringify(itemList));
    wheelSettings.setAttribute("colors", JSON.stringify(colorList));
    wheelSettings.setAttribute("customising", "false");

    let wheels = JSON.parse(localStorage.getItem("wheels"));
    let wheelIndex;
    let wheelObj;
    for (let wheel of wheels){
        if (wheel.id === this.getAttribute("id")){
            wheelIndex = wheels.indexOf(wheel);
            wheelObj = wheels[wheelIndex];
        }
    }
    wheelObj.items = JSON.stringify(itemList);
    wheelObj.colors = JSON.stringify(colorList);

    wheels[wheelIndex] = wheelObj;

    localStorage.setItem("wheels", JSON.stringify(wheels));
}

function clearArea(area){
    while (area.hasChildNodes()){
        area.removeChild(area.firstChild);
    }
}

window.addEventListener("load", init);