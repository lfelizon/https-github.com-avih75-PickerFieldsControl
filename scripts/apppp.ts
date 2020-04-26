//import { mapExcell } from "./scripts/mapExcell.ts"
let {mapExcell} require("./scripts/mapExcell.ts");
//const x = require("./scripts/mapExcell.ts")
VSS.init();
var menuContributionHandler = (function() {
    "use strict";
    return {
        execute: function(actionContext) {
            // let mapExcell = new mapExcell();
            
        }
    };
}());
VSS.register("myAction", menuContributionHandler);