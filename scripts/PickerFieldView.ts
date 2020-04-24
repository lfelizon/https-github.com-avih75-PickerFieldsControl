import * as WitService from "TFS/WorkItemTracking/Services";
import { Model } from "./PickerFieldModel";
import { FieldValues, DocRow } from "./StorageHelper";



export class View {
    private pickerFieldModel: Model;
    private values1: Array<FieldValues>;
    private values2: Array<FieldValues>;
    private values3: Array<FieldValues>;
    private values4: Array<FieldValues>;
    constructor(private doc: DocRow, private model: Model, private onInputChanged: Function) {//, private onUpTick: Function, private onDownTick: Function) {
        this.pickerFieldModel = model;
        this.values1 = new Array<FieldValues>();
        this.values2 = new Array<FieldValues>();
        this.values3 = new Array<FieldValues>();
        this.values4 = new Array<FieldValues>();
        this.GetValuse(doc);
        this.CreateView();
    }
    private CreateView() {
        $(".container").remove();
        var container = $("<div />");
        container.addClass("container");
        container.append(this.AddSelectField(this.pickerFieldModel.fieldName1, this.pickerFieldModel.fieldValue1, 1, this.values1));
        container.append(this.AddSelectField(this.pickerFieldModel.fieldName2, this.pickerFieldModel.fieldValue2, 2));
        container.append(this.AddSelectField(this.pickerFieldModel.fieldName3, this.pickerFieldModel.fieldValue3, 3));
        container.append(this.AddSelectField(this.pickerFieldModel.fieldName3, this.pickerFieldModel.fieldValue3, 4));
        $("body").append(container);
    }
    private AddSelectField(fieldName: string, fieldValue: string, fieldNumber: number, values: Array<FieldValues> = undefined) {
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
        return newSelect;
    }
    private GetValuse(doc: DocRow) {
        this.values1=doc.values1;
        this.values2=doc.values2;
        this.values3=doc.values3;
        this.values4=doc.values4;
        // this.values1.push({ Depend: "", Value: "Hadad" })
        // this.values1.push({ Depend: "", Value: "Sheler" })
        // this.values2.push({ Depend: "Hadad", Value: "Avi" })
        // this.values2.push({ Depend: "Hadad", Value: "Riki" })
        // this.values2.push({ Depend: "Sheler", Value: "Moshe" })
        // this.values2.push({ Depend: "Sheler", Value: "Dana" })
        // this.values3.push({ Depend: "HadadAvi", Value: "Pans" })
        // this.values3.push({ Depend: "HadadRiki", Value: "Dress" })
        // this.values3.push({ Depend: "ShelrDana", Value: "Shirt" })
        // this.values3.push({ Depend: "ShelrMoshe", Value: "Pans" })
        // this.values4.push({ Depend: "ShelrMoshePans", Value: "Long" })
        // this.values4.push({ Depend: "HadadAviPans", Value: "Short" })
        // this.values4.push({ Depend: "ShelrDanaShirt", Value: "T" })
        // this.values4.push({ Depend: "HadadRikiDress", Value: "Red" })
        // this.values4.push({ Depend: "HadadRikiDress", Value: "Blue" })
    }
    private OnSelectChange(fieldNumber: number, eventObject: JQueryEventObject) {
        for (let i = fieldNumber + 1; i < 5; i++) {
            let select = $("#" + i)
            select.attr("disabled", "true");
            select.find('option').remove().end();
            select.val('');
        }
        if (fieldNumber < 4) {
            let values: Array<FieldValues>;
            let select: string = $("#" + fieldNumber).children("option:selected").val();
            let nextSelect = $("#" + (fieldNumber + 1))
            nextSelect.find('option').remove().end();
            switch (fieldNumber) {
                case 1: {
                    values = this.values2;
                    break;
                }
                case 2: {
                    values = this.values3;
                    break;
                }
                case 3: {
                    values = this.values4;
                    break;
                }
            }
            values.forEach(value => {
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
}