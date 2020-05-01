import { FieldValues, FieldsValuesList } from "./StorageHelper";
export class Model {
    public fieldValuesList: FieldsValuesList;
    public fieldsQuantity: string;
    public controlName: string;
    public fieldsName: Array<string>;
    public fieldsValue: Array<string>;
    public fieldsRefName: Array<string>;

    constructor(controlName: string, fieldValuesList: FieldsValuesList,
        fieldName1: string, fieldValue1: string, fieldRefName1: string,
        fieldName2: string, fieldValue2: string, fieldRefName2: string,
        fieldName3: string, fieldValue3: string, fieldRefName3: string,
        fieldName4: string, fieldValue4: string, fieldRefName4: string) {
        //this.fieldsQuantity = fieldsQuantity;
        this.controlName = controlName;
        this.fieldValuesList = fieldValuesList;
        this.fieldsName = new Array<string>();
        this.fieldsValue = new Array<string>();
        this.fieldsRefName = new Array<string>();
        //if (fieldName1 != null && fieldName1 != undefined && fieldValue1 != null && fieldValue1 != undefined) {
        this.fieldsName.push(fieldName1);
        this.fieldsValue.push(fieldValue1);
        this.fieldsRefName.push(fieldRefName1);
        //if (fieldName2 != null && fieldName2 != undefined && fieldValue2 != null && fieldValue2 != undefined) {
        this.fieldsName.push(fieldName2);
        this.fieldsValue.push(fieldValue2);
        this.fieldsRefName.push(fieldRefName2);
        if (fieldName3 != null && fieldName3 != undefined && fieldValue3 != null && fieldValue3 != undefined) {
            this.fieldsName.push(fieldName3);
            this.fieldsValue.push(fieldValue3);
            this.fieldsRefName.push(fieldRefName3);
            if (fieldName4 != null && fieldName4 != undefined && fieldValue4 != null && fieldValue4 != undefined) {
                this.fieldsName.push(fieldName4);
                this.fieldsValue.push(fieldValue4);
                this.fieldsRefName.push(fieldRefName4);
            }
        }
        this.fieldsQuantity = this.fieldsName.length.toString();
    }
}