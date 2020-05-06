import { StoreValueList, FieldValues } from "./StorageHelper";
import GitRestClient = require("TFS/VersionControl/GitRestClient");
import { GitCommitRef, GitChange, ItemContent, GitItem, GitRefUpdate, GitPush, GitRepository } from "TFS/VersionControl/Contracts";

let provider = () => {
    return {
        execute: () => {
            LoaFile();
        },
    };
};
function LoaFile() {
    let input = $('<input />')
        .attr('type', "file").
        change(() => {
            CheckPermission();
            FileSelected(input);
        });
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
                    let fileResult: string = e.target.result.toString();
                    MapValues(controlName, fileResult);
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
function MapValues(controlName: string, fileResult: string) {
    let fieldsValuesList = {
        FieldsLists: new Array<Array<FieldValues>>()
    }
    let level1List = new Array<FieldValues>();
    let level2List = new Array<FieldValues>();
    let level3List = new Array<FieldValues>();
    let level4List = new Array<FieldValues>();
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
    PushDoc(controlName, fieldsValuesList, fileResult);
}
function PushDoc(controlName: string, fieldsValuesList, fileResult: string) {
    StoreValueList(controlName, fieldsValuesList);
    PushToGit(fileResult, controlName);
    alert(controlName + " Value list updated.");
}
function CheckPermission() {
    // let securi = getClient().hasPermissions
}
function PushToGit(refName: string, controlName: string) {
    let repostoryName: string = "PickerValuesList";
    let project: string = VSS.getWebContext().project.name;
    let git: GitRestClient.GitHttpClient4 = GitRestClient.getClient();
    git.getRepository(repostoryName).then((repostory: GitRepository) => {
        let repostoryId = repostory.id;
        let gitChanges: GitChange[] = [<GitChange>{
            changeType: 1,
            newContent: <ItemContent>{ content: refName, contentType: 1 }, //0-> RawText = 0, Base64Encoded = 1,
            item: <GitItem>{
                path: '/' + controlName + '.csv'
            }
        }];
        if (typeof (repostoryId) === "string") {
            git.getRefs(repostoryId, project).then((refs) => {
                let ref = refs.find(element => element.name === refName);
                let refUpdates: GitRefUpdate[] = [<GitRefUpdate>{
                    name: ref.name,
                    oldObjectId: ref.objectId
                }];
                let gitCommitRef: GitCommitRef[] = [
                    <GitCommitRef>{
                        changes: gitChanges,
                        comment: 'Push a file'
                    }
                ]
                let gitPush: GitPush = <GitPush>{
                    commits: gitCommitRef,
                    refUpdates: refUpdates,
                    repository: repostory
                };
                git.createPush(gitPush, repostoryId, project).then(() => {
                    alert(controlName + ".csv file Commited.");
                });
            })
        }
    })
}
VSS.register(VSS.getContribution().id, provider); 