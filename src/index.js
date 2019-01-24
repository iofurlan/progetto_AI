import 'bootstrap/dist/css/bootstrap.min.css';
import './style.scss';

import $ from 'jquery';
import {Trainer} from './trainer';
import {Drawer} from './drawer';

/* ----------------------------------REFS--------------------------------- */
const parent = document.getElementById('paint-box');
console.log(parent);
const canvas = document.getElementById('canvas');
const msg_y = document.getElementById('msg-y');
const msg_list = document.getElementById('msg-list');


/* -------------------------------CONSTANTS------------------------------- */
const TIME_TO_DRAW = 1 * 1000;

/* -------------------------------VARIABLES------------------------------- */
const trainer = new Trainer();
const drawer = new Drawer(canvas, trainer.X, parent);


let timeout = null;
let y;

init_components();
step_0();
/* -------------------------------FUNCTIONS------------------------------- */
function init_components() {
    trainer.on('update', () => {
        drawer.redraw();
    });
}

drawer.on("drawing", () => {
    if (!drawer.enabled)
        return;
    if (timeout!=null) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(step_1, TIME_TO_DRAW);
});
function step_0() {
    console.log("step_0");
    trainer.reset();
    y = Trainer.get_random_y();
    msg_y.innerText = y;
    timeout = null;
    drawer.enabled = true;
}
function step_1 () {
    console.log("step_1");
    drawer.enabled =false;
    trainer.reduce();
    setTimeout(step_2, 250);
}
function step_2() {
    console.log("step_2");
    let [pred, error] = trainer.train(y);
    msg_list.innerHTML = "";
    for (let i = 0; i < pred.length; i++) {
        msg_list.innerHTML += pred[i].number + ") " + pred[i].accuracy + "<br/>";
    }
    msg_list.innerHTML+="<br/>Errore: <b>"+error+"</b>";
    setTimeout(step_0,0);
}