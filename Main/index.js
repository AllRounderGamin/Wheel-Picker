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
    const settings = wheel.shadowRoot.querySelector(".settingsButton");
    settings.setAttribute("wheelid", "0");
    settings.addEventListener("click", loadSettings);
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
    settings.setAttribute("wheelid", id);
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
    settings.setAttribute("wheelid", wheelInfo.id);
    settings.addEventListener("click", loadSettings);
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
    let remove;
    for (let i = 0; i < wheelSettings.items.length; i++){
        let option = document.createElement("div");
        option.setAttribute("class", "setting");
        option.appendChild(document.querySelector("#option").content.cloneNode(true));
        option.querySelector(".item").value = items[i];
        option.querySelector(".color").value = colors[i];
        remove = option.querySelector(".remove");
        remove.setAttribute("optid", i.toString());
        remove.addEventListener("click", removeOption)
        settingArea.appendChild(option);
    }
    const addOpt = document.createElement("button");
    addOpt.setAttribute("id", "addOption");
    addOpt.textContent = "Add Option";
    addOpt.setAttribute("type", "button");
    addOpt.addEventListener("click", addOption);
    settingArea.appendChild(addOpt)

    const submit = document.createElement("button");
    submit.setAttribute("wheelid", wheelId);
    submit.textContent = "Save Settings";
    submit.setAttribute("type", "button");
    submit.addEventListener("click", saveSettings);
    settingArea.appendChild(submit);
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

function removeOption(e){
    const allOptions = document.querySelectorAll(".setting");
    const option = allOptions[e.target.getAttribute("optid")];
    option.remove();
}

function addOption(){
    let option = document.createElement("div");
    option.setAttribute("class", "setting");
    option.appendChild(document.querySelector("#option").content.cloneNode(true));
    const subButton = document.querySelector("#addOption");
    subButton.parentNode.insertBefore(option, subButton);
}

function clearArea(area){
    while (area.hasChildNodes()){
        area.removeChild(area.firstChild);
    }
}

window.addEventListener("load", init);
