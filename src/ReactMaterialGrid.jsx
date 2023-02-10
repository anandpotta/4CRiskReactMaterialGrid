/* eslint-disable prettier/prettier */
import React, { Component, createElement } from "react";
import { Menu, MenuItem } from "@material-ui/core";

import "./ui/ReactMaterialGrid.css";

import ReactMaterialGridComponent from './components/ReactMaterialGridComponent';
import CircularProgress from "@material-ui/core/CircularProgress";

export default class ReactMaterialGrid extends Component {
    constructor(props) {
        super(props);

        this.getHeaderJSONVal = this.getHeaderJSONVal.bind(this);
        this.getJSONVal = this.getJSONVal.bind(this);
        this.getTableTitle = this.getTableTitle.bind(this);
        this.onClickGenerateObligation = this.onClickGenerateObligation.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
    }


    shouldComponentUpdate(nextProps) {
        return nextProps.datasource !== this.props.datasource;
    }

    getHeaderJSONVal() {
        var tableHeaderData = [];
        const datasource = this.props.datasource;
        if (datasource.status === "available" && datasource.items) {
            if (this.props.columns) {
                let i = 0;
                var groupByArr = this.props.Groupby_Tag.displayValue.replace(/[|]/g, ',').split(',');
                for (i = 0; i < this.props.columns.length; i++) {
                        // debugger;
                        if (this.props.columns[i].header && this.props.columns[i].header.status === "available" && this.props.columns[i].header.value !== "") {
                            tableHeaderData.push(
                                {
                                    title: this.props.columns[i].header.value,
                                    // field: this.props.columns[i].header.value.replace(/ /g, ""),
                                    field: this.props.columns[i].header.value && this.props.columns[i].header.value.replace(/ /g, ""),
                                    hidden: this.props.columns[i].canHide.value,
                                    hiddenByColumnsButton: this.props.columns[i].header.value === undefined || this.props.columns[i].canHide.value || this.props.columns[i].canHideAtColumnButton.value,
                                    export: this.props.columns[i].canExport.value,
                                    // export: !this.props.columns[i].canHide.value && this.props.columns[i].canExport.value,
                                    filtering: (this.props.columns[i].header.value !== "Actions"),
                                    customHeader: true,
                                    grouping: this.props.columns[i].grouping.value,
                                    draggable: this.props.columns[i].draggable.value,
                                    defaultGroupOrder: (groupByArr[0] !== '' && groupByArr[0] === 'Default') ? this.props.columns[i].groupOrder : groupByArr.indexOf(this.props.columns[i].columnHeader.replace(/ /g, "")),
                                    cellStyle: {
                                        minWidth: this.props.columns[i].columnMinWidth,
                                        maxWidth: this.props.columns[i].columnMaxWidth ? this.props.columns[i].columnMaxWidth : 200
                                    },
                                    headerStyle: {
                                        minWidth: this.props.columns[i].columnMinWidth,
                                        maxWidth: this.props.columns[i].columnMaxWidth ? this.props.columns[i].columnMaxWidth : 200
                                    }
                                }
                            )
                        } else {
                            tableHeaderData.push(
                                {
                                    title: this.props.columns[i].columnHeader,
                                    field: this.props.columns[i].columnHeader.replace(/ /g, ""),
                                    hidden: this.props.columns[i].canHide.value,
                                    export: this.props.columns[i].canExport.value,
                                    // export: !this.props.columns[i].canHide.value && this.props.columns[i].canExport.value,
                                    filtering: (this.props.columns[i].columnHeader !== "Actions"),
                                    customHeader: false,
                                    hiddenByColumnsButton: this.props.columns[i].header.value === undefined || this.props.columns[i].canHide.value || this.props.columns[i].canHideAtColumnButton.value,
                                    grouping: this.props.columns[i].grouping.value,
                                    draggable: this.props.columns[i].draggable.value,
                                    defaultGroupOrder: (groupByArr[0] !== '' && groupByArr[0] === 'Default') ? this.props.columns[i].groupOrder : groupByArr.indexOf(this.props.columns[i].columnHeader.replace(/ /g, "")),
                                    cellStyle: {
                                        minWidth: this.props.columns[i].columnMinWidth,
                                        maxWidth: this.props.columns[i].columnMaxWidth ? this.props.columns[i].columnMaxWidth : 200
                                    },
                                    headerStyle: {
                                        minWidth: this.props.columns[i].columnMinWidth,
                                        maxWidth: this.props.columns[i].columnMaxWidth ? this.props.columns[i].columnMaxWidth : 200
                                    }
                                   
                                }
                            )
                        }
                }
            }
        }
        return tableHeaderData;
    }


