import { StoreValueList, FieldValues, GetValue, RetriveControlList, ControlsNames, StoreControlList, KillValueList, RepoInfo } from "./StorageHelper";
import GitRestClient = require("TFS/VersionControl/GitRestClient");
import { GitCommitRef, GitChange, ItemContent, GitItem, GitRefUpdate, GitPush, GitRepository, GitRef } from "TFS/VersionControl/Contracts";

//ArrayBuffer = require('to-array-buffer');

let provider = () => {
    return {
        execute: (actionContext) => {
        }
    };
};
function CleanCell(cell: string) {
    let newCell: string = ""
    for (let index = 0; index < cell.length; index++) {
        if (cell.charCodeAt(index) != 13)
            newCell += cell[index]
    }
    return newCell.trim();
}
function InitP() {
    $("#uploadCsv").change((e) => {
        FileSelected(e);
    });
    $("#uploadFile").click(() => FileUpload());
    $("#uploadContent").click(() => TextUpload())
    VSS.resize();
    RetriveControlList().then((controlList) => {
        controlList.forEach(control => {
            AddNewItemList(control, controlList);
        });
    });
}
function DeleteControl($il: JQuery, control: ControlsNames, controlList: Array<ControlsNames>) {
    $il.hide();
    controlList.splice(controlList.indexOf(control), 1);
    StoreControlList(controlList);
    KillValueList(control.controlName);
}
function FileUpload() {
    let input = $("#uploadCsv");
}
function FileSelected(e: JQueryEventObject) {
    let input = $("#uploadCsv");
    GetValue("RepoInfop").then((infos: RepoInfo) => {
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
                        MapValues(controlName, fileResult, infos);
                    };
                    reader.readAsBinaryString(input.prop('files')[0]);
                }
            } else {
                alert("This browser does not support HTML5.");
            }
        } else {
            alert("Please upload a valid Excel file.");
        }
    })
}
function MapValues(controlName: string, fileResult: string, infos: RepoInfo) {
    let fieldsValuesList = {
        FieldsLists: new Array<Array<FieldValues>>()
    }
    let level1List = new Array<FieldValues>();
    let level2List = new Array<FieldValues>();
    let level3List = new Array<FieldValues>();
    let level4List = new Array<FieldValues>();
    let repetedValues = new Array<string>();
    repetedValues.push(" Duplicated Line where in the file ");
    let rows: Array<string> = fileResult.split("\n");
    for (let index = 1; index < rows.length; index++) {
        const cells = rows[index].split(',');
        cells.forEach(cell => {
            cell = CleanCell(cell);
        });
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
                        else {
                            repetedValues.push(cells[1] + " " + cells[2] + " " + cells[3] + " " + cells[4]);
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
    alert(repetedValues.length + repetedValues.toString());
    PushDoc(controlName, fieldsValuesList, fileResult, infos);
}
function PushDoc(controlName: string, fieldsValuesList, fileResult: string, infos: RepoInfo) {
    StoreValueList(controlName, fieldsValuesList).then(() => {
        RetriveControlList().then((controlList) => {
            let flag = false;
            controlList.forEach(control => {
                if (control.controlName == controlName) {
                    flag = true;
                }
            });
            if (!flag) {
                let scope: string = controlName.split("_")[0];
                if (scope == controlName)
                    scope = "Collection";
                let control: ControlsNames = {
                    controlName: controlName,
                    fileName: `${controlName}.csv`,
                    projectName: scope
                }
                controlList.push(control);
                AddNewItemList(control, controlList);
                StoreControlList(controlList);
                alert(controlName + " Value list created.");
            }
            else {
                alert(controlName + " Value list updated.");
            }
        });
        if (infos != undefined)
            PushToGit(fileResult, controlName, infos);
    })
}
function AddNewItemList(control: ControlsNames, controlList: ControlsNames[]) {
    let $ulList = $("#CollectionControlList");
    let $il = $("<li />");
    $il.text(`scope : ${control.projectName}, control name : ${control.controlName}, file name : ${control.fileName}`);
    let $button = $("<button />");
    $button.text("X");
    $button.css("font-size", "small");
    $button.css("padding-left", "10px");
    $button.css("margin-left", "10px");
    $button.css("width", "10px");
    $button.css("hight", "10px");
    $button.click(() => DeleteControl($il, control, controlList));
    $il.append($button);
    $ulList.append($il);
}
function PushToGit(refName: string, controlName: string, infos: RepoInfo) {// projectName: string, repoName: string
    let git: GitRestClient.GitHttpClient4 = GitRestClient.getClient();
    git.getRepository(infos.repoName, infos.repoProject).then((repostory: GitRepository) => {
        if (repostory != undefined) {
            let repostoryId = repostory.id;
            if (typeof (repostoryId) === "string") {
                let gitChanges: GitChange[] = [<GitChange>{
                    changeType: 1, // 1-add  2- edit
                    newContent: <ItemContent>{ content: refName, contentType: 0 }, //0-> RawText = 0, Base64Encoded = 1,
                    item: <GitItem>{
                        path: '/' + controlName + '.csv'
                    }
                }];
                pushCommit(git, gitChanges, repostoryId, infos.repoProject, repostory, controlName, 'Upload New File');  //project
                git.getItem(repostoryId, controlName + ".csv").then((item) => {
                    let gitChanges: GitChange[] = [<GitChange>{
                        changeType: 2, // 1-add  2- edit
                        newContent: <ItemContent>{ content: refName, contentType: 0 }, //0-> RawText = 0, Base64Encoded = 1,
                        item: <GitItem>{
                            path: '/' + controlName + '.csv'
                        }
                    }];
                    pushCommit(git, gitChanges, repostoryId, infos.repoProject, repostory, controlName, 'Upload Edited File'); //project
                });

            }
        }
        else {
            alert("Cant find reposetory");
        }
    })
}
function pushCommit(git: GitRestClient.GitHttpClient4, gitChanges: GitChange[], repostoryId: string, project: string, repostory: GitRepository, controlName: string, message: string) {
    let gitCommitRef: GitCommitRef[] = [
        <GitCommitRef>{
            changes: gitChanges,
            comment: message
        }
    ]
    git.getRefs(repostoryId, project).then((refs) => {
        let ref: GitRef = refs.find(element => element.name === "refs/heads/master");
        if (ref != undefined) {
            let refUpdates: Array<GitRefUpdate> = [<GitRefUpdate>{
                name: ref.name,
                oldObjectId: ref.objectId
            }];
            let gitPush: GitPush = <GitPush>{
                commits: gitCommitRef,
                refUpdates: refUpdates,
                repository: repostory
            };
            git.createPush(gitPush, repostoryId, project).then((gitPush) => {
                if (gitPush != undefined) {
                    alert(controlName + ".csv file Commited.");
                }
            });
        }
    })
}
function TextUpload() {
    let $contentFile = $("#uploadString");
    let $fileName = $("#fileName");
    let errorMessage: string = ""
    if ($fileName.val() == "" || !checkIfNameOk($fileName.val())) {
        errorMessage += "No file name \n"
    }
    if ($contentFile.val() == "") {
        errorMessage += "No file Content \n"
    }
    if (errorMessage != "") {
        alert(errorMessage);

    }
    else {
        GetValue("RepoInfop").then((infos: RepoInfo) => {
            MapValues($fileName.val(), $contentFile.val(), infos);
        })
    }
}
function checkIfNameOk(fileName: string) {
    return true
}
VSS.register(VSS.getContribution().id, provider);
InitP();

// get the uploaded list
// show it
// on load new... add it to the list and add to view