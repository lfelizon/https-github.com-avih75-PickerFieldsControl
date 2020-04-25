import { DocRow, FieldValues, RetriveValue, StoreValue, FieldsValuesList } from "./StorageHelper";

export class Model {
    public fieldValuesList: FieldsValuesList;
    public fieldsQuantity: string;
    public controlName: string;
    public fieldsName: Array<string>;
    public fieldsValue: Array<string>; 

    constructor(fieldsQuantity: string, controlName: string, fieldName1: string, fieldValue1: string, fieldName2: string, fieldValue2: string,
        fieldName3: string, fieldValue3: string, fieldName4: string, fieldValue4: string, fieldValuesList: FieldsValuesList) {
        this.fieldsQuantity = fieldsQuantity;
        this.controlName = controlName;
        this.fieldValuesList = fieldValuesList;
        if (fieldName1 != null && fieldName1 != undefined && fieldValue1 != null && fieldValue1 != undefined) {
            this.fieldsName.push(fieldName1);
            this.fieldsValue.push(fieldValue1);
            if (fieldName2 != null && fieldName2 != undefined && fieldValue2 != null && fieldValue2 != undefined) {
                this.fieldsName.push(fieldName2);
                this.fieldsValue.push(fieldValue2);
                if (fieldName3 != null && fieldName3 != undefined && fieldValue3 != null && fieldValue3 != undefined) {
                    this.fieldsName.push(fieldName3);
                    this.fieldsValue.push(fieldValue3);
                    if (fieldName4 != null && fieldName4 != undefined && fieldValue4 != null && fieldValue4 != undefined) {
                        this.fieldsName.push(fieldName4);
                        this.fieldsValue.push(fieldValue4);
                    }
                }
            }
        }
        if (+fieldsQuantity != this.fieldsName.length) {
            console.log("Number of entered fields not fit to the quantity required by the user")
        }
        //this.GetListFromStorage("controlName");
    }
    // public setCurrentValue(value: string, fieldName: string) {
    //     if (value === undefined) {
    //         throw "Undefined value";
    //     }
    //     else if (fieldName == 'FieldQuntity') {
    //         this.fieldsQuantity = String(value);
    //     }
    //     else if (fieldName == 'ControlName') {
    //         this.controlName = String(value);
    //     }
    //     else if (fieldName == 'FieldName1') {
    //         this.fieldName1 = String(value);
    //     }
    //     else if (fieldName == 'Field1') {
    //         this.fieldValue1 = String(value);
    //     }
    //     else if (fieldName == 'FieldName2') {
    //         this.fieldName2 = String(value);
    //     }
    //     else if (fieldName == 'Field2') {
    //         this.fieldValue2 = String(value);
    //     }
    //     else if (fieldName == 'FieldName3') {
    //         this.fieldName3 = String(value);
    //     }
    //     else if (fieldName == 'Field3') {
    //         this.fieldValue3 = String(value);
    //     }
    //     else if (fieldName == 'FieldName4') {
    //         this.fieldName4 = String(value);
    //     }
    //     else if (fieldName == 'Field4') {
    //         this.fieldValue4 = String(value);
    //     }

    // }
    // public getCurrentValue(fieldName: string): string {
    //     if (fieldName == 'FieldQuntity') {
    //         return this.fieldsQuantity;
    //     }
    //     if (fieldName == 'ControlName') {
    //         return this.controlName;
    //     }
    //     else if (fieldName == 'FieldName1') {
    //         return this.fieldName1;
    //     }
    //     else if (fieldName == 'Field1') {
    //         return this.fieldValue4;
    //     }
    //     else if (fieldName == 'FieldName2') {
    //         return this.fieldName2;
    //     }
    //     else if (fieldName == 'Field2') {
    //         return this.fieldValue4;
    //     }
    //     else if (fieldName == 'FieldName3') {
    //         return this.fieldName3;
    //     }
    //     else if (fieldName == 'Field3') {
    //         return this.fieldValue4;
    //     }
    //     else if (fieldName == 'FieldName4') {
    //         return this.fieldName4;
    //     }
    //     else if (fieldName == 'Field4') {
    //         return this.fieldValue4;
    //     }
    // }

}