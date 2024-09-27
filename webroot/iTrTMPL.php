<?php

?>
<!-- action container -->
<!-- operations options for only one selected -->
<div id="TMPL_actions_template" class="action-template d-none mt-3 p-2" style='height:60px;'>
    <div class="single-row-operations-container selected-row-options d-none px-2">
        <button _title="update selected rows" class="enable-row-edit-btn btn me-2">
            <i class="fas fa-edit"></i>
            <i class="fa-solid fa-edit" data-test-el="1"></i>
        </button>
        <button _title="update selected rows" class="update-edited-row-btn btn me-2" disabled="">
            <i class="fas fa-check"></i>
            <i class="fa-solid fa-check" data-test-el="1"></i>
        </button>
        <button _title="discard changes" class="discard-edited-row-btn btn  me-2" disabled="">
            <i class="fas fa-undo-alt"></i>
            <i class="fa fa-undo" data-test-el="1"></i>
        </button>
        <button _title="duplicate row" class="duplicate-row-btn btn  me-2">
            <i class="far fa-clone _cursor-pointer _pt-1" data-bs-custom-class="tooltip-info" data-bs-toggle="tooltip" data-bs-placement="auto" data-bs-html="true" data-bs-title="<div class='my-1'>Duplicate this row</div>"></i>
            <i class="fa-solid fa-copy" data-test-el="1"></i>
        </button>
        <button _title="delete row" class="delete-row-btn btn text-danger border-danger d-none me-2">
            <i class="fas fa-trash-alt" data-bs-custom-class="tooltip-danger" data-bs-toggle="tooltip" data-bs-placement="auto" data-bs-html="true" data-bs-title="<div class='my-1'>Delete this row</div>"></i>
            <i class="fa-solid fa-trash" data-test-el="1"></i>
        </button>
    </div>

    <div id="bulk-operation-btns-container" class="add-new-btn-container d-flex gap-2" style="justify-content:space-between;width:100%;">
        <button id="TMPL_add-new-row-btn" class="add-new-row-btn btn me-2">
            <i class="fal fa-plus pe-1"></i>
            <i class="fa fa-plus pe-1" data-test-el="1"></i>
            Add new record
        </button>
        <div class="sort-by-btns d-flex d-none ms-auto">
            <button class='btn text-danger border-danger border-end-0' style="border-top-right-radius: 0;border-bottom-right-radius:0;" data-sort-by='reset' title='clear sort'><i class="fa-solid fa-xmark"></i></button>
            <div class="btn-group" role="group" aria-label="Basic example">
                <button type="button" class="btn btn-secondary" data-sort-by='manuf' style="border-radius: 0;" title='sort by manufacturer'>manufacturer</button>
                <button type="button" class="btn btn-secondary" data-sort-by='favourite' title='sort by favorite color'>favorite color</button>
                <!-- <button type="button" class="btn btn-secondary" data-sort-by=''>check box</button> -->
            </div>
        </div>
        <div class="dropdowns-container d-flex gap-2"></div>
    </div>
</div>

<!-- multi-purpose buttons -->
<div id='TMPL_multi_purpose_btns_template' class='multi-purpose-btns d-none'>
    <button title="delete selected rows" class="btn">
        <i class="fas fa-trash"></i>
        <i class="fa-solid fa-trash" data-test-el="1"></i>
    </button>
    <button title="delete selected rows" class="btn">
        Update location
    </button>
</div>


<!-- master-filter-dropdown -->
<div id="TMPL_master_search_w" class="d-none d-flex col-auto px-0">        
      <form class="position-relative">
        <i class="fas fa-search fa-rotate-90 position-absolute text-secondary opacity-50 mt-2 ps-2"></i>
        <input style="width: 250px;" placeholder="Search in table..." type="search" class="form-control tbl_master_search-input ps-4"/>        
      </form>
</div>


