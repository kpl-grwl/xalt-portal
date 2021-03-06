/*!ZZ
 * Column chart for Most Used Compiler.
 * History
 * 2015-Aug-10
 * List of Parameters passed to generateTable function
 */

google.load('visualization', '1', {packages: ['corechart','table']});

function compilerMostUsed(sysHost, startDate, endDate, numRec) {

    var jsonChartData = $.ajax
        ({url: "include/compilerMostUsed.php",
         data: "sysHost=" + sysHost + "&startDate=" + startDate + "&endDate=" + endDate 
         + "&numRec=" + numRec, 
         dataType:"json", async: false
         }).responseText;

    // List ids to hide
    var idsToHide = ['comp1_div','comp2_div','lblCompUser0', 'comp3_div', 'lblCompUser1', 
        'lblCompExec0', 'lblCompExec1', 'comp4_div', 'lblCompExecRow', 'lblCompExecDetail0',
        'comp5_div','lblCompRun0','comp6_div','lblCompRunDetail1', 'lblObj1', 'obj_div1', 
        'lblRunObj1', 'runObj_div1','lblRunEnv1', 'run_env_div1','lblFunc1', 'func_div1']; 
    hideAllDivs(idsToHide);

    var count = checkJsonData(jsonChartData);             /* if no data is returned do Nothing!! */
    if (count != 0) {

        // Create our data table out of JSON data loaded from server.
        var ChartData = new google.visualization.DataTable(jsonChartData);

        // Define Chart Options .
        var options = {title: 'Most Used Compiler',
            chartArea: {width: '80%'},
            legend: 'none',
            hAxis:{title: 'Compilers'},
            vAxis: {title: 'Count', format: 'short', minValue: 0}
        };

        // Instantiate and draw chart.
        var chart = new google.visualization.ColumnChart(document.getElementById('comp1_div'));

        chart.draw(ChartData, options);

        // Create our datatable out of Json Data loaded from php call.
        var div_id = 'comp2_div';
        var table = makeTable(ChartData, div_id, count);
        document.getElementById("lblComp").style.visibility = 'visible'; 

        function selectHandler() {
            // grab a few details before redirecting
            var selection = chart.getSelection();
            var row = selection[0].row;
            var col = selection[0].column;
            var linkProgram = [ChartData.getValue(row,0)];

            gTc1(sysHost, startDate, endDate, linkProgram); 
        }

        function selectTable() {
            // grab a few details before redirecting
            var selection = table.getSelection();
            var row = selection[0].row;
            var col = selection[0].column;
            var linkProgram = [ChartData.getValue(row,0)];

            gTc1(sysHost, startDate, endDate, linkProgram);       /* Get user list  */ 
        }

        // Add our selection handler.
        google.visualization.events.addListener(chart, 'select', selectHandler);
        google.visualization.events.addListener(table, 'select', selectTable);
    }
}

function gTc1(sysHost, startDate, endDate, linkProgram) {         /* Get user list  */

    console.log("linkProgram= " + linkProgram);

    if (linkProgram == 'g++'){                                    /* special case for g++ as ajax call consider + as special character */
        linkProgram = 'gpp';
    }
    var jsonTableData = $.ajax
        ({url:"include/compUserList.php",
         data: "sysHost=" + sysHost + "&startDate=" + startDate + "&endDate=" + endDate + 
         "&linkProgram=" + linkProgram,
         datatype: "json", async: false
         }).responseText;

    var div_id = 'comp3_div';

    // List ids to hide
    var idsToHide = ['lblCompUser0', 'comp3_div', 'lblCompUser1',
        'lblCompExec0', 'comp4_div', 'lblCompExec1', 'lblCompExecRow', 'lblCompExecDetail0',
        'comp5_div','lblCompRun0','comp6_div', 'lblCompRunDetail1', 'lblObj1', 'obj_div1', 
        'lblRunObj1', 'runObj_div1', 'lblRunEnv1', 'run_env_div1', 'lblFunc1', 'func_div1']; 
    hideAllDivs(idsToHide);

    var count = checkJsonData(jsonTableData);             /* if no data is returned do Nothing!! */
    if (count != 0) {

        document.getElementById("lblCompUser0").style.visibility = 'visible';
        document.getElementById("comp3_div").style.visibility = 'visible';
        document.getElementById("lblCompUser1").style.visibility = 'visible';

        // Create our datatable out of Json Data loaded from php call.
        var TableData = new google.visualization.DataTable(jsonTableData);
        var table = makeTable(TableData, div_id, count);

        function selectHandler() {

            // grab a few details before redirecting
            var selection = table.getSelection();
            var row = selection[0].row;
            var col = selection[0].column;
            var user = TableData.getValue(row,0);

            gTc2(sysHost, startDate, endDate, linkProgram, user);  /* get exec list  */    
        }

        // Add our Actions handler.
        google.visualization.events.addListener(table, 'select', selectHandler);
    }
}   

