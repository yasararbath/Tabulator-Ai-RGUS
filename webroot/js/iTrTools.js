CONSOLE_ON = 1;
let _TESTING_NB = window.location.hostname === 'app.lvh.me'? 0 : 1;    
class FeaturedTable {
    // <editor-fold defaultstate="collapsed" desc=" initilization params ">
    //#region -  initilization params
    initMode = 'infinite-loading'; // [infinite-loading | paginated-local | paginated] +IR+ is 'paginated' for remote paginated?if yes lets add it to the value 'paginated-remote'
    tableContainerElement = $('.infinite-table-container');    
    _tbl_format     = "TMPL_tbl_toolbars_f01";      
    _tbl_controlers = {  // dropdown and settings config        
        "TMPL_tbl_toolbars_f01": [{"tbl_read_mode":{"c": "me-2"}},{'rowEditing':{"c": "me-2"}},{'tbl_multy_purps':{"c": "me-2"}},{'tblSearch':{"c": "me-2", "input_w": 350}},{'tblColVisibility':{"c": "me-2"}},{'tblExport':{"c": "me-2"}},{'tblSettings':{"c": ""}}] ,
        "TMPL_tbl_toolbars_f02": [{"tbl_read_mode":{"c": "me-2"}},{'rowEditing':{"c": "me-2"}}] 
    };      
    _tbl_columns_field_names_reserved = ['isCurrentRow'];
    tbl_ExpandRows = []
        
    DefaultHiddenColumns = [];  // ['dob', 'name']

    // html elements
    rowOperationsContainer = null;
    enableEditRowBtn = null;
    updateEditedRowBtn = null;
    discardEditedRowBtn = null;

    /**
     *
     * @type {import("../types/tabulator.js").Tabulator}
     */
    TabulatorObj = null;

    // tabulator
    currentSelectedRows = [];

    // track editing the rows or not
    isEditing = false;

    // tracking id for selected rows to restore
    selectedRowsSet = new Set();
    editedRowData = null;
    selecteRowStates = { old_data: null };

    // for showing editing row on different pages
    currentPageData = [];

    dropDownIns = null;
    additionalAjaxParams = {};

    AdditionalTabulatorInitOptions = {};
    exports = {};
    localStorageKey = '';
    hasUserFiltered = false;

