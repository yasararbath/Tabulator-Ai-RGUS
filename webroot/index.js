var _userStr = 'dummy';
var yy = 1;
if(window.location.hostname === 'localhost' && yy === 0){
    // Itsik
    $('[data-test-el="1"]').remove();
    if(location.pathname.includes('index.php')){
        $("i.fal").removeClass("fal").addClass("fas");
        $("i.fa-line-columns").removeClass("fa-line-columns").addClass("fa-columns");
    }
} else {
    $('[data-test-el="1"]').siblings('i').remove();
}


// <editor-fold defaultstate="collapsed" desc=" Document ready ">
//#region Document ready
$(document).ready(function () {
    $('.nav_expanded').click(function () {
        $('.main_content').toggleClass("expand-container");
        let leftNav_el = $(this).closest('.left-nav');
        let container_el = $(this).closest('.container-fluid');
        iConsole('inn');
                
        let leftNav_widths = [ $(".container-fluid").css('--left_navExp-width'), $(".container-fluid").css('--left_nav-width') ];
        
        // $(container_el).css('--left_nav_current-width', leftNav_widths[ +$(leftNav_el).hasClass('expanded') ]); // the + will force 0 or 1
        setTimeout(()=>{
            $(leftNav_el).toggleClass('expanded');
        }, 1001);
    });
    $('.nav-link').click(function () {
        if ($(this).attr('href') == '#tab1' && !$(this).hasClass('ints')) {
            infinite_loading();
        }

        if ($(this).attr('href') == '#tab2' && !$(this).hasClass('ints')) {
            paginated_loading();
        }
        if ($(this).attr('href') == '#tab3' && !$(this).hasClass('ints')) {
            paginated_local_loading();
        }
        if ($(this).attr('href') == '#itsik-local' && !$(this).hasClass('ints')) {
            itsik_local();
        }
        if ($(this).attr('href') == '#multi-tbls' && !$(this).hasClass('ints')) {
            multi_tbl_1()
            multi_tbl_2()
        }

        $(this).addClass('ints'); // +IR+ comment this and see that we do not double elements at the top of the page after coming back to the same tab few times
    });
        // $('.nav-link[href="#tab3"]')[0].click();     // +IR+ temp selection
     $('.nav-link[href="#itsik-local"]')[0].click(); // +IR+ temp selection
//    $('.nav-link[href="#multi-tbls"]')[0].click(); // +IR+ temp selection
});
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" infinite loading table ">
//#region - infinite loading table
let infinite_loading = () => {
    const tableId = 'infinite-loading-table';
    const tableContainer = '.infinite-loading-table-container';

    const CustomTabulator = new FeaturedTable('infinite-loading', '#' + tableId, {
        tableContainer,
        _tbl_format : "TMPL_tbl_toolbars_f01",
        _tbl_controlers : {
            "TMPL_tbl_toolbars_f01":[{"tbl_read_mode":{"c": "me-2"}},{'rowEditing':{"c": "me-2"}},{'tbl_multy_purps':{"c": "me-2"}},{'tblSearch':{"c": "me-2", "input_w": 350}},{'tblColVisibility':{"c": "me-2"}},{'tblExport':{"c": "me-2"}},{'tblSettings':{"c": ""}}]
        },
        TabulatorInitOptions: {
            // ajaxURL: 'https://dev1a.ai-rgus.com/php/users.php',
            ajaxURL: 'php/users.php',
            masterFilterURL: 'https://dev1a.ai-rgus.com/php/master-filter.php',
            paginationSize: 30,
            progressiveLoad: 'scroll',
            progressiveLoadScrollMargin: 200,
            layout: 'fitColumns',
            // renderVertical: 'basic',

            iTr_ajaxResponse: function (url, params, response) {
                //                iConsole("------------ iTr_ajaxResponse --------------", url, params, response);
                response['data'] = response['dtRows'];
                return response;
            },
                        
            // layout: 'fitColumns',
            printHeader: function () {
                return "<h1 class='w-100 text-center fs-4 pb-2 border-bottom border-dark mb-2'>Report</h1>";
            },
            printFooter: function () {
                const timeStamp = getCurrentTimestamp();

                return `<div class='w-100 mt-4 border-top pt-2 border-dark d-flex justify-content-between'>
                    <div class="d-flex gap-2">
                        <a href="http://ai-rgus.com/" class='fs-6'>Ai-RGUS.COM</a>
                        <span class='fs-6'>${timeStamp}</span>
                    </div>
                </div>`;
            },
            printFormatter: (tableHolder, table) => {
                $(table).css({ 'margin-top': '20px', 'margin-bottom': '20px' });
                $(table).find('thead th').css({ 'font-size': '11px' });
                $(table).find('tbody td').css({ 'font-size': '12px' });
            },
            printRowRange: 'all',
            // <editor-fold defaultstate="collapsed" desc=" columnsObj ">
            //#region -columnsObj
            columnsObj: function () {
                return [
                    {
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: '',
                        field: 'rowExpand',
                        width: 30,
                        print: false,
                        download: false,
                        iExcludeFromList: {src:0, cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown       
                        expandToKeyData : "gender",
                        
                        formatter: function (cell, formatterParams, onRendered) {                            
                            let el = CustomTabulator.cellF_rowExpand(cell, formatterParams, onRendered,expandRowWithNestedTable_Level1);
                            return el;
                        },   
                        increaseTblHeight: function(row){
                            $(CustomTabulator.TabulatorObj.element).attr('style', "height:1100px !important");
                        },
                        scrollRowTblAfterLoad: function(row){
                            // row.getElement().scrollIntoView({block:"end"});
                            CustomTabulator.TabulatorObj.scrollToRow(row, "top", false)

                            // this is not working
                            // row.getElement().scrollIntoView({block:"end",behavior:"smooth"});
                        }
                    },
                    {
                        formatter: 'rowSelection',
                        titleFormatter: 'rowSelection',
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: 'Select',
                        field: 'rowSelection',
                        width: 60,
                        print: false,
                        download: false,
                    },
                    {
                        title: 'ID',
                        field: 'id',
                        width: 80,
                        visible: isColumnVisible.call(this, 'id'),
                    },
                    {
                        title: 'Name',
                        field: 'name',
                        visible: isColumnVisible.call(this, 'name'),
                        width: 150,
                        editor: 'input',
                        headerFilter: 'input',
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        headerWordWrap: true,
                    },
                    {
                        title: 'Email',
                        field: 'email',
                        visible: isColumnVisible.call(this, 'email'),
                        // width: 170,
                        editor: 'input',
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                        validator: 'required',
                    },
                    {
                        title: 'Phone Number',
                        field: 'phone_number',
                        visible: isColumnVisible.call(this, 'phone_number'),
                        width: 150,
                        editor: 'input',
                        headerSort: false,
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                    },
                    {
                        title: 'Location',
                        field: 'location',
                        visible: isColumnVisible.call(this, 'location'),
                        width: 130,
                        editor: 'input',
                        editable: this.isFieldEditable,
                        validator: 'required',
                        editorParams: {
                            autocomplete: 'true',
                            allowEmpty: true,
                            listOnEmpty: true,
                            valuesLookup: true,
                        },
                    },
                    {
                        title: 'Gender',
                        field: 'gender',
                        editor: 'list',
                        visible: isColumnVisible.call(this, 'gender'),
                        editorParams: {
                            values: { male: 'Male', female: 'Female' },
                            clearable: true,
                            multiselect: true,
                            itemFormatter: function (label, value, item, element) {
                                // iConsole({ label })
                                //label - the text lable for the item
                                //value - the value for the item
                                //item - the original value object for the item
                                //element - the DOM element for the item

                                return '<strong>' + label + ' </strong><br/><div>' + item.value + '</div>';
                            },
                        },
                        editable: this.isFieldEditable,
                        headerFilter: 'list',
                        headerFilterParams: {
                            values: { male: 'Male', female: 'Female' },
                            clearable: true,
                            // multiselect:true,
                        },
                        validator: 'required',
                        width: 120,
                        formatterPrint: function printFormatter(cell, formatterParams, onRendered) {
                            iConsole(cell.getValue(), '');
                            return cell.getValue() == 'male' ? '1' : '0';
                        },
                        accessorDownload: function (value, data, type, params, column) {
                            return value == 'male' ? '1' : '0';
                        },
                    },
                    {
                        title: 'Favourite Color',
                        field: 'favourite',
                        editor: 'input',
                        editable: this.isFieldEditable,
                        headerFilter: 'list',
                        validator: 'required',
                        headerFilterParams: { valuesLookup: true, clearable: true },
                        width: 150,
                        visible: isColumnVisible.call(this, 'favourite'),
                    },
                    {
                        title: 'Date Of Birth',
                        field: 'dob',
                        hozAlign: 'center',
                        width: 200,
                        resizable: false,
                        editor: this.dateEditor,
                        editable: this.isFieldEditable,
                        headerFilter: this.headerDateEditor,
                        validator: 'required',
                        cssClass: 'dob-filter',
                        visible: isColumnVisible.call(this, 'dob'),
                        formatter: function (cell, formatterParams, onRendered) {
                            //cell - the cell component
                            //formatterParams - parameters set for the column
                            //onRendered - function to call when the formatter has been rendered

                            return luxon.DateTime.fromJSDate(new Date(cell.getValue())).toFormat('dd/MM/yyyy');
                        },
                    },
                ];
            },
            //#endregion
            // </editor-fold>
            
            // <editor-fold defaultstate="collapsed" desc=" iTr_rowFormatter_ before|after ">
            //#region -columnsObj
            iTr_rowFormatter_before: function (row) {
//                iConsole("------------ Table obj's rowFormatter Before ------------  ");
                /*
                const button = $(
                    `<button class='expand-btn btn btn-sm text-white ms-2 bg-primary p-1 py-0 user-select-none'>+</button>`
                ).click((e) => {
                    const isExpanded = $(e.target).data('expanded');
                    if (isExpanded) {
                        //  -> delete the child-tabulator
                        deleteTableAndCollapseRow(e, row);
                    } else {
                        expandRowWithNestedTable_Level1(e, row);
                    }
                });
                
                // do not add expand button if it's already there
                if ($(row.getCell('rowSelection').getElement()).find('button.expand-btn').length == 0) {
                    $(row.getCell('rowSelection').getElement()).append(button);
                }
                */
                return true;
                
            },
            iTr_rowFormatter_after: function (row){
//                iConsole("------------ Table obj's rowFormatter After ------------  ");
            },            
            //#endregion
            // </editor-fold>

            iTr_rowDuplicate_start: function (newRowData, demoVar1, demoVar2) {
                // +Info+ We can use <CustomTabulator> instance from above here instead of <this> keyword
                iConsole({ newRowData, demoVar1, demoVar2 });
                newRowData.email = '';
                return true;

                // add new data in the table

                // hide duplicate button
                // add discard button for removing the new duplicated row
                //
            },
            iTr_rowDuplicate_end: function () {
                // CustomTabulator.currentSelectedRows.
            },
            
        },
        // <editor-fold defaultstate="collapsed" desc=" exports ">        
        //#region -exports
        exports: {
            types: ['PDF', 'Excel', 'Copy', 'Print'],
            handlers: {
                pdf: function () {
                    const currentThis = this.TabulatorObj;

                    // old-way to export
                    // currentThis.TabulatorObj.download('pdf', `${currentThis.localStorageKey}.pdf`, {
                    //     title: 'titile',
                    //     orientation: 'landscape',
                    // });

                    const { jsPDF } = window.jspdf;

                    const HiddenCols = getHiddenCols.call(currentThis);

                    const data = currentThis
                        .getData()
                        .map((row) => {
                            // delete rowSelection column
                            delete row.rowSelection;
                            Object.keys(row).forEach((key) => {
                                if (HiddenCols.includes(key)) {
                                    delete row[key];
                                }
                            });
                            if (row.gender) {
                                if (row.gender == 'male') {
                                    row.gender = `1`;
                                }
                                if (row.gender == 'female') {
                                    row.gender = `2`;
                                }
                            }
                            return row;
                        })
                        .map((row) => Object.values(row));

                    // Define columns
                    const columns = currentThis
                        .getColumns()
                        .map((column) => (column.isVisible() ? column.getDefinition() : null))
                        .filter((col) => col != null && col?.field != 'rowSelection');

                    // First pass: Create a temporary document to get the total page count
                    const tempDoc = new jsPDF();
                    tempDoc.autoTable({
                        head: [columns],
                        body: data,
                        startY: 14,
                    });
                    const totalPages = tempDoc.internal.getNumberOfPages();

                    // Second pass: Create the final document with footer
                    const finalDoc = new jsPDF();

                    const pageDimensions = finalDoc.internal.pageSize;
                    const pageHeight = pageDimensions.height ? pageDimensions.height : pageDimensions.getHeight();
                    const pageWidth = pageDimensions.width ? pageDimensions.width : pageDimensions.getWidth();

                    finalDoc.autoTable({
                        head: [columns],
                        body: data,
                        styles: {
                            fontSize: 7,
                        },
                        startY: 14,
                        didDrawPage: async function (data) {
                            const { left: leftMargin, right: rightMargin } = data.settings.margin;
                            const timeStamp = getCurrentTimestamp();

                            // add header
                            finalDoc.setFontSize(10);
                            const headerText = 'User Report';
                            const headerWidth = finalDoc.getTextWidth(headerText);
                            finalDoc.text(headerText, pageWidth / 2 - headerWidth / 2, 8);

                            // left part of the footer
                            let x;
                            let y;
                            let bottomY = pageHeight - 10;

                            const textWidth = finalDoc.getTextWidth('Power by');

                            finalDoc.text('Power by', leftMargin, bottomY);
                            finalDoc.setTextColor(blueColor);

                            const linkWidth = finalDoc.textWithLink('Ai-RGUS.com', (x = leftMargin + textWidth + 1), bottomY, {
                                url: 'https://ai-rgus.com/home',
                            });
                            finalDoc.setDrawColor(blueColor);
                            finalDoc.setLineWidth(0.2);
                            finalDoc.line(x, (y = pageHeight - 9), x + linkWidth, y);

                            finalDoc.setTextColor('#000');
                            finalDoc.text(timeStamp, x + linkWidth + 2, bottomY);

                            // right part of footer
                            const pageNoWidth = finalDoc.getTextWidth('Page ' + data.pageNumber + ' of ' + totalPages);
                            finalDoc.text(
                                'Page ' + data.pageNumber + ' of ' + totalPages,
                                pageWidth - pageNoWidth - rightMargin,
                                pageHeight - 10
                            );
                        },
                    });

                    finalDoc.save('table.pdf');
                },
                excel: function () {
                    const currentThis = this;
                    currentThis.TabulatorObj.download('xlsx', `${currentThis.localStorageKey}.xlsx`, {
                        title: 'Report',
                        orientation: 'portrait',
                    });
                },
                print: function () {
                    const currentThis = this;
                    currentThis.TabulatorObj.print(false, true, {});
                },
            },
        },
        //#endregion
        // </editor-fold>
    });

    CustomTabulator.TabulatorObj.on('tableBuilt', () => {
        focusInputOnLoad(`#${tableId} div[tabulator-field='email'] .tabulator-header-filter input`);

        // logic for tooltip adding in column headers
        const tooltipColumns = [
            { field: 'email', content: '<span>email</span>', customClass: 'tooltip-info tt_width-600', position: 'top' },
            { field: 'location', content: 'location content', position: 'bottom' },
            // { field: 'gender', content: 'location content',position:"bottom", customToolTipItem: $('.add-new-row-btn').clone(true).removeClass("add-new-row-btn") },
            { field: 'gender', content: $('div[tt_for-field=location]').clone(true).html(), position: 'bottom' },
        ];
        addTooltipToTheColumns(CustomTabulator, tooltipColumns);
    });

    $('[data-bs-toggle="tooltip"]').tooltip();
};
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" paginated remote loading table ">
//#region - paginated remote loading table
let paginated_loading = () => {
    const tableId = 'paginated-remote-table';
    const tableContainer = '.paginated-remote-table-container';

    const CustomTabulator = new FeaturedTable('paginated', '#' + tableId, {
        tableContainer,
        _tbl_format : "TMPL_tbl_toolbars_f01",
        _tbl_controlers : {            
            "TMPL_tbl_toolbars_f01":[{"tbl_read_mode":{"c": "me-2"}},{'rowEditing':{"c": "me-2"}},{'tbl_multy_purps':{"c": "me-2"}},{'tblSearch':{"c": "me-2", "input_w": 350}},{'tblColVisibility':{"c": "me-2"}},{'tblExport':{"c": "me-2"}},{'tblSettings':{"c": ""}}]
        },
        TabulatorInitOptions: {
            // ajaxURL: 'https://dev1a.ai-rgus.com/php/users.php',
            ajaxURL: 'php/users.php',
            masterFilterURL: 'https://dev1a.ai-rgus.com/php/master-filter.php',
            pagination: true,
            paginationMode: 'remote',
            keybindings:{
                "scrollToStart":false,
                "scrollToEnd":false,
            },
            paginationSizeSelector: [25, 50, 100, 500, 1000, 2500, 5000, 10000, 25000],
            paginationCounter: 'rows',

            iTr_ajaxResponse: function (url, params, response) {
                //    iConsole("------------ iTr_ajaxResponse --------------", url, params, response);
                return true;
            },
                        
            // layout: 'fitColumns',
            printHeader: function () {
                return "<h1 class='w-100 text-center fs-4 pb-2 border-bottom border-dark mb-2'>Report</h1>";
            },
            printFooter: function () {
                const timeStamp = luxon.DateTime.fromJSDate(new Date()).toFormat('LLLL dd, yyyy, hh:mm');

                return `<div class='w-100 mt-4 border-top pt-2 border-dark d-flex justify-content-between'>
                <div class="d-flex gap-2">
                    <a href="http://ai-rgus.com/" class='fs-6'>Ai-RGUS.COM</a>
                    <span class='fs-6'>${timeStamp}</span>
                </div>
            </div>`;
            },
            printFormatter: (tableHolder, table) => {
                $(table).css({ 'margin-top': '20px', 'margin-bottom': '20px' });
                $(table).find('thead th').css({ 'font-size': '11px' });
                $(table).find('tbody td').css({ 'font-size': '12px' });
            },
            printRowRange: 'all',
            // <editor-fold defaultstate="collapsed" desc=" columnsObj ">
            //#region -columnsObj
            columnsObj: function () {
                return [
                    {
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: '',
                        field: 'rowExpand',
                        width: 30,
                        print: false,
                        download: false,
                        iExcludeFromList: {src:0, cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown       
                        expandToKeyData : "gender",
                        
                        formatter: function (cell, formatterParams, onRendered) {                            
                            let el = CustomTabulator.cellF_rowExpand(cell, formatterParams, onRendered,expandRowWithNestedTable_Level1);
                            return el;
                        },   
                        increaseTblHeight: function(row){
                            $(CustomTabulator.TabulatorObj.element).attr('style', "height:1100px !important");
                        },
                        scrollRowTblAfterLoad: function(row){
                            // row.getElement().scrollIntoView({block:"end"});
                            CustomTabulator.TabulatorObj.scrollToRow(row, "top", false)

                            // this is not working
                            // row.getElement().scrollIntoView({block:"end",behavior:"smooth"});
                        }
                    },
                    {
                        formatter: 'rowSelection',
                        titleFormatter: 'rowSelection',
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: 'Select',
                        field: 'rowSelection',
                        width: 60,
                        print: false,
                        download: false,
                    },
                    {
                        title: 'ID',
                        field: 'id',
                        width: 80,
                        visible: this.DefaultHiddenColumns.includes('id')
                            ? false
                            : this.TableSettings.persist_column_visibility.enabled
                            ? !this.TableSettings.persist_column_visibility.hiddenColumns.includes('id')
                            : true,
                    },
                    {
                        title: 'Name',
                        field: 'name',
                        visible: this.DefaultHiddenColumns.includes('name')
                            ? false
                            : this.TableSettings.persist_column_visibility.enabled
                            ? !this.TableSettings.persist_column_visibility.hiddenColumns.includes('name')
                            : true,
                        width: 150,
                        editor: 'input',
                        headerFilter: 'input',
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        headerWordWrap: true,
                    },
                    {
                        title: 'Email',
                        field: 'email',
                        visible: this.DefaultHiddenColumns.includes('email')
                            ? false
                            : this.TableSettings.persist_column_visibility.enabled
                            ? !this.TableSettings.persist_column_visibility.hiddenColumns.includes('email')
                            : true,
                        // width: 170,
                        editor: 'input',
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                        validator: 'required',
                    },
                    {
                        title: 'Phone Number',
                        field: 'phone_number',
                        visible: this.DefaultHiddenColumns.includes('phone_number')
                            ? false
                            : this.TableSettings.persist_column_visibility.enabled
                            ? !this.TableSettings.persist_column_visibility.hiddenColumns.includes('phone_number')
                            : true,
                        width: 150,
                        editor: 'input',
                        headerSort: false,
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                    },
                    {
                        title: 'Location',
                        field: 'location',
                        visible: this.DefaultHiddenColumns.includes('location')
                            ? false
                            : this.TableSettings.persist_column_visibility.enabled
                            ? !this.TableSettings.persist_column_visibility.hiddenColumns.includes('location')
                            : true,
                        width: 130,
                        editor: 'input',
                        editable: this.isFieldEditable,
                        validator: 'required',
                        editorParams: {
                            autocomplete: 'true',
                            allowEmpty: true,
                            listOnEmpty: true,
                            valuesLookup: true,
                        },
                    },
                    {
                        title: 'Gender',
                        field: 'gender',
                        editor: 'list',
                        visible: this.DefaultHiddenColumns.includes('gender')
                            ? false
                            : this.TableSettings.persist_column_visibility.enabled
                            ? !this.TableSettings.persist_column_visibility.hiddenColumns.includes('gender')
                            : true,
                        editorParams: {
                            values: { male: 'Male', female: 'Female' },
                            clearable: true,
                            multiselect: true,
                            itemFormatter: function (label, value, item, element) {
                                return '<strong>' + label + ' </strong><br/><div>' + item.value + '</div>';
                            },
                        },
                        editable: this.isFieldEditable,
                        headerFilter: 'list',
                        headerFilterParams: {
                            values: { male: 'Male', female: 'Female' },
                            clearable: true,
                        },
                        validator: 'required',
                        width: 120,
                        formatterPrint: function printFormatter(cell, formatterParams, onRendered) {
                            iConsole(cell.getValue(), '');
                            return cell.getValue() == 'male' ? '1' : '0';
                        },
                        accessorDownload: function (value, data, type, params, column) {
                            return value == 'male' ? '1' : '0';
                        },
                    },
                    {
                        title: 'Favourite Color',
                        field: 'favourite',
                        editor: 'input',
                        editable: this.isFieldEditable,
                        headerFilter: 'list',
                        validator: 'required',
                        headerFilterParams: { valuesLookup: true, clearable: true },
                        width: 150,
                        visible: this.DefaultHiddenColumns.includes('favourite')
                            ? false
                            : this.TableSettings.persist_column_visibility.enabled
                            ? !this.TableSettings.persist_column_visibility.hiddenColumns.includes('favourite')
                            : true,
                    },
                    {
                        title: 'Date Of Birth',
                        field: 'dob',
                        hozAlign: 'center',
                        width: 200,
                        resizable: false,
                        editor: this.dateEditor,
                        editable: this.isFieldEditable,
                        headerFilter: this.headerDateEditor,
                        validator: 'required',
                        cssClass: 'dob-filter',
                        visible: this.DefaultHiddenColumns.includes('dob')
                            ? false
                            : this.TableSettings.persist_column_visibility.enabled
                            ? !this.TableSettings.persist_column_visibility.hiddenColumns.includes('dob')
                            : true,
                        formatter: function (cell, formatterParams, onRendered) {
                            return luxon.DateTime.fromJSDate(new Date(cell.getValue())).toFormat('dd/MM/yyyy');
                        },
                    },
                ];
            },
            //#endregion
            // </editor-fold>
            
            // <editor-fold defaultstate="collapsed" desc=" iTr_rowFormatter_ before|after ">
            //#region -iTr_rowFormatter_ before|after
            iTr_rowFormatter_before: function (row) {
//                iConsole("------------ Table obj's rowFormatter Before ------------  ");                
                return true;
            },
            iTr_rowFormatter_after: function (row){
//                iConsole("------------ Table obj's rowFormatter After ------------  ");
            },  
            //#region -exports
            // </editor-fold>                 
        },
        // <editor-fold defaultstate="collapsed" desc=" exports ">
        //#region -exports
        exports: {
            types: ['PDF', 'Excel', 'Copy', 'Print'],
            handlers: {
                pdf: function () {
                    const currentThis = this.TabulatorObj;
                    const { jsPDF } = window.jspdf;
                    const HiddenCols = getHiddenCols.call(currentThis);

                    const data = currentThis
                        .getData()
                        .map((row) => {
                            // delete rowSelection column
                            delete row.rowSelection;
                            Object.keys(row).forEach((key) => {
                                if (HiddenCols.includes(key)) {
                                    delete row[key];
                                }
                            });
                            if (row.gender) {
                                if (row.gender == 'male') {
                                    row.gender = `1`;
                                }
                                if (row.gender == 'female') {
                                    row.gender = `2`;
                                }
                            }
                            return row;
                        })
                        .map((row) => Object.values(row));

                    // Define columns
                    const columns = currentThis
                        .getColumns()
                        .map((column) => (column.isVisible() ? column.getDefinition() : null))
                        .filter((col) => col != null && col?.field != 'rowSelection');

                    // First pass: Create a temporary document to get the total page count
                    const tempDoc = new jsPDF();
                    tempDoc.autoTable({
                        head: [columns],
                        body: data,
                        startY: 0,
                    });
                    const totalPages = tempDoc.internal.getNumberOfPages();

                    // Second pass: Create the final document with footer
                    const finalDoc = new jsPDF();

                    const pageDimensions = finalDoc.internal.pageSize;
                    const pageHeight = pageDimensions.height ? pageDimensions.height : pageDimensions.getHeight();
                    const pageWidth = pageDimensions.width ? pageDimensions.width : pageDimensions.getWidth();

                    finalDoc.autoTable({
                        head: [columns],
                        body: data,
                        styles: {
                            fontSize: 7,
                        },
                        startY: 14,
                        didDrawPage: async function (data) {
                            const { left: leftMargin, right: rightMargin } = data.settings.margin;
                            const timeStamp = getCurrentTimestamp();

                            // add header
                            finalDoc.setFontSize(10);
                            const headerText = 'User Report';
                            const headerWidth = finalDoc.getTextWidth(headerText);
                            finalDoc.text(headerText, pageWidth / 2 - headerWidth / 2, 8);

                            // left part of the footer
                            let x;
                            let y;
                            let bottomY = pageHeight - 10;

                            const textWidth = finalDoc.getTextWidth('Power by');

                            finalDoc.text('Power by', leftMargin, bottomY);
                            finalDoc.setTextColor(blueColor);

                            const linkWidth = finalDoc.textWithLink('Ai-RGUS.com', (x = leftMargin + textWidth + 1), bottomY, {
                                url: 'https://ai-rgus.com/home',
                            });
                            finalDoc.setDrawColor(blueColor);
                            finalDoc.setLineWidth(0.2);
                            finalDoc.line(x, (y = pageHeight - 9), x + linkWidth, y);

                            finalDoc.setTextColor('#000');
                            finalDoc.text(timeStamp, x + linkWidth + 2, bottomY);

                            // right part of footer
                            const pageNoWidth = finalDoc.getTextWidth('Page ' + data.pageNumber + ' of ' + totalPages);
                            finalDoc.text(
                                'Page ' + data.pageNumber + ' of ' + totalPages,
                                pageWidth - pageNoWidth - rightMargin,
                                pageHeight - 10
                            );
                        },
                    });

                    finalDoc.save('table.pdf');
                },
                excel: async function () {
                    const currentThis = this;

                    let totalNumberOfRecords = 0;
                    await $.ajax({
                        url: currentThis.TabulatorObj.getAjaxUrl(),
                        method: 'GET',
                        dataType: 'json',
                        success: function (data) {
                            totalNumberOfRecords = data.total;
                        },
                        error: function (xhr, status, err) {
                            console.error('Error fetching data:', status, err);
                        },
                    });

                    await currentThis.TabulatorObj.setPageSize(totalNumberOfRecords);

                    await currentThis.TabulatorObj.download('xlsx', `${currentThis.localStorageKey}.xlsx`, {
                        title: 'Report',
                        orientation: 'portrait',
                    });
                },
                print: function () {
                    const currentThis = this;
                    currentThis.TabulatorObj.print(false, true, {});
                },
            },
        },
        //#endregion
        // </editor-fold>
    });
    CustomTabulator.TabulatorObj.on('tableBuilt', () => {
        // logic for tooltip adding in column headers
        const tooltipColumns = [
            { field: 'email', content: '<span>email</span>', customClass: 'tooltip-info tt_width-600', position: 'top' },
            { field: 'location', content: 'location content', position: 'bottom' },
            // { field: 'gender', content: 'location content',position:"bottom", customToolTipItem: $('.add-new-row-btn').clone(true).removeClass("add-new-row-btn") },
            { field: 'gender', content: $('div[tt_for-field=location]').clone(true).html(), position: 'bottom' },
        ];
        addTooltipToTheColumns(CustomTabulator, tooltipColumns);
    });

    $('[data-bs-toggle="tooltip"]').tooltip();
};
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" paginated-local loading table ">
//#region paginated-local loading table
let paginated_local_loading = () => {
    const tableId = 'paginated-local-table';
    const tableContainer = '.paginated-local-table-container';

    const CustomTabulator = new FeaturedTable('paginated-local', '#' + tableId, {
        tableContainer,
        tableLocalStorageKey: tableId,
        
        _tbl_format : "TMPL_tbl_toolbars_f01",
        _tbl_controlers : {            
            "TMPL_tbl_toolbars_f01":[{"tbl_read_mode":{"c": "me-2"}},{'rowEditing':{"c": "me-2"}},{'tbl_multy_purps':{"c": "me-2"}},{'tblSearch':{"c": "me-2", "input_w": 350}},{'tblColVisibility':{"c": "me-2"}},{'tblExport':{"c": "me-2"}},{'tblSettings':{"c": ""}}]
        },
        
        
        TabulatorInitOptions: {
            ajaxURL: 'php/iDBcode.php',
            // ajaxURL: 'https://dev1a.ai-rgus.com/php/users.php',
            masterFilterURL: 'https://dev1a.ai-rgus.com/php/master-filter.php',
            sortMode: 'local',
            filterMode: 'local',
            keybindings:{
                "scrollToStart":false,
                "scrollToEnd":false,
            },
            paginationSize: 1000,
            pagination: true,
            paginationMode: 'local',
            paginationInitialPage: 1,
            paginationCounter: 'rows',
            paginationSizeSelector: [25, 50, 100, 500, 1000, 2500, 5000, 10000, 25000],
            customSorters: () => {
                // enable sorting buttons                                

                $(`${tableContainer} .sort-by-btns button`).on('click', (e) => {
                    const sortBy = $(e.target).data('sort-by');
                    $(`${tableContainer} .sort-by-btns button`).removeClass("active")
                    if (sortBy == "reset") {
                        CustomTabulator.TabulatorObj.clearSort();
                    } else {
                        CustomTabulator.TabulatorObj.setSort(sortBy);
                        $(e.target).addClass("active");
                    }
                });
            },
            height: `${$('.table_w').height() - 250}px`, // we do not yet have the real table position or the table header element

            //  We do not use this option as it create other issue. We manage these thing ourself by creating custom checkbox and it's state
            //            selectableRows:true,
            //                rowHeader: {formatter:"rowSelection", titleFormatter:"rowSelection", titleFormatterParams:{
            //                    rowRange:"active" //only toggle the values of the active filtered rows
            //                }, hozAlign:"center", headerSort:false},

            // iTr_ajaxResponse: function (url, params, response) {
            //     //                iConsole("------------ iTr_ajaxResponse --------------", url, params, response);
            //     return response['dtRows'];
            // },
            
            iTr_add_new_row_before: function (fieldData) {
                // Because fieldData is an obj it is coming here by ref. any change will be avilable to the calling fn.
                fieldData.chbox = 1;
                fieldData.chbox2 = 0;
                fieldData.name = "New Data";
                return true;
            },
            iTr_add_new_row_after: function (fieldData) {},

            iTr_row_save_before: function (TabulatorObj, ...fieldData) {
                iConsole('------------ iTr_row_save_before --------------');
                iConsole({ fieldData }, TabulatorObj);
                return true;
            },

            iTr_row_save_after: function (newData) {
                $.ajax({
                    method: 'POST',
                    url: 'php/update-user.php',
                    dataType: 'json',
                    headers: {
                        csrftoken: _userStr,
                    },
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(newData),
                }).done((res) => {
                    if (res.success == 1) {
                        CustomTabulator.updateRowStatus();
                    } else {
                        alert(res.data?.error || 'Something went wrong');
                    }
                });
            },

            printHeader: function () {
                return "<h1 class='w-100 text-center fs-4 pb-2 border-bottom border-dark mb-2'>Report</h1>";
            },
            printFooter: function () {
                const timeStamp = luxon.DateTime.fromJSDate(new Date()).toFormat('LLLL dd, yyyy, hh:mm');

                return `<div class='w-100 mt-4 border-top pt-2 border-dark d-flex justify-content-between'>
                <div class="d-flex gap-2">
                    <a href="http://ai-rgus.com/" class='fs-6'>Ai-RGUS.COM</a>
                    <span class='fs-6'>${timeStamp}</span>
                </div>
            </div>`;
            },
            printFormatter: (tableHolder, table) => {
                $(table).css({ 'margin-top': '20px', 'margin-bottom': '20px' });
                $(table).find('thead th').css({ 'font-size': '11px' });
                $(table).find('tbody td').css({ 'font-size': '12px' });
            },
            printRowRange: 'all',
            // <editor-fold defaultstate="collapsed" desc=" columnsObj ">
            //#region -columnsObj
            columnsObj: function () {
                return [
                    {
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: '',
                        field: 'rowExpand',
                        width: 30,
                        print: false,
                        download: false,
                        iExcludeFromList: {src:0, cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown       
                        expandToKeyData : "gender",
                        
                        formatter: function (cell, formatterParams, onRendered) {                            
                            let el = CustomTabulator.cellF_rowExpand(cell, formatterParams, onRendered,expandPaginatedLocalRowWithNestedTable_Level1);
                            return el;
                        },   
                        increaseTblHeight: function(row){
                            $(CustomTabulator.TabulatorObj.element).attr('style', "height:1100px !important");
                        },
                        scrollRowTblAfterLoad: function(row){
                            // row.getElement().scrollIntoView({block:"end"});
                            CustomTabulator.TabulatorObj.scrollToRow(row, "top", false)

                            // this is not working
                            // row.getElement().scrollIntoView({block:"end",behavior:"smooth"});
                        }
                    },
                    {
                        formatter: 'rowSelection',
                        titleFormatter: 'rowSelection',
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: 'Select',
                        field: 'rowSelection',
                        width: 60,
                        print: false,
                        download: false,

                        titleFormatterParams: {
                            rowRange: 'active', //only toggle the values of the active filtered rows
                        },
                    },
                    {
                        title: 'ID',
                        field: 'id',
                        width: 60,
                        visible: isColumnVisible.call(this, 'id'),
                        iExcludeFromList: {cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                    {
                        title: 'Ch. box',
                        field: 'chbox',
                        visible: isColumnVisible.call(this, 'act'),
                        width: 90,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered, {TMPL_el_class: "form-select-sm"});                            
                            
                            function onSuccess() {                                
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);                            

                            return selectContainer[0];  
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            function onSuccess() {                                
                                success($('select', selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }

                            $('select', selectContainer).on('change blur', onSuccess);                            

                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;              
                            
                            if (editMode) {
                                setTimeout(() => {
                                    CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered);
                                });
                                return;
                            } 
                            else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }  
                        },                        
                        //#endregion
                        // </editor-fold>
                    },
                    {
                        title: 'Ch. box-2',
                        field: 'chbox2',
//                        field_1: 'isCurrentRow',
//                        field: 'isCurrentRow',
                        visible: isColumnVisible.call(this, 'chbox2'),
                        width: 100,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        // https://tabulator.info/docs/6.2/filter#func-custom                  
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered, {TMPL_el_class: "form-select-sm"});                            
                            
                            function onSuccess() {                                
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);                            

                            return selectContainer[0];  
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            $('select', selectContainer).on('change blur', function() {
                                success($(this).val());
                            });
                            
                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter      
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;              
                            
                            if (editMode) {
                                setTimeout(() => {
                                    CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered);
                                });
                                return;
                            } 
                            else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }  
                        },                        
                        //#endregion
                        // </editor-fold>
                    },

                    {
                        title: 'Name',
                        field: 'name',
                        visible: isColumnVisible.call(this, 'name'),
                        width: 150,
                        headerFilter: 'input',
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        headerWordWrap: true,
                        iExcludeFromList: {src:0}, 
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;     

                            if(editMode){
                                var editor = document.createElement('div');

                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered)
                                $(input).attr("list", "browsers")
                                $(input).prop("name","browser")
                                $(input).prop("id","browser")

                                $(editor).append(input)

                                $(editor).append(`
                                    <datalist id="browsers">
                                        <option value="Edge">
                                        <option value="Firefox">
                                        <option value="Chrome">
                                        <option value="Opera">
                                        <option value="Safari">
                                    </datalist>
                                `);
                          
                                return editor;
                            }
                            return cell.getValue()
                        },
                    },
                    {
                        title: 'Email',
                        field: 'email',
                        visible: isColumnVisible.call(this, 'email'),
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                        validator: 'required',
                        formatter: this.iTr_cell_editor_formatterEl,   
                        // 
                         cellMouseEnter: function (event, cell){
                             CustomTabulator.iTr_zoom_or_edit({}, "MouseEnter", event, cell);
                         },
//                         cellMouseLeave: function (event, cell) {
//                             CustomTabulator.iTr_zoom_or_edit({}, "MouseLeave", event, cell);
//                         },
                        cellDblClick: function (event, cell) {
                            // iConsole("cell", {args})
                            // CustomTabulator.TabulatorObj.getEditedCells()[0].
                            // for updating the cell value
                            // cell.setValue("sfdsffdsfsfdsfsdfdf")

                            // const row = cell.getRow();
                            // iConsole({ row });
                            // cell.setValue(row.getData()['phone_number']);

                            CustomTabulator.iTr_zoom_or_edit({  "popo_z" : {"class": "mb-0 close_on_scroll", style: "background-color: #e7e7e9;"}, }, "DblClick", event, cell);

                        },
                    },
                    {
                        title: 'Phone Number',
                        field: 'phone_number',
                        visible: isColumnVisible.call(this, 'phone_number'),
                        headerFilter:"input",
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: false,
                    },
                    {
                        title: 'Location',
                        field: 'location',
                        visible: isColumnVisible.call(this, 'location'),
                        width: 130,
                        headerFilter:(cell, onRendered, success, cancel)=>{          
                           const div = $(`<div class="location_header_select"></div>`);                            
                           return div[0];
                        },
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        validator: 'required',
                        editorParams: {
                            autocomplete: 'true',
                            allowEmpty: true,
                            listOnEmpty: true,
                            valuesLookup: true,
                        },
                    },
                    {
                        title: 'Gender',
                        field: 'gender',
                        // editor: 'list',
                        visible: isColumnVisible.call(this, 'gender'),
                        headerFilter:(cell, onRendered, success, cancel)=>{          
                            const div = $(`<div class="gender_header_select"></div>`);                            
                            return div[0];
                        },
                        editable: this.isFieldEditable,
                        // headerFilter: 'list',
                        headerFilterParams: {
                            values: { male: 'Male', female: 'Female' },
                            clearable: true,
                        },
                        validator: 'required',
                        width: 120,
                        formatterPrint: function printFormatter(cell, formatterParams, onRendered) {
                            iConsole(cell.getValue(), '');
                            return cell.getValue() == 'male' ? '1' : '0';
                        },
                        accessorDownload: function (value, data, type, params, column) {
                            return value == 'male' ? '1' : '0';
                        },
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;     

                            if(editMode){
                                var editor = document.createElement('div');

                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered)
                                $(input).attr("list", "gender-list")
                                $(input).prop("name","gender")
                                $(input).prop("id","gender")

                                $(editor).append(input)

                                $(editor).append(`
                                    <datalist id="gender-list">
                                        <option value="male">
                                        <option value="female">
                                    </datalist>
                                `);
                          
                                return editor;
                            }
                            return cell.getValue()
                        },
                    },
                    {
                        title: 'Favourite Color',
                        field: 'favourite',
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        headerFilter: 'list',
                        validator: 'required',
                        headerFilterParams: { valuesLookup: true, clearable: true },
                        width: 150,
                        visible: isColumnVisible.call(this, 'favourite'),
                    },
                    {
                        title: 'Date Of Birth',
                        field: 'dob',
                        hozAlign: 'center',
                        width: 200,
                        resizable: true,
                        // editor: this.dateEditor,
                        editable: this.isFieldEditable,
                        headerFilter: this.headerDateEditor,
                        validator: 'required',
                        cssClass: 'dob-filter',
                        visible: isColumnVisible.call(this, 'dob'),
                        formatter: this.iTr_cell_date_editor_formatterEl,
                        // formatter: function (cell, formatterParams, onRendered) {
                        //     // return luxon.DateTime.fromJSDate(new Date(cell.getValue())).toFormat('dd/MM/yyyy');
                        // },
                        
                    },
                    {
                        title: 'Manufacturers',
                        field: 'manuf',
                        visible: isColumnVisible.call(this, 'manuf'),
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: this.isFieldEditable,
                        headerFilter:"input"
                    },    
                    {
                        title: '',
                        field: '__dummy__',
                        visible: isColumnVisible.call(this, '__dummy__'),
                        width: 350,     
                        print: false,
                        download: false,
                        headerSort: false,        
                        iExcludeFromList: {src:0, cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown
                    },                
                ];
            },
            //#endregion
            // </editor-fold>            
            
            // <editor-fold defaultstate="collapsed" desc=" iTr_rowFormatter_ before|after ">
            //#region -iTr_rowFormatter_ before|after
            iTr_rowFormatter_before: function (row) {
//                iConsole("------------ Table obj's rowFormatter Before ------------  ");
                
                var data = row.getData();
//                if(data.isCurrentRow?.edit_mode || data.isCurrentRow?.edit_mode)
                $(row.getElement()).attr('data-location', data.location);

                if (data.location == 'India') {
                    row.getCell('location').getElement().style.color = 'blue';
                }
                if (data.location == 'China') {
                    $(row.getElement()).addClass('china');

                    // add custom html to the cell
                    row.getCell('location').getElement().innerHTML = `<a href='google.com'>${data.location}</a>`;
                }
                
                if (row.getData().isCurrentRow?.edit_mode) {
                    $(row.getElement()).removeClass('china');
                }                
                
                return true;                
            },
            iTr_rowFormatter_after: function (row){
//                iConsole("------------ Table obj's rowFormatter After ------------  ");
            },
            handleFieldUpdateValidation: function (fieldData) {
                iConsole({ fieldData }, this);
                return false;
            },

            iTr_afterSave: function (response) {
                console.clear();
                iConsole(this);
                iConsole('ITSIK: After save', response);
            }, 
            //#endregion
                        // </editor-fold>
        },
        // <editor-fold defaultstate="collapsed" desc=" exports ">
        //#region -exports
        exports: {
            types: ['PDF', 'Excel', 'Copy', 'Print'],
            handlers: {
                pdf: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    const { jsPDF } = window.jspdf;
                    const HiddenCols = getHiddenCols.call(currentThis);

                    const data = currentThis
                        .getData()
                        .map((row) => {
                            // delete rowSelection column
                            delete row.rowSelection;
                            Object.keys(row).forEach((key) => {
                                if (HiddenCols.includes(key)) {
                                    delete row[key];
                                }
                            });
                            if (row.gender) {
                                if (row.gender == 'male') {
                                    row.gender = `1`;
                                }
                                if (row.gender == 'female') {
                                    row.gender = `2`;
                                }
                            }
                            return row;
                        })
                        .map((row) => Object.values(row));

                    // Define columns
                    const columns = currentThis
                        .getColumns()
                        .map((column) => (column.isVisible() ? column.getDefinition() : null))
                        .filter((col) => col != null && col?.field != 'rowSelection');

                    // First pass: Create a temporary document to get the total page count
                    const tempDoc = new jsPDF();
                    tempDoc.autoTable({
                        head: [columns],
                        body: data,
                        startY: 0,
                    });
                    const totalPages = tempDoc.internal.getNumberOfPages();

                    // Second pass: Create the final document with footer
                    const finalDoc = new jsPDF();

                    const pageDimensions = finalDoc.internal.pageSize;
                    const pageHeight = pageDimensions.height ? pageDimensions.height : pageDimensions.getHeight();
                    const pageWidth = pageDimensions.width ? pageDimensions.width : pageDimensions.getWidth();
                    finalDoc.autoTable({
                        head: [columns],
                        body: data,
                        styles: {
                            fontSize: 7,
                        },
                        startY: 14,
                        didDrawPage: async function (data) {
                            const { left: leftMargin, right: rightMargin } = data.settings.margin;
                            const timeStamp = getCurrentTimestamp();

                            // add header
                            finalDoc.setFontSize(10);
                            const headerText = 'User Report';
                            const headerWidth = finalDoc.getTextWidth(headerText);
                            finalDoc.text(headerText, pageWidth / 2 - headerWidth / 2, 8);

                            // left part of the footer
                            let x;
                            let y;
                            let bottomY = pageHeight - 10;

                            const textWidth = finalDoc.getTextWidth('Power by');

                            finalDoc.text('Power by', leftMargin, bottomY);
                            finalDoc.setTextColor(blueColor);

                            const linkWidth = finalDoc.textWithLink('Ai-RGUS.com', (x = leftMargin + textWidth + 1), bottomY, {
                                url: 'https://ai-rgus.com/home',
                            });
                            finalDoc.setDrawColor(blueColor);
                            finalDoc.setLineWidth(0.2);
                            finalDoc.line(x, (y = pageHeight - 9), x + linkWidth, y);

                            finalDoc.setTextColor('#000');
                            finalDoc.text(timeStamp, x + linkWidth + 2, bottomY);

                            // right part of footer
                            const pageNoWidth = finalDoc.getTextWidth('Page ' + data.pageNumber + ' of ' + totalPages);
                            finalDoc.text(
                                'Page ' + data.pageNumber + ' of ' + totalPages,
                                pageWidth - pageNoWidth - rightMargin,
                                pageHeight - 10
                            );
                        },
                    });

                    finalDoc.save('table.pdf');
                },
                excel: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    currentThis.download('xlsx', `${currentThis.localStorageKey}.xlsx`, {
                        title: 'Report',
                        orientation: 'portrait'
                    });
                },
                print: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    currentThis.print(false, true, {});
                }
            }
        }
        //#endregion
        // </editor-fold>
    });
    CustomTabulator.TabulatorObj.on('tableBuilt', () => {
        // logic for tooltip adding in column headers
        const tooltipColumns = [
            { field: 'email', content: '<span>email</span>', customClass: 'tooltip-info tt_width-600', position: 'top' },
            { field: 'location', content: 'location content', position: 'bottom' },
            // { field: 'gender', content: 'location content',position:"bottom", customToolTipItem: $('.add-new-row-btn').clone(true).removeClass("add-new-row-btn") },
            { field: 'gender', content: $('div[tt_for-field=location]').clone(true).html(), position: 'bottom' },
        ];
        addTooltipToTheColumns(CustomTabulator, tooltipColumns);
    });
    $('[data-bs-toggle="tooltip"]').tooltip();
};
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" fn: expandRowWithNestedTable_Level1 ">
//#region -fn: expandRowWithNestedTable_Level1
function expandPaginatedLocalRowWithNestedTable_Level1(e, row) {    
    // increase the height of the table row is expanded
    const expand_row_def = row.getCell("rowExpand").getColumn().getDefinition();
    expand_row_def.increaseTblHeight?.();


    let btn = $(e.target).closest("button");
    $(btn).data('expanded', true).removeClass("btn-success").addClass("btn-danger");
    $("i", btn).removeClass("fa-plus").addClass("fa-minus");
    
    //    $(e.target).data('expanded', true);
    //    $(e.target).html('-');
    //    $(e.target).removeClass('bg-primary');
    //    $(e.target).addClass('bg-danger');

    // <button type="button" class="btnExpand btn btn-sm m-0 p-0 btn-danger"><i class="fas px-1 fa-minus"></i></button>
    // <button type="button" class="expand-btn btn btn-sm btn-success m-0 p-0"><i class="fas fa-plus px-1"></i></button>

    // <editor-fold defaultstate="collapsed" desc=" table's Data ">
    //#region -table's Data
    const tableId = row.getTable().element.id + `-nested-table-${row.getData().id}`;
    const tableContainer = `${tableId}-container`;

    // Add class to row element at the level
    $(row.getElement()).addClass("row-expanded-lvl-1");
    // +IR+ I addedd class="nested-table"
    // <div class='${tableContainer} table-container p-2 itr-tbl-nested-1' style='width: ${$(row.getElement()).closest(".itsik-table-container").width()}px' >
    // console.log({styling: $(row.getElement()).width()}, $(row.getElement()).closest(".itsik-table-container").width())
    console.log({width:10}, $(row.getElement()).closest(".tabulator-tableholder").width())
    $(row.getElement()).append(`
        <div class='${tableContainer} table-container p-2 itr-tbl-nested-1' style='width: ${$(row.getElement()).closest(".tabulator-tableholder").width() - 22}px' >
                <div class="table-header-toolbar_w px-2"></div>
                <div id="${tableId}" class="nested-table"></div>
            </div>`);

    // resize table width when it is resized
    iTr_listen_resize(row)


    const CustomTabulator = new FeaturedTable('paginated-local', '#' + tableId, {
        tableContainer: '.' + tableContainer,
        DefaultHiddenColumns: ['__chbox2'], // To activate this option
        _tbl_format : "TMPL_tbl_toolbars_f01",
        _tbl_controlers : {                    
            "TMPL_tbl_toolbars_f01":[{"tbl_read_mode":{"c": "me-2"}},{'rowEditing':{"c": "me-2"}},{'tblSearch':{"c": "me-2", "input_w": 350}},{'tblSettings':{"c": ""}}]
        },
        TabulatorInitOptions: {
            ajaxURL: 'php/iDBcode.php',
            sortMode: 'local',
            filterMode:"local",
            keybindings:{
                "scrollToStart":false,
                "scrollToEnd":false,
            },
            
            
           ajaxParams: function () {
               let params  = {
                   "recBY_fixedVal" : row.getData()[expand_row_def["expandToKeyData"]], // where fixedData = "female"  and defined once we expending a row from extandToDate
               };
               return params;
           },

            
            columnsObj: function () {
                // adding all other column configurations
                return [
                    {
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: '',
                        field: 'rowExpand',
                        width: 30,
                        print: false,
                        download: false,
                        iExcludeFromList: {src:0, cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown
                        expandToKeyData : "gender",
                                                
                        formatter: function (cell, formatterParams, onRendered) {                            
                            let el = CustomTabulator.cellF_rowExpand(cell, formatterParams, onRendered, expandRowWithNestedTable_Level2, row);
                            return el;
                        },   
                        increaseTblHeight: function(row){
                            $(CustomTabulator.TabulatorObj.element).attr('style', "height:800px !important");
                        },
                        scrollRowTblAfterLoad: function(row){
                            CustomTabulator.TabulatorObj.scrollToRow(row, "top", false)
                            // row.getElement().scrollIntoView({block:"end"});

                            // this is not working
                            // row.getElement().scrollIntoView({block:"end",behavior:"smooth"});
                        }
                    },
                    {
                        formatter: 'rowSelection',
                        titleFormatter: 'rowSelection',
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: 'Select',
                        field: 'rowSelection',
                        width: 60,
                        print: false,
                        download: false,

                        titleFormatterParams: {
                            rowRange: 'active', //only toggle the values of the active filtered rows
                        },
                    },
                    {
                        title: 'ID',
                        field: 'id',
                        width: 60,
                        visible: isColumnVisible.call(this, 'id'),
                        iExcludeFromList: {cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                    {
                        title: 'Ch. box',
                        field: 'chbox',
                        visible: isColumnVisible.call(this, 'act'),
                        width: 90,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered, {TMPL_el_class: "form-select-sm"});                            
                            
                            function onSuccess() {                                
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);                            

                            return selectContainer[0];  
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            function onSuccess() {                                
                                success($('select', selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }

                            $('select', selectContainer).on('change blur', onSuccess);                            

                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;              
                            
                            if (editMode) {
                                setTimeout(() => {
                                    CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered);
                                });
                                return;
                            } 
                            else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }  
                        },                        
                        //#endregion
                        // </editor-fold>
                    },
                    {
                        title: 'Ch. box-2',
                        field: 'chbox2',
            //                        field_1: 'isCurrentRow',
            //                        field: 'isCurrentRow',
                        visible: isColumnVisible.call(this, 'chbox2'),
                        width: 100,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        // https://tabulator.info/docs/6.2/filter#func-custom                  
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered, {TMPL_el_class: "form-select-sm"});                            
                            
                            function onSuccess() {                                
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);                            

                            return selectContainer[0];  
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            $('select', selectContainer).on('change blur', function() {
                                success($(this).val());
                            });
                            
                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter      
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;              
                            
                            if (editMode) {
                                setTimeout(() => {
                                    CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered);
                                });
                                return;
                            } 
                            else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }  
                        },                        
                        //#endregion
                        // </editor-fold>
                    },

                    {
                        title: 'Name',
                        field: 'name',
                        visible: isColumnVisible.call(this, 'name'),
                        width: 150,
                        headerFilter: 'input',
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        headerWordWrap: true,
                        iExcludeFromList: {src:0}, 
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;     

                            if(editMode){
                                var editor = document.createElement('div');

                                // +IR+ change to jquery  also prop is attr
                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered);
                                $(input).attr("list", "browsers");
                                $(input).prop("name","browser");
                                $(input).prop("id","browser");

                                $(editor).append(input);

                                $(editor).append(`
                                    <datalist id="browsers">
                                        <option value="Edge">
                                        <option value="Firefox">
                                        <option value="Chrome">
                                        <option value="Opera">
                                        <option value="Safari">
                                    </datalist>
                                `);
                            
                                return editor;
                            }
                            return cell.getValue()
                        },
                    },
                    {
                        title: 'Email',
                        field: 'email',
                        visible: isColumnVisible.call(this, 'email'),
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                        validator: 'required',
                        formatter: this.iTr_cell_editor_formatterEl,   
                        // 
                            cellMouseEnter: function (event, cell){
                                CustomTabulator.iTr_zoom_or_edit({}, "MouseEnter", event, cell);
                            },
            //                         cellMouseLeave: function (event, cell) {
            //                             CustomTabulator.iTr_zoom_or_edit({}, "MouseLeave", event, cell);
            //                         },
                        cellDblClick: function (event, cell) {
                            // iConsole("cell", {args})
                            // CustomTabulator.TabulatorObj.getEditedCells()[0].
                            // for updating the cell value
                            // cell.setValue("sfdsffdsfsfdsfsdfdf")

                            // const row = cell.getRow();
                            // iConsole({ row });
                            // cell.setValue(row.getData()['phone_number']);

                            CustomTabulator.iTr_zoom_or_edit({  "popo_z" : {"class": "mb-0 close_on_scroll", style: "background-color: #e7e7e9;"}, }, "DblClick", event, cell);

                        },
                    },
                    {
                        title: 'Phone Number',
                        field: 'phone_number',
                        visible: isColumnVisible.call(this, 'phone_number'),
                        headerFilter:"input",
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: this.isFieldEditable,
                    },
                    {
                        title: 'Location',
                        field: 'location',
                        visible: isColumnVisible.call(this, 'location'),
                        width: 130,
                        headerFilter:(cell, onRendered, success, cancel)=>{          
                            const div = $(`<div class="location_header_select"></div>`);                            
                            return div[0];
                        },
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        validator: 'required',
                        editorParams: {
                            autocomplete: 'true',
                            allowEmpty: true,
                            listOnEmpty: true,
                            valuesLookup: true,
                        },
                    },
                    {
                        title: 'Gender',
                        field: 'gender',
                        // editor: 'list',
                        visible: isColumnVisible.call(this, 'gender'),
                        headerFilter:(cell, onRendered, success, cancel)=>{          
                            const div = $(`<div class="gender_header_select"></div>`);                            
                            return div[0];
                        },
                        editable: this.isFieldEditable,
                        // headerFilter: 'list',
                        headerFilterParams: {
                            values: { male: 'Male', female: 'Female' },
                            clearable: true,
                        },
                        validator: 'required',
                        width: 120,
                        formatterPrint: function printFormatter(cell, formatterParams, onRendered) {
                            iConsole(cell.getValue(), '');
                            return cell.getValue() == 'male' ? '1' : '0';
                        },
                        accessorDownload: function (value, data, type, params, column) {
                            return value == 'male' ? '1' : '0';
                        },
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;     

                            if(editMode){
                                var editor = document.createElement('div');

                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered)
                                $(input).attr("list", "gender-list")
                                $(input).prop("name","gender")
                                $(input).prop("id","gender")

                                $(editor).append(input)

                                $(editor).append(`
                                    <datalist id="gender-list">
                                        <option value="male">
                                        <option value="female">
                                    </datalist>
                                `);
                            
                                return editor;
                            }
                            return cell.getValue()
                        },
                    },
                    {
                        title: 'Favourite Color',
                        field: 'favourite',
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        headerFilter: 'list',
                        validator: 'required',
                        headerFilterParams: { valuesLookup: true, clearable: true },
                        width: 150,
                        visible: isColumnVisible.call(this, 'favourite'),
                    },
                    {
                        title: 'Date Of Birth',
                        field: 'dob',
                        hozAlign: 'center',
                        width: 200,
                        resizable: true,
                        // editor: this.dateEditor,
                        editable: this.isFieldEditable,
                        headerFilter: this.headerDateEditor,
                        validator: 'required',
                        cssClass: 'dob-filter',
                        visible: isColumnVisible.call(this, 'dob'),
                        formatter: this.iTr_cell_date_editor_formatterEl,
                        // formatter: function (cell, formatterParams, onRendered) {
                        //     // return luxon.DateTime.fromJSDate(new Date(cell.getValue())).toFormat('dd/MM/yyyy');
                        // },
                        
                    },
                    {
                        title: 'Manufacturers',
                        field: 'manuf',
                        visible: isColumnVisible.call(this, 'manuf'),
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: this.isFieldEditable,
                        headerFilter:"input"
                    },    
                    {
                        title: '',
                        field: '__dummy__',
                        visible: isColumnVisible.call(this, '__dummy__'),
                        width: 50,     
                        print: false,
                        download: false,
                        headerSort: false,        
                        iExcludeFromList: {src:0, cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown
                    },                
                ]
            },
        },
        exports: {
            types: ['PDF', 'Excel', 'Copy', 'Print'],
            handlers: {
                pdf: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    const { jsPDF } = window.jspdf;
                    const HiddenCols = getHiddenCols.call(currentThis);

                    const data = currentThis
                        .getData()
                        .map((row) => {
                            // delete rowSelection column
                            delete row.rowSelection;
                            Object.keys(row).forEach((key) => {
                                if (HiddenCols.includes(key)) {
                                    delete row[key];
                                }
                            });
                            if (row.gender) {
                                if (row.gender == 'male') {
                                    row.gender = `1`;
                                }
                                if (row.gender == 'female') {
                                    row.gender = `2`;
                                }
                            }
                            return row;
                        })
                        .map((row) => Object.values(row));

                    // Define columns
                    const columns = currentThis
                        .getColumns()
                        .map((column) => (column.isVisible() ? column.getDefinition() : null))
                        .filter((col) => col != null && col?.field != 'rowSelection');

                    // First pass: Create a temporary document to get the total page count
                    const tempDoc = new jsPDF();
                    tempDoc.autoTable({
                        head: [columns],
                        body: data,
                        startY: 0,
                    });
                    const totalPages = tempDoc.internal.getNumberOfPages();

                    // Second pass: Create the final document with footer
                    const finalDoc = new jsPDF();

                    const pageDimensions = finalDoc.internal.pageSize;
                    const pageHeight = pageDimensions.height ? pageDimensions.height : pageDimensions.getHeight();
                    const pageWidth = pageDimensions.width ? pageDimensions.width : pageDimensions.getWidth();

                    finalDoc.autoTable({
                        head: [columns],
                        body: data,
                        styles: {
                            fontSize: 7,
                        },
                        startY: 14,
                        didDrawPage: async function (data) {
                            const { left: leftMargin, right: rightMargin } = data.settings.margin;
                            const timeStamp = getCurrentTimestamp();

                            // add header
                            finalDoc.setFontSize(10);
                            const headerText = 'User Report';
                            const headerWidth = finalDoc.getTextWidth(headerText);
                            finalDoc.text(headerText, pageWidth / 2 - headerWidth / 2, 8);

                            // left part of the footer
                            let x;
                            let y;
                            let bottomY = pageHeight - 10;

                            const textWidth = finalDoc.getTextWidth('Power by');

                            finalDoc.text('Power by', leftMargin, bottomY);
                            finalDoc.setTextColor(blueColor);

                            const linkWidth = finalDoc.textWithLink('Ai-RGUS.com', (x = leftMargin + textWidth + 1), bottomY, {
                                url: 'https://ai-rgus.com/home',
                            });
                            finalDoc.setDrawColor(blueColor);
                            finalDoc.setLineWidth(0.2);
                            finalDoc.line(x, (y = pageHeight - 9), x + linkWidth, y);

                            finalDoc.setTextColor('#000');
                            finalDoc.text(timeStamp, x + linkWidth + 2, bottomY);

                            // right part of footer
                            const pageNoWidth = finalDoc.getTextWidth('Page ' + data.pageNumber + ' of ' + totalPages);
                            finalDoc.text(
                                'Page ' + data.pageNumber + ' of ' + totalPages,
                                pageWidth - pageNoWidth - rightMargin,
                                pageHeight - 10
                            );
                        },
                    });

                    finalDoc.save('table.pdf');
                },
                excel: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    currentThis.download('xlsx', `${currentThis.localStorageKey}.xlsx`, {
                        title: 'Report',
                        orientation: 'portrait'
                    });
                },
                print: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    currentThis.print(false, true, {});
                }
            }
        }
    });

    CustomTabulator.TabulatorObj.on('dataLoading', () => {
        // scroll the row into view
        expand_row_def.scrollRowTblAfterLoad?.(row);
    });

    CustomTabulator.TabulatorObj.on('tableBuilt', () => {
        // logic for tooltip adding in column headers        
        const tooltipColumns = [
            { field: 'email', content: '<span>email</span>', customClass: 'tooltip-info tt_width-600', position: 'top' },
            { field: 'location', content: 'location content', position: 'bottom' },
            // { field: 'gender', content: 'location content',position:"bottom", customToolTipItem: $('.add-new-row-btn').clone(true).removeClass("add-new-row-btn") },
            { field: 'gender', content: $('div[tt_for-field=location]').clone(true).html(), position: 'bottom' },
        ];
        addTooltipToTheColumns(CustomTabulator, tooltipColumns);        
                
        // <editor-fold defaultstate="collapsed" desc=" for header filter in table - Location dropdown ">
        //#region -for header filter in table - Location dropdown
        let uniqueLocations = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.location] = (acc[obj.location] || 0) + 1; 
            return acc;
        }, {});        
        let uniqueLocationsArray = Object.entries(uniqueLocations).map(([location, count]) => {
            return { field: location, title: `${location} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueLocationsArray.sort((a, b) => a.field.localeCompare(b.field));
        
        const dropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueLocationsArray, exludeBy: "src" },
            TabulatorObj : CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const location_nm = $(e.target).attr("value");

                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            row.select();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            row.deselect();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.location] = (acc[obj.location] || 0) + 1; 
                    return acc;
                }, {});

                 // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button', dropdown).attr("id");                    
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected' ,drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);                        
                });

                return true;                
            }
            
        });
        // $(".location_header_select").append(dropdown);
        $($(".location_header_select", $(CustomTabulator.TabulatorObj.element.closest(".table-container")))[0]).append(dropdown);

        //#endregion
                // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" for header filter in table - Gender dropdown ">
        //#region -for header filter in table - gender dropdown
        let uniqueGender = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
            return acc;
        }, {});
        
        let uniqueGenderArray = Object.entries(uniqueGender).map(([gender, count]) => {
            return { field: gender, title: `${gender} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueGenderArray.sort((a, b) => a.field.localeCompare(b.field));


        const genderDropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueGenderArray, exludeBy: "src" },
            TabulatorObj: CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const gend = $(e.target).attr("value");

                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            row.select();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            row.deselect();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
                    return acc;
                }, {});
                
                // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button' ,genderDropdown).attr("id");
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected',drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);
                });

                return true;        
            }            
        });
        // $(".gender_header_select").append(genderDropdown);
        $($(".gender_header_select", $(CustomTabulator.TabulatorObj.element.closest(".table-container")))[0]).append(genderDropdown);

        //#endregion
        // </editor-fold>
    });
    $('[data-bs-toggle="tooltip"]').tooltip();
    CustomTabulator.TabulatorObj.on('scrollVertical',()=> {
        $.each($(".popover .close_on_scroll"), function(inx, el){
                $(el).closest(".popover").remove();
        });
    });
      
    //#endregion
    // </editor-fold>    
}
//#endregion
// </editor-fold>
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" Itsik table-local ">
//#region Itsik table-local
let itsik_local = () => {
    const tableId = 'itsik-table';
    const tableContainer = '.itsik-table-container';

    const CustomTabulator = new FeaturedTable('paginated-local', '#' + tableId, {
        tableContainer,
        tableLocalStorageKey: tableId,
        DefaultHiddenColumns: ['__chbox2'], // To activate this option
//        _tbl_format : "TMPL_tbl_toolbars_f01",
//        _tbl_controlers : {                    
//            "TMPL_tbl_toolbars_f01":[{"tbl_read_mode":{"c": "me-2"}},{'rowEditing':{"c": "me-2"}},{'tbl_multy_purps':{"c": "me-2"}},{'tblSearch':{"c": "me-2", "input_w": 350}},{'tblColVisibility':{"c": "me-2"}},{'tblExport':{"c": "me-2"}},{'tblSettings':{"c": ""}}]
//        },
        TabulatorInitOptions: {
            ajaxURL: 'php/iDBcode.php',
            // ajaxURL: 'https://dev1a.ai-rgus.com/php/users.php',
            masterFilterURL: 'https://dev1a.ai-rgus.com/php/master-filter.php', // +IR+ what is it and when we use it?
            rowHeight:40,

            sortMode: 'local',
            filterMode: 'local',
            keybindings:{
                "scrollToStart":false,
                "scrollToEnd":false,
            },
            customSorters: () => {
                // enable sorting buttons                                

                $(`${tableContainer} .sort-by-btns button`).on('click', (e) => {
                    const sortBy = $(e.target).data('sort-by');
                    $(`${tableContainer} .sort-by-btns button`).removeClass("active")
                    if (sortBy == "reset") {
                        CustomTabulator.TabulatorObj.clearSort();
                    } else {
                        CustomTabulator.TabulatorObj.setSort(sortBy);
                        $(e.target).addClass("active");
                    }
                });
            },
            pagination: false,
            height: `${$('.table_w').height() - 250}px`, // we do not yet have the real table position or the table header element

            //  We do not use this option as it create other issue. We manage these thing ourself by creating custom checkbox and it's state
            //            selectableRows:true,
            //                rowHeader: {formatter:"rowSelection", titleFormatter:"rowSelection", titleFormatterParams:{
            //                    rowRange:"active" //only toggle the values of the active filtered rows
            //                }, hozAlign:"center", headerSort:false},

            // iTr_ajaxResponse: function (url, params, response) {
            //     //                iConsole("------------ iTr_ajaxResponse --------------", url, params, response);
            //     return response['dtRows'];
            // },
            
            iTr_add_new_row_before: function (fieldData) {
                // Because fieldData is an obj it is coming here by ref. any change will be avilable to the calling fn.
                fieldData.chbox = 1;
                fieldData.chbox2 = 0;
                fieldData.name = "New Data";
                return true;
            },
            iTr_add_new_row_after: function (fieldData) {},

            iTr_row_save_before: function (TabulatorObj, ...fieldData) {
                iConsole('------------ iTr_row_save_before --------------');
                iConsole({ fieldData }, TabulatorObj);
                return true;
            },

            iTr_row_save_after: function (newData) {
                $.ajax({
                    method: 'POST',
                    url: 'php/update-user.php',
                    dataType: 'json',
                    headers: {
                        csrftoken: _userStr,
                    },
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(newData),
                }).done((res) => {
                    if (res.success == 1) {
                        CustomTabulator.updateRowStatus();
                    } else {
                        alert(res.data?.error || 'Something went wrong');
                    }
                });
            },

            printHeader: function () {
                return "<h1 class='w-100 text-center fs-4 pb-2 border-bottom border-dark mb-2'>Report</h1>";
            },
            printFooter: function () {
                const timeStamp = luxon.DateTime.fromJSDate(new Date()).toFormat('LLLL dd, yyyy, hh:mm');

                return `<div class='w-100 mt-4 border-top pt-2 border-dark d-flex justify-content-between'>
                <div class="d-flex gap-2">
                    <a href="http://ai-rgus.com/" class='fs-6'>Ai-RGUS.COM</a>
                    <span class='fs-6'>${timeStamp}</span>
                </div>
            </div>`;
            },
            printFormatter: (tableHolder, table) => {
                $(table).css({ 'margin-top': '20px', 'margin-bottom': '20px' });
                $(table).find('thead th').css({ 'font-size': '11px' });
                $(table).find('tbody td').css({ 'font-size': '12px' });
            },
            printRowRange: 'all',
              
            // <editor-fold defaultstate="collapsed" desc=" columnsObj ">
            //#region columnsObj
            columnsObj: function () {
                return [
                    {
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: '',
                        field: 'rowExpand',
                        width: 30,
                        print: false,
                        download: false,
                        iExcludeFromList: {src:0, cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown       
                        expandToKeyData : "gender",
                        
                        formatter: function (cell, formatterParams, onRendered) {                            
                            let el = CustomTabulator.cellF_rowExpand(cell, formatterParams, onRendered,expandRowWithNestedTable_Level1);
                            return el;
                        },   
                        increaseTblHeight: function(row){
                            $(CustomTabulator.TabulatorObj.element).attr('style', "height:1100px !important");
                        },
                        scrollRowTblAfterLoad: function(row){
                            // row.getElement().scrollIntoView({block:"end"});
                            CustomTabulator.TabulatorObj.scrollToRow(row, "top", false)

                            // this is not working
                            // row.getElement().scrollIntoView({block:"end",behavior:"smooth"});
                        }
                    },
                    {
                        formatter: 'rowSelection',
                        titleFormatter: 'rowSelection',
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: 'Select',
                        field: 'rowSelection',
                        width: 60,
                        print: false,
                        download: false,

                        titleFormatterParams: {
                            rowRange: 'active', //only toggle the values of the active filtered rows
                        },
                    },
                    {
                        title: 'ID',
                        field: 'id',
                        width: 60,
                        visible: isColumnVisible.call(this, 'id'),
                        iExcludeFromList: {cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                    {
                        title: 'Ch. box',
                        field: 'chbox',
                        visible: isColumnVisible.call(this, 'act'),
                        width: 90,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered, {TMPL_el_class: "form-select-sm"});                            
                            
                            function onSuccess() {                                
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);                            

                            return selectContainer[0];  
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            function onSuccess() {                                
                                success($('select', selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }

                            $('select', selectContainer).on('change blur', onSuccess);                            

                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;              
                            
                            if (editMode) {
                                setTimeout(() => {
                                    CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered);
                                });
                                return;
                            } 
                            else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }  
                        },                        
                        //#endregion
                        // </editor-fold>
                    },
                    {
                        title: 'Ch. box-2',
                        field: 'chbox2',
//                        field_1: 'isCurrentRow',
//                        field: 'isCurrentRow',
                        visible: isColumnVisible.call(this, 'chbox2'),
                        width: 100,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        // https://tabulator.info/docs/6.2/filter#func-custom                  
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered, {TMPL_el_class: "form-select-sm"});                            
                            
                            function onSuccess() {                                
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);                            

                            return selectContainer[0];  
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            $('select', selectContainer).on('change blur', function() {
                                success($(this).val());
                            });
                            
                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter      
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;              
                            
                            if (editMode) {
                                setTimeout(() => {
                                    CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered);
                                });
                                return;
                            } 
                            else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }  
                        },                        
                        //#endregion
                        // </editor-fold>
                    },

                    {
                        title: 'Name',
                        field: 'name',
                        visible: isColumnVisible.call(this, 'name'),
                        width: 150,
                        headerFilter: 'input',
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        headerWordWrap: true,
                        _iExcludeFromList: {src:0}, 
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;     

                            if(editMode){
                                var editor = document.createElement('div');

                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered)
                                $(input).attr("list", "browsers")
                                $(input).prop("name","browser")
                                $(input).prop("id","browser")

                                $(editor).append(input)

                                $(editor).append(`
                                    <datalist id="browsers">
                                        <option value="Edge">
                                        <option value="Firefox">
                                        <option value="Chrome">
                                        <option value="Opera">
                                        <option value="Safari">
                                    </datalist>
                                `);
                          
                                return editor;
                            }
                            return cell.getValue()
                        },
                    },
                    {
                        title: 'Email',
                        field: 'email',
                        visible: isColumnVisible.call(this, 'email'),
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                        validator: 'required',
                        formatter: this.iTr_cell_editor_formatterEl,   
                        // 
                         cellMouseEnter: function (event, cell){
                             CustomTabulator.iTr_zoom_or_edit({}, "MouseEnter", event, cell);
                         },
//                         cellMouseLeave: function (event, cell) {
//                             CustomTabulator.iTr_zoom_or_edit({}, "MouseLeave", event, cell);
//                         },
                        cellDblClick: function (event, cell) {
                            // iConsole("cell", {args})
                            // CustomTabulator.TabulatorObj.getEditedCells()[0].
                            // for updating the cell value
                            // cell.setValue("sfdsffdsfsfdsfsdfdf")

                            // const row = cell.getRow();
                            // iConsole({ row });
                            // cell.setValue(row.getData()['phone_number']);

                            CustomTabulator.iTr_zoom_or_edit({  "popo_z" : {"class": "mb-0 close_on_scroll", style: "background-color: #e7e7e9;"}, }, "DblClick", event, cell);

                        },
                    },
                    {
                        title: 'Phone Number',
                        field: 'phone_number',
                        visible: isColumnVisible.call(this, 'phone_number'),
                        headerFilter:"input",
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: false,
                    },
                    {
                        title: 'Location',
                        field: 'location',
                        visible: isColumnVisible.call(this, 'location'),
                        width: 130,
                        headerFilter:(cell, onRendered, success, cancel)=>{          
                           const div = $(`<div class="location_header_select"></div>`);                            
                           return div[0];
                        },
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        validator: 'required',
                        editorParams: {
                            autocomplete: 'true',
                            allowEmpty: true,
                            listOnEmpty: true,
                            valuesLookup: true,
                        },
                    },
                    {
                        title: 'Gender',
                        field: 'gender',
                        // editor: 'list',
                        visible: isColumnVisible.call(this, 'gender'),
                        headerFilter:(cell, onRendered, success, cancel)=>{          
                            const div = $(`<div class="gender_header_select"></div>`);                            
                            return div[0];
                        },
                        editable: this.isFieldEditable,
                        // headerFilter: 'list',
                        headerFilterParams: {
                            values: { male: 'Male', female: 'Female' },
                            clearable: true,
                        },
                        validator: 'required',
                        width: 120,
                        formatterPrint: function printFormatter(cell, formatterParams, onRendered) {
                            iConsole(cell.getValue(), '');
                            return cell.getValue() == 'male' ? '1' : '0';
                        },
                        accessorDownload: function (value, data, type, params, column) {
                            return value == 'male' ? '1' : '0';
                        },
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;     

                            if(editMode){
                                var editor = document.createElement('div');

                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered)
                                $(input).attr("list", "gender-list")
                                $(input).prop("name","gender")
                                $(input).prop("id","gender")

                                $(editor).append(input)

                                $(editor).append(`
                                    <datalist id="gender-list">
                                        <option value="male">
                                        <option value="female">
                                    </datalist>
                                `);
                          
                                return editor;
                            }
                            return cell.getValue()
                        },
                    },
                    {
                        title: 'Favourite Color',
                        field: 'favourite',
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        headerFilter: 'list',
                        validator: 'required',
                        headerFilterParams: { valuesLookup: true, clearable: true },
                        width: 150,
                        visible: isColumnVisible.call(this, 'favourite'),
                    },
                    {
                        title: 'Date Of Birth',
                        field: 'dob',
                        hozAlign: 'center',
                        width: 200,
                        resizable: true,
                        // editor: this.dateEditor,
                        editable: this.isFieldEditable,
                        headerFilter: this.headerDateEditor,
                        validator: 'required',
                        cssClass: 'dob-filter',
                        visible: isColumnVisible.call(this, 'dob'),
                        formatter: this.iTr_cell_date_editor_formatterEl,
                        // formatter: function (cell, formatterParams, onRendered) {
                        //     // return luxon.DateTime.fromJSDate(new Date(cell.getValue())).toFormat('dd/MM/yyyy');
                        // },
                        
                    },
                    {
                        title: 'Manufacturers',
                        field: 'manuf',
                        visible: isColumnVisible.call(this, 'manuf'),
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: this.isFieldEditable,
                        headerFilter:"input"
                    },    
                    {
                        title: '',
                        field: '__dummy__',
                        visible: isColumnVisible.call(this, '__dummy__'),
                        width: 350,     
                        print: false,
                        download: false,
                        headerSort: false,        
                        iExcludeFromList: {src:0, cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown
                    },                
                ];
            },
            //#endregion
            // </editor-fold>            
            
            // <editor-fold defaultstate="collapsed" desc=" iTr_rowFormatter_ before|after ">
            //#region -iTr_rowFormatter_ before|after
            iTr_rowFormatter_before: function (row) {
//                iConsole("------------ Table obj's rowFormatter Before ------------  ");
                
                var data = row.getData();
//                if(data.isCurrentRow?.edit_mode || data.isCurrentRow?.edit_mode)
                $(row.getElement()).attr('data-location', data.location);

                if (data.location == 'India') {
                    row.getCell('location').getElement().style.color = 'blue';
                }
                if (data.location == 'China') {
                    $(row.getElement()).addClass('china');

                    // add custom html to the cell
                    row.getCell('location').getElement().innerHTML = `<a href='google.com'>${data.location}</a>`;
                }
                
                if (row.getData().isCurrentRow?.edit_mode) {
                    $(row.getElement()).removeClass('china');
                }                
                
                return true;                
            },
            iTr_rowFormatter_after: function (row){
//                iConsole("------------ Table obj's rowFormatter After ------------  ");
            },
            handleFieldUpdateValidation: function (fieldData) {
                iConsole({ fieldData }, this);
                return false;
            },

            iTr_afterSave: function (response) {
                console.clear();
                iConsole(this);
                iConsole('ITSIK: After save', response);
            }, 
            //#endregion
                        // </editor-fold>
        },
        // <editor-fold defaultstate="collapsed" desc=" exports ">
        //#region -exports
        exports: {
            types: ['PDF', 'Excel', 'Copy', 'Print'],
            handlers: {
                pdf: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    const { jsPDF } = window.jspdf;
                    const HiddenCols = getHiddenCols.call(currentThis);

                    const data = currentThis
                        .getData()
                        .map((row) => {
                            // delete rowSelection column
                            delete row.rowSelection;
                            Object.keys(row).forEach((key) => {
                                if (HiddenCols.includes(key)) {
                                    delete row[key];
                                }
                            });
                            if (row.gender) {
                                if (row.gender == 'male') {
                                    row.gender = `1`;
                                }
                                if (row.gender == 'female') {
                                    row.gender = `2`;
                                }
                            }
                            return row;
                        })
                        .map((row) => Object.values(row));

                    // Define columns
                    const columns = currentThis
                        .getColumns()
                        .map((column) => (column.isVisible() ? column.getDefinition() : null))
                        .filter((col) => col != null && col?.field != 'rowSelection');

                    // First pass: Create a temporary document to get the total page count
                    const tempDoc = new jsPDF();
                    tempDoc.autoTable({
                        head: [columns],
                        body: data,
                        startY: 0,
                    });
                    const totalPages = tempDoc.internal.getNumberOfPages();

                    // Second pass: Create the final document with footer
                    const finalDoc = new jsPDF();

                    const pageDimensions = finalDoc.internal.pageSize;
                    const pageHeight = pageDimensions.height ? pageDimensions.height : pageDimensions.getHeight();
                    const pageWidth = pageDimensions.width ? pageDimensions.width : pageDimensions.getWidth();
                    finalDoc.autoTable({
                        head: [columns],
                        body: data,
                        styles: {
                            fontSize: 7,
                        },
                        startY: 14,
                        didDrawPage: async function (data) {
                            const { left: leftMargin, right: rightMargin } = data.settings.margin;
                            const timeStamp = getCurrentTimestamp();

                            // add header
                            finalDoc.setFontSize(10);
                            const headerText = 'User Report';
                            const headerWidth = finalDoc.getTextWidth(headerText);
                            finalDoc.text(headerText, pageWidth / 2 - headerWidth / 2, 8);

                            // left part of the footer
                            let x;
                            let y;
                            let bottomY = pageHeight - 10;

                            const textWidth = finalDoc.getTextWidth('Power by');

                            finalDoc.text('Power by', leftMargin, bottomY);
                            finalDoc.setTextColor(blueColor);

                            const linkWidth = finalDoc.textWithLink('Ai-RGUS.com', (x = leftMargin + textWidth + 1), bottomY, {
                                url: 'https://ai-rgus.com/home',
                            });
                            finalDoc.setDrawColor(blueColor);
                            finalDoc.setLineWidth(0.2);
                            finalDoc.line(x, (y = pageHeight - 9), x + linkWidth, y);

                            finalDoc.setTextColor('#000');
                            finalDoc.text(timeStamp, x + linkWidth + 2, bottomY);

                            // right part of footer
                            const pageNoWidth = finalDoc.getTextWidth('Page ' + data.pageNumber + ' of ' + totalPages);
                            finalDoc.text(
                                'Page ' + data.pageNumber + ' of ' + totalPages,
                                pageWidth - pageNoWidth - rightMargin,
                                pageHeight - 10
                            );
                        },
                    });

                    finalDoc.save('table.pdf');
                },
                excel: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    currentThis.download('xlsx', `${currentThis.localStorageKey}.xlsx`, {
                        title: 'Report',
                        orientation: 'portrait'
                    });
                },
                print: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    currentThis.print(false, true, {});
                }
            }
        }
        //#endregion
        // </editor-fold>
    });
    window.tempTable = CustomTabulator; // +info+ adding to global object to access it from developer tools and anywhere else in the code for debugging

    CustomTabulator.TabulatorObj.on('tableBuilt', () => {
        // logic for tooltip adding in column headers        
        const tooltipColumns = [
            { field: 'email', content: '<span>email</span>', customClass: 'tooltip-info tt_width-600', position: 'top' },
            { field: 'location', content: 'location content', position: 'bottom' },
            // { field: 'gender', content: 'location content',position:"bottom", customToolTipItem: $('.add-new-row-btn').clone(true).removeClass("add-new-row-btn") },
            { field: 'gender', content: $('div[tt_for-field=location]').clone(true).html(), position: 'bottom' },
        ];
        addTooltipToTheColumns(CustomTabulator, tooltipColumns);        
                
        // <editor-fold defaultstate="collapsed" desc=" for header filter in table - Location dropdown ">
        //#region -for header filter in table - Location dropdown
        let uniqueLocations = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.location] = (acc[obj.location] || 0) + 1; 
            return acc;
        }, {});        
        let uniqueLocationsArray = Object.entries(uniqueLocations).map(([location, count]) => {
            return { field: location, title: `${location} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueLocationsArray.sort((a, b) => a.field.localeCompare(b.field));
        
        const dropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueLocationsArray, exludeBy: "src" },
            TabulatorObj : CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const location_nm = $(e.target).attr("value");

                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            row.select();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            row.deselect();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.location] = (acc[obj.location] || 0) + 1; 
                    return acc;
                }, {});

                 // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button', dropdown).attr("id");                    
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected' ,drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);                        
                });

                return true;                
            }
            
        });
        // $(".location_header_select").append(dropdown);
        $($(".location_header_select", $(CustomTabulator.TabulatorObj.element.closest(".itsik-table-container")))[0]).append(dropdown);

        //#endregion
                // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" for header filter in table - Gender dropdown ">
        //#region -for header filter in table - gender dropdown
        let uniqueGender = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
            return acc;
        }, {});
        
        let uniqueGenderArray = Object.entries(uniqueGender).map(([gender, count]) => {
            return { field: gender, title: `${gender} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueGenderArray.sort((a, b) => a.field.localeCompare(b.field));


        const genderDropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueGenderArray, exludeBy: "src" },
            TabulatorObj: CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const gend = $(e.target).attr("value");

                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            row.select();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            row.deselect();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
                    return acc;
                }, {});
                
                // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button' ,genderDropdown).attr("id");
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected',drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);
                });

                return true;        
            }            
        });
        // $(".gender_header_select").append(genderDropdown);
        $($(".gender_header_select", $(CustomTabulator.TabulatorObj.element.closest(".itsik-table-container")))[0]).append(genderDropdown);

        //#endregion
        // </editor-fold>
    });
    $('[data-bs-toggle="tooltip"]').tooltip();
    CustomTabulator.TabulatorObj.on('scrollVertical',()=> {
        $.each($(".popover .close_on_scroll"), function(inx, el){
                $(el).closest(".popover").remove();
        });
    });

};
//#endregion
// </editor-fold>