function gTc2(sysHost, startDate, endDate, linkProgram,user) {     /* get exec list */

    console.log("User= " + user);

    var jsonTableData = $.ajax
        ({url:"include/compExecList.php", 
         data:  "sysHost=" + sysHost + "&startDate=" + startDate + "&endDate=" + endDate + 
         "&user=" +user + "&linkProgram=" + linkProgram,
         datatype: "json", async: false
         }).responseText;

    var div_id = 'comp4_div';

    // List ids to hide
    var idsToHide = ['lblCompExec0', 'lblCompExec1', 'comp4_div',
        'lblCompExecRow', 'lblCompExecDetail0','comp5_div','lblCompRun0','comp6_div','lblCompRunDetail1',
        'lblObj1', 'obj_div1', 'lblRunObj1', 'runObj_div1', 'lblRunEnv1', 'run_env_div1',
        'lblFunc1', 'func_div1']; 
    hideAllDivs(idsToHide);

    var count = checkJsonData(jsonTableData);             /* if no data is returned do Nothing!! */
    if (count != 0) {

        document.getElementById("lblCompExec0").style.visibility = 'visible';
        document.getElementById("comp4_div").style.visibility = 'visible';
        document.getElementById("lblCompExec1").style.visibility = 'visible';

        // Create our datatable out of Json Data loaded from php call.
        var TableData = new google.visualization.DataTable(jsonTableData);
        var table = makeTable(TableData, div_id, count);

        function selectHandler() {

            // grab a few details before redirecting
            var selection = table.getSelection();
            var row = selection[0].row;
            var col = selection[0].column;
            var exec = TableData.getValue(row,0);
            var page = 0;                         /* pagination changes */
            var totalNumRec = TableData.getValue(row,3);

            gTc3(sysHost ,startDate , endDate, linkProgram, user, exec, page, totalNumRec); /* get exec detail  */
        }
        // Add our Actions handler.
        google.visualization.events.addListener(table, 'select', selectHandler);
    }
}

