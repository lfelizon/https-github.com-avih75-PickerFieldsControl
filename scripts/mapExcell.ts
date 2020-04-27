// import { FieldsValuesList, StoreValueList } from "./StorageHelper";
// const readXlsxFile = require('read-excel-file/node');
var provider = (actionContext) => {
    return {
        execute: (LoadedArgs: any) => {
            //let fieldsValuesList: FieldsValuesList;
            LoaFile();
            let controlName = AskForControlName()
            MapFile();
            PushDoc(controlName);
            alert(actionContext + " , world1 , " + LoadedArgs);
        },
    };
};
function AskForControlName() {
    return "";
}
function LoaFile() {
    // var input = $('<input/>')
    //     .attr('type', "file")
    //     .attr('name', "file")
    //     .attr('id', "someName");
    // input.click();
    // readXlsxFile('/path/to/file').then((rows) => {
    //     rows.forEach(row => {
    //         row.forEach(element => {

    //         });
    //     });
    //     // `rows` is an array of rows
    //     // each row being an array of cells.
    // })
}
function MapFile() {

}
function PushDoc(controlName: string) {
    //StoreValueList(controlName, this.fieldsValuesList)

}
VSS.register(VSS.getContribution().id, provider);