// <editor-fold defaultstate="collapsed" desc=" fn: expandRowWithNestedTable_Level1 ">
//#region -fn: expandRowWithNestedTable_Level1
function expandRowWithNestedTable_Level1(e, row) {    
    // increase the height of the table row is expanded
    const expand_row_def = row.getCell("rowExpand").getColumn().getDefinition();
    expand_row_def.increaseTblHeight?.();


    let btn = $(e.target).closest("button");
    $(btn).data('expanded', true).removeClass("btn-success").addClass("btn-danger");
    $("i", btn).removeClass("fa-plus").addClass("fa-minus");
    
    //    $(e.target).data('expanded', true);
    //    $(e.target).html('-');
    //    $(e.target).removeClass('bg-primary');
    //    $(e.target).addClass('bg-danger');

    // <button type="button" class="btnExpand btn btn-sm m-0 p-0 btn-danger"><i class="fas px-1 fa-minus"></i></button>
    // <button type="button" class="expand-btn btn btn-sm btn-success m-0 p-0"><i class="fas fa-plus px-1"></i></button>

    // <editor-fold defaultstate="collapsed" desc=" table's Data ">
    //#region -table's Data
    const tableId = row.getTable().element.id + `-nested-table-${row.getData().id}`;
    const tableContainer = `${tableId}-container`;

    // Add class to row element at the level
    $(row.getElement()).addClass("row-expanded-lvl-1");
    // +IR+ I addedd class="nested-table"
    // <div class='${tableContainer} table-container p-2 itr-tbl-nested-1' style='width: ${$(row.getElement()).closest(".itsik-table-container").width()}px' >
    // console.log({styling: $(row.getElement()).width()}, $(row.getElement()).closest(".itsik-table-container").width())
    console.log({width:10}, $(row.getElement()).closest(".tabulator-tableholder").width())
    $(row.getElement()).append(`
        <div class='${tableContainer} table-container p-2 itr-tbl-nested-1' style='width: ${$(row.getElement()).closest(".tabulator-tableholder").width() - 22}px' >
                <div class="table-header-toolbar_w px-2"></div>
                <div id="${tableId}" class="nested-table"></div>
            </div>`);

    // resize table width when it is resized
    iTr_listen_resize(row)


    const CustomTabulator = new FeaturedTable('paginated-local', '#' + tableId, {
        tableContainer: '.' + tableContainer,
        DefaultHiddenColumns: ['__chbox2'], // To activate this option
        _tbl_format : "TMPL_tbl_toolbars_f01",
        _tbl_controlers : {                    
            "TMPL_tbl_toolbars_f01":[{"tbl_read_mode":{"c": "me-2"}},{'rowEditing':{"c": "me-2"}},{'tblSearch':{"c": "me-2", "input_w": 350}},{'tblSettings':{"c": ""}}]
        },
        TabulatorInitOptions: {
            ajaxURL: 'php/iDBcode.php',
            sortMode: 'local',
            filterMode:"local",
            keybindings:{
                "scrollToStart":false,
                "scrollToEnd":false,
            },
            
            
           ajaxParams: function () {
               let params  = {
                   "recBY_fixedVal" : row.getData()[expand_row_def["expandToKeyData"]], // where fixedData = "female"  and defined once we expending a row from extandToDate
               };
               return params;
           },

            
            columnsObj: function () {
                // adding all other column configurations
                return [
                    {
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: '',
                        field: 'rowExpand',
                        width: 30,
                        print: false,
                        download: false,
                        iExcludeFromList: {src:0, cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown
                        expandToKeyData : "gender",
                                                
                        formatter: function (cell, formatterParams, onRendered) {                            
                            let el = CustomTabulator.cellF_rowExpand(cell, formatterParams, onRendered, expandRowWithNestedTable_Level2, row);
                            return el;
                        },   
                        increaseTblHeight: function(row){
                            $(CustomTabulator.TabulatorObj.element).attr('style', "height:800px !important");
                        },
                        scrollRowTblAfterLoad: function(row){
                            CustomTabulator.TabulatorObj.scrollToRow(row, "top", false)
                            // row.getElement().scrollIntoView({block:"end"});

                            // this is not working
                            // row.getElement().scrollIntoView({block:"end",behavior:"smooth"});
                        }
                    },
                    {
                        formatter: 'rowSelection',
                        titleFormatter: 'rowSelection',
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: 'Select',
                        field: 'rowSelection',
                        width: 60,
                        print: false,
                        download: false,

                        titleFormatterParams: {
                            rowRange: 'active', //only toggle the values of the active filtered rows
                        },
                    },
                    {
                        title: 'ID',
                        field: 'id',
                        width: 60,
                        visible: isColumnVisible.call(this, 'id'),
                        iExcludeFromList: {cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                    {
                        title: 'Ch. box',
                        field: 'chbox',
                        visible: isColumnVisible.call(this, 'act'),
                        width: 90,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered, {TMPL_el_class: "form-select-sm"});                            
                            
                            function onSuccess() {                                
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);                            

                            return selectContainer[0];  
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            function onSuccess() {                                
                                success($('select', selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }

                            $('select', selectContainer).on('change blur', onSuccess);                            

                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;              
                            
                            if (editMode) {
                                setTimeout(() => {
                                    CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered);
                                });
                                return;
                            } 
                            else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }  
                        },                        
                        //#endregion
                        // </editor-fold>
                    },
                    {
                        title: 'Ch. box-2',
                        field: 'chbox2',
            //                        field_1: 'isCurrentRow',
            //                        field: 'isCurrentRow',
                        visible: isColumnVisible.call(this, 'chbox2'),
                        width: 100,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        // https://tabulator.info/docs/6.2/filter#func-custom                  
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered, {TMPL_el_class: "form-select-sm"});                            
                            
                            function onSuccess() {                                
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);                            

                            return selectContainer[0];  
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            $('select', selectContainer).on('change blur', function() {
                                success($(this).val());
                            });
                            
                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter      
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;              
                            
                            if (editMode) {
                                setTimeout(() => {
                                    CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered);
                                });
                                return;
                            } 
                            else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }  
                        },                        
                        //#endregion
                        // </editor-fold>
                    },

                    {
                        title: 'Name',
                        field: 'name',
                        visible: isColumnVisible.call(this, 'name'),
                        width: 150,
                        headerFilter: 'input',
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        headerWordWrap: true,
                        iExcludeFromList: {src:0}, 
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;     

                            if(editMode){
                                var editor = document.createElement('div');

                                // +IR+ change to jquery  also prop is attr
                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered);
                                $(input).attr("list", "browsers");
                                $(input).prop("name","browser");
                                $(input).prop("id","browser");

                                $(editor).append(input);

                                $(editor).append(`
                                    <datalist id="browsers">
                                        <option value="Edge">
                                        <option value="Firefox">
                                        <option value="Chrome">
                                        <option value="Opera">
                                        <option value="Safari">
                                    </datalist>
                                `);
                            
                                return editor;
                            }
                            return cell.getValue()
                        },
                    },
                    {
                        title: 'Email',
                        field: 'email',
                        visible: isColumnVisible.call(this, 'email'),
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                        validator: 'required',
                        formatter: this.iTr_cell_editor_formatterEl,   
                        // 
                            cellMouseEnter: function (event, cell){
                                CustomTabulator.iTr_zoom_or_edit({}, "MouseEnter", event, cell);
                            },
            //                         cellMouseLeave: function (event, cell) {
            //                             CustomTabulator.iTr_zoom_or_edit({}, "MouseLeave", event, cell);
            //                         },
                        cellDblClick: function (event, cell) {
                            // iConsole("cell", {args})
                            // CustomTabulator.TabulatorObj.getEditedCells()[0].
                            // for updating the cell value
                            // cell.setValue("sfdsffdsfsfdsfsdfdf")

                            // const row = cell.getRow();
                            // iConsole({ row });
                            // cell.setValue(row.getData()['phone_number']);

                            CustomTabulator.iTr_zoom_or_edit({  "popo_z" : {"class": "mb-0 close_on_scroll", style: "background-color: #e7e7e9;"}, }, "DblClick", event, cell);

                        },
                    },
                    {
                        title: 'Phone Number',
                        field: 'phone_number',
                        visible: isColumnVisible.call(this, 'phone_number'),
                        headerFilter:"input",
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: this.isFieldEditable,
                    },
                    {
                        title: 'Location',
                        field: 'location',
                        visible: isColumnVisible.call(this, 'location'),
                        width: 130,
                        headerFilter:(cell, onRendered, success, cancel)=>{          
                            const div = $(`<div class="location_header_select"></div>`);                            
                            return div[0];
                        },
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        validator: 'required',
                        editorParams: {
                            autocomplete: 'true',
                            allowEmpty: true,
                            listOnEmpty: true,
                            valuesLookup: true,
                        },
                    },
                    {
                        title: 'Gender',
                        field: 'gender',
                        // editor: 'list',
                        visible: isColumnVisible.call(this, 'gender'),
                        headerFilter:(cell, onRendered, success, cancel)=>{          
                            const div = $(`<div class="gender_header_select"></div>`);                            
                            return div[0];
                        },
                        editable: this.isFieldEditable,
                        // headerFilter: 'list',
                        headerFilterParams: {
                            values: { male: 'Male', female: 'Female' },
                            clearable: true,
                        },
                        validator: 'required',
                        width: 120,
                        formatterPrint: function printFormatter(cell, formatterParams, onRendered) {
                            iConsole(cell.getValue(), '');
                            return cell.getValue() == 'male' ? '1' : '0';
                        },
                        accessorDownload: function (value, data, type, params, column) {
                            return value == 'male' ? '1' : '0';
                        },
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;     

                            if(editMode){
                                var editor = document.createElement('div');

                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered)
                                $(input).attr("list", "gender-list")
                                $(input).prop("name","gender")
                                $(input).prop("id","gender")

                                $(editor).append(input)

                                $(editor).append(`
                                    <datalist id="gender-list">
                                        <option value="male">
                                        <option value="female">
                                    </datalist>
                                `);
                            
                                return editor;
                            }
                            return cell.getValue()
                        },
                    },
                    {
                        title: 'Favourite Color',
                        field: 'favourite',
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        headerFilter: 'list',
                        validator: 'required',
                        headerFilterParams: { valuesLookup: true, clearable: true },
                        width: 150,
                        visible: isColumnVisible.call(this, 'favourite'),
                    },
                    {
                        title: 'Date Of Birth',
                        field: 'dob',
                        hozAlign: 'center',
                        width: 200,
                        resizable: true,
                        // editor: this.dateEditor,
                        editable: this.isFieldEditable,
                        headerFilter: this.headerDateEditor,
                        validator: 'required',
                        cssClass: 'dob-filter',
                        visible: isColumnVisible.call(this, 'dob'),
                        formatter: this.iTr_cell_date_editor_formatterEl,
                        // formatter: function (cell, formatterParams, onRendered) {
                        //     // return luxon.DateTime.fromJSDate(new Date(cell.getValue())).toFormat('dd/MM/yyyy');
                        // },
                        
                    },
                    {
                        title: 'Manufacturers',
                        field: 'manuf',
                        visible: isColumnVisible.call(this, 'manuf'),
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: this.isFieldEditable,
                        headerFilter:"input"
                    },    
                    {
                        title: '',
                        field: '__dummy__',
                        visible: isColumnVisible.call(this, '__dummy__'),
                        width: 50,     
                        print: false,
                        download: false,
                        headerSort: false,        
                        iExcludeFromList: {src:0, cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown
                    },                
                ]
            },
        },
        exports: {
            types: ['PDF', 'Excel', 'Copy', 'Print'],
            handlers: {
                pdf: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    const { jsPDF } = window.jspdf;
                    const HiddenCols = getHiddenCols.call(currentThis);

                    const data = currentThis
                        .getData()
                        .map((row) => {
                            // delete rowSelection column
                            delete row.rowSelection;
                            Object.keys(row).forEach((key) => {
                                if (HiddenCols.includes(key)) {
                                    delete row[key];
                                }
                            });
                            if (row.gender) {
                                if (row.gender == 'male') {
                                    row.gender = `1`;
                                }
                                if (row.gender == 'female') {
                                    row.gender = `2`;
                                }
                            }
                            return row;
                        })
                        .map((row) => Object.values(row));

                    // Define columns
                    const columns = currentThis
                        .getColumns()
                        .map((column) => (column.isVisible() ? column.getDefinition() : null))
                        .filter((col) => col != null && col?.field != 'rowSelection');

                    // First pass: Create a temporary document to get the total page count
                    const tempDoc = new jsPDF();
                    tempDoc.autoTable({
                        head: [columns],
                        body: data,
                        startY: 0,
                    });
                    const totalPages = tempDoc.internal.getNumberOfPages();

                    // Second pass: Create the final document with footer
                    const finalDoc = new jsPDF();

                    const pageDimensions = finalDoc.internal.pageSize;
                    const pageHeight = pageDimensions.height ? pageDimensions.height : pageDimensions.getHeight();
                    const pageWidth = pageDimensions.width ? pageDimensions.width : pageDimensions.getWidth();

                    finalDoc.autoTable({
                        head: [columns],
                        body: data,
                        styles: {
                            fontSize: 7,
                        },
                        startY: 14,
                        didDrawPage: async function (data) {
                            const { left: leftMargin, right: rightMargin } = data.settings.margin;
                            const timeStamp = getCurrentTimestamp();

                            // add header
                            finalDoc.setFontSize(10);
                            const headerText = 'User Report';
                            const headerWidth = finalDoc.getTextWidth(headerText);
                            finalDoc.text(headerText, pageWidth / 2 - headerWidth / 2, 8);

                            // left part of the footer
                            let x;
                            let y;
                            let bottomY = pageHeight - 10;

                            const textWidth = finalDoc.getTextWidth('Power by');

                            finalDoc.text('Power by', leftMargin, bottomY);
                            finalDoc.setTextColor(blueColor);

                            const linkWidth = finalDoc.textWithLink('Ai-RGUS.com', (x = leftMargin + textWidth + 1), bottomY, {
                                url: 'https://ai-rgus.com/home',
                            });
                            finalDoc.setDrawColor(blueColor);
                            finalDoc.setLineWidth(0.2);
                            finalDoc.line(x, (y = pageHeight - 9), x + linkWidth, y);

                            finalDoc.setTextColor('#000');
                            finalDoc.text(timeStamp, x + linkWidth + 2, bottomY);

                            // right part of footer
                            const pageNoWidth = finalDoc.getTextWidth('Page ' + data.pageNumber + ' of ' + totalPages);
                            finalDoc.text(
                                'Page ' + data.pageNumber + ' of ' + totalPages,
                                pageWidth - pageNoWidth - rightMargin,
                                pageHeight - 10
                            );
                        },
                    });

                    finalDoc.save('table.pdf');
                },
                excel: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    currentThis.download('xlsx', `${currentThis.localStorageKey}.xlsx`, {
                        title: 'Report',
                        orientation: 'portrait'
                    });
                },
                print: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    currentThis.print(false, true, {});
                }
            }
        }
    });

    CustomTabulator.TabulatorObj.on('dataLoading', () => {
        // scroll the row into view
        expand_row_def.scrollRowTblAfterLoad?.(row);
    });

    CustomTabulator.TabulatorObj.on('tableBuilt', () => {
        // logic for tooltip adding in column headers        
        const tooltipColumns = [
            { field: 'email', content: '<span>email</span>', customClass: 'tooltip-info tt_width-600', position: 'top' },
            { field: 'location', content: 'location content', position: 'bottom' },
            // { field: 'gender', content: 'location content',position:"bottom", customToolTipItem: $('.add-new-row-btn').clone(true).removeClass("add-new-row-btn") },
            { field: 'gender', content: $('div[tt_for-field=location]').clone(true).html(), position: 'bottom' },
        ];
        addTooltipToTheColumns(CustomTabulator, tooltipColumns);        
                
        // <editor-fold defaultstate="collapsed" desc=" for header filter in table - Location dropdown ">
        //#region -for header filter in table - Location dropdown
        let uniqueLocations = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.location] = (acc[obj.location] || 0) + 1; 
            return acc;
        }, {});        
        let uniqueLocationsArray = Object.entries(uniqueLocations).map(([location, count]) => {
            return { field: location, title: `${location} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueLocationsArray.sort((a, b) => a.field.localeCompare(b.field));
        
        const dropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueLocationsArray, exludeBy: "src" },
            TabulatorObj : CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const location_nm = $(e.target).attr("value");

                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            row.select();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            row.deselect();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.location] = (acc[obj.location] || 0) + 1; 
                    return acc;
                }, {});

                 // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button', dropdown).attr("id");                    
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected' ,drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);                        
                });

                return true;                
            }
            
        });
        // $(".location_header_select").append(dropdown);
        $($(".location_header_select", $(CustomTabulator.TabulatorObj.element.closest(".table-container")))[0]).append(dropdown);

        //#endregion
                // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" for header filter in table - Gender dropdown ">
        //#region -for header filter in table - gender dropdown
        let uniqueGender = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
            return acc;
        }, {});
        
        let uniqueGenderArray = Object.entries(uniqueGender).map(([gender, count]) => {
            return { field: gender, title: `${gender} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueGenderArray.sort((a, b) => a.field.localeCompare(b.field));


        const genderDropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueGenderArray, exludeBy: "src" },
            TabulatorObj: CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const gend = $(e.target).attr("value");

                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            row.select();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            row.deselect();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
                    return acc;
                }, {});
                
                // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button' ,genderDropdown).attr("id");
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected',drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);
                });

                return true;        
            }            
        });
        // $(".gender_header_select").append(genderDropdown);
        $($(".gender_header_select", $(CustomTabulator.TabulatorObj.element.closest(".table-container")))[0]).append(genderDropdown);

        //#endregion
        // </editor-fold>
    });
    $('[data-bs-toggle="tooltip"]').tooltip();
    CustomTabulator.TabulatorObj.on('scrollVertical',()=> {
        $.each($(".popover .close_on_scroll"), function(inx, el){
                $(el).closest(".popover").remove();
        });
    });
      
    //#endregion
    // </editor-fold>    
}
//#endregion
// </editor-fold>
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" fn: expandRowWithNestedTable_Level2 ">
//#region -fn: expandRowWithNestedTable_Level2
function expandRowWithNestedTable_Level2(e, row) {    
    // increase the height of the table row is expanded
    const expand_row_def = row.getCell("rowExpand").getColumn().getDefinition();
    expand_row_def.increaseTblHeight?.(row);


    let btn = $(e.target).closest("button");
    $(btn).data('expanded', true).removeClass("btn-success").addClass("btn-danger");
    $("i", btn).removeClass("fa-plus").addClass("fa-minus");
    
    //    $(e.target).data('expanded', true);
    //    $(e.target).html('-');
    //    $(e.target).removeClass('bg-primary');
    //    $(e.target).addClass('bg-danger');

    // <button type="button" class="btnExpand btn btn-sm m-0 p-0 btn-danger"><i class="fas px-1 fa-minus"></i></button>
    // <button type="button" class="expand-btn btn btn-sm btn-success m-0 p-0"><i class="fas fa-plus px-1"></i></button>

    // <editor-fold defaultstate="collapsed" desc=" table's Data ">
    //#region -table's Data
    const tableId = row.getTable().element.id + `-nested-table-${row.getData().id}`;
    const tableContainer = `${tableId}-container`;

    // Add class to row element at the level
    $(row.getElement()).addClass("row-expanded-lvl-2")
    // console.log({styling: $(row.getElement()).width()}, $(row.getElement()).closest(".table-container").width(), row.getElement())


    // +IR+ I addedd class="nested-table"
    $(row.getElement()).append(`
            <div class='${tableContainer} table-container p-2  itr-tbl-nested-2' style='width: ${$(row.getElement()).closest(".tabulator-tableholder").width()-22}px'>
           <!--  <div class='${tableContainer} table-container p-2  itr-tbl-nested-2' style='width: ${$(row.getElement()).closest(".table-container").width()-22}px'>   -->
                <div class="table-header-toolbar_w px-2"></div>
                <div id="${tableId}" class="nested-table"></div>
            </div>`);

    // resize table width when it is resized
    iTr_listen_resize(row)


    const CustomTabulator = new FeaturedTable('paginated-local', '#' + tableId, {
        tableContainer: '.' + tableContainer,
        DefaultHiddenColumns: ['__chbox2'], // To activate this option
        _tbl_format : "TMPL_tbl_toolbars_f01",
        _tbl_controlers : {                    
            "TMPL_tbl_toolbars_f01":[{"tbl_read_mode":{"c": "me-2"}},{'rowEditing':{"c": "me-2"}},{'tbl_multy_purps':{"c": "me-2"}},{'tblSearch':{"c": "me-2", "input_w": 350}},{'tblColVisibility':{"c": "me-2"}},{'tblExport':{"c": "me-2"}},{'tblSettings':{"c": ""}}]
        },
        TabulatorInitOptions: {
            ajaxURL: 'php/iDBcode.php',
            ajaxParams: function () {
                let params  = {
                    "recBY" : row.getData()["favourite"], // where fixedData = "female"  and defined once we expending a row from extandToDate
                    "recBY_fixedVal" : row.getData()[expand_row_def["expandToKeyData"]], // where fixedData = "female"  and defined once we expending a row from extandToDate
                };
                return params;
            },
            sortMode: 'local',
            filterMode:"local",
            keybindings:{
                "scrollToStart":false,
                "scrollToEnd":false,
            },
            columnsObj: function () {
                // adding all other column configurations
                return [
                    {
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: '',
                        field: 'rowExpand',
                        width: 30,
                        print: false,
                        download: false,
                        iExcludeFromList: {src:0, cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown
                        
                        
                        formatter: function (cell, formatterParams, onRendered) {                            
                            let el = CustomTabulator.cellF_rowExpand(cell, formatterParams, onRendered, expandRowWithNestedTable_Level3);
                            return el;
                        },   
                        increaseTblHeight: function(){
                            $(CustomTabulator.TabulatorObj.element).attr('style',"height:800px !important");
                        },
                        scrollRowTblAfterLoad: function(row){
                            CustomTabulator.TabulatorObj.scrollToRow(row, "top", false)
                            // row.getElement().scrollIntoView({block:"end"});

                            // this is not working
                            // row.getElement().scrollIntoView({block:"end",behavior:"smooth"});
                        }
                    },
                    {
                        formatter: 'rowSelection',
                        titleFormatter: 'rowSelection',
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: 'Select',
                        field: 'rowSelection',
                        width: 60,
                        print: false,
                        download: false,

                        titleFormatterParams: {
                            rowRange: 'active', //only toggle the values of the active filtered rows
                        },
                    },
                    {
                        title: 'ID',
                        field: 'id',
                        width: 60,
                        visible: isColumnVisible.call(this, 'id'),
                        iExcludeFromList: {cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                    {
                        title: 'Ch. box',
                        field: 'chbox',
                        visible: isColumnVisible.call(this, 'act'),
                        width: 90,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered, {TMPL_el_class: "form-select-sm"});                            
                            
                            function onSuccess() {                                
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);                            

                            return selectContainer[0];  
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            function onSuccess() {                                
                                success($('select', selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }

                            $('select', selectContainer).on('change blur', onSuccess);                            

                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;              
                            
                            if (editMode) {
                                setTimeout(() => {
                                    CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered);
                                });
                                return;
                            } 
                            else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }  
                        },                        
                        //#endregion
                        // </editor-fold>
                    },
                    {
                        title: 'Ch. box-2',
                        field: 'chbox2',
            //                        field_1: 'isCurrentRow',
            //                        field: 'isCurrentRow',
                        visible: isColumnVisible.call(this, 'chbox2'),
                        width: 100,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        // https://tabulator.info/docs/6.2/filter#func-custom                  
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered, {TMPL_el_class: "form-select-sm"});                            
                            
                            function onSuccess() {                                
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);                            

                            return selectContainer[0];  
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            $('select', selectContainer).on('change blur', function() {
                                success($(this).val());
                            });
                            
                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter      
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;              
                            
                            if (editMode) {
                                setTimeout(() => {
                                    CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered);
                                });
                                return;
                            } 
                            else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }  
                        },                        
                        //#endregion
                        // </editor-fold>
                    },

                    {
                        title: 'Name',
                        field: 'name',
                        visible: isColumnVisible.call(this, 'name'),
                        width: 150,
                        headerFilter: 'input',
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        headerWordWrap: true,
                        iExcludeFromList: {src:0}, 
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;     

                            if(editMode){
                                var editor = document.createElement('div');

                                // +IR+ change to jquery  also prop is attr
                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered);
                                $(input).attr("list", "browsers");
                                $(input).prop("name","browser");
                                $(input).prop("id","browser");

                                $(editor).append(input);

                                $(editor).append(`
                                    <datalist id="browsers">
                                        <option value="Edge">
                                        <option value="Firefox">
                                        <option value="Chrome">
                                        <option value="Opera">
                                        <option value="Safari">
                                    </datalist>
                                `);
                            
                                return editor;
                            }
                            return cell.getValue()
                        },
                    },
                    {
                        title: 'Email',
                        field: 'email',
                        visible: isColumnVisible.call(this, 'email'),
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                        validator: 'required',
                        formatter: this.iTr_cell_editor_formatterEl,   
                        // 
                            cellMouseEnter: function (event, cell){
                                CustomTabulator.iTr_zoom_or_edit({}, "MouseEnter", event, cell);
                            },
            //                         cellMouseLeave: function (event, cell) {
            //                             CustomTabulator.iTr_zoom_or_edit({}, "MouseLeave", event, cell);
            //                         },
                        cellDblClick: function (event, cell) {
                            // iConsole("cell", {args})
                            // CustomTabulator.TabulatorObj.getEditedCells()[0].
                            // for updating the cell value
                            // cell.setValue("sfdsffdsfsfdsfsdfdf")

                            // const row = cell.getRow();
                            // iConsole({ row });
                            // cell.setValue(row.getData()['phone_number']);

                            CustomTabulator.iTr_zoom_or_edit({  "popo_z" : {"class": "mb-0 close_on_scroll", style: "background-color: #e7e7e9;"}, }, "DblClick", event, cell);

                        },
                    },
                    {
                        title: 'Phone Number',
                        field: 'phone_number',
                        visible: isColumnVisible.call(this, 'phone_number'),
                        headerFilter:"input",
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: this.isFieldEditable,
                    },
                    {
                        title: 'Location',
                        field: 'location',
                        visible: isColumnVisible.call(this, 'location'),
                        width: 130,
                        headerFilter:(cell, onRendered, success, cancel)=>{          
                            const div = $(`<div class="location_header_select"></div>`);                            
                            return div[0];
                        },
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        validator: 'required',
                        editorParams: {
                            autocomplete: 'true',
                            allowEmpty: true,
                            listOnEmpty: true,
                            valuesLookup: true,
                        },
                    },
                    {
                        title: 'Gender',
                        field: 'gender',
                        // editor: 'list',
                        visible: isColumnVisible.call(this, 'gender'),
                        headerFilter:(cell, onRendered, success, cancel)=>{          
                            const div = $(`<div class="gender_header_select"></div>`);                            
                            return div[0];
                        },
                        editable: this.isFieldEditable,
                        // headerFilter: 'list',
                        headerFilterParams: {
                            values: { male: 'Male', female: 'Female' },
                            clearable: true,
                        },
                        validator: 'required',
                        width: 120,
                        formatterPrint: function printFormatter(cell, formatterParams, onRendered) {
                            iConsole(cell.getValue(), '');
                            return cell.getValue() == 'male' ? '1' : '0';
                        },
                        accessorDownload: function (value, data, type, params, column) {
                            return value == 'male' ? '1' : '0';
                        },
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;     

                            if(editMode){
                                var editor = document.createElement('div');

                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered)
                                $(input).attr("list", "gender-list")
                                $(input).prop("name","gender")
                                $(input).prop("id","gender")

                                $(editor).append(input)

                                $(editor).append(`
                                    <datalist id="gender-list">
                                        <option value="male">
                                        <option value="female">
                                    </datalist>
                                `);
                            
                                return editor;
                            }
                            return cell.getValue()
                        },
                    },
                    {
                        title: 'Favourite Color',
                        field: 'favourite',
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        headerFilter: 'list',
                        validator: 'required',
                        headerFilterParams: { valuesLookup: true, clearable: true },
                        width: 150,
                        visible: isColumnVisible.call(this, 'favourite'),
                    },
                    {
                        title: 'Date Of Birth',
                        field: 'dob',
                        hozAlign: 'center',
                        width: 200,
                        resizable: true,
                        // editor: this.dateEditor,
                        editable: this.isFieldEditable,
                        headerFilter: this.headerDateEditor,
                        validator: 'required',
                        cssClass: 'dob-filter',
                        visible: isColumnVisible.call(this, 'dob'),
                        formatter: this.iTr_cell_date_editor_formatterEl,
                        // formatter: function (cell, formatterParams, onRendered) {
                        //     // return luxon.DateTime.fromJSDate(new Date(cell.getValue())).toFormat('dd/MM/yyyy');
                        // },
                        
                    },
                    {
                        title: 'Manufacturers',
                        field: 'manuf',
                        visible: isColumnVisible.call(this, 'manuf'),
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: this.isFieldEditable,
                        headerFilter:"input"
                    },    
                    {
                        title: '',
                        field: '__dummy__',
                        visible: isColumnVisible.call(this, '__dummy__'),
                        width: 50,     
                        print: false,
                        download: false,
                        headerSort: false,        
                        iExcludeFromList: {src:0, cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown
                    },                
                ]
            },
        },
        exports: {
            types: ['PDF', 'Excel', 'Copy', 'Print'],
            handlers: {
                pdf: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    const { jsPDF } = window.jspdf;
                    const HiddenCols = getHiddenCols.call(currentThis);

                    const data = currentThis
                        .getData()
                        .map((row) => {
                            // delete rowSelection column
                            delete row.rowSelection;
                            Object.keys(row).forEach((key) => {
                                if (HiddenCols.includes(key)) {
                                    delete row[key];
                                }
                            });
                            if (row.gender) {
                                if (row.gender == 'male') {
                                    row.gender = `1`;
                                }
                                if (row.gender == 'female') {
                                    row.gender = `2`;
                                }
                            }
                            return row;
                        })
                        .map((row) => Object.values(row));

                    // Define columns
                    const columns = currentThis
                        .getColumns()
                        .map((column) => (column.isVisible() ? column.getDefinition() : null))
                        .filter((col) => col != null && col?.field != 'rowSelection');

                    // First pass: Create a temporary document to get the total page count
                    const tempDoc = new jsPDF();
                    tempDoc.autoTable({
                        head: [columns],
                        body: data,
                        startY: 0,
                    });
                    const totalPages = tempDoc.internal.getNumberOfPages();

                    // Second pass: Create the final document with footer
                    const finalDoc = new jsPDF();

                    const pageDimensions = finalDoc.internal.pageSize;
                    const pageHeight = pageDimensions.height ? pageDimensions.height : pageDimensions.getHeight();
                    const pageWidth = pageDimensions.width ? pageDimensions.width : pageDimensions.getWidth();

                    finalDoc.autoTable({
                        head: [columns],
                        body: data,
                        styles: {
                            fontSize: 7,
                        },
                        startY: 14,
                        didDrawPage: async function (data) {
                            const { left: leftMargin, right: rightMargin } = data.settings.margin;
                            const timeStamp = getCurrentTimestamp();

                            // add header
                            finalDoc.setFontSize(10);
                            const headerText = 'User Report';
                            const headerWidth = finalDoc.getTextWidth(headerText);
                            finalDoc.text(headerText, pageWidth / 2 - headerWidth / 2, 8);

                            // left part of the footer
                            let x;
                            let y;
                            let bottomY = pageHeight - 10;

                            const textWidth = finalDoc.getTextWidth('Power by');

                            finalDoc.text('Power by', leftMargin, bottomY);
                            finalDoc.setTextColor(blueColor);

                            const linkWidth = finalDoc.textWithLink('Ai-RGUS.com', (x = leftMargin + textWidth + 1), bottomY, {
                                url: 'https://ai-rgus.com/home',
                            });
                            finalDoc.setDrawColor(blueColor);
                            finalDoc.setLineWidth(0.2);
                            finalDoc.line(x, (y = pageHeight - 9), x + linkWidth, y);

                            finalDoc.setTextColor('#000');
                            finalDoc.text(timeStamp, x + linkWidth + 2, bottomY);

                            // right part of footer
                            const pageNoWidth = finalDoc.getTextWidth('Page ' + data.pageNumber + ' of ' + totalPages);
                            finalDoc.text(
                                'Page ' + data.pageNumber + ' of ' + totalPages,
                                pageWidth - pageNoWidth - rightMargin,
                                pageHeight - 10
                            );
                        },
                    });

                    finalDoc.save('table.pdf');
                },
                excel: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    currentThis.download('xlsx', `${currentThis.localStorageKey}.xlsx`, {
                        title: 'Report',
                        orientation: 'portrait'
                    });
                },
                print: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    currentThis.print(false, true, {});
                }
            }
        }
    });

    CustomTabulator.TabulatorObj.on('dataLoading', () => {
        // scroll the row into view
        expand_row_def.scrollRowTblAfterLoad?.(row);
    });

    CustomTabulator.TabulatorObj.on('tableBuilt', () => {
        // logic for tooltip adding in column headers        
        const tooltipColumns = [
            { field: 'email', content: '<span>email</span>', customClass: 'tooltip-info tt_width-600', position: 'top' },
            { field: 'location', content: 'location content', position: 'bottom' },
            // { field: 'gender', content: 'location content',position:"bottom", customToolTipItem: $('.add-new-row-btn').clone(true).removeClass("add-new-row-btn") },
            { field: 'gender', content: $('div[tt_for-field=location]').clone(true).html(), position: 'bottom' },
        ];
        addTooltipToTheColumns(CustomTabulator, tooltipColumns);        
                
        // <editor-fold defaultstate="collapsed" desc=" for header filter in table - Location dropdown ">
        //#region -for header filter in table - Location dropdown
        let uniqueLocations = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.location] = (acc[obj.location] || 0) + 1; 
            return acc;
        }, {});        
        let uniqueLocationsArray = Object.entries(uniqueLocations).map(([location, count]) => {
            return { field: location, title: `${location} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueLocationsArray.sort((a, b) => a.field.localeCompare(b.field));
        
        const dropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueLocationsArray, exludeBy: "src" },
            TabulatorObj : CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const location_nm = $(e.target).attr("value");

                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            row.select();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            row.deselect();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.location] = (acc[obj.location] || 0) + 1; 
                    return acc;
                }, {});

                 // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button', dropdown).attr("id");                    
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected' ,drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);                        
                });

                return true;                
            }
            
        });
        // $(".location_header_select").append(dropdown);
        $($(".location_header_select", $(CustomTabulator.TabulatorObj.element.closest(".table-container")))[0]).append(dropdown);

        //#endregion
                // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" for header filter in table - Gender dropdown ">
        //#region -for header filter in table - gender dropdown
        let uniqueGender = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
            return acc;
        }, {});
        
        let uniqueGenderArray = Object.entries(uniqueGender).map(([gender, count]) => {
            return { field: gender, title: `${gender} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueGenderArray.sort((a, b) => a.field.localeCompare(b.field));


        const genderDropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueGenderArray, exludeBy: "src" },
            TabulatorObj: CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const gend = $(e.target).attr("value");

                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            row.select();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            row.deselect();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
                    return acc;
                }, {});
                
                // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button' ,genderDropdown).attr("id");
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected',drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);
                });

                return true;        
            }            
        });
        // $(".gender_header_select").append(genderDropdown);
        $($(".gender_header_select", $(CustomTabulator.TabulatorObj.element.closest(".table-container")))[0]).append(genderDropdown);

        //#endregion
        // </editor-fold>
    });
    $('[data-bs-toggle="tooltip"]').tooltip();
    CustomTabulator.TabulatorObj.on('scrollVertical',()=> {
        $.each($(".popover .close_on_scroll"), function(inx, el){
                $(el).closest(".popover").remove();
        });
    });
      
    //#endregion
    // </editor-fold>    
}
//#endregion
// </editor-fold>
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" fn: expandRowWithNestedTable_Level3 ">
//#region -fn: expandRowWithNestedTable_Level3
function expandRowWithNestedTable_Level3(e, row) {    
    // increase the height of the table row is expanded
    // increase the height of the table row is expanded
    const expand_row_def = row.getCell("rowExpand").getColumn().getDefinition();
    expand_row_def.increaseTblHeight?.();

    let btn = $(e.target).closest("button");
    $(btn).data('expanded', true).removeClass("btn-success").addClass("btn-danger");
    $("i", btn).removeClass("fa-plus").addClass("fa-minus");
    
    //    $(e.target).data('expanded', true);
    //    $(e.target).html('-');
    //    $(e.target).removeClass('bg-primary');
    //    $(e.target).addClass('bg-danger');

    // <button type="button" class="btnExpand btn btn-sm m-0 p-0 btn-danger"><i class="fas px-1 fa-minus"></i></button>
    // <button type="button" class="expand-btn btn btn-sm btn-success m-0 p-0"><i class="fas fa-plus px-1"></i></button>

    // <editor-fold defaultstate="collapsed" desc=" table's Data ">
    //#region -table's Data
    const tableId = row.getTable().element.id + `-nested-table-${row.getData().id}`;
    const tableContainer = `${tableId}-container`;

    // Add class to row element at the level
    $(row.getElement()).addClass("row-expanded-lvl-3")
    // +IR+ I addedd class="nested-table"
    $(row.getElement()).append(`
            <div class='${tableContainer} table-container p-2  itr-tbl-nested-3' style='width: ${$(row.getElement()).closest(".tabulator-tableholder").width()-22}px'>
                <div class="table-header-toolbar_w px-2"></div>
                <div id="${tableId}" class="nested-table"></div>
            </div>`);

    // resize table width when it is resized
    iTr_listen_resize(row)
    //#region test


    //#endregion

    const CustomTabulator = new FeaturedTable('paginated-local', '#' + tableId, {
        tableContainer: '.' + tableContainer,
        DefaultHiddenColumns: ['__chbox2'], // To activate this option
        _tbl_format : "TMPL_tbl_toolbars_f01",
        _tbl_controlers : {                    
            "TMPL_tbl_toolbars_f01":[{"tbl_read_mode":{"c": "me-2"}},{'rowEditing':{"c": "me-2"}},{'tbl_multy_purps':{"c": "me-2"}},{'tblSearch':{"c": "me-2", "input_w": 350}},{'tblColVisibility':{"c": "me-2"}},{'tblExport':{"c": "me-2"}},{'tblSettings':{"c": ""}}]
        },
        TabulatorInitOptions: {
            ajaxURL: 'php/iDBcode.php',
            sortMode: 'local',
            filterMode:"local",
            keybindings:{
                "scrollToStart":false,
                "scrollToEnd":false,
            },
            columnsObj: function () {
                // adding all other column configurations
                return [
                    {
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: '',
                        field: 'rowExpand',
                        width: 30,
                        print: false,
                        download: false,
                        iExcludeFromList: {src:0, cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown
                        
                        
                        formatter: function (cell, formatterParams, onRendered) {                            
                            let el = CustomTabulator.cellF_rowExpand(cell, formatterParams, onRendered, expandRowWithNestedTable_Level4);
                            return el;
                        },   
                        increaseTblHeight: function(){
                            $(CustomTabulator.TabulatorObj.element).attr('style',"height:800px !important");
                        },
                        scrollRowTblAfterLoad: function(row){
                            CustomTabulator.TabulatorObj.scrollToRow(row, "top", false)
                            // row.getElement().scrollIntoView({block:"end"});

                            // this is not working
                            // row.getElement().scrollIntoView({block:"end",behavior:"smooth"})
                        }
                    },
                    {
                        formatter: 'rowSelection',
                        titleFormatter: 'rowSelection',
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: 'Select',
                        field: 'rowSelection',
                        width: 60,
                        print: false,
                        download: false,

                        titleFormatterParams: {
                            rowRange: 'active', //only toggle the values of the active filtered rows
                        },
                    },
                    {
                        title: 'ID',
                        field: 'id',
                        width: 60,
                        visible: isColumnVisible.call(this, 'id'),
                        iExcludeFromList: {cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                    {
                        title: 'Ch. box',
                        field: 'chbox',
                        visible: isColumnVisible.call(this, 'act'),
                        width: 90,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered, {TMPL_el_class: "form-select-sm"});                            
                            
                            function onSuccess() {                                
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);                            

                            return selectContainer[0];  
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            function onSuccess() {                                
                                success($('select', selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }

                            $('select', selectContainer).on('change blur', onSuccess);                            

                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;              
                            
                            if (editMode) {
                                setTimeout(() => {
                                    CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered);
                                });
                                return;
                            } 
                            else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }  
                        },                        
                        //#endregion
                        // </editor-fold>
                    },
                    {
                        title: 'Ch. box-2',
                        field: 'chbox2',
            //                        field_1: 'isCurrentRow',
            //                        field: 'isCurrentRow',
                        visible: isColumnVisible.call(this, 'chbox2'),
                        width: 100,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        // https://tabulator.info/docs/6.2/filter#func-custom                  
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered, {TMPL_el_class: "form-select-sm"});                            
                            
                            function onSuccess() {                                
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);                            

                            return selectContainer[0];  
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            $('select', selectContainer).on('change blur', function() {
                                success($(this).val());
                            });
                            
                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter      
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;              
                            
                            if (editMode) {
                                setTimeout(() => {
                                    CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered);
                                });
                                return;
                            } 
                            else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }  
                        },                        
                        //#endregion
                        // </editor-fold>
                    },

                    {
                        title: 'Name',
                        field: 'name',
                        visible: isColumnVisible.call(this, 'name'),
                        width: 150,
                        headerFilter: 'input',
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        headerWordWrap: true,
                        iExcludeFromList: {src:0}, 
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;     

                            if(editMode){
                                var editor = document.createElement('div');

                                // +IR+ change to jquery  also prop is attr
                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered);
                                $(input).attr("list", "browsers");
                                $(input).prop("name","browser");
                                $(input).prop("id","browser");

                                $(editor).append(input);

                                $(editor).append(`
                                    <datalist id="browsers">
                                        <option value="Edge">
                                        <option value="Firefox">
                                        <option value="Chrome">
                                        <option value="Opera">
                                        <option value="Safari">
                                    </datalist>
                                `);
                            
                                return editor;
                            }
                            return cell.getValue()
                        },
                    },
                    {
                        title: 'Email',
                        field: 'email',
                        visible: isColumnVisible.call(this, 'email'),
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                        validator: 'required',
                        formatter: this.iTr_cell_editor_formatterEl,   
                        // 
                            cellMouseEnter: function (event, cell){
                                CustomTabulator.iTr_zoom_or_edit({}, "MouseEnter", event, cell);
                            },
            //                         cellMouseLeave: function (event, cell) {
            //                             CustomTabulator.iTr_zoom_or_edit({}, "MouseLeave", event, cell);
            //                         },
                        cellDblClick: function (event, cell) {
                            // iConsole("cell", {args})
                            // CustomTabulator.TabulatorObj.getEditedCells()[0].
                            // for updating the cell value
                            // cell.setValue("sfdsffdsfsfdsfsdfdf")

                            // const row = cell.getRow();
                            // iConsole({ row });
                            // cell.setValue(row.getData()['phone_number']);

                            CustomTabulator.iTr_zoom_or_edit({  "popo_z" : {"class": "mb-0 close_on_scroll", style: "background-color: #e7e7e9;"}, }, "DblClick", event, cell);

                        },
                    },
                    {
                        title: 'Phone Number',
                        field: 'phone_number',
                        visible: isColumnVisible.call(this, 'phone_number'),
                        headerFilter:"input",
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: this.isFieldEditable,
                    },
                    {
                        title: 'Location',
                        field: 'location',
                        visible: isColumnVisible.call(this, 'location'),
                        width: 130,
                        headerFilter:(cell, onRendered, success, cancel)=>{          
                            const div = $(`<div class="location_header_select"></div>`);                            
                            return div[0];
                        },
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        validator: 'required',
                        editorParams: {
                            autocomplete: 'true',
                            allowEmpty: true,
                            listOnEmpty: true,
                            valuesLookup: true,
                        },
                    },
                    {
                        title: 'Gender',
                        field: 'gender',
                        // editor: 'list',
                        visible: isColumnVisible.call(this, 'gender'),
                        headerFilter:(cell, onRendered, success, cancel)=>{          
                            const div = $(`<div class="gender_header_select"></div>`);                            
                            return div[0];
                        },
                        editable: this.isFieldEditable,
                        // headerFilter: 'list',
                        headerFilterParams: {
                            values: { male: 'Male', female: 'Female' },
                            clearable: true,
                        },
                        validator: 'required',
                        width: 120,
                        formatterPrint: function printFormatter(cell, formatterParams, onRendered) {
                            iConsole(cell.getValue(), '');
                            return cell.getValue() == 'male' ? '1' : '0';
                        },
                        accessorDownload: function (value, data, type, params, column) {
                            return value == 'male' ? '1' : '0';
                        },
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;     

                            if(editMode){
                                var editor = document.createElement('div');

                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered)
                                $(input).attr("list", "gender-list")
                                $(input).prop("name","gender")
                                $(input).prop("id","gender")

                                $(editor).append(input)

                                $(editor).append(`
                                    <datalist id="gender-list">
                                        <option value="male">
                                        <option value="female">
                                    </datalist>
                                `);
                            
                                return editor;
                            }
                            return cell.getValue()
                        },
                    },
                    {
                        title: 'Favourite Color',
                        field: 'favourite',
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        headerFilter: 'list',
                        validator: 'required',
                        headerFilterParams: { valuesLookup: true, clearable: true },
                        width: 150,
                        visible: isColumnVisible.call(this, 'favourite'),
                    },
                    {
                        title: 'Date Of Birth',
                        field: 'dob',
                        hozAlign: 'center',
                        width: 200,
                        resizable: true,
                        // editor: this.dateEditor,
                        editable: this.isFieldEditable,
                        headerFilter: this.headerDateEditor,
                        validator: 'required',
                        cssClass: 'dob-filter',
                        visible: isColumnVisible.call(this, 'dob'),
                        formatter: this.iTr_cell_date_editor_formatterEl,
                        // formatter: function (cell, formatterParams, onRendered) {
                        //     // return luxon.DateTime.fromJSDate(new Date(cell.getValue())).toFormat('dd/MM/yyyy');
                        // },
                        
                    },
                    {
                        title: 'Manufacturers',
                        field: 'manuf',
                        visible: isColumnVisible.call(this, 'manuf'),
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: this.isFieldEditable,
                        headerFilter:"input"
                    },    
                    {
                        title: '',
                        field: '__dummy__',
                        visible: isColumnVisible.call(this, '__dummy__'),
                        width: 50,     
                        print: false,
                        download: false,
                        headerSort: false,        
                        iExcludeFromList: {src:0, cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown
                    },                
                ]
            },
        },
        exports: {
            types: ['PDF', 'Excel', 'Copy', 'Print'],
            handlers: {
                pdf: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    const { jsPDF } = window.jspdf;
                    const HiddenCols = getHiddenCols.call(currentThis);

                    const data = currentThis
                        .getData()
                        .map((row) => {
                            // delete rowSelection column
                            delete row.rowSelection;
                            Object.keys(row).forEach((key) => {
                                if (HiddenCols.includes(key)) {
                                    delete row[key];
                                }
                            });
                            if (row.gender) {
                                if (row.gender == 'male') {
                                    row.gender = `1`;
                                }
                                if (row.gender == 'female') {
                                    row.gender = `2`;
                                }
                            }
                            return row;
                        })
                        .map((row) => Object.values(row));

                    // Define columns
                    const columns = currentThis
                        .getColumns()
                        .map((column) => (column.isVisible() ? column.getDefinition() : null))
                        .filter((col) => col != null && col?.field != 'rowSelection');

                    // First pass: Create a temporary document to get the total page count
                    const tempDoc = new jsPDF();
                    tempDoc.autoTable({
                        head: [columns],
                        body: data,
                        startY: 0,
                    });
                    const totalPages = tempDoc.internal.getNumberOfPages();

                    // Second pass: Create the final document with footer
                    const finalDoc = new jsPDF();

                    const pageDimensions = finalDoc.internal.pageSize;
                    const pageHeight = pageDimensions.height ? pageDimensions.height : pageDimensions.getHeight();
                    const pageWidth = pageDimensions.width ? pageDimensions.width : pageDimensions.getWidth();

                    finalDoc.autoTable({
                        head: [columns],
                        body: data,
                        styles: {
                            fontSize: 7,
                        },
                        startY: 14,
                        didDrawPage: async function (data) {
                            const { left: leftMargin, right: rightMargin } = data.settings.margin;
                            const timeStamp = getCurrentTimestamp();

                            // add header
                            finalDoc.setFontSize(10);
                            const headerText = 'User Report';
                            const headerWidth = finalDoc.getTextWidth(headerText);
                            finalDoc.text(headerText, pageWidth / 2 - headerWidth / 2, 8);

                            // left part of the footer
                            let x;
                            let y;
                            let bottomY = pageHeight - 10;

                            const textWidth = finalDoc.getTextWidth('Power by');

                            finalDoc.text('Power by', leftMargin, bottomY);
                            finalDoc.setTextColor(blueColor);

                            const linkWidth = finalDoc.textWithLink('Ai-RGUS.com', (x = leftMargin + textWidth + 1), bottomY, {
                                url: 'https://ai-rgus.com/home',
                            });
                            finalDoc.setDrawColor(blueColor);
                            finalDoc.setLineWidth(0.2);
                            finalDoc.line(x, (y = pageHeight - 9), x + linkWidth, y);

                            finalDoc.setTextColor('#000');
                            finalDoc.text(timeStamp, x + linkWidth + 2, bottomY);

                            // right part of footer
                            const pageNoWidth = finalDoc.getTextWidth('Page ' + data.pageNumber + ' of ' + totalPages);
                            finalDoc.text(
                                'Page ' + data.pageNumber + ' of ' + totalPages,
                                pageWidth - pageNoWidth - rightMargin,
                                pageHeight - 10
                            );
                        },
                    });

                    finalDoc.save('table.pdf');
                },
                excel: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    currentThis.download('xlsx', `${currentThis.localStorageKey}.xlsx`, {
                        title: 'Report',
                        orientation: 'portrait'
                    });
                },
                print: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    currentThis.print(false, true, {});
                }
            }
        }
    });

    CustomTabulator.TabulatorObj.on('dataLoading', () => {
        // scroll the row into view
        expand_row_def.scrollRowTblAfterLoad?.(row);
    });

    CustomTabulator.TabulatorObj.on('tableBuilt', () => {
        // logic for tooltip adding in column headers        
        const tooltipColumns = [
            { field: 'email', content: '<span>email</span>', customClass: 'tooltip-info tt_width-600', position: 'top' },
            { field: 'location', content: 'location content', position: 'bottom' },
            // { field: 'gender', content: 'location content',position:"bottom", customToolTipItem: $('.add-new-row-btn').clone(true).removeClass("add-new-row-btn") },
            { field: 'gender', content: $('div[tt_for-field=location]').clone(true).html(), position: 'bottom' },
        ];
        addTooltipToTheColumns(CustomTabulator, tooltipColumns);        
                
        // <editor-fold defaultstate="collapsed" desc=" for header filter in table - Location dropdown ">
        //#region -for header filter in table - Location dropdown
        let uniqueLocations = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.location] = (acc[obj.location] || 0) + 1; 
            return acc;
        }, {});        
        let uniqueLocationsArray = Object.entries(uniqueLocations).map(([location, count]) => {
            return { field: location, title: `${location} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueLocationsArray.sort((a, b) => a.field.localeCompare(b.field));
        
        const dropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueLocationsArray, exludeBy: "src" },
            TabulatorObj : CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const location_nm = $(e.target).attr("value");

                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            row.select();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            row.deselect();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.location] = (acc[obj.location] || 0) + 1; 
                    return acc;
                }, {});

                 // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button', dropdown).attr("id");                    
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected' ,drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);                        
                });

                return true;                
            }
            
        });
        // $(".location_header_select").append(dropdown);
        $($(".location_header_select", $(CustomTabulator.TabulatorObj.element.closest(".table-container")))[0]).append(dropdown);

        //#endregion
                // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" for header filter in table - Gender dropdown ">
        //#region -for header filter in table - gender dropdown
        let uniqueGender = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
            return acc;
        }, {});
        
        let uniqueGenderArray = Object.entries(uniqueGender).map(([gender, count]) => {
            return { field: gender, title: `${gender} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueGenderArray.sort((a, b) => a.field.localeCompare(b.field));


        const genderDropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueGenderArray, exludeBy: "src" },
            TabulatorObj: CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const gend = $(e.target).attr("value");

                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            row.select();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            row.deselect();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
                    return acc;
                }, {});
                
                // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button' ,genderDropdown).attr("id");
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected',drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);
                });

                return true;        
            }            
        });
        // $(".gender_header_select").append(genderDropdown);
        $($(".gender_header_select", $(CustomTabulator.TabulatorObj.element.closest(".table-container")))[0]).append(genderDropdown);

        //#endregion
        // </editor-fold>
    });
    $('[data-bs-toggle="tooltip"]').tooltip();
    CustomTabulator.TabulatorObj.on('scrollVertical',()=> {
        $.each($(".popover .close_on_scroll"), function(inx, el){
                $(el).closest(".popover").remove();
        });
    });
      
    //#endregion
    // </editor-fold>    
}
//#endregion
// </editor-fold>
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" fn: expandRowWithNestedTable_Level4 ">
//#region -fn: expandRowWithNestedTable_Level4
function expandRowWithNestedTable_Level4(e, row) {  
    // increase the height of the table row is expanded
    const expand_row_def = row.getCell("rowExpand").getColumn().getDefinition();
    expand_row_def.increaseTblHeight?.();

    let btn = $(e.target).closest("button");
    $(btn).data('expanded', true).removeClass("btn-success").addClass("btn-danger");
    $("i", btn).removeClass("fa-plus").addClass("fa-minus");

    // <editor-fold defaultstate="collapsed" desc=" table's Data ">
    //#region -table's Data
    const tableId = row.getTable().element.id + `-nested-table-${row.getData().id}`;
    const tableContainer = `${tableId}-container`;

    // Add class to row element at the level
    $(row.getElement()).addClass("row-expanded-lvl-4")
    // +IR+ I addedd class="nested-table"
    $(row.getElement()).append(`
            <div class='${tableContainer} table-container p-2  itr-tbl-nested-4' style='width: ${$(row.getElement()).closest(".tabulator-tableholder").width()-22}px'>
                <div class="table-header-toolbar_w px-2"></div>
                <div id="${tableId}" class="nested-table"></div>
            </div>`);
    // resize table width when it is resized
    iTr_listen_resize(row)
    


    const CustomTabulator = new FeaturedTable('paginated-local', '#' + tableId, {
        tableContainer: '.' + tableContainer,
        DefaultHiddenColumns: ['__chbox2'], // To activate this option
        _tbl_format : "TMPL_tbl_toolbars_f01",
        _tbl_controlers : {                    
            "TMPL_tbl_toolbars_f01":[{"tbl_read_mode":{"c": "me-2"}},{'rowEditing':{"c": "me-2"}},{'tbl_multy_purps':{"c": "me-2"}},{'tblSearch':{"c": "me-2", "input_w": 350}},{'tblColVisibility':{"c": "me-2"}},{'tblExport':{"c": "me-2"}},{'tblSettings':{"c": ""}}]
        },
        TabulatorInitOptions: {
            ajaxURL: 'php/iDBcode.php',
            sortMode: 'local',
            filterMode:"local",
            keybindings:{
                "scrollToStart":false,
                "scrollToEnd":false,
            },
            columnsObj: function () {
                // adding all other column configurations
                return [
                    {
                        formatter: 'rowSelection',
                        titleFormatter: 'rowSelection',
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: 'Select',
                        field: 'rowSelection',
                        width: 60,
                        print: false,
                        download: false,

                        titleFormatterParams: {
                            rowRange: 'active', //only toggle the values of the active filtered rows
                        },
                    },
                    {
                        title: 'ID',
                        field: 'id',
                        width: 60,
                        visible: isColumnVisible.call(this, 'id'),
                        iExcludeFromList: {cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                    {
                        title: 'Ch. box',
                        field: 'chbox',
                        visible: isColumnVisible.call(this, 'act'),
                        width: 90,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered, {TMPL_el_class: "form-select-sm"});                            
                            
                            function onSuccess() {                                
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);                            

                            return selectContainer[0];  
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            function onSuccess() {                                
                                success($('select', selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }

                            $('select', selectContainer).on('change blur', onSuccess);                            

                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;              
                            
                            if (editMode) {
                                setTimeout(() => {
                                    CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered);
                                });
                                return;
                            } 
                            else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }  
                        },                        
                        //#endregion
                        // </editor-fold>
                    },
                    {
                        title: 'Ch. box-2',
                        field: 'chbox2',
            //                        field_1: 'isCurrentRow',
            //                        field: 'isCurrentRow',
                        visible: isColumnVisible.call(this, 'chbox2'),
                        width: 100,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        // https://tabulator.info/docs/6.2/filter#func-custom                  
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered, {TMPL_el_class: "form-select-sm"});                            
                            
                            function onSuccess() {                                
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);                            

                            return selectContainer[0];  
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            $('select', selectContainer).on('change blur', function() {
                                success($(this).val());
                            });
                            
                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter      
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;              
                            
                            if (editMode) {
                                setTimeout(() => {
                                    CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered);
                                });
                                return;
                            } 
                            else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }  
                        },                        
                        //#endregion
                        // </editor-fold>
                    },

                    {
                        title: 'Name',
                        field: 'name',
                        visible: isColumnVisible.call(this, 'name'),
                        width: 150,
                        headerFilter: 'input',
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        headerWordWrap: true,
                        iExcludeFromList: {src:0}, 
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;     

                            if(editMode){
                                var editor = document.createElement('div');

                                // +IR+ change to jquery  also prop is attr
                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered);
                                $(input).attr("list", "browsers");
                                $(input).prop("name","browser");
                                $(input).prop("id","browser");

                                $(editor).append(input);

                                $(editor).append(`
                                    <datalist id="browsers">
                                        <option value="Edge">
                                        <option value="Firefox">
                                        <option value="Chrome">
                                        <option value="Opera">
                                        <option value="Safari">
                                    </datalist>
                                `);
                            
                                return editor;
                            }
                            return cell.getValue()
                        },
                    },
                    {
                        title: 'Email',
                        field: 'email',
                        visible: isColumnVisible.call(this, 'email'),
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                        validator: 'required',
                        formatter: this.iTr_cell_editor_formatterEl,   
                        // 
                            cellMouseEnter: function (event, cell){
                                CustomTabulator.iTr_zoom_or_edit({}, "MouseEnter", event, cell);
                            },
            //                         cellMouseLeave: function (event, cell) {
            //                             CustomTabulator.iTr_zoom_or_edit({}, "MouseLeave", event, cell);
            //                         },
                        cellDblClick: function (event, cell) {
                            // iConsole("cell", {args})
                            // CustomTabulator.TabulatorObj.getEditedCells()[0].
                            // for updating the cell value
                            // cell.setValue("sfdsffdsfsfdsfsdfdf")

                            // const row = cell.getRow();
                            // iConsole({ row });
                            // cell.setValue(row.getData()['phone_number']);

                            CustomTabulator.iTr_zoom_or_edit({  "popo_z" : {"class": "mb-0 close_on_scroll", style: "background-color: #e7e7e9;"}, }, "DblClick", event, cell);

                        },
                    },
                    {
                        title: 'Phone Number',
                        field: 'phone_number',
                        visible: isColumnVisible.call(this, 'phone_number'),
                        headerFilter:"input",
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: this.isFieldEditable,
                    },
                    {
                        title: 'Location',
                        field: 'location',
                        visible: isColumnVisible.call(this, 'location'),
                        width: 130,
                        headerFilter:(cell, onRendered, success, cancel)=>{          
                            const div = $(`<div class="location_header_select"></div>`);                            
                            return div[0];
                        },
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        validator: 'required',
                        editorParams: {
                            autocomplete: 'true',
                            allowEmpty: true,
                            listOnEmpty: true,
                            valuesLookup: true,
                        },
                    },
                    {
                        title: 'Gender',
                        field: 'gender',
                        // editor: 'list',
                        visible: isColumnVisible.call(this, 'gender'),
                        headerFilter:(cell, onRendered, success, cancel)=>{          
                            const div = $(`<div class="gender_header_select"></div>`);                            
                            return div[0];
                        },
                        editable: this.isFieldEditable,
                        // headerFilter: 'list',
                        headerFilterParams: {
                            values: { male: 'Male', female: 'Female' },
                            clearable: true,
                        },
                        validator: 'required',
                        width: 120,
                        formatterPrint: function printFormatter(cell, formatterParams, onRendered) {
                            iConsole(cell.getValue(), '');
                            return cell.getValue() == 'male' ? '1' : '0';
                        },
                        accessorDownload: function (value, data, type, params, column) {
                            return value == 'male' ? '1' : '0';
                        },
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;     

                            if(editMode){
                                var editor = document.createElement('div');

                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered)
                                $(input).attr("list", "gender-list")
                                $(input).prop("name","gender")
                                $(input).prop("id","gender")

                                $(editor).append(input)

                                $(editor).append(`
                                    <datalist id="gender-list">
                                        <option value="male">
                                        <option value="female">
                                    </datalist>
                                `);
                            
                                return editor;
                            }
                            return cell.getValue()
                        },
                    },
                    {
                        title: 'Favourite Color',
                        field: 'favourite',
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        headerFilter: 'list',
                        validator: 'required',
                        headerFilterParams: { valuesLookup: true, clearable: true },
                        width: 150,
                        visible: isColumnVisible.call(this, 'favourite'),
                    },
                    {
                        title: 'Date Of Birth',
                        field: 'dob',
                        hozAlign: 'center',
                        width: 200,
                        resizable: true,
                        // editor: this.dateEditor,
                        editable: this.isFieldEditable,
                        headerFilter: this.headerDateEditor,
                        validator: 'required',
                        cssClass: 'dob-filter',
                        visible: isColumnVisible.call(this, 'dob'),
                        formatter: this.iTr_cell_date_editor_formatterEl,
                        // formatter: function (cell, formatterParams, onRendered) {
                        //     // return luxon.DateTime.fromJSDate(new Date(cell.getValue())).toFormat('dd/MM/yyyy');
                        // },
                        
                    },
                    {
                        title: 'Manufacturers',
                        field: 'manuf',
                        visible: isColumnVisible.call(this, 'manuf'),
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: this.isFieldEditable,
                        headerFilter:"input"
                    },    
                    {
                        title: '',
                        field: '__dummy__',
                        visible: isColumnVisible.call(this, '__dummy__'),
                        width: 50,     
                        print: false,
                        download: false,
                        headerSort: false,        
                        iExcludeFromList: {src:0, cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown
                    },                
                ]
            },
        },
        exports: {
            types: ['PDF', 'Excel', 'Copy', 'Print'],
            handlers: {
                pdf: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    const { jsPDF } = window.jspdf;
                    const HiddenCols = getHiddenCols.call(currentThis);

                    const data = currentThis
                        .getData()
                        .map((row) => {
                            // delete rowSelection column
                            delete row.rowSelection;
                            Object.keys(row).forEach((key) => {
                                if (HiddenCols.includes(key)) {
                                    delete row[key];
                                }
                            });
                            if (row.gender) {
                                if (row.gender == 'male') {
                                    row.gender = `1`;
                                }
                                if (row.gender == 'female') {
                                    row.gender = `2`;
                                }
                            }
                            return row;
                        })
                        .map((row) => Object.values(row));

                    // Define columns
                    const columns = currentThis
                        .getColumns()
                        .map((column) => (column.isVisible() ? column.getDefinition() : null))
                        .filter((col) => col != null && col?.field != 'rowSelection');

                    // First pass: Create a temporary document to get the total page count
                    const tempDoc = new jsPDF();
                    tempDoc.autoTable({
                        head: [columns],
                        body: data,
                        startY: 0,
                    });
                    const totalPages = tempDoc.internal.getNumberOfPages();

                    // Second pass: Create the final document with footer
                    const finalDoc = new jsPDF();

                    const pageDimensions = finalDoc.internal.pageSize;
                    const pageHeight = pageDimensions.height ? pageDimensions.height : pageDimensions.getHeight();
                    const pageWidth = pageDimensions.width ? pageDimensions.width : pageDimensions.getWidth();

                    finalDoc.autoTable({
                        head: [columns],
                        body: data,
                        styles: {
                            fontSize: 7,
                        },
                        startY: 14,
                        didDrawPage: async function (data) {
                            const { left: leftMargin, right: rightMargin } = data.settings.margin;
                            const timeStamp = getCurrentTimestamp();

                            // add header
                            finalDoc.setFontSize(10);
                            const headerText = 'User Report';
                            const headerWidth = finalDoc.getTextWidth(headerText);
                            finalDoc.text(headerText, pageWidth / 2 - headerWidth / 2, 8);

                            // left part of the footer
                            let x;
                            let y;
                            let bottomY = pageHeight - 10;

                            const textWidth = finalDoc.getTextWidth('Power by');

                            finalDoc.text('Power by', leftMargin, bottomY);
                            finalDoc.setTextColor(blueColor);

                            const linkWidth = finalDoc.textWithLink('Ai-RGUS.com', (x = leftMargin + textWidth + 1), bottomY, {
                                url: 'https://ai-rgus.com/home',
                            });
                            finalDoc.setDrawColor(blueColor);
                            finalDoc.setLineWidth(0.2);
                            finalDoc.line(x, (y = pageHeight - 9), x + linkWidth, y);

                            finalDoc.setTextColor('#000');
                            finalDoc.text(timeStamp, x + linkWidth + 2, bottomY);

                            // right part of footer
                            const pageNoWidth = finalDoc.getTextWidth('Page ' + data.pageNumber + ' of ' + totalPages);
                            finalDoc.text(
                                'Page ' + data.pageNumber + ' of ' + totalPages,
                                pageWidth - pageNoWidth - rightMargin,
                                pageHeight - 10
                            );
                        },
                    });

                    finalDoc.save('table.pdf');
                },
                excel: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    currentThis.download('xlsx', `${currentThis.localStorageKey}.xlsx`, {
                        title: 'Report',
                        orientation: 'portrait'
                    });
                },
                print: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    currentThis.print(false, true, {});
                }
            }
        }
    });

    CustomTabulator.TabulatorObj.on('dataLoading', () => {
        // scroll the row into view
        expand_row_def.scrollRowTblAfterLoad?.(row);
    });

    CustomTabulator.TabulatorObj.on('tableBuilt', () => {        
        // logic for tooltip adding in column headers        
        const tooltipColumns = [
            { field: 'email', content: '<span>email</span>', customClass: 'tooltip-info tt_width-600', position: 'top' },
            { field: 'location', content: 'location content', position: 'bottom' },
            // { field: 'gender', content: 'location content',position:"bottom", customToolTipItem: $('.add-new-row-btn').clone(true).removeClass("add-new-row-btn") },
            { field: 'gender', content: $('div[tt_for-field=location]').clone(true).html(), position: 'bottom' },
        ];
        addTooltipToTheColumns(CustomTabulator, tooltipColumns);        
                
        // <editor-fold defaultstate="collapsed" desc=" for header filter in table - Location dropdown ">
        //#region -for header filter in table - Location dropdown
        let uniqueLocations = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.location] = (acc[obj.location] || 0) + 1; 
            return acc;
        }, {});        
        let uniqueLocationsArray = Object.entries(uniqueLocations).map(([location, count]) => {
            return { field: location, title: `${location} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueLocationsArray.sort((a, b) => a.field.localeCompare(b.field));
        
        const dropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueLocationsArray, exludeBy: "src" },
            TabulatorObj : CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const location_nm = $(e.target).attr("value");

                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            row.select();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            row.deselect();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.location] = (acc[obj.location] || 0) + 1; 
                    return acc;
                }, {});

                 // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button', dropdown).attr("id");                    
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected' ,drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);                        
                });

                return true;                
            }
            
        });
        // $(".location_header_select").append(dropdown);
        $($(".location_header_select", $(CustomTabulator.TabulatorObj.element.closest(".table-container")))[0]).append(dropdown);

        //#endregion
                // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" for header filter in table - Gender dropdown ">
        //#region -for header filter in table - gender dropdown
        let uniqueGender = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
            return acc;
        }, {});
        
        let uniqueGenderArray = Object.entries(uniqueGender).map(([gender, count]) => {
            return { field: gender, title: `${gender} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueGenderArray.sort((a, b) => a.field.localeCompare(b.field));


        const genderDropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueGenderArray, exludeBy: "src" },
            TabulatorObj: CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const gend = $(e.target).attr("value");

                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            row.select();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            row.deselect();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
                    return acc;
                }, {});
                
                // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button' ,genderDropdown).attr("id");
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected',drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);
                });

                return true;        
            }            
        });
        // $(".gender_header_select").append(genderDropdown);
        $($(".gender_header_select", $(CustomTabulator.TabulatorObj.element.closest(".table-container")))[0]).append(genderDropdown);

        //#endregion
        // </editor-fold>
    });
    $('[data-bs-toggle="tooltip"]').tooltip();
    CustomTabulator.TabulatorObj.on('scrollVertical',()=> {
        $.each($(".popover .close_on_scroll"), function(inx, el){
                $(el).closest(".popover").remove();
        });
    });
      
    //#endregion
    // </editor-fold>    
}
//#endregion
// </editor-fold>
//#endregion
// </editor-fold>


