let currentMode = null;

let commandHistory = [];
let historyIndex = -1;

let tabMatches = [];
let tabIndex = 0;

let detectivePath = ["/"];
let detectiveSolved = false;



/* =========================
   DETECTIVE FILESYSTEM
========================= */

const detectiveEvidence = {
  auth: false,
  sys: false,
  report: false
};


const detectiveFS = {
  "/": {
    type: "dir",
    children: {
      logs: {
        type: "dir",
        children: {
          "auth.log": {
            type: "file",
            content:
`Jan 10 10:01 user=alice action=login
Jan 10 10:05 user=bob action=login
Jan 10 10:09 user=eve action=login FAILED
Jan 10 10:12 user=eve action=login SUCCESS`
          },
          "sys.log": {
            type: "file",
            content:
`System started
Cron job executed
User eve ran command: rm -rf /tmp/*
Kernel warning detected`
          },
          "access.log": {
            type: "file",
            content:
`/admin accessed by alice
/api accessed by bob
/admin accessed by eve`
          }
        }
      },
      reports: {
        type: "dir",
        children: {
          "incident.txt": {
            type: "file",
            content:
`Suspicious activity detected.
A user executed a dangerous command.
Search logs to identify the attacker.`
          }
        }
      },
      evidence: {
  type: "dir",
  children: {
    // culprit.txt hidden initially
  }
}

    }
  }
};


const cityProgress = {
  delhi: { visited: false, landmark: false },
  berlin: { visited: false, landmark: false },
  tokyo: { visited: false, landmark: false },
  newyork: { visited: false, landmark: false }
};


const output = document.getElementById("terminal-output");
const input = document.getElementById("commandInput");

/* =========================
   CITY EXPLORER FILESYSTEM
========================= */

const fileSystem = {
  "/": {
    type: "dir",
    children: {
      delhi: {
        type: "dir",
        children: {
          landmarks: {
            type: "dir",
            children: {
              "india_gate.txt": {
                type: "file",
                content: "India Gate is a war memorial located in New Delhi."
              }
            }
          }
        }
      },
      berlin: {
        type: "dir",
        children: {
          landmarks: {
            type: "dir",
            children: {
              "brandenburg_gate.txt": {
                type: "file",
                content: "The Brandenburg Gate is a historic monument in Berlin."
              }
            }
          }
        }
      },
      tokyo: {
        type: "dir",
        children: {
          landmarks: {
            type: "dir",
            children: {
              "shibuya_crossing.txt": {
                type: "file",
                content: "Shibuya Crossing is the busiest pedestrian crossing in the world."
              }
            }
          }
        }
      },
      newyork: {
        type: "dir",
        children: {
          landmarks: {
            type: "dir",
            children: {
              "statue_of_liberty.txt": {
                type: "file",
                content: "The Statue of Liberty symbolizes freedom and democracy."
              }
            }
          }
        }
      }
    }
  }
};

let currentPath = ["/"];

/* =========================
   MODE SELECTION
========================= */

document.querySelectorAll(".game-modes button").forEach(btn => {
  btn.addEventListener("click", () => {
    currentMode = btn.dataset.mode;
    output.innerHTML = "";

    if (currentMode === "detective") {
  detectivePath = ["/"];
  detectiveSolved = false;
  print("🕵️ Detective Mode Activated");
  print("Investigate logs to find the attacker.");
  print("Type 'help' for commands.");
}

    if (currentMode === "travel") {
      currentPath = ["/"];
      print(`🧭 City Explorer Mode`);
      print(`Type 'help' to see available commands.`);
    } else {
      print(`Mode '${currentMode}' not implemented yet.`);
    }

    input.focus();
  });
});

/* =========================
   INPUT HANDLER
========================= */

