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
export async function RetriveValueList(controlName: string, projectName: string) {
    //let result: FieldsValuesList = undefined;
    let key: string = controlName;
    let dataService: any = await VSS.getService(VSS.ServiceIds.ExtensionData);
    let result: FieldsValuesList = await dataService.getValue(key);
    key = projectName + controlName;
    let commonResult: FieldsValuesList = await dataService.getValue(key);
    if (commonResult != undefined) {
        result = commonResult;
    }
    return result;
}
function StoreListToStorage(controlName: string) {
    // Demo list
    let doc = {
        FieldsLists: new Array<Array<FieldValues>>()
    }
    let values1: Array<FieldValues> = new Array<FieldValues>();
    values1.push({ Depend: "", Value: "Hadad" });
    values1.push({ Depend: "", Value: "Sheler" });
    doc.FieldsLists.push(values1);
    let values2: Array<FieldValues> = new Array<FieldValues>();
    values2.push({ Depend: "Hadad", Value: "Avi" });
    values2.push({ Depend: "Hadad", Value: "Riki" });
    values2.push({ Depend: "Sheler", Value: "Dana" });
    values2.push({ Depend: "Sheler", Value: "Moshe" });
    doc.FieldsLists.push(values2);
    let values3: Array<FieldValues> = new Array<FieldValues>();
    values3.push({ Depend: "HadadAvi", Value: "Pans" });
    values3.push({ Depend: "HadadRiki", Value: "Dress" });
    values3.push({ Depend: "ShelerDana", Value: "Shirt" });
    values3.push({ Depend: "ShelerMoshe", Value: "Pans" });
    doc.FieldsLists.push(values3);
    let values4: Array<FieldValues> = new Array<FieldValues>();
    values4.push({ Depend: "HadadAviPans", Value: "Long" });
    values4.push({ Depend: "HadadRikiDress", Value: "Red" });
    values4.push({ Depend: "HadadRikiDress", Value: "Blue" });
    values4.push({ Depend: "ShelerDanaShirt", Value: "T-Shirt" });
    values4.push({ Depend: "ShelerMoshePans", Value: "Short" });
    values4.push({ Depend: "ShelerMoshePans", Value: "Bath" });
    doc.FieldsLists.push(values4);
    StoreValueList(controlName, doc);
    // return RetriveValue(controlName);
    // RetriveValue(controlName).then((doc2) => {
    //     let x = doc2
    // });
}