<!-- per-table-settings  -->
<div id="TMPL_tbl_Setting_menu" class="dropdown table-settings-dropdown col-auto d-none px-0">
    <button class='btn dropdown-toggle' type='button' data-bs-toggle="dropdown" aria-expanded="false">
        <i class="fal fa-cog"></i>
        <i class="fa fa-cog" data-test-el="1"></i>
    </button>
    <ul class='dropdown-menu p-0'>
        <div style="width:300px;" class="filter_by_settings">
            <div class="d-flex flex-column">
                <button class="btn btn-dark mb-1 clear-settings-btn"> <i class='fa fa-undo pe-none me-2'></i> Clear Settings</button>
            </div>
            <div class="d-flex flex-column fw-normal">
                <span class="mb-1">Filter by</span>
                <div class="d-flex flex-column gap-2 ms-3 filter-by-container">
                    <!-- <div class="d-flex gap-2">
                        <label><input type="radio" data-key="on_enter"><span class='ps-2'>on enter</span></label>
                    </div> -->
                    <div class="d-flex gap-2">
                        <div class="form-check form-switch">
                            <label>On type<input class="form-check-input" type="checkbox" data-key="on_type-switch"></label>
                        </div>
                        <!-- <label><input type="radio" data-key="on_type"><span class='ps-2'>on type</span></label> -->
                        <input data-key="on_type" style="width:100px" type='number' max='1000' min='500' step="25"
                            class='delay-input' data-item-hidden=true />
                    </div>
                </div>
            </div>
            <div class="persist-column-settings-container fw-normal">
                <div class="form-check form-switch ">
                    <label>Persist Column visiblity<input class="form-check-input" type="checkbox"></label>
                </div>
            </div>
        </div>
    </ul>
</div>


<!-- chbox filter select -->
<div id='TMPL_chbox_select_element' class='d-none'>
    <select class="form-select form-select-sm"></select>
</div>

<!-- select dropdown -->
<div id='TMPL_select_element_dropdown' class='d-none'>
    <select class="form-select form-select-sm">
    </select>
</div>

<!-- column show/hide dropdown -->
<div id="TMPL_table_visibility_dropdown" class="d-none dropdown table-columns-visibility-dropdown">
    <button class="btn btn-success dropdown-toggle btn-sm" type="button" data-bs-toggle="dropdown"
        aria-expanded="true" title='Toggle column visiblity in the table'>Columns</button>
    <ul class="dropdown-menu" data-popper-placement="bottom-start">
        <div class='dropdown-item'>
            <input data-action='search-list-item' placeholder='search...' type="search" class='w-100'>
        </div>
        <div class="d-flex gap-2">
            <button class="dropdown-item" data-action="deselect-all">
                Deselect all
            </button>
            <button class="dropdown-item" data-action="clear-all">
                Clear all
            </button>
        </div>
        <!-- <li><a class="dropdown-item" href="#" data-value="restore-cols-visibility">
            <i class="fa fa-undo pe-none"></i> Restore hidden columns
        </a></li> -->
    </ul>
</div>


<!-- download template -->
<div id="TMPL_tbl_ExportTo_menu" class="download-menu col-auto d-none px-0">
    <button class="btn" title='Export'>
        <i class="fal fa-download"></i>
        <i class="fa-solid fa-download pe-1" data-test-el="1"></i>
    </button>
    <div class="download-btns d-none"></div>
</div>

