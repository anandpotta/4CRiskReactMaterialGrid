/* eslint-disable prettier/prettier */
import React, { Component, createElement } from "react";
import { Button } from 'react-bootstrap';
import { Menu, MenuItem } from "@material-ui/core";

import "./ui/ReactMaterialGrid.css";

// import { AutocompleteUI } from './components/ReactMaterialGridComponent';
import ReactMaterialGridComponent from './components/ReactMaterialGridComponent';

export default class ReactMaterialGrid extends Component {
    constructor(props) {
        super(props);
        this.getHeaderJSONVal = this.getHeaderJSONVal.bind(this);
        this.getJSONVal = this.getJSONVal.bind(this);
        this.onClickShare = this.onClickShare.bind(this);
        this.onClickComment = this.onClickComment.bind(this);
        this.onRowClick = this.onRowClick.bind(this);
        this.onClickGenerateObligation = this.onClickGenerateObligation.bind(this);
        this.onClickSave = this.onClickSave.bind(this);
        this.getTableTitle = this.getTableTitle.bind(this);
        this.onRowDataUpdate = this.onRowDataUpdate.bind(this);
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
                for (i = 0; i < this.props.columns.length; i++) {
                    // console.log(this.props.columns[i].header && this.props.columns[i].header.get(this.props.datasource.items[0]).status === "available");
                    // if (this.props.columns[i].header && this.props.columns[i].header.get(this.props.datasource.items[0]).status === "available") {
                        if (this.props.columns[i].header && this.props.columns[i].header.status === "available" && this.props.columns[i].header.value !== "") {
                            tableHeaderData.push(
                                {
                                    title: this.props.columns[i].header.value,
                                    field: this.props.columns[i].columnHeader.replace(/ /g, ""),
                                    hidden: this.props.columns[i].canHide.value,
                                    customHeader: true
                                }
                            )
                        } else {
                            tableHeaderData.push(
                                {
                                    title: this.props.columns[i].columnHeader,
                                    field: this.props.columns[i].columnHeader.replace(/ /g, ""),
                                    hidden: this.props.columns[i].canHide.value,
                                    customHeader: false
                                }
                            )
                        }
                    // }
                }
            }
        }
        return tableHeaderData;
    }


    getJSONVal() {
        debugger;
        var tableData = [];
        const datasource = this.props.datasource;
            if (datasource.status === "available" && datasource.items) {
                const NUM_COLUMNS = this.props.columns.length;
                var columnData = {};
                for (var i = 0; i < this.props.datasource.items.length; i++) {
                    for (var j = 0; j < NUM_COLUMNS; j++) {
                        if (this.props.columns[j].showContentAs === "attribute") {
                            columnData[this.props.columns[j].columnHeader.replace(/ /g, "")] = this.props.columns[j].attribute ? this.props.columns[j].attribute.get(this.props.datasource.items[i]).value : "";
                        } else if (this.props.columns[j].showContentAs === "customContent") {
                            columnData[this.props.columns[j].columnHeader.replace(/ /g, "")] = this.props.columns[j].content ? this.props.columns[j].content.get(this.props.datasource.items[i]) : ""
                        }

                    }
                    console.log(columnData);
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

    onClickShare() {
        if (this.props.onClickShareAction) {
        this.props.onClickShareAction.execute();
        }
    }

    onClickComment(event, rowData) {
        mx.data.create({
            entity: "RuleBook.Rules",
            // mxobj : newData,
            callback: function(obj) {

                obj.set("UniqueValue", rowData.UniqueValue);
                mx.data.action({
                    params: {
                        applyto: "selection",
                        actionname: "RuleBook.ACT_CommentRules",
                        guids: [obj.getGuid()]
                    }
                });
                console.log("comment updated on server");
            },
            error: function(e) {
              console.log("Could not comment on object:", e);
            }
          });
    }

    onRowDataUpdate(newData, oldData, [...data]) {
        if (this.props.onRowUpdateAction && this.props.onRowUpdateAction.canExecute && !this.props.onRowUpdateAction.isExecuting) {
            const obj = newData;
            this.props.onRowUpdateAction.execute();
            return obj;
        }
    }

    onClickGenerateObligation(tableRef) {
        if (this.props.onClickGenerateObligationAction) {
            debugger;
            if (tableRef.dataManager.grouped == true) {

                let groupCount = 0;
                const groupedItems = [];
                for (let i = 0; i < tableRef.dataManager.columns.length; i++) {
                    if (tableRef.dataManager.columns[i].tableData.groupOrder != undefined) {
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

    onClickSave = tableRef => {
        const rowData = tableRef.props.data;
        if (this.props.onClickSaveAction) {
            mx.data.commit({
                mxobjs: rowData,
                callback: function() { console.log("Object committed"); },
                error: function() { console.error("Could not commit object:"); }
            });
            this.props.onClickSaveAction.execute();
        }
    }


    onRowClick = (event, rowData) => {
              mx.data.create({
                  entity: "RuleBook.Rules",
                  // mxobj : newData,
                  callback: function(obj) {

                      obj.set("UniqueValue", rowData.UniqueValue);
                      mx.data.action({
                          params: {
                              applyto: "selection",
                              actionname: "RuleBook.ACT_EditRules",
                              guids: [obj.getGuid()]
                          }
                      });
                      console.log("Object created on server");
                  },
                  error: function(e) {
                    console.log("Could not commit object:", e);
                  }
                });
    }

    render() {
        const inputHeaderDataToRender = this.getHeaderJSONVal();
        const inputDataToRender = this.getJSONVal();
        const tableTitle = this.getTableTitle();
        return (
            <div>
                <ReactMaterialGridComponent
                    columnData={inputHeaderDataToRender}
                    rowData={inputDataToRender}
                    onClickShare={this.onClickShare}
                    onClickComment={this.onClickComment}
                    onRowClick={this.onRowClick}
                    onClickGenerateObligation={this.onClickGenerateObligation}
                    onClickSave={this.onClickSave}
                    tableTitle={tableTitle}
                    onRowDataUpdate={this.onRowDataUpdate}
                    canFilter={this.props.canFilter}
                    canSearch={this.props.canSearch}
                    actions={this.props.actions}
                />
            </div>
        )
    }
}
