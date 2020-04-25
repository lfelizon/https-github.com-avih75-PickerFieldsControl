import * as WitService from "TFS/WorkItemTracking/Services";
import { Model } from "./PickerFieldModel";
import { View } from "./PickerFieldView";
import { ErrorView } from "./errorView";
import * as Q from "q";
import { RetriveValueList } from "./StorageHelper";
export class Controller {
    private _fieldsQuantity: string = "";
    private _controlName: string = "";
    private _fieldName1: string = "";
    private _fieldValue1: string = "";
    private _fieldName2: string = "";
    private _fieldValue2: string = "";
    private _fieldName3: string = "";
    private _fieldValue3: string = "";
    private _fieldName4: string = "";
    private _fieldValue4: string = "";
    private _inputs: IDictionaryStringTo<string>;
    private _model: Model;
    private _view: View;

    constructor() {

        this._initialize();
    }
    private _initialize(): void {
        this._inputs = VSS.getConfiguration().witInputs;
        this._fieldsQuantity = this._inputs["FieldQuntity"];
        this._controlName = this._inputs["ControlName"];
        this._fieldName1 = this._inputs["FieldName1"];
        this._fieldValue1 = this._inputs["Field1"];
        this._fieldName2 = this._inputs["FieldName2"];
        this._fieldValue2 = this._inputs["Field2"];
        this._fieldName3 = this._inputs["FieldName3"];
        this._fieldValue3 = this._inputs["Field3"];
        this._fieldName4 = this._inputs["FieldName4"];
        this._fieldValue4 = this._inputs["Field4"];

        WitService.WorkItemFormService.getService().then(
            (service) => {
                Q.spread(
                    [
                        service.getFieldValue(this._fieldsQuantity),
                        service.getFieldValue(this._controlName),
                        service.getFieldValue(this._fieldName1),
                        service.getFieldValue(this._fieldValue1),
                        service.getFieldValue(this._fieldName2),
                        service.getFieldValue(this._fieldValue2),
                        service.getFieldValue(this._fieldName3),
                        service.getFieldValue(this._fieldValue3),
                        service.getFieldValue(this._fieldName4),
                        service.getFieldValue(this._fieldValue4)
                    ],
                    (fieldsQuantity: string, controlName: string,
                        fieldName1: string, fieldValue1: string,
                        fieldName2: string, fieldValue2: string,
                        fieldName3: string, fieldValue3: string,
                        fieldName4: string, fieldValue4: string) => {
                        this.updateView(fieldsQuantity, 'FieldQuntity')
                        this.updateView(fieldsQuantity, 'ControlName')
                        this.updateView(fieldName1, 'FieldName1')
                        this.updateView(fieldValue1, 'Field1')
                        this.updateView(fieldName2, 'FieldName2')
                        this.updateView(fieldValue2, 'Field2')
                        this.updateView(fieldName3, 'FieldName3')
                        this.updateView(fieldValue3, 'Field3')
                        this.updateView(fieldName4, 'FieldName4')
                        this.updateView(fieldValue4, 'Field4')
                        //RetriveValue("controlName").then((doc) => {
                        RetriveValueList("Piker1").then((doc) => {
                            this._model = new Model(fieldsQuantity, controlName, fieldName1, fieldValue1, fieldName2,
                                fieldValue2, fieldName3, fieldValue3, fieldName4, fieldValue4, doc);
                            //this._view = new View(doc, this._model, (val, fieldName) => {
                            this._view = new View(this._model, (val, fieldName) => {
                                //this.updateView(val, fieldName);
                                // service.getFieldValues([this._fieldsQuantity, this._fieldName1, this._fieldValue1, this._fieldName2, this._fieldValue2,
                                // this._fieldName3, this._fieldValue3, this._fieldName4, this._fieldValue4
                                // ]).then((valuesList: IDictionaryStringTo<any>) => {
                                //     //         this.updateView(this._model.getCurrentValue('valuesGrouped'), 'valuesGrouped');
                                // })
                            })
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
    private updateView(value: string, fieldName: string) {
        WitService.WorkItemFormService.getService().then(
            (service) => {
                service.setFieldValue(fieldName, value).then(() => {
                    //this._model.setCurrentValue(value, fieldName);
                    //this._view.Update(value, fieldName);
                }, this._handleError);
            },
            this._handleError
        );
    }
    // public getFieldName(): string {
    //     return ""; 
    // }
}