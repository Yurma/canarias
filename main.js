(function () {
    let x = new Canarias;
    let y = new Canarias;
    x.value({"value": "testodX", "name": "testOdX2"});
    y.value(["testSaY", "testsaY2"]);
    let x1 = x.value().value;
    let x2 = x.value().name;
    let y1 = y.value()[0];
    let y2 = y.value()[1];

    const app = document.querySelector("#app");
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("value", y1.value());
    input.addEventListener("keyup", (event) => y1.action(event.target.value));

    const span = document.createElement("span");
    y1.track(span);
    
    app.appendChild(input);
    app.appendChild(span);

    const input2 = document.createElement("input");
    input2.setAttribute("type", "text");
    input2.setAttribute("value", x2.value());
    input2.addEventListener("keyup", (event) => x2.action(event.target.value));

    const span2 = document.createElement("span");
    x2.track(span2);
    
    app.appendChild(input2);
    app.appendChild(span2);
})()