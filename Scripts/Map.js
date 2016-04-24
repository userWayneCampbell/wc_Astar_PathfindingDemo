
  /*				DISPLAY FUNCTIONS
  wc_createGraph(): 				Create Graph from form to the left. Check correct user Data
  wc_markGoalStart(): 		Mark the Goal and Start position
  wc_randomStartGoal():	When user clicks button, this happens

  */
  function wc_createGraph() {
    var html = "<table cellpadding=0 cellspacing=0 style=\"width: " + width * 16 + "px;\">";
    var cl;

    //Format: <td onclick="wc_markGoalStart(y,x);" class="character from imput" id="x(var x)y(var y)">&nbsp;</td>
    for (var y = 0; y < height; y++) {
      html += "<tr>";
      for (var x = 0; x < width; x++) {
        //change imput into readable outputs
        if (Graph[x][y] == "F") cl = "fo";
        else if (Graph[x][y] == "r") cl = "ri";
        //Check for correct imput
        else if (Graph[x][y] != "R" && Graph[x][y] != "f" && Graph[x][y] != "h" && Graph[x][y] != "M" && Graph[x][y] != "W") {
          alert("Invalid terrain feature [" + Graph[x][y] + "] in Graph data at position " + x + "," + y + " (which appears on line " + (y + 4) + ").  Valid Graph features are R, f, F, h, r, M, and W.");
          return;
        } else cl = Graph[x][y];
        if (x == start[0] && y == start[1]) cl = "man" + cl;
        else if (x == goal[0] && y == goal[1]) cl = "goal" + cl;
        else if (GraphSearch && (GraphSearch[x][y].state == REALPATH)) cl = "fade" + cl;
        else if (GraphSearch && (GraphSearch[x][y].state == VISITED || GraphSearch[x][y].state == CLOSED)) cl = "visited" + cl;

        //set html string with new table
        html += "<td onclick=\"wc_markGoalStart(" + x + "," + y + ");\" class=\"" + cl + "\" id = \"x" + x + "y" + y + "\">&nbsp;</td>";
      }
      html += "</tr>";
    }
    html += "</table>"
    var elem = document.getElementById("grid");
    elem.innerHTML = html;

  }

  function wc_markGoalStart(x, y) {
    if (!(x >= 0 && x <= (width - 1) && y >= 0 && y <= (height - 1))) {
      return;
    }
    if (toggleStartGoal) {
      goal[0] = x;
      goal[1] = y;
    } else {
      start[0] = x;
      start[1] = y;
    }
  }

  //This is a button click :^)
  function wc_randomStartGoal() {
    startX = Math.floor(Math.random() * width);
    startY = Math.floor(Math.random() * height);
    goalX = Math.floor(Math.random() * width);
    goalY = Math.floor(Math.random() * height);
    start[0] = startX;
    start[1] = startY;
    goal[0] = goalX;
    goal[1] = goalY;
    wc_resetMarkings();
    wc_createGraph()
  }

  //Display Faded Version of image
  function wc_setFade(idFaded) {
    var elem = document.getElementById(idFaded);
    if (!elem) return;
    if (elem.className.substring(0, 4) == "fade") elem.className = elem.className.substring(4);
    else elem.className = "fade" + elem.className;
  }

  //If visited, display visited image
  function wc_setVisit(idVisited) {
    var elem = document.getElementById(idVisited);
    if (!elem) return;
    if (elem.className.substring(0, 7) == "visited") elem.className = elem.className.substring(7);
    else elem.className = "visited" + elem.className;

  }

  //Reset all markings
  function wc_resetMarkings() {
    GraphSearch = null;
  }

  //Stupid Humans
  function wc_loadGraph() {
    wc_resetMarkings();
    var input = document.forms[0].elements["Graph"].value.split("\n");

    width = input[0].split(" ")[0];
    height = input[0].split(" ")[1];

    start = new Array(2);
    start[0] = input[1].split(" ")[0];
    start[1] = input[1].split(" ")[1];

    goal = new Array(2);
    goal[0] = input[2].split(" ")[0];
    goal[1] = input[2].split(" ")[1];

    Graph = new Array();
    for (var x = 0; x < width; x++) {
      Graph[x] = new Array(height);
      for (var y = 0; y < height; y++) {
        Graph[x][y] = input[3 + y].substring(x, Number(x) + 1);
      }
    }

    wc_createGraph();
  }

  //Array of first Graph to show up
  var Graphs = new Array();
  Graphs[0] =
    "15 20\n" +
    "4 0\n" +
    "7 18\n" +
    "ffffffffffhhMMM\n" +
    "ffffffffhhMMMMM\n" +
    "fffFFFffhhhMMMh\n" +
    "ffFFFFFFFffhMhf\n" +
    "FFFFFFFFFffhhhf\n" +
    "ffffFFFFFFFFfff\n" +
    "fffFFFFFFFFffff\n" +
    "fffffFFFffrrfff\n" +
    "fffFFFFfrrrffRf\n" +
    "ffFFFFFFrffffRf\n" +
    "FFFFFWWWWWfffRf\n" +
    "FFFWWWWWWWWffRf\n" +
    "fRRfffWWWWWWWrr\n" +
    "rrWWWWWWWfffRRf\n" +
    "fffffRRRfffffff\n" +
    "fffffffRRRfffff\n" +
    "RRRRRRRRffffffh\n" +
    "ffffffffffffhhM\n" +
    "ffffffffffffhhM\n" +
    "ffffffffffhhhMM\n";

	Graphs[1]	= "30 20\n" +
	"15 5\n" +
	"15 15\n" +
	"MMMMMMMMMhhfffffffffffFFFMMMMM\n" +
	"MMMMMMMMhhffffffffffffffFFFMMM\n" +
	"hMMMMhhffFFFfffffffffffffFFFFF\n" +
	"fhMhffFFFFFFFfffffffffffffFFFF\n" +
	"fhhhffFFFFFFFFfffffffWWWWWFFFF\n" +
	"ffffFFFFFFFFffffffffWWWWffffff\n" +
	"rrrrrFFFFFFffffffffWWWWfffffff\n" +
	"hhffrffFFFfffWWWWWWWWWWWffffff\n" +
	"RRRRrrWWWWWWWWWWWWWWWWffffffff\n" +
	"hhhRfWWWWWWWWWWWWWWWrrrrrfffff\n" +
	"MMMRhWWWWWWWWWWfffffffffrrrfff\n" +
	"RRRRWWWWWWWWFFFfffffffffffrrrr\n" +
	"hhffffWWWWWWWFFfffffffffffffFF\n" +
	"ffffffffffWWfffffffffffffffFFF\n" +
	"fffffffffffffffffffffffFFFFFFF\n" +
	"fffffffffffffffffffFFFFFFFFFFF\n" +
	"hffffffffffffffffffFFFFFFFFFFF\n" +
	"MhhfffffffffffffFFFFFFFFFFFfff\n" +
	"MhhffffffffffffffFFFFFFFFFFFff\n" +
	"MMhhhfffffffffffffFFFFFFFFFFFf\n";

	Graphs[2]	= "30 20\n" +
	"15 5\n" +
	"15 15\n" +
	"MMMMMMMMMhhfffffffffffFFFMMMMM\n" +
	"MMMMMMMMhhffffffffffffffFFFMMM\n" +
	"hMMMMhhffFFFfffffffffffffFFFFF\n" +
	"fhMhffFFFFFFFfffffffffffffFFFF\n" +
	"fhhhffFFFFFFFFfffffffWWWWWFFFF\n" +
	"ffffFFFFFFFFffffffffWWWWffffff\n" +
	"rrrrrFFFFFFffffffffWWWWfffffff\n" +
	"hhffrffFFFfffWWWWWWWWWWWffffff\n" +
	"RRRRrrWWWWWWWWWWWWWWWWffffffff\n" +
	"WWWWWWWWWWWWWWWWWWWWrrrrrfffff\n" +
	"WWWWWWWWWWWWWWWfffffffffrrrfff\n" +
	"RRRRWWWWWWWWFFFfffffffffffrrrr\n" +
	"hhffffWWWWWWWFFfffffffffffffFF\n" +
	"ffffffffffWWfffffffffffffffFFF\n" +
	"fffffffffffffffffffffffFFFFFFF\n" +
	"fffffffffffffffffffFFFFFFFFFFF\n" +
	"hffffffffffffffffffFFFFFFFFFFF\n" +
	"MhhfffffffffffffFFFFFFFFFFFfff\n" +
	"MhhffffffffffffffFFFFFFFFFFFff\n" +
	"MMhhhfffffffffffffFFFFFFFFFFFf\n";


  /* load and render the preset Graph indicated by num */
  function wc_loadArrayGraph(num) {
    clearAllOldResults();
    document.forms[0].elements["Graph"].value = Graphs[num];
    wc_loadGraph(1);
  }
