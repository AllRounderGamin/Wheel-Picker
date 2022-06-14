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
    const wheelObj = {
        "id": "0",
        "items": '["Placeholder", "Lorem Ipsum", "Test"]',
        "colors": '["red", "blue", "green"]'
    };
    setUpAttributes(wheel, wheelObj);
    wheelList.push(wheelObj);
    localStorage.setItem("wheels", JSON.stringify(wheelList));
    document.querySelector("#wheelArea").appendChild(wheel);
}

function makeNewWheel(){
    const wheel = document.createElement("wheel-picker");
    const LS = JSON.parse(localStorage.getItem("wheels"));
    const id = (localStorage.getItem("next-id"));
    const wheelObj = {
        "id": id,
        "items": '["Click Settings", "To Customise"]',
        "colors": '["red", "blue"]'
    };
    setUpAttributes(wheel, wheelObj);
    LS.push(wheelObj);
    localStorage.setItem("wheels", JSON.stringify(LS));
    localStorage.setItem("next-id", (parseInt(id) + 1).toString());
    document.querySelector("#wheelArea").appendChild(wheel);
}

function makeCustomWheel(wheelInfo){
    const wheel = document.createElement("wheel-picker");
    setUpAttributes(wheel, wheelInfo);
    document.querySelector("#wheelArea").appendChild(wheel);
}

function loadSettings(e){
    const settingArea = document.querySelector("#settingsArea");
    clearArea(settingArea);

    let wheelSettings;
    const wheelId = e.target.getAttribute("wheelid");
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
        setUpButton(i.toString(), "optid", "Remove Option", removeOption, option);
        settingArea.appendChild(option);
    }
    setUpButton("id", "addOpt", "Add Option", addOption, settingArea);
    setUpButton(wheelId, "wheelid", "Save Settings", saveSettings, settingArea)
}

function saveSettings(e){
    const wheelId = e.target.getAttribute("wheelid");
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
        if (wheel.id === wheelId){
            wheelIndex = wheels.indexOf(wheel);
            wheelObj = wheels[wheelIndex];
        }
    }
    wheelObj.items = JSON.stringify(itemList);
    wheelObj.colors = JSON.stringify(colorList);

    wheels[wheelIndex] = wheelObj;

    localStorage.setItem("wheels", JSON.stringify(wheels));
}

function setUpAttributes(wheel, attr){
    wheel.setAttribute("id", attr.id);
    wheel.setAttribute("items", attr.items);
    wheel.setAttribute("colors", attr.colors);
    wheel.setAttribute("customising", "false");
    const settings = wheel.shadowRoot.querySelector(".settingsButton");
    settings.setAttribute("wheelid", attr.id);
    settings.addEventListener("click", loadSettings);
}

function setUpButton(id, attr, name, event, area){
    const button = document.createElement("button");
    button.setAttribute(attr, id);
    button.textContent = name;
    button.setAttribute("type", "button");
    button.addEventListener("click", event);
    area.appendChild(button);
}

function addOption(){
    let option = document.createElement("div");
    option.setAttribute("class", "setting");
    option.appendChild(document.querySelector("#option").content.cloneNode(true));
    const subButton = document.querySelector("#addOption");
    subButton.parentNode.insertBefore(option, subButton);
}

function removeOption(e){
    const allOptions = document.querySelectorAll(".setting");
    const option = allOptions[e.target.getAttribute("optid")];
    option.remove();
}

function clearArea(area){
    while (area.hasChildNodes()){
        area.removeChild(area.firstChild);
    }
}

window.addEventListener("load", init);
