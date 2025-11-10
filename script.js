// --- ROUND 1: 2 câu trắc nghiệm ---
let round1 = [
  {
    id: 1,
    type: "video",
    content: "https://www.youtube.com/embed/ATWuXsE9S7E",
    hint: "Video nói: 'Nguyễn Huệ và Quang Trung là hai người khác nhau'",
    correct: false
  },
  {
    id: 2,
    type: "image",
    content: "https://upload.wikimedia.org/wikipedia/commons/6/65/Nguyen_Hue_Emperor.jpg",
    hint: "Poster ghi: 'Nguyễn Huệ và Quang Trung là một người'",
    correct: true
  }
];

// --- ROUND 2: 2 câu điền chỗ trống ---
let round2 = [
  {
    id: 1,
    question: "Quang Trung đại phá ...... vạn quân Thanh",
    answer: "20",
    hint: "Quang Trung đánh thắng quân Thanh với 20 vạn quân"
  },
  {
    id: 2,
    question: "Nguyễn Huệ là vua của triều ......",
    answer: "Tây Sơn",
    hint: "Nguyễn Huệ là vua triều Tây Sơn"
  }
];

let currentRound = 1; // 1 hoặc 2
let attempts = {};
let locked = {};
let score = 0;
let torch = 0; // số câu đúng từ round 1
let puzzles = [...round1];

// shuffle mảng
function shuffleArray(array) {
  for (let i=array.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [array[i],array[j]]=[array[j],array[i]];
  }
  return array;
}

// vẽ câu hỏi
function renderPuzzles() {
  const container = document.getElementById("roundContainer");
  container.innerHTML = "";
  if(currentRound===1){
    puzzles.forEach(p=>{
      let html = `<div class="puzzle" id="puzzle${p.id}">
      <h2>Câu ${p.id}</h2>`;
      if(p.type==="video"){
        html += `<div class="video-wrap"><iframe src="${p.content}" allowfullscreen></iframe></div>`;
      } else if(p.type==="image"){
        html += `<img src="${p.content}" class="poster" alt="Poster">`;
      }
      html += `<p class="hint">${p.hint}</p>
      <div class="choices">
        <button onclick="checkAnswerRound1(${p.id},true)">Đúng</button>
        <button onclick="checkAnswerRound1(${p.id},false)">Sai</button>
      </div>
      <p id="feedback${p.id}" class="feedback"></p>
      </div>`;
      container.innerHTML += html;
    });
  } else if(currentRound===2){
    puzzles.forEach(p=>{
      let html = `<div class="puzzle" id="puzzle${p.id}">
      <h2>Câu ${p.id}</h2>
      <p>${p.question.replace("......","<input type='text' id='input${p.id}'>")}</p>
      <button onclick="checkAnswerRound2(${p.id})">Chốt đáp án</button>
      <p id="feedback${p.id}" class="feedback"></p>
      </div>`;
      container.innerHTML += html;
    });
  }
  updateStatus();
}

// check round1
function checkAnswerRound1(id, answer){
  if(locked[id]) return;
  let puzzle = puzzles.find(p=>p.id===id);
  let fb = document.getElementById("feedback"+id);

  if(answer===puzzle.correct){
    attempts[id]=true;
    fb.style.color="green";
    fb.textContent="Chính xác! "+getExplanationRound1(id);
  } else {
    attempts[id]=false;
    locked[id]=true;
    fb.style.color="red";
    fb.textContent="Sai! "+getExplanationRound1(id);
  }
  updateStatus();
}

// check round2
function checkAnswerRound2(id){
  let puzzle = puzzles.find(p=>p.id===id);
  let fb = document.getElementById("feedback"+id);
  let userAns = document.getElementById("input"+id).value.trim();
  if(userAns===puzzle.answer){
    attempts[id]=true;
    fb.style.color="green";
    fb.textContent="Chúc mừng! Câu trả lời hoàn toàn chính xác!";
  } else {
    attempts[id]=false;
    fb.style.color="red";
    fb.textContent="Sai! "+puzzle.hint;
  }
  updateStatus();
}

// lời giải thích round1
function getExplanationRound1(id){
  if(id===1) return "Nguyễn Huệ chính là Quang Trung — lãnh đạo quân Tây Sơn chiến thắng quân Thanh năm 1789.";
  if(id===2) return "Poster này đúng: Quang Trung = Nguyễn Huệ, hai tên cùng một người.";
  return "";
}

// cập nhật trạng thái
function updateStatus(){
  const done = Object.values(attempts).filter(x=>x).length;
  document.getElementById("scoreDisplay").textContent="Điểm: "+done*10;
  document.getElementById("progressDisplay").textContent="Tiến độ: "+done+" / "+puzzles.length;
  document.getElementById("torchDisplay").textContent="Ngọn đuốc: "+torch;
}

// mở cửa
document.getElementById("openDoor").addEventListener("click", ()=>{
  const wrongs = puzzles.filter(p=>!attempts[p.id]);
  const doorFB = document.getElementById("doorFeedback");
  if(wrongs.length===0){
    if(currentRound===1){
      doorFB.style.color="green";
      doorFB.textContent="Bạn đã mở cửa Round 1! Chuyển sang Round 2";
      // cấp vật phẩm
      torch = Object.values(attempts).filter(x=>x).length;
      // setup round2
      currentRound=2;
      puzzles = [...round2];
      attempts={};
      locked={};
      puzzles = shuffleArray(puzzles);
      setTimeout(()=>renderPuzzles(), 1000);
    } else if(currentRound===2){
      doorFB.style.color="green";
      doorFB.textContent="Chúc mừng! Bạn đã mở cửa cuối cùng!";
    }
  } else {
    doorFB.style.color="red";
    doorFB.textContent="Bạn còn câu trả lời sai. Màn chơi sẽ được xáo trộn và bắt đầu lại!";
    wrongs.forEach(p=>attempts[p.id]=false);
    wrongs.forEach(p=>locked[p.id]=false);
    puzzles = shuffleArray(puzzles);
    renderPuzzles();
  }
});

window.addEventListener("load", renderPuzzles);
