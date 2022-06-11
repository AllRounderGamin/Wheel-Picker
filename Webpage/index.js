function init(){
    const wheelList = JSON.parse(localStorage.getItem("wheels"));
    if (wheelList && wheelList.length > 0){
        for (let wheel of wheelList){
            makeCustomWheel(wheel)
        }
    } else{
        makeDefaultWheel()
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
    const wheelObj = {
        "id": "0",
        "items": '["Placeholder", "Lorem Ipsum", "Test"]',
        "colors": '["red", "blue", "green"]'
    };
    wheelList.push(wheelObj)
    localStorage.setItem("wheels", JSON.stringify(wheelList));
    document.querySelector("#wheelArea").appendChild(wheel);
}

function makeNewWheel(){
    const wheel = document.createElement("wheel-picker");
    const LS = JSON.parse(localStorage.getItem("wheels"));
    const id = (localStorage.getItem("next-id"));
    wheel.setAttribute("id", id)
    wheel.setAttribute("items", '["Click Settings", "To Customise"]');
    wheel.setAttribute("colors", '["red", "blue"]');
    const wheelObj = {
        "id": id,
        "items": '["Click Settings", "To Customise"]',
        "colors": '["red", "blue"]'
    };
    LS.push(wheelObj);
    localStorage.setItem("wheels", JSON.stringify(LS));
    localStorage.setItem("next-id", (parseInt(id) + 1).toString());
    document.querySelector("#wheelArea").appendChild(wheel);
}

function makeCustomWheel(wheelInfo){
    const wheel = document.createElement("wheel-picker");
    wheel.setAttribute("id", wheelInfo.id);
    wheel.setAttribute("items", wheelInfo.items);
    wheel.setAttribute("colors", wheelInfo.colors);
    document.querySelector("#wheelArea").appendChild(wheel);
}

window.addEventListener("load", init);
