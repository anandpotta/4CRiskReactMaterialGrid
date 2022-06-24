import { createElement } from "react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MaterialTable, { MTableAction, MTableBody, MTableGroupRow, MTableGroupbar } from "material-table";
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

    // const handleDeleteRows = (event, rowData) => {
    //     debugger;
    // };

    useEffect(() => {
        debugger;
        setColumnData(props.columnData);
    }, [props.columnData]);

    useEffect(() => {
        setLoadingOne(!loadingOne);
        setRows(props.rowData);
        setLoadingOne(loadingOne);
    }, [props.rowData]);

    let csvData = [];
    let dataSet = [];
    let groupedData;
    const exportCsv = (columns, data) => {
        debugger;
        
        data.forEach((item) => {
            delete item.Actions && delete item.RuleAutoID && delete item.tableData;
          });

        if(tableRef.current.dataManager.grouped != true)    {
            const columnNewData = columns.filter(column => column.hidden !== true && column.title !== "Actions");
             columnNewData.forEach(column => {
                dataSet = data.filter(row => delete !row[column.field]);
            });
        } else {
            let groupedData = tableRef.current.dataManager.groupedData;
            function csvData(obj) {
                if (obj.data.length > 0) {
                    obj.data.forEach(item => {
                        delete item.Actions && delete item.RuleAutoID && delete item.tableData;
                    });
                const groups = obj.path.map((e, idx) => {
                    return { [`Group-${idx}`]: e };
                });
                    dataSet = [...dataSet, ...groups, ...obj.data];
                }
                
                if (obj.groups.length > 0) {
                    obj.groups.forEach(csvData);
                }
            }
            groupedData.forEach(csvData);
            console.log(dataSet);
        }

        const workSheet = XLSX.utils.json_to_sheet(dataSet);
        const workBook = XLSX.utils.book_new();
        //XLSX.utils.book_append_sheet(workBook, workSheet, tableTitle.substring(0, 30));
        XLSX.utils.book_append_sheet(workBook, workSheet, "xlxsdownload");
        //Buffer
        XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
        //Binary string
        XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
        //Download
        XLSX.writeFile(workBook, tableTitle + ".xlsx");
       //XLSX.writeFile(workBook, "xlxsdownload.xlsx");
    };

    const exportPdf = (columns, data) => {
        debugger;
        data.forEach(item => {
            delete item.Actions && delete item.tableData;
        });

        const columnNewData = columns.filter(column => column.hidden !== true && column.title !== "Actions");
        let rowNewData;
        columnNewData.forEach(column => {
            rowNewData = data.filter(row => delete !row[column.field]);
        });
        const columnTitles = columns
            .map(columnDef => columnDef.title).filter(function( element ) {
        return element !== undefined;
        });
        if(tableRef.current.dataManager.grouped != true)    {
            dataSet = data.map(rowData =>
                columns.map(columnDef => rowData[columnDef.field]),
            );
        } else {
            let groupedData = tableRef.current.dataManager.groupedData;
            function csvData(obj) {
                if (obj.data.length > 0) {
                    obj.data.forEach(item => {
                        delete item.Actions && delete item.RuleAutoID && delete item.tableData;
                    });
                const groups = obj.path.map((e, idx) => {
                    return { [`Group-${idx}`]: e };
                });
                    dataSet = [...dataSet, ...groups, ...obj.data];
                }
                
                if (obj.groups.length > 0) {
                    obj.groups.forEach(csvData);
                }
            }
            groupedData.forEach(csvData);
            console.log(dataSet);
        }
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
                const deleteSet = tableRef.current.dataManager.data.filter(itemObj => itemObj.tableData.checked === true);

                // if(data.length !== undefined){
                //     data.forEach((obj, idx) => {
                //         tableRefArr.push(obj.RuleAutoID);
                //     });

                //     if (props.Table_Ref.status === "available" && data.length !== undefined) {
                //         if (tableRefArr.length === 1) {
                //             props.Table_Ref.setValue(JSON.stringify(JSON.parse(tableRefArr)));
                //         } else {
                //             props.Table_Ref.setValue(tableRefArr.join(","));
                //         }
                //     }
                // } else 
                if (deleteSet.length > 0) {
                    deleteSet.map(tdata => {
                                if (tdata.tableData.checked == true) {
                                    tableRefArr.push(tdata.RuleAutoID);
                                }
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

    if($('span').hasClass('Mui-checked')) {
        console.log('am in');
        $('span').closest('.groupHeader').find('.groupCheck').prop('checked', true)
    }
    const handleCheckboxClick = (event) => {
        debugger;

        const selectedSection = $(event.target)
            .next("tr")
            .text()
            .split(":", 2)
            .pop()
            .trim();
        // $(event.target).next('tr').text().split(":").pop().trim()
        // tableRef.current.dataManager.groupedData[1].value.trim()?\
       
        const groupedItems = [];	
        for (let i = 0; i < tableRef.current.dataManager.columns.length; i++) {	
            if (	
                tableRef.current.dataManager.columns[i].tableData.groupOrder !== undefined &&	
                tableRef.current.dataManager.columns[i].tableData.groupOrder !== -1	
            ) {	
                groupedItems.push(tableRef.current.dataManager.columns[i].field);	
            }	
        }	
        console.log(groupedItems);

        const tableRefArr = [];

    
        $('input[type=checkbox]').change(function(){
            // var selectedVal = $(this).parent('.groupHeader').children().find('tr').text().split(":", 2).pop().trim();	
            var selectedVal = this.nextElementSibling.textContent	
                .split(":", 2)	
                .pop()	
                .trim();
            // if is checked
            if(this.checked){
                // check all children
                var lenchk = $(this).closest('input').find(':checkbox');
                var lenchkChecked = $(this).closest('input').find(':checkbox:checked');
        
                //if all siblings are checked, check its parent checkbox
                if (lenchk.length == lenchkChecked.length) {
                    tableRef.current.dataManager.data.filter(item => {	
                        for(let i=0; i<groupedItems.length; i++) {
                            console.log('item[groupedItems[i]]', item[groupedItems[i]] );
                            if (item[groupedItems[i]] === selectedVal) {	
                                item.checked = true;	
                                item.tableData.checked = true;	
                                tableRefArr.push(item.RuleAutoID);	
                                console.log('item.checked ', item.checked );
                                console.log('item.tableData.checked', item.tableData.checked);
                            }
                        }
                        	
                    });
                    $(this).closest('input').siblings().find(':checkbox').prop('checked', true);
                    $(this).parent('.groupHeader').children().find('span.MuiCheckbox-root').addClass('PrivateSwitchBase-checked-19 Mui-checked');
                    $(this).parent('.groupHeader').children().find('span.MuiCheckbox-root svg path').attr("d", "M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z");
                }else{
                    $(this).closest('.groupHeader').siblings().find(':checkbox').prop('checked', true);
                }
            } else {
                // uncheck all children
                tableRef.current.dataManager.data.filter(item => {	
                    for(let i=0; i<groupedItems.length; i++) {
                        console.log('item[groupedItems[i]]', item[groupedItems[i]] );
                        if (item[groupedItems[i]] === selectedVal) {	
                            item.checked = false;	
                            item.tableData.checked = false;	
                        }
                    }
                });
                $(this).closest('.groupHeader').siblings().find(':checkbox').prop('checked', false);
                $(this).closest('input').siblings().find(':checkbox').prop('checked', false);
                $(this).parent('.groupHeader').children().find('.groupCheck').prop('checked', false);
                $(this).parents('.groupHeader').find('.groupCheck').prop('checked', false);
                $(this).parent('.groupHeader').children().find('span.MuiCheckbox-root').removeClass('PrivateSwitchBase-checked-19 Mui-checked')
                $(this).parent('.groupHeader').children().find('span.MuiCheckbox-root svg path').attr("d", "M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z");
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

    const handleClick = (event, selectedRows) => { 
        console.log(event)
        console.log('selectedRows', selectedRows);
        if(event.tableData.checked == true) {
            $('span.Mui-checked').closest('.groupHeader').find('.groupCheck').prop('checked', true);
        } else {
            $('span').closest('.groupHeader').find('.groupCheck').prop('checked', false);
        }
    }
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
                onSelectionChange={(selectedRows, e) => handleClick(e, selectedRows) }
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
                    showSelectAllCheckbox: props.isSelectAllCheckbox.value,	
                    selection: props.isSelection.value,
                    paginationType: "stepped",
                    showFirstLastPageButtons: true,

                    //exportButton: props.topbarExportActions,
                    exportAllData: true,
                    exportFileName: tableTitle,
                    exportButton: {
                        csv: true,
                        pdf: true,
                     },
                     exportCsv: (data, columns) =>  exportCsv(data, columns),
                     exportPdf: (data, columns) =>  exportPdf(data, columns),
                    // exportCsv: (tableColumns, tableData) => exportCsv(tableColumns, tableData),
                    // exportPdf: (tableColumns, tableData) => exportPdf(tableColumns, tableData),

                    searchFieldAlignment: "left",
                    searchAutoFocus: true,
                    // searchFieldVariant: "standard",
                    searchFieldVariant: "outlined",
                    addRowPosition: "first",
                    actionsColumnIndex: -1,
                    showTextRowsSelected: false
                }}
                title={""}
            />
            {/* } */}
        </div>
    );
}

export default ReactMaterialGridComponent;
