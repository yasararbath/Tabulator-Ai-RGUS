<?php  // <editor-fold defaultstate="collapsed" desc=" PHP ">
$qq= 1;
// </editor-fold>?>
<!doctype html>
<html lang="en">
<?php // <editor-fold defaultstate="collapsed" desc=" Head "> ?>    
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ai-RGUS</title>
<link href="sources-import/css/bootstrap-5.2.3.min.css" rel="stylesheet"/>
<!-- font awesome cdn link -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
    integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
    crossorigin="anonymous" referrerpolicy="no-referrer" />
<link href="sources-import/css/tabulator-6.2.1.min.css" rel="stylesheet"/>


<link href="./style.css" rel="stylesheet"/>

<?php // <editor-fold defaultstate="collapsed" desc=" CSS "> ?>
<style type="text/css">

html, body {
    height: 100vh;
    margin: 0;
    padding: 0;
}

.top-nav {
    height: 70px;
    background-color: #002454;
}

.top-row {        
    display: flex;
    align-items: center;
}
.bottom-info {
    height: 45px;
    background-color: #002454;
}
.container-fluid {
    --left_nav_current-width: var(--left_nav-width);
    min-height: calc(100vh - 115px);
    display: flex;
    flex-direction: column;
}

.main_content {
    flex-grow: 1;
    display: flex;
}

.left-nav {    
    min-width: var(--left_nav_current-width);
    max-width: var(--left_nav_current-width);
    background-color: #343a40;
    display: flex;
    flex-direction: column;
    /*transition: max-width 1s ease-in-out;*/
    transition: all 1s ease-in-out;
}

.left-nav.expanded {    
    max-width: var(--left_navExp-width);
}


.nav {
    flex-grow: 1;
}

.dropdown-buttons {
    display: flex;
    flex-direction: column;
    align-items: flex-start;    
}

.main-content {
    padding: 50px;
    /*width: calc(100% - 170px);*/
    width: calc(100% - var(--left_nav_current-width));
}

.nav-link {
    height: 50px;
    text-align: center;
    line-height: 50px;
}

.dropdown-buttons .btn {
    height: 50px;
}


.main-content {        
    display: flex;
    flex-direction: column;
}

.tab-content {
    flex-grow: 1; /* Ensure tab content fills available space */
}
.tab-pane {
    /* width: 100%; */
    width: auto;
    height: 100%;
    background-color: #fbfbfb;
    
}


.tabulator{
    width: calc(100% - 0px);
}

<?php 
//.tabulator-row {
//    border-bottom: solid 0.01px #dfdddd;
//}
//
//.tabulator-row-even, .tabulator-row-odd {
//    background-color: white !important;
//}
//
//.tabulator-row-even.china, .tabulator-row-odd.china{
//    background-color: gray !important;
//}
//
//.tabulator-cell{
//    border-right: none !important;
//}
//
//
//.tabulator-footer{
//    border: none !important;
//    padding-top: 4px;
//    padding-bottom: 4px;
//}
//
//.tabulator .tabulator-header .tabulator-frozen.tabulator-frozen-right,
//.tabulator-row .tabulator-cell.tabulator-frozen.tabulator-frozen-right {
//    border-left: none;
//}
//
//.tabulator-cell select, .tabulator-header-filter select{
//    /* background: white !important; */
//    /* border: none !important; */
//    border-radius: 4px !important;
//}
///* .tabulator-cell[tabulator-field=chbox] select{
//    pointer-events:none;
//} */
//.tabulator-cell.tabulator-editing[tabulator-field=chbox] select{
//    pointer-events:all;
//}
//
//.tabulator-cell{
//    border: none !important;
//    align-content: center;
//}
?>

/* add dropdown height */
.dropdown-menu.show{
    /* max-height: 400px; */
    /* overflow-y:auto; */
}





/* not doing what I want ...
.tabulator-frozen-rows-holder *,
.tabulator-selected edit *,
.tabulator-cell *{
    background-color: red;
}*/
.expand-container .left-nav{
    width: 270px !important;
}
.expand-container .main-content{
    width: calc(100% - 270px) !important;
}

</style>
<?php // </editor-fold> ?>
</head>
<?php // </editor-fold> ?>
<body>

 <!-- ____ top-nav ____ -->
<!--<div class="top-nav text-white h1 mb-0 p-2">Ai-RGUS</div>-->
<div class="top-nav text-white _h1 _mb-0 p-2">
  <div class="row top-row d-flex _flex-shrink-0 m-0">    
    <div class="col-auto logo h2" style="width: 160px;">
        Ai-RGUS
    </div>
    <div class="col-auto text-container h5" style="width: 500px;">
        Tabulator tables
    </div>
    <div class="col d-flex justify-content-end align-items-center">
      <div class="dropdown me-2">
        <button class="btn dropdown-toggle text-white border-0" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">Dropdown 1</button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
          </ul>
      </div>
      <div class="dropdown me-2">
        <button class="btn dropdown-toggle text-white border-0" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">Dropdown 2</button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton2">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
          </ul>
      </div>
      <div class="dropdown">
        <button class="btn dropdown-toggle text-white border-0" type="button" id="dropdownMenuButton3" data-bs-toggle="dropdown" aria-expanded="false">Dropdown 3</button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton3">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </div>
    </div>
  </div>
</div>

