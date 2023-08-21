import { Component, createElement } from "react";
//import Select from "react-select";
import { MultipleSelect, SingleSelect } from "react-select-material-ui";
import { MultiSelect } from "react-multi-select-component";

import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

import { TextField } from "@material-ui/core";

import "./ui/ReactMaterialGrid.css";

import ReactMaterialGridComponent from "./components/ReactMaterialGridComponent";
import CircularProgress from "@material-ui/core/CircularProgress";

window["__react-beautiful-dnd-disable-dev-warnings"] = true;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250
        }
    }
};

export default class ReactMaterialGrid extends Component {
    constructor(props) {
        super(props);

        this.getHeaderJSONVal = this.getHeaderJSONVal.bind(this);
        this.getJSONVal = this.getJSONVal.bind(this);
        this.getTableTitle = this.getTableTitle.bind(this);
    }

    shouldComponentUpdate(nextProps) {
        console.log("shouldComponentUpdate");
        // $('.MuiToolbar-gutters button[title="Save"]').show();
        $('.MuiToolbar-gutters button[title="Save"]').css('pointer-events', 'all').css('opacity', '1');
        $('.MuiToolbar-gutters button[title="Save RuleBook"]').css('pointer-events', 'all').css('opacity', '1');
        if (nextProps.datasource !== this.props.datasource) {
            return true;
        } else {
            return false;
        }
    }