input.addEventListener("keydown", e => {

    // TAB → autocomplete
if (e.key === "Tab") {
  e.preventDefault();

  const value = input.value.trim();
  const parts = value.split(" ");

  // Only autocomplete for `cd`
  if (parts[0] !== "cd") return;

  const partial = parts[1] || "";
  const dir = getCurrentDir();

  if (!dir.children) return;

  // First tab → find matches
  if (tabMatches.length === 0) {
    tabMatches = Object.keys(dir.children)
      .filter(name =>
        dir.children[name].type === "dir" &&
        name.startsWith(partial)
      );
    tabIndex = 0;
  }

  if (tabMatches.length === 0) return;

  // Cycle matches
  input.value = `cd ${tabMatches[tabIndex]}`;
  tabIndex = (tabIndex + 1) % tabMatches.length;

  return;
}

  // ENTER → execute command
  if (e.key === "Enter") {
    const cmd = input.value.trim();
    if (!cmd) return;

    print(`$ ${cmd}`);

    commandHistory.push(cmd);
    historyIndex = commandHistory.length;

    input.value = "";
    handleCommand(cmd);
    output.scrollTop = output.scrollHeight;
  }

  // ARROW UP → previous command
  if (e.key === "ArrowUp") {
    if (commandHistory.length === 0) return;

    historyIndex = Math.max(0, historyIndex - 1);
    input.value = commandHistory[historyIndex];

    // keep cursor at end
    setTimeout(() => {
      input.selectionStart = input.selectionEnd = input.value.length;
    }, 0);

    e.preventDefault();
  }

  // ARROW DOWN → next command
  if (e.key === "ArrowDown") {
    if (commandHistory.length === 0) return;

    historyIndex = Math.min(commandHistory.length, historyIndex + 1);

    if (historyIndex === commandHistory.length) {
      input.value = "";
    } else {
      input.value = commandHistory[historyIndex];
    }

    e.preventDefault();
  }

  // Reset tab state on normal typing
if (!["Tab", "ArrowUp", "ArrowDown"].includes(e.key)) {
  tabMatches = [];
  tabIndex = 0;
}

});


/* =========================
   COMMAND ROUTER
========================= */

function handleCommand(cmd) {
  if (!currentMode) {
    print("Select a mode first.");
    return;
  }

  if (currentMode === "detective") {
  handleDetectiveCommand(cmd);
}


  if (currentMode === "travel") {
    handleTravelCommand(cmd);
  }
}

/* =========================
   CITY EXPLORER LOGIC
========================= */

function handleTravelCommand(cmd) {
  const [command, arg] = cmd.split(" ");

  switch (command) {

    case "help":
      print("Commands: ls, cd <dir>, cd .., pwd, cat <file>, clear");
      break;

    case "clear":
      output.innerHTML = "";
      break;

    case "pwd":
      print(currentPath.join("") === "/" ? "/" : currentPath.join("/"));
      break;

    case "ls":
      listDirectory();
      break;

    case "cd":
      changeDirectory(arg);
      break;

    case "cat":
      readFile(arg);
      break;

    default:
      print(`Command not found: ${command}`);
  }
}

