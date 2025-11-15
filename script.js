// ======= مدیریت تب‌ها =======
function openTab(tabName) {
  document.querySelectorAll('.tabcontent').forEach(tc => tc.style.display = 'none');
  document.getElementById(tabName).style.display = 'block';
}
openTab('attendance'); // تب پیش‌فرض

// ======= تاریخ =======
const dateInput = document.createElement("input");
dateInput.type = "date";
dateInput.id = "sessionDate";
dateInput.style.marginBottom = "15px";
document.body.insertBefore(dateInput, document.body.firstChild);

// ======= دکمه ذخیره و بارگذاری =======
const saveBtn = document.createElement("button");
saveBtn.textContent = "ذخیره جلسه";
saveBtn.style.marginRight = "10px";
document.body.insertBefore(saveBtn, dateInput.nextSibling);

const loadBtn = document.createElement("button");
loadBtn.textContent = "بارگذاری جلسه";
document.body.insertBefore(loadBtn, saveBtn.nextSibling);

// ======= TA Button =======
const taButton = document.getElementById("taButton");
taButton.addEventListener("click", () => {
  taButton.classList.toggle("active");
});

// ======= حضور و غیاب =======
const statusCells = document.querySelectorAll('.status');
statusCells.forEach(cell => {
  cell.addEventListener('click', () => {
    if(cell.classList.contains('hadir')){
      cell.classList.remove('hadir');
      cell.textContent = 'غایب';
    } else {
      cell.classList.add('hadir');
      cell.textContent = 'حاضر';
    }
  });
});

// ======= گردونه شانس =======
const students = [
  "سینا","کوشان","امیرحسین","امیرسام","امیررضا",
  "سپهر","ارمیا","امیرحافظ","آریو","نیکان",
  "تایماز","پارسا","رهام","علی","آرشا","پرهام"
];
const colors = [
  "#f94144","#f3722c","#f8961e","#90be6d",
  "#43aa8b","#577590","#f9c74f","#f9844a",
  "#f3722c","#90be6d","#43aa8b","#577590",
  "#f94144","#f8961e","#f9c74f","#f9844a"
];
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const radius = canvas.width / 2;

function drawWheel() {
  const arc = (2 * Math.PI) / students.length;
  for (let i = 0; i < students.length; i++) {
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, i * arc, (i + 1) * arc);
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate((i + 0.5) * arc);
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText(students[i], radius - 10, 5);
    ctx.restore();
  }
}

let spinning = false;
document.getElementById("spinButton").addEventListener("click", () => {
  if (spinning) return;
  spinning = true;
  let angle = 0;
  let speed = Math.random() * 0.3 + 0.3;
  const friction = 0.99;

  function animate() {
    angle += speed;
    speed *= friction;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(angle);
    ctx.translate(-radius, -radius);
    drawWheel();
    ctx.restore();

    if (speed > 0.002) requestAnimationFrame(animate);
    else spinning = false;
  }

  animate();
});
drawWheel();

// ======= گروه‌ها =======
const groups = {
  "اشهک های خر کوتوله": ["ارمیا","نیکان","پارسا","سینا"],
  "قوردلارین قایدیشی": ["سپهر","آرشا","رهام","کوشان"],
  "پان عرب ها": ["امیرسام","آریو","تایماز","علی"],
  "اوچینگلس ها": ["امیررضا","پرهام","امیرحافظ","امیرحسین"]
};
const groupsDiv = document.getElementById("groupsDiv");
for (let groupName in groups) {
  const groupTitle = document.createElement("h3");
  groupTitle.textContent = groupName;
  groupsDiv.appendChild(groupTitle);
  const namesText = document.createElement("p");
  namesText.textContent = groups[groupName].join(" ، ");
  groupsDiv.appendChild(namesText);
}

// ======= بورس فعالیت =======
const studentsScore = {};
students.forEach(s => studentsScore[s] = 0);
const board = document.getElementById("tradingBoard");

students.forEach(student => {
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.flexDirection = "column-reverse";
  container.style.alignItems = "center";

  const bars = document.createElement("div");
  bars.style.display = "flex";
  bars.style.flexDirection = "column-reverse";
  bars.style.alignItems = "center";
  container.appendChild(bars);

  const nameLabel = document.createElement("div");
  nameLabel.textContent = student;
  nameLabel.style.marginTop = "5px";
  container.appendChild(nameLabel);

  const btnContainer = document.createElement("div");
  btnContainer.style.marginTop = "5px";

  const addBtn = document.createElement("button");
  addBtn.textContent = "+";
  addBtn.onclick = () => addActivity(student, bars);

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "-";
  removeBtn.onclick = () => removeActivity(student, bars);

  btnContainer.appendChild(addBtn);
  btnContainer.appendChild(removeBtn);
  container.appendChild(btnContainer);

  board.appendChild(container);
});

function addActivity(student, barsDiv) {
  studentsScore[student]++;
  const dot = document.createElement("div");
  dot.style.width = "20px";
  dot.style.height = "20px";
  dot.style.backgroundColor = "#43aa8b";
  dot.style.margin = "2px 0";
  barsDiv.appendChild(dot);
}

function removeActivity(student, barsDiv) {
  if (studentsScore[student] > 0) {
    studentsScore[student]--;
    if (barsDiv.lastChild) barsDiv.removeChild(barsDiv.lastChild);
  }
}

