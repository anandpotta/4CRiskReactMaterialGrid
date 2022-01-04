import { createElement } from "react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MaterialTable, { MTableAction } from "material-table";
import { Button } from "react-bootstrap";

import { forwardRef } from "react";
import { Menu, MenuItem } from "@material-ui/core";

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
    const columnData = props.columnData;
    const tableTitle = props.tableTitle;
    // const [data, setData] = useState(props.rowData);

    const [rows, setRows] = useState(props.rowData);

    useEffect(() => {
        setRows(props.rowData);
    }, [props.rowData]);

    // const actionBtns = props.actions.map((item, idx) => (
    //     <Button
    //         style="position:absolute, z-index:9999"
    //         class={item.className}
    //         key={idx}
    //         onClick={() => {
    //             if (this.props.onClickAction.canExecute && !this.props.onClickAction.isExecuting) {
    //                 this.props.onClickAction.execute();
    //             }
    //             // this.tableRef.current.onQueryChange();
    //         }}
            
            // onClick={e =>
            //     (function(e) {
            //         var t;
            //         if (void 0 !== e) {
            //             var n = null !== (t = e.onClickAction) && void 0 !== t ? t : void 0;
            //             void 0 !== n && n.canExecute && !n.isExecuting && n.execute();
            //         }
            //     }(e.original))
            // }
    //     ></Button>
    // ));

                /* <div>{actionBtns}</div> */
                
                /* <div>
                <Button
                    style="position:absolute; z-index:9999;"
                    class={item.className}
                    key={idx}
                    onClick={() => {
                        if (this.props.onClickAction.canExecute && !this.props.onClickAction.isExecuting) {
                            this.props.onClickAction.execute();
                        }
                        // this.tableRef.current.onQueryChange();
                    }}
                ></Button>
            </div> */


    return (
        <div className="App">
            {/* <div>{actionBtns}</div> */}
            <MaterialTable
                tableRef={tableRef}
                icons={tableIcons}
                columns={columnData}
                data={rows}
                editable={{}}
                actions={[
                    {
                        icon: () => <Settings />,
                        position: "toolbar",
                        tooltip: "Generate Obligation",
                        onClick: () => {
                            props.onClickGenerateObligation(tableRef.current);
                        }
                    }
                ]}
                onSelectionChange={selectedRows => console.log(selectedRows)}
                options={{
                    maxBodyHeight: 460,
                    maxBodyWidth: 700,
                    tableLayout: "auto",
                    // tableLayout: "fixed",
                    // columnResizable: true,
                    padding: "dense",
                    draggable: true,
                    sorting: true,
                    search: props.canSearch,
                    searchFieldAlignment: "left",
                    searchAutoFocus: true,
                    searchFieldVariant: "standard",
                    grouping: true,
                    columnsButton: true,
                    paging: true,
                    pageSizeOptions: [5, 10, 20, 25, 50, 100],
                    pageSize: 10,
                    paginationType: "stepped",
                    showFirstLastPageButtons: true,
                    paginationPosition: "bottom",
                    exportButton: true,
                    exportAllData: true,
                    exportFileName: tableTitle,
                    addRowPosition: "first",
                    actionsColumnIndex: -1,
                    filtering: props.canFilter
                }}
                title={""}
            />
            {/* <button
                className="settingsField"
                onClick={() => {
                    console.log("tableDataBefore", tableRef.current.dataManager.groupedData);
                }}
            >
            </button> */}
        </div>
    );
}

export default ReactMaterialGridComponent;
