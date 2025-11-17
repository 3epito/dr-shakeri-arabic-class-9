// ======= داده‌های جدید برای پرسش‌ها، لیگ و نقشه کلاس =======

const students = [
  "سینا","کوشان","امیرحسین","امیرسام","امیررضا",
  "سپهر","ارمیا","امیرحافظ","آریو","نیکان",
  "تایماز","پارسا","رهام","علی","آرشا","پرهام"
];

// ⬅️ آرایه‌ی initialSeats: دو میز اول آبی و بقیه سبز
const initialSeats = [
    // ردیف ۱ (نزدیک تخته) - میزهای آبی
    { type: 'desk-pair', x: 150, y: 120, color: 'blue', students: ["سینا", "کوشان"] },
    { type: 'desk-pair', x: 500, y: 120, color: 'blue', students: ["امیرحسین", "امیرسام"] },

    // ردیف ۲ - میزهای سبز
    { type: 'desk-pair', x: 150, y: 220, color: 'green', students: ["امیررضا", "سپهر"] },
    { type: 'desk-pair', x: 500, y: 220, color: 'green', students: ["ارمیا", "امیرحافظ"] },

    // ردیف ۳ - میزهای سبز
    { type: 'desk-pair', x: 150, y: 320, color: 'green', students: ["آریو", "نیکان"] },
    { type: 'desk-pair', x: 500, y: 320, color: 'green', students: ["تایماز", "پارسا"] },

    // ردیف ۴ (آخر) - میزهای سبز
    { type: 'desk-pair', x: 150, y: 420, color: 'green', students: ["رهام", "علی"] },
    { type: 'desk-pair', x: 500, y: 420, color: 'green', students: ["آرشا", "پرهام"] },
];

const groups = {
  "اشهک های خر کوتوله": ["ارمیا","نیکان","پارسا","سینا"],
  "قوردلارین قایدیشی": ["سپهر","آرشا","رهام","کوشان"],
  "پان عرب ها": ["امیرسام","آریو","تایماز","علی"],
  "اوچینگلس ها": ["امیررضا","پرهام","امیرحافظ","امیرحسین"]
};

// متغیرهای ذخیره وضعیت نشستن
let seatingArrangement = JSON.parse(localStorage.getItem('seatingArrangement')) || initialSeats;
let studentPositions = JSON.parse(localStorage.getItem('studentPositions')) || {};

// متغیرهای ذخیره نمرات جدید
const quizScores = JSON.parse(localStorage.getItem('quizScores')) || {};
const leagueScores = JSON.parse(localStorage.getItem('leagueScores')) || {};

// اطمینان از مقداردهی اولیه نمرات
students.forEach(s => { if (!quizScores[s]) quizScores[s] = 0; });
Object.keys(groups).forEach(g => { if (!leagueScores[g]) leagueScores[g] = 0; });


// ======= مدیریت تب‌ها (بروزرسانی شده) =======
function openTab(tabName) {
  document.querySelectorAll('.tabcontent').forEach(tc => tc.style.display = 'none');
  document.getElementById(tabName).style.display = 'block';
  // فراخوانی توابع جدید هنگام باز شدن تب
  if (tabName === 'seating') setupSeatingArrangement(); 
  if (tabName === 'music') setupMusicPlayer();
  if (tabName === 'quiz') setupQuizBoard();
  if (tabName === 'league') setupLeagueBoard();
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
    // 🎯 دکمه منفی، امتیاز انضباطی (نمره منفی) را اضافه می‌کند
    minusBtn.onclick = () => { 
      disciplineCounts[student]++; 
      countLabel.textContent = disciplineCounts[student];
    };
    container.appendChild(minusBtn);
    disciplineBoard.appendChild(container);
  });
}
createDisciplineBoard();


// **********************************************
// ********** منطق ۵ قابلیت جدید *****************
// **********************************************

// ======= ۲. تب آهنگ‌ها =======
const musicFiles = [
    { name: "آهنگ عربی ۱", src: "music/arabic_song1.mp3" },
    { name: "آهنگ کلاسیک ۲", src: "music/classic_song2.mp3" }
];
function setupMusicPlayer() {
    const musicListDiv = document.getElementById('musicList');
    musicListDiv.innerHTML = '';
    musicFiles.forEach(track => {
        const div = document.createElement('div');
        div.style.margin = '15px';

        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = track.src;
        audio.style.width = '300px';

        const nameLabel = document.createElement('p');
        nameLabel.textContent = track.name;

        div.appendChild(nameLabel);
        div.appendChild(audio);
        musicListDiv.appendChild(div);
    });
}

