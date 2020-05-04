import { StoreValueList, FieldValues } from "./StorageHelper";
import { getClient } from 'VSS/Security/RestClient';


let provider = (actionContext) => {
    return {
        execute: (LoadedArgs: any) => {
            LoaFile();
        },
    };
};
function LoaFile() {
    let input = $('<input />')
        .attr('type', "file")
        .attr('accept', "txt")
    input.change(() => {
        CheckPermission();
        FileSelected(input); 
    })
    input.click()
}
function FileSelected(input: JQuery) {
    let regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx|.csv)$/;
    let fileName: string = input.prop('value').toLowerCase();
    if (regex.test(fileName)) {
        let fileSplitPath = input.prop('value').toString().split("\\");
        let controlName = fileSplitPath[fileSplitPath.length - 1].split('.')[0];
        if (typeof (FileReader) != "undefined") {
            let reader = new FileReader();
            //For Browsers other than IE.
            if (reader.readAsBinaryString) {
                reader.onload = function (e) {
                    let fieldsValuesList = {
                        FieldsLists: new Array<Array<FieldValues>>()
                    }
                    let level1List = new Array<FieldValues>();
                    let level2List = new Array<FieldValues>();
                    let level3List = new Array<FieldValues>();
                    let level4List = new Array<FieldValues>();
                    let fileResult = e.target.result.toString();
                    let rows: Array<string> = fileResult.split("\n");
                    for (let index = 1; index < rows.length; index++) {
                        const cells = rows[index].split(',');
                        let check: boolean = false;
                        if (cells[0] != "") {
                            level1List.forEach(element => {
                                if (element.Depend == "" && element.Value == cells[1])
                                    check = true;
                            });
                            if (!check) {
                                level1List.push({ Depend: "", Value: cells[1] });
                                level2List.push({ Depend: cells[1], Value: cells[2] });
                                level3List.push({ Depend: cells[1] + cells[2], Value: cells[3] });
                                level4List.push({ Depend: cells[1] + cells[2] + cells[3], Value: cells[4] });
                            }
                            else {
                                check = false;
                                level2List.forEach(element => {
                                    if (element.Depend == cells[1] && element.Value == cells[2])
                                        check = true;
                                });
                                if (!check) {
                                    level2List.push({ Depend: cells[1], Value: cells[2] });
                                    level3List.push({ Depend: cells[1] + cells[2], Value: cells[3] });
                                    level4List.push({ Depend: cells[1] + cells[2] + cells[3], Value: cells[4] });
                                }
                                else {
                                    check = false;
                                    level3List.forEach(element => {
                                        if (element.Depend == cells[1] + cells[2] && element.Value == cells[3])
                                            check = true;
                                    });
                                    if (!check) {
                                        level3List.push({ Depend: cells[1] + cells[2], Value: cells[3] });
                                        level4List.push({ Depend: cells[1] + cells[2] + cells[3], Value: cells[4] });
                                    }
                                    else {
                                        check = false;
                                        level4List.forEach(element => {
                                            if (element.Depend == cells[1] + cells[2] + cells[3] && element.Value == cells[4])
                                                check = true;
                                        });
                                        if (!check) {
                                            level4List.push({ Depend: cells[1] + cells[2] + cells[3], Value: cells[4] });
                                        }
                                    }
                                }
                            }
                        }
                    }
                    fieldsValuesList.FieldsLists.push(level1List);
                    fieldsValuesList.FieldsLists.push(level2List);
                    fieldsValuesList.FieldsLists.push(level3List);
                    fieldsValuesList.FieldsLists.push(level4List);
                    PushDoc(controlName, fieldsValuesList);
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
}
function PushDoc(controlName: string, fieldsValuesList) {
    StoreValueList(controlName, fieldsValuesList)
    alert("Looks Like " + controlName + " value list updated");
}
function CheckPermission() {
    // let securi = getClient().hasPermissions
}
VSS.register(VSS.getContribution().id, provider);