$('body').on('click', function (e) {
    hidePopDropdowns(e.target);
/*
    iConsole("i am coding", e.target)
	// aria-describedby
    $('.popover.show').each(function () {

        // if($(this).attr('id') != )
        // hide any open popovers when the anywhere else in the body is clicked
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
            $(this).popover('hide');
        }
    });*/
});

function hidePopDropdowns(_this){
    iConsole(_this);
    // console.log({element: _this})
    if($(_this).prop("tagName").toLowerCase() === 'i'){
        _this = $(_this).closest('button');
    }
    
    if($(_this).hasClass("dropdown-toggle")){
        return;
    }
    
    
    iBS_hideAll_Dropdowns();
    iBS_hideAll_Popovers();
    
    /*
    $.each($(".popover.show"), function(inx, el){
        iConsole(el[0], _this[0]);
        if($(el).attr("id") !== $(_this).attr("aria-describedby")){
            $(el).remove();
        }
    });
    
//    data-bs-toggle="dropdown"
    $.each($(".dropdown-menu.show"), function(inx, el){
//        if($(el).siblings ) 
        $(".dropdown-menu.show").removeClass("show");
    });
            
    */
}

/* document.addEventListener('click', function (event) {
    // Check if the click is outside any popover trigger or popover itself
    // if (!event.target.closest('.popover') && !event.target.closest('[data-bs-toggle="popover"]')) {
    //     const popoverTriggerList = [].slice.call($('.popover.show'));
    //     console.log({popoverTriggerList}, document.querySelectorAll('.popover'))
    //     const popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    //         return popoverTriggerEl;
    //     });
    //     popoverList.forEach(function (popover) {
    //         console.log({click:"click"})
    //         $(popover).hide();
    //     });
    // }
});  */


