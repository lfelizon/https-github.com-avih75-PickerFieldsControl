//import { FieldsValuesList, StoreValueList } from "./StorageHelper";
//const readXlsxFile = require('read-excel-file/node');
export class ExcellConverter {
    //fieldsValuesList: FieldsValuesList;
    constructor() {
        this.LoaFile();
        this.MapFile();
        //this.PushDoc("controlName");
        alert("Hello, world");
    }
    private LoaFile() {
        var input = $('<input/>')
            .attr('type', "file")
            .attr('name', "file")
            .attr('id', "someName");
        input.click();
        // readXlsxFile('/path/to/file').then((rows) => {
        //     rows.forEach(row => {
        //         row.forEach(element => {

        //         });
        //     });
        //     // `rows` is an array of rows
        //     // each row being an array of cells.
        // })
    }
    private MapFile() {

    }
    // private PushDoc(controlName: string) {
    //     StoreValueList(controlName, this.fieldsValuesList)
    // }
}
//module.exports = ExcellConverter;