  var INIT = 0;
  var OPENED = 1;
  var CLOSED = 2;
  var VISITED = 3;
  var REALPATH = 4;

  var SEARCH_TYPE_ASTAR = 3;

  var heuristicType;
	var classTypeObject;
  var Graph;
  var GraphSearch;
  var binaryHeap;
  var heapPointer = 0;
  var start;
  var goal;
  var width;
  var height;

  var keepNodes;
  var keepTime;

  var toggleStartGoal = false;

  var startTime;
  var endTime;

  /* begin timing */
  function wc_startTiming() {
    startTime = new Date();
  }

  /* stop timing */
  function wc_endTiming() {
    endTime = new Date();
  }

  /*
	Does the A* algorthm
   */
  function wc_AStarSearch() {
    wc_startTiming();
    wc_resetMarkings();

    //2D Array to store: (expanded/visited/closed)
    //This array will also store all values of found items [x,y]
    GraphSearch = new Array();
    for (var x = 0; x < width; x++) GraphSearch[x] = new Array();

		//Fill graph
    for (var x = 0; x < width; x++)
      for (var y = 0; y < height; y++) {
        GraphSearch[x][y] = {
          "x": x,
          "y": y,
          "feature": Graph[x][y],
          "state": INIT,
          "path": new Array(),
          "cost": 0,
          "mapCost": 0,
          "parent": null,
          "depth": 0,
          "bestCost": null
        }
      }

    var queue = new Array();
    heapClear();

    var pX = Number(start[0]);
    var pY = Number(start[1]);

    var bestCost = 99999999999;

    var deepest = 0;

		//Options using checkboxs
		classTypeObject = document.forms[0].elements["classTypes"][document.forms[0].elements["classTypes"].selectedIndex].value;
    heuristicType = document.forms[0].elements["heur"][document.forms[0].elements["heur"].selectedIndex].value;

    GraphSearch[pX][pY].visited = new Array();
    v = "" + pX + "," + pY;
    GraphSearch[pX][pY].visited[v] = true;

    heapAdd(GraphSearch[pX][pY])

    var node;
    var steps = 0;
    var found = false;
    var skipped = 0;

    while ((heapPointer > 0) || (queue.length > 0)) {
      node = heapDelete();

			//Replece with real cost
      if (node.parent) {
				//condition ? value of true : value of false) + (cost of position with heauristic)
        node.cost = Number(node.parent ? node.parent.cost : 0) + wc_findCost(node.x, node.y, false);
      }

      // if bestCost = null, set as current. If bestcost = > current node cost, set as bestCost;
      if (GraphSearch[node.x][node.y].bestCost == null) GraphSearch[node.x][node.y].bestCost = node.cost;
      else if (node.cost < GraphSearch[node.x][node.y].bestCost) {
        GraphSearch[node.x][node.y].bestCost = node.cost;
      } //else skip it
      else {
        skipped++;
        continue;
      } // otherwise, ignore this node, since we already saw a node of better cost
      steps++; //step into next step
      if (node.depth > deepest) {
        deepest = node.depth;
      }

      //Found Goal
      if (node.x == goal[0] && node.y == goal[1]) {
        if (node.cost < bestCost) {
          bestNode = node;
          bestCost = node.cost;
        }
        found = true;
        break;
      }

      //Didn't find goal
      /* try to expand all the possible child nodes from here. */
      wc_tryPushNodeParent(queue, GraphSearch, node, node.x - 1, node.y); // left
      wc_tryPushNodeParent(queue, GraphSearch, node, node.x + 1, node.y); // right
      wc_tryPushNodeParent(queue, GraphSearch, node, node.x, node.y - 1); // up
      wc_tryPushNodeParent(queue, GraphSearch, node, node.x, node.y + 1); // down

      //Search Diagonals if selected
      if (document.forms[0].elements["allowDiagonal"].checked) {
        wc_tryPushNodeParent(queue, GraphSearch, node, node.x - 1, node.y - 1);
        wc_tryPushNodeParent(queue, GraphSearch, node, node.x + 1, node.y - 1);
        wc_tryPushNodeParent(queue, GraphSearch, node, node.x - 1, node.y + 1);
        wc_tryPushNodeParent(queue, GraphSearch, node, node.x + 1, node.y + 1);
      }
			//Mark visited
			if (document.forms[0].elements["trackVisited"].checked) {
      	GraphSearch[node.x][node.y].state = CLOSED;
		  }

      node.path = null;

    }
    wc_endTiming();
    if (!found) {
      alert("Sorry, goal cannot be reached.");
      return;
    }
    wc_displayAllNodeResults(steps, skipped, node, GraphSearch, deepest);

  }

	//If the node is valid, then push into the heap queue
  function wc_tryPushNodeParent(queue, GraphSearch, parent, x, y) {
    //Don't push array out of bounds
    if (x >= 0 && x < width && y >= 0 && y < height) {
      //Already visited, then set the cost as the parent cost + the A* Cost
      if (!isVisited(parent, x, y)) {
        var item = {
          "x": x,
          "y": y,
          "state": OPENED,
          "cost": parent.cost + wc_findCost(x, y),
           "mapCost": parent.cost + bg_findMapCost(x, y),
          "parent": parent,
          "depth": parent.depth + 1
        };
				//Add to heap
        heapAdd(item);
      }
    }
  }

  //Is this node already visited from parent to that x,y position?
  function isVisited(parent, x, y) {
    while (parent != null) {
      if (parent.x == x && parent.y == y) {
        return true;
      }
      parent = parent.parent;
    }
  }

	//Display all the resutlts of the grahp and the results are of the page
  function wc_displayAllNodeResults(steps, skipped, node, GraphSearch, deepest) {
    var p = "";

    var parent = node;
    var count = 0;
    while (parent != null) {
      p = parent.x + "," + parent.y + " " + p;
      if ((parent.x != goal[0] || parent.y != goal[1]) && (parent.x != start[0] || parent.y != start[1])) {
        GraphSearch[parent.x][parent.y].state = REALPATH;
      }
      parent = parent.parent;
      count++;
    }

    wc_createGraph();
    clearAllOldResults();

    var visitCount = 1;
    for (var i = 0; i < width; i++)
      for (var j = 0; j < height; j++)
        if (GraphSearch[i][j].state == REALPATH || GraphSearch[i][j].state == VISITED || GraphSearch[i][j].state == CLOSED)
          visitCount++;

    results("A* STAR" + " Visited <b>" + steps + "</b> nodes. Skipped <b>" + skipped + "</b> nodes.<br>");
    results("Explored <b>" + visitCount + "</b> grid squares (<b>" + (height * width - visitCount) + "</b> unexplored).<br>");
    results("Path: <b>" + (count) + "</b> grid squares.<br>");
    results("Cost: <b>" + (node.cost) + "</b>.<br>");
    results("Map Cost: <b>" + (node.cost) + "</b>.<br>");
    results("The deepest node visited had depth <b>" + deepest + "</b>.<br>");
    results("The search took <b>" + ((endTime.getTime() - startTime.getTime()) / 1000) + "</b> seconds.<br>")
    results("path: " + p + "<br>");

    keepNodes = steps;
    keepTime = ((endTime.getTime() - startTime.getTime()) / 1000);
  }

  //return the actual cost of the aSTAR terrain cost
  function wc_findCost(x, y, astar) {
    if (x < 0 || x > width - 1 || y < 0 || y > height - 1) {
      return 0
    };
    var c;
    var node = GraphSearch[x][y];

    var gx = Number(goal[0]);
    var gy = Number(goal[1]);

		var classType = getClassType(classTypeObject);

    switch (node.feature) {
      case "R":
        c = classType.R;
        break;
      case "f":
        c = classType.f;
        break;
      case "F":
        c = classType.F;
        break;
      case "h":
        c = classType.h;
        break;
      case "r":
        c = classType.r;
        break;
      case "M":
        c = classType.M;
        break;
		  case "W":
	      c = classType.W;
	      break;
      default:
        c = 999999;
    }
    //HEURISTIC
    if (heuristicType == 0)
    //manhattan distance
      c += Math.abs(gx - x) + Math.abs(gy - y);
    else if (heuristicType == 1)
    // euclidian distnace (straight line)
      c += Math.sqrt((gx - x) * (gx - x) + (gy - y) * (gy - y));

    return c;
  }

