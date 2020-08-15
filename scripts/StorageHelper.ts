/// <reference types="vss-web-extension-sdk" />
export interface ControlsNames {
    controlName: string;
    projectName: string;
    fileName: string;
}
export interface FieldValues {
    Depend: string;
    Value: string;
}
export interface FieldsValuesList {
    FieldsLists: Array<Array<FieldValues>>;
}
export interface RepoInfo {
    repoProject: string;
    repoName: string;
}

// Reposetory path - set the repository by key
// repoProject - the project that contains the reposetory
// repoName - the repositoryName
export async function GetValue(key: string) {
    let dataService: any = await VSS.getService(VSS.ServiceIds.ExtensionData);
    let result: RepoInfo = await dataService.getValue(key);
    return result;
}
export async function SetValue(key: string, value: RepoInfo) {
    var deferred = $.Deferred();
    let dataService: any = await VSS.getService(VSS.ServiceIds.ExtensionData);
    let result = await dataService.setValue(key, value);
    deferred.resolve();
    return deferred;
}

// Control Values - set the values by key as scope 
// key = control name  |  collection scoped
// key = ProjectName_ControlName  |  scoped per project
export async function StoreValueList(key: string, value: FieldsValuesList) {
    var deferred = $.Deferred();
    let dataService: any = await VSS.getService(VSS.ServiceIds.ExtensionData);
    let result = await dataService.setValue(key, value);
    deferred.resolve();
    return deferred;
}
export async function RetriveValueList(key1: string, key2: string) {
    // key1 - control name * key2-project name
    let key: string = key1;
    let dataService: any = await VSS.getService(VSS.ServiceIds.ExtensionData);
    let result: FieldsValuesList = await dataService.getValue(key);
    key = key2 + "_" + key1;
    let commonResult: FieldsValuesList = await dataService.getValue(key);
    if (commonResult != undefined) {
        result = commonResult;
    }
    return result;
}
export async function KillValueList(key: string) {
    let dataService: any = await VSS.getService(VSS.ServiceIds.ExtensionData);
    dataService.setValue(key, undefined);
    dataService.deleteValue(key);
}

// Control List - get list of all controls
export async function StoreControlList(controlList: Array<ControlsNames>) {
    var deferred = $.Deferred();
    let dataService: any = await VSS.getService(VSS.ServiceIds.ExtensionData);
    let result = await dataService.setValue("pickerControl", controlList);
    deferred.resolve();
    return deferred;
}
export async function RetriveControlList() {
    let dataService: any = await VSS.getService(VSS.ServiceIds.ExtensionData);
    let result: Array<ControlsNames> = new Array<ControlsNames>();
    try {
        result = await dataService.getValue("pickerControl");
    }
    catch {
        result = new Array<ControlsNames>();
    }
    if (result == undefined) {
        result = new Array<ControlsNames>();
    }
    return result;
}