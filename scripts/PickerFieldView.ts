import { WorkItemFormService } from "TFS/WorkItemTracking/Services";
import { Model } from "./PickerFieldModel";
import { FieldValues, FieldsValuesList, StoreValueList } from "./StorageHelper";
export class View {
    private pickerFieldModel: Model;
    constructor(private model: Model) {
        this.pickerFieldModel = model;
        this.CreateView(+model.viewOption);
        WorkItemFormService.getService().then(
            (service) => {
                if (model.summarizeToPathRefName != undefined && model.summarizeToPathRefName != "")
                    service.setFieldValue(model.summarizeToPathRefName, model.summarizeToPath);
            });
    }
    private CreateView(viewOption: number) {
        $(".container").remove();
        let container = $("<div />");
        let index = 0
        for (; index < this.model.fieldValuesList.FieldsLists.length; index++) {
            let $divSelect: JQuery;
            if (this.model.fieldsValue[0] == "") {
                $divSelect = this.AddSelectField(this.pickerFieldModel.fieldsName[index], this.pickerFieldModel.fieldsValue[index], index + 1, this.model.fieldValuesList.FieldsLists[index]);
            }
            else {
                $divSelect = this.AddSelectFieldWithValues(this.pickerFieldModel.fieldsName[index], this.pickerFieldModel.fieldsValue[index], index + 1, this.model.fieldValuesList.FieldsLists[index]);
            }
            $divSelect.css("width", (90 / viewOption).toString() + "%");
            $divSelect.addClass("selectedDiv");
            container.append($divSelect);
        }
        $("body").append(container);
        if (this.pickerFieldModel.privateBehaviure == "Auto")
            this.CheckIfOnlyOne(index);
        VSS.resize();
    }
    private AddSelectFieldWithValues(fieldName: string, fieldValue: string, fieldNumber: number, values: Array<FieldValues>) {
        let div = $("<div />");
        let label = $("<textBox />");
        label.text(fieldName);
        label.addClass("label")
        let newSelect = $("<select />");
        newSelect.addClass("selectField");
        newSelect.attr("id", fieldNumber);
        newSelect.change((eventObject: JQueryEventObject) => this.OnSelectChange(fieldNumber, eventObject));
        if (fieldNumber == 1) {
            values.forEach(value => {
                newSelect.append(new Option(value.Value));
            });
        }
        else if (fieldNumber == 2) {
            values.forEach(value => {
                if (value.Depend == this.model.fieldsValue[0]) {
                    newSelect.append(new Option(value.Value));
                }
            });
        }
        else if (fieldNumber == 3) {
            values.forEach(value => {
                if (value.Depend == this.model.fieldsValue[0] + this.model.fieldsValue[1]) {
                    newSelect.append(new Option(value.Value));
                }
            });
        }
        else {
            values.forEach(value => {
                if (value.Depend == this.model.fieldsValue[0] + this.model.fieldsValue[1] + this.model.fieldsValue[2]) {
                    newSelect.append(new Option(value.Value));
                }
            });
        }
        newSelect.val(fieldValue);
        div.append(label);
        div.append(newSelect);
        div.addClass("divSelect")
        return div;
    }
    private CheckIfOnlyOne(index: number) {
        for (let i = 0; i < index; i++) {
            let checkSelect = $("#" + (i + 1));
            if ($("#" + (i + 1) + " option:selected").text() == "") {
                let counter = checkSelect.find('option').length; 
                if (counter == 1) {
                    checkSelect.val($("#" + (i + 1) + " option:first").val());
                    this.OnSelectChange(i+1);
                }
            }
        }
    }
    private AddSelectField(fieldName: string, fieldValue: string, fieldNumber: number, values: Array<FieldValues>) {
        let div = $("<div />");
        let newSelect = $("<select />");
        let label = $("<label />");
        label.text(fieldName);
        label.addClass("label")
        newSelect.addClass("selectField");
        newSelect.attr("id", fieldNumber);
        newSelect.change((eventObject: JQueryEventObject) => this.OnSelectChange(fieldNumber, eventObject))
        if (fieldNumber == 1) {
            values.forEach(value => {
                newSelect.append(new Option(value.Value));
            });
            newSelect.val('');  // looks for delete
        }
        else {
            newSelect.attr("disabled", "true");
            div.attr("disabled", "disabled"); // !
        }
        newSelect.val(fieldValue);
        div.append(label);
        div.append(newSelect);
        return div;
    }
    private OnSelectChange(fieldNumber: number, eventObject: JQueryEventObject = undefined) {
        for (let i = fieldNumber + 1; i < 5; i++) {
            // reset the view of the select elemnts
            let select = $("#" + i)
            select.attr("disabled", "true");
            select.parent().attr("disabled", "disabled");
            select.find('option').remove().end();
            select.val('');
            this.model.fieldsValue[fieldNumber] = "";
        }
        let select: string = $("#" + fieldNumber).children("option:selected").val();
        this.model.fieldsValue[fieldNumber - 1] = select;
        this.updateWorkItem();
        let prevSelects: string = "";
        let nextSelect = $("#" + (fieldNumber + 1))
        if (fieldNumber == 1) {
            prevSelects = this.model.fieldsValue[0];
        }
        else if (fieldNumber == 2 && (+this.model.fieldsQuantity) > 2) {
            prevSelects = this.model.fieldsValue[0] + this.model.fieldsValue[1];
        }
        else if (fieldNumber == 3 && (+this.model.fieldsQuantity) > 3) {
            prevSelects = this.model.fieldsValue[0] + this.model.fieldsValue[1] + this.model.fieldsValue[2];
        }
        else {
            return;
        }
        let test: Array<string> = new Array<string>();
        this.model.fieldValuesList.FieldsLists[fieldNumber].forEach(value => {
            if (value.Depend == prevSelects) {
                test.push(value.Value);
            }
        });
        test.sort();
        test.forEach(element => {
            nextSelect.append(new Option(element));
        });
        if (test.length == 1 && this.pickerFieldModel.privateBehaviure == "Auto") {
            nextSelect.val(test[0].toString());
            nextSelect.change();
        }
        else
            nextSelect.val('');
        nextSelect.removeAttr("disabled");
        nextSelect.parent().removeAttr("disabled");
    }
    private updateWorkItem() {
        let pathValue: string = this.model.fieldsValue[0] + '\\' + this.model.fieldsValue[1];
        WorkItemFormService.getService().then(
            (service) => {
                service.setFieldValue(this.model.fieldsRefName[0], this.model.fieldsValue[0]).then(() => {
                    service.setFieldValue(this.model.fieldsRefName[1], this.model.fieldsValue[1]).then(() => {
                        if (+this.model.fieldsQuantity > 2) {
                            if (this.model.fieldsValue[2] != "")
                                pathValue += '\\' + this.model.fieldsValue[2];
                            service.setFieldValue(this.model.fieldsRefName[2], this.model.fieldsValue[2]).then(() => {
                                if (+this.model.fieldsQuantity > 3) {
                                    if (this.model.fieldsValue[3] != "")
                                        pathValue += '\\' + this.model.fieldsValue[3];
                                    service.setFieldValue(this.model.fieldsRefName[3], this.model.fieldsValue[3]);
                                    if (this.model.summarizeToPathRefName != undefined && this.model.summarizeToPathRefName != "")
                                        service.setFieldValue(this.model.summarizeToPathRefName, pathValue);
                                }
                                if (this.model.summarizeToPathRefName != undefined && this.model.summarizeToPathRefName != "")
                                    service.setFieldValue(this.model.summarizeToPathRefName, pathValue);
                            })
                        }
                        if (this.model.summarizeToPathRefName != undefined && this.model.summarizeToPathRefName != "")
                            service.setFieldValue(this.model.summarizeToPathRefName, pathValue);
                    })
                });
            }
        );
    }
    public StoreListToStorage(controlName: string) {
        // in here you can create the lists..... if you dont want to use the excell input
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
        // return RetriveValue(controlName);
        // RetriveValue(controlName).then((doc2) => {
        //     let x = doc2
        // });
    }
}