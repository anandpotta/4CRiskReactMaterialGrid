import { createElement } from "react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MaterialTable from "@material-table/core";

import CircularProgress from "@material-ui/core/CircularProgress";
import { forwardRef } from "react";

// import Dialog from "@material-ui/core/Dialog";
// import DialogActions from "@material-ui/core/DialogActions";
// import DialogContent from "@material-ui/core/DialogContent";
// import DialogTitle from "@material-ui/core/DialogTitle";

// import { ConfirmProvider, useConfirm } from "material-ui-confirm";
// import Button from "@material-ui/core/Button";

import * as XLSX from "xlsx-js-style";

import jsPDF from "jspdf";
import "jspdf-autotable";

function ReactMaterialGridComponent(props) {
    const tableRef = useRef();

    const tableTitle = props.tableTitle;
    const gridSource = props.gridSource;
    const [columnData, setColumnData] = useState(props.columnData);
    const [rows, setRows] = useState(props.rowData);
    const [tabActions, setTabActions] = useState([]);
    const actionProps = props.actionProps;
    const [isLoading, setIsLoading] = useState(false);

    // const [applyAll, setApplyAll] = useState([]);
    // const [open, setOpen] = useState(false);
    // const [oldUpdatedData, setOldUpdatedData] = useState();
    // const [newUpdatedData, setNewUpdatedData] = useState();

    // function handleClickOpen() {
    //     setOpen(true);
    // }

    // function handleClose() {
    //     setOpen(false);
    // }

    // function handleUpdate() {
    //     setOpen(false);
    //     debugger;
    // }

    useEffect(() => {
        //setIsLoading(true);
        setColumnData(props.columnData);
        //setIsLoading(false);
    }, [props.columnData]);

    useEffect(() => {
        // setLoading(true)
        // setIsLoading(true);
        if (props.rowData.length > 0) {
            setRows(props.rowData);
            // setLoading(false)
            //setIsLoading(false);
        } else {
            setRows([]);
        }
    }, [props.rowData]);

    const handleActions = (evt, data) => {
        const tableRefArr = [];
        const deleteSet = tableRef.current.dataManager.data.filter(itemObj => itemObj.tableData.checked === true);

        if (deleteSet.length > 0) {
            deleteSet.map(tdata => {
                if (tdata.tableData.checked === true) {
                    tableRefArr.push(tdata.RuleAutoID);
                }
            });

            if (props.Table_Ref.status === "available" && tableRefArr.length !== undefined) {
                if (tableRefArr.length === 1) {
                    props.Table_Ref.setValue(JSON.stringify(JSON.parse(tableRefArr)));
                } else {
                    props.Table_Ref.setValue(tableRefArr.join(","));
                }
            }
        } else {
            if (props.Table_Ref.status === "available" && data.length !== undefined) {
                props.Table_Ref.setValue(data.map(obj => JSON.parse(obj.RuleAutoID)).join(","));
            }

            if (props.RowID.status === "available") {
                props.RowID.setValue(data.ID);
            }

            if (tableRef.current.dataManager.grouped === true) {
                let groupCount = 0;
                const groupedItems = [];
                for (let i = 0; i < tableRef.current.dataManager.columns.length; i++) {
                    if (
                        tableRef.current.dataManager.columns[i].tableData.groupOrder !== undefined &&
                        tableRef.current.dataManager.columns[i].tableData.groupOrder !== -1
                    ) {
                        groupCount++;
                        groupedItems.push(tableRef.current.dataManager.columns[i].field);
                    }
                }
                if (groupedItems.length === 1) {
                    props.Groupby_Tag.setValue(groupedItems[0]);
                } else {
                    props.Groupby_Tag.setValue(groupedItems.join("|"));
                }
                props.TagLevel.setValue(JSON.stringify(groupCount));
            } else {
                props.Groupby_Tag.setValue("");
                props.TagLevel.setValue("0");
            }
        }
    };

    const newTabActions = [];
    props.actions.forEach((item, i) => {
        newTabActions.push({
            icon: () => (
                <button key={i} className={item.className}>
                    {item.actionName}
                </button>
            ),
            position: item.position,
            label: item.actionName,
            baseClassName: item.actionName.replace(/ +/g, ""),
            tooltip: item.tooltip,
            hidden: !item.hidden.value,
            // disabled: !item.hidden.value,
            onClick: (evt, data) => {
                if (evt.target.classList.contains("btnMinMax")) {
                    const box = evt.target.closest(".mendix-react-material-table");
                    const button = document.querySelector(".btnMinMax");
                    // const buttonClass = document.querySelector(".maxIcon")

                    if (button.classList.contains("minIcon")) {
                        item.tooltip = "Minimize";
                        //this.tooltip = "Maximize";
                    } else {
                        item.tooltip = "Maximize";
                        //this.title = "Minimize";
                    }

                    // if (this.tooltip == "Maximize") {
                    //     this.tooltip = "Minimize";
                    // } else {
                    //     this.tooltip = "Maximize";
                    // }

                    // button.addEventListener("click", () => {
                    box.classList.toggle("toggle");
                    button.classList.toggle("minIcon");
                    // })
                } else {
                    handleActions(evt, data);

                    if (item.onClickAction) {
                        item.onClickAction.execute();
                        // if (item.actionName === "Generate Obligations") {
                        //     // setLoadingOne(!loadingOne);
                        //     item.onClickAction.execute();
                        // } else {
                        //     item.onClickAction.execute();
                        // }
                    }
                }
            }
        });
    });

    // useEffect(() => {
    //     const newTabActions = [];
    //     props.actions.forEach((item, i) => {
    //         newTabActions.push({
    //             icon: () => <button key={i} className={item.className} />,
    //             position: item.position,
    //             tooltip: item.tooltip,
    //             hidden: !item.hidden.value,
    //             onClick: (evt, data) => {
    //                 if (evt.target.classList.contains("btnMinMax")) {
    //                     const box = document.querySelector(".mendix-react-material-table");
    //                     const button = document.querySelector(".btnMinMax");
    //                     // const buttonClass = document.querySelector(".maxIcon")

    //                     if (button.classList.contains("minIcon")) {
    //                         item.tooltip = "Minimize";
    //                     } else {
    //                         item.tooltip = "Maximize";
    //                     }

    //                     // button.addEventListener("click", () => {
    //                     box.classList.toggle("toggle");
    //                     button.classList.toggle("minIcon");
    //                     // })
    //                 } else {
    //                     handleActions(evt, data);

    //                     if (item.onClickAction) {
    //                         if (item.actionName === "GenerateObligation") {
    //                             // setLoadingOne(!loadingOne);
    //                             item.onClickAction.execute();
    //                         } else {
    //                             item.onClickAction.execute();
    //                         }
    //                     }
    //                 }
    //             }
    //         });
    //     });
    //     setTabActions(newTabActions);
    // }, []);

    // const csvData = [];
    // const deleteSet = [];
    // let groupedData;

    const exportCsv = (columns, data) => {
        debugger;

        let dataSet = [];

        var tableTitleUpdated = tableTitle;
        tableTitleUpdated = tableTitleUpdated.slice(0, 29);

        if (tableRef.current.dataManager.grouped != true) {
            const columnNewData = columns.filter(column => column.hidden !== true);
            columnNewData.forEach(column => {
                dataSet = data.filter(row => delete !row[column.field]);
            });
        } else {
            const groupedData = tableRef.current.dataManager.groupedData;
            // eslint-disable-next-line no-inner-declarations
            function csvData(obj) {
                debugger;
                if (obj.data.length > 0) {
                    // obj.data.map(({tableData, undefined, RuleAutoID, Actions, ...rest}) => rest);
                    const groups = obj.path.map((e, idx) => ({ [`Group-${idx}`]: e }));
                    dataSet = [...dataSet, ...groups, ...obj.data];
                }

                if (obj.groups.length > 0) {
                    obj.groups.forEach(csvData);
                }
            }
            groupedData.forEach(csvData);
            // console.log("dataSet", dataSet);
        }

        debugger;
        const ws = XLSX.utils.json_to_sheet(dataSet);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, ws, tableTitleUpdated);

        //create and downloading workbook

        var colNum = XLSX.utils.decode_col("A");
        var range = XLSX.utils.decode_range(ws["!ref"]);
        var row = XLSX.utils.encode_row(range.s.r);
        var C = range.s.c;

        const merge = [];
        var wscols = [];

        const strSplit = [];
        ws["!cols"] = [];
        ws["!merges"] = [];
        // console.log("row", row);

        for (var R = range.s.r + 1; R <= range.e.r - 1; ++R) {
            for (C = range.s.c; C <= range.e.c; ++C) {
                var cell_address = { c: C, r: R };

                /* `.t == "n"` for number cells */
                var ref = XLSX.utils.encode_cell({ c: C, r: R });
                // console.log("ws[ref]", ws[ref]);
                //console.log('default',  ws[`${XLSX.utils.encode_col(C)}0`].v);

                /* assign the `.z` number format */
                if (ws[ref] == undefined) {
                    ws[ref] = { t: "s", v: "" };
                    ws[ref].s = {
                        fill: {
                            patternType: "solid",
                            fgColor: { rgb: "f2f2f2" },
                            bgColor: { rgb: "f2f2f2" }
                        },
                        border: {
                            top: { style: "thin", color: { rgb: "f2f2f2" } },
                            right: { style: "thin", color: { rgb: "f2f2f2" } },
                            bottom: { style: "thin", color: { rgb: "f2f2f2" } },
                            left: { style: "thin", color: { rgb: "f2f2f2" } }
                        }
                    };
                }
                const str = ws[`${XLSX.utils.encode_col(C)}1`].v;
                const substring = "Group-";

                if (str.includes(substring) && ws[ref].v !== "") {
                    // wscols.push({width: 5});
                    // ws['!cols'] = wscols;
                    ws[ref].s = {
                        font: {
                            size: "18",
                            bold: true,
                            color: { rgb: "000000" }
                        },
                        fill: {
                            patternType: "solid",
                            fgColor: { rgb: "f2f2f2" },
                            bgColor: { rgb: "f2f2f2" }
                        },
                        border: {
                            top: { style: "thin", color: { rgb: "f2f2f2" } },
                            right: { style: "thin", color: { rgb: "f2f2f2" } },
                            bottom: { style: "thin", color: { rgb: "f2f2f2" } },
                            left: { style: "thin", color: { rgb: "f2f2f2" } }
                        }
                    };

                    merge.push({ s: { r: R, c: C }, e: { r: R, c: range.e.c } });
                    ws["!merges"] = merge;
                }
                wscols.push({ width: range.e.c * 2 });
            }
        }

        const groupCols = [];
        for (let col = 0; col <= range.e.c; ++col) {
            const str = ws[`${XLSX.utils.encode_col(col)}1`].v;
            const substring = "Group-";
            if (str.includes(substring)) {
                groupCols.push({ width: 2 });
                const alphabet = [...Array(range.e.c + 1)].map((e, i) => (i + 10).toString(36).toUpperCase() + "1");
                ws[alphabet[col]].s = {
                    font: {
                        color: { rgb: "FFFFFF" }
                    },
                    fill: {
                        fgColor: { rgb: "FFFFFF" },
                        bgColor: { rgb: "FFFFFF" }
                    }
                };
            }

            if (!str.includes(substring)) {
                const alphabet = [...Array(range.e.c + 1)].map((e, i) => (i + 10).toString(36).toUpperCase() + "1");
                ws[alphabet[col]].s = {
                    font: {
                        size: "18",
                        bold: true,
                        color: { rgb: "000000" }
                    },
                    fill: {
                        fgColor: { rgb: "d9d9d9" },
                        bgColor: { rgb: "d9d9d9" }
                    }
                };
            }
        }
        ws["!cols"] = [...groupCols, ...wscols];

        //XLSX.utils.book_append_sheet(workBook, workSheet, tableTitle.substring(0, 30));
        //XLSX.utils.book_append_sheet(workBook, ws, "xlxsdownload");
        //Buffer
        try {
            XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
            //Binary string
            XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
            //Download
            XLSX.writeFile(workBook, tableTitle + ".xlsx");
            //XLSX.writeFile(workBook, "xlxsdownload.xlsx");
        } catch (err) {
            if (err) {
                console.log("error", err);
                alert(
                    "The character limit for the Rule Text has been exceeded. Please reach out to your system administrator for assistance."
                );
            }
        }
    };

    const exportPdf = (columns, data) => {
        let dataSet = [];
        debugger;

        const columnNewData = columns.filter(column => column.hidden !== true);

        let rowNewData;
        columnNewData.forEach(column => {
            rowNewData = data.filter(row => delete !row[column.field]);
        });
        rowNewData = data;
        const columnTitles = columns
            .map(columnDef => columnDef.title)
            .filter(function(element) {
                return element !== undefined;
            });
        if (tableRef.current.dataManager.grouped != true) {
            dataSet = data.map(rowData => columns.map(columnDef => rowData[columnDef.field]));
        } else {
            const groupedData = tableRef.current.dataManager.groupedData;
            // eslint-disable-next-line no-inner-declarations
            function csvData(obj) {
                if (obj.data.length > 0) {
                    obj.data.forEach(item => {
                        delete item.RuleAutoID;
                        // delete item.Actions && delete item.RuleAutoID && delete item.tableData;
                    });
                    const groups = obj.path.map((e, idx) => ({ [`Group-${idx}`]: e }));
                    dataSet = [...dataSet, ...groups, ...obj.data];
                }

                if (obj.groups.length > 0) {
                    obj.groups.forEach(csvData);
                }
            }
            groupedData.forEach(csvData);
        }
        const doc = new jsPDF("landscape");

        const header = function(data) {
            doc.setFontSize(16);
            doc.setTextColor(40);
            doc.text(tableTitle, data.settings.margin.left, 22);
        };
        doc.autoTable({
            theme: "striped",
            columns: columnNewData.map(col => ({ ...col, dataKey: col.field })),
            body: dataSet,
            startY: 30,
            // showHead: "firstPage",
            headStyles: {
                cellPadding: 2,
                lineWidth: 0,
                valign: "top",
                fontStyle: "bold",
                halign: "left",
                textColor: [255, 255, 255],
                fontSize: 8,

                minCellHeight: 20
            },
            styles: {
                overflow: "linebreak",
                cellWidth: "100",
                halign: "left",
                fontSize: "8",
                lineColor: "100",
                lineWidth: "0"
            },
            columnStyles: {
                Rule: { cellWidth: "200" }
            },
            pageBreak: "auto",
            didDrawPage: header
            // drawHeaderRow: function(row, data) {
            //     if (data.pageCount > 1) {
            //         return false;
            //     }
            // }
        });

        doc.save(tableTitle + ".pdf");
    };

    return (
        <div className="App mendix-react-material-table">
            {
                <MaterialTable
                    tableRef={tableRef}
                    columns={columnData}
                    data={rows}
                    // isLoading={!rows.length}
                    actions={newTabActions}
                    // isLoading={isLoading ?? <CircularProgress />}
                    localization={{
                        toolbar: {
                            exportTitle: "Download",
                            exportAriaLabel: "Download"
                        }
                    }}
                    editable={{
                        onRowUpdateCancelled: () => {
                            // $('button[title="Save"]').show();
                            $('button[title="Save"]').css('pointer-events', 'all').css('opacity', '1');
                            $('button[title="Save RuleBook"]').css('pointer-events', 'all').css('opacity', '1');
                        },
                        onRowUpdate: props.editableTable.value
                            ? (newData, oldData) =>
                                  //   setIsLoading(true);

                                  new Promise((resolve, reject) => {
                                      try {
                                          //   setTimeout(() => {
                                          newData["Apply To All"] = $(
                                              'input[type="checkbox"][class="material-input-checkbox"]:checked'
                                          )
                                              .map(function() {
                                                  return this.name;
                                              })
                                              .get()
                                              .toString();
                                          console.log(newData, oldData);

                                          if (newData.hasOwnProperty("Exception")) {
                                              // const valuesExists = [false, ""];
                                              const exceptionData = props.columnData
                                                  .filter(item => item.exceptionEnabled === true)
                                                  .map(itz => newData[itz.title]);

                                              // const exceptionCheck = exceptionData.some(r => valuesExists.includes(r));

                                              if (
                                                  // exceptionData.includes(false) ||
                                                  exceptionData.includes("") ||
                                                  exceptionData.includes("Unassigned")
                                              ) {
                                                  newData.Exception = "Exception";
                                                  // } else if (exceptionData.includes(true) && !exceptionData.includes("")) {
                                              } else if (!exceptionData.includes("")) {
                                                  newData.Exception = "Edited";
                                              } else {
                                                  newData.Exception = "NotEdited";
                                              }
                                          }

                                          var applyToAll = $(
                                              'input[type="checkbox"][class="material-input-checkbox"]:checked'
                                          )
                                              .map(function() {
                                                  return this.defaultValue;
                                              })
                                              .get()
                                              .toString();
                                          const dataUpdate = [...rows];
                                          const index = oldData.tableData.id;
                                          dataUpdate[index] = newData;

                                          const newObj = Object.keys(newData).reduce(function(result, oldKey, i) {
                                              var newKey = props.columnData[i].headerLabel;
                                              return { ...result, [newKey]: newData[oldKey] };
                                          }, {});

                                          if (newData["Apply To All"] !== "") {
                                              // selectedCols = newData["Apply To All"].split(",");
                                              //updatedValues = selectedCols.map(item => [item, newObj[item]]).reduce((prev,curr)=>{prev[curr[0]]=curr[1];return prev;},{});

                                              if (props.RowDataApplyToAll.status === "available") {
                                                  props.RowDataApplyToAll.setValue(newData["Apply To All"]);
                                              }

                                              if (applyToAll.includes(",")) {
                                                  applyToAll = applyToAll.split(",");
                                                  dataUpdate.forEach(item =>
                                                      Object.entries(item).map(([key, value]) => {
                                                          if (applyToAll.some(v => v === key)) {
                                                              return (item[key] = newData[key]);
                                                          }
                                                      })
                                                  );
                                              } else {
                                                  dataUpdate.forEach(item =>
                                                      Object.entries(item).map(([key, value]) => {
                                                          if (applyToAll === key) {
                                                              return (item[key] = newData[key]);
                                                          }
                                                      })
                                                  );
                                              }
                                          } else {
                                              if (props.RowDataApplyToAll.status === "available") {
                                                  props.RowDataApplyToAll.setValue("");
                                              }
                                          }

                                          if (props.RowID.status === "available") {
                                              props.RowID.setValue(newObj.ID);
                                          }

                                          if (props.RowData.status === "available") {
                                              props.RowData.setValue(JSON.stringify(newObj));
                                          }

                                          setRows([...dataUpdate]);

                                          if (props.onRowUpdateAction.canExecute === true) {
                                              props.onRowUpdateAction.execute();
                                          }

                                          //   $('.MuiToolbar-gutters button[title="Save"]').show();
                                          resolve();
                                          //   }, 1000);
                                      } catch (err) {
                                          reject(err);
                                      }
                                      //   setIsLoading(false);
                                  })
                            : null
                        // onRowDelete: oldData =>
                        //     new Promise((resolve, reject) => {
                        //         setTimeout(() => {
                        //             const dataDelete = [...rows];
                        //             const index = oldData.tableData.id;
                        //             dataDelete.splice(index, 1);
                        //             setRows([...dataDelete]);
                        //             props.Table_Ref.setValue(JSON.stringify(JSON.parse(oldData.RuleAutoID)));
                        //             if (props.onRowDeleteAction.canExecute === true) {
                        //                 props.onRowDeleteAction.execute();
                        //             }
                        //             resolve();
                        //         }, 1000);
                        //     })
                    }}
                    options={{
                        rowStyle: rowData => {
                            if (rowData.Exception !== "") {
                                return {
                                    color:
                                        rowData.Exception === "Exception"
                                            ? "red"
                                            : rowData.Exception === "Edited"
                                            ? "green"
                                            : "black"
                                };
                            }
                        },

                        actionsColumnIndex: props.actionColumnIndex,
                        showEmptyDataSourceMessage: true,
                        // showEmptyDataSourceMessage: isLoading ?? <CircularProgress />,
                        minBodyHeight: 500,
                        maxBodyHeight: "70vh",
                        maxBodyWidth: 700,
                        tableLayout: "auto",
                        padding: "dense",
                        draggable: props.canDraggable,
                        sorting: props.canSortable,
                        search: props.canSearch,
                        filtering: props.canFilter,
                        grouping: props.canGroupable,
                        paging: props.isPaging,
                        paginationPosition: props.paginationPosition,
                        pageSizeOptions: [5, 10, 20, 25, 50, 100],
                        pageSize: props.isPageSize,
                        showSelectAllCheckbox: props.isSelectAllCheckbox.value,
                        selection: props.isSelection.value,
                        paginationType: "stepped",
                        showFirstLastPageButtons: true,
                        emptyRowsWhenPaging: false,
                        doubleHorizontalScroll: true,

                        exportAllData: true,
                        exportFileName: tableTitle,
                        exportMenu: [
                            {
                                label: "PDF",
                                exportFunc: (data, columns) => exportPdf(data, columns, tableTitle)
                            },
                            {
                                label: "Excel",
                                exportFunc: (data, columns) => exportCsv(data, columns, tableTitle)
                            }
                        ],
                        // exportMenu: props.rowData.length
                        //     ? [
                        //           {
                        //               label: "PDF",
                        //               exportFunc: (data, columns) => exportPdf(data, columns, tableTitle)
                        //           },
                        //           {
                        //               label: "Excel",
                        //               exportFunc: (data, columns) => exportCsv(data, columns, tableTitle)
                        //           }
                        //       ]
                        //     : false,
                        columnsButton: props.topbarColumnsButton,
                        searchFieldAlignment: "left",
                        searchAutoFocus: true,
                        searchFieldVariant: "outlined",
                        addRowPosition: "first",
                        showTextRowsSelected: true
                    }}
                    title={props.rowData.length + gridSource}
                />
            }
            {/* <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Update Regulation</DialogTitle>
                <DialogContent>
                    <div>Do you want to update regulation data changes ?</div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
            ; */}
        </div>
    );
}

export default ReactMaterialGridComponent;
