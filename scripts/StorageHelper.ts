/// <reference types="vss-web-extension-sdk" />

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
export async function RetriveValueList(key: string) {
    let result: FieldsValuesList = undefined;
    let dataService: any = await VSS.getService(VSS.ServiceIds.ExtensionData);
    result = await dataService.getValue(key);
    return result;
}