// ======= ۳. تب وضعیت نشستن (Drag & Drop) - اصلاح شده =======
function setupSeatingArrangement() {
    const arrangementDiv = document.getElementById('seatingArrangement');
    arrangementDiv.innerHTML = ''; 
    
    let currentStudentPositions = JSON.parse(localStorage.getItem('studentPositions')) || studentPositions;
    
    seatingArrangement.forEach(seat => {
        const desk = document.createElement('div');
        desk.className = 'desk-pair';
        
        // ⬅️ اعمال کلاس رنگی بر اساس ویژگی color
        if (seat.color) {
            desk.classList.add(seat.color);
        }

        desk.style.left = `${seat.x}px`;
        desk.style.top = `${seat.y}px`;
        arrangementDiv.appendChild(desk);

        // صندلی اول - موقعیت اولیه (عقب‌تر از میز)
        let pos1 = currentStudentPositions[seat.students[0]] || { x: seat.x + 10, y: seat.y + 75 }; // Y + 75 برای عقب‌تر قرار گرفتن
        createDraggableStudent(seat.students[0], pos1.x, pos1.y, arrangementDiv);
        
        // صندلی دوم - موقعیت اولیه (عقب‌تر از میز)
        let pos2 = currentStudentPositions[seat.students[1]] || { x: seat.x + 80, y: seat.y + 75 }; // Y + 75 برای عقب‌تر قرار گرفتن
        createDraggableStudent(seat.students[1], pos2.x, pos2.y, arrangementDiv);
    });

    localStorage.setItem('seatingArrangement', JSON.stringify(seatingArrangement));
}

function createDraggableStudent(name, initialX, initialY, parentElement) {
    const student = document.createElement('div');
    student.className = 'student-name';
    student.id = `student-${name}`;
    student.textContent = name;
    student.style.left = `${initialX}px`;
    student.style.top = `${initialY}px`;
    student.draggable = true;
    
    let isDragging = false;
    let offsetX, offsetY;
    
    student.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - student.getBoundingClientRect().left;
        offsetY = e.clientY - student.getBoundingClientRect().top;
        student.style.zIndex = 100;
        e.preventDefault(); 
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const parentRect = parentElement.getBoundingClientRect();
        let newX = e.clientX - parentRect.left - offsetX;
        let newY = e.clientY - parentRect.top - offsetY;

        // اعمال محدودیت‌ها: در داخل محدوده div#classroom بماند
        newX = Math.max(0, Math.min(newX, parentRect.width - student.offsetWidth));
        newY = Math.max(0, Math.min(newY, parentRect.height - student.offsetHeight));

        student.style.left = `${newX}px`;
        student.style.top = `${newY}px`;
        
        studentPositions[name] = { x: newX, y: newY };
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            student.style.zIndex = 10; 
            localStorage.setItem('studentPositions', JSON.stringify(studentPositions));
        }
    });
    
    parentElement.appendChild(student);
}


// ======= ۴. تب پرسش‌های کلاسی (نمره فردی) - اصلاح شده برای نمره اعشاری =======
let selectedQuizStudent = null;

function setupQuizBoard() {
    const boardDiv = document.getElementById('quizBoard');
    boardDiv.innerHTML = '<table><tr><th>نام دانش‌آموز</th><th>نمره پرسش</th><th>عملیات</th></tr></table>';
    const table = boardDiv.querySelector('table');
    
    students.forEach(student => {
        const row = table.insertRow();
        row.id = `quiz-${student}`;
        row.insertCell().textContent = student;
        row.insertCell().textContent = quizScores[student] !== undefined ? quizScores[student] : 0;
        
        const cell = row.insertCell();
        const btn = document.createElement('button');
        btn.textContent = 'انتخاب';
        btn.onclick = () => selectStudentForQuiz(student);
        cell.appendChild(btn);
    });
}

function selectStudentForQuiz(student) {
    selectedQuizStudent = student;
    document.querySelectorAll('#quizBoard tr').forEach(row => row.style.backgroundColor = 'transparent');
    const selectedRow = document.getElementById(`quiz-${student}`);
    if (selectedRow) selectedRow.style.backgroundColor = '#f0f0a0';
}

function applyQuizScore() {
    if (!selectedQuizStudent) { alert('لطفاً ابتدا دانش‌آموز را انتخاب کنید.'); return; }
    
    const scoreInput = document.getElementById('quizScoreInput');
    const score = parseFloat(scoreInput.value);

    if (isNaN(score) || score === 0) {
        alert('لطفاً یک عدد معتبر و غیر صفر (مثلاً 0.75 یا 1.5) برای نمره وارد کنید.'); 
        return;
    }
    
    quizScores[selectedQuizStudent] = (quizScores[selectedQuizStudent] || 0) + score;
    const selectedRow = document.getElementById(`quiz-${selectedQuizStudent}`);
    if (selectedRow) selectedRow.cells[1].textContent = quizScores[selectedQuizStudent];
    
    localStorage.setItem('quizScores', JSON.stringify(quizScores));
    alert(`نمره ${score} به ${selectedQuizStudent} اضافه شد.`);
    
    scoreInput.value = '';
    selectedQuizStudent = null;
    document.querySelectorAll('#quizBoard tr').forEach(row => row.style.backgroundColor = 'transparent');
}


