import {Dart} from './src/DartChecks.class.js';
import  {Key} from "./src/Key.class.js";
import {API} from "./src/API.js";
// File name 'c:/PROG/js/darts/src/Key.class.js' differs from already included file name 'c:/PROG/js/darts/src/key.class.js' only in casing.
//   The file is in the program because:
//     Root file specified for compilation
//     Imported via "./src/Key.class.js" from file 'c:/PROG/js/darts/init.js'timport  {Dart} from "./src/DartChecks.class.js";

let key;
let dart;

function init() {
    key=new Key();
    key.api=new API("checklist");
    dart=new Dart();
    window.key=key;
}
window.onload = () => init();