function bg_findMapCost(x, y, astar) {
    if (x < 0 || x > width - 1 || y < 0 || y > height - 1) {
      return 0
    };
    var c;
    var node = GraphSearch[x][y];

    var gx = Number(goal[0]);
    var gy = Number(goal[1]);

		var classType = getClassType(classTypeObject);

    switch (node.feature) {
      case "R":
        c = classType.R;
        break;
      case "f":
        c = classType.f;
        break;
      case "F":
        c = classType.F;
        break;
      case "h":
        c = classType.h;
        break;
      case "r":
        c = classType.r;
        break;
      case "M":
        c = classType.M;
        break;
		  case "W":
	      c = classType.W;
	      break;
      default:
        c = 999999;
    }
    return c;
    }
  //Total Number of nodes visited
  function countVisited(GraphSearch) {
    var count = 0;
    for (i = 0; i < GraphSearch.length; i++)
      for (j = 0; j < GraphSearch[i].length; j++)
        if (GraphSearch[i][j].state == VISITED || GraphSearch[i][j].state == CLOSED) count++;

    return Math.round(count / (height * width) * 100);
  }

  //Write Results to scren
  function results(msg) {
    document.getElementById("results").innerHTML += msg;
  }

  //Clear reutls from screen
  function clearAllOldResults() {
    document.getElementById("results").innerHTML = "";
  }

  //Add to Heap
  function heapAdd(item) {
    if (!binaryHeap || binaryHeap.length == 0) {
      binaryHeap = new Array();
      binaryHeap[0] = item;
      heapPointer++;
      return;
    }
    binaryHeap[heapPointer] = item;
    var i = heapPointer;
    var parent;
    while (i != 0) {
      parent = Math.floor((i - 1) / 2);
      if (binaryHeap[parent].cost > binaryHeap[i].cost) {
        heapSwap(parent, i);
      }
      i = parent;
    }
    heapPointer++;
  }

  //Clear Heap
  //http://eloquentjavascript.net/1st_edition/appendix2.html
  function heapDelete() {
    if (!binaryHeap) return false;
    if (binaryHeap[0] == null) return false;
    var item = binaryHeap[0];
    heapPointer--;
    binaryHeap[0] = binaryHeap[heapPointer];
    binaryHeap[heapPointer] = null;

    i = 0;
    while (binaryHeap[2 * i + 1]) {
      left = binaryHeap[2 * i + 1];
      right = binaryHeap[2 * i + 2];
      if (!right) {
        if (left.cost < binaryHeap[i].cost) {
          heapSwap(2 * i + 1, i);
          i = 2 * i + 1;
        } else break;
      } else {
        if (left.cost < right.cost && left.cost < binaryHeap[i].cost) {
          heapSwap(2 * i + 1, i);
          i = 2 * i + 1;
        } else if (left.cost >= right.cost && right.cost < binaryHeap[i].cost) {
          heapSwap(2 * i + 2, i);
          i = 2 * i + 2;
        } else break;
      }

    }
    return item;
  }

  function heapSwap(i, j) {
    swap = binaryHeap[i];
    binaryHeap[i] = binaryHeap[j];
    binaryHeap[j] = swap;
  }

  function heapClear() {
    binaryHeap = null;
    heapPointer = 0;

  }