<div id="TMPL_dropdownSelection_withFilterAndApply" class="d-none">           
    <button class="iDDselnWfilter_btn btn dropdown-toggle" title="Toggle columns in the table" type="button" data-bs-toggle="dropdown" _data-bs-auto-close="outside" aria-expanded="false">        
        <i class="btn_icon fal fa-line-columns"></i>
        <i class="btn_icon fa-solid fa-list" data-test-el="1"></i>
        <!--<i class="fal fa-ballot-check"></i>-->
    </button>    
    <ul class="dropdown-menu" data-popper-placement="bottom-start">
        <div class="ddM_title text-center px-2">My title</div>
        <div class="filterByValue _d-flex _flex-column px-2">            
            <input class="form-control w-100" data-action="search-list-item" placeholder="Search..." type="search">
        </div>
        <?php /*
<!--        <div class="selectDeselecTtoggle d-flex gap-2 ps-3">
            <label class="chboxSelect d-flex d-none">
                <input type="checkbox">
                <span class="ms-2">Select all</span>
            </label>
            <label class="triSelect d-none">
                <i class="far fa-square text-primary"></i>
                <i class="fa fa-square text-primary"  data-test-el="1"></i>
                <span class="ms-1">Select all</span>
            </label>
        </div>-->        */ ?>
        
        <div class="select_deselec_all_w form-check mx-2">
            <input class="form-check-input" type="checkbox" value="" id="cb_select_deselec_al">
            <label class="form-check-label" for="cb_select_deselec_al">Deselect all</label>
        </div>
        
        <div class="dds_itemsList_w d-flex flex-column overflow-scroll_y iCustScroll px-2"></div>
        
        <div id="TMPL_checkbox" class="form-check d-none">
            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
            <label class="form-check-label" for="flexCheckDefault"></label>
        </div>
        
        <?php /*
        <!-- <li><a class="dropdown-item" href="#" data-value="restore-cols-visibility">
            <i class="fa fa-undo pe-none"></i> Restore hidden columns
        </a></li> --> */?>
    </ul>
    <?php /*
    <!-- <div class="btn-group dropup">
        <button type="button" class="btn btn-secondary">Split dropup</button>
        <button type="button" class="btn btn-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
            <span class="visually-hidden">Toggle Dropdown</span>
        </button>
        <ul class="dropdown-menu">
        </ul>
    </div>
    <div class="form-check">
        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
        <label class="form-check-label" for="flexCheckDefault">
            Default checkbox
        </label>
    </div>

    <input type="checkbox" class="btn-check" id="btn-check-outlined" autocomplete="off">
    <label class="btn btn-outline-primary" for="btn-check-outlined">Single toggle</label><br>
    <button type="button" class="btn btn-primary">Primary</button>
    <button type="button" class="btn btn-outline-primary">Primary</button> --> */ ?>
</div>

<div id="TMPL_popoverSelection_withFilter" class="d-none">           
    <button class='form-control form-control-sm'>select</button>
    <ul class="dropdown-menu" data-popper-placement="bottom-start">
        <div class="ddM_title text-center px-2">My title</div>
        <div class="filterByValue _d-flex _flex-column px-2">            
            <input class="form-control w-100" data-action="search-list-item" placeholder="Search..." type="search">
        </div>

        
        <div class="select_deselec_all_w form-check mx-2">
            <input class="form-check-input" type="checkbox" value="" id="cb_select_deselec_al">
            <label class="form-check-label" for="cb_select_deselec_al">Deselect all</label>
        </div>
        
        <div class="dds_itemsList_w d-flex flex-column overflow-scroll_y iCustScroll px-2"></div>
        
        <div id="TMPL_checkbox" class="form-check d-none">
            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
            <label class="form-check-label" for="flexCheckDefault"></label>
        </div>

    </ul>
</div>

<div id="TMPL_tbl_toolbars_f01" class="tbl-toolbar_row row mx-0 py-2 d-none">
    <div class="tbl_rowSel_w col-12 col-lg-3 align-content-end px-0">
        <div class="tbl_read_mode_w col-auto px-0"></div>
        <div class="tbl_single_select_w col-auto px-0"></div>
        <div class="tbl_multi_select_w col-auto px-0"></div>
    </div> 
    <div class="tbl_multy_purps_w col-12 col-lg align-content-end my-2 my-lg-0 ms-2 px-0"></div>
    <div class="col-12 col-lg-auto align-content-end px-0">
        <div class="tbl_ctrls_w row justify-lg-content-end mx-0">
        </div>
    </div>
</div>

<!-- ------------------------------   templates end  ---------------------------------------------------  -->