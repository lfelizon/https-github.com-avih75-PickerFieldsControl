/// <reference types="vss-web-extension-sdk" />
export interface FieldValues {
    Depend: string;
    Value: string;
}
export interface DocRow {
    values1: Array<FieldValues>;
    values2: Array<FieldValues>;
    values3: Array<FieldValues>;
    values4: Array<FieldValues>;
}

// export function StoreValue(key: string, value: DocRow): JQueryPromise<any> {
//     var deferred = $.Deferred();
//     VSS.getService(VSS.ServiceIds.ExtensionData).then((dataService: any) => {
//         dataService.setValue(key, value).then(() => {
//             deferred.resolve();
//         });
//     });
//     return deferred;
// }
// export function saveDoc(key: string, value: DocRow): boolean {
//     let respone: boolean = false;
//     try {

//     }
//     catch
//     {

//     }
//     return respone;
// }
export async function StoreValue(key: string, value: DocRow) {
    var deferred = $.Deferred();
    let dataService: any = await VSS.getService(VSS.ServiceIds.ExtensionData);
    let result = await dataService.setValue(key, value);
    deferred.resolve();
    return deferred;
}
// export function RetriveValue(key: string): JQueryPromise<any> {
//     var deferred = $.Deferred();
//     VSS.getService(VSS.ServiceIds.ExtensionData).then((dataService: any) => {
//         dataService.getValue(key).then((value) => {
//             if (value != null) {
//                 deferred.resolve(value)
//             } else {
//                 deferred.resolve();
//             }
//         });
//     });
//     return deferred;
// } 
export async function RetriveValue(key: string) {
    let result: DocRow = undefined;
    let dataService: any = await VSS.getService(VSS.ServiceIds.ExtensionData);
    result = await dataService.getValue(key);
    return result;
}