    // +IR+ to rename to iTrSettings
    TableSettings = {
        filter_by: {
            on_enter: { enabled: true },
            on_type:  { enabled: false, input_value: 500 }
        },
        persist_column_visibility: { enabled: false, hiddenColumns: [] }
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" constructor ">
    //#region -constructor
    /**
     *
     * @param {'paginated' | 'infinite-loading' | 'paginated-local'}  mode
     * @param {string}  TableId
     * @param {{title?:string, TabulatorInitOptions:  import("../types/tabulator.js").Tabulator.Options}} options
     */
    constructor(mode, TableId, options = {}) {
        this.localStorageKey = `${options.tableLocalStorageKey}_tabulator_settings`;
         
        options.iTr_run_before_creatingTr?.(this);  // +IR+ is this a good place to put it?
        
        if (Store.get(this.localStorageKey)) {
            iConsole('-----------', Store.get(this.localStorageKey));
            this.TableSettings = Store.get(this.localStorageKey);
        }
        
        // for initializating the tabulator for 'pagination' and 'infinite-loading' mode
        this.initMode = mode; // ABBR -> initializationMode  (needed to initialize the table with different modes like <local-paginated>|<inifinite-loading>)
        this.AdditionalTabulatorInitOptions = options.TabulatorInitOptions ?? {};
        this.exports = options.exports ?? {};
        this.DefaultHiddenColumns = options.DefaultHiddenColumns || [];
        this._tbl_format = options._tbl_format || this._tbl_format;        
        this._tbl_controlers = options._tbl_controlers?.[this._tbl_format] ?? this._tbl_controlers[this._tbl_format];
        
        this.tableContainerElement = $(options.tableContainer);
        this.rowOperationsContainer = $("#TMPL_actions_template").find('.single-row-operations-container').clone(true);
        this.enableEditRowBtn = $(this.rowOperationsContainer).find('.enable-row-edit-btn');
        this.updateEditedRowBtn = $(this.rowOperationsContainer).find('.update-edited-row-btn');
        this.discardEditedRowBtn = $(this.rowOperationsContainer).find('.discard-edited-row-btn');
        this.duplicateRowBtn = $(this.rowOperationsContainer).find('.duplicate-row-btn');       
        this.deleteRowBtn = $(this.rowOperationsContainer).find('.delete-row-btn');       
        this.addNewRowBtn = $("#TMPL_add-new-row-btn").clone(true).removeAttr("id");
        
        
        this.iTr_columnsObj = options.TabulatorInitOptions.columnsObj;

        // operation events for table row
        $(this.addNewRowBtn).on('click', (e) => this.iHandle_addNewRowBtn(e, 'value1', 'value2'));
        $(this.duplicateRowBtn).on('click', this.iHandle_duplicateRowBtn);
        $(this.enableEditRowBtn).on('click', () => this.enableEditMode());
        $(this.updateEditedRowBtn).on('click', this.handleUpdateEditedRow);
        $(this.discardEditedRowBtn).on('click', this.discardEditRowChanges);
        $(this.deleteRowBtn).on('click', this.iHandle_deleteRow);

        // additional columns sorter
        if (options.TabulatorInitOptions.customSorters) {
            options.TabulatorInitOptions.customSorters();
        }
        // initialize the Tabulator Instance
        this.TabulatorObj = new Tabulator(TableId, this.getInitOptions());        
        this.init();
    }
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" fn: getInitOptions ">
    //#region - fn, getInitOptions
    getInitOptions = () => {
        // const settings = Store.get(this.localStorageKey);
        // iConsole({ settings });
        // if (settings) {
        //     this.TableSettings = settings;
        // }
        /**
         * @type {import("../types/tabulator.js").Tabulator.Options}
         */
        const tableOptions = {
            // <editor-fold defaultstate="collapsed" desc=" COMMENT: list of different options we may use ">
            //#region -COMMENT: list of different options we may use
            // infinite-loading
            /* 
                paginationSize: 30,
                progressiveLoad: 'scroll',
                progressiveLoadScrollMargin: 200, 
            */

            // paginated
            /*
                paginationMode: 'local',    // [remote | local] see also // see also in remote/local section
                pagination: true,
                paginationSize: 100,
                paginationInitialPage: 1,
                paginationCounter: 'rows',
                paginationSizeSelector: [25, 50, 100, 500, 1000, 2500, 5000, 10000, 25000],            
            */

            // remote/local
            /*
                paginationMode: 'remote',   // see also in paginated section
                sortMode: 'remote',
                filterMode: 'remote',
            */
            //#endregion
            // </editor-fold>

            // layouts
            footerElement: "<div class='table-status d-flex justify-content-between w-100 align-items-center'>hi</div>",

            paginationSize: 25,
            validationMode: 'highlight',
            dataLoader: true,
            dataLoaderLoading,
            dataLoaderError,
            virtualDom: true,
            height: '900px',
            sortMode: 'remote',
            filterMode: 'remote',
            placeholderHeaderFilter: 'No Matching Data',
            placeholder: 'No Data Set',
            headerFilterLiveFilterDelay: 500,
            layout: 'fitData', // 'fitColumns',
            debugInvalidOptions: false, // To turn off the warning if Tabulator detects using of an option that is not being watched by a module like iExcludeFromList.
            columns: this.AdditionalTabulatorInitOptions.columnsObj.call(this),   
                                                                        
            // <editor-fold defaultstate="collapsed" desc=" AJAX's code ">
            //#region -AJAX's code
            ajaxConfig: {
                method: 'POST',
                headers: {
                    csrftoken: _userStr, // Add the CSRFToken to the headers
                },
            },
            ajaxParams: function () {
                return { key1: 'value1', key2: 'value2' };
            },
            ajaxURLGenerator: (url, _config, params) => {
                iConsole({ params, url }, this.additionalAjaxParams);
                const sortBy = params?.sort?.map((sortParam) => `${sortParam?.field}:${sortParam?.dir}`).join(',');
                const formattedParams = {
                    page: this.AdditionalTabulatorInitOptions.paginationInitialPage ?? params?.page,
                    per_page: this.AdditionalTabulatorInitOptions.paginationSize ?? params?.size ?? params?.per_page ?? DEFAULT_PAGE_SIZE,
                    ...(sortBy && { sort_by: sortBy }),
                    ...params,
                };

                // global search handler
                if (this.additionalAjaxParams['master_search']) {
                    url = this.additionalAjaxParams['url'];
                    this.additionalAjaxParams['search'] && (formattedParams['search'] = this.additionalAjaxParams['search']);
                    this.additionalAjaxParams['columns'] && (formattedParams['columns'] = this.additionalAjaxParams['columns']);
                }
                params?.filter?.forEach((sortParam) => {
                    if (sortParam?.field) {
                        formattedParams[sortParam.field] = sortParam?.value;
                    }
                });
                // formattedParams += params;
                const searchParams = new URLSearchParams(formattedParams);
                return url + `?${searchParams?.toString()}`;
            },
            ajaxResponse: (url, params, response) => {                
                if(this.initMode == "paginated" || this.initMode == "infinite-loading"){
                    response['data'] = response['dtRows'];
                    return response;
                }

                let dbRows = [];
                
                if (!shouldRunAndProceed(this.AdditionalTabulatorInitOptions.iTr_ajaxResponse, url, params, response)) {
                    return;
                }
                dbRows = response['dbRows'];
                return dbRows;
            },
            //#endregion
            // </editor-fold>
            rowFormatter: function (row) {
                //                iConsole("------------ Tabulatur obj's rowFormatter ------------  ");

                if (!shouldRunAndProceed(this.iTr_rowFormatter_before, row)) {
                    return;
                }

                if (row.getData().isCurrentRow?.edit_mode) {
                    $('input[type="checkbox"]', row.getCell('rowSelection').getElement()).prop('disabled', true);
                }
                if (row.getData().isCurrentRow?.new_row) {
                    $(row.getCell('id').getElement()).addClass("visible-hidden");
                }

                if (row.getCell("rowExpand") && (row.getData().isCurrentRow?.edit_mode || row.getData().isCurrentRow?.new_row)) {
                    // +IR+ How to have the cursor looks like a pointer?
                    $(".expand-btn", row.getCell("rowExpand").getElement()).addClass("disabled").removeClass("btn-success"); //.prop('disabled', true);
                }

                this.iTr_rowFormatter_after?.(row);
            },

            ...this.AdditionalTabulatorInitOptions,
        };


        const hasForbiddenFieldValues = tableOptions.columns.some(col =>
            col.field !== undefined && this._tbl_columns_field_names_reserved.includes(col.field)
        );
        if (hasForbiddenFieldValues) {
            let message = "(iTr msg. 101) You are using a reserved columns field value from this list.\nYou cannot use it.\n\n- "
                + this._tbl_columns_field_names_reserved.join('\n- ');
            alert(message);
        }


        return tableOptions;
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" fn: isFieldEditable ">
    //#region -fn: isFieldEditable
    isFieldEditable = (cell) => {
        //get row data
        // const data = cell.getRow();
        // return data?._row?.modules?.rowSelection?.selected;

        // workaround for enabling the free-form selection of the text for the table cells
        if (cell.getRow() != this.currentSelectedRows[0]) {
            cell.getElement().removeAttribute('tabindex');
        }
        // enable editing on only one selected row when clicked on edit-mode enable btn
        return this.isEditing && cell.getRow() == this.currentSelectedRows[0];
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" editor: headerDateEditor ">
    //#region -editor: headerDateEditor    
//    headerDateEditor = (cell, onRendered, success, cancel) => {
    headerDateEditor = (cell, onRendered, success, cancel, editorParams) => {
        editorParams = { type: "date", ...editorParams};
        
        let ww = {"date": 108, "datetime-local": 170};
        
        const $input = $(`<input class="h-100" type="${editorParams.type}" style="padding: 4px; width: ${ww[editorParams.type]}px;">`)
            .val(cell?.getValue())
            .on('change', function () {
                $btn.removeClass("d-none");
                success($(this).val());
            })
            .on('keydown', function (e) {
                handleKeyDown(e, () => success($(this).val()), cancel);
            });

//        const $btn = $(`<button class="position-relative d-none" title="reset" style="left: -26px; padding: 0px 4px; height: 26px; top: 3px; border: solid 0.5px #c5c5c5;"><i class="fas fa-redo h7_5 position-relative" style="top: -2px;"></i></input>`)
        const $btn = $(`<i class="fas fa-redo position-relative d-none py-1 pe-2" style="top: 7px; background: white; left: -25px; height: 15px;"></i>`)
            .on('click', function () {
                $input.val("");
                $btn.addClass("d-none");
                success(null);
            });

        const div = $('<div class="d-flex flex-row">').append($input).append($btn);

        onRendered(function () {
//            $input.focus();
//            $input.css('height', '100%');
        });

        return div[0];
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" editor: dateEditor ">
    //#region -editor: dateEditor
    // +IR+ editor_Date
    dateEditor = (cell, onRendered, success, cancel) => {
        const date = new Date(cell.getValue());
        const cellValue = DateTime.fromJSDate(date).toFormat('yyyy-MM-dd');

        const input = $('<input>')
            .attr('type', 'date')
            .css({
                padding: '4px',
                width: '100%',
                boxSizing: 'border-box',
            })
            .val(cellValue)
            .on('change', function () {
                if ($(this).val() !== cellValue) {
                    success(DateTime.fromFormat($(this).val(), 'yyyy-MM-dd').toFormat('yyyy-MM-dd'));
                } else {
                    success(cell.getValue());
                }
            })
            .on('keydown', function (e) {
                handleKeyDown(
                    e,
                    () => {
                        if ($(this).val() !== cellValue) {
                            success(DateTime.fromFormat($(this).val(), 'yyyy-MM-dd').toFormat('yyyy-MM-dd'));
                        } else {
                            success(cell.getValue());
                        }
                    },
                    cancel
                );
            });

        onRendered(function () {
            input.focus();
            input.css('height', '100%');
        });

        return input[0];
    };
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" fn: init ">
    //#region fn: init
    // -----------------------------------------------------------------
    init() {
        // console.clear();
        iConsole(this);
        this.initTabulatorEvents();

        const handleSearchDebounced = {
            fn: _.debounce((e) => {
                iTr_searchTbl_remote.call(this, e.target.value);
            }, parseInt(this.TableSettings.filter_by.on_type.input_value)),
        };

        // <editor-fold defaultstate="collapsed" desc=" tbl Master Search ">
        //#region -tbl Master Search
        let mFilter_width = this._tbl_controlers.find(obj => obj.tblSearch)?.tblSearch?.input_w;
        const tbl_MasterSearch_w = iGet_el_MasterFilter({input_el:{style: `width: ${mFilter_width}px; padding-right: 60px;`}});

        const tbl_MasterSearch_colsdDdown = iGet_el_SelectDropdown({            
            calling_for : "masterSearch",
            el_w:        { class: "position-absolute z-index-1", style: `transform: translate(${mFilter_width - 59}px, 1px);`},
            calling_btn: { style: "border-top-left-radius: 0; border-bottom-left-radius: 0; padding-top: 6px; padding-bottom: 5px;", icon: {class: "fa-line-columns fa-filter"} },
            dd_title:    { text : "Select columns to search table by"},
            dd_filter:   { input: {placeholder: "Search column name..."}},
            dd_select_list: { data: this.getTableColumns(), exludeBy: "src" }, 
            tbl_int_mode : this.initMode,
            fn_onInptChkChange: (e, ops)=>{                
                let $tblM_search_el = $(".tbl_master_search-input", $(e.target).closest(".master_search_w"));                               
                if (ops.tbl_int_mode == 'paginated-local') {
                    iTr_searchTbl_local($tblM_search_el.val());
                } else {
                    iTr_searchTbl_remote($tblM_search_el.val());
                }
            }
        });
        
        tbl_MasterSearch_w.append(tbl_MasterSearch_colsdDdown);        

        // <editor-fold defaultstate="collapsed" desc=" COMMENT ">
        //#region -COMMENT        
        // tbl_multy_purps_w elements
//        $(".tbl-toolbar_row .tbl_multy_purps_w", this.tableContainerElement).append($('#TMPL_multi_purpose_btns_template').clone(true).removeAttr("id").removeClass("d-none")).addClass("me-1");
        // const tbl_MasterSearch_colsdDdown = tbl_MasterSearch_w.find('.master-filter-dropdown');
//        this.tbl_MasterSearch_colsdDdown = tbl_MasterSearch_colsdDdown;   


//        let _chBox_el = $("#TMPL_checkbox").clone(true).removeAttr('id').toggleClass('d-none');        
//        this.getTableColumns().forEach((col) => {
////        this.AdditionalTabulatorInitOptions.columnsObj.call(this).forEach((col) => {
//        // this.TabulatorObj.columns.forEach((col) => {
//            if(col.apprONLists?.src === 0){ 
//                return true;
//            }       
//            /*$(tbl_MasterSearch_colsdDdown)
//                .find('ul.dropdown-menu .dds_itemsList_w')                
//                .click((e) => e.stopPropagation()).append(`<li data-hidden-from-menu=${!col.visible}>
//                    <label class="dropdown-item dropdown-item-marker"><input type="checkbox" value="${col.field}"><span class='ms-2'>${col.title}</span></label></li>`);*/
//            let chBox_el = $(_chBox_el).clone(true);
//            $(chBox_el).data("hidden-from-menu", `${!col.visible}`);
//            $("input", chBox_el).attr("id", `${col.field}`).prop("checked", 1);
//            $("label", chBox_el).attr({"value": `${col.field}`, "for": `${col.field}`}).text(`${col.title}`);
//            $(".dds_itemsList_w", tbl_MasterSearch_colsdDdown).append(chBox_el);
//        });
// 
//        $(".select_deselec_all_w input", tbl_MasterSearch_colsdDdown).prop("checked", 1);
//        $(".select_deselec_all_w input", tbl_MasterSearch_colsdDdown).change(function(e){            
//            let l_txt = ["Select all", "Deselect all"];            
//            $(".select_deselec_all_w label", tbl_MasterSearch_colsdDdown).text(l_txt[+e.target.checked]);   // the + will convert false/true to 0/1
//            $(".dds_itemsList_w input", tbl_MasterSearch_colsdDdown).prop('checked', e.target.checked);            
//        });
//        
//        $(".dds_itemsList_w input", tbl_MasterSearch_colsdDdown).click(function(){                        
//            const $checkboxes = $('.dds_itemsList_w input', tbl_MasterSearch_colsdDdown); // Select all checkboxes in the container
//            const totalCheckboxes = $checkboxes.length;
//            const checkedCheckboxes = $checkboxes.filter(':checked').length;
//                                    
//            if (checkedCheckboxes === 0) {
//                $(".select_deselec_all_w input", tbl_MasterSearch_colsdDdown).prop({"checked": 0, "indeterminate": 0});
//                $(".select_deselec_all_w label", tbl_MasterSearch_colsdDdown).text("Select all");
//            } else if (checkedCheckboxes === totalCheckboxes) {
//                $(".select_deselec_all_w input", tbl_MasterSearch_colsdDdown).prop({"checked": 1, "indeterminate": 0});
//                $(".select_deselec_all_w label", tbl_MasterSearch_colsdDdown).text("Deselect all");
//            } else {
//                $(".select_deselec_all_w input", tbl_MasterSearch_colsdDdown).prop("indeterminate", 1);
//                $(".select_deselec_all_w label", tbl_MasterSearch_colsdDdown).text("Select all");
//            }                       
//        });
//        
        
        /*
        $('.selectDeselecTtoggle input', tbl_MasterSearch_colsdDdown).change(function(e){            
            $('input', tbl_MasterSearch_colsdDdown).prop('checked', e.target.checked);
        });
        $('.selectDeselecTtoggle input',tbl_MasterSearch_colsdDdown).prop("checked",true);
        $('.selectDeselecTtoggle input',tbl_MasterSearch_colsdDdown).change();
        

        $('.selectDeselecTtoggle i', tbl_MasterSearch_colsdDdown).click(function(){
            if($(this).hasClass('all-selected') || $(this).hasClass('partial-selected')){
                $(this).prop("class", i_el_cc["none-selected"]);
                $('span',$(this).parent()).text("Select all");
                $('input', tbl_MasterSearch_colsdDdown).prop('checked', false);
            }else{
                $(this).prop("class",i_el_cc["all-selected"]);
                $('span',$(this).parent()).text("Deselect all");
                $('input', tbl_MasterSearch_colsdDdown).prop('checked', true);
            }
        });
        $('.selectDeselecTtoggle i',tbl_MasterSearch_colsdDdown).trigger('click');

        const inputs = $(".dds_itemsList_w input", tbl_MasterSearch_colsdDdown).toArray();
        $(".dds_itemsList_w input", tbl_MasterSearch_colsdDdown).on("change",function(){
            const checkedInputs = inputs.filter(input=>{
                return input.checked
            });

            if(checkedInputs.length == 0){
                $('.selectDeselecTtoggle i', tbl_MasterSearch_colsdDdown).prop("class",i_el_cc["none-selected"]);
            }
            if(checkedInputs.length >= 1 && checkedInputs.length < inputs.length){
                $('.selectDeselecTtoggle i', tbl_MasterSearch_colsdDdown).prop("class",i_el_cc["partial-selected"]);
                
            }
            if(checkedInputs.length == inputs.length){
                $('.selectDeselecTtoggle i', tbl_MasterSearch_colsdDdown).prop("class",i_el_cc["all-selected"]);
            }

            if (tbl_int_mode == 'paginated-local') {
                iTr_searchTbl_local($(src_el).prop("value"));
            } else {
                iTr_searchFnQuery($(src_el).prop("value"));
            }
        });*/
        //#endregion
        // </editor-fold>

        
        // <editor-fold defaultstate="collapsed" desc=" Function to search table, for local tables ">
        //#region -Function to search table, for local tables
        const iTr_searchTbl_local = (search) => {                                    
            let selectedColumns = $('.dropdown-menu .dds_itemsList_w input:checked', tbl_MasterSearch_colsdDdown).toArray();
            let filters = selectedColumns.map(col => ({
                field: $(col).val(),  
                type: "like",      
                value: search
            }));
            // update the filter to trigger Tabulator search
            if(filters.length > 0){
                this.TabulatorObj.setFilter([filters]);
            }

            // needed to update the status bar on table when doing local searching
            // this event is needed to get exact number of rows after filters
            this.updateStatus();
        };
        //#endregion
        // </editor-fold>
        
        // <editor-fold defaultstate="collapsed" desc=" Function to search table, for remote tables ">
        //#region -Function to search table, for remote tables        
        const iTr_searchTbl_remote = (search) => {
            // get selected filter columns
            // if none then use "*" (wildcard) (search all)
            
            // const inputs = tbl_MasterSearch_colsdDdown.find('ul li input')
            //     .toArray()
            //     .filter((input) => {
            //         return $(input).prop('checked');
            //     });

            let inputs = $('.form-check-input:checked', tbl_MasterSearch_colsdDdown).map(function() {
                return this; }
                ).get(); // convert the jQuery object into a plain array

            const columnsToSearch = Array.from(inputs).map((input) => {
                return $(input).prop('value');
            });
            

            iConsole(columnsToSearch, { search });

            const endPoint = new URL(this.AdditionalTabulatorInitOptions.masterFilterURL);
            this.additionalAjaxParams['master_search'] = true;
            this.additionalAjaxParams['search'] = search ? `*${search}*` : '';
            this.additionalAjaxParams['url'] = endPoint;
            this.additionalAjaxParams['columns'] = columnsToSearch.toString();

            // trigger tabulator ajax manually
            this.TabulatorObj.setData();
        };
        //#endregion
        // </editor-fold>        
        
        // <editor-fold defaultstate="collapsed" desc=" on table's global search: form submit ">
        //#region -on table's global search: input change        
        tbl_MasterSearch_w.find('form').on('submit', (e) => {
            console.log("on table's global search: form submit ");
            e.preventDefault();
            // enable form-search always when enter-key is pressed.
            /* if (!this.TableSettings.filter_by.on_enter.enabled){
                return;
            }*/

            const search = $(e.target).find('input').val();
            if (!search?.trim()) {
                return;
            }
            
            if (this.initMode == 'paginated-local') {                
                iTr_searchTbl_local(search);
            } else {
                iTr_searchTbl_remote(search);
            }
        });
        //#endregion
        // </editor-fold>        
        // <editor-fold defaultstate="collapsed" desc=" on table's global search: input change ">
        //#region -on table's global search: input change        
        tbl_MasterSearch_w.find('form input').on('input', (e) => {
            console.log("on table's global search: input change ");
            if ($(e.target).val() == "") {
                if (this.additionalAjaxParams['master_search']) {
                    this.additionalAjaxParams['master_search'] = false;
                    this.TabulatorObj.setData();
                }
                if (this.initMode == 'paginated-local') {
                    this.TabulatorObj.setFilter([]);
                }
            }
            if (this.TableSettings.filter_by.on_type.enabled) {
                if (this.initMode == 'paginated-local') {
                    iTr_searchTbl_local($(e.target).prop("value"));
                } else {
                    handleSearchDebounced.fn(e);    // +IR+ what is it?      // Needed to trigger the search for <on_type> flag with certain amount of delay.
                }
            }
        });        
        //#endregion
        // </editor-fold>        
        //#endregion
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc=" tbl_ColumsToggleVisib_menu ">
        //#region -tbl_ColumsToggleVisib_menu
        const tbl_ColumsToggleVisib_menu = iGet_el_SelectDropdown({
            calling_for : "colsVisibility",
            el_w: { class: "col-auto px-0" },
            dd_title: {text: "Select which table columns to view"},
            dd_filter: { input: {placeholder: "Search column name..."}, show:".chboxSelect"},
            dd_select_list: { data: this.getTableColumns(), exludeBy: "cv" },
            applayBtns: { show: 0 },            
            fn_onInptChkChange: (e)=>{                
                const val = e.target.value;
                const ele = tbl_MasterSearch_colsdDdown.find(`.dds_itemsList_w input[value=${val}]`);
                console.log("ColumsToggleVisib, onInptChkChange", e.target,ele);

                if (!e.target.checked) {
                    this.TabulatorObj.hideColumn(val);
                    if (this.TableSettings.persist_column_visibility.enabled && !this.DefaultHiddenColumns.includes(val)) {
                        this.TableSettings.persist_column_visibility.hiddenColumns.push(val);
                    }
                    
//                    ele.closest(".form-check").attr({'data-hidden-from-menu': true});
                    ele.closest(".form-check").attr({"data-hidden-from-menu": true, "data-hidden-by-col_view": true});
                    $(ele).prop('checked', true); // We are doing the true because ".click" is doing its work and making check to uncheck
                    $(ele).click();
                } else {
                    // show column
                    this.TabulatorObj.showColumn(val);
                    if (this.TableSettings.persist_column_visibility.enabled && !this.DefaultHiddenColumns.includes(val)) {
                        const idx = this.TableSettings.persist_column_visibility.hiddenColumns.indexOf(val);
                        if (idx != -1) {
                            this.TableSettings.persist_column_visibility.hiddenColumns.splice(idx, 1);
                        }
                    }                    
                    
                    ele.closest(".form-check").attr({"data-hidden-from-menu": false, "data-hidden-by-col_view": false});
                    $(ele).prop('checked', false); // We are doing the false because ".click" is doing its work and making uncheck to check                    
                    $(ele).click();
                }
                Store.set(this.localStorageKey, this.TableSettings);
            }
        });

        
        // $(".dds_itemsList_w input[type='checkbox']", tbl_ColumsToggleVisib_menu).each((i, el)=>{
        //     $(el).closest('.form-check').attr("data-hidden-from-menu", 'false')
        // });


        

//        $('input[data-action="search-list-item"]', tbl_ColumsToggleVisib_menu).on('input', function (e) {
//            searchList.call(this, e, tbl_ColumsToggleVisib_menu, 'data-hidden-from-menu');
//        });
        //#endregion
        // </editor-fold>
        
        // <editor-fold defaultstate="collapsed" desc=" COMMENT ">
        //#region -COMMENT
        // $('li input', tbl_ColumsToggleVisib_menu).click((e) => {
        //     console.log("searching-----");
        //     // hide column
        //     const val = e.target.value;
        //     if (!e.target.checked) {
        //         this.TabulatorObj.hideColumn(val);
        //         if (this.TableSettings.persist_column_visibility.enabled && !this.DefaultHiddenColumns.includes(val)) {
        //             this.TableSettings.persist_column_visibility.hiddenColumns.push(val);
        //         }
        //         // hiding the li element from tbl_MasterSearch_colsdDdown for columns search
        //         tbl_MasterSearch_colsdDdown.find(`ul li input[value=${val}]`)
        //             .prop('checked', false) // uncheck input for Masterfilter
        //             .parent()
        //             .parent()
        //             .attr('data-hidden-from-menu', true);
        //     } else {
        //         // show column
        //         this.TabulatorObj.showColumn(val);
        //         if (this.TableSettings.persist_column_visibility.enabled && !this.DefaultHiddenColumns.includes(val)) {
        //             const idx = this.TableSettings.persist_column_visibility.hiddenColumns.indexOf(val);
        //             if (idx != -1) {
        //                 this.TableSettings.persist_column_visibility.hiddenColumns.splice(idx, 1);
        //             }
        //         }
        //         // un-hiding the li element
        //         tbl_MasterSearch_colsdDdown.find(`ul li input[value=${val}]`).parent().parent().attr('data-hidden-from-menu', false);
        //     }

        //     const checkedInputs = visibilityInputs.filter(input=>{
        //         return input.checked
        //     });

        //     if(checkedInputs.length == 0){
        //         $('.selectDeselecTtoggle i', tbl_ColumsToggleVisib_menu).prop("class",i_el_cc["none-selected"]);
        //     }
        //     if(checkedInputs.length >= 1 && checkedInputs.length < visibilityInputs.length){
        //         $('.selectDeselecTtoggle i', tbl_ColumsToggleVisib_menu).prop("class",i_el_cc["partial-selected"]);
                
        //     }
        //     if(checkedInputs.length == visibilityInputs.length){
        //         $('.selectDeselecTtoggle i', tbl_ColumsToggleVisib_menu).prop("class",i_el_cc["all-selected"]);
        //     }

        //     Store.set(this.localStorageKey, this.TableSettings);
        // });
        //#endregion
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc=" COMMENT ">
        //#region -COMMENT
        // row-selection dropdown        
        /* const UniqueRowSelectDropdown = iGet_el_SelectDropdown({
            applayBtns: {
                show:1,
                cancel:{show:0},
                apply:{show:1}
            },
            ctrlBtns: {}
        });
//        $(this.tableContainerElement).find('.settings-container').append(UniqueRowSelectDropdown);

        const uniqueLocations = [...new Set(this.TabulatorObj.getData().map(item => item.location))].sort();
        iConsole({uniqueLocations});
        
        $('ul.dropdown-menu .dds_itemsList_w',UniqueRowSelectDropdown).append(`
            <li>
                <label class="dropdown-item dropdown-item-marker"><input type="checkbox" value="sdf"> <span>sdff</span></label>
            </li>`);
        uniqueLocations.forEach((col) => {
            $('ul.dropdown-menu .dds_itemsList_w',UniqueRowSelectDropdown).append(`
                <li>
                    <label class="dropdown-item dropdown-item-marker"><input type="checkbox" value="${col}"> <span>${col}</span></label>
                </li>`);
        });
        $('ul.dropdown-menu .dds_itemsList_w li input',UniqueRowSelectDropdown).change((e) => {
            // select rows
            const val = e.target.value
            if(e.target.checked){     
                // select rows
                this.TabulatorObj.getRows().map((row)=>{
                    if(row.getData().location == "India"){
                        row.select();
                    }else{
                        row.deselect();
                    }
                });

            }else{
                this.TabulatorObj.getRows().map((row)=>{
                    if(row.getData().location == "India"){
                        row.deselect();
                    }
                });
            }
        });*/
        //#endregion
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc=" COMMENT: old-logic ">
        //#region -COMMENT: old-logic 
        // old-logic

        // VisibilityDropdownMenu.append(`<li><a class="dropdown-item btn-sm" href="#" data-value="${item.field}" data-hidden=${
        // this.TableSettings.persist_column_visibility.enabled
        //     ? this.TableSettings.persist_column_visibility.hiddenColumns.includes(item.field)
        //     : false
        // } data-hidden-from-menu=${item.hiddenFromMenu}>
        //         ${item.title}
        //     </a></li>`);

        // VisibilityDropdownMenu.find('li').click((e) => {
        //     const val = $(e.target).data().value;

        //     // restore column
        //     if (val == 'restore-cols-visibility') {
        //         [...$(VisibilityDropdownMenu).find("a[data-hidden='true']")].forEach((item) => {
        //             const colName = item.getAttribute('data-value');
        //             if (item.getAttribute('data-hidden-from-menu') != 'true') {
        //                 this.TabulatorObj.showColumn(colName);
        //             }
        //             item.setAttribute('data-hidden', false);
        //             tbl_MasterSearch_colsdDdown.find(`ul li input[value=${colName}]`).parent().parent().attr('data-hidden-from-menu', false);
        //         });
        // if (this.TableSettings.persist_column_visibility.enabled) {
        //     this.TableSettings.persist_column_visibility.hiddenColumns = [];
        // }
        //     } else {
        //         // hide columns
        //         const active = e.target.getAttribute('data-hidden');
        //         if (!active || active == 'false') {
        //             this.TabulatorObj.hideColumn(val);
        //             e.target.setAttribute('data-hidden', true);
        // if (this.TableSettings.persist_column_visibility.enabled && !this.DefaultHiddenColumns.includes(val)) {
        //     this.TableSettings.persist_column_visibility.hiddenColumns.push(val);
        // }
        // // hiding the li element
        // tbl_MasterSearch_colsdDdown.find(`ul li input[value=${val}]`)
        //     .prop('checked', false)
        //     .parent()
        //     .parent()
        //     .attr('data-hidden-from-menu', true);
        //         } else {
        //             this.TabulatorObj.showColumn(val);
        //             e.target.setAttribute('data-hidden', false);
        // if (this.TableSettings.persist_column_visibility.enabled && !this.DefaultHiddenColumns.includes(val)) {
        //     const idx = this.TableSettings.persist_column_visibility.hiddenColumns.indexOf(val);
        //     if (idx != -1) {
        //         this.TableSettings.persist_column_visibility.hiddenColumns.splice(idx, 1);
        //     }
        // }
        // // un-hiding the li element
        // tbl_MasterSearch_colsdDdown.find(`ul li input[value=${val}]`).parent().parent().attr('data-hidden-from-menu', false);
        //         }
        //     }
        //     Store.set(this.localStorageKey, this.TableSettings);
        // });
        //#endregion
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc=" COMMENT ">
        //#region -COMMENT
        // temporary dropdown
        // +IR+ what is it and why? I do not see that we are appending it
        /*const TempTableColsToggleDropdown = new Dropdown(
            `<div class="dropdown toggle-table-col-dropdown">`,
            $(this.tableContainerElement).find('.dropdowns-container'),
            {
//                listItemsArr: this.AdditionalTabulatorInitOptions.columnsObj.call(this).reduce((colsArr, item) => {
                listItemsArr: this.getTableColumns().reduce((colsArr, item) => {
                    if (!this.DefaultHiddenColumns.includes(item.field)) return colsArr;
                    colsArr.push({
                        title: item.title,
                        field: item.field,
                        element: $(this.tableContainerElement).find(`.table-columns-visibility-dropdown li a[data-value='${item.field}']`),
                    });
                    return colsArr;
                }, []),
            }
        );
                
        // storing instance in temp variable to access in below function
        const CurrentTabulatorIns = this.TabulatorObj;
        TempTableColsToggleDropdown.addButton(
            $(`<button class='btn btn-warning dropdown-toggle btn-sm' type='button' data-bs-toggle="dropdown" aria-expanded="false">Temp Columns</button>`)
            )
            .addDropdownMenu(`<ul class='dropdown-menu'>`, function (listItemsArr) {
                listItemsArr.forEach((item) => {
                    $(this.element).find('ul')
                        .append(`<li><a class="dropdown-item btn-sm" href="#" data-hidden='true' data-value="${item.field}" data-hidden-from-menu=${item.hiddenFromMenu}>
                        ${item.title}
                    </a></li>`);
                });
            })
            .initDropdownEvents(function () {
                const dropDownElement = this.element;
                dropDownElement.find('li').on('click', (e) => {
                    const val = $(e.target).data().value;
                    const hiddenItemFromMainDropdown = this.listItemsArr.find((item) => item.field == val);

                    const active = e.target.getAttribute('data-hidden');

                    if (!active || active == 'false') {
                        CurrentTabulatorIns.hideColumn(val);
                        e.target.setAttribute('data-hidden', true);
                        if (hiddenItemFromMainDropdown) {
                            hiddenItemFromMainDropdown.element[0].setAttribute('data-hidden-from-menu', true);
                            hiddenItemFromMainDropdown.element[0].setAttribute('data-hidden', true);
                        }
                        tbl_MasterSearch_colsdDdown.find(`ul li a[data-value=${val}]`).attr('data-hidden-from-menu', true);
                    } else {
                        CurrentTabulatorIns.showColumn(val);
                        e.target.setAttribute('data-hidden', false);
                        if (hiddenItemFromMainDropdown) {
                            hiddenItemFromMainDropdown.element[0].setAttribute('data-hidden-from-menu', false);
                            hiddenItemFromMainDropdown.element[0].setAttribute('data-hidden', false);
                        }
                        tbl_MasterSearch_colsdDdown.find(`ul li a[data-value=${val}]`).attr('data-hidden-from-menu', false);
                    }
                });
            });*/
        //#endregion
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc=" tbl_Setting_menu ">
        //#region -tbl_Setting_menu
        // settings dropdown
        const tbl_Setting_menu = $('#TMPL_tbl_Setting_menu').clone(true).removeClass('d-none').removeAttr('id');
        tbl_Setting_menu.find('ul.dropdown-menu').on('click', (e) => e.stopPropagation());

       /* 
       const radioInputs = tbl_Setting_menu.find("ul.dropdown-menu input[type='radio']").toArray();
        const delayInput = tbl_Setting_menu.find('ul.dropdown-menu input.delay-input')
            .val(this.TableSettings.filter_by['on_type'].input_value)
            .on('keydown', (e) => {
                e.preventDefault();
            });
        if (this.TableSettings.filter_by[`on_type`].enabled) {
            $(delayInput).attr('data-item-hidden', 'false');
        }

        radioInputs.forEach((input) => {
            let key = $(input).data('key');

            // adding attributes
            $(input).prop('name', `${this.localStorageKey}-filter_by`).prop('checked', this.TableSettings.filter_by[key].enabled);

            $(input).on('change', () => {
                Object.keys(this.TableSettings.filter_by).forEach((key) => {
                    this.TableSettings.filter_by[key].enabled = false;
                });
                this.TableSettings.filter_by[key].enabled = $(input).prop('checked');

                // hide-show delayInput
                if (key == 'on_type') {
                    $(delayInput).attr('data-item-hidden', false);
                } else {
                    $(delayInput).attr('data-item-hidden', true);
                }
                Store.set(this.localStorageKey, this.TableSettings);

                // update function
                handleSearchDebounced.fn = _.debounce((e) => {
                    iTr_searchTbl_remote(e.target.value);
                }, Number(this.TableSettings.filter_by.on_type.input_value));
            });
        });
        */

        const on_type_switch_el = tbl_Setting_menu.find("ul.dropdown-menu .filter-by-container input[data-key='on_type-switch']")
        const delayInput = tbl_Setting_menu.find('ul.dropdown-menu .filter-by-container input.delay-input')
            .val(this.TableSettings.filter_by['on_type'].input_value)
            .on('keydown', (e) => {
                e.preventDefault();
            }).on("change", ()=>{
                this.TableSettings.filter_by["on_type"].input_value = $(delayInput).prop("value");
                Store.set(this.localStorageKey, this.TableSettings);
            });
        if (this.TableSettings.filter_by[`on_type`].enabled) {
            $(delayInput).attr('data-item-hidden', 'false');
        }

        $(on_type_switch_el).prop('name', `${this.localStorageKey}-filter_by`).prop('checked', this.TableSettings.filter_by['on_type'].enabled);
        $(on_type_switch_el).on('change', ()=>{
            Object.keys(this.TableSettings.filter_by).forEach((key) => {
                this.TableSettings.filter_by[key].enabled = false;
            });
            this.TableSettings.filter_by['on_type'].enabled = $(on_type_switch_el).prop('checked');
            // hide-show delayInput
            $(delayInput).attr('data-item-hidden', !$(on_type_switch_el).prop('checked'));
            Store.set(this.localStorageKey, this.TableSettings);

            // update function
            handleSearchDebounced.fn = _.debounce((e) => {
                iTr_searchTbl_remote(e.target.value);
            }, Number(this.TableSettings.filter_by.on_type.input_value));
        });


        tbl_Setting_menu.find(".persist-column-settings-container input[type='checkbox']")        
            .prop('checked', this.TableSettings.persist_column_visibility.enabled)
            .change((e) => {
                iConsole("FFFF");
                this.TableSettings.persist_column_visibility.enabled = e.target.checked;
                if (!e.target.checked) {
                    this.TableSettings.persist_column_visibility.hiddenColumns = [];
                }
                Store.set(this.localStorageKey, this.TableSettings);
            }
        );        

        // reset settings on clear button
        tbl_Setting_menu.find('button.clear-settings-btn').click(() => {
            tbl_Setting_menu.find(".persist-column-settings-container input[type='checkbox']").prop('checked', false).trigger('change');
            radioInputs.forEach((input, idx) => {
                $(input).prop('checked', idx >= 1 ? false : true);
                let key = $(input).data('key');
                this.TableSettings.filter_by[key].enabled = $(input).prop('checked');
                Store.set(this.localStorageKey, this.TableSettings);
                handleSearchDebounced.fn = _.debounce((e) => {
                    iTr_searchTbl_remote(e.target.value);
                }, Number(this.TableSettings.filter_by.on_type.input_value));
            });
        });
        //#endregion
        // </editor-fold>

        // <editor-fold defaultstate="collapsed" desc=" tbl_ExportTo_menu ">
        //#region -tbl_ExportTo_menu
        const tbl_ExportTo_menu = $("#TMPL_tbl_ExportTo_menu").clone(true).removeClass('d-none').removeAttr('id');

        // mouseover event for closing the opened dropdown and popovers, when hovered on it
        $(tbl_ExportTo_menu).mouseover(()=>{
            iBS_hideAll_Dropdowns();
            iBS_hideAll_Popovers();
        });
        if (this.exports.types) {            
            this.exports.types.forEach((type) => {                
                const btn = $(`<button class="btn">${type}</button>`).click(this.exports.handlers[type.toLowerCase()]);
                tbl_ExportTo_menu.find('.download-btns').append(btn);
            });            
        }
        //#endregion
        // </editor-fold>
        
        // <editor-fold defaultstate="collapsed" desc=" adding elements to: table header toolbar ">
        //#region -tbl_ExportTo_menu
        let tblContainer = this.tableContainerElement;
        let appendTo_el = $(".table-header-toolbar_w", tblContainer);   
        $(".table-header-toolbar_w", tblContainer).empty();
        $("#TMPL_tbl_toolbars_f01").clone(true).removeAttr("id").removeClass("d-none").appendTo(appendTo_el);                
 
        $.each(this._tbl_controlers, (idx, item) => {  // do NOT change it to be function(idx, item) the <this> is undefined.
            const [element, el_cls] = [Object.keys(item)[0], Object.values(item)[0]["c"]];
                        
            switch(element){
                case "tbl_read_mode":{
                    $('.tbl_read_mode_w', tblContainer).append($(this.addNewRowBtn).toggleClass(el_cls));
                    break;
                }
                case "rowEditing":{
                    $('.tbl_single_select_w', tblContainer).append($(this.rowOperationsContainer).toggleClass(el_cls));        
                    break;
                }
                case "tbl_multy_purps":{
                    // the central area above the table
                    $(".tbl_multy_purps_w", tblContainer).append($('#TMPL_multi_purpose_btns_template').clone(true).removeAttr("id").removeClass("d-none")).toggleClass(el_cls);
                    break;
                }
                case "tblSearch":{
                    $(".tbl_ctrls_w", tblContainer).append($(tbl_MasterSearch_w).toggleClass(el_cls));                    
                    break;
                }
                case "tblColVisibility":{
                    $(".tbl_ctrls_w", tblContainer).append($(tbl_ColumsToggleVisib_menu).toggleClass(el_cls));                    
                    break;
                }
                case "tblExport":{
                    $(".tbl_ctrls_w", tblContainer).append($(tbl_ExportTo_menu).toggleClass(el_cls));
                    break;
                }
                case "tblSettings":{
                    $(".tbl_ctrls_w", tblContainer).append($(tbl_Setting_menu).toggleClass(el_cls));
                    break;
                }
                default:{
                }
            }                        
        });
        
        // +IR+ what is it?
        console.log({element: $('.sort-by-btns', tblContainer)});
        $('.tbl_multy_purps_w', tblContainer).append(
            $('.sort-by-btns', tblContainer).removeClass("d-none")
        );

        //#endregion
        // </editor-fold>
    }
    //#endregion
    // </editor-fold>

    // <editor-fold defaultstate="collapsed" desc=" fn: initTabulatorEvents ">
    //#region fn: initTabulatorEvents
    initTabulatorEvents = () => {
        this.TabulatorObj.on('dataLoading', this.saveEditedRowData);

        this.TabulatorObj.on('dataProcessed', (newProcessedPageData) => {   //  triggered after data has been processed and the table has been rendered
            iConsole('--- data processed  --------', this.selectedRowsSet);
            iConsole({ newProcessedPageData });
            this.updateCurrentPageDate(newProcessedPageData);
            this.restoreSelectedRowsState();
            this.hasUserFiltered = true;
        });

        // fix for disabling all of the checkboxes when row-editing is enabled for local tables.
        // need as the disabl logic inside editMode handler is not working for local tables.
        this.TabulatorObj.on('scrollVertical', () => {
            if(this.isEditing){
                this.toggleAllRowsChkBox(true);
            }
        });
        // It is needed to disable the rows when editing is enabled and loading new rows for remote tables.
        // it gets run when sorting, search and pagination for remote and local tables
        this.TabulatorObj.on('renderComplete', () => {
            iConsole('------------ render-complete --------------', this.TabulatorObj.getData(), 'this.isEditing', this.isEditing);
            if (this.isEditing) {
                this.toggleAllRowsChkBox(true);
                this.freezeCurrentEditingRow();
                // $('[tabulator-field="chbox"]', '.edit-row-visulizer').click();
            }

            if ($(this.TabulatorObj.element).closest(".iTr_F_01").length){
                // adding bootstrap class to giving styles for header filter elements
                $('.tabulator-header-filter input').addClass("form-control form-control-sm");
                $('.tabulator-header-filter select').addClass("form-select-sm");
            }


            // restore focus if row is selected
            // needed to work move the selection with <keyleft> and <keyright>
            this.focusToSelectedRowInput();
        });
                
        this.TabulatorObj.on('rowSelectionChanged', (data, rows) => {
            iConsole('rowSelectionChanged');
            this.trackRowsSelection(data, rows);

            iBS_hideAll_Popovers();
            iBS_hideAll_Dropdowns();
        });

        this.TabulatorObj.on('rowSelected', (row) => {
            iConsole('rowSelected');            
            const id = row.getData()[this.TabulatorObj.options.index] ?? null;
            if (id == null) {
                return;
            }
            this.selectedRowsSet.add(id);                        
        });

        this.TabulatorObj.on('rowDeselected', (row) => {
            iConsole('rowDe-Selected');
            

            // workaround for enabling the free-form selection of the text for the table cells
            // if($(".tabulator-cell[tabindex]", row).length){
                // row.getCells().forEach((cell) => {
                //     $(cell.getElement()).removeAttr('tabindex');
                // });
            // }

            // using options.index, it's default value is id. 
            // We are getting the id of the row and we use incase if we change the index property to something else value, then it will be dynamic
            const id = row.getData()[this.TabulatorObj.options.index] ?? null;
            if (id == null) {
                return;
            }
            this.selectedRowsSet.delete(id);

            if(this.isEditing){   
                const idArr = this.currentPageData.map((data) => data.id);
                // needed to delete the editing row when it's not present in the page-data which is loaded in the Tabulator
                // this would only run when filtering or sorting is done, or change pagination
                if (!idArr.includes(row.getData().id) && this.hasUserFiltered) {
                    iConsole('---  deleting row with id  --->', row.getData().id);
                    console.log('---  deleting row with id  --->', row.getData().id);
                    this.TabulatorObj.deleteRow(row.getData().id);
                }
            }
        });
        
        
        this.TabulatorObj.on('cellDblClick', (e, cell) => {
            shouldRunAndProceed(this.AdditionalTabulatorInitOptions.iTr_cellDblClick, e, cell);
        });

        // Handle cell edit
        // this.TabulatorObj.on('cellEdited', (cell) => {
        //     const updatedData = cell._cell.row.data;
        //     this.TabulatorObj?.updateData([{ ...updatedData, isUpdated: true }]);
        // });


        $(this.tableContainerElement).keydown(this.moveRowSelection);

        // Update the status row initially
        // this.updateStatus();

        // Update the status row whenever the table data is updated
        this.TabulatorObj.on('dataLoaded', this.updateStatus);
        this.TabulatorObj.on('dataChanged', this.updateStatus);
        this.TabulatorObj.on('rowAdded', this.updateStatus);
        this.TabulatorObj.on('rowDeleted', this.updateStatus);
        this.TabulatorObj.on('rowUpdated', this.updateStatus);
        this.TabulatorObj.on('renderComplete', this.updateStatus);
        this.TabulatorObj.on('scrollVertical', this.updateStatus);

        // needed to update the status bar on table when filering
        // this event is needed to get exact number of rows after filters
        // this.TabulatorObj.on('dataFiltered', (filter, rows)=>{
        //     // putting it in settimout because of it is running multiple place
        //     setTimeout(()=>{
        //         this.updateStatus(filter, rows)
        //     })
        // });


        // todo
        // use this -> const updatedData = cell._cell.row.data;
        //          ->  table?.updateData([{ ...updatedData, isUpdated: true }]);
        // this.TabulatorObj.on("cellMouseOut", this.saveEditedRowData)
    };
    //#endregion
    // </editor-fold>

    // removeSaveStateEvents = () => {
    //     this.TabulatorObj.off("dataLoading", this.saveEditedRowData)
    //     this.TabulatorObj.off("cellMouseOut", this.saveEditedRowData)
    //     this.TabulatorObj.off("dataProcessed", this.restoreSelectedRowsState)
    // }

    saveEditedRowData = () => {
        const updatedRecords = this.TabulatorObj.getSelectedData()?.filter((data) => data?.isUpdated);
        iConsole({ updatedRecords }, '------- dataLoading -----------');
        const selecteRowSize = this.selectedRowsSet.size;

        if (this.isEditing && selecteRowSize == 1 && updatedRecords.length == 1) {
            this.editedRowData = updatedRecords[0];
        }
    };

    restoreSelectedRowsState = () => {
        const size = this.selectedRowsSet.size;
        if (size == 0) {
            return;
        }

        // restore selected row and its edit state
        // restore the values row which were in the edited mode
        if (size == 1 && this.isEditing) {
            const editedRowId = [...this.selectedRowsSet.values()][0];
            iConsole({ editedRowId, th: this.TabulatorObj.getRows() }, '-------------------------');

            let editedRow = this.TabulatorObj.getRow([...this.selectedRowsSet.values()][0]);
            iConsole({ editedRow });

            // if edited row not found, means we are doing filtering or changed the page number
            // then generate that row and freeze in editing mode
            if (!editedRow) {
                iConsole('--- not found, creating edited row with data : --> ', this.selecteRowStates.old_data);
                // add the editing row
                this.TabulatorObj.addRow({ ...this.selecteRowStates.old_data }).then((row) => {
                    // this.TabulatorObj.addRow({ ...this.selecteRowStates.old_data, isNew: true }).then((row) => {
                    row.freeze();
                    row.select();
                    iConsole('current selected row when process data -->', this.currentSelectedRows);
                    this.currentSelectedRows = [row];
                    this.enableEditMode();
                    //                    this.rowOperationsContainer.addClass('d-flex');
                    //                    this.rowOperationsContainer.removeClass('d-none');
                    this.toggleSingleRowOperationsContainer(true);
                    this.toggleDuplicateRowBtn(true);
                    this.toggleTbl_read_mode_w(false);
                    

                    if (this.editedRowData && row) {
                        this.restoreEditedRowData(row);
                    }
                });
                return;
            }

            this.currentSelectedRows = [editedRow];
            this.enableEditMode();
            //            this.rowOperationsContainer.addClass('d-flex');
            //            this.rowOperationsContainer.removeClass('d-none');
            this.toggleSingleRowOperationsContainer(true);
            this.toggleDuplicateRowBtn(true);
            this.toggleTbl_read_mode_w(false);

            if (this.editedRowData && editedRow) {
                this.restoreEditedRowData(editedRow);
            }
        }
        // select all of the row which were selected before new dataLoad/render
        this.TabulatorObj.selectRow([...this.selectedRowsSet.values()]);
    };

    restoreEditedRowData = (row) => {
        if (this.editedRowData && this.isEditing) {
            row.update(this.editedRowData);
        }
    };

    // <editor-fold defaultstate="collapsed" desc=" iTr_setEditMode ">
    //#region -iTr_setEditMode    
    iTr_setEditMode = (inputs = {}) => {
        let fn = { setTo: null, setMore: false, isNewRow: null, ...inputs };

        iConsole('------ iTr_setEditMode  -------------');

        this.toggleEditVisualizer(fn.setTo);
        this.toggleEnableEditModeBtn(fn.setTo);
        this.toggleAllRowsChkBox(fn.setTo);
        this.toggleRowOperationsBtn(!fn.setTo);
        this.toggleDeleteRowBtn(!fn.setTo);
        this.toggleDuplicateRowBtn(!fn.setTo);
        this.isEditing = fn.setTo;

        if (fn.setMore) {
            this.toggleTbl_read_mode_w(!fn.setTo);            
            // adding it here to fix the collison with renderComplete event, it is disabling the checkbox again after disabling the edit mode
//            this.isEditing = fn.setTo;
            this.deselectSelectedRows(!fn.setTo, fn.isNewRow );
            this.toggleMasterCheckBox(fn.setTo);
            this.selecteRowStates.old_data = null;
            this.selectedRowsSet.clear();
            this.currentSelectedRows = [];
        }
//        this.isEditing = fn.setTo;

    };
    //#endregion
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" iHandle_addNewRowBtn ">
    //#region -iHandle_addNewRowBtn
    iHandle_addNewRowBtn = (e, v1, v2) => {
        const id = Date.now().toString();
        let newRowData = { id, isCurrentRow: { new_row: true } };
        if (!shouldRunAndProceed(this.AdditionalTabulatorInitOptions.iTr_add_new_row_before, newRowData)) {
            return;
        }
        // enable edit mode for new row
        this.enableEditMode({ for_newRow: { data: newRowData } });

        this.AdditionalTabulatorInitOptions.iTr_add_new_row_after?.();
    };
    //#endregion
    // </editor-fold>
    // <editor-fold defaultstate="collapsed" desc=" iHandle_duplicateRowBtn ">
    //#region -iHandle_duplicateRowBtn
    iHandle_duplicateRowBtn = () => {
        iConsole('--------- duplicateRowBtn');
        const id = Date.now().toString();

        let newRowData = { ...this.currentSelectedRows[0].getData(), id: id, isCurrentRow: { new_row: true } };
        if (!shouldRunAndProceed(this.AdditionalTabulatorInitOptions.iTr_rowDuplicate_start, newRowData)) {
            return;
        }

        // enable edit mode for new row
        this.enableEditMode({ for_newRow: { data: newRowData } });

        this.AdditionalTabulatorInitOptions.iTr_rowDuplicate_end?.();
    };
    //#endregion
    // </editor-fold>                    
    enableEditMode = (options = {}) => {
        iConsole('------ edit mode  -------------');
        const settings = {
            ...options
        };

        if (settings.for_newRow) {
            this.TabulatorObj.addData(settings.for_newRow.data);

            // unselect the original row from which the new-row is generated
            this.deselectSelectedRows();

            // get the new added row and freeze it
            const newRow = this.TabulatorObj.getRow(settings.for_newRow.data.id);
            newRow.select();
            newRow.freeze();

            // update the currentSelectedRows
            this.currentSelectedRows = [newRow];
        }

        this.iTr_setEditMode({ setTo: true });

        // disable master selection
        this.toggleMasterCheckBox(this.currentSelectedRows.length > 0);
        this.toggleMasterCheckBox(this.currentSelectedRows.length == 0 ? false : true);
        this.freezeCurrentEditingRow();

        // save current data for the row that user is editing for restoring it on discard
        if (!this.selecteRowStates.old_data) {
            console.log({mangager: this.selectedRowsSet.old_data}, this.selectedRowsSet.values());
            
            this.selecteRowStates.old_data = structuredClone(this.TabulatorObj.getRow([...this.selectedRowsSet.values()][0]).getData());
        }

        // workaround for enabling the free-form selection of the text for the table cells
        // user can focus on the cells using tab, when that row is being edited
        // this.currentSelectedRows[0].getCells().forEach((cell) => {
        //     $(cell.getElement()).removeAttr('tabindex');
        // });

        (this.currentSelectedRows[0].getData().isCurrentRow ??= {}).edit_mode = true;        
        // reformatting to activate the cell/row formatter
        this.currentSelectedRows[0].reformat();
    };

    trackRowsSelection(data, rows) {
        // un-check all of the old rows
        this.currentSelectedRows.forEach((row) => {
            if (!row) {
                return;
            }
            row.unfreeze();
            const input = $('input', row.getCell('rowSelection').getElement());
            input.prop('checked', false);
        });

        // check the selected rows
        rows.forEach((row) => {
            const input = $('input', row.getCell('rowSelection').getElement());
            input.prop('checked', true);
        });

        // check the selected rows
        this.currentSelectedRows = rows; // +Future+  are we not using much more memory that way? why not to keep the ids in other words can we not use selectedRowsSet to do the work
        const totalSelectedRows = data.length;

        // this.toggleTbl_multy_purps_w(false)


        // hide row operations
        if (totalSelectedRows == 0 || totalSelectedRows > 1) {
            this.toggleSingleRowOperationsContainer(false);
            this.toggleDuplicateRowBtn(false);
            this.toggleTbl_read_mode_w(true);
        }
        // show row operations
        if (totalSelectedRows == 1) {
            this.toggleSingleRowOperationsContainer(true);
            this.toggleDuplicateRowBtn(true);
            this.toggleTbl_read_mode_w(false);


            // rows[0].getCells().forEach((cell, idx)=>{
            //     if(idx <=1) return
            //     const col = cell.getColumn()
            //     this.TabulatorObj.updateColumnDefinition(col, {editor: "input"})
            // })
        }
        // show row operations for multiple-row
        // if (totalSelectedRows > 1) {
        //     this.toggleTbl_multy_purps_w(true)
        // }
    }
    
    iHandle_deleteRow = ()=> {
        const deleteRecord = this.TabulatorObj.getSelectedData()[0];
        if (!shouldRunAndProceed(this.AdditionalTabulatorInitOptions.iTr_row_delete_before, this, deleteRecord)) {
            return;
        }
        
        
        this.AdditionalTabulatorInitOptions.iTr_row_delete_after?.({ delete: deleteRecord });
    }
    

    handleUpdateEditedRow = () => {
        iConsole('--- handleUpdateEditedRow---');
        // getting the updated records from Tabulator
//        const updatedRecords = this.TabulatorObj.getSelectedData();
        
        // +IR+ what is it?
        const updatedRecords = this.TabulatorObj.getSelectedData()
            ?.filter((data) => data?.isUpdated)
            .map((data) => {
                delete data.isUpdated;
                return data;
            });
            
//        if (updatedRecords.length == 0) {
//            alert('Nothing to update.');
//            return;
//        }

        if (!shouldRunAndProceed(this.AdditionalTabulatorInitOptions.iTr_row_save_before, this, updatedRecords[0])) {
            // add class is-invalid_bycode to bypass the regular check
            return;
        }
        
        let cells = this.TabulatorObj.getSelectedRows()[0].getCells();
        $.each(cells, (inx, cell)=>{
            let $cell = cell.getElement();
            let cell_def = cell.getColumn().getDefinition();
            let cell_val = cell.getRow().getData()[cell_def.field];
            if(! $(":input", $cell).hasClass("is-invalid_bycode")){
                $(":input", $cell).removeClass("is-invalid");                    
                if( cell_def.validator === "required" && (cell_val === undefined || cell_val === "") ){
                    $(":input", $cell).addClass("is-invalid");
                }
            }
            $(":input", $cell).removeClass("is-invalid_bycode");
        });                

        let $row = this.TabulatorObj.getSelectedRows()[0].getElement();
        $(":input.is-invalid:first", $row).focus();                
        if($(":input.is-invalid", $row).length !== 0){
            return;
        }

        this.AdditionalTabulatorInitOptions.iTr_row_save_after?.({ updates: updatedRecords });
    };

    updateRowStatus = (sets = {}) => {
        // for a new row we need to update the rec ID received from the D.B. 
        // Therefor we call it with {nrecID: {"id": json["nRid"]}
        // the "id" is the column's field name 
        const row = this.TabulatorObj.getRow(this.TabulatorObj.getSelectedData()[0].id);
        let row_data = row.getData();
        let isNewRec = row_data.isCurrentRow?.new_row;
        
        if (isNewRec && !$.isEmptyObject(sets)){
            let id_field_name = Object.keys(sets.nrecID)[0];
            row_data[id_field_name] = sets.nrecID[id_field_name];            
        }
        
        delete row_data.isCurrentRow;
        delete row_data.__inputVal;
        row?.reformat();    // to go out the edit mode to make it visible mode
                
        this.iTr_setEditMode({ setTo: false, setMore: true, isNewRow: isNewRec});
        
        if (sets?.delete){  // if we asked to delete a row
            row.delete();
        }


        // reset horizontal-scroll for table-header
        $(".tabulator-header-contents",this.TabulatorObj.element)[0].scrollTo(0,0)
    };

    __discardEditRowChanges = () => {
        // restore old value
        this.currentSelectedRows.forEach((row) => {
            iConsole({ old_data: this.selecteRowStates.old_data });
            row.update(this.selecteRowStates.old_data);
            delete row.getData().isCurrentRow;
            row.reformat();

            /* old-logic
             row.getCells().forEach(c => {
                 if (c.isEdited()) {
                     c.restoreOldValue()
                 }
             })
            */
        });
        this.iTr_setEditMode({ setTo: false, setMore: true });

        this.editedRowData = null;
        this.selecteRowStates = new Set();
    };
    discardEditRowChanges = () => {
        // reset horizontal-scroll for table-header
        $(".tabulator-header-contents",this.TabulatorObj.element)[0].scrollTo(0,0)


        // restore old value
        let row = this.currentSelectedRows[0];
        iConsole({ old_data: this.selecteRowStates.old_data });
        row.update(this.selecteRowStates.old_data);
        let isNewRec = row.getData().isCurrentRow.new_row;
        delete row.getData().isCurrentRow;
        row.reformat();

        this.iTr_setEditMode({ setTo: false, setMore: true, isNewRow: !isNewRec });
                
        this.editedRowData = null;
        this.selecteRowStates = new Set();
    };

    deselectSelectedRows = (delete_iTr_edit_row, isNewRow) => {
        // console.log('goood', this.currentSelectedRows)
        // this.TabulatorObj.deselectRow();
        this.currentSelectedRows.forEach((row) => {
            row.deselect();
            
            // adding fix here to deleting the edited-row
            // delete the row only when discarding the changes
            if(delete_iTr_edit_row && ! (isNewRow ?? true)){
                const id = row.getData()[this.TabulatorObj.options.index] ?? null;
                if (id == null) {
                    return;
                }
                this.selectedRowsSet.delete(id);

                const idArr = this.currentPageData.map((data) => data.id);
                // needed to delete the editing row when it's not present in the page-data which is loaded in the Tabulator
                // this would only run when filtering or sorting is done, or change pagination
                if (!idArr.includes(row.getData().id) && this.hasUserFiltered) {
                    iConsole('---  deleting row with id  --->', row.getData().id);
                    console.log('---  deleting row with id  --->', row.getData().id);
                    this.TabulatorObj.deleteRow(row.getData().id);
                }
            }
        });
    };
    
    // <editor-fold defaultstate="collapsed" desc=" toggle diff els ">
    //#region -toggle diff els

    toggleMasterCheckBox(shouldDisable) {
        $(this.TabulatorObj.getColumn('rowSelection').getElement()).find('input').prop('disabled', shouldDisable);
    }

    toggleSingleRowOperationsContainer(shouldShow) {
        if (shouldShow) {
            $(this.rowOperationsContainer).addClass('d-flex').removeClass('d-none');
        } else {
            $(this.rowOperationsContainer).addClass('d-none').removeClass('d-flex');
        }
    }

    toggleEditVisualizer(shouldAdd) {
        if (this.currentSelectedRows.length > 1 || this.currentSelectedRows.length == 0) return;
        const row = this.currentSelectedRows[0];
        if (!row) return;
        if (shouldAdd) {
            $(row.getElement()).addClass('edit-row-visulizer');
        } else {
            $(row.getElement()).removeClass('edit-row-visulizer');
        }
    }

    toggleEnableEditModeBtn(shouldDisable) {
        $(this.enableEditRowBtn).prop('disabled', shouldDisable);
        if (shouldDisable) {
            $(this.enableEditRowBtn).removeClass('text-primary').addClass('text-secondary');
        } else {
            $(this.enableEditRowBtn).removeClass('text-secondary').addClass('text-primary');
        }
    }

    toggleDuplicateRowBtn(shouldView) {
        if (shouldView) {
            $(this.duplicateRowBtn).removeClass('text-secondary').addClass('text-warning').prop('disabled', !shouldView);
        } else {
            $(this.duplicateRowBtn).removeClass('text-warning').addClass('text-secondary').prop('disabled', !shouldView);
        }
    }
    toggleDeleteRowBtn(shouldView) {
        if (shouldView) {            
            $(this.deleteRowBtn).removeClass('text-secondary').addClass('text-danger border-danger').prop('disabled', !shouldView);
        } else {
            $(this.deleteRowBtn).removeClass('text-danger border-danger').addClass('text-secondary').prop('disabled', !shouldView);
        }
    }

    toggleRowOperationsBtn(shouldDisable) {
        $(this.updateEditedRowBtn).prop('disabled', shouldDisable);
        $(this.discardEditedRowBtn).prop('disabled', shouldDisable);

        if (shouldDisable) {
            $(this.updateEditedRowBtn).removeClass('text-success').addClass('text-secondary');
            $(this.discardEditedRowBtn).removeClass('text-danger').addClass('text-secondary');
        } else {
            $(this.updateEditedRowBtn).removeClass('text-secondary').addClass('text-success');
            $(this.discardEditedRowBtn).removeClass('text-secondary').addClass('text-danger');
        }
    }

    toggleAllRowsChkBox(shouldDisable) {
        this.TabulatorObj.getRows().forEach((row, idx) => {
            $('input', row.getCell('rowSelection').getElement()).prop('disabled', shouldDisable);
        });
    }

    toggleTbl_read_mode_w(shouldShow) {                
        if (shouldShow) {
            $(".tbl_read_mode_w", this.tableContainerElement).removeClass('d-none');
        } else {            
            $(".tbl_read_mode_w", this.tableContainerElement).addClass('d-none');
        }
    }
    toggleTbl_multy_purps_w(shouldShow) {        
        if (shouldShow) {
            $(".tbl_multy_purps_w .multi-purpose-btns", this.tableContainerElement).removeClass('d-none');
        } else {            
            $(".tbl_multy_purps_w .multi-purpose-btns", this.tableContainerElement).addClass('d-none');
        }
    }
    //#endregion
    // </editor-fold>


    // row function
    freezeCurrentEditingRow = () => {
        const row = this.TabulatorObj.getRow([...this.selectedRowsSet.values()][0]);
        if (row && !row.isFrozen()) {
            row.freeze();
        }
    };

    updateCurrentPageDate = (newData) => {
        this.currentPageData = newData;
    };

    // returns columns names in an array
    getTableColumns = () => {
//        return this.AdditionalTabulatorInitOptions.columnsObj.call(this).reduce((acc, column) => {
        return this.iTr_columnsObj().reduce((acc, column) => {
            
            if (column.field == 'rowSelection') return acc;
            // ++Test++
             acc.push({ ...column, hidden: !column.visible, hidden_by_user : this.TableSettings.persist_column_visibility['hiddenColumns'].includes(column.field) });
            // acc.push({ ...column, hidden: !column.visible, dinm_dd_toCcheck : column.visible});
//            acc.push({ ...column, hidden: !column.visible});
            return acc;
        }, []);
    };

    moveRowSelection = (e) => {
        if (e.keyCode != 39 && e.keyCode != 37) {
            return;
        }
        if (this.isEditing) {
            return;
        }

        e.preventDefault();

        const rows_arr = [...this.selectedRowsSet];

        // don't run logic if row is more than 1 or is 0.
        if (rows_arr.length == 0) {
            return;
        }
        if (rows_arr.length > 1) {
            return;
        }

        const row = rows_arr[0];
        const currentSelectedRow = this.TabulatorObj.getRow(row);

        if (!currentSelectedRow) {
            iConsole('current selected row not found');
            return;
        }

        // select the previous and next row
        if (e.keyCode == 37) {
            const prevRow = currentSelectedRow.getPrevRow();
            if (!prevRow) {
                iConsole('previous row is not present');
                return;
            }
            if (prevRow) {
                try {
                    currentSelectedRow.deselect();
                    prevRow.select();
                    prevRow.scrollTo().then(() => {
                        this.focusToSelectedRowInput();
                    });
                } catch (err) {
                    iConsole(err);
                }
            }
        }
        if (e.keyCode == 39) {
            const nextRow = currentSelectedRow.getNextRow();
            if (!nextRow) {
                iConsole('next row is not present');
                return;
            }
            if (nextRow) {
                try {
                    currentSelectedRow.deselect();
                    nextRow.select();
                    nextRow.scrollTo().then(() => {
                        this.focusToSelectedRowInput();
                    });
                } catch (err) {
                    iConsole(err);
                }
            }
        }
    };

    focusToSelectedRowInput = () => {
        const rows_arr = [...this.selectedRowsSet];

        if (rows_arr.length == 0) {
            iConsole('next row is not present');
            return;
        }

        const row = this.TabulatorObj.getRow(rows_arr[0]);
        if (!row) {
            return;
        }
        $('input', row.getCell('rowSelection').getElement()).focus();
    };
    
    // === 
    // function updateStatus(){ 
    // if yes, replace all this format with function .....
    updateStatus = (result_rows) => {    
        const rowCount = this.TabulatorObj.getDataCount(); // Get total row count
        const visible_row = this.TabulatorObj.getRows("visible").map((row)=> row.getData().id);
        const start = visible_row[0] ?? 0;
        const end = visible_row[visible_row.length-1] ?? 0;
        console.log({visible_row}, start, end, this.hasUserFiltered);

        if(this.hasUserFiltered){
            $('.table-status', this.TabulatorObj.element).html(
                `<div>
                   <span class='fw-normal text-dark'>Showing ${start} to ${end} of ${rowCount} rows.</span>
                </div>`
            );
        }else{
            $('.table-status', this.TabulatorObj.element).html(
                `<span class='fw-normal text-dark'>Showing ${start} to ${end} of ${rowCount} rows.</span>`
            );
        }
        

      /*  const rowCount = this.TabulatorObj.getDataCount(); // Get total row count
        let showingCount = this.TabulatorObj.getRows().length; // Get currently displayed row count
        // showingCount = this.TabulatorObj.getData().length
        if(Array.isArray(result_rows)){
            showingCount = result_rows.length
            console.log({result_rows}, result_rows.length, showingCount)
        }
        console.log({result_rows}, result_rows?.length, showingCount,this.hasUserFiltered)

        if(this.hasUserFiltered){
            $('.table-status', this.TabulatorObj.element).html(
                `<div>
                    <span class='fw-normal text-dark'>Rows: ${showingCount} of ${rowCount}</span>
                </div>`
            );
        }else{
            $('.table-status', this.TabulatorObj.element).html(
                `<span class='fw-normal text-dark'>Rows: ${rowCount}</span>`
            );
        }
        
        $('.table-status', this.TabulatorObj.element).append(this.tbl_Setting_menu); */
    };
    cellF_rowExpand = (cell, formatterParams, onRendered, expandRowWithNestedTable_Fn, expanded_row) => {
        let row = cell.getRow();
        let returnVal = null;

        const button = $(
            `<button type="button" class="expand-btn btn btn-sm btn-success m-0 p-0"><i class="fas fa-plus px-1"></i></button>`
        ).click((e) => {

            // delete all opended nested table, whenever new row is expanded
            if(this.tbl_ExpandRows.length > 0){
                this.tbl_ExpandRows.forEach((id)=>{
                    const r = this.TabulatorObj.getRow(id);
                    if(r.getData().id != row.getData().id){
                        // this will trigger the reformat for the row
                        r.reformat();
                    }
                });
            }

            const isExpanded = $(e.target).closest("button").data('expanded');

            if (isExpanded) {
                // tracking if any one row is expanded of the table
                this.tbl_ExpandRows.filter((id)=>id !== row.getData().id);
                deleteTableAndCollapseRow(e, row);
                
                $(row.getElement()).removeClass("row_expended");
                // getting the toolbar for the table and unhiding it when row is collapsed
                // show the toolbar 
                if($(row.getTable().element).hasClass("nested-table")){
                    $($(".table-header-toolbar_w", $(row.getTable().element.closest(".table-container")))[0]).removeClass("d-none");
                    $($(".tabulator-header", $(row.getTable().element.closest(".table-container")))[0]).removeClass("hide-filter");
                }

                // scroll to the row where table is expanded
                if(expanded_row){
                    expanded_row.getElement().scrollIntoView({block:"end"});
                }
            } else {
                expandRowWithNestedTable_Fn?.(e, row);
                
                $(row.getElement()).addClass("row_expended");

                // getting the toolbar for the table and hiding it when row is expanded
                // hide the toolbar 
                if($(row.getTable().element).hasClass("nested-table")){
                    $($(".table-header-toolbar_w", $(row.getTable().element.closest(".table-container")))[0]).addClass("d-none");
                    $($(".tabulator-header", $(row.getTable().element.closest(".table-container")))[0]).addClass("hide-filter");
                }
                // tracking if any one row is expanded of the table
                this.tbl_ExpandRows.push(row.getData().id);
            }
            
            /* const isExpanded = $(e.target).closest("button").data('expanded');
            
            if (isExpanded) {
                // tracking if any one row is expanded of the table
                this.isAnyRowExapanded = false
                deleteTableAndCollapseRow(e, row);
            } else {
                if(this.isAnyRowExapanded){
                    return;
                }
                expandRowWithNestedTable(e, row);
                // tracking if any one row is expanded of the table
                this.isAnyRowExapanded = true;
            }  */
        });

        returnVal = $(button)[0];
        return returnVal;
    };
    iTr_get_icon_element  = (val, sets = {}) => {
        // It will return the cell format = the icon to show based on the cell value
        sets = {
            el: $("<i>"),
            el_class_by_val : {
                0 : "fa fa-times text-danger",
                1 : "fa fa-check text-success" 
            },
            ...sets};
        $(sets["el"]).addClass(sets["el_class_by_val"][val]);
        return $(sets["el"]).prop("outerHTML");
    };        
    
    iTr_cell_OnOff_insertEl = (cell, onRendered, opts = {}) => {
        /* Creating the <Select> element 
         * for Header/Filter we return the element 
         * for Cell we will add it to the cell and handling the onchange event
         */ 
        let defs = {
            TMPL_el:  "#TMPL_chbox_select_element", 
            TMPL_el_class : "",
            itms : {
                // none : {v: "", t: "-", r_v: null},  // v is the elementvalue,r_v is the value to return once selected 
                none : {v: "", t: "-"},  // v is the elementvalue   if it is == "exclude-me" then we will exlude this option
                opt1 : {v: 0,  t: 'No'},
                opt2 : {v: 1,  t: 'Yes'}
            },
            cc_invalid : "is-invalid",  // oline-danger
            iBeforeChange : null
        };
        let sets = $.extend(true, defs, opts);
        
        const $select = $("select", $(sets.TMPL_el).clone(true));
        $.each(sets["itms"], (kk, vv)=>{
            if(vv["v"] === "exclude-me"){
                return true;
            }
            
            let option = $(`<option [data-el_for="${kk}"]></option>`).val(vv["v"]).text(vv["t"]);
            $($select).append(option);
        });

        $($select).val(cell.getValue());
        
        if(cell.getType() === "header"){
            $($select).toggleClass(sets["TMPL_el_class"]);
            return $($select);
        } else {
            $($select).on('change', (e) => {                
            /*
                // handling case when value is "-", if "-" then give null as value
//                const new_value = e.target.value === "" ? null : Number(e.target.value);
//                iConsole($(e.target).find('option:selected').data("el_for"));
                const new_value = e.target.value === "" ? null : Number(e.target.value);

                // updating the <isUpdated> flag and row data in Tabulator
                // We need this to get the updated values when we hit update-button and send the updated data
                cell.getTable().updateData([
                    { ...cell.getRow().getData(), [cell.getField()]: new_value, isUpdated: true },
                ]);*/
                                                    
                if (!shouldRunAndProceed(sets.iBeforeChange, e, cell)) {            
                    return;
                } else {                            
                    $(e.target).removeClass(sets["cc_invalid"]);
                    if (e.target.value === sets["itms"]["none"]["v"]){
                        $(e.target).addClass(sets["cc_invalid"]);
                        return;
                    } else {
                        // This is another way to do it BUT it reformats the row and if we have a class is-invalid we will lose it
                        // cell.getTable().updateData([
                        //     { ...cell.getRow().getData(), [cell.getField()]: Number(e.target.value), isUpdated: true }
                        // ]); 
                        cell.getData()[cell.getField()] = (Number(e.target.value) || e.target.value); // to make it work for number "123" => 123 or string "abc" => "abc"
                        cell.getData().isUpdated = true;  
                    }
                }
            });
            $(cell.getElement()).empty().append($select);
        }
    };
    

    iTr_cell_input_insertEl = (cell, formatterParams, onRendered) => {
        console.log("cell formating, value: "+cell.getValue());
        let cell_val = null;
        if (!shouldRunAndProceed(formatterParams.iBeforeCreateEl, cell)) {            
            return;
        } else {
            cell_val = cell.getData().__inputVal ?? cell.getValue();
            delete cell.getData().__inputVal;
        }

        const $input = $(`<input class="form-control form-control-sm">`)
            .val(cell_val);
        formatterParams.iEl_editMode?.($input, cell);
    
        $input.on("focus", (e)=>{
                if (!shouldRunAndProceed(formatterParams.iOnFocus, e, cell)) {
                    return;
                }
            })
            .on("input change", (e)=>{
                let cell_val = e.target.value;
                if(cell_val !== ""){
                    $(e.target).removeClass("is-invalid");
                }
                
                if (!shouldRunAndProceed(formatterParams.iOnChange, e, cell)) {
                    return;
                }
                
                // This is another way to do it BUT it reformats the row and if we have a class is-invalid we will lose it
                // cell.getTable().updateData([ { ...cell.getRow().getData(), [cell.getField()]: e.target.value, isUpdated: true } ]);                
                cell.getData()[cell.getField()] = cell_val;
                cell.getData().isUpdated = true;                                              
            })
            .on("blur", (e)=>{
                if (!shouldRunAndProceed(formatterParams.iOnBlur, e, cell)) {
                    return;
                }
            });
                 
        return $input[0];
    };

    // used to render the cell editor by default when row is in edit mode
    iTr_cell_editor_formatterEl = (cell, formatterParams, onRendered)=> {
        let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;
        
        if (editMode && cell.getColumn().getDefinition().editable) {
            return this.iTr_cell_input_insertEl(cell, formatterParams, onRendered);
        } else {
            formatterParams.iEl_viewMode?.(cell);
            return cell.getValue();
//            return $(cell.getElement()).prop("outerHTML");
        }
    }
    iTr_cell_date_editor_formatterEl = (cell, formatterParams, onRendered) => {
        formatterParams = { type: "date", ...formatterParams};
        
        let editMode = cell.getRow().getData().isCurrentRow?.edit_mode || false;              
        let ww = {"date": 108, "datetime-local": 171};
        let ff = {"date": "yyyy-MM-dd", "datetime-local": "yyyy-MM-dd HH:mm:ss"};
        
        if (editMode) {
//            const date = new Date(cell.getValue());
//            const cellValue = DateTime.fromJSDate(date).toFormat('yyyy-MM-dd');
            const cellValue = DateTime.fromISO((cell.getValue() || "").replace(' ', 'T'), { zone: 'utc' }).toFormat(ff[formatterParams.type]);
                
            const input = $(`<input class="form-control form-control-sm" type="${formatterParams.type}" style="width: ${ww[formatterParams.type]}px;">`)
                .val(cellValue)
                .on('blur', function (e) {
                    // This is another way to do it BUT it reformats the row and if we have a class is-invalid we will lose it
                    // cell.getTable().updateData([
                    //     { ...cell.getRow().getData(), [cell.getField()]: DateTime.fromFormat($(this).val(), 'yyyy-MM-dd').toFormat('yyyy-MM-dd'), isUpdated: true },
                    // ]);
                    cell.getData()[cell.getField()] = DateTime.fromFormat($(this).val(), ff[formatterParams.type]).toFormat(ff[formatterParams.type]);
                    cell.getData().isUpdated = true;        
                });
                    
            return input[0];
        } else {
//            return DateTime.fromJSDate(new Date(cell.getValue())).toFormat('MM/dd/yyyy');            
            return DateTime.fromISO((cell.getValue() || "").replace(' ', 'T')).toFormat(ff[formatterParams.type]); // the .replace(' ', 'T') is to have teh date time in ISO format
        }  
    }
    iTr_zoom_or_edit(a, calledBy, event, cell){        
        let defaults = {            
            "popo_css" : {"min-width": "575px"},
            "popo_title" : "Field data advanced edit mode",
            "popo_z" : {"class": "mb-0", style: "background-color: #e7e7e9;"},
            "popo_e" : {"class": "mb-0", style: "background-color: #e7e7e9;"},   
            "popo_offset" : [0, -5],
            "tarea_rows" : 4,            
            "tarea_cc"   : "w-100",
            "tt_cusCl"   : "tooltip-info",
            "fun_onStrat" : null,     // do NOT change to -> function(){} as later we check if we have a function -> $.isFunction()
        };           
        defaults = $.extend(true,defaults, a)     
                   
        let cell_el = cell.getElement();        
        
        $(".tabulator-cell", cell.getTable().element).not('.edit-row-visulizer .tabulator-cell').tooltip("dispose").popover("dispose");
                            
        // <editor-fold defaultstate="collapsed" desc=" on: td's dblclick ">
        if(calledBy === "DblClick"){                        
            $(cell_el).popover({"title": defaults["popo_title"], "content": "TEMP-placeholder", "placement": "auto", "html": true, "customClass": "dt_input_focus", "offset": defaults["popo_offset"]}).popover("show");
            $(cell_el).on("shown.bs.popover", function(){
                let pover = $(".popover.dt_input_focus");   // = the custom class
                
                let btn_close = $('<button class="btn btn-sm btn-secondary border-dark border-w2 shadow px-4" \n\
                        type="button">Close</button>')
                    .click(function(){
                        let pover = $(this).closest(".popover");
                        let cal_el = $(`[aria-describedby="${$(pover).prop("id")}"]`);
                        $(cal_el).popover("dispose");
                    });
                        
                let btn_update = $('<button class="btn btn-sm btn-warning border-dark border-w2 shadow ms-4" \n\
                        type="button">Update field</button>')
                    .click(function(){
                        let pover = $(this).closest(".popover");
                        let $cell = cell.getElement();
                        $("input", $cell).val($("textarea", pover).val()).change();
                        $($cell).popover("dispose");
                    });                
                
                let data = null;
                let cc = null;
                let ss = null;
                let texta_class = null;
                let isDisabled = null;
                if( $(":input", $(cell_el)).length ){
                    cc = defaults["popo_e"]["class"];
                    ss = defaults["popo_e"]["style"];
                    data = $(":input", $(cell_el)).val();
                } else {
                    cc = defaults["popo_z"]["class"];
                    ss = defaults["popo_z"]["style"];
                    data =  $(cell_el).text();
                    texta_class = "text-dark bg-opacity-10";
                    isDisabled = "disabled";
                }
                
                let pover_els = `
                    <div class="row"><div class="col">
                        <textarea class="${texta_class} ${defaults['tarea_cc']}" rows="${defaults['tarea_rows']}" ${isDisabled}></textarea>
                    </div></div>
                    <div class="row text-center mt-2"><div class="col col_btns"></div></div>`;
                $(".popover-body", pover).html(pover_els);
                
                $(".col_btns", pover).append(btn_close);
                if( $(":input", $(cell_el)).length ){
                    $(".col_btns", pover).append(btn_update);
                }
                
                $(".popover-body", pover).addClass(cc).attr("style", ss);
                $(".popover-body textarea", pover).val(data).focus();
                $(pover).css( defaults["popo_css"] ).addClass("shadow");
            });
          }           
        // </editor-fold>
                        
        // <editor-fold defaultstate="collapsed" desc=" MouseEnter ">
        if(calledBy === "MouseEnter"){            
//             iConsole(`MouseEnter ${$(cell_el)[0].scrollWidth} ${$(cell_el).innerWidth()}`);
//             console.log(`MouseEnter ${$(cell_el)[0].scrollWidth} ${$(cell_el).innerWidth()}`);

          if ($(cell_el).text() !== "") {
            if ( $(cell_el)[0].scrollWidth - $(cell_el).innerWidth() > 1 ) {              
                let ttText = $(cell_el).text();
                ttText = ttText.replaceAll(";", ";<br>");

                try {
                    let jsonObject = $.parseJSON(ttText);
                    ttText = `<pre style="width:250px; margin: 0px 10px 10px -25px;">${JSON.stringify(jsonObject, null, 2)}</pre>`;
                    
//                    $("body").append("<style type='text/css'>pre{ margin: 0px 10px 10px -25px !important; min-width: 200px;}</style>");                    
                    let style = "pre{ margin: 0px 10px 10px -25px !important; min-width: 200px; }";
                    let styleExists = false;
                    $("style").each(function() {
                        var cssContent = $(this).html();

                        if (cssContent.includes(style)) {
                            styleExists = true;
                            return false;  // Break the loop
                        }
                    });
                    if(! styleExists){
                        $("body").append(`<style type="text/css">${style}</style>`);
                    }
                } catch (err) {}

                $(cell_el).tooltip({ "title": ttText, "customClass": defaults["tt_cusCl"], "html": true, "placement": "left"})
                    .tooltip("show");              
            }
          }
        }
        // </editor-fold>        
    }

    // for inserting the select dropdown 
    cell_xv_onEdit_insert = (cell, formatterParams, onRendered, opts = {}) => {
        opts = {TMPL_el:  '#TMPL_select_element_dropdown', ...opts};
        const select = $(opts.TMPL_el).contents().clone(true);
        
        if(opts.options){
            $.each(opts.options, (kk, vv)=>{
                $(`option[data-el_for="${kk}"]`, select).val(vv["v"]).text(vv["t"]);            
            });
        }

        if(opts.appendTo){
            $(appendTo).append(select);
        }

        if(opts.onChange){
            $(select).on("change", opts.onChange);
        }
        
        return select;
    }

    toggleVisibilityDropdownCheckbox = (parent, checkValue) => {
        $('input', parent)
            .prop('checked', checkValue).trigger("change")
            .toArray()
            .forEach((input) => {
                if (checkValue) {
                    // show the column
                    this.TabulatorObj.showColumn($(input).prop('value'));
                } else {
                    // hide the columns
                    this.TabulatorObj.hideColumn($(input).prop('value'));
                }
            });
        if (this.TableSettings.persist_column_visibility.enabled) {
            if (checkValue) {
                // empty the hiddenColumns
                this.TableSettings.persist_column_visibility.hiddenColumns = [];
            } else {
                // empty the hiddenColumns and then push all the columns agains
                this.TableSettings.persist_column_visibility.hiddenColumns = [];
                $('input', parent).toArray().forEach((input) => {
                    this.TableSettings.persist_column_visibility.hiddenColumns.push($(input).prop('value'))
                });
            }
        }

        Store.set(this.localStorageKey, this.TableSettings);
    }
}

// <editor-fold defaultstate="collapsed" desc=" fn: adding tooltip to column header ">
//#region -adding tooltip to column header
function addTooltipToTheColumns(CustomTbrObj, tooltipColumns) {
    tooltipColumns.forEach((opts) => {
        const options = {
            field: null,
            content: null,      // if null we will take it from element with attribute tt_for-field="options.field"
            position: 'top',            
            customClass: '',    // "tooltip-info" is the default to replace and or add class(es) use "tooltip-info tooltip-danger tt_width-600" we will toggle it.
            customToolTipItem : $(`<i class='far fa-info-circle text-dark pe-2'></i>`),
            ...opts
        };
        
        if(options.content === null){            
//            options.content = $(`[tt_for-field=${options.field}]`).contains().clone();            
            // +IR+ we need a better way to do it
            options.content = $('<div>').append($(`[tt_for-field=${options.field}]`, CustomTbrObj.tableContainerElement ).contents().clone())[0];
        }                
        options.customClass = $("<div>").addClass("tooltip-info").toggleClass(options.customClass).attr("class");
        
        
        // if (_userStr == 'dummy') {
        //     tooltipItem = $(`<span><i class="fa-solid fa-info pe-2"></i></span>`);
        // }

//        const element = new bootstrap.Tooltip(tooltipItem, {
        const element = new bootstrap.Tooltip(options.customToolTipItem, {
            placement: options.position,
            customClass: options.customClass,
            title: options.content,
            html: true
//        }); // _element is coming from bootstrap tooltip
        })._element; // _element is coming from bootstrap tooltip
/*
        const element = new bootstrap.Popover(tooltipItem, {
            placement: options.position,
            customClass: options.customClass,
            title: options.content,
            html: true,
            trigger: "hover focus"
        })._element; // _element is coming from bootstrap tooltip
*/
//        $(tbrObj.element).find(`div[tabulator-field='${col.field}'] .tabulator-col-title`).prepend(element);
        $(CustomTbrObj.TabulatorObj.element).find(`div[tabulator-field='${options.field}'] .tabulator-col-title`).prepend(element);
    });
}

// <editor-fold defaultstate="collapsed" desc=" Not in use ">
//#region -Not in use
class __Tooltip {
    constructor(args, customToolTipItem) {
        const options = {
            content: 'write a text',
            position: 'top',
            customClass: 'tooltip-info',
            elClass: 'fa fa-info-circle text-dark pe-2',
            ...args
        };

        let tooltipItem = $(`<i class='${options.elClass}'></i>`);
        if (customToolTipItem) {
            tooltipItem = customToolTipItem;
        }
        // if (_userStr == 'dummy') {
        //     tooltipItem = $(`<span><i class="fa-solid fa-info pe-2"></i></span>`);
        // }

        this.element = new bootstrap.Tooltip(tooltipItem, {
            placement: options?.position,
            customClass: options?.customClass,
            title: options.content,
            html: true
        })._element; // _element is coming from bootstrap tooltip
    }

    // constructor(
    //     options = { content: 'write a text', position: 'top', customClass: 'tooltip-info', elClass: 'far fa-info-circle text-dark pe-2' },
    //     customToolTipItem
    // ) {
    //     let tooltipItem = $(`<i class='${options.elClass ?? 'fa fa-info-circle text-dark pe-2'}'></i>`);
    //     if (customToolTipItem) {
    //         tooltipItem = customToolTipItem;
    //     }
    //     // if (_userStr == 'dummy') {
    //     //     tooltipItem = $(`<span><i class="fa-solid fa-info pe-2"></i></span>`);
    //     // }

    //     this.element = new bootstrap.Tooltip(tooltipItem, {
    //         placement: options?.position ?? 'top',
    //         customClass: options?.customClass ?? 'tooltip-info tt_width-600',
    //         title: options.content ?? 'default title',
    //         html: true,
    //     })._element;

    //     //        $(this.element).tooltip("show");
    //     //                data-bs-toggle="tooltip"
    //     //                data-bs-placement="${options.position ?? 'bottom'}"
    //     //                data-bs-html="true"
    //     //                data-bs-custom-class="${options.customClass ?? ''}"
    //     //                title='${content}'
    //     //                class='${options.class ?? ''}'
    //     //            >
    //     //                <i class="fa-solid fa-info"></i>
    //     //            </span>`).tooltip();
    // }

    // defaultElement = $(`<i class='fa fa-info-circle text-dark pe-2'}'></i>`)

    // constructor(columns) {
    //     columns.forEach((col) => {
    //         const element = new bootstrap.Tooltip(col.customElement ?? this.defaultElement, {
    //             placement: options?.position ?? 'top',
    //             customClass: options?.customClass ?? 'tooltip-info tt_width-600',
    //             title: options.content ?? 'default title',
    //             html: true,
    //         })._element;
    //         $(this.TabulatorObj.element).find(`div[tabulator-field='${col.field}'] .tabulator-col-title`).prepend(element);
    //     });
    // }

    /* // +IR+ Do we need it? (working code)
    constructor(content, options = { position: 'bottom', customClass: 'bg-sucess', class: '' }) {
        this.element = $(`<span
                data-bs-toggle="tooltip"
                data-bs-placement="${options.position ?? 'bottom'}"
                data-bs-html="true"
                data-bs-custom-class="${options.customClass ?? ''}"
                title='${content}'
                class='${options.class ?? ''}'
            >
                <i class="fa-solid fa-info"></i>
            </span>`).tooltip();
    }
    */
}
// above the new logic for rendering the tooltips
// class Tooltip {
//     // constructor(
//     //     options = { content: 'write a text', position: 'top', customClass: 'tooltip-info', elClass: 'far fa-info-circle text-dark pe-2' },
//     //     customToolTipItem
//     // ) {
//     //     let tooltipItem = $(`<i class='${options.elClass ?? 'fa fa-info-circle text-dark pe-2'}'></i>`);
//     //     if (customToolTipItem) {
//     //         tooltipItem = customToolTipItem;
//     //     }
//     //     // if (_userStr == 'dummy') {
//     //     //     tooltipItem = $(`<span><i class="fa-solid fa-info pe-2"></i></span>`);
//     //     // }

//     //     this.element = new bootstrap.Tooltip(tooltipItem, {
//     //         placement: options?.position ?? 'top',
//     //         customClass: options?.customClass ?? 'tooltip-info tt_width-600',
//     //         title: options.content ?? 'default title',
//     //         html: true,
//     //     })._element;

//     //     //        $(this.element).tooltip("show");
//     //     //                data-bs-toggle="tooltip"
//     //     //                data-bs-placement="${options.position ?? 'bottom'}"
//     //     //                data-bs-html="true"
//     //     //                data-bs-custom-class="${options.customClass ?? ''}"
//     //     //                title='${content}'
//     //     //                class='${options.class ?? ''}'
//     //     //            >
//     //     //                <i class="fa-solid fa-info"></i>
//     //     //            </span>`).tooltip();
//     // }

//     // defaultElement = $(`<i class='fa fa-info-circle text-dark pe-2'}'></i>`)

//     // constructor(columns) {
//     //     columns.forEach((col) => {
//     //         const element = new bootstrap.Tooltip(col.customElement ?? this.defaultElement, {
//     //             placement: options?.position ?? 'top',
//     //             customClass: options?.customClass ?? 'tooltip-info tt_width-600',
//     //             title: options.content ?? 'default title',
//     //             html: true,
//     //         })._element;
//     //         $(this.TabulatorObj.element).find(`div[tabulator-field='${col.field}'] .tabulator-col-title`).prepend(element);
//     //     });
//     // }

//     /* // +IR+ Do we need it? (working code)
//     constructor(content, options = { position: 'bottom', customClass: 'bg-sucess', class: '' }) {
//         this.element = $(`<span
//                 data-bs-toggle="tooltip"
//                 data-bs-placement="${options.position ?? 'bottom'}"
//                 data-bs-html="true"
//                 data-bs-custom-class="${options.customClass ?? ''}"
//                 title='${content}'
//                 class='${options.class ?? ''}'
//             >
//                 <i class="fa-solid fa-info"></i>
//             </span>`).tooltip();
//     }
//     */
// }
//#endregion
// </editor-fold>
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" class Dropdown ">
//#region -class Dropdown
class Dropdown {
    element = null;
    parentElement = null;
    listItemsArr = [];

    constructor(element, parent, { listItemsArr } = {}) {
        this.element = $(element);
        this.parentElement = $(parent);
        this.parentElement.append(this.element);

        this.listItemsArr = listItemsArr;
    }

    addButton(btnElement) {
        this.element.append(btnElement);
        return this;
    }

    addDropdownMenu(menuElement, cb) {
        this.element.append(menuElement);
        cb.call(this, this.listItemsArr);
        return this;
    }

    initDropdownEvents(cb) {
        cb.call(this);
        return this;
    }
}
//#endregion
// </editor-fold>

var dataLoaderLoading = `
		<style>
			.loader {
				width: 50px;
				padding: 8px;
				aspect-ratio: 1;
				border-radius: 50%;
				background: #2527b0;
				--_m: 
					conic-gradient(#0000 10%,#000),
					linear-gradient(#000 0 0) content-box;
				-webkit-mask: var(--_m);
						mask: var(--_m);
				-webkit-mask-composite: source-out;
						mask-composite: subtract;
				animation: l3 1s infinite linear;
			}
			@keyframes l3 {to{transform: rotate(1turn)}}
		</style>
		<div class="loader"></div>
  `;
var dataLoaderError = `<div class="">Failed to load data</div>`;

var Store = {
    get: (key) => {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (err) {
            console.error(err);
            return null;
        }
    },
    set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
    remove: (key) => localStorage.removeItem(key),
};
var blueColor = '#2980ba';

var DEFAULT_PAGE_SIZE = 25;
var DateTime = luxon.DateTime;

function handleKeyDown(e, onChange, cancel) {
    if (e.key === 'Enter') {
        onChange();
    }
    if (e.key === 'Escape') {
        cancel();
    }
}

async function updateUserDetails(payload) {
    try {
        const res = await (
            await fetch('https://dev1a.ai-rgus.com/php/update-user.php', {
                method: 'POST',
                body: JSON.stringify(payload),
            })
        ).json();
        return res;
    } catch (err) {
        iConsole(err);
        return err;
    }
}

// It is used to clone js objects 
// const copy = deepClone(object)
function deepClone(input) {
    if (input === null || typeof input !== 'object') {
        return input;
    }
    const initialValue = Array.isArray(input) ? [] : {};
    return Object.keys(input).reduce((acc, key) => {
        acc[key] = deepClone(input[key]);
        return acc;
    }, initialValue);
}

function focusInputOnLoad(inputEle) {
    $(inputEle).trigger('focus');
}

function shouldRunAndProceed(fn, ...args) {
    let isPassed = true;
    if (typeof fn == 'function') {
        isPassed = fn(...args);
    }
    return isPassed;
}
function shouldRunAndProceed_new(fn, isCall = false, ...args) {
    let isPassed = true;
    if (typeof fn == 'function') {
        if (isCall) {
            isPassed = fn.call(...args);
        } else {
            isPassed = fn(...args);
        }
    }
    return isPassed;
}

function isColumnVisible(colName) {
    return this.DefaultHiddenColumns.includes(colName)
        ? false
        : this.TableSettings.persist_column_visibility.enabled
            ? !this.TableSettings.persist_column_visibility.hiddenColumns.includes(colName)
            : true;
}

function getHiddenCols() {
    return this.getColumns()
        .filter((col) => !col.isVisible())
        .map((col) => col.getDefinition().field);
}

function getCurrentTimestamp() {
    return luxon.DateTime.fromJSDate(new Date()).toFormat('LLLL dd, yyyy, hh:mm');
}


// <editor-fold defaultstate="collapsed" desc=" Nested table(s) ">
//#region -Nested table(s)
// <editor-fold defaultstate="collapsed" desc=" fn: cellF_rowExpand ">
//#region -fn: cellF_rowExpand
function __cellF_rowExpand(cell, formatterParams, onRendered) {
    let row = cell.getRow();
    let returnVal = null;

    const button = $(
        `<button type="button" class="expand-btn btn btn-sm btn-success m-0 p-0"><i class="fas fa-plus px-1"></i></button>`
    ).click((e) => {
        const isExpanded = $(e.target).closest("button").data('expanded');
        if (isExpanded) {
            deleteTableAndCollapseRow(e, row);
        } else {
            expandRowWithNestedTable_Level1(e, row);
        }
    });

    returnVal = $(button)[0];
    return returnVal;
}
//#endregion
// </editor-fold>
// <editor-fold defaultstate="collapsed" desc=" fn: deleteTableAndCollapseRow ">
//#region -fn: deleteTableAndCollapseRow
function deleteTableAndCollapseRow(e, row) {
    // on collapse - hide dropdown and popovers
    iBS_hideAll_Popovers();
    iBS_hideAll_Dropdowns();


    //    $(e.target).data('expanded', false);
    //    $(e.target).html('+');
    //    $(e.target).addClass('bg-primary');
    //    $(e.target).removeClass('bg-danger');

    let btn = $(e.target).closest("button");
    $(btn).data('expanded', false).removeClass("btn-danger").addClass("btn-success");
    $("i", btn).removeClass("fa-minus").addClass("fa-plus");


    $(row.getElement()).find('div.table-container').remove();
}
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" fn: iGet_el_MasterFilter ">
//#region -fn: iGet_el_MasterFilter 
function iGet_el_MasterFilter(opt = {}) {
    let def = {
        tmpl: "#TMPL_master_search_w",
        el_w: { class: "master_search_w", style: null },
        input_el: { class: null, style: null }
    };
    opt = $.extend(true, def, opt);
    
    let el_w = $(opt.tmpl).clone(true).removeAttr('id').removeClass('d-none');
    $(el_w).toggleClass(opt.el_w.class).attr("style", opt.el_w.style);    
    $("input", el_w).toggleClass(opt.input_el.class).attr("style", opt.input_el.style);    
    
    return el_w;
};
//#endregion
// </editor-fold>
// <editor-fold defaultstate="collapsed" desc=" fn: iGet_el_SelectDropdown ">
//#region -fn: iGet_el_SelectDropdown 
function iGet_el_SelectDropdown(ops = {}) {
    let def = {
        TabulatorObj: {},  // this is our main class
        calling_for : null,
        tmpl:         '#TMPL_dropdownSelection_withFilterAndApply',
        el_w:         { class: null, style: null },       
        calling_btn:  { class: null, style: null, icon: {class: null, style: null}, alt_el: null },   // The button we click to activate the dropdown
        dd_element:   { class: null, style: "width:250px; height:300px" },   // the element opened once we click on the calling btn        
        dd_title :    { class: null, style: null, text: null },
        dd_filter:    { class: null, style: null, input: { class: null, style: null, type: 'search', "placeholder": "Search..." } },
        dd_select_all:{ class: null, style: "", initialVal: true },
        dd_select_list:{ data:[], dVal:"field", dTxt: "title", exludeBy: null, // must have attr 'visible: 1' if we want to show the check box, checked
            class: null, style: "width:240px; height:100%; overflow-y:auto;" },        
        fn_onSelectAllChange: null, // if it returns false we will bypass the default code
        fn_onInptChkChange:   null,
        fn_onDropdown_shown:  null
        // applayBtns    : {}, not in use for teh moment
    };
    ops = $.extend(true, def, ops);
    let selDD_el = $(ops.tmpl).clone(true).removeAttr('id').toggleClass('d-none');
    let _sDd_id = "a"+Date.now();   // only number as id is not good
    
    /*setTimeout(()=>{
//        bb = bootstrap.Dropdown.getInstance(selDD_el);    

//    
    var dropdown = new bootstrap.Dropdown(selDD_el[0], {
      autoClose: 'outside' // Set autoClose to 'outside', 'inside', 'true', or 'false'
    });
    
    }, 5000);
    
//  var dd = new bootstrap.Dropdown(selDD_el, {
//    autoClose: 'outside' 
//  });*/
    
        
    // <editor-fold defaultstate="collapsed" desc=" setting calling and the dropdown window exterra ">
    //#region -setting calling and the dropdown window exterra
    $(selDD_el).toggleClass(ops.el_w.class).attr("style", ops.el_w.style);
//    $(selDD_el).toggleClass(ops.el_w.class).attr("style", ops.el_w.style).attr("id", _sDd_id);


    // hide all other open dropdowns before the dropdown is added to dom and by that activate the $(selDD_el).on("hidden.bs.dropdown", function(){
    $(selDD_el).on("show.bs.dropdown", function(e){        
        // console.log("dropdown btn show.bs.dropdown");
        iBS_hideAll_Dropdowns();
        iBS_hideAll_Popovers();
    });
    
    $(selDD_el).on("shown.bs.dropdown", function(e){
        console.log("dropdown btn shown.bs.dropdown");
        if (!shouldRunAndProceed(ops.fn_onDropdown_shown, e, ops)) {
            return;
        }
        
        $(".iDDselnWfilter_btn", selDD_el).addClass("fw-bold");
        $(".iDDselnWfilter_btn i", selDD_el).toggleClass("fal far");        
        setTimeout(()=>{
            $(".filterByValue input", $(`[data-for_seldd_id="${$('.iDDselnWfilter_btn', selDD_el).attr("id")}"]`)).focus();
        });     
         
        // We use this when we must move the dropdown window to the <body> if not we do not see the dropdown
        if($(selDD_el).hasClass("move_ddown_to_body") && $("ul.dropdown-menu", selDD_el).length){            
            $("ul.dropdown-menu", selDD_el).addClass("moved_ddown_to_body").appendTo("body");
            $(".moved_ddown_to_body .form-check-input", "body").removeClass("form-control form-control-sm");            
        }                
    });
    
    $(selDD_el).on("hidden.bs.dropdown", function(){        
         console.log("dropdown btn hidden.bs.dropdown");
        let $ddownWin_el = $(`[data-for_seldd_id="${$('.iDDselnWfilter_btn', selDD_el).attr("id")}"]`);
        $(".filterByValue input", $ddownWin_el).val("").change();

        $(".iDDselnWfilter_btn", selDD_el).removeClass("fw-bold");
        $(".iDDselnWfilter_btn i", selDD_el).toggleClass("fal far");

        // $(`[data-for_seldd_id="${$('.dropdown-toggle', selDD_el).attr("id")}"]`).appendTo(selDD_el);
    });

    $(".iDDselnWfilter_btn", selDD_el).toggleClass(ops.calling_btn.class).attr({"style": ops.calling_btn.style, "id": _sDd_id});
    if ((ops.calling_btn.alt_el || "") === ""){
        $(".iDDselnWfilter_btn .btn_icon", selDD_el).toggleClass(ops.calling_btn.icon.class).attr("style", ops.calling_btn.icon.style);    
    } else {
        $(".iDDselnWfilter_btn .btn_icon", selDD_el).remove();
        $(".iDDselnWfilter_btn", selDD_el).append(ops.calling_btn.alt_el);
    }
    
    // the dropdown element                        
    $('.dropdown-menu', selDD_el).toggleClass(ops.dd_element.class).attr({"style": ops.dd_element.style, "data-for_seldd_id": _sDd_id})
        .click(e => e.stopPropagation());

    $(".ddM_title", selDD_el).text(ops.dd_title.text).toggleClass(ops.dd_title.class).attr("style", ops.dd_title.style);
            
    $(".select_deselec_all_w", selDD_el).toggleClass(ops.dd_select_all.class).attr("style", ops.dd_select_all.style);
    let _id = "a"+Date.now();   // only number as id is not good
    $(".select_deselec_all_w input", selDD_el).attr("id", _id);
    $(".select_deselec_all_w label", selDD_el).attr("for", _id);
    
    $(".dds_itemsList_w ", selDD_el).toggleClass(ops.dd_select_list.class).attr("style", ops.dd_select_list.style);    
    //#endregion
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc=" filterByValue input: set it upand in input change ">
    //#region -setting calling and the dropdown window els
    $('.filterByValue', selDD_el).toggleClass(ops.dd_filter.class).attr("style", ops.dd_filter.style);
    $('.filterByValue input', selDD_el)
        .attr({"placeholder": ops.dd_filter.input.placeholder, "type": ops.dd_filter.input.type, "style": ops.dd_filter.input.style})
        .toggleClass(ops.dd_filter.input.class)
        .on('input change', function (e) {
            console.log("filterByValue input", selDD_el);
//            searchList.call(this, e, tbl_ColumsToggleVisib_menu, 'data-hidden-from-menu');
            
            var value = $.trim($(this).val().toLowerCase());            
            $chBoxs = $(".dds_itemsList_w .form-check:not([data-hidden-by-col_view='true'])", $(`[data-for_seldd_id="${$('.iDDselnWfilter_btn', selDD_el).attr("id")}"]`));
            $chBoxs.attr("data-hidden-from-menu", false);
                                                
            $chBoxs.each(function () {
                let setTo = $.trim($(this).text()).toLowerCase().includes(value);
                $(this).toggle(setTo).attr("data-hidden-from-menu", !setTo);
            });
            
            //console.log($(".dds_itemsList_w .form-check[data-hidden-from-menu='false']", selDD_el).length, value);
            // show/hide the select all based on if thereis what to select
            $(".select_deselec_all_w", selDD_el).toggle($(".dds_itemsList_w .form-check[data-hidden-from-menu='false']", selDD_el).length > 0);

            set_selectAll_indicators(e);            
    });
    //#endregion
    // </editor-fold>

    
    // <editor-fold defaultstate="collapsed" desc=" Select ALL settings and on change ">
    //#region -creating and managing the checkbox list
    $(".select_deselec_all_w input", selDD_el).prop("checked", ops.dd_select_all.initialVal);                    
    $(".select_deselec_all_w input", selDD_el).change(function(e){
        if (typeof ops.fn_onSelectAllChange === 'function') {
            if(! ops.fn_onSelectAllChange?.(e)){
                return true;
            }
        }
        

//        if (tbl_int_mode == 'paginated-local') {
            //  We are selecting all the relevat elements for what we want to do and we apply the .click() to them
            if(e.target.checked){
                $(".dds_itemsList_w [data-hidden-from-menu='false'] input:is(:not(:checked))", selDD_el).click();
            } else {
                $(".dds_itemsList_w [data-hidden-from-menu='false'] input:is(:checked)", selDD_el).click();
            }
//            set_selectAll_indicators(e);
//            } else {
//                iTr_searchFnQuery($(src_el).val());
//            }
    });
    //#endregion
    // </editor-fold>        
    
    // <editor-fold defaultstate="collapsed" desc=" Checkbox list: settings and on change ">
    //#region -creating and managing the checkbox list
    let ii = 1;
    let _chBox_el = $("#TMPL_checkbox", ops.tmpl).clone(true).removeAttr('id').toggleClass('d-none');                            
    ops.dd_select_list.data.forEach((listItem) => {
//        console.log("--- create dd chboxs",{listItem},listItem.iExcludeFromList?.[ops.dd_select_list.exludeBy]);    
        if(listItem.iExcludeFromList?.[ops.dd_select_list.exludeBy] === 0){ // exludeBy is our attribute array exists only if necessary in the column definition
            return true;
        }               
        console.log({listItem}, listItem['dinm_dd_toCcheck'], listItem['field'],listItem["initialChecked"], listItem.visible );

        let chBox_el = $(_chBox_el).clone(true);        

        let data_hidden_from_menu = null;
        let isToCheckIt = null;
        if(ops.calling_for === "masterSearch"){
            data_hidden_from_menu = !listItem.visible && listItem.hidden_by_user;
            isToCheckIt = listItem.dinm_dd_toCcheck?? !listItem.hidden_by_user?? 1;
        } else if(ops.calling_for === "colsVisibility"){
            data_hidden_from_menu = !listItem.visible && !listItem.hidden_by_user;
            isToCheckIt = listItem.dinm_dd_toCcheck?? !listItem.hidden_by_user?? 1;
        } else {
            data_hidden_from_menu = !listItem.visible;
            isToCheckIt = listItem.dinm_dd_toCcheck?? 1;
        }

        $(chBox_el).attr('data-hidden-from-menu', data_hidden_from_menu);
        if(ops.calling_for === "masterSearch"){
            $(chBox_el).attr('data-hidden-by-col_view', data_hidden_from_menu);
        }
        
        
        let _id = `el_${ii++}_${performance.now().toString().replace('.', '_')}`; // only number as id is not good and '.' can not be part of the id string
//        let isToCheckIt = listItem.dinm_dd_toCcheck?? !listItem.hidden_by_user?? 1;
//        $("input", chBox_el).attr({"id": _id, "value": `${listItem?.[ops.dd_select_list.dVal]}`}).prop("checked", listItem.dinm_dd_toCcheck?? 1);
        $("input", chBox_el).attr({"id": _id, "value": `${listItem?.[ops.dd_select_list.dVal]}`}).prop("checked", isToCheckIt);
        $("label", chBox_el).attr({"for": _id}).empty().append(`${listItem?.[ops.dd_select_list.dTxt]}`);
        $(".dds_itemsList_w", selDD_el).append(chBox_el);
    });
    
    if($.inArray(ops.calling_for,["masterSearch", "colsVisibility"]) !== -1){
        set_selectAll_indicators({target: "test"});
    }

    $(".dds_itemsList_w input", selDD_el).change(function(e){        
        console.log("dds_itemsList_w input", selDD_el);
        ops.fn_onInptChkChange?.(e, ops);
        set_selectAll_indicators(e);
        
        const dropdownToggle = $('.iDDselnWfilter_btn', $(selDD_el));
        if(dropdownToggle.length != 0){
            bootstrap.Dropdown.getInstance(dropdownToggle)?.show();
        }
    }); 
    //#endregion
    // </editor-fold>
    
    // <editor-fold defaultstate="collapsed" desc=" fn: set_selectAll_indicators: set icon + text of checkbox all ">
    //#region -fn: set_selectAll_indicators
    function set_selectAll_indicators(e){
        const $chBoxs_els = $(".dds_itemsList_w .form-check[data-hidden-from-menu='false']", selDD_el); // Select all visible checkboxes in the container        
        const totalCheckboxes = $chBoxs_els.length;
        const checkedCheckboxes = $("input", $chBoxs_els).filter(':checked').length;

        console.log("ddown chbox on change",{totalCheckboxes, checkedCheckboxes}, e.target, $(".dds_itemsList_w .form-check[data-hidden-from-menu='true']", selDD_el));   
        if (checkedCheckboxes === 0) {
            $(".select_deselec_all_w input", selDD_el).prop({"checked": 0, "indeterminate": 0});
            $(".select_deselec_all_w label", selDD_el).text("Select all");
        } else if (checkedCheckboxes === totalCheckboxes) {
            $(".select_deselec_all_w input", selDD_el).prop({"checked": 1, "indeterminate": 0});
            $(".select_deselec_all_w label", selDD_el).text("Deselect all");
        } else {
            $(".select_deselec_all_w input", selDD_el).prop("indeterminate", 1);
            $(".select_deselec_all_w label", selDD_el).text("Deselect all");
        }
        
        $('.badge', selDD_el).remove();
        let badge_nr = totalCheckboxes - checkedCheckboxes;
        if (badge_nr > 0){
            $(selDD_el).append(`<span class="position-absolute translate-middle badge rounded-pill bg-primary" style="margin-left: -10px">${badge_nr}</span>`);
        }        
    }

    // need to run this to show the badge counter and update the select-all checkbox status on initial load
    // direct all is not working, so calling it inside the setTimeout
    // ++Test++
    // setTimeout(()=>{
        // set_selectAll_indicators({})
    // })


    //#endregion
    // </editor-fold>
        
    // <editor-fold defaultstate="collapsed" desc=" COMMENT ">
    //#region -Nested table(s)
    /*
    <div class="btn-group dropup">
<button type="button" class="btn btn-secondary">
Split dropup
</button>
<button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
<span class="visually-hidden">Toggle Dropdown</span>
</button>
<ul class="dropdown-menu">
<!-- Dropdown menu links -->
</ul>
</div>*/
    /*
                    <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                    <label class="form-check-label" for="flexCheckDefault">
                      Default checkbox
                    </label>
                  </div>

                  <button type="button" class="btn btn-primary">Primary</button>
                  <button type="button" class="btn btn-outline-primary">Primary</button>
                  */
    //#endregion
    // </editor-fold>
    return selDD_el;
}
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" fn: iSelectPopover ">
//#region -fn: iSelectPopover 
// +IR+ I do not think that we use it
function iSelectPopover(ops = {}) {
    let def = {
        tmpl: '#TMPL_popoverSelection_withFilter',        
        el_w:        { class: null, style: null },       
        calling_btn: { class: null, style: null, icon: {class: null, style: null} },   // The button we click to activate the dropdown
        dd_element:  { class: null, style: "width:250px; height:300px" },   // the element opened once we click on the calling btn        
        dd_title :   { class: null, style: null, text: null },
        dd_filter:   { class: null, style: null, input: { class: null, style: null, type: 'search', "placeholder": "Search..." } },
        dd_select_all : { class: null, style: "", initialVal: true },
        dd_select_list: { data:[], dVal:"field", dTxt: "title", exludeBy: null,
            class: null, style: "width:240px; height:100%; overflow-y:auto;" },
        fn_onSelectAllChange: null, // if it returns false we will bypass the default code
        fn_onInptChkChange:   null
    };
    ops = $.extend(true, def, ops);
    let selDD_el = $(ops.tmpl).clone(true).removeAttr('id').toggleClass('d-none');    
            
    $(selDD_el).toggleClass(ops.el_w.class).attr("style", ops.el_w.style);

    $(selDD_el).popover({"title": "popo_title", "content": "TEMP-placeholder", "placement": "bottom", "html": true, "customClass": "item-container"}).popover("show");
    $(selDD_el).on("shown.bs.popover",()=>{                                
        const pover = $(".popover.item-container");
        const pover_els = $(`
            <div class='dds_itemsList_w' style="overflow-y: auto; height: 200px;"></div>
        `).click((e)=> e.stopPropagation())
       
        let uniqueLocations = def.TabulatorObj.getData().reduce((acc, obj) => {
            acc[obj.location] = (acc[obj.location] || 0) + 1; 
            return acc;
        }, {});
        let selected_counts = def.TabulatorObj.getSelectedData().reduce((acc, obj) => {
            acc[obj.location] = (acc[obj.location] || 0) + 1; 
            return acc;
        }, {});

        let _chBox_el = $("#TMPL_checkbox", ops.tmpl).clone(true).removeAttr('id').toggleClass('d-none');                            

        function set_selectAll_indicators(e){
            const $chBoxs_els = $(".dds_itemsList_w .form-check[data-hidden-from-menu='false']", selDD_el); // Select all visible checkboxes in the container        
            const totalCheckboxes = $chBoxs_els.length;
            const checkedCheckboxes = $("input", $chBoxs_els).filter(':checked').length;
    
            if (checkedCheckboxes === 0) {
                $(".select_deselec_all_w input", selDD_el).prop({"checked": 0, "indeterminate": 0});
                $(".select_deselec_all_w label", selDD_el).text("Select all");
            } else if (checkedCheckboxes === totalCheckboxes) {
                $(".select_deselec_all_w input", selDD_el).prop({"checked": 1, "indeterminate": 0});
                $(".select_deselec_all_w label", selDD_el).text("Deselect all");
            } else {
                $(".select_deselec_all_w input", selDD_el).prop("indeterminate", 1);
                $(".select_deselec_all_w label", selDD_el).text("Deselect all");
            }
            
            $('.badge', selDD_el).remove();
            let badge_nr = totalCheckboxes - checkedCheckboxes;
            if (badge_nr > 0){
                $(selDD_el).append(`<span class="position-absolute translate-middle badge rounded-pill bg-primary" style="margin-left: -10px">${badge_nr}</span>`);
            }    
            
            const location_nm = $(e.target).attr("value")

            if($(e.target).prop("checked")){
                ops.TabulatorObj.getRows().map((row)=>{
                    if(row.getData().location == location_nm){
                        row.select();
                    }
                })
                // updating the select rows count(in label) for the select checkebox
                const counter_el = $(e.target).closest(".form-check").find(".select-count")
                counter_el.empty().text(counter_el.attr("data-total-count"))
            }else{
                // console.log({col}, 'uncheck')
                ops.TabulatorObj.getRows().map((row)=>{
                    if(row.getData().location == location_nm){
                        row.deselect();
                    }
                });
                // updating the select rows count(in label) for the select checkebox
                const counter_el = $(e.target).closest(".form-check").find(".select-count")
                counter_el.empty().text(0)
            }
        }

        

        Object.keys(uniqueLocations).map(col => {            
            let chBox_el = $(_chBox_el).clone(true);        
            
            let _id = `el_${performance.now()}`; // only number as id is not good

            $("input", chBox_el).attr({"id": _id, "value": col}).prop("checked", 0);
            $("label", chBox_el).attr({"for": _id, style:"padding-right:14px"}).empty().append(`${col}  <span class='select-count' data-total-count='${uniqueLocations[col]}'>${selected_counts[col] ?? 0}</span>/${uniqueLocations[col]}`);
            $(pover_els).append(chBox_el);

            $("input", pover_els).change(function(e){
                set_selectAll_indicators(e);
            });  
        });

        $(".popover-body", pover).html(pover_els);
    });

    return selDD_el;
}
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" fn: iConsole ">
//#region -fn: iConsole 
function iConsole(...content){
    if(CONSOLE_ON){
    // Create an Error object to extract the stack trace
    const error = new Error();
    const stackLines = error.stack.split('\n');

    // Firefox-specific adjustment: Typically, the calling function is at index 3
    const callerLine = stackLines[2].trim(); 

    // Use console.log.apply to maintain the calling context
    //  Function.prototype.apply.call(console.log, console, [...content]);
        // Optionally log the caller line separately if needed
        console.log('Called from:', callerLine); // Use this line if you want to explicitly log the caller
    }
}
//#endregion
// </editor-fold>

// <editor-fold defaultstate="collapsed" desc=" fns: extenthion to Bootstrap: hide all popovers, dropdowns ">
//#region -fn: iConsole 
function iBS_hideAll_Popovers(){
    $.each($(".popover.show"), function(){
        const popoverToggle = $(`[aria-describedby=${$(this).attr("id")}]`);
        if(popoverToggle.length > 0){
            bootstrap.Popover.getInstance(popoverToggle).hide();
        }
    });
}
function iBS_hideAll_Dropdowns(){
    $.each($(".dropdown-menu.show"), function(){
        const dropdownToggle = $(`#${$(this).attr("data-for_seldd_id")}`);
        if(dropdownToggle.length > 0){
            bootstrap.Dropdown.getInstance(dropdownToggle).hide();
        }        
    });
}
//#endregion
// </editor-fold>


var i_el_cc = {
    "none-selected"   : "none-selected    far fa-square       text-primary ", 
    "all-selected"    : "all-selected     far fa-times-square text-danger ",
    "partial-selected": "partial-selected far fa-expand       text-dark"
};

if(_TESTING_NB){
    i_el_cc = {
        "none-selected"   : "none-selected fa fa-square text-primary", 
        "all-selected"    : "all-selected fa fa-times-square text-danger",
        "partial-selected": "partial-selected fa fa-expand text-dark"
    };
}