// ======= ۵. تب لیگ عربی کاپ (نمره گروهی) - اصلاح شده برای نمره اعشاری =======
let selectedLeagueGroup = null;

function setupLeagueBoard() {
    const boardDiv = document.getElementById('leagueBoard');
    boardDiv.innerHTML = '<table><tr><th>نام گروه</th><th>نمره لیگ</th><th>عملیات</th></tr></table>';
    const table = boardDiv.querySelector('table');
    
    Object.keys(groups).forEach(groupName => {
        const row = table.insertRow();
        row.id = `league-${groupName.replace(/\s/g, '-')}`;
        row.insertCell().textContent = groupName;
        row.insertCell().textContent = leagueScores[groupName] !== undefined ? leagueScores[groupName] : 0;
        
        const cell = row.insertCell();
        const btn = document.createElement('button');
        btn.textContent = 'انتخاب';
        btn.onclick = () => selectGroupForLeague(groupName);
        cell.appendChild(btn);
    });
}

function selectGroupForLeague(groupName) {
    selectedLeagueGroup = groupName;
    document.querySelectorAll('#leagueBoard tr').forEach(row => row.style.backgroundColor = 'transparent');
    const selectedRow = document.getElementById(`league-${groupName.replace(/\s/g, '-')}`);
    if (selectedRow) selectedRow.style.backgroundColor = '#f0f0a0';
}

function applyLeagueScore() {
    if (!selectedLeagueGroup) { alert('لطفاً ابتدا گروه را انتخاب کنید.'); return; }
    
    const scoreInput = document.getElementById('leagueScoreInput');
    const score = parseFloat(scoreInput.value);
    
    if (isNaN(score) || score === 0) {
        alert('لطفاً یک عدد معتبر و غیر صفر (مثلاً 0.75 یا 1.5) برای نمره وارد کنید.'); 
        return;
    }
    
    leagueScores[selectedLeagueGroup] = (leagueScores[selectedLeagueGroup] || 0) + score;
    const selectedRow = document.getElementById(`league-${selectedLeagueGroup.replace(/\s/g, '-')}`);
    if (selectedRow) selectedRow.cells[1].textContent = leagueScores[selectedLeagueGroup];
    
    localStorage.setItem('leagueScores', JSON.stringify(leagueScores));
    alert(`نمره ${score} به گروه ${selectedLeagueGroup} اضافه شد.`);
    
    scoreInput.value = '';
    selectedLeagueGroup = null;
    document.querySelectorAll('#leagueBoard tr').forEach(row => row.style.backgroundColor = 'transparent');
}


// **********************************************
// ********** ذخیره و بارگذاری (بروزرسانی شده) ****
// **********************************************

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
    taActive: taButton.classList.contains("active"),
    quiz: {...quizScores}, // ذخیره پرسش‌های کلاسی
    league: {...leagueScores}, // ذخیره لیگ عربی کاپ
    seat_pos: {...studentPositions} // ذخیره موقعیت صندلی‌ها
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

    // پرسش‌ها (جدید)
    Object.assign(quizScores, data.quiz);
    setupQuizBoard();

    // لیگ کاپ (جدید)
    Object.assign(leagueScores, data.league);
    setupLeagueBoard();
    
    // وضعیت نشستن (جدید)
    Object.assign(studentPositions, data.seat_pos);
    setupSeatingArrangement();

    // TA
    if(data.taActive) taButton.classList.add("active");
    else taButton.classList.remove("active");

    alert("جلسه بارگذاری شد!");
  } else {
    // اگر داده‌ای نیست، همه ریست شوند
    statusCells.forEach(c => { c.classList.remove('hadir'); c.textContent = "غایب"; });
    createHomeworkStatus();
    
    // ریست انضباطی
    Object.keys(disciplineCounts).forEach(k => disciplineCounts[k]=0);
    createDisciplineBoard();
    
    // ریست داده‌های جدید
    Object.keys(quizScores).forEach(k => quizScores[k]=0);
    setupQuizBoard();
    Object.keys(leagueScores).forEach(k => leagueScores[k]=0);
    setupLeagueBoard();
    studentPositions = {};
    setupSeatingArrangement();
    
    taButton.classList.remove("active");
  }
}

saveBtn.addEventListener("click", saveSession);
loadBtn.addEventListener("click", loadSession);

// اطمینان از تنظیم اولیه بوردها و Selectها
document.addEventListener('DOMContentLoaded', () => {
    setupQuizBoard();
    setupLeagueBoard();
});