function iTr_listen_resize(row){

    $(window).resize(()=>{
        $(".table-container",row.getElement()).attr("style",`width: ${$(row.getElement()).closest(".tabulator-tableholder").width() - 22}px`)
    });

}



// <editor-fold defaultstate="collapsed" desc="multi_tbl-1">
//#region multi_tbl-1
let multi_tbl_1 = () => {
    const tableId = 'multi-table-1';
    const tableContainer = '.multi-table-1-container';

    const CustomTabulator = new FeaturedTable('paginated-local', '#' + tableId, {
        tableContainer,
        tableLocalStorageKey: tableId,
        DefaultHiddenColumns: ['__chbox2'], // To activate this option
//        _tbl_format : "TMPL_tbl_toolbars_f01",
//        _tbl_controlers : {                    
//            "TMPL_tbl_toolbars_f01":[{"tbl_read_mode":{"c": "me-2"}},{'rowEditing':{"c": "me-2"}},{'tbl_multy_purps':{"c": "me-2"}},{'tblSearch':{"c": "me-2", "input_w": 350}},{'tblColVisibility':{"c": "me-2"}},{'tblExport':{"c": "me-2"}},{'tblSettings':{"c": ""}}]
//        },
        TabulatorInitOptions: {
            ajaxURL: 'php/iDBcode.php',
            // ajaxURL: 'https://dev1a.ai-rgus.com/php/users.php',
            masterFilterURL: 'https://dev1a.ai-rgus.com/php/master-filter.php', // +IR+ what is it and when we use it?
            rowHeight:40,

            sortMode: 'local',
            filterMode: 'local',
            keybindings:{
                "scrollToStart":false,
                "scrollToEnd":false,
            },
            customSorters: () => {
                // enable sorting buttons                                

                $(`${tableContainer} .sort-by-btns button`).on('click', (e) => {
                    const sortBy = $(e.target).data('sort-by');
                    $(`${tableContainer} .sort-by-btns button`).removeClass("active")
                    if (sortBy == "reset") {
                        CustomTabulator.TabulatorObj.clearSort();
                    } else {
                        CustomTabulator.TabulatorObj.setSort(sortBy);
                        $(e.target).addClass("active");
                    }
                });
            },
            pagination: false,
            height: `${$('.table_w').height() - 250}px`, // we do not yet have the real table position or the table header element

            //  We do not use this option as it create other issue. We manage these thing ourself by creating custom checkbox and it's state
            //            selectableRows:true,
            //                rowHeader: {formatter:"rowSelection", titleFormatter:"rowSelection", titleFormatterParams:{
            //                    rowRange:"active" //only toggle the values of the active filtered rows
            //                }, hozAlign:"center", headerSort:false},

            // iTr_ajaxResponse: function (url, params, response) {
            //     //                iConsole("------------ iTr_ajaxResponse --------------", url, params, response);
            //     return response['dtRows'];
            // },
            
            iTr_add_new_row_before: function (fieldData) {
                // Because fieldData is an obj it is coming here by ref. any change will be avilable to the calling fn.
                fieldData.chbox = 1;
                fieldData.chbox2 = 0;
                fieldData.name = "New Data";
                return true;
            },
            iTr_add_new_row_after: function (fieldData) {},

            iTr_row_save_before: function (TabulatorObj, ...fieldData) {
                iConsole('------------ iTr_row_save_before --------------');
                iConsole({ fieldData }, TabulatorObj);
                return true;
            },

            iTr_row_save_after: function (newData) {
                $.ajax({
                    method: 'POST',
                    url: 'php/update-user.php',
                    dataType: 'json',
                    headers: {
                        csrftoken: _userStr,
                    },
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(newData),
                }).done((res) => {
                    if (res.success == 1) {
                        CustomTabulator.updateRowStatus();
                    } else {
                        alert(res.data?.error || 'Something went wrong');
                    }
                });
            },

            printHeader: function () {
                return "<h1 class='w-100 text-center fs-4 pb-2 border-bottom border-dark mb-2'>Report</h1>";
            },
            printFooter: function () {
                const timeStamp = luxon.DateTime.fromJSDate(new Date()).toFormat('LLLL dd, yyyy, hh:mm');

                return `<div class='w-100 mt-4 border-top pt-2 border-dark d-flex justify-content-between'>
                <div class="d-flex gap-2">
                    <a href="http://ai-rgus.com/" class='fs-6'>Ai-RGUS.COM</a>
                    <span class='fs-6'>${timeStamp}</span>
                </div>
            </div>`;
            },
            printFormatter: (tableHolder, table) => {
                $(table).css({ 'margin-top': '20px', 'margin-bottom': '20px' });
                $(table).find('thead th').css({ 'font-size': '11px' });
                $(table).find('tbody td').css({ 'font-size': '12px' });
            },
            printRowRange: 'all',
              
            // <editor-fold defaultstate="collapsed" desc=" columnsObj ">
            //#region columnsObj
            columnsObj: function () {
                return [
                    {
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: '',
                        field: 'rowExpand',
                        width: 30,
                        print: false,
                        download: false,
                        iExcludeFromList: {src:0, cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown       
                        expandToKeyData : "gender",
                        
                        formatter: function (cell, formatterParams, onRendered) {                            
                            let el = CustomTabulator.cellF_rowExpand(cell, formatterParams, onRendered,expandRowWithNestedTable_Level1);
                            return el;
                        },   
                        increaseTblHeight: function(row){
                            $(CustomTabulator.TabulatorObj.element).attr('style', "height:1100px !important");
                        },
                        scrollRowTblAfterLoad: function(row){
                            // row.getElement().scrollIntoView({block:"end"});
                            CustomTabulator.TabulatorObj.scrollToRow(row, "top", false)

                            // this is not working
                            // row.getElement().scrollIntoView({block:"end",behavior:"smooth"});
                        }
                    },
                    {
                        formatter: 'rowSelection',
                        titleFormatter: 'rowSelection',
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: 'Select',
                        field: 'rowSelection',
                        width: 60,
                        print: false,
                        download: false,

                        titleFormatterParams: {
                            rowRange: 'active', //only toggle the values of the active filtered rows
                        },
                    },
                    {
                        title: 'ID',
                        field: 'id',
                        width: 60,
                        visible: isColumnVisible.call(this, 'id'),
                        iExcludeFromList: {cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                    {
                        title: 'Ch. box',
                        field: 'chbox',
                        visible: isColumnVisible.call(this, 'act'),
                        width: 90,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered, {TMPL_el_class: "form-select-sm"});                            
                            
                            function onSuccess() {                                
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);                            

                            return selectContainer[0];  
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            function onSuccess() {                                
                                success($('select', selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }

                            $('select', selectContainer).on('change blur', onSuccess);                            

                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;              
                            
                            if (editMode) {
                                setTimeout(() => {
                                    CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered);
                                });
                                return;
                            } 
                            else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }  
                        },                        
                        //#endregion
                        // </editor-fold>
                    },
                    {
                        title: 'Ch. box-2',
                        field: 'chbox2',
//                        field_1: 'isCurrentRow',
//                        field: 'isCurrentRow',
                        visible: isColumnVisible.call(this, 'chbox2'),
                        width: 100,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        // https://tabulator.info/docs/6.2/filter#func-custom                  
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered, {TMPL_el_class: "form-select-sm"});                            
                            
                            function onSuccess() {                                
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);                            

                            return selectContainer[0];  
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            $('select', selectContainer).on('change blur', function() {
                                success($(this).val());
                            });
                            
                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter      
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;              
                            
                            if (editMode) {
                                setTimeout(() => {
                                    CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered);
                                });
                                return;
                            } 
                            else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }  
                        },                        
                        //#endregion
                        // </editor-fold>
                    },

                    {
                        title: 'Name',
                        field: 'name',
                        visible: isColumnVisible.call(this, 'name'),
                        width: 150,
                        headerFilter: 'input',
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        headerWordWrap: true,
                        iExcludeFromList: {src:0}, 
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;     

                            if(editMode){
                                var editor = document.createElement('div');

                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered)
                                $(input).attr("list", "browsers")
                                $(input).prop("name","browser")
                                $(input).prop("id","browser")

                                $(editor).append(input)

                                $(editor).append(`
                                    <datalist id="browsers">
                                        <option value="Edge">
                                        <option value="Firefox">
                                        <option value="Chrome">
                                        <option value="Opera">
                                        <option value="Safari">
                                    </datalist>
                                `);
                          
                                return editor;
                            }
                            return cell.getValue()
                        },
                    },
                    {
                        title: 'Email',
                        field: 'email',
                        visible: isColumnVisible.call(this, 'email'),
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                        validator: 'required',
                        formatter: this.iTr_cell_editor_formatterEl,   
                        // 
                         cellMouseEnter: function (event, cell){
                             CustomTabulator.iTr_zoom_or_edit({}, "MouseEnter", event, cell);
                         },
//                         cellMouseLeave: function (event, cell) {
//                             CustomTabulator.iTr_zoom_or_edit({}, "MouseLeave", event, cell);
//                         },
                        cellDblClick: function (event, cell) {
                            // iConsole("cell", {args})
                            // CustomTabulator.TabulatorObj.getEditedCells()[0].
                            // for updating the cell value
                            // cell.setValue("sfdsffdsfsfdsfsdfdf")

                            // const row = cell.getRow();
                            // iConsole({ row });
                            // cell.setValue(row.getData()['phone_number']);

                            CustomTabulator.iTr_zoom_or_edit({  "popo_z" : {"class": "mb-0 close_on_scroll", style: "background-color: #e7e7e9;"}, }, "DblClick", event, cell);

                        },
                    },
                    {
                        title: 'Phone Number',
                        field: 'phone_number',
                        visible: isColumnVisible.call(this, 'phone_number'),
                        headerFilter:"input",
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: false,
                    },
                    {
                        title: 'Location',
                        field: 'location',
                        visible: isColumnVisible.call(this, 'location'),
                        width: 130,
                        headerFilter:(cell, onRendered, success, cancel)=>{          
                           const div = $(`<div class="location_header_select"></div>`);                            
                           return div[0];
                        },
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        validator: 'required',
                        editorParams: {
                            autocomplete: 'true',
                            allowEmpty: true,
                            listOnEmpty: true,
                            valuesLookup: true,
                        },
                    },
                    {
                        title: 'Gender',
                        field: 'gender',
                        // editor: 'list',
                        visible: isColumnVisible.call(this, 'gender'),
                        headerFilter:(cell, onRendered, success, cancel)=>{          
                            const div = $(`<div class="gender_header_select"></div>`);                            
                            return div[0];
                        },
                        editable: this.isFieldEditable,
                        // headerFilter: 'list',
                        headerFilterParams: {
                            values: { male: 'Male', female: 'Female' },
                            clearable: true,
                        },
                        validator: 'required',
                        width: 120,
                        formatterPrint: function printFormatter(cell, formatterParams, onRendered) {
                            iConsole(cell.getValue(), '');
                            return cell.getValue() == 'male' ? '1' : '0';
                        },
                        accessorDownload: function (value, data, type, params, column) {
                            return value == 'male' ? '1' : '0';
                        },
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;     

                            if(editMode){
                                var editor = document.createElement('div');

                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered)
                                $(input).attr("list", "gender-list")
                                $(input).prop("name","gender")
                                $(input).prop("id","gender")

                                $(editor).append(input)

                                $(editor).append(`
                                    <datalist id="gender-list">
                                        <option value="male">
                                        <option value="female">
                                    </datalist>
                                `);
                          
                                return editor;
                            }
                            return cell.getValue()
                        },
                    },
                    {
                        title: 'Favourite Color',
                        field: 'favourite',
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        headerFilter: 'list',
                        validator: 'required',
                        headerFilterParams: { valuesLookup: true, clearable: true },
                        width: 150,
                        visible: isColumnVisible.call(this, 'favourite'),
                    },
                    {
                        title: 'Date Of Birth',
                        field: 'dob',
                        hozAlign: 'center',
                        width: 200,
                        resizable: true,
                        // editor: this.dateEditor,
                        editable: this.isFieldEditable,
                        headerFilter: this.headerDateEditor,
                        validator: 'required',
                        cssClass: 'dob-filter',
                        visible: isColumnVisible.call(this, 'dob'),
                        formatter: this.iTr_cell_date_editor_formatterEl,
                        // formatter: function (cell, formatterParams, onRendered) {
                        //     // return luxon.DateTime.fromJSDate(new Date(cell.getValue())).toFormat('dd/MM/yyyy');
                        // },
                        
                    },
                    {
                        title: 'Manufacturers',
                        field: 'manuf',
                        visible: isColumnVisible.call(this, 'manuf'),
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: this.isFieldEditable,
                        headerFilter:"input"
                    },    
                    {
                        title: '',
                        field: '__dummy__',
                        visible: isColumnVisible.call(this, '__dummy__'),
                        width: 350,     
                        print: false,
                        download: false,
                        headerSort: false,        
                        iExcludeFromList: {src:0, cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown
                    },                
                ];
            },
            //#endregion
            // </editor-fold>            
            
            // <editor-fold defaultstate="collapsed" desc=" iTr_rowFormatter_ before|after ">
            //#region -iTr_rowFormatter_ before|after
            iTr_rowFormatter_before: function (row) {
//                iConsole("------------ Table obj's rowFormatter Before ------------  ");
                
                var data = row.getData();
//                if(data.isCurrentRow?.edit_mode || data.isCurrentRow?.edit_mode)
                $(row.getElement()).attr('data-location', data.location);

                if (data.location == 'India') {
                    row.getCell('location').getElement().style.color = 'blue';
                }
                if (data.location == 'China') {
                    $(row.getElement()).addClass('china');

                    // add custom html to the cell
                    row.getCell('location').getElement().innerHTML = `<a href='google.com'>${data.location}</a>`;
                }
                
                if (row.getData().isCurrentRow?.edit_mode) {
                    $(row.getElement()).removeClass('china');
                }                
                
                return true;                
            },
            iTr_rowFormatter_after: function (row){
//                iConsole("------------ Table obj's rowFormatter After ------------  ");
            },
            handleFieldUpdateValidation: function (fieldData) {
                iConsole({ fieldData }, this);
                return false;
            },

            iTr_afterSave: function (response) {
                console.clear();
                iConsole(this);
                iConsole('ITSIK: After save', response);
            }, 
            //#endregion
                        // </editor-fold>
        },
        // <editor-fold defaultstate="collapsed" desc=" exports ">
        //#region -exports
        exports: {
            types: ['PDF', 'Excel', 'Copy', 'Print'],
            handlers: {
                pdf: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    const { jsPDF } = window.jspdf;
                    const HiddenCols = getHiddenCols.call(currentThis);

                    const data = currentThis
                        .getData()
                        .map((row) => {
                            // delete rowSelection column
                            delete row.rowSelection;
                            Object.keys(row).forEach((key) => {
                                if (HiddenCols.includes(key)) {
                                    delete row[key];
                                }
                            });
                            if (row.gender) {
                                if (row.gender == 'male') {
                                    row.gender = `1`;
                                }
                                if (row.gender == 'female') {
                                    row.gender = `2`;
                                }
                            }
                            return row;
                        })
                        .map((row) => Object.values(row));

                    // Define columns
                    const columns = currentThis
                        .getColumns()
                        .map((column) => (column.isVisible() ? column.getDefinition() : null))
                        .filter((col) => col != null && col?.field != 'rowSelection');

                    // First pass: Create a temporary document to get the total page count
                    const tempDoc = new jsPDF();
                    tempDoc.autoTable({
                        head: [columns],
                        body: data,
                        startY: 0,
                    });
                    const totalPages = tempDoc.internal.getNumberOfPages();

                    // Second pass: Create the final document with footer
                    const finalDoc = new jsPDF();

                    const pageDimensions = finalDoc.internal.pageSize;
                    const pageHeight = pageDimensions.height ? pageDimensions.height : pageDimensions.getHeight();
                    const pageWidth = pageDimensions.width ? pageDimensions.width : pageDimensions.getWidth();
                    finalDoc.autoTable({
                        head: [columns],
                        body: data,
                        styles: {
                            fontSize: 7,
                        },
                        startY: 14,
                        didDrawPage: async function (data) {
                            const { left: leftMargin, right: rightMargin } = data.settings.margin;
                            const timeStamp = getCurrentTimestamp();

                            // add header
                            finalDoc.setFontSize(10);
                            const headerText = 'User Report';
                            const headerWidth = finalDoc.getTextWidth(headerText);
                            finalDoc.text(headerText, pageWidth / 2 - headerWidth / 2, 8);

                            // left part of the footer
                            let x;
                            let y;
                            let bottomY = pageHeight - 10;

                            const textWidth = finalDoc.getTextWidth('Power by');

                            finalDoc.text('Power by', leftMargin, bottomY);
                            finalDoc.setTextColor(blueColor);

                            const linkWidth = finalDoc.textWithLink('Ai-RGUS.com', (x = leftMargin + textWidth + 1), bottomY, {
                                url: 'https://ai-rgus.com/home',
                            });
                            finalDoc.setDrawColor(blueColor);
                            finalDoc.setLineWidth(0.2);
                            finalDoc.line(x, (y = pageHeight - 9), x + linkWidth, y);

                            finalDoc.setTextColor('#000');
                            finalDoc.text(timeStamp, x + linkWidth + 2, bottomY);

                            // right part of footer
                            const pageNoWidth = finalDoc.getTextWidth('Page ' + data.pageNumber + ' of ' + totalPages);
                            finalDoc.text(
                                'Page ' + data.pageNumber + ' of ' + totalPages,
                                pageWidth - pageNoWidth - rightMargin,
                                pageHeight - 10
                            );
                        },
                    });

                    finalDoc.save('table.pdf');
                },
                excel: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    currentThis.download('xlsx', `${currentThis.localStorageKey}.xlsx`, {
                        title: 'Report',
                        orientation: 'portrait'
                    });
                },
                print: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    currentThis.print(false, true, {});
                }
            }
        }
        //#endregion
        // </editor-fold>
    });
    window.tempTable = CustomTabulator; // +info+ adding to global object to access it from developer tools and anywhere else in the code for debugging

    CustomTabulator.TabulatorObj.on('tableBuilt', () => {
        // logic for tooltip adding in column headers        
        const tooltipColumns = [
            { field: 'email', content: '<span>email</span>', customClass: 'tooltip-info tt_width-600', position: 'top' },
            { field: 'location', content: 'location content', position: 'bottom' },
            // { field: 'gender', content: 'location content',position:"bottom", customToolTipItem: $('.add-new-row-btn').clone(true).removeClass("add-new-row-btn") },
            { field: 'gender', content: $('div[tt_for-field=location]').clone(true).html(), position: 'bottom' },
        ];
        addTooltipToTheColumns(CustomTabulator, tooltipColumns);        
                
        // <editor-fold defaultstate="collapsed" desc=" for header filter in table - Location dropdown ">
        //#region -for header filter in table - Location dropdown
        let uniqueLocations = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.location] = (acc[obj.location] || 0) + 1; 
            return acc;
        }, {});        
        let uniqueLocationsArray = Object.entries(uniqueLocations).map(([location, count]) => {
            return { field: location, title: `${location} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueLocationsArray.sort((a, b) => a.field.localeCompare(b.field));
        
        const dropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueLocationsArray, exludeBy: "src" },
            TabulatorObj : CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const location_nm = $(e.target).attr("value");

                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            row.select();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            row.deselect();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.location] = (acc[obj.location] || 0) + 1; 
                    return acc;
                }, {});

                 // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button', dropdown).attr("id");                    
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected' ,drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);                        
                });

                return true;                
            }
            
        });
        // $(".location_header_select").append(dropdown);
        $($(".location_header_select", $(CustomTabulator.TabulatorObj.element.closest(".multi-table-1-container")))[0]).append(dropdown);

        //#endregion
                // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" for header filter in table - Gender dropdown ">
        //#region -for header filter in table - gender dropdown
        let uniqueGender = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
            return acc;
        }, {});
        
        let uniqueGenderArray = Object.entries(uniqueGender).map(([gender, count]) => {
            return { field: gender, title: `${gender} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueGenderArray.sort((a, b) => a.field.localeCompare(b.field));


        const genderDropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueGenderArray, exludeBy: "src" },
            TabulatorObj: CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const gend = $(e.target).attr("value");

                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            row.select();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            row.deselect();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
                    return acc;
                }, {});
                
                // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button' ,genderDropdown).attr("id");
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected',drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);
                });

                return true;        
            }            
        });
        // $(".gender_header_select").append(genderDropdown);
        $($(".gender_header_select", $(CustomTabulator.TabulatorObj.element.closest(".multi-table-1-container")))[0]).append(genderDropdown);

        //#endregion
        // </editor-fold>
    });
    $('[data-bs-toggle="tooltip"]').tooltip();
    CustomTabulator.TabulatorObj.on('scrollVertical',()=> {
        $.each($(".popover .close_on_scroll"), function(inx, el){
                $(el).closest(".popover").remove();
        });
    });

};
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc="multi_tbl-1">
//#region multi_tbl-1
let multi_tbl_2 = () => {
    const tableId = 'multi-table-2';
    const tableContainer = '.multi-table-2-container';

    const CustomTabulator = new FeaturedTable('paginated-local', '#' + tableId, {
        tableContainer,
        tableLocalStorageKey: tableId,
        DefaultHiddenColumns: ['__chbox2'], // To activate this option
//        _tbl_format : "TMPL_tbl_toolbars_f01",
//        _tbl_controlers : {                    
//            "TMPL_tbl_toolbars_f01":[{"tbl_read_mode":{"c": "me-2"}},{'rowEditing':{"c": "me-2"}},{'tbl_multy_purps':{"c": "me-2"}},{'tblSearch':{"c": "me-2", "input_w": 350}},{'tblColVisibility':{"c": "me-2"}},{'tblExport':{"c": "me-2"}},{'tblSettings':{"c": ""}}]
//        },
        TabulatorInitOptions: {
            ajaxURL: 'php/iDBcode.php',
            // ajaxURL: 'https://dev1a.ai-rgus.com/php/users.php',
            masterFilterURL: 'https://dev1a.ai-rgus.com/php/master-filter.php', // +IR+ what is it and when we use it?
            rowHeight:40,

            sortMode: 'local',
            filterMode: 'local',
            keybindings:{
                "scrollToStart":false,
                "scrollToEnd":false,
            },
            customSorters: () => {
                // enable sorting buttons                                

                $(`${tableContainer} .sort-by-btns button`).on('click', (e) => {
                    const sortBy = $(e.target).data('sort-by');
                    $(`${tableContainer} .sort-by-btns button`).removeClass("active")
                    if (sortBy == "reset") {
                        CustomTabulator.TabulatorObj.clearSort();
                    } else {
                        CustomTabulator.TabulatorObj.setSort(sortBy);
                        $(e.target).addClass("active");
                    }
                });
            },
            pagination: false,
            height: `${$('.table_w').height() - 250}px`, // we do not yet have the real table position or the table header element

            //  We do not use this option as it create other issue. We manage these thing ourself by creating custom checkbox and it's state
            //            selectableRows:true,
            //                rowHeader: {formatter:"rowSelection", titleFormatter:"rowSelection", titleFormatterParams:{
            //                    rowRange:"active" //only toggle the values of the active filtered rows
            //                }, hozAlign:"center", headerSort:false},

            // iTr_ajaxResponse: function (url, params, response) {
            //     //                iConsole("------------ iTr_ajaxResponse --------------", url, params, response);
            //     return response['dtRows'];
            // },
            
            iTr_add_new_row_before: function (fieldData) {
                // Because fieldData is an obj it is coming here by ref. any change will be avilable to the calling fn.
                fieldData.chbox = 1;
                fieldData.chbox2 = 0;
                fieldData.name = "New Data";
                return true;
            },
            iTr_add_new_row_after: function (fieldData) {},

            iTr_row_save_before: function (TabulatorObj, ...fieldData) {
                iConsole('------------ iTr_row_save_before --------------');
                iConsole({ fieldData }, TabulatorObj);
                return true;
            },

            iTr_row_save_after: function (newData) {
                $.ajax({
                    method: 'POST',
                    url: 'php/update-user.php',
                    dataType: 'json',
                    headers: {
                        csrftoken: _userStr,
                    },
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(newData),
                }).done((res) => {
                    if (res.success == 1) {
                        CustomTabulator.updateRowStatus();
                    } else {
                        alert(res.data?.error || 'Something went wrong');
                    }
                });
            },

            printHeader: function () {
                return "<h1 class='w-100 text-center fs-4 pb-2 border-bottom border-dark mb-2'>Report</h1>";
            },
            printFooter: function () {
                const timeStamp = luxon.DateTime.fromJSDate(new Date()).toFormat('LLLL dd, yyyy, hh:mm');

                return `<div class='w-100 mt-4 border-top pt-2 border-dark d-flex justify-content-between'>
                <div class="d-flex gap-2">
                    <a href="http://ai-rgus.com/" class='fs-6'>Ai-RGUS.COM</a>
                    <span class='fs-6'>${timeStamp}</span>
                </div>
            </div>`;
            },
            printFormatter: (tableHolder, table) => {
                $(table).css({ 'margin-top': '20px', 'margin-bottom': '20px' });
                $(table).find('thead th').css({ 'font-size': '11px' });
                $(table).find('tbody td').css({ 'font-size': '12px' });
            },
            printRowRange: 'all',
              
            // <editor-fold defaultstate="collapsed" desc=" columnsObj ">
            //#region columnsObj
            columnsObj: function () {
                return [
                    {
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: '',
                        field: 'rowExpand',
                        width: 30,
                        print: false,
                        download: false,
                        iExcludeFromList: {src:0, cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown       
                        expandToKeyData : "gender",
                        
                        formatter: function (cell, formatterParams, onRendered) {                            
                            let el = CustomTabulator.cellF_rowExpand(cell, formatterParams, onRendered,expandRowWithNestedTable_Level1);
                            return el;
                        },   
                        increaseTblHeight: function(row){
                            $(CustomTabulator.TabulatorObj.element).attr('style', "height:1100px !important");
                        },
                        scrollRowTblAfterLoad: function(row){
                            // row.getElement().scrollIntoView({block:"end"});
                            CustomTabulator.TabulatorObj.scrollToRow(row, "top", false)

                            // this is not working
                            // row.getElement().scrollIntoView({block:"end",behavior:"smooth"});
                        }
                    },
                    {
                        formatter: 'rowSelection',
                        titleFormatter: 'rowSelection',
                        headerHozAlign: 'center',
                        hozAlign: 'center',
                        vertAlign: 'middle',
                        headerSort: false,
                        title: 'Select',
                        field: 'rowSelection',
                        width: 60,
                        print: false,
                        download: false,

                        titleFormatterParams: {
                            rowRange: 'active', //only toggle the values of the active filtered rows
                        },
                    },
                    {
                        title: 'ID',
                        field: 'id',
                        width: 60,
                        visible: isColumnVisible.call(this, 'id'),
                        iExcludeFromList: {cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown
                    },
                    {
                        title: 'Ch. box',
                        field: 'chbox',
                        visible: isColumnVisible.call(this, 'act'),
                        width: 90,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered, {TMPL_el_class: "form-select-sm"});                            
                            
                            function onSuccess() {                                
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);                            

                            return selectContainer[0];  
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            function onSuccess() {                                
                                success($('select', selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }

                            $('select', selectContainer).on('change blur', onSuccess);                            

                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;              
                            
                            if (editMode) {
                                setTimeout(() => {
                                    CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered);
                                });
                                return;
                            } 
                            else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }  
                        },                        
                        //#endregion
                        // </editor-fold>
                    },
                    {
                        title: 'Ch. box-2',
                        field: 'chbox2',
//                        field_1: 'isCurrentRow',
//                        field: 'isCurrentRow',
                        visible: isColumnVisible.call(this, 'chbox2'),
                        width: 100,
                        // <editor-fold defaultstate="collapsed" desc=" headerFilter ">
                        //#region headerFilter
                        // https://tabulator.info/docs/6.2/filter#func-custom                  
                        headerFilter: function (cell, onRendered, success, cancel) {
                            let selectContainer = CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered, {TMPL_el_class: "form-select-sm"});                            
                            
                            function onSuccess() {                                
                                success($(selectContainer).val());
                                // cell.getRow().update({ changed_chbox: true });
                            }
                            $(selectContainer).on('change blur', onSuccess);                            

                            return selectContainer[0];  
                        },
                        _headerFilter: function (cell, onRendered, success, cancel) {
                            iConsole('--- ch box, headerFilter -----------');
                            const selectContainer = $('#TMPL_chbox_select_element')
                                .clone(true)
                                .removeClass('d-none')
                                .addClass('d-flex')
                                .removeAttr('id');

                            $('select', selectContainer).val(cell.getValue()); // setting the initial value from cell.getValue()

                            $('select', selectContainer).on('change blur', function() {
                                success($(this).val());
                            });
                            
                            return selectContainer[0];
                        },
                        //#endregion
                        // </editor-fold>
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        //                        formatter:"tickCross",
                        hozAlign: 'center',
                        // <editor-fold defaultstate="collapsed" desc=" formatter ">
                        //#region formatter      
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;              
                            
                            if (editMode) {
                                setTimeout(() => {
                                    CustomTabulator.iTr_cell_OnOff_insertEl(cell, onRendered);
                                });
                                return;
                            } 
                            else {
                                return CustomTabulator.iTr_get_icon_element(cell.getValue());
                            }  
                        },                        
                        //#endregion
                        // </editor-fold>
                    },

                    {
                        title: 'Name',
                        field: 'name',
                        visible: isColumnVisible.call(this, 'name'),
                        width: 150,
                        headerFilter: 'input',
                        sorter: 'string',
                        validator: 'required',
                        editable: this.isFieldEditable,
                        headerWordWrap: true,
                        iExcludeFromList: {src:0}, 
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;     

                            if(editMode){
                                var editor = document.createElement('div');

                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered)
                                $(input).attr("list", "browsers")
                                $(input).prop("name","browser")
                                $(input).prop("id","browser")

                                $(editor).append(input)

                                $(editor).append(`
                                    <datalist id="browsers">
                                        <option value="Edge">
                                        <option value="Firefox">
                                        <option value="Chrome">
                                        <option value="Opera">
                                        <option value="Safari">
                                    </datalist>
                                `);
                          
                                return editor;
                            }
                            return cell.getValue()
                        },
                    },
                    {
                        title: 'Email',
                        field: 'email',
                        visible: isColumnVisible.call(this, 'email'),
                        editable: this.isFieldEditable,
                        headerFilter: 'input',
                        validator: 'required',
                        formatter: this.iTr_cell_editor_formatterEl,   
                        // 
                         cellMouseEnter: function (event, cell){
                             CustomTabulator.iTr_zoom_or_edit({}, "MouseEnter", event, cell);
                         },
//                         cellMouseLeave: function (event, cell) {
//                             CustomTabulator.iTr_zoom_or_edit({}, "MouseLeave", event, cell);
//                         },
                        cellDblClick: function (event, cell) {
                            // iConsole("cell", {args})
                            // CustomTabulator.TabulatorObj.getEditedCells()[0].
                            // for updating the cell value
                            // cell.setValue("sfdsffdsfsfdsfsdfdf")

                            // const row = cell.getRow();
                            // iConsole({ row });
                            // cell.setValue(row.getData()['phone_number']);

                            CustomTabulator.iTr_zoom_or_edit({  "popo_z" : {"class": "mb-0 close_on_scroll", style: "background-color: #e7e7e9;"}, }, "DblClick", event, cell);

                        },
                    },
                    {
                        title: 'Phone Number',
                        field: 'phone_number',
                        visible: isColumnVisible.call(this, 'phone_number'),
                        headerFilter:"input",
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: false,
                    },
                    {
                        title: 'Location',
                        field: 'location',
                        visible: isColumnVisible.call(this, 'location'),
                        width: 130,
                        headerFilter:(cell, onRendered, success, cancel)=>{          
                           const div = $(`<div class="location_header_select"></div>`);                            
                           return div[0];
                        },
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        validator: 'required',
                        editorParams: {
                            autocomplete: 'true',
                            allowEmpty: true,
                            listOnEmpty: true,
                            valuesLookup: true,
                        },
                    },
                    {
                        title: 'Gender',
                        field: 'gender',
                        // editor: 'list',
                        visible: isColumnVisible.call(this, 'gender'),
                        headerFilter:(cell, onRendered, success, cancel)=>{          
                            const div = $(`<div class="gender_header_select"></div>`);                            
                            return div[0];
                        },
                        editable: this.isFieldEditable,
                        // headerFilter: 'list',
                        headerFilterParams: {
                            values: { male: 'Male', female: 'Female' },
                            clearable: true,
                        },
                        validator: 'required',
                        width: 120,
                        formatterPrint: function printFormatter(cell, formatterParams, onRendered) {
                            iConsole(cell.getValue(), '');
                            return cell.getValue() == 'male' ? '1' : '0';
                        },
                        accessorDownload: function (value, data, type, params, column) {
                            return value == 'male' ? '1' : '0';
                        },
                        formatter: function (cell, formatterParams, onRendered) {
                            let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;     

                            if(editMode){
                                var editor = document.createElement('div');

                                const input = CustomTabulator.iTr_cell_input_insertEl(cell, onRendered)
                                $(input).attr("list", "gender-list")
                                $(input).prop("name","gender")
                                $(input).prop("id","gender")

                                $(editor).append(input)

                                $(editor).append(`
                                    <datalist id="gender-list">
                                        <option value="male">
                                        <option value="female">
                                    </datalist>
                                `);
                          
                                return editor;
                            }
                            return cell.getValue()
                        },
                    },
                    {
                        title: 'Favourite Color',
                        field: 'favourite',
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        editable: this.isFieldEditable,
                        headerFilter: 'list',
                        validator: 'required',
                        headerFilterParams: { valuesLookup: true, clearable: true },
                        width: 150,
                        visible: isColumnVisible.call(this, 'favourite'),
                    },
                    {
                        title: 'Date Of Birth',
                        field: 'dob',
                        hozAlign: 'center',
                        width: 200,
                        resizable: true,
                        // editor: this.dateEditor,
                        editable: this.isFieldEditable,
                        headerFilter: this.headerDateEditor,
                        validator: 'required',
                        cssClass: 'dob-filter',
                        visible: isColumnVisible.call(this, 'dob'),
                        formatter: this.iTr_cell_date_editor_formatterEl,
                        // formatter: function (cell, formatterParams, onRendered) {
                        //     // return luxon.DateTime.fromJSDate(new Date(cell.getValue())).toFormat('dd/MM/yyyy');
                        // },
                        
                    },
                    {
                        title: 'Manufacturers',
                        field: 'manuf',
                        visible: isColumnVisible.call(this, 'manuf'),
                        width: 150,
                        // editor: 'input',
                        formatter: this.iTr_cell_editor_formatterEl,
                        headerSort: true,
                        editable: this.isFieldEditable,
                        headerFilter:"input"
                    },    
                    {
                        title: '',
                        field: '__dummy__',
                        visible: isColumnVisible.call(this, '__dummy__'),
                        width: 350,     
                        print: false,
                        download: false,
                        headerSort: false,        
                        iExcludeFromList: {src:0, cv:0},    // to appear on: scr: search dropdown, v: column visibility dropdown
                    },                
                ];
            },
            //#endregion
            // </editor-fold>            
            
            // <editor-fold defaultstate="collapsed" desc=" iTr_rowFormatter_ before|after ">
            //#region -iTr_rowFormatter_ before|after
            iTr_rowFormatter_before: function (row) {
//                iConsole("------------ Table obj's rowFormatter Before ------------  ");
                
                var data = row.getData();
//                if(data.isCurrentRow?.edit_mode || data.isCurrentRow?.edit_mode)
                $(row.getElement()).attr('data-location', data.location);

                if (data.location == 'India') {
                    row.getCell('location').getElement().style.color = 'blue';
                }
                if (data.location == 'China') {
                    $(row.getElement()).addClass('china');

                    // add custom html to the cell
                    row.getCell('location').getElement().innerHTML = `<a href='google.com'>${data.location}</a>`;
                }
                
                if (row.getData().isCurrentRow?.edit_mode) {
                    $(row.getElement()).removeClass('china');
                }                
                
                return true;                
            },
            iTr_rowFormatter_after: function (row){
//                iConsole("------------ Table obj's rowFormatter After ------------  ");
            },
            handleFieldUpdateValidation: function (fieldData) {
                iConsole({ fieldData }, this);
                return false;
            },

            iTr_afterSave: function (response) {
                console.clear();
                iConsole(this);
                iConsole('ITSIK: After save', response);
            }, 
            //#endregion
                        // </editor-fold>
        },
        // <editor-fold defaultstate="collapsed" desc=" exports ">
        //#region -exports
        exports: {
            types: ['PDF', 'Excel', 'Copy', 'Print'],
            handlers: {
                pdf: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    const { jsPDF } = window.jspdf;
                    const HiddenCols = getHiddenCols.call(currentThis);

                    const data = currentThis
                        .getData()
                        .map((row) => {
                            // delete rowSelection column
                            delete row.rowSelection;
                            Object.keys(row).forEach((key) => {
                                if (HiddenCols.includes(key)) {
                                    delete row[key];
                                }
                            });
                            if (row.gender) {
                                if (row.gender == 'male') {
                                    row.gender = `1`;
                                }
                                if (row.gender == 'female') {
                                    row.gender = `2`;
                                }
                            }
                            return row;
                        })
                        .map((row) => Object.values(row));

                    // Define columns
                    const columns = currentThis
                        .getColumns()
                        .map((column) => (column.isVisible() ? column.getDefinition() : null))
                        .filter((col) => col != null && col?.field != 'rowSelection');

                    // First pass: Create a temporary document to get the total page count
                    const tempDoc = new jsPDF();
                    tempDoc.autoTable({
                        head: [columns],
                        body: data,
                        startY: 0,
                    });
                    const totalPages = tempDoc.internal.getNumberOfPages();

                    // Second pass: Create the final document with footer
                    const finalDoc = new jsPDF();

                    const pageDimensions = finalDoc.internal.pageSize;
                    const pageHeight = pageDimensions.height ? pageDimensions.height : pageDimensions.getHeight();
                    const pageWidth = pageDimensions.width ? pageDimensions.width : pageDimensions.getWidth();
                    finalDoc.autoTable({
                        head: [columns],
                        body: data,
                        styles: {
                            fontSize: 7,
                        },
                        startY: 14,
                        didDrawPage: async function (data) {
                            const { left: leftMargin, right: rightMargin } = data.settings.margin;
                            const timeStamp = getCurrentTimestamp();

                            // add header
                            finalDoc.setFontSize(10);
                            const headerText = 'User Report';
                            const headerWidth = finalDoc.getTextWidth(headerText);
                            finalDoc.text(headerText, pageWidth / 2 - headerWidth / 2, 8);

                            // left part of the footer
                            let x;
                            let y;
                            let bottomY = pageHeight - 10;

                            const textWidth = finalDoc.getTextWidth('Power by');

                            finalDoc.text('Power by', leftMargin, bottomY);
                            finalDoc.setTextColor(blueColor);

                            const linkWidth = finalDoc.textWithLink('Ai-RGUS.com', (x = leftMargin + textWidth + 1), bottomY, {
                                url: 'https://ai-rgus.com/home',
                            });
                            finalDoc.setDrawColor(blueColor);
                            finalDoc.setLineWidth(0.2);
                            finalDoc.line(x, (y = pageHeight - 9), x + linkWidth, y);

                            finalDoc.setTextColor('#000');
                            finalDoc.text(timeStamp, x + linkWidth + 2, bottomY);

                            // right part of footer
                            const pageNoWidth = finalDoc.getTextWidth('Page ' + data.pageNumber + ' of ' + totalPages);
                            finalDoc.text(
                                'Page ' + data.pageNumber + ' of ' + totalPages,
                                pageWidth - pageNoWidth - rightMargin,
                                pageHeight - 10
                            );
                        },
                    });

                    finalDoc.save('table.pdf');
                },
                excel: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    currentThis.download('xlsx', `${currentThis.localStorageKey}.xlsx`, {
                        title: 'Report',
                        orientation: 'portrait'
                    });
                },
                print: function () {
                    const currentThis = CustomTabulator.TabulatorObj;
                    currentThis.print(false, true, {});
                }
            }
        }
        //#endregion
        // </editor-fold>
    });
    window.tempTable = CustomTabulator; // +info+ adding to global object to access it from developer tools and anywhere else in the code for debugging

    CustomTabulator.TabulatorObj.on('tableBuilt', () => {
        // logic for tooltip adding in column headers        
        const tooltipColumns = [
            { field: 'email', content: '<span>email</span>', customClass: 'tooltip-info tt_width-600', position: 'top' },
            { field: 'location', content: 'location content', position: 'bottom' },
            // { field: 'gender', content: 'location content',position:"bottom", customToolTipItem: $('.add-new-row-btn').clone(true).removeClass("add-new-row-btn") },
            { field: 'gender', content: $('div[tt_for-field=location]').clone(true).html(), position: 'bottom' },
        ];
        addTooltipToTheColumns(CustomTabulator, tooltipColumns);        
                
        // <editor-fold defaultstate="collapsed" desc=" for header filter in table - Location dropdown ">
        //#region -for header filter in table - Location dropdown
        let uniqueLocations = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.location] = (acc[obj.location] || 0) + 1; 
            return acc;
        }, {});        
        let uniqueLocationsArray = Object.entries(uniqueLocations).map(([location, count]) => {
            return { field: location, title: `${location} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueLocationsArray.sort((a, b) => a.field.localeCompare(b.field));
        
        const dropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueLocationsArray, exludeBy: "src" },
            TabulatorObj : CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const location_nm = $(e.target).attr("value");

                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            row.select();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().location == location_nm){
                            row.deselect();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.location] = (acc[obj.location] || 0) + 1; 
                    return acc;
                }, {});

                 // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button', dropdown).attr("id");                    
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected' ,drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);                        
                });

                return true;                
            }
            
        });
        // $(".location_header_select").append(dropdown);
        $($(".location_header_select", $(CustomTabulator.TabulatorObj.element.closest(".multi-table-2-container")))[0]).append(dropdown);

        //#endregion
                // </editor-fold>
        // <editor-fold defaultstate="collapsed" desc=" for header filter in table - Gender dropdown ">
        //#region -for header filter in table - gender dropdown
        let uniqueGender = CustomTabulator.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
            return acc;
        }, {});
        
        let uniqueGenderArray = Object.entries(uniqueGender).map(([gender, count]) => {
            return { field: gender, title: `${gender} (<span data-counter="${count}" class="selected">0</span>/${count})`, visible: true, dinm_dd_toCcheck: false };
        });
        uniqueGenderArray.sort((a, b) => a.field.localeCompare(b.field));


        const genderDropdown = iGet_el_SelectDropdown({
            el_w:        { class:"move_ddown_to_body"},
            calling_btn: { class: "form-control form-control-sm border py-1", _style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"}, alt_el: `<span class="pe-2">Select</span>` },
            dd_element:  {class: "iTr_F_01"},
            dd_title:    { text : "Select locations"},
            dd_filter:   { input: {placeholder: "Search location..."}},
            dd_select_all: {class: "d-none"},
            dd_select_list: { data: uniqueGenderArray, exludeBy: "src" },
            TabulatorObj: CustomTabulator.TabulatorObj,            
            fn_onInptChkChange: (e, ops)=>{
                const gend = $(e.target).attr("value");

                if($(e.target).prop("checked")){
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            row.select();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text(counter_el.attr("data-counter"));
                } else {
                    // console.log({col}, 'uncheck')
                    ops.TabulatorObj.getRows().map((row)=>{
                        if(row.getData().gender == gend){
                            row.deselect();
                        }
                    });
                    // updating the select rows count(in label) for the select checkebox
                    const counter_el = $(e.target).closest(".form-check").find(".selected");
                    counter_el.empty().text('0');
                }
            },
            fn_onDropdown_shown: (e, ops)=>{
                let selected_counts = ops.TabulatorObj.getSelectedData().reduce((acc, obj) => {
                    acc[obj.gender] = (acc[obj.gender] || 0) + 1; 
                    return acc;
                }, {});
                
                // setting selected text to 0 if none is selected in table
                const dropdown_id = $('button' ,genderDropdown).attr("id");
                const drop_down = $(`[data-for_seldd_id=${dropdown_id}]`, 'body');
                $('input.form-check-input' ,drop_down).prop("checked", 0);
                $('.selected',drop_down).text("0");

                $.each(selected_counts, function(key, value) {                    
                    let id = $(`.dds_itemsList_w input[value="${key}"]`, `[data-for_seldd_id="${$(e.target).attr("id")}"]`).attr("id");
                    $(`#${id}`).prop("checked", value > 0);
                    $('.selected', `label[for="${id}"]`).text(value);
                });

                return true;        
            }            
        });
        // $(".gender_header_select").append(genderDropdown);
        $($(".gender_header_select", $(CustomTabulator.TabulatorObj.element.closest(".multi-table-2-container")))[0]).append(genderDropdown);

        //#endregion
        // </editor-fold>
    });
    $('[data-bs-toggle="tooltip"]').tooltip();
    CustomTabulator.TabulatorObj.on('scrollVertical',()=> {
        $.each($(".popover .close_on_scroll"), function(inx, el){
                $(el).closest(".popover").remove();
        });
    });

};
//#endregion
// </editor-fold>