    getHeaderJSONVal() {
        var tableHeaderData = [];
        var lookup = [];
        var multiLookup = [];
        var selectedObjs = [];
        var disAttr = [];
        const datasource = this.props.datasource;
        debugger;
        if (datasource && datasource.status === "available" && datasource.items) {
            if (this.props.columns) {
                let i = 0;
                var groupByArr = this.props.Groupby_Tag.displayValue.replace(/[|]/g, ",").split(",");
                for (i = 0; i < this.props.columns.length; i++) {
                    if (
                        this.props.columns[i].header &&
                        this.props.columns[i].header.status === "available" &&
                        this.props.columns[i].showContentAs === "attribute"
                    ) {
                        tableHeaderData.push({
                            title: this.props.columns[i].header.value
                                ? this.props.columns[i].header.value
                                : this.props.columns[i].columnHeader,
                            field: this.props.columns[i].header.value
                                ? this.props.columns[i].header.value
                                : this.props.columns[i].columnHeader,
                            headerLabel: this.props.columns[i].columnHeader,
                            hidden: this.props.columns[i].canHide.value,
                            hiddenByColumnsButton:
                                this.props.columns[i].header.value === undefined ||
                                this.props.columns[i].canHide.value ||
                                this.props.columns[i].canHideAtColumnButton.value,
                            export: this.props.columns[i].canExport.value,
                            editable: this.props.columns[i].isEditable,
                            filtering: this.props.columns[i].header.value !== "Actions",
                            customHeader: true,
                            exceptionEnabled: this.props.columns[i].exceptionEnabled,
                            grouping: this.props.columns[i].grouping.value,
                            draggable: this.props.columns[i].draggable.value,
                            defaultGroupOrder:
                                groupByArr[0] !== "" && groupByArr[0] === "Default"
                                    ? this.props.columns[i].groupOrder
                                    : groupByArr.indexOf(this.props.columns[i].columnHeader.replace(/ /g, "")),
                            cellStyle: {
                                minWidth: this.props.columns[i].columnMinWidth,
                                maxWidth: this.props.columns[i].columnMaxWidth
                                    ? this.props.columns[i].columnMaxWidth
                                    : 200
                            },
                            headerStyle: {
                                minWidth: this.props.columns[i].columnMinWidth,
                                maxWidth: this.props.columns[i].columnMaxWidth
                                    ? this.props.columns[i].columnMaxWidth
                                    : 200
                            }
                        });
                    } else if (this.props.columns[i].showContentAs === "largeData") {
                        tableHeaderData.push({
                            title: this.props.columns[i].header.value
                                ? this.props.columns[i].header.value
                                : this.props.columns[i].columnHeader,
                            field: this.props.columns[i].header.value
                                ? this.props.columns[i].header.value
                                : this.props.columns[i].columnHeader,
                            headerLabel: this.props.columns[i].columnHeader,
                            showContentAs: this.props.columns[i].showContentAs,
                            type: "string",
                            editComponent: ({ value, onChange }) => (
                                <TextField onChange={e => onChange(e.target.value)} value={value} multiline />
                            ),
                            hidden: this.props.columns[i].canHide.value,
                            export: this.props.columns[i].canExport.value,
                            editable: this.props.columns[i].isEditable,
                            // export: !this.props.columns[i].canHide.value && this.props.columns[i].canExport.value,
                            filtering: this.props.columns[i].columnHeader !== "Actions",
                            customHeader: false,
                            exceptionEnabled: this.props.columns[i].exceptionEnabled,
                            hiddenByColumnsButton:
                                this.props.columns[i].header.value === undefined ||
                                this.props.columns[i].canHide.value ||
                                this.props.columns[i].canHideAtColumnButton.value,
                            grouping: this.props.columns[i].grouping.value,
                            draggable: this.props.columns[i].draggable.value,
                            defaultGroupOrder:
                                groupByArr[0] !== "" && groupByArr[0] === "Default"
                                    ? this.props.columns[i].groupOrder
                                    : groupByArr.indexOf(this.props.columns[i].columnHeader.replace(/ /g, "")),
                            cellStyle: {
                                textAlign: "justify",
                                minWidth: this.props.columns[i].columnMinWidth,
                                maxWidth: this.props.columns[i].columnMaxWidth
                                    ? this.props.columns[i].columnMaxWidth
                                    : 200
                            },
                            headerStyle: {
                                minWidth: this.props.columns[i].columnMinWidth,
                                maxWidth: this.props.columns[i].columnMaxWidth
                                    ? this.props.columns[i].columnMaxWidth
                                    : 200
                            }
                        });
                    } else if (this.props.columns[i].showContentAs === "dropDownContent") {
                        console.log("this.props.columns[i].selectableObjects", this.props.columns[i].selectableObjects);

                        selectedObjs["data" + i] = this.props.columns[i].selectableObjects.items;
                        disAttr["data" + i] = this.props.columns[i].displayAttribute;
                        lookup[this.props.columns[i].header.value] = new Array();
                        selectedObjs["data" + i] &&
                            selectedObjs["data" + i].map((k, j) =>
                                // lookup[this.props.columns[i].header.value].push({ value: `${disAttr["data" + i].get(selectedObjs["data" + i][j]).value}`, label: `${disAttr["data" + i].get(selectedObjs["data" + i][j]).value}` })
                                lookup[this.props.columns[i].header.value].push(
                                    disAttr["data" + i].get(selectedObjs["data" + i][j]).value
                                )
                            );
                        tableHeaderData.push({
                            title: this.props.columns[i].header.value
                                ? this.props.columns[i].header.value
                                : this.props.columns[i].columnHeader,
                            field: this.props.columns[i].header.value
                                ? this.props.columns[i].header.value
                                : this.props.columns[i].columnHeader,
                            headerLabel: this.props.columns[i].columnHeader,
                            showContentAs: this.props.columns[i].showContentAs,
                            type: "string",
                            // lookup: lookup,
                            editComponent: ({ value, onChange, columnDef }) => (
                                // $('.MuiToolbar-gutters button[title="Save"]').hide(),
                                $('.MuiToolbar-gutters button[title="Save"]').css('pointer-events', 'none').css('opacity', '0.4'),
                                $('.MuiToolbar-gutters button[title="Save RuleBook"]').css('pointer-events', 'none').css('opacity', '0.4'),
                                (
                                    <div className="customContentContainer">
                                        <SingleSelect
                                            value={value}
                                            options={lookup[columnDef.field]}
                                            placeholder="Select Option"
                                            onChange={selectedOption => onChange(selectedOption)}
                                        >
                                            {lookup[columnDef.field].map((item, index) => {
                                                item !== value && (
                                                    <option key={item} value={item}>
                                                        {item}
                                                    </option>
                                                );
                                            })}
                                        </SingleSelect>
                                        <label className="pure-material-checkbox">
                                            <input
                                                type="checkbox"
                                                name={columnDef.headerLabel}
                                                defaultValue={columnDef.title}
                                                className="material-input-checkbox"
                                            />
                                            <span>Apply to All</span>
                                            {/* <Button class="customButton">Apply to All</Button> */}
                                        </label>
                                    </div>
                                )
                            ),
                            hidden: this.props.columns[i].canHide.value,
                            export: this.props.columns[i].canExport.value,
                            editable: this.props.columns[i].isEditable,
                            // export: !this.props.columns[i].canHide.value && this.props.columns[i].canExport.value,
                            filtering: this.props.columns[i].columnHeader !== "Actions",
                            customHeader: false,
                            exceptionEnabled: this.props.columns[i].exceptionEnabled,
                            hiddenByColumnsButton:
                                this.props.columns[i].header.value === undefined ||
                                this.props.columns[i].canHide.value ||
                                this.props.columns[i].canHideAtColumnButton.value,
                            grouping: this.props.columns[i].grouping.value,
                            draggable: this.props.columns[i].draggable.value,
                            defaultGroupOrder:
                                groupByArr[0] !== "" && groupByArr[0] === "Default"
                                    ? this.props.columns[i].groupOrder
                                    : groupByArr.indexOf(this.props.columns[i].columnHeader.replace(/ /g, "")),
                            cellStyle: {
                                minWidth: this.props.columns[i].columnMinWidth,
                                maxWidth: this.props.columns[i].columnMaxWidth
                                    ? this.props.columns[i].columnMaxWidth
                                    : 200
                            },
                            headerStyle: {
                                minWidth: this.props.columns[i].columnMinWidth,
                                maxWidth: this.props.columns[i].columnMaxWidth
                                    ? this.props.columns[i].columnMaxWidth
                                    : 200
                            }
                        });
                    } else if (this.props.columns[i].showContentAs === "multiSelectContent") {
                        selectedObjs["data" + i] = this.props.columns[i].selectableObjects.items;
                        disAttr["data" + i] = this.props.columns[i].displayAttribute;
                        multiLookup[this.props.columns[i].header.value] = new Array();
                        selectedObjs["data" + i] &&
                            selectedObjs["data" + i].map((k, j) =>
                                multiLookup[this.props.columns[i].header.value].push(
                                    disAttr["data" + i].get(selectedObjs["data" + i][j]).value
                                )
                            );
                        tableHeaderData.push({
                            title: this.props.columns[i].header.value
                                ? this.props.columns[i].header.value
                                : this.props.columns[i].columnHeader,
                            field: this.props.columns[i].header.value
                                ? this.props.columns[i].header.value
                                : this.props.columns[i].columnHeader,
                            headerLabel: this.props.columns[i].columnHeader,
                            type: "string",
                            // lookup: this.lookup,
                            editComponent: ({ value, onChange, columnDef }) => (
                                // $('.MuiToolbar-gutters button[title="Save"]').hide(),
                                $('.MuiToolbar-gutters button[title="Save"]').css('pointer-events', 'none').css('opacity', '0.4'),
                                $('.MuiToolbar-gutters button[title="Save RuleBook"]').css('pointer-events', 'none').css('opacity', '0.4'),
                                (
                                    <div className="customContentContainer">
                                        {/* <MultipleSelect
                                        placeholder="Select Option(s)"
                                        values={value.split(", ")}
                                        options={multiLookup[columnDef.field]}
                                        onChange={selectedOption => {
                                            onChange(selectedOption.join(", "));
                                        }}
                                    >
                                        {multiLookup[columnDef.field].map(item => {
                                            item !== value && (
                                                <option key={item} value={item}>
                                                    {item}
                                                </option>
                                            );
                                        })}
                                    </MultipleSelect> */}
                                        <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
                                            <Select
                                                multiple
                                                displayEmpty
                                                // value={value.split(", ")}
                                                value={[...new Set(value.split(','))].map(item => item.trim())}
                                                onChange={selectedOption => {
                                                    onChange(selectedOption.target.value.join(", ").trim());
                                                }}
                                                input={<OutlinedInput />}
                                                renderValue={selected => {
                                                    var index = selected.indexOf("Unassigned");
                                                    if (index !== -1) {
                                                        selected.splice(index, 1);
                                                    }

                                                    var indexEmpty = selected.indexOf("");
                                                    if (indexEmpty !== -1) {
                                                        selected.splice(indexEmpty, 1);
                                                    }

                                                    // selected = selected.filter(v => v !== "");

                                                    if (selected.length === 0) {
                                                        return <em>Select</em>;
                                                    }

                                                    // $('.MuiToolbar-gutters button[title="Save"]').show();

                                                    return selected.join(", ");
                                                }}
                                                MenuProps={MenuProps}
                                                inputProps={{ "aria-label": "Without label" }}
                                            >
                                                <MenuItem disabled value="">
                                                    <em>Select</em>
                                                </MenuItem>
                                                {multiLookup[columnDef.field].map(name => (
                                                    <MenuItem key={name} value={name}>
                                                        <Checkbox checked={value.indexOf(name) > -1} />
                                                        <ListItemText primary={name} />
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <label className="pure-material-checkbox">
                                            <input
                                                type="checkbox"
                                                name={columnDef.headerLabel}
                                                defaultValue={columnDef.title}
                                                className="material-input-checkbox"
                                            />
                                            <span>Apply to All</span>
                                            {/* <Button class="customButton">Apply to All</Button> */}
                                        </label>
                                    </div>
                                )
                            ),
                            hidden: this.props.columns[i].canHide.value,
                            export: this.props.columns[i].canExport.value,
                            editable: this.props.columns[i].isEditable,
                            // export: !this.props.columns[i].canHide.value && this.props.columns[i].canExport.value,
                            filtering: this.props.columns[i].columnHeader !== "Actions",
                            customHeader: false,
                            exceptionEnabled: this.props.columns[i].exceptionEnabled,
                            hiddenByColumnsButton:
                                this.props.columns[i].header.value === undefined ||
                                this.props.columns[i].canHide.value ||
                                this.props.columns[i].canHideAtColumnButton.value,
                            grouping: this.props.columns[i].grouping.value,
                            draggable: this.props.columns[i].draggable.value,
                            defaultGroupOrder:
                                groupByArr[0] !== "" && groupByArr[0] === "Default"
                                    ? this.props.columns[i].groupOrder
                                    : groupByArr.indexOf(this.props.columns[i].columnHeader.replace(/ /g, "")),
                            cellStyle: {
                                minWidth: this.props.columns[i].columnMinWidth,
                                maxWidth: this.props.columns[i].columnMaxWidth
                                    ? this.props.columns[i].columnMaxWidth
                                    : 200
                            },
                            headerStyle: {
                                minWidth: this.props.columns[i].columnMinWidth,
                                maxWidth: this.props.columns[i].columnMaxWidth
                                    ? this.props.columns[i].columnMaxWidth
                                    : 200
                            }
                        });
                    } else if (this.props.columns[i].showContentAs === "boolean") {
                        tableHeaderData.push({
                            title: this.props.columns[i].header.value
                                ? this.props.columns[i].header.value
                                : this.props.columns[i].columnHeader,
                            field: this.props.columns[i].header.value
                                ? this.props.columns[i].header.value
                                : this.props.columns[i].columnHeader,
                            headerLabel: this.props.columns[i].columnHeader,
                            type: "boolean",
                            // lookup: this.lookup,
                            editComponent: props => (
                                <input
                                    type="checkbox"
                                    checked={props.value}
                                    onChange={e => props.onChange(e.target.checked)}
                                />
                            ),
                            render: rowdata => (
                                // rowdata.booleanValue === true ? "Yes" : "No"
                                <input
                                    type="checkbox"
                                    checked={!(rowdata.Applicability === "" || rowdata.Applicability === false)}
                                    readOnly
                                />
                            ),
                            //   render: rowData => (rowData[this.field] ? "True" : "False"),
                            hidden: this.props.columns[i].canHide.value,
                            export: this.props.columns[i].canExport.value,
                            editable: this.props.columns[i].isEditable,
                            // export: !this.props.columns[i].canHide.value && this.props.columns[i].canExport.value,
                            filtering: this.props.columns[i].columnHeader !== "Actions",
                            customHeader: false,
                            exceptionEnabled: this.props.columns[i].exceptionEnabled,
                            hiddenByColumnsButton:
                                this.props.columns[i].header.value === undefined ||
                                this.props.columns[i].canHide.value ||
                                this.props.columns[i].canHideAtColumnButton.value,
                            grouping: this.props.columns[i].grouping.value,
                            draggable: this.props.columns[i].draggable.value,
                            defaultGroupOrder:
                                groupByArr[0] !== "" && groupByArr[0] === "Default"
                                    ? this.props.columns[i].groupOrder
                                    : groupByArr.indexOf(this.props.columns[i].columnHeader.replace(/ /g, "")),
                            cellStyle: {
                                minWidth: this.props.columns[i].columnMinWidth,
                                maxWidth: this.props.columns[i].columnMaxWidth
                                    ? this.props.columns[i].columnMaxWidth
                                    : 200
                            },
                            headerStyle: {
                                minWidth: this.props.columns[i].columnMinWidth,
                                maxWidth: this.props.columns[i].columnMaxWidth
                                    ? this.props.columns[i].columnMaxWidth
                                    : 200
                            }
                        });
                    } else if (this.props.columns[i].showContentAs === "applyAllRows") {
                        var columnVals = this.props.columns
                            .filter(item =>
                                (item.header.value !== "" || item.header.value !== undefined) &&
                                item.canHide.value !== true &&
                                item.isEditable !== "never"
                                    ? item.header.value
                                    : ""
                            )
                            .map(itemVal => ({ value: `${itemVal.columnHeader}`, label: `${itemVal.header.value}` }));
                        // columnVals.unshift({ value: "Type", label: "Type" }, { value: "Matter", label: "Matter" });
                        // var columnVals = this.props.columns.filter(item => (item.columnHeader !== "" || item.columnHeader !== undefined) ? item.columnHeader : "").map(itemVal => ({ value: `${itemVal.columnHeader}`, label: `${itemVal.columnHeader}` }));
                        tableHeaderData.push({
                            title: this.props.columns[i].header.value
                                ? this.props.columns[i].header.value
                                : this.props.columns[i].columnHeader,
                            field: this.props.columns[i].header.value
                                ? this.props.columns[i].header.value
                                : this.props.columns[i].columnHeader,
                            headerLabel: this.props.columns[i].columnHeader,
                            hidden: this.props.columns[i].canHide.value,
                            hiddenByColumnsButton:
                                this.props.columns[i].header.value === undefined ||
                                this.props.columns[i].canHide.value ||
                                this.props.columns[i].canHideAtColumnButton.value,
                            export: this.props.columns[i].canExport.value,
                            editable: this.props.columns[i].isEditable,
                            editComponent: ({ value, onChange }) => (
                                <Select
                                    options={columnVals}
                                    name="applyToAll"
                                    placeholder="Select Option"
                                    style={{ width: "250px" }}
                                    onChange={selectedOption =>
                                        onChange(
                                            selectedOption
                                                .map(x => x.value)
                                                .join(",")
                                                .toString()
                                        )
                                    }
                                    value={value ? value.value : value}
                                    isMulti
                                    isClearable
                                />
                            ),
                            filtering: this.props.columns[i].header.value !== "Actions",
                            customHeader: true,
                            exceptionEnabled: this.props.columns[i].exceptionEnabled,
                            grouping: this.props.columns[i].grouping.value,
                            draggable: this.props.columns[i].draggable.value,
                            defaultGroupOrder:
                                groupByArr[0] !== "" && groupByArr[0] === "Default"
                                    ? this.props.columns[i].groupOrder
                                    : groupByArr.indexOf(this.props.columns[i].columnHeader.replace(/ /g, "")),
                            cellStyle: {
                                minWidth: this.props.columns[i].columnMinWidth,
                                maxWidth: this.props.columns[i].columnMaxWidth
                                    ? this.props.columns[i].columnMaxWidth
                                    : 200
                            },
                            headerStyle: {
                                minWidth: this.props.columns[i].columnMinWidth,
                                maxWidth: this.props.columns[i].columnMaxWidth
                                    ? this.props.columns[i].columnMaxWidth
                                    : 200
                            }
                        });
                    } else {
                        tableHeaderData.push({
                            title: this.props.columns[i].header.value
                                ? this.props.columns[i].header.value
                                : this.props.columns[i].columnHeader,
                            field: this.props.columns[i].header.value
                                ? this.props.columns[i].header.value
                                : this.props.columns[i].columnHeader,
                            headerLabel: this.props.columns[i].columnHeader,
                            hidden: this.props.columns[i].canHide.value,
                            hiddenByColumnsButton:
                                this.props.columns[i].header.value === undefined ||
                                this.props.columns[i].canHide.value ||
                                this.props.columns[i].canHideAtColumnButton.value,
                            export: this.props.columns[i].canExport.value,
                            editable: this.props.columns[i].isEditable,
                            filtering: this.props.columns[i].header.value !== "Actions",
                            customHeader: true,
                            exceptionEnabled: this.props.columns[i].exceptionEnabled,
                            grouping: this.props.columns[i].grouping.value,
                            draggable: this.props.columns[i].draggable.value,
                            defaultGroupOrder:
                                groupByArr[0] !== "" && groupByArr[0] === "Default"
                                    ? this.props.columns[i].groupOrder
                                    : groupByArr.indexOf(this.props.columns[i].columnHeader.replace(/ /g, "")),
                            cellStyle: {
                                minWidth: this.props.columns[i].columnMinWidth,
                                maxWidth: this.props.columns[i].columnMaxWidth
                                    ? this.props.columns[i].columnMaxWidth
                                    : 200
                            },
                            headerStyle: {
                                minWidth: this.props.columns[i].columnMinWidth,
                                maxWidth: this.props.columns[i].columnMaxWidth
                                    ? this.props.columns[i].columnMaxWidth
                                    : 200
                            }
                        });
                    }
                }
            }
        }
        return tableHeaderData;
    }

    getJSONVal() {
        var tableData = [];
        const datasource = this.props.datasource;
        if (datasource.status === "available" && datasource.items) {
            const NUM_COLUMNS = this.props.columns.length;
            var columnData = {};
            for (var i = 0; i < this.props.datasource.items.length; i++) {
                for (var j = 0; j < NUM_COLUMNS; j++) {
                    if (this.props.columns[j].header && this.props.columns[j].header.status === "available") {
                        if (
                            this.props.columns[j].header.value
                                ? this.props.columns[j].header.value
                                : this.props.columns[j].columnHeader !== "RuleAutoID"
                        ) {
                            columnData[
                                this.props.columns[j].header.value
                                    ? this.props.columns[j].header.value
                                    : this.props.columns[j].columnHeader
                            ] =
                                this.props.columns[j].attribute &&
                                this.props.columns[j].attribute.get(this.props.datasource.items[i]).status ===
                                    "available"
                                    ? this.props.columns[j].attribute.get(this.props.datasource.items[i]).value
                                    : "";
                        } else {
                            columnData[
                                this.props.columns[j].header.value
                                    ? this.props.columns[j].header.value
                                    : this.props.columns[j].columnHeader
                            ] =
                                this.props.columns[j].attribute &&
                                this.props.columns[j].attribute.get(this.props.datasource.items[i]).status ===
                                    "available"
                                    ? JSON.parse(
                                          this.props.columns[j].attribute.get(this.props.datasource.items[i])
                                              .displayValue
                                      )
                                    : "";
                        }
                    }
                }
                tableData.push(columnData);
                columnData = {};
            }
        }
        return tableData;
    }

    getTableTitle() {
        var title;
        if (this.props.tableTitle.status === "available") {
            title = this.props.tableTitle.value;
        }
        return title;
    }

    render() {
        const inputHeaderDataToRender = this.getHeaderJSONVal();
        const inputDataToRender = this.getJSONVal();
        const tableTitle = this.getTableTitle();
        const actionProps = this.props.actions && this.props.actions.map(item => item.actionName);
        return (
            <div>
                {/* { this.loading ?? <CircularProgress />} */}
                <ReactMaterialGridComponent
                    columnData={inputHeaderDataToRender}
                    rowData={inputDataToRender}
                    tableTitle={tableTitle}
                    actions={this.props.actions}
                    actionColumnIndex={this.props.actionColumnIndex}
                    actionProps={actionProps}
                    gridSource={this.props.gridSource}
                    canFilter={this.props.canFilter}
                    canSearch={this.props.canSearch}
                    canDraggable={this.props.canDraggable}
                    canSortable={this.props.canSortable}
                    canGroupable={this.props.canGroupable}
                    isPaging={this.props.isPaging}
                    isSelectAllCheckbox={this.props.isSelectAllCheckbox}
                    isSelection={this.props.isSelection}
                    editableTable={this.props.editableTable}
                    isPageSize={this.props.isPageSize}
                    paginationPosition={this.props.paginationPosition}
                    topbarColumnsButton={this.props.topbarColumnsButton}
                    topbarExportActions={this.props.topbarExportActions}
                    topbarObligationAction={this.props.topbarObligationAction}
                    onRowUpdateAction={this.props.onRowUpdateAction}
                    onRowDeleteAction={this.props.onDeleteAction}
                    Groupby_Tag={this.props.Groupby_Tag}
                    TagLevel={this.props.TagLevel}
                    Table_Ref={this.props.Table_Ref}
                    RowID={this.props.RowID}
                    RowData={this.props.RowData}
                    RowDataApplyToAll={this.props.RowDataApplyToAll}
                />
            </div>
        );
    }
}
