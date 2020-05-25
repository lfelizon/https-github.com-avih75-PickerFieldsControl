/// <reference types="vss-web-extension-sdk" />

import { async } from "q";

export interface FieldValues {
    Depend: string;
    Value: string;
}
export interface FieldsValuesList {
    FieldsLists: Array<Array<FieldValues>>;
}
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
export async function GetValue(key: string) {
    let dataService: any = await VSS.getService(VSS.ServiceIds.ExtensionData);
    let result: { repoProject: string, repoName: string } = await dataService.getValue(key);
    return result;
}
export async function SetValue(key:string,value:{ repoProject: string, repoName: string }){
    var deferred = $.Deferred();
    let dataService: any = await VSS.getService(VSS.ServiceIds.ExtensionData);
    let result = await dataService.setValue(key, value);
    deferred.resolve();
    return deferred;
}