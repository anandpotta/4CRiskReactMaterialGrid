import { createElement } from "react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MaterialTable, { MTableAction, MTableBody, MTableGroupRow, MTableGroupbar } from "material-table";
import CustomGroupRow from "./CustomComponent";
import { TableCell, TableFooter, TableRow } from "@material-ui/core";
import { Button } from "react-bootstrap";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import { forwardRef } from "react";
import { Menu, MenuItem } from "@material-ui/core";

import * as XLSX from "xlsx/xlsx.mjs";

import jsPDF from "jspdf";
import "jspdf-autotable";

import Save from "@material-ui/icons/Save";
import Comment from "@material-ui/icons/Comment";
import Share from "@material-ui/icons/Share";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Settings from "@material-ui/icons/Settings";
// import { Skeleton } from "@material-ui/lab";

const tableIcons = {
    Save: forwardRef((props, ref) => <Save {...props} ref={ref} />),
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
    Comment: forwardRef((props, ref) => <Comment {...props} ref={ref} />),
    Share: forwardRef((props, ref) => <Share {...props} ref={ref} />),
    MoreVertIcon: forwardRef((props, ref) => <MoreVertIcon {...props} ref={ref} />)
};

function ReactMaterialGridComponent(props) {
    const tableRef = useRef();
    const tableTitle = props.tableTitle;
    const [columnData, setColumnData] = useState(props.columnData);
    const [rows, setRows] = useState(props.rowData);
    const [loadingOne, setLoadingOne] = useState(false);
    const actionProps = props.actionProps;
    const topBarActions = [];

    // const [checked, setChecked] = React.useState(false);

    const handleDeleteRows = (event, rowData) => {
        debugger;
    };

    useEffect(() => {
        debugger;
        setColumnData(props.columnData);
    }, [props.columnData]);

    useEffect(() => {
        setLoadingOne(!loadingOne);
        setRows(props.rowData);
        setLoadingOne(loadingOne);
    }, [props.rowData]);

    const exportCsv = (columns, data) => {
        debugger;

        data.forEach(item => {
            delete item.Actions && delete item.tableData;
        });

        data.map(obj =>
            Object.keys(obj).map(
                item =>
                    (obj[item] =
                        typeof obj[item] === "object" ? obj[item].props && obj[item].props.children : obj[item])
            )
        );

        columns = columns.filter(column => column.export === true && column.hidden !== true);
        let rowNewData;
        columns.forEach(column => {
            rowNewData = data.filter(row => delete !row[column.field]);
        });

        const workSheet = XLSX.utils.json_to_sheet(rowNewData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, tableTitle.substring(0, 30));
        //Buffer
        XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
        //Binary string
        XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
        //Download
        XLSX.writeFile(workBook, tableTitle + ".xlsx");
    };

    const exportPdf = (columns, data) => {
        debugger;
        data.forEach(item => {
            delete item.Actions && delete item.tableData;
        });
        data.map(obj =>
            Object.keys(obj).map(
                item =>
                    (obj[item] =
                        typeof obj[item] === "object" ? obj[item].props && obj[item].props.children : obj[item])
            )
        );
        const columnNewData = columns.filter(column => column.hidden !== true && column.title !== "Actions");
        let rowNewData;
        columnNewData.forEach(column => {
            rowNewData = data.filter(row => delete !row[column.field]);
        });
        // rows = rows.map(rowData => rowData.includes('Rule') && typeof(rowData) ? rowData.props.children)
        const doc = new jsPDF("landscape");

        const header = function(data) {
            doc.setFontSize(16);
            doc.setTextColor(40);
            doc.text(tableTitle, data.settings.margin.left, 22);
        };
        doc.autoTable({
            theme: "striped",
            columns: columnNewData.map(col => ({ ...col, dataKey: col.field })),
            body: rowNewData,
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
            didDrawPage: header,
            drawHeaderRow: function(row, data) {
                if (data.pageCount > 1) {
                    return false;
                }
            }
        });

        doc.save(tableTitle + ".pdf");
    };

    const gridActionControls = props.actions.map(item => {
        topBarActions.push({
            icon: () => <Button className={item.className} />,
            // isFreeAction: item.isFreeAction,
            position: item.position,
            tooltip: item.actionName,
            hidden: !item.hidden.value,
            onClick: (evt, data) => {
                console.log("data-----", data);
                console.log("TableRef:", tableRef.current);
                debugger;

                const tableRefArr = [];

                if(data.length != undefined){
                    data.forEach((obj, idx) => {
                        tableRefArr.push(obj.RuleAutoID);
                    });

                    if (props.Table_Ref.status === "available" && data.length != undefined) {
                        if (tableRefArr.length == 1) {
                            props.Table_Ref.setValue(JSON.stringify(JSON.parse(tableRefArr)));
                        } else {
                            props.Table_Ref.setValue(tableRefArr.join(","));
                        }
                    }
                } else if ($(".groupCheck").is(":checked")) {
                    tableRef.current.dataManager.groupedData &&
                        tableRef.current.dataManager.groupedData.forEach((obj, idx) => {
                            obj.data.map(tdata => {
                                if (tdata.tableData.checked == true && tdata.checked == true) {
                                    tableRefArr.push(tdata.RuleAutoID);
                                }
                            });
                        });

                    if (props.Table_Ref.status === "available" && tableRefArr.length != undefined) {
                        if (tableRefArr.length == 1) {
                            props.Table_Ref.setValue(JSON.stringify(JSON.parse(tableRefArr)));
                        } else {
                            props.Table_Ref.setValue(tableRefArr.join(","));
                        }
                    }
                } else {
                    if (props.Table_Ref.status === "available" && data.length != undefined) {
                        props.Table_Ref.setValue(data.map(obj => JSON.parse(obj.RuleAutoID)).join(","));
                    }

                    if (tableRef.current.dataManager.grouped == true) {
                        let groupCount = 0;
                        const groupedItems = [];
                        for (let i = 0; i < tableRef.current.dataManager.columns.length; i++) {
                            if (
                                tableRef.current.dataManager.columns[i].tableData.groupOrder !== undefined &&
                                tableRef.current.dataManager.columns[i].tableData.groupOrder !== -1
                            ) {
                                groupCount++;
                                groupedItems.push(tableRef.current.dataManager.columns[i].field);
                                // groupedItems.push(tableRef.dataManager.columns[i].title.replace(/ /g, ""));
                            }
                        }
                        if (groupedItems.length == 1) {
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

                if (item.onClickAction) {
                    item.onClickAction.execute();
                }
            }
        });
    });

    const handleCheckboxClick = event => {
        debugger;

        const selectedSection = $(event.target)
            .next("tr")
            .text()
            .split(":", 2)
            .pop()
            .trim();
        // $(event.target).next('tr').text().split(":").pop().trim()
        // tableRef.current.dataManager.groupedData[1].value.trim()?\

        const tableRefArr = [];

        tableRef.current.dataManager.groupedData &&
            tableRef.current.dataManager.groupedData.forEach(item => {
                var itemSelected = item.value.split(":").slice('0', '1').toString().trim();
                if (itemSelected == selectedSection) {
                    item.data.map(tdata => {
                        tdata.checked = true;
                        tdata.tableData.checked = true;
                        tableRefArr.push(tdata.RuleAutoID);
                    });
                }
            });

        // if (props.Table_Ref.status === "available" && data.length != undefined) {
        //     props.Table_Ref.setValue(
        //         tableRef.current.dataManager.groupedData.map(obj => JSON.parse(obj.RuleAutoID)).join(",")
        //     );
        // }
        // if (props.Table_Ref.status === "available" && tableRefArr.length != undefined) {
        //     if (tableRefArr.length == 1) {
        //         props.Table_Ref.setValue(JSON.stringify(JSON.parse(tableRefArr)));
        //     } else {
        //         props.Table_Ref.setValue(tableRefArr.join(","));
        //     }
        // }
    };

    const customRow = rowData => (
        <div className="groupHeader">
            <input
                data-val={rowData}
                type="checkbox"
                className="groupCheck"
                onClick={event => handleCheckboxClick(event)}
            />
            <MTableGroupRow {...rowData} />
            {/* <CustomGroupRow {...rowData} /> */}
        </div>
    );

    return (
        <div className="App">
            {/* {loadingOne ? <CircularProgress /> */}
            {/* : */}
            <MaterialTable
                tableRef={tableRef}
                icons={tableIcons}
                columns={columnData}
                data={rows}
                isLoading={loadingOne ?? <CircularProgress />}
                actions={topBarActions}
                onSelectionChange={selectedRows => console.log("selectedRows", selectedRows)}
                components={{
                    GroupRow: rowData => customRow(rowData)
                }}
                options={{
                    showEmptyDataSourceMessage: loadingOne ?? <CircularProgress />,
                    minBodyHeight: 560,
                    maxBodyHeight: 1200,
                    maxBodyWidth: 700,
                    tableLayout: "auto",
                    padding: "dense",
                    draggable: props.canDraggable,
                    sorting: props.canSortable,
                    search: props.canSearch,
                    filtering: props.canFilter,
                    grouping: props.canGroupable,
                    columnsButton: props.topbarColumnsButton,
                    paging: props.isPaging,
                    paginationPosition: props.paginationPosition,
                    pageSizeOptions: [5, 10, 20, 25, 50, 100],
                    pageSize: props.isPageSize,
                    showSelectAllCheckbox: props.isSelectAllCheckbox,
                    selection: props.isSelection,
                    paginationType: "stepped",
                    showFirstLastPageButtons: true,

                    exportButton: props.topbarExportActions,
                    exportAllData: true,
                    exportFileName: tableTitle,
                    exportCsv: (tableColumns, tableData) => exportCsv(tableColumns, tableData),
                    exportPdf: (tableColumns, tableData) => exportPdf(tableColumns, tableData),

                    searchFieldAlignment: "left",
                    searchAutoFocus: true,
                    // searchFieldVariant: "standard",
                    searchFieldVariant: "outlined",
                    addRowPosition: "first",
                    actionsColumnIndex: -1,
                    showTextRowsSelected: true
                }}
                title={""}
            />
            {/* } */}
        </div>
    );
}

export default ReactMaterialGridComponent;