<!-- ____ page data ____ -->
<div class="container-fluid" style="--left_nav-width: 170px; --left_navExp-width: 250px;">
    <div class="main_content row">
        <!-- ____ left-nav ____ -->
        <div class="col left-nav p-0 d-nones">
            <ul class="nav flex-column nav-pills">
                <li class="nav_expanded">
                <a class="nav-link border-bottom border-secondary text-white p-0" href="#"><i class="fas fa-bars"></i></a>           
                </li>
                <li class="nav-item border-bottom border-secondary ps-2">
                <a class="nav-link rounded-0 text-white text-start p-0 ps-1" data-bs-toggle="tab" href="#tab1">Infinite remote</a>
                </li>
                <li class="nav-item border-bottom border-secondary _rounded-0 ps-2">
                <a class="nav-link rounded-0 text-white text-start p-0 ps-1" data-bs-toggle="tab" href="#tab2">Paginated remote</a>
                </li>
                <li class="nav-item border-bottom border-secondary _rounded-0 ps-2">
                <a class="nav-link rounded-0 text-white text-start p-0 ps-1" data-bs-toggle="tab" href="#tab3">Paginated local</a>
                </li>
                <li class="nav-item border-bottom border-secondary _rounded-0 ps-2">
                    <a class="nav-link rounded-0 text-white text-start p-0 ps-1" data-bs-toggle="tab" href="#itsik-local">IR Local</a>
                </li>
                <li class="nav-item border-bottom border-secondary _rounded-0 ps-2">
                    <a class="nav-link rounded-0 text-white text-start p-0 ps-1" data-bs-toggle="tab" href="#multi-tbls">Multi tbls</a>
                </li>
            </ul>

            <div class="dropdown-buttons">
                <div class="dropdown w-100">
                <button class="btn dropdown-toggle text-white w-100" type="button" data-bs-toggle="dropdown" aria-expanded="false">Dropdown 1</button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">Action 1</a></li>
                    <li><a class="dropdown-item" href="#">Action 2</a></li>
                    <li><a class="dropdown-item" href="#">Action 3</a></li>   
                </ul>
                </div>
                <div class="dropdown w-100">
                <button class="btn dropdown-toggle text-white w-100" type="button" data-bs-toggle="dropdown" aria-expanded="false">Dropdown 2</button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">Action 1</a></li>
                    <li><a class="dropdown-item" href="#">Action 2</a></li>
                    <li><a class="dropdown-item" href="#">Action 3</a></li>
                </ul>
                </div>
            </div>
        </div>
        
        <!-- ____ main-content ____ -->          
        <div class="col main-content p-2">

        <div class="tab-content">

            <div id="tab1" class="table_w tab-pane">                                
                <div class="infinite-loading-table-container">                
                    <div class="table-header-toolbar_w px-2"></div>
                    <div id="infinite-loading-table" ></div>
                </div>
            </div>

            <div class="tab-pane" id="tab2">
                <div class="paginated-remote-table-container">                
                    <div class="table-header-toolbar_w px-2"></div>                    
                    <div id="paginated-remote-table"></div>
                </div>
            </div>

            <div class="tab-pane" id="tab3">
                <div class="paginated-local-table-container">                
                    <div class="table-header-toolbar_w px-2"></div>
                    <div id="paginated-local-table"></div>                    
                </div>
            </div>

            <div class="tab-pane" id="itsik-local" >
                <div class="itsik-table-container iTr_F_01">                
                    <div class="table-header-toolbar_w px-2"></div>    
                    <div id="itsik-table"></div>
                    
                    <div class="d-none" tt_for-field="location">
                        <div>Active<br>Changing be 0?<br>Change also Emails to 0.</div>
                    </div>                    
                </div>
                
            </div>

            <div class="tab-pane d-flex gap-4" id="multi-tbls" >
                <div class="multi-table-1-container iTr_F_01" style="max-width: 1100px;">                
                    <div class="table-header-toolbar_w px-2"></div>    
                    <div id="multi-table-1"></div>
                    
                    <div class="d-none" tt_for-field="location">
                        <div>Active<br>Changing be 0?<br>Change also Emails to 0.</div>
                    </div>                    
                </div>
                <div class="multi-table-2-container iTr_F_01" style="max-width: 1100px;">                
                    <div class="table-header-toolbar_w px-2"></div>    
                    <div id="multi-table-2"></div>
                    
                    <div class="d-none" tt_for-field="location">
                        <div>Active<br>Changing be 0?<br>Change also Emails to 0.</div>
                    </div>                    
                </div>
                
            </div>

        </div>

    </div>
</div>
</div>

<div class="bottom-info text-white h5 mb-0 p-2">Ai-RGUS</div>
<?php require_once 'iTrTMPL.php'; ?>


<script src="sources-import/js/jquery-3.5.1.min.js" type="text/javascript" crossorigin="anonymous"></script>   
<script src="sources-import/js/popper-2.11.6.min.js" type="text/javascript" crossorigin="anonymous"></script>  
<script src="sources-import/js/bootstrap-5.2.3.min.js" type="text/javascript" crossorigin="anonymous"></script>
<script src="sources-import/js/tabulator-6.2.1.min.js" type="text/javascript" crossorigin="anonymous"></script>
<script src="sources-import/js/tabulator_luxon-3.4.4.min.js" type="text/javascript" crossorigin="anonymous"></script>
<script src="sources-import/js/tabulator_jspdf.umd-2.4.0.min.js" type="text/javascript" crossorigin="anonymous"></script>
<script src="sources-import/js/tabulator_jspdf-autotable-3.5.20.min.js" type="text/javascript" crossorigin="anonymous"></script>
<script src="sources-import/js/tabulator_xlsx.full-1.15.0.min.js" type="text/javascript" crossorigin="anonymous"></script>
<script src="sources-import/js/lodash-4.17.21.min.js" type="text/javascript" crossorigin="anonymous"></script>

<script src="./js/iTrTools.js" type="text/javascript"></script>    
<script src="./index.js" type="text/javascript"></script>    
<!-- <script src="./iIndex.js" type="module"></script>     -->
   
</body>
</html>    
