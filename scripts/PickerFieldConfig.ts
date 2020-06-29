import { StoreValueList, FieldValues, GetValue, RetriveControlList, ControlsNames, StoreControlList } from "./StorageHelper";
import GitRestClient = require("TFS/VersionControl/GitRestClient");
import { GitCommitRef, GitChange, ItemContent, GitItem, GitRefUpdate, GitPush, GitRepository, GitRef } from "TFS/VersionControl/Contracts";
//import { Control } from "VSS/Controls";
//ArrayBuffer = require('to-array-buffer');

let provider = () => {
    return {
        execute: (actionContext) => {

        }
    };
};
function InitP() {
    $("#uploadCsv").change((e) => {
        FileSelected(e);
    })
    VSS.resize();
    RetriveControlList().then((controlList) => {
        let $ulList = $("#CollectionControlList");
        controlList.forEach(control => {
            let $il = $("<li />");
            if (control.projectName == "" || control.fileName == undefined) {
                control.projectName = "Collection";
            }
            $il.text("scope : " + control.projectName + " control name : " + control.controlName + " file name : " + control.fileName);
            $ulList.append($il);
        });
    });
}
function FileSelected(e: JQueryEventObject) {
    let input = $("#uploadCsv");
    GetValue("RepoInfo").then((infos: { repoProject: string, repoName: string }) => {
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
                        MapValues(controlName, fileResult, infos.repoProject, infos.repoName);
                    };
                    reader.readAsBinaryString(input.prop('files')[0]);
                } //else {
                //For IE Browser.
                // reader.onload = function (e) {
                //     let data = "";
                //     alert('not chrom');
                //     let c: ArrayBuffer = toArrayBuffer(e.target.result);
                //     let bytes = new Uint8Array(c)
                //     for (let i = 0; i < bytes.byteLength; i++) {
                //         data += String.fromCharCode(bytes[i]);
                //     }
                //     MapValues(controlName, data, infos.repoProject, infos.repoName);
                // };
                // reader.readAsArrayBuffer(input.prop('files')[0]);
                //}
            } else {
                alert("This browser does not support HTML5.");
            }
        } else {
            alert("Please upload a valid Excel file.");
        }
    })
}
function MapValues(controlName: string, fileResult: string, projectName: string, repoName: string) {
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
    PushDoc(controlName, fieldsValuesList, fileResult, projectName, repoName);
}
function PushDoc(controlName: string, fieldsValuesList, fileResult: string, projectName: string, repoName: string) {
    StoreValueList(controlName, fieldsValuesList).then(() => {
        RetriveControlList().then((controlList) => {
            let flag = false;
            controlList.forEach(control => {
                if (control.fileName == controlName) {
                    flag = true;
                }
            });
            if (!flag) {
                let control: ControlsNames = {
                    controlName: controlName,
                    fileName: "controlName.csv",
                    projectName: ""
                }
                controlList.push(control);
                let $ulList = $("#CollectionControlList");
                let $il = $("<li />");
                $il.text(`scope : ${control.projectName}, control name : ${control.controlName}, file name : ${control.fileName}`);
                $ulList.append($il);
            }
            StoreControlList(controlList);
            controlList.push();
        });
        PushToGit(fileResult, controlName, projectName, repoName)
        alert(controlName + " Value list updated.");
    })
}
function PushToGit(refName: string, controlName: string, projectName: string, repostoryName: string) {
    let git: GitRestClient.GitHttpClient4 = GitRestClient.getClient();
    git.getRepository(repostoryName, projectName).then((repostory: GitRepository) => {
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
                pushCommit(git, gitChanges, repostoryId, projectName, repostory, controlName, 'Upload New File');  //project
                git.getItem(repostoryId, controlName + ".csv").then((item) => {
                    let gitChanges: GitChange[] = [<GitChange>{
                        changeType: 2, // 1-add  2- edit
                        newContent: <ItemContent>{ content: refName, contentType: 0 }, //0-> RawText = 0, Base64Encoded = 1,
                        item: <GitItem>{
                            path: '/' + controlName + '.csv'
                        }
                    }];
                    pushCommit(git, gitChanges, repostoryId, projectName, repostory, controlName, 'Upload Edited File'); //project
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

VSS.register(VSS.getContribution().id, provider);
InitP();

// get the uploaded list
// show it
// on load new... add it to the list and add to view