// import { FieldsValuesList, StoreValueList } from "./StorageHelper";
// const readXlsxFile = require('read-excel-file/node');
import XLSX = require('xlsx');


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
    let input = $('<input />')
        .attr('type', "file")
        .attr('accept', "txt")
    input.change((eventObject: JQueryEventObject) => {
        FileSelected(eventObject, input)
    })
    input.click()
}
function FileSelected(eventObject: JQueryEventObject, input: JQuery) {
    let regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx|.csv)$/;
    let fileName = input.prop('value').toLowerCase();
    if (regex.test(fileName)) {
        if (typeof (FileReader) != "undefined") {
            let reader = new FileReader();
            //For Browsers other than IE.
            if (reader.readAsBinaryString) {
                reader.onload = function (e) {
                    ProcessExcel(e.target.result, input.prop('value'));
                };
                reader.readAsBinaryString(input.prop('files')[0]);
            } else {
                //For IE Browser.
                reader.onload = function (e) {
                    let data = "";
                    //let bytes = new Uint8Array(e.target.result);
                    //for (let i = 0; i < bytes.byteLength; i++) {
                    //  data += String.fromCharCode(bytes[i]);
                    //}
                    //ProcessExcel(data);
                };
                reader.readAsArrayBuffer(input.prop('files')[0]);
            }
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid Excel file.");
    }
    // let x = eventObject.target;
    // let y = x;
    // //let file = input.files[0];
    // let file = input.prop('files')[0];
    // let fr = new FileReader();

    // fr.onload = () => {
    //     let x = fr.result;
    // };
    // //fr.readAsText(file);
    // //fr.readAsBinaryString(file); //as bit work with base64 for example upload to server
    // fr.readAsDataURL(file);
    // //readXlsxFile('/path/to/file').then((rows) => {
    // //  rows.forEach(row => {
    // //    row.forEach(element => {

    // //  });
    // //});
    // // `rows` is an array of rows
    // // each row being an array of cells.
    // //})
}
function ProcessExcel(data, path) {

    var workbook = XLSX.read(data, {
        type: 'binary'
    });

    //Fetch the name of First Sheet.
    var firstSheet = workbook.SheetNames[0];

    //Read all rows from First Sheet into an JSON array.
    //     var excelRows = XLSX.utils.(workbook.Sheets[firstSheet]);
    //     var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);

    //     //Create a HTML Table element.
    //     var table = $("<table />");
    //     table[0].border = "1";

    //     //Add the header row.
    //     var row = $(table[0].insertRow(-1));

    //    //Add the header cells.
    //     var headerCell = $("<th />");
    //     headerCell.html("Id");
    //     row.append(headerCell);

    //     var headerCell = $("<th />");
    //     headerCell.html("Name");
    //     row.append(headerCell);

    //     var headerCell = $("<th />");
    //     headerCell.html("Country");
    //     row.append(headerCell);

    //     //Add the data rows from Excel file.
    //     for (var i = 0; i < excelRows.length; i++) {
    //         //Add the data row.
    //         var row = $(table[0].insertRow(-1));

    //         //Add the data cells.
    //         var cell = $("<td />");
    //         cell.html(excelRows[i].Id);
    //         row.append(cell);

    //         cell = $("<td />");
    //         cell.html(excelRows[i].Name);
    //         row.append(cell);

    //         cell = $("<td />");
    //         cell.html(excelRows[i].Country);
    //         row.append(cell);
    //     }

    // var dvExcel = $("#dvExcel");
    // dvExcel.html("");
    // dvExcel.append(table);
}
function MapFile() {

}
function PushDoc(controlName: string) {
    //StoreValueList(controlName, this.fieldsValuesList)

}
VSS.register(VSS.getContribution().id, provider);