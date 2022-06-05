function init(){
    const wheelList = localStorage.getItem("wheels)")
    if (wheelList){
        for (let wheel in wheelList){
            makeCustomWheel(JSON.parse(wheel))
        }
    } else{
        makeDefaultWheel()
    }
    if (!localStorage.getItem("next-id")){
        localStorage.setItem("next-id", "1");
    }
}

function makeDefaultWheel(){
    const wheel = document.createElement("wheel-picker");
    wheel.setAttribute("id", "0");
    wheel.setAttribute("items", '["Placeholder", "Lorem Ipsum"]');
    wheel.setAttribute("colors", '["red", "blue"]');
    const wheelObj = {
        "id": "0",
        "items": ["Placeholder", "Lorem Ipsum"],
        "colors": ["red", "blue"]
    };
    localStorage.setItem("wheels", JSON.stringify(wheelObj));
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
