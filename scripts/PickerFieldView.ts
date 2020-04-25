import * as WitService from "TFS/WorkItemTracking/Services";
import { Model } from "./PickerFieldModel";
import { FieldValues, DocRow, FieldsValuesList, StoreValue, StoreValueList } from "./StorageHelper";



export class View {
    private pickerFieldModel: Model;
    constructor(private model: Model, private onInputChanged: Function) {
        this.CreateView();
    }
    private CreateView() {
        $(".container").remove();
        var container = $("<div />");
        container.addClass("container");
        for (let index = 0; index < this.model.fieldValuesList.FieldsLists.length; index++) {
            container.append(this.AddSelectField(this.pickerFieldModel.fieldsName[index], this.pickerFieldModel.fieldsValue[index], index + 1, this.model.fieldValuesList.FieldsLists[index]));
        }
        // container.append(this.AddSelectField(this.pickerFieldModel.fieldName1, this.pickerFieldModel.fieldValue1, 1, this.values1));
        // container.append(this.AddSelectField(this.pickerFieldModel.fieldName2, this.pickerFieldModel.fieldValue2, 2)); 
        $("body").append(container);
    }
    private AddSelectField(fieldName: string, fieldValue: string, fieldNumber: number, values: Array<FieldValues> = undefined) {
        let div = $("<div />");
        let newSelect = $("<select />");
        newSelect.addClass("selectField");
        newSelect.attr("id", fieldNumber)
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
        div.append(newSelect);
        return div;
    }
    private OnSelectChange(fieldNumber: number, eventObject: JQueryEventObject) {
        for (let i = fieldNumber + 1; i < 5; i++) {
            let select = $("#" + i)
            select.attr("disabled", "true");
            select.find('option').remove().end();
            select.val('');
        }
        if (fieldNumber < 4) {
            let select: string = $("#" + fieldNumber).children("option:selected").val();
            let nextSelect = $("#" + (fieldNumber + 1))
            nextSelect.find('option').remove().end();
            this.model.fieldValuesList[fieldNumber + 1].forEach(value => {
                if (value.Depend == select) {
                    nextSelect.append(new Option(value.Value));
                }
            });
            nextSelect.val('');
            nextSelect.removeAttr("disabled");
        }
    }
    // private inputChanged(field: string, evnt: JQueryKeyEventObject) {
    //     let newValue = $(evnt.target).val();
    //     this.onInputChanged(newValue, field);

    // }
    // public Update(value: string, fieldName: string) {
    //     this.valuesList[fieldName] = String(value);
    //     $("." + fieldName).val(this.valuesList[fieldName]);
    // }
    public StoreListToStorage(controlName: string) {
        // Demo list
        let doc: FieldsValuesList = {
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
}