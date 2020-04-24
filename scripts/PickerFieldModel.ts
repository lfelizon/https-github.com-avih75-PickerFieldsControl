import { DocRow, FieldValues, RetriveValue, StoreValue } from "./StorageHelper";

export class Model {
    public fieldsQuantity: string;
    public controlName: string;
    public fieldName1: string;
    public fieldValue1: string;
    public fieldName2: string;
    public fieldValue2: string;
    public fieldName3: string;
    public fieldValue3: string;
    public fieldName4: string;
    public fieldValue4: string;

    constructor(fieldsQuantity: string, controlName: string, fieldName1: string, fieldValue1: string, fieldName2: string, fieldValue2: string,
        fieldName3: string, fieldValue3: string, fieldName4: string, fieldValue4: string) {
        this.fieldsQuantity = fieldsQuantity;
        this.controlName = controlName;
        this.fieldName1 = fieldName1;
        this.fieldValue1 = fieldValue1;
        this.fieldName2 = fieldName2;
        this.fieldValue2 = fieldValue2;
        this.fieldName3 = fieldName3;
        this.fieldValue3 = fieldValue3;
        this.fieldName4 = fieldName4;
        this.fieldValue4 = fieldValue4;
        //this.GetListFromStorage("controlName");
    }
    public setCurrentValue(value: string, fieldName: string) {
        if (value === undefined) {
            throw "Undefined value";
        }
        else if (fieldName == 'FieldQuntity') {
            this.fieldsQuantity = String(value);
        }
        else if (fieldName == 'ControlName') {
            this.controlName = String(value);
        }
        else if (fieldName == 'FieldName1') {
            this.fieldName1 = String(value);
        }
        else if (fieldName == 'Field1') {
            this.fieldValue1 = String(value);
        }
        else if (fieldName == 'FieldName2') {
            this.fieldName2 = String(value);
        }
        else if (fieldName == 'Field2') {
            this.fieldValue2 = String(value);
        }
        else if (fieldName == 'FieldName3') {
            this.fieldName3 = String(value);
        }
        else if (fieldName == 'Field3') {
            this.fieldValue3 = String(value);
        }
        else if (fieldName == 'FieldName4') {
            this.fieldName4 = String(value);
        }
        else if (fieldName == 'Field4') {
            this.fieldValue4 = String(value);
        }

    }
    public getCurrentValue(fieldName: string): string {
        if (fieldName == 'FieldQuntity') {
            return this.fieldsQuantity;
        }
        if (fieldName == 'ControlName') {
            return this.controlName;
        }
        else if (fieldName == 'FieldName1') {
            return this.fieldName1;
        }
        else if (fieldName == 'Field1') {
            return this.fieldValue4;
        }
        else if (fieldName == 'FieldName2') {
            return this.fieldName2;
        }
        else if (fieldName == 'Field2') {
            return this.fieldValue4;
        }
        else if (fieldName == 'FieldName3') {
            return this.fieldName3;
        }
        else if (fieldName == 'Field3') {
            return this.fieldValue4;
        }
        else if (fieldName == 'FieldName4') {
            return this.fieldName4;
        }
        else if (fieldName == 'Field4') {
            return this.fieldValue4;
        }
    }
    // public GetListFromStorage(controlName: string) {
    //     let doc: DocRow = {
    //         values1: new Array<FieldValues>(),
    //         values2: new Array<FieldValues>(),
    //         values3: new Array<FieldValues>(),
    //         values4: new Array<FieldValues>(),
    //     }
    //     doc.values1.push({ Depend: "", Value: "Hadad" })
    //     doc.values1.push({ Depend: "", Value: "Sheler" })
    //     doc.values2.push({ Depend: "Hadad", Value: "Avi" })
    //     doc.values2.push({ Depend: "Hadad", Value: "Riki" })
    //     doc.values2.push({ Depend: "Sheler", Value: "Moshe" })
    //     doc.values2.push({ Depend: "Sheler", Value: "Dana" })
    //     doc.values3.push({ Depend: "Avi", Value: "Pans" })
    //     doc.values3.push({ Depend: "Riki", Value: "Dress" })
    //     doc.values3.push({ Depend: "Dana", Value: "Shirt" })
    //     doc.values3.push({ Depend: "Moshe", Value: "Pans" })
    //     doc.values4.push({ Depend: "Pans", Value: "Long" })
    //     doc.values4.push({ Depend: "Pans", Value: "Short" })
    //     doc.values4.push({ Depend: "Shirt", Value: "T" })
    //     doc.values4.push({ Depend: "Dress", Value: "Red" })
    //     doc.values4.push({ Depend: "Dress", Value: "Blue" })
    //     StoreValue(controlName, doc);
    //     return RetriveValue(controlName);
    //     // RetriveValue(controlName).then((doc2) => {
    //     //     let x = doc2
    //     // });
    // }
}