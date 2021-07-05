import { FieldValues, FieldsValuesList, SetValue } from "./StorageHelper";
export class Model {
    public fieldValuesList: FieldsValuesList;
    public fieldsQuantity: string;
    public controlName: string;
    public fieldsName: Array<string>;
    public fieldsValue: Array<string>;
    public fieldsRefName: Array<string>;
    public fieldsHide: Array<boolean>;
    public summarizeToPath: string;
    public summarizeToPathValue: string;
    public summarizeToPathRefName: string;
    public projectRepo: string;
    public repoName: string;
    public viewOption: string;
    public privateBehaviure: string;
    constructor(controlName: string, ValuesList: FieldsValuesList, reposetory: string, viewOption: string,
        fieldName1: string, fieldValue1: string, fieldRefName1: string, fieldHide1,
        fieldName2: string, fieldValue2: string, fieldRefName2: string, fieldHide2,
        fieldName3: string, fieldValue3: string, fieldRefName3: string, fieldHide3,
        fieldName4: string, fieldValue4: string, fieldRefName4: string, fieldHide4,
        summarizeToPath: string, summarizeToPathRefName: string, privateBehaviure: string) {
        this.privateBehaviure = privateBehaviure
        this.summarizeToPathRefName = summarizeToPathRefName;
        this.summarizeToPath = summarizeToPath;
        if (viewOption != undefined)
            this.viewOption = viewOption;
        else
            this.viewOption = "1";
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
        this.fieldsHide = new Array<boolean>();
        this.fieldsHide.push((fieldHide1) == true);
        this.fieldsHide.push((fieldHide2) == true);
        this.fieldsHide.push((fieldHide3) == true);
        this.fieldsHide.push((fieldHide4) == true);
        this.fieldsName.push(fieldName1);
        this.fieldsValue.push(fieldValue1);
        this.fieldsRefName.push(fieldRefName1);
        this.fieldValuesList.FieldsLists.push(ValuesList.FieldsLists[0]);
        this.fieldsName.push(fieldName2);
        this.fieldsValue.push(fieldValue2);
        this.fieldsRefName.push(fieldRefName2);
        this.summarizeToPath = fieldValue1 + '\\' + fieldValue2;
        this.fieldValuesList.FieldsLists.push(ValuesList.FieldsLists[1]);
        if (fieldName3 != null && fieldName3 != undefined && fieldValue3 != null && fieldValue3 != undefined) {
            if (fieldValue3 != "")
                this.summarizeToPath += '\\' + fieldValue3;
            this.fieldsName.push(fieldName3);
            this.fieldsValue.push(fieldValue3);
            this.fieldsRefName.push(fieldRefName3);
            this.fieldValuesList.FieldsLists.push(ValuesList.FieldsLists[2]);
            if (fieldName4 != null && fieldName4 != undefined && fieldValue4 != null && fieldValue4 != undefined) {
                if (fieldValue4 != "")
                    this.summarizeToPath += '\\' + fieldValue4;
                this.fieldsName.push(fieldName4);
                this.fieldsValue.push(fieldValue4);
                this.fieldsRefName.push(fieldRefName4);
                this.fieldValuesList.FieldsLists.push(ValuesList.FieldsLists[3]);
            }
        }
        this.fieldsQuantity = this.fieldsName.length.toString();
    }
}