function gTc3(sysHost, startDate, endDate, linkProgram, user, exec, page, totalNumRec) {      /* get exec detail */

    console.log("Exec= " + exec + "totalNumRec=" + totalNumRec);
    var start = new Date().getTime();

    var jsonTableData = $.ajax
        ({url:"include/compExecDetailList.php", 
         data:  "sysHost=" + sysHost + "&startDate=" + startDate + "&endDate=" + endDate + 
         "&linkProgram=" + linkProgram + "&user=" +user + "&exec=" + exec + "&page=" + page +
         "&totalNumRec=" + totalNumRec,
         success: function(){
         var end = new Date().getTime();
         console.log("seconds TAKEN: ", (end - start)/1000);},
         datatype: "json", async: false
         }).responseText;

    var div_id = 'comp5_div';

    // List ids to hide
    var idsToHide = ['lblCompExecRow', 'lblCompExecDetail0','comp5_div', 'lblCompRun0',
        'comp6_div', 'lblCompRunDetail1', 'lblObj1', 'obj_div1', 'lblRunObj1', 
        'runObj_div1', 'lblRunEnv1', 'run_env_div1', 'lblFunc1', 'func_div1']; 
    hideAllDivs(idsToHide);

    var count = checkJsonData(jsonTableData);             /* if no data is returned do Nothing!! */
    if (count != 0) {

        document.getElementById("lblCompExecRow").style.visibility = 'visible';
        document.getElementById("lblCompExecDetail0").style.visibility = 'visible';
        document.getElementById("comp5_div").style.visibility = 'visible';

        // Create our datatable out of Json Data loaded from php call.
        var TableData = new google.visualization.DataTable(jsonTableData);
        var table = makeExecDetail(TableData, div_id, page);

        function selectHandler() {
            // grab a few details before redirecting
            var selection = table.getSelection();
            var row = selection[0].row;
            var col = selection[0].column;
            var uuid = TableData.getValue(row,6);

            // get run details irrespective of who built the code 
            gTc4(uuid);       /* get run details */
            gTc5(uuid);       /* get object information */
            gTc8(uuid);       /* get function information */
        }

        function myPageEventHandler(e) {
            page = e['page'];
            /* get executable details */
            gTc3(sysHost ,startDate , endDate, linkProgram, user, exec, page, totalNumRec); /* get exec detail  */
        }

        // Add our Actions handler.
        google.visualization.events.addListener(table, 'select', selectHandler);
        // google.visualization.table exposes a 'page' event.
        google.visualization.events.addListener(table, 'page', myPageEventHandler);
    }
}

function gTc4(uuid) {         /* get run details */

    console.log("UUId= " + uuid);

    var jsonTableData = $.ajax
        ({url:"include/runDetail.php", 
         data:  "uuid=" + uuid,
         datatype: "json", async: false
         }).responseText;

    var div_id = 'comp6_div';

    // List ids to hide
    var idsToHide = ['lblCompRun0','comp6_div','lblCompRunDetail1',
       'lblRunObj1', 'runObj_div1', 'lblRunEnv1', 'run_env_div1']; 
    hideAllDivs(idsToHide);

    var count = checkJsonData(jsonTableData);             /* if no data is returned do Nothing!! */
    if (count != 0) {

        document.getElementById("lblCompRun0").style.visibility = 'visible';
        document.getElementById("comp6_div").style.visibility = 'visible';
        document.getElementById("lblCompRunDetail1").style.visibility = 'visible';

        // Create our datatable out of Json Data loaded from php call.
        var TableData = new google.visualization.DataTable(jsonTableData);
        var table = makeTable(TableData, div_id, count);

        function selectHandler() {

            // grab a few details before redirecting
            var selection = table.getSelection();
            var row = selection[0].row;
            var col = selection[0].column;
            var runid = TableData.getValue(row,0);
            gTc6(runid);          /* get runtime env information */
            gTc7(runid);          /* get objects at runtime */
        }

        // Add our Actions handler.    *** REMOVE this event handler might not be required ***
        google.visualization.events.addListener(table, 'select', selectHandler);

    }
}

function gTc5(uuid) {               /* get object information */

    console.log("&uuid=" + uuid);

    var jsonTableData = $.ajax
        ({url:"include/getExecObj.php",
         data: "uuid=" + uuid,
         datatype: "json", async: false
         }).responseText;

    var div_id = 'obj_div1';

    // List ids to hide
    var idsToHide = ['lblObj1', 'obj_div1'];
    hideAllDivs(idsToHide);

    var count = checkJsonData(jsonTableData);         /* if no data is returned do Nothing!! */
    if (count != 0) {
        document.getElementById("lblObj1").style.visibility = 'visible';
        document.getElementById("obj_div1").style.visibility = 'visible';

        // Create our datatable out of Json Data loaded from php call.
        var TableData = new google.visualization.DataTable(jsonTableData);
        var table = makeTable(TableData, div_id, count);
    }
}

