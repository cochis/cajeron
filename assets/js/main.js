localStorage.clear();
var intentos = 5;
function currentGet() {
    var unrodered = JSON.parse(localStorage.getItem("current"));
    var sorted = unrodered.sort(function IHaveAName(a, b) {
        return b.cantidad > a.cantidad ? 1
            : b.cantidad < a.cantidad ? -1
                : 0;
    });

    return sorted;
}
function selectNvl(nvl) {
    localStorage.setItem("nvl", nvl);
    document.getElementById("nvlSelect").style.display = "none";
    document.getElementById("contBank").style.display = "block";
    document.getElementById("numberNvl").innerHTML = "Nivel " + nvl;
    setCurrent();
    showCurrent();
    getCantidad();
    chechCurrent();

}
function onRetiro() {
    var ejercicio = 0;
    var valid = validRet();
    if (valid) {
        if (localStorage.getItem("ejercicio") !== null) {
            ejercicio = Number(localStorage.getItem("ejercicio")) + 1;
        } else {
            ejercicio = ejercicio + 1;
        }
        localStorage.setItem("ejercicio", ejercicio);
        ejercicio = Number(localStorage.getItem("ejercicio"));
        localStorage.setItem("ejercicio", ejercicio);
        var nvl = Number(localStorage.getItem("nvl"));

        if (ejercicio < intentos) {
            document.getElementById("errorModalText").innerHTML = "Has completado correctamente la cantidad de dinero señalada Tienes " + (ejercicio) + " correctos";
            document.getElementById("alertTitle").innerHTML = "Bien";
            $('#alert').modal('show');
            if (nvl > 1) {
                var audio = new Audio('./assets/audio/success.mp3');
                audio.play();
            }
            var nvl = localStorage.getItem("nvl");
            selectNvl(nvl);
            cleanDrop();
            setCurrent();

            document.getElementById("congrats").style.display = "block";
            document.getElementById("contBank").style.display = "none";
            selectNvl(nvl);
            document.getElementById("checkRemove").disabled = false;
        } else {
            if (nvl > 1) {
                var audio = new Audio('./assets/audio/success.mp3');
                audio.play();
            }
            document.getElementById("errorModalText").innerHTML = "Has completado correctamente el nivel " + nvl;
            localStorage.setItem("nvl", (nvl + 1));
            localStorage.setItem("ejercicio", 0);
            document.getElementById("alertTitle").innerHTML = "Bien";
            $('#alert').modal('show');
            var nvl = localStorage.getItem("nvl");
            selectNvl(nvl);
            cleanDrop();
            setCurrent();
            if (nvl < 4) {
                document.getElementById("nvlSelect").style.display = "block";
                document.getElementById("contBank").style.display = "none";
            } else {
                document.getElementById("congrats").style.display = "block";
                document.getElementById("contBank").style.display = "none";
            }

            selectNvl(nvl);
            document.getElementById("checkRemove").disabled = false;
        }

    }

}
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev, value, type) {
    localStorage.setItem("val", Number(value));
    localStorage.setItem("valType", type);
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    var cont = ev.path[0].id;
    var value = localStorage.getItem("val");
    var current = currentGet();
    var check = document.getElementById("checkRemove").checked;
    document.getElementById("checkRemove").disabled = true;
    for (let i = 0; i < current.length; i++) {

        if (current[i].cantidad == value) {
            current[i].flag = true;
        }
    }
    localStorage.setItem("current", JSON.stringify(current));


    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    if (cont == "div1") {
        sum(localStorage.getItem("val"));
    }
    else {
        res(localStorage.getItem("val"));
    }

}
function sum(value) {
    var total;
    if (!localStorage.getItem("totalSum")) {
        total = Number(value);
    } else {
        total = Number(localStorage.getItem("totalSum")) + Number(value);
    }
    localStorage.setItem("totalSum", total);
    chechCurrent();
}

function res(value) {
    var total;
    if (!localStorage.getItem("totalSum")) {
        total = Number(value);
    } else {
        total = Number(localStorage.getItem("totalSum")) - Number(value);
    }
    localStorage.setItem("totalSum", total);
    chechCurrent();
}

