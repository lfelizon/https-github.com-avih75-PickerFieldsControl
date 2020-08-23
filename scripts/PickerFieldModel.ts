import { FieldValues, FieldsValuesList, SetValue } from "./StorageHelper";
export class Model {
    public editList: boolean = false;
    public fieldValuesList: FieldsValuesList;
    public fieldsQuantity: string;
    public controlName: string;
    public fieldsName: Array<string>;
    public fieldsValue: Array<string>;
    public fieldsRefName: Array<string>;
    public projectRepo: string;
    public repoName: string;
    public viewOption: string;

    constructor(controlName: string, editList: string, ValuesList: FieldsValuesList, reposetory: string, viewOption: string,
        fieldName1: string, fieldValue1: string, fieldRefName1: string,
        fieldName2: string, fieldValue2: string, fieldRefName2: string,
        fieldName3: string, fieldValue3: string, fieldRefName3: string,
        fieldName4: string, fieldValue4: string, fieldRefName4: string) {
        if (viewOption != undefined)
            this.viewOption = viewOption;
        else
            this.viewOption = "1"
        if (editList == "true") {
            this.editList = true;
        }
        this.controlName = controlName;
        this.fieldValuesList = {
            FieldsLists: new Array<Array<FieldValues>>()
        }
        if (reposetory != undefined && reposetory != "") {
            let infos = reposetory.split("\\");
            SetValue("RepoInfo", { repoProject: infos[0], repoName: infos[1] });
        }
        this.fieldsName = new Array<string>();
        this.fieldsValue = new Array<string>();
        this.fieldsRefName = new Array<string>();
        this.fieldsName.push(fieldName1);
        this.fieldsValue.push(fieldValue1);
        this.fieldsRefName.push(fieldRefName1);
        this.fieldValuesList.FieldsLists.push(ValuesList.FieldsLists[0]); // if empty/undefine...
        //if (fieldName2 != null && fieldName2 != undefined && fieldValue2 != null && fieldValue2 != undefined) {
        this.fieldsName.push(fieldName2);
        this.fieldsValue.push(fieldValue2);
        this.fieldsRefName.push(fieldRefName2);
        this.fieldValuesList.FieldsLists.push(ValuesList.FieldsLists[1]); // if empty/undefine...
        if (fieldName3 != null && fieldName3 != undefined && fieldValue3 != null && fieldValue3 != undefined) {
            this.fieldsName.push(fieldName3);
            this.fieldsValue.push(fieldValue3);
            this.fieldsRefName.push(fieldRefName3);
            this.fieldValuesList.FieldsLists.push(ValuesList.FieldsLists[2]); // if empty/undefine...
            if (fieldName4 != null && fieldName4 != undefined && fieldValue4 != null && fieldValue4 != undefined) {
                this.fieldsName.push(fieldName4);
                this.fieldsValue.push(fieldValue4);
                this.fieldsRefName.push(fieldRefName4);
                this.fieldValuesList.FieldsLists.push(ValuesList.FieldsLists[3]);  // if empty/undefine...
            }
        }
        //}
        this.fieldsQuantity = this.fieldsName.length.toString();
    }
}