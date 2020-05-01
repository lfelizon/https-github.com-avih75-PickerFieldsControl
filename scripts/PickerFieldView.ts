import * as WitService from "TFS/WorkItemTracking/Services";
import { Model } from "./PickerFieldModel";
import { FieldValues, FieldsValuesList, StoreValueList } from "./StorageHelper";

export class View {
    private pickerFieldModel: Model;
    constructor(private model: Model) {//, private onInputChanged: Function) {
        this.pickerFieldModel = model;
        this.CreateView();
    }
    private CreateView() {
        $(".container").remove();
        var container = $("<div />");
        container.addClass("container");
        for (let index = 0; index < this.model.fieldValuesList.FieldsLists.length; index++) {
            if (this.model.fieldsValue[0] == "") {
                container.append(this.AddSelectField(this.pickerFieldModel.fieldsName[index], this.pickerFieldModel.fieldsValue[index], index + 1, this.model.fieldValuesList.FieldsLists[index]));
            }
            else {
                container.append(this.AddSelectFieldWithValues(this.pickerFieldModel.fieldsName[index], this.pickerFieldModel.fieldsValue[index], index + 1, this.model.fieldValuesList.FieldsLists[index]));
            }
        }
        $("body").append(container);
    }
    private AddSelectFieldWithValues(fieldName: string, fieldValue: string, fieldNumber: number, values: Array<FieldValues>) {
        let div = $("<div />");
        let label = $("<textBox />");
        label.text(fieldName);
        label.addClass("label")
        let newSelect = $("<select />");
        newSelect.addClass("selectField");
        newSelect.attr("id", fieldNumber);
        newSelect.change((eventObject: JQueryEventObject) => this.OnSelectChange(fieldNumber, eventObject))
        if (fieldNumber == 1) {
            values.forEach(value => {
                newSelect.append(new Option(value.Value));
            });
        }
        else if (fieldNumber == 2) {
            values.forEach(value => {
                if (value.Depend == this.model.fieldsValue[0])
                    newSelect.append(new Option(value.Value));
            });
        }
        else if (fieldNumber == 3) {
            values.forEach(value => {
                if (value.Depend == this.model.fieldsValue[0] + this.model.fieldsValue[1])
                    newSelect.append(new Option(value.Value));
            });
        }
        else {
            values.forEach(value => {
                if (value.Depend == this.model.fieldsValue[0] + this.model.fieldsValue[1] + this.model.fieldsValue[2])
                    newSelect.append(new Option(value.Value));
            });
        }
        newSelect.val(fieldValue);
        div.append(label);
        div.append(newSelect);
        return div;
    }
    private AddSelectField(fieldName: string, fieldValue: string, fieldNumber: number, values: Array<FieldValues>) {
        let div = $("<div />");
        let newSelect = $("<select />");
        let label = $("<textBox />");
        label.text(fieldName);
        label.addClass("label")
        newSelect.addClass("selectField");
        newSelect.attr("id", fieldNumber);
        newSelect.change((eventObject: JQueryEventObject) => this.OnSelectChange(fieldNumber, eventObject))
        if (fieldNumber == 1) {
            values.forEach(value => {
                newSelect.append(new Option(value.Value));
            });
            newSelect.val('');
        }
        else {
            newSelect.attr("disabled", "true");
        }
        newSelect.val(fieldValue);
        div.append(label);
        div.append(newSelect);
        return div;
    }
    private OnSelectChange(fieldNumber: number, eventObject: JQueryEventObject = undefined) {
        for (let i = fieldNumber + 1; i < 5; i++) {
            let select = $("#" + i)
            select.attr("disabled", "true");
            select.find('option').remove().end();
            select.val('');
            this.model.fieldsValue[fieldNumber] = "";
        }
        let select: string = $("#" + fieldNumber).children("option:selected").val();
        this.model.fieldsValue[fieldNumber - 1] = select;
        //if (fieldNumber == 4) {
        //this.updateWorkItem(fieldNumber, select);
        this.updateWorkItem();
        //}
        if (fieldNumber < 4) {
            if (fieldNumber > 1) {
                let prevSelect: string = $("#" + (fieldNumber - 1)).children("option:selected").val();
                this.model.fieldValuesList.FieldsLists[fieldNumber - 2].forEach(value => {
                    if (value.Value == prevSelect) {
                        select = value.Depend + prevSelect + select;
                    }
                });
            }
            let nextSelect = $("#" + (fieldNumber + 1))
            nextSelect.find('option').remove().end();
            this.model.fieldValuesList.FieldsLists[fieldNumber].forEach(value => {
                if (value.Depend == select) {
                    nextSelect.append(new Option(value.Value));
                }
            });
            nextSelect.val('');
            nextSelect.removeAttr("disabled");
        }
    }
    private updateWorkItem() {
        WitService.WorkItemFormService.getService().then(
            (service) => {
                service.setFieldValue(this.model.fieldsRefName[0], this.model.fieldsValue[0]).then(() => {
                    service.setFieldValue(this.model.fieldsRefName[1], this.model.fieldsValue[1]).then(() => {
                        if (+this.model.fieldsQuantity > 2) {
                            service.setFieldValue(this.model.fieldsRefName[2], this.model.fieldsValue[2]).then(() => {
                                if (+this.model.fieldsQuantity > 3) {
                                    service.setFieldValue(this.model.fieldsRefName[3], this.model.fieldsValue[3]);
                                }
                            })
                        }
                    })
                });
            }
        );
    }
    public StoreListToStorage(controlName: string) {
        // in here you can create the lists..... if you dont want to use the excell uploader
        let doc: FieldsValuesList = {
            FieldsLists: new Array<Array<FieldValues>>()
        }
        let values1: Array<FieldValues> = new Array<FieldValues>();
        values1.push({ Depend: "", Value: "Hadad" });
        values1.push({ Depend: "", Value: "Sheler" });
        values1.push({ Depend: "", Value: "Amrani" });
        doc.FieldsLists.push(values1);
        let values2: Array<FieldValues> = new Array<FieldValues>();
        values2.push({ Depend: "Hadad", Value: "Avi" });
        values2.push({ Depend: "Hadad", Value: "Riki" });
        values2.push({ Depend: "Sheler", Value: "Dana" });
        values2.push({ Depend: "Sheler", Value: "Moshe" });
        values2.push({ Depend: "Amrani", Value: "Noam" });
        doc.FieldsLists.push(values2);
        let values3: Array<FieldValues> = new Array<FieldValues>();
        values3.push({ Depend: "HadadAvi", Value: "Pans" });
        values3.push({ Depend: "HadadRiki", Value: "Dress" });
        values3.push({ Depend: "ShelerDana", Value: "Shirt" });
        values3.push({ Depend: "ShelerMoshe", Value: "Pans" });
        values3.push({ Depend: "AmraniNoam", Value: "Pans" });
        values3.push({ Depend: "AmraniNoam", Value: "Shirt" });
        doc.FieldsLists.push(values3);
        let values4: Array<FieldValues> = new Array<FieldValues>();
        values4.push({ Depend: "HadadAviPans", Value: "Long" });
        values4.push({ Depend: "HadadRikiDress", Value: "Red" });
        values4.push({ Depend: "HadadRikiDress", Value: "Blue" });
        values4.push({ Depend: "ShelerDanaShirt", Value: "T-Shirt" });
        values4.push({ Depend: "ShelerMoshePans", Value: "Short" });
        values4.push({ Depend: "ShelerMoshePans", Value: "Bath" });
        values4.push({ Depend: "AmraniNoamPans", Value: "Short" });
        values4.push({ Depend: "AmraniNoamPans", Value: "Long" });
        values4.push({ Depend: "AmraniNoamShirt", Value: "T-Shirt" });
        values4.push({ Depend: "AmraniNoamShirt", Value: "Long" });
        doc.FieldsLists.push(values4);
        StoreValueList(controlName, doc);
    }
}