    getJSONVal() {
        // debugger;

        var tableData = [];
        const datasource = this.props.datasource;
            if (datasource.status === "available" && datasource.items) {

                const NUM_COLUMNS = this.props.columns.length;
                var columnData = {};
                for (var i = 0; i < this.props.datasource.items.length; i++) {
                    for (var j = 0; j < NUM_COLUMNS; j++) {
                        if (this.props.columns[j].showContentAs === "attribute") {
                            if (this.props.columns[j].header && this.props.columns[j].header.status === "available" && this.props.columns[j].header.value !== "") {
                                columnData[this.props.columns[j].header.value && this.props.columns[j].header.value.replace(/ /g, "")] =
                                this.props.columns[j].attribute && this.props.columns[j].attribute.get(this.props.datasource.items[i]).value
                                ? this.props.columns[j].attribute.get(this.props.datasource.items[i]).value : "";
                            } else {
                                columnData[this.props.columns[j].columnHeader.replace(/ /g, "")] =
                                this.props.columns[j].attribute && this.props.columns[j].attribute.get(this.props.datasource.items[i]).value
                                ? this.props.columns[j].attribute.get(this.props.datasource.items[i]).value : "";
                            }

                        } else if (this.props.columns[j].showContentAs === "customContent") {
                            // console.log('actions', this.props.columns[j].content.get(this.props.datasource.items[i]));
                            columnData[this.props.columns[j].columnHeader.replace(/ /g, "")] = this.props.columns[j].content ? this.props.columns[j].content.get(this.props.datasource.items[i]) : ""
                        }

                    }
                    // console.log(columnData);
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

    onRowClick(event, rowData) {
        if (this.props.onRowClickAction) {
            this.props.onRowClickAction.execute();
        }
    }

    onClickGenerateObligation(tableRef) {

        if (this.props.onClickGenerateObligationAction) {
            debugger;

            if (tableRef.dataManager.grouped == true) {

                let groupCount = 0;
                const groupedItems = [];
                for (let i = 0; i < tableRef.dataManager.columns.length; i++) {
                    if (tableRef.dataManager.columns[i].tableData.groupOrder !== undefined && tableRef.dataManager.columns[i].tableData.groupOrder !== -1) {
                        groupCount++
                        groupedItems.push(tableRef.dataManager.columns[i].field);
                        // groupedItems.push(tableRef.dataManager.columns[i].title.replace(/ /g, ""));
                    }
                }
                if (groupedItems.length == 1) {
                    this.props.Groupby_Tag.setValue(groupedItems[0]);
                } else {
                    this.props.Groupby_Tag.setValue(groupedItems.join('|'));
                }
                this.props.TagLevel.setValue(JSON.stringify(groupCount));
            } else {
                var arr = [];
                var refData = tableRef.dataManager.groupedData
                for (let x = 0; x < refData.length; x++) {
                    arr.groupby_level = 0;
                    arr.push({
                        "multi_text_obj": [
                            {
                                "text": refData[x].data[0].rule,
                                "merged_text_v2": refData[x].data[0].Merged_Text_V2,
                                "DataSource": refData[x].data[0].RuleSource,
                                "rule_uid": refData[x].data[0].RuleUID,
                                "rule_tag": refData[x].value
                            }
                        ]
                    })
                }
                this.props.Groupby_Tag.setValue('');
                this.props.TagLevel.setValue('0');
            }

            this.props.onClickGenerateObligationAction.execute();
            return arr;
        }


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
                    onClickGenerateObligation={this.onClickGenerateObligation}
                    onRowClick = {this.onRowClick}

                    columnData={inputHeaderDataToRender}
                    rowData={inputDataToRender}
                    tableTitle={tableTitle}
                    gridSource={this.props.gridSource}
                    canFilter={this.props.canFilter}
                    canSearch={this.props.canSearch}
                    canDraggable={this.props.canDraggable}
                    canSortable={this.props.canSortable}
                    canGroupable={this.props.canGroupable}
                    isPaging={this.props.isPaging}
                    isSelectAllCheckbox={this.props.isSelectAllCheckbox}
                    isSelection={this.props.isSelection}
                    isPageSize={this.props.isPageSize}
                    paginationPosition={this.props.paginationPosition}
                    topbarColumnsButton={this.props.topbarColumnsButton}
                    topbarExportActions={this.props.topbarExportActions}
                    topbarObligationAction={this.props.topbarObligationAction}
                    actions={this.props.actions}
                    Groupby_Tag={this.props.Groupby_Tag}
                    TagLevel={this.props.TagLevel}
                    Table_Ref={this.props.Table_Ref}
                    RowID={this.props.RowID}
                    actionProps={actionProps}
                />
            </div>
        )
    }
}
