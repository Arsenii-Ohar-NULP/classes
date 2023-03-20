const current = {
    admin: false,
    regular: false
}
const color1 = "#7CEA9C";
function _switch(button) {
    var name = button.name;

    current[name] = !current[name];
    document.getElementById(name + "-filter").style.backgroundColor = current[name] ? color1 : "";
}