function gTc6(runId) {               /* get runtime env information */

    console.log("&runId=" + runId);

    var jsonTableData = $.ajax
        ({url:"include/getRunEnv.php",
         data: "runId=" + runId,
         datatype: "json", async: false
         }).responseText;

    var div_id = 'run_env_div1';

    // List ids to hide
    var idsToHide = ['lblRunEnv1', 'run_env_div1'];
    hideAllDivs(idsToHide);

    var count = checkJsonData(jsonTableData);         /* if no data is returned do Nothing!! */
    if (count != 0) {
        document.getElementById("lblRunEnv1").style.visibility = 'visible';
        document.getElementById("run_env_div1").style.visibility = 'visible';

        // Create our datatable out of Json Data loaded from php call.
        var TableData = new google.visualization.DataTable(jsonTableData);
        var table = makeTable(TableData, div_id, count);
    }
}

function gTc7(runId) {               /* get objects at runtime */

    console.log("&runId=" + runId);

    var jsonTableData = $.ajax
        ({url:"include/getRunObj.php",
         data: "runId=" + runId,
         datatype: "json", async: false
         }).responseText;

    var div_id = 'runObj_div1';

    // List ids to hide
    var idsToHide = ['lblRunObj1', 'runObj_div1'];
    hideAllDivs(idsToHide);

    var count = checkJsonData(jsonTableData);         /* if no data is returned do Nothing!! */
    if (count != 0) {
        document.getElementById("lblRunObj1").style.visibility = 'visible';
        document.getElementById("runObj_div1").style.visibility = 'visible';

        // Create our datatable out of Json Data loaded from php call.
        var TableData = new google.visualization.DataTable(jsonTableData);
        var table = makeTable(TableData, div_id, count);
    }
}

function gTc8(uuid) {               /* get function called */

    console.log("&uuid=" + uuid);

    var jsonTableData = $.ajax
        ({url:"include/getExecFunc.php",
         data: "uuid=" + uuid,
         datatype: "json", async: false
         }).responseText;

    var div_id = 'func_div1';

    // List ids to hide
    var idsToHide = ['lblFunc1', 'func_div1'];
    hideAllDivs(idsToHide);

    var count = checkJsonData(jsonTableData);         /* if no data is returned do Nothing!! */
    if (count != 0) {
        document.getElementById("lblFunc1").style.visibility = 'visible';
        document.getElementById("func_div1").style.visibility = 'visible';

        // Create our datatable out of Json Data loaded from php call.
        var TableData = new google.visualization.DataTable(jsonTableData);
        var table = makeTable(TableData, div_id, count);
    }
}

function makeExecDetail(TableData, div_id, page) {

    var tab_options = {title: 'Table View',showRowNumber: true,
        height: '100%', width: '100%',
        page: 'enable', pageSize: '10', startPage: parseInt(page),
        pagingSymbols: {prev: ['< prev'], next: ['next >']},
        allowHtml: true, alternatingRowStyle: true
    }

    // Instantiate and Draw our Table
    var table = new google.visualization.Table(document.getElementById(div_id));
    table.clearChart();
    table.draw(TableData, tab_options);
    return (table);
}

function makeTable(TableData, div_id, count) {

    var tab_options;
    if (count > 10){                          // More records enable scroll
        tab_options = {title: 'Table View',
            showRowNumber: true,
            height: 260,
            width: '100%',
            allowHtml: true,
            alternatingRowStyle: true
        }
    } else {                                // < 10 records disable scroll
        tab_options = {title: 'Table View',
            showRowNumber: true,
            height: '100%',
            width: '100%',
            allowHtml: true,
            alternatingRowStyle: true,
            page: 'enable', pageSize: '10'
        }
    }

    // Instantiate and Draw our Table
    var table = new google.visualization.Table(document.getElementById(div_id));
    table.draw(TableData, tab_options);
    return (table);
}

function checkJsonData (jsonTableData) {
    var o = JSON.parse(jsonTableData);
    return (o.rows.length);
}

function hideAllDivs (idsToHide) {

    var attrToHide = document.querySelectorAll("*[style]");
    for(var i=0; i< attrToHide.length; i++) {
        if ($.inArray(attrToHide[i].id, idsToHide) != -1){     // if ID is present in the list Hide it
            attrToHide[i].style.visibility = "hidden";
        }
    }
}

