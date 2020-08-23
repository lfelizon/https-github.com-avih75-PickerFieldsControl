import * as WitService from "TFS/WorkItemTracking/Services";
import { Model } from "./PickerFieldModel";
import { View } from "./PickerFieldView";
import { ErrorView } from "./errorView";
import * as Q from "q";
import { RetriveValueList } from "./StorageHelper";
export class Controller {
    private _editeList: string = "false";
    private _controlName: string = "";
    private _fieldName1: string = "";
    private _fieldValue1: string = "";
    private _fieldName2: string = "";
    private _fieldValue2: string = "";
    private _fieldName3: string = "";
    private _fieldValue3: string = "";
    private _fieldName4: string = "";
    private _fieldValue4: string = "";
    private _reposetory: string = "";
    private _viewOption: string = "";
    private _inputs: IDictionaryStringTo<string>;
    private _model: Model;
    constructor() {
        this._initialize();
    }
    private _initialize(): void {
        this._inputs = VSS.getConfiguration().witInputs;
        this._editeList = this._inputs["CanEdit"];
        this._controlName = this._inputs["ControlName"];
        this._fieldName1 = this._inputs["FieldName1"];
        this._fieldValue1 = this._inputs["Field1"];
        this._fieldName2 = this._inputs["FieldName2"];
        this._fieldValue2 = this._inputs["Field2"];
        this._fieldName3 = this._inputs["FieldName3"];
        this._fieldValue3 = this._inputs["Field3"];
        this._fieldName4 = this._inputs["FieldName4"];
        this._fieldValue4 = this._inputs["Field4"];
        this._reposetory = this._inputs["Reposetory"];
        this._viewOption = this._inputs["ViewOption"];
        WitService.WorkItemFormService.getService().then(
            (service) => {
                Q.spread(
                    [
                        service.getFieldValue(this._editeList),
                        this._controlName,
                        this._reposetory,
                        this._viewOption,
                        this._fieldName1,
                        service.getFieldValue(this._fieldValue1),
                        this._fieldValue1,
                        this._fieldName2,
                        service.getFieldValue(this._fieldValue2),
                        this._fieldValue2,
                        this._fieldName3,
                        service.getFieldValue(this._fieldValue3),
                        this._fieldValue3,
                        this._fieldName4,
                        service.getFieldValue(this._fieldValue4),
                        this._fieldValue4
                    ],
                    (editList: string, controlName: string, reposetory: string, viewOption: string,
                        fieldName1: string, fieldValue1: string, fieldRefName1: string,
                        fieldName2: string, fieldValue2: string, fieldRefName2: string,
                        fieldName3: string, fieldValue3: string, fieldRefName3: string,
                        fieldName4: string, fieldValue4: string, fieldRefName4: string) => {
                        let projectName = VSS.getWebContext().project.name;
                        RetriveValueList(controlName, projectName).then((doc) => {
                            this._model = new Model(controlName, editList, doc, reposetory, viewOption,
                                fieldName1, fieldValue1, fieldRefName1,
                                fieldName2, fieldValue2, fieldRefName2,
                                fieldName3, fieldValue3, fieldRefName3,
                                fieldName4, fieldValue4, fieldRefName4);
                            let view = new View(this._model);
                        })
                    }, this._handleError
                ).then(null, this._handleError);
            },
            this._handleError
        );
    }
    private _handleError(error: string): void {
        new ErrorView(error);
    }
}