function getCantidad() {
    var number = Math.random() * 1000;
    document.getElementById("cantidad").innerHTML = "$" + number.toFixed();
    localStorage.setItem("cantidadRet", number.toFixed());
}
function setCurrent() {
    var current = [
        { type: "billete", cantidad: 1000, flag: false },
        { type: "billete", cantidad: 500, flag: false },
        { type: "billete", cantidad: 200, flag: false },
        { type: "billete", cantidad: 100, flag: false },
        { type: "billete", cantidad: 50, flag: false },
        { type: "billete", cantidad: 20, flag: false },
        { type: "moneda", cantidad: 10, flag: false },
        { type: "moneda", cantidad: 5, flag: false },
        { type: "moneda", cantidad: 2, flag: false },
        { type: "moneda", cantidad: 1, flag: false }
    ];
    localStorage.setItem("current", JSON.stringify(current));
}
function sumCantidad(value, type) {
    var current = currentGet();
    if (current !== null) {
        var cantidad = {
            type: type,
            cantidad: value,
            flag: false
        }
        
            current.push(cantidad);
            localStorage.setItem("current", JSON.stringify(current));
      

    }

}
function chechCurrent() {
    var check = document.getElementById("checkRemove").checked;
    var nvl = Number(localStorage.getItem("nvl"));
    var current = currentGet();
    var ret = Number(localStorage.getItem("cantidadRet"));
    var total = Number(localStorage.getItem("totalSum"));
    var cantidad = Number(localStorage.getItem("val"));
    var type = localStorage.getItem("valType");
    if (total) {
        ret = ret - total;
        sumCantidad(cantidad, type);
        current = currentGet();
    }
    showCurrent();
    if (check) {
        for (let i = 0; i < current.length; i++) {
            if (current[i].type == "billete") {
                if (ret < current[i].cantidad && current[i].flag == false) {
                    if (document.getElementById("drag" + current[i].cantidad + "b" + i) !== null) {
                        let element = document.getElementById("drag" + current[i].cantidad + "b" + i);
                        var padreSuperior = $(document.getElementById("drag" + current[i].cantidad + "b" + i)).parent()
                        padreSuperior.remove();
                    }
                } else {
                    if (document.getElementById("drag" + current[i].cantidad + "b" + i) !== null) {
                        document.getElementById("drag" + current[i].cantidad + "b" + i).style.display = "block";
                    }
                }

            } else {

                if (ret < current[i].cantidad && current[i].flag == false) {
                    document.getElementById("drag" + current[i].cantidad + "m" + i).style.display = "none";
                } else {
                    if (document.getElementById("drag" + current[i].cantidad + "m" + i) !== null) {
                        document.getElementById("drag" + current[i].cantidad + "m" + i).style.display = "block";
                    }
                }
            }
        }
    }
    var chechRandom = localStorage.getItem("chechRandom");

    if (nvl > 4) {
        document.getElementById("congrats").style.display = "block";
        document.getElementById("contBank").style.display = "none";



    } else {
        if (chechRandom == null) {
            if (nvl > 2) {
                fillRandom();
            }
        }

    }




}

function showCurrent() {
    var current = currentGet();
    var check = document.getElementById("checkRemove").checked;
    var inner = "";


    for (let i = 0; i < current.length; i++) {
        if (current[i].flag == false) {
            if (current[i].type == "billete") {
                inner += '<div class="billete"><img id = "drag' + current[i].cantidad + 'b' + i + '" draggable = "true" ondragstart = "drag(event ,' + current[i].cantidad + ',&#39;billete&#39;)" src = "assets/img/' + current[i].cantidad + 'pesos.jpg" alt = "' + current[i].cantidad + ' pesos"></div >';

            } else {
                inner += '<div class="moneda"><img id = "drag' + current[i].cantidad + 'm' + i + '" draggable = "true" ondragstart = "drag(event ,' + current[i].cantidad + ',&#39;modena&#39;)" src = "assets/img/' + current[i].cantidad + 'pesosM.jpg" alt = "' + current[i].cantidad + ' pesos"></div >';
            }
        }
    }

    document.getElementById("div2").innerHTML = inner;
}
function cleanDrop() {
    var ejercicio = Number(localStorage.getItem("ejercicio"));
    var total = Number(localStorage.getItem("totalSum"));
    var nvl = Number(localStorage.getItem("nvl"));
    var totalSum = Number(localStorage.getItem("totalSum"));
    localStorage.clear();

    var inner = '  <div class=" drop text-center " style="margin: auto; width: 80%; height: 80%;" id="div1" ondrop="drop(event)" ondragover="allowDrop(event)"></div>';
    document.getElementById("drp").innerHTML = inner;
    localStorage.setItem("ejercicio", ejercicio);
    if (nvl > 2) {

        localStorage.setItem("totalSum", total);
    }


}