function handleDetectiveCommand(cmd) {
  const parts = cmd.split(" ");
  const command = parts[0];
  const arg = parts[1];

  switch (command) {

    case "help":
      print("Commands: ls, cd <dir>, cd .., cat <file>, grep <word> <file>, clear");
      break;

    case "clear":
      output.innerHTML = "";
      break;

    case "ls":
      detectiveList();
      break;

    case "cd":
      detectiveCd(arg);
      break;

    case "cat":
      detectiveCat(arg);
      break;

    case "grep":
      detectiveGrep(parts[1]?.replace(/"/g, ""), parts[2]);
      break;

    default:
      print(`Command not found: ${command}`);
  }
}




/* =========================
   FILESYSTEM HELPERS
========================= */


function detectiveGetDir() {
  let dir = detectiveFS["/"];
  for (let i = 1; i < detectivePath.length; i++) {
    dir = dir.children[detectivePath[i]];
  }
  return dir;
}

function detectiveList() {
  const dir = detectiveGetDir();

  if (!dir.children) {
    print("Not a directory");
    return;
  }

  print(Object.keys(dir.children).join("  "));
}


function detectiveCat(file) {
  if (!file) {
    print("cat: missing file");
    return;
  }

  const dir = detectiveGetDir();
  const f = dir.children[file];

  if (!f || f.type !== "file") {
    print(`cat: ${file}: No such file`);
    return;
  }

  print(f.content);

  // ✅ Evidence from report
  if (file === "incident.txt") {
    detectiveEvidence.report = true;
    print("📄 Incident report reviewed.");
    checkEvidenceUnlock();
  }

  if (file === "culprit.txt") {
    detectiveSolved = true;
    print("🎉 Case Solved! Attacker identified.");
  }
}



  print(f.content);

  if (file === "culprit.txt") {
    detectiveSolved = true;
    print("🎉 Case Solved! Attacker identified.");
  }


function detectiveGrep(keyword, file) {
  if (!keyword || !file) {
    print("grep: missing arguments");
    return;
  }

  const dir = detectiveGetDir();
  const f = dir.children[file];

  if (!f || f.type !== "file") {
    print(`grep: ${file}: No such file`);
    return;
  }

  const matches = f.content
    .split("\n")
    .filter(line => line.includes(keyword));

  if (matches.length === 0) {
    print("No matches found.");
  } else {
    matches.forEach(line => print(line));
  }

  // ✅ Evidence tracking
  if (keyword === "eve" && file === "auth.log") {
    detectiveEvidence.auth = true;
    print("⚠️ Suspicious login detected.");
  }

  if (keyword === "eve" && file === "sys.log") {
    detectiveEvidence.sys = true;
    print("⚠️ Dangerous command execution found.");
  }

  checkEvidenceUnlock();
}

function detectiveCd(target) {
  if (!target) {
    print("cd: missing argument");
    return;
  }

  if (target === "..") {
    if (detectivePath.length > 1) {
      detectivePath.pop();
    }
    return;
  }

  const dir = detectiveGetDir();

  if (dir.children[target] && dir.children[target].type === "dir") {
    detectivePath.push(target);
  } else {
    print(`cd: no such directory: ${target}`);
  }
}

function checkEvidenceUnlock() {
  const evidenceCount = Object.values(detectiveEvidence)
    .filter(Boolean).length;

  if (evidenceCount >= 2 && !detectiveFS["/"].children.evidence.children["culprit.txt"]) {

    detectiveFS["/"].children.evidence.children["culprit.txt"] = {
      type: "file",
      content: "Culprit identified: eve"
    };

    print("🔓 Evidence sufficient.");
    print("New file unlocked: evidence/culprit.txt");
  }
}







function getCurrentDir() {
  let dir = fileSystem["/"];
  for (let i = 1; i < currentPath.length; i++) {
    dir = dir.children[currentPath[i]];
  }
  return dir;
}

function listDirectory() {
  const dir = getCurrentDir();
  if (!dir.children) {
    print("Not a directory");
    return;
  }
  print(Object.keys(dir.children).join("  "));
}

function changeDirectory(target) {
  if (!target) {
    print("cd: missing argument");
    return;
  }

  if (target === "..") {
    if (currentPath.length > 1) currentPath.pop();
    return;
  }

  const dir = getCurrentDir();

  if (dir.children[target] && dir.children[target].type === "dir") {
    currentPath.push(target);

    // Track city visit
    if (cityProgress[target]) {
      cityProgress[target].visited = true;
      updateCityMap();
      print(`📍 Entered ${target}`);
    }

  } else {
    print(`cd: no such directory: ${target}`);
  }
}


function readFile(fileName) {
  if (!fileName) {
    print("cat: missing file name");
    return;
  }

  const dir = getCurrentDir();
  const file = dir.children[fileName];

  if (file && file.type === "file") {
    print(file.content);

    const city = currentPath[1];
    if (city && cityProgress[city]) {
      cityProgress[city].landmark = true;
      updateCityMap();
      checkWinCondition();
    }

  } else {
    print(`cat: ${fileName}: No such file`);
  }
}

function updateCityMap() {
  Object.keys(cityProgress).forEach(city => {
    const el = document.querySelector(`[data-city="${city}"]`);
    if (!el) return;

    if (cityProgress[city].landmark) {
      el.className = "city completed";
      el.textContent = `${capitalize(city)} ✅`;
    } else if (cityProgress[city].visited) {
      el.className = "city visited";
      el.textContent = `${capitalize(city)} 👀`;
    } else {
      el.className = "city";
      el.textContent = `${capitalize(city)} ❌`;
    }
  });
}

function checkWinCondition() {
  const allDone = Object.values(cityProgress)
    .every(city => city.visited && city.landmark);

  if (allDone) {
    print("🎉 CONGRATULATIONS!");
    print("You explored all cities and landmarks.");
    print("City Explorer completed ✅");
  }
}


function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


/* =========================
   OUTPUT HELPER
========================= */

function print(text) {
  output.innerHTML += `${text}<br>`;
}
