let faceSize = 0;
const images = {
  2: "imgs/AxelW.jpg",
  4: "imgs/MelvinB.jpg",
  8: "imgs/AlecZ.jpg",
  16: "imgs/WiggoT.jpg",
  32: "imgs/XanderA.jpg",
  64: "imgs/WilliamH.jpg",
  128: "imgs/WilliamB.jpg",
  256: "imgs/NilsW.png",
  512: "imgs/LukasA.jpg",
  1024: "imgs/SaraD.jpg",
  2048: "imgs/AdrianT.jpg"
};

let fg = document.getElementsByClassName("foreground-grid")[0];
let highlighter = document.getElementsByClassName("highlighter")[0];

let grid = [];

//Initalizing grid
let bg = document.getElementsByClassName("background-grid")[0];
for (let i = 0; i < 16; i++) {
  let div = document.createElement("div");
  div.className = "background-grid-item";
  bg.appendChild(div);
}

faceSize = bg.firstChild.getBoundingClientRect().width;

//Facewall
let fw = document.getElementsByClassName("face-wall")[0];
for (let i in images) {
  let img = images[i];

  let holder = document.createElement("div");
  holder.className = "face-wall-holder";

  let image = document.createElement("img");
  image.src = img;
  holder.appendChild(image);

  let text = document.createElement("h1");
  text.innerText = i;
  holder.appendChild(text);

  fw.appendChild(holder);
}

function spawnBlock(x, y) {
  if (x === undefined || y === undefined) {
    let available = [];
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if (grid[x + y * 4] === undefined) {
          available.push({ x, y });
        }
      }
    }

    let temp = available[Math.floor(Math.random() * available.length)];
    x = temp.x;
    y = temp.y;
  }

  let n = 2;

  let face = document.createElement("img");
  face.className = "face";
  face.src = images[n];
  face.style.width = faceSize + "px";
  face.style.left = x * (faceSize + 8) + "px";
  face.style.top = y * (faceSize + 8) + "px";
  face.style.scale = "0";
  fg.appendChild(face);
  face.onload = (e) => {
    face.style.scale = "1";
  };
  let data = { val: n, x, y, elem: face };

  face.addEventListener("mousemove", (e) => {
    let box = face.getBoundingClientRect();
    highlighter.style.display = "flex";
    highlighter.style.top = box.y + "px";
    highlighter.style.left = box.x + "px";
    highlighter.style.width = box.width + "px";
    highlighter.style.height = box.height + "px";
    highlighter.innerText = data.val;
  });
  face.addEventListener("mouseleave", (e) => {
    highlighter.style.display = "none";
  });

  face.ondragstart = function () {
    return false;
  };

  grid[x + y * 4] = data;
}

function arrCopy(arr) {
  let n = [];
  for (let i = 0; i < arr.length; i++) {
    n[i] = arr[i];
  }
  return n;
}
function arrComp(a, b) {
  let same = true;
  for (let i = 0; i < a.length; i++) {
    if (b[i] !== a[i]) {
      same = false;
    }
  }
  return same;
}

spawnBlock();
spawnBlock();

document.addEventListener("keydown", (e) => {
  let dx =
    (e.key === "ArrowRight" || e.key === "d") -
    (e.key === "ArrowLeft" || e.key === "a");

  let dy =
    (e.key === "ArrowDown" || e.key === "s") -
    (e.key === "ArrowUp" || e.key === "w");

  let og = arrCopy(grid);

  if (dx || dy) {
    e.preventDefault();
    let delta = 0;
    let ver = false;

    if (dx === -1) {
      delta = -1;
    }
    if (dx === 1) {
      delta = 1;
    }
    if (dy === -1) {
      delta = -4;
      ver = true;
    }
    if (dy === 1) {
      delta = 4;
      ver = true;
    }

    let mx = ver ? 0 : delta;
    let my = !ver ? 0 : delta / 4;

    let sGrid = arrCopy(grid).sort((a, b) => {
      let da = ver ? a.y : a.x;
      let db = ver ? b.y : b.x;

      let cond = (da > db) - 0.5;
      if (delta < 0) return cond;
      return cond * -1;
    });

    grid = [];

    console.log("----------------------");
    for (let i = 0; i < sGrid.length; i++) {
      let face = sGrid[i];
      if (!face) continue;
      console.log(face.x, face.y);
      while (true) {
        let index = face.x + face.y * 4;
        face.x += mx;
        face.y += my;

        if (
          face.x < 0 ||
          face.x >= 4 ||
          face.y < 0 ||
          face.y >= 4 ||
          grid[face.x + face.y * 4]
        ) {
          if (
            grid[face.x + face.y * 4]?.val === face.val &&
            grid[face.x + face.y * 4] !== face
          ) {
            let temp = grid[face.x + face.y * 4];
            grid[face.x + face.y * 4] = undefined;
            face.val *= 2;
            const transitionend = (e) => {
              temp.elem.remove();
              face.elem.src = images[face.val];
              face.elem.removeEventListener("transitionend", transitionend);
            };
            face.elem.addEventListener("transitionend", transitionend);
          } else {
            face.x -= mx;
            face.y -= my;
          }

          face.elem.style.left = face.x * (faceSize + 8) + "px";
          face.elem.style.top = face.y * (faceSize + 8) + "px";

          grid[face.x + face.y * 4] = face;
          break;
        }
      }
    }
    let full = true;
    for (let i = 0; i < grid.length; i++) {
      if(grid[i] === undefined)
         full = false;
    }
    if (full) {
      wall("You lose bit ch");
    }
    if ((dx || dy) && !arrComp(og, grid)) {
      spawnBlock();
    }
  }
});


function wall(text) {
  let wall = document.createElement("div");
  wall.className = "background-grid";
  wall.style.backgroundColor = "rgb(0 0 0 / 0.7)";
  wall.style.color = "white";
  wall.style.fontSize = "3rem";
  wall.innerText = text;
  wall.style.display = "flex";
  wall.style.alignItems = "center";
  wall.style.justifyContent = "center";
  wall.style.flexDirection = "column";
  let btn = document.createElement("button");
  btn.innerText = "Restart";
  btn.style.width = "12rem";
  btn.style.height = "4rem";
  btn.style.fontSize = "3rem";
  btn.style.color = "white";
  btn.style.backgroundColor = "var(--bg)";
  btn.style.borderRadius = "1rem";
  btn.onclick = e => {
      wall.remove();
      
  }
  wall.appendChild(btn);
  document.body.appendChild(wall);
}