// ======= گزارش و تکالیف =======
function addHomework() {
  const input = document.getElementById("newHomework");
  if(input.value.trim() !== "") {
    const li = document.createElement("li");
    li.textContent = input.value;
    document.getElementById("homeworkList").appendChild(li);
    input.value = "";
  }
}

const homeworkStudents = students;
const homeworkStatusDiv = document.getElementById("homeworkStatus");
function createHomeworkStatus() {
  homeworkStatusDiv.innerHTML = "";
  homeworkStudents.forEach(student => {
    const container = document.createElement("div");
    container.style.marginBottom = "5px";

    const nameLabel = document.createElement("span");
    nameLabel.textContent = student + ": ";
    container.appendChild(nameLabel);

    const completeBtn = document.createElement("button");
    completeBtn.textContent = "✅ کامل";
    const statusLabel = document.createElement("span");
    statusLabel.textContent = " - ";
    statusLabel.style.marginLeft = "10px";
    completeBtn.onclick = () => {
      statusLabel.textContent = "کامل";
      statusLabel.style.color = "green";
    };
    container.appendChild(completeBtn);

    const incompleteBtn = document.createElement("button");
    incompleteBtn.textContent = "❌ نقص";
    incompleteBtn.onclick = () => {
      statusLabel.textContent = "نقص";
      statusLabel.style.color = "red";
    };
    container.appendChild(incompleteBtn);

    container.appendChild(statusLabel);
    homeworkStatusDiv.appendChild(container);
  });
}
createHomeworkStatus();

// ======= انضباطی =======
const disciplineBoard = document.getElementById("disciplineBoard");
const disciplineCounts = {};
function createDisciplineBoard() {
  disciplineBoard.innerHTML = "";
  students.forEach(student => {
    if(!disciplineCounts[student]) disciplineCounts[student] = 0;
    const container = document.createElement("div");
    container.style.margin = "5px";
    container.style.textAlign = "center";

    const nameLabel = document.createElement("div");
    nameLabel.textContent = student;
    container.appendChild(nameLabel);

    const countLabel = document.createElement("div");
    countLabel.textContent = disciplineCounts[student];
    countLabel.style.color = "red";
    countLabel.style.fontWeight = "bold";
    container.appendChild(countLabel);

    const minusBtn = document.createElement("button");
    minusBtn.textContent = "-";
    // 🎯 اصلاح قطعی: دکمه منفی، امتیاز انضباطی را اضافه می‌کند
    minusBtn.onclick = () => { 
      disciplineCounts[student]++; 
      countLabel.textContent = disciplineCounts[student];
    };
    container.appendChild(minusBtn);
    disciplineBoard.appendChild(container);
  });
}
createDisciplineBoard();

// ======= ذخیره و بارگذاری =======
function saveSession() {
  const date = dateInput.value;
  if(!date) { alert("لطفاً تاریخ را انتخاب کنید."); return; }

  const data = {
    attendance: Array.from(statusCells).map(c => c.classList.contains('hadir') ? "حاضر" : "غایب"),
    homework: Array.from(homeworkStatusDiv.children).map(div => {
      const statusSpan = div.querySelector("span:last-child");
      return statusSpan.textContent;
    }),
    discipline: {...disciplineCounts},
    taActive: taButton.classList.contains("active")
    // بورس فعالیت‌ها جدا ذخیره نمی‌کنیم چون دائمی هستند
  };
  localStorage.setItem("session_" + date, JSON.stringify(data));
  alert("جلسه ذخیره شد!");
}

function loadSession() {
  const date = dateInput.value;
  if(!date) { alert("لطفاً تاریخ را انتخاب کنید."); return; }
  const data = JSON.parse(localStorage.getItem("session_" + date));

  if(data) {
    // حضور و غیاب
    statusCells.forEach((c,i) => {
      if(data.attendance[i] === "حاضر") {
        c.classList.add('hadir');
        c.textContent = "حاضر";
      } else {
        c.classList.remove('hadir');
        c.textContent = "غایب";
      }
    });

    // تکالیف
    homeworkStatusDiv.childNodes.forEach((div,i) => {
      const statusSpan = div.querySelector("span:last-child");
      statusSpan.textContent = data.homework[i];
      statusSpan.style.color = data.homework[i] === "کامل" ? "green" : data.homework[i] === "نقص" ? "red" : "black";
    });

    // انضباطی
    Object.keys(data.discipline).forEach(student => {
      disciplineCounts[student] = data.discipline[student];
    });
    createDisciplineBoard();

    // TA
    if(data.taActive) taButton.classList.add("active");
    else taButton.classList.remove("active");

    alert("جلسه بارگذاری شد!");
  } else {
    // اگر داده‌ای نیست، همه ریست شوند به جز بورس فعالیت‌ها
    statusCells.forEach(c => { c.classList.remove('hadir'); c.textContent = "غایب"; });
    createHomeworkStatus();
    Object.keys(disciplineCounts).forEach(k => disciplineCounts[k]=0);
    createDisciplineBoard();
    taButton.classList.remove("active");
  }
}

saveBtn.addEventListener("click", saveSession);
loadBtn.addEventListener("click", loadSession);
