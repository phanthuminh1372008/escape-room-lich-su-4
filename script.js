let currentRound = 1;
let puzzles = [];
let attempts = {};
let locked = {};
let score = 0;
let torch = 0;

function setupRound(round=1){
    currentRound = round;
    attempts = {};
    locked = {};
    if(round === 1){
        puzzles = [
            {id:1,type:"video",content:"https://www.youtube.com/embed/ATWuXsE9S7E",correct:true,feedbackCorrect:"Chính xác! Video đúng.",feedbackWrong:"Sai! Nguyễn Huệ chính là Quang Trung, lãnh đạo quân Tây Sơn chiến thắng quân Thanh 1789."},
            {id:2,type:"image",content:"https://upload.wikimedia.org/wikipedia/commons/6/65/Nguyen_Hue_Emperor.jpg",correct:true,feedbackCorrect:"Chính xác! Poster đúng.",feedbackWrong:"Sai! Đây là hình Nguyễn Huệ, tức Quang Trung."},
            {id:3,type:"fill",question:"Quang Trung đại phá ...... quân Thanh",answer:"20 vạn",feedbackCorrect:"Chúc mừng! Bạn nhận được 1 ngọn đuốc.",feedbackWrong:"Sai rồi! Đáp án chính xác: 20 vạn",item:true},
            {id:4,type:"findError",question:"Quang Trung đại phá 20 vạn quân Minh",options:["Quang Trung","20","vạn","quân Minh"],correct:"quân Minh",feedbackCorrect:"Chính xác! Đây là lỗi sai.",feedbackWrong:"Sai! Hãy chọn từ đúng bị lỗi."}
        ];
    } else if(round === 2){
        puzzles = [
            {id:1,type:"fill",question:"Round 2: Quang Trung đã chiến thắng bao nhiêu quân?",answer:"20 vạn",feedbackCorrect:"Chính xác! Bạn có ngọn đuốc hỗ trợ.",feedbackWrong:"Sai rồi! Đáp án đúng: 20 vạn",item:true},
            {id:2,type:"findError",question:"Round 2: Quân lính Quang Trung có số lượng đúng?",options:["10 vạn","20 vạn","15 vạn"],correct:"20 vạn",feedbackCorrect:"Chính xác!",feedbackWrong:"Sai! Hãy chọn số lượng đúng."}
        ];
        if(torch>0){
            puzzles[0].question += " (Bạn có " + torch + " ngọn đuốc hỗ trợ)";
        }
    }
    renderPuzzles();
    updateStatus();
}

function renderPuzzles(){
    const container = document.getElementById("roundContainer");
    container.innerHTML="";
    puzzles.forEach(p=>{
        let html=`<div class="puzzle" id="puzzle${p.id}"><h2>Câu ${p.id}</h2>`;
        if(p.type==="video"){
            html+=`<div class="video-wrap"><iframe src="${p.content}" allowfullscreen></iframe></div>
            <button onclick="checkChoice(${p.id},true)">Đúng</button>
            <button onclick="checkChoice(${p.id},false)">Sai</button>`;
        } else if(p.type==="image"){
            html+=`<img src="${p.content}" class="poster">
            <button onclick="checkChoice(${p.id},true)">Đúng</button>
            <button onclick="checkChoice(${p.id},false)">Sai</button>`;
        } else if(p.type==="fill"){
            html+=`<p>${p.question.replace("......",`<input type="text" id="input${p.id}">`)}</p>
            <button onclick="checkFill(${p.id})">Chốt đáp án</button>`;
        } else if(p.type==="findError"){
            html+=`<p>`;
            p.options.forEach(opt=>{
                html+=`<span class="underline" onclick="checkFindError('${p.id}','${opt}')">${opt}</span>`;
            });
            html+=`</p>`;
        }
        html+=`<p id="feedback${p.id}" class="feedback"></p></div>`;
        container.innerHTML+=html;
    });
}

function checkChoice(id,answer){
    if(locked[id]) return;
    let p=puzzles.find(x=>x.id===id);
    let fb=document.getElementById("feedback"+id);
    if(answer===p.correct){
        attempts[id]=true;
        fb.style.color="green";
        fb.textContent=p.feedbackCorrect;
    } else {
        attempts[id]=false;
        locked[id]=true;
        fb.style.color="red";
        fb.textContent=p.feedbackWrong;
    }
    updateStatus();
}

function checkFill(id){
    if(locked[id]) return;
    let p=puzzles.find(x=>x.id===id);
    let input=document.getElementById("input"+id).value.trim();
    let fb=document.getElementById("feedback"+id);
    if(input.toLowerCase()===p.answer.toLowerCase()){
        attempts[id]=true;
        fb.style.color="green";
        fb.textContent=p.feedbackCorrect;
        if(p.item) torch++;
    } else{
        attempts[id]=false;
        locked[id]=true;
        fb.style.color="red";
        fb.textContent=p.feedbackWrong;
    }
    updateStatus();
}

function checkFindError(id,opt){
    if(locked[id]) return;
    let p=puzzles.find(x=>x.id==id);
    let fb=document.getElementById("feedback"+id);
    if(opt===p.correct){
        attempts[id]=true;
        fb.style.color="green";
        fb.textContent=p.feedbackCorrect;
    } else{
        attempts[id]=false;
        locked[id]=true;
        fb.style.color="red";
        fb.textContent=p.feedbackWrong;
    }
    updateStatus();
}

function updateStatus(){
    const done=Object.values(attempts).filter(x=>x).length;
    document.getElementById("scoreDisplay").textContent="Điểm: "+done*10;
    document.getElementById("torchDisplay").textContent="Ngọn đuốc: "+torch;
}

document.getElementById("openDoor").addEventListener("click",()=>{
    const wrongs=puzzles.filter(p=>!attempts[p.id]);
    const doorFB=document.getElementById("doorFeedback");
    if(wrongs.length===0){
        if(currentRound===1){
            doorFB.style.color="green";
            doorFB.textContent="Chúc mừng! Bạn qua Round 2!";
            setupRound(2);
        } else {
            doorFB.style.color="green";
            doorFB.textContent="Chúc mừng! Bạn mở cửa thành công!";
        }
    } else {
        doorFB.style.color="red";
        doorFB.textContent="Bạn còn câu sai. Màn chơi sẽ xáo trộn và bắt đầu lại!";
        wrongs.forEach(p=>attempts[p.id]=false);
        wrongs.forEach(p=>locked[p.id]=false);
        puzzles = shuffleArray(puzzles);
        renderPuzzles();
    }
});

function shuffleArray(arr){
    for(let i=arr.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [arr[i],arr[j]]=[arr[j],arr[i]];
    }
    return arr;
}

window.addEventListener("load",()=>setupRound(1));