function validRet() {
    var nvl = localStorage.getItem("nvl");
    var ret = Number(localStorage.getItem("cantidadRet"));
    var total = Number(localStorage.getItem("totalSum"));
    if (total > ret) {
        document.getElementById("errorModalText").innerHTML = "El dinero acumulado sobrepasa la cantidad señalada";
        document.getElementById("alertTitle").innerHTML = "Error cantidad mayor ";
        $('#alert').modal('show');
        if (nvl > 1) {
            var audio = new Audio('./assets/audio/error.mp3');
            audio.play();
        }
        return false;
    }
    if (total < ret) {
        document.getElementById("errorModalText").innerHTML = "El dinero acumulado no cubre la cantidad señalada";
        document.getElementById("alertTitle").innerHTML = "Error cantidad menor ";
        $('#alert').modal('show');
        if (nvl > 1) {
            var audio = new Audio('./assets/audio/error.mp3');
            audio.play();
        }
        return false;

    }
    if (total == ret) {
        return true;
    }
}
function closeAlert() {
    $('#alert').modal('hide');
}
function validCheck() {
    var check = document.getElementById("checkRemove").checked;
    var current = currentGet();
    var ret = Number(localStorage.getItem("cantidadRet"));
    var total = Number(localStorage.getItem("totalSum"));
    var cantidad = Number(localStorage.getItem("val"));
    var type = localStorage.getItem("valType");
    if (total) {
        ret = ret - total;
        sumCantidad(cantidad, type);
        current = currentGet();
    }
    if (check) {
        for (let i = 0; i < current.length; i++) {
            if (current[i].type == "billete") {
                if (ret < current[i].cantidad && current[i].flag == false) {
                    if (document.getElementById("drag" + current[i].cantidad + "b" + i) !== null) {
                        let element = document.getElementById("drag" + current[i].cantidad + "b" + i);
                        var padreSuperior = $(document.getElementById("drag" + current[i].cantidad + "b" + i)).parent()
                        padreSuperior.remove();
                    }
                } else {
                    if (document.getElementById("drag" + current[i].cantidad + "b" + i) !== null) {
                        document.getElementById("drag" + current[i].cantidad + "b" + i).style.display = "block";
                    }
                }

            } else {

                if (ret < current[i].cantidad && current[i].flag == false) {
                    document.getElementById("drag" + current[i].cantidad + "m" + i).style.display = "none";
                } else {
                    if (document.getElementById("drag" + current[i].cantidad + "m" + i) !== null) {
                        document.getElementById("drag" + current[i].cantidad + "m" + i).style.display = "block";
                    }
                }
            }
        }
    } else {
        showCurrent();
    }
}

function fillRandom() {
    localStorage.setItem("chechRandom", true);
    var nvl = Number(localStorage.getItem("nvl"));
    var total = Number(localStorage.getItem("totalSum"));
    if (nvl > 2) {
        var current = currentGet();
        var keys = Object.keys(current);
        var inner = '  <div class=" drop text-center " style="margin: auto; width: 80%; height: 80%;" id="div1" ondrop="drop(event)" ondragover="allowDrop(event)"></div>';
        document.getElementById("drp").innerHTML = inner;
        inner = "";
        var total = 0;
        for (let i = 0; i < 5; i++) {
            let randomProperty = keys[Math.floor(keys.length * Math.random())]
            let botName = current[randomProperty]
            for (let i = 0; i < current.length; i++) {
                if (current[i].type == botName.type && current[i].cantidad == botName.cantidad) {
                    total = total + botName.cantidad;
                    console.log(botName);
                    if (current[i].type == "billete") {
                        inner += '<div class="billete"><img id = "drag' + botName.cantidad + 'b' + (i * 10) + '" draggable = "true" ondragstart = "drag(event ,' + botName.cantidad + ',&#39;billete&#39;)" src = "assets/img/' + botName.cantidad + 'pesos.jpg" alt = "' + botName.cantidad + ' pesos"></div >';

                    } else {
                        console.log(botName.cantidad);
                        if (botName.cantidad > 0) {
                            console.log('<div class="moneda"><img id = "drag' + botName.cantidad + 'm' + (i * 10) + '" draggable = "true" ondragstart = "drag(event ,' + botName.cantidad + ',&#39;modena&#39;)" src = "assets/img/' + botName.cantidad + 'pesosM.jpg" alt = "' + botName.cantidad + ' pesos"></div >');
                            inner += '<div class="moneda"><img id = "drag' + botName.cantidad + 'm' + (i * 10) + '" draggable = "true" ondragstart = "drag(event ,' + botName.cantidad + ',&#39;modena&#39;)" src = "assets/img/' + botName.cantidad + 'pesosM.jpg" alt = "' + botName.cantidad + ' pesos"></div >';
                        }

                    }
                }
            }
            localStorage.setItem("totalSum", total);
        }

        document.getElementById("div1").innerHTML = inner;
    }

}

function restore() {
    localStorage.removeItem("ejercicio");
    localStorage.removeItem("totalSum");
    localStorage.removeItem("nvl");
    localStorage.removeItem("total");
    localStorage.removeItem("current");
    localStorage.removeItem("cantidadRet");
    document.getElementById("nvlSelect").style.display = "block";
    document.getElementById("congrats").style.display = "none";



}