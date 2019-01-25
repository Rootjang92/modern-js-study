"use strict";
var state = Object.create(null); // Model : 생명 게임의 상태를 저장
var view = Object.create(null); // View : 상태를 그래픽으로 표시
var controls = Object.create(null); // Control : 컨트롤러 객체

// 문서를 읽어드리는 시점에 초기화

window.onload = function() {
  readFile("./patterns.json", function(jsonObj, error) {
    if (error) { // 파일을 읽을 수 없으면 메뉴 생성을 하지 않는다.
      delete controls.pattern;
    } else {
      state.patterns = jsonObj;
    }
    // body 요소 안에 생명 게임의 각 컨트롤러, 뷰를 생성하여 배치한다.
    createLifeGame(document.body, 78, 60, 780, 600);
  });
};

// 파일을 읽어드리는 함수

function readFile(filename, callback) {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (req.readyState == 4) {
      if (req.status == 200) {
        callback(req.response, false /* no error */);
      }
      else {
        callback(null, true /* error */);
      }
    }
  };
  req.open("GET", filename, true);
  req.responseType = "json";
  req.send(null);
}

// 생명 게임 시뮬레이터 생성
function createLifeGame(parent, nx, ny, width, height) {
  // title
  var title = elt("h1", {class: "title"}, "Life Game");
  // view 객체 생성
  var viewpanel = view.create(nx, ny, width, height);
  // state 객체 초기화
  state.create(nx, ny);
  // controls 객체에서 toolbar 요소 생성
  var toolbar = elt("div", {class: "toolbar"});
  for (let name in controls) {
    toolbar.appendChild(controls[name](state));
  }
  // toolbar 요소와 viewpanel 요소를 지정한 요소의 자식요소로 삽입한다.
  parent.appendChild(elt("div", null ,title, toolbar, viewpanel));
}

// state 객체 정의, clickview 이벤트 등록

state.create = function(nx, ny) {
  // 격자 크기
  state.nx = nx;
  state.ny = ny;
  // 셀의 상태를 저장하는 2차원 배열
  state.cells = new Array(ny);
  for (var ix = 0; ix < nx; ix++) {
    state.cells[ix] = new Array(ny);
    for (var iy = 0; iy < ny; iy++) {
      state.cells[ix][iy] = 0;
    }
  }

  // clickview 이벤트 처리
  document.addEventListener('clickview', function(e) {
    state.setLife(e.detail.ix, e.detail.iy, e.detail.life);
  }, false);
  // changeCell 이벤트 객체와 changeGeneration 이벤트 객체 생성
  state.changeCellEvent = document.createEvent("HTMLEvents");
  state.changeGenerationEvent = document.createEvent("HTMLEvents");
  // generation을 추가하고 0으로 설정
  state.generation = 0;
  state.tellGenerationChange(0);
  // 애니메이션 상태 저장
  state.playing = false; // 애니메이션이 실행중인지에 대한 논리값
  state.timer = null; // 타이머
}

// 셀의 상태가 바뀌었을 때
state.tellCellChange = function(ix, iy, life) {
  state.changeCellEvent.initEvent("changeCell", false, false);
  state.changeCellEvent.detail = {ix: ix, iy: iy, life: life};
  document.dispatchEvent(state.changeCellEvent);
}

// changeGeneration

state.tellGenerationChange = function(generation) {
  state.changeGenerationEvent.initEvent("changegeneration", false, false);
  state.changeGenerationEvent.detail = { generation: generation };
  document.dispatchEvent(state.changeGenerationEvent);
}

// 셀 주변 생물의 마리 수. (격자의 윗부분, 아랫부분, 왼쪽, 오른쪽 부분이 연결되는 주기적인 경계 조건)

state.getSumAround = function(ix, iy) {
  var dx = [ 0,1,1,1,0,-1,-1,-1];
  var dy = [ 1,1,0,-1,-1,-1,0,1];
  // 주기적인 경계 조건
  for (var k = 0, sum = 0; k<dx.length; k++) {
    if (state.cells[(ix+dx[k]+state.nx)%state.nx][(iy+dy[k]+state.ny)%state.ny]) {
      sum++;
    }
  }
  return sum;
};

// 생물변화에 따른 상태 변경 메서드
/*
1. 인버한 셀에 사는 생물의 합계가 한 마리 이하면 고립된 상태로 그 셀에 있는 생물은 죽는다.
2. 인접한 셀에 사는 생물의 합계가 두 마리면 그 셀은 바뀌지 않는다.
3. 인접한 셀에 사는 생물의 합계가 세 마리일 때, 그 셀에 생물이 없으면 새로운 생물이 탄생하고 생물이 이미 있다면 다음 세대에도 살아남는다.
4. 인버한 셀에 사는 생물의 합계가 네 마리 이상이면 너무 복잡한 상태이기 때문에 그 셀의 생물은 죽는다.
*/

state.update = function() {
  // 상태를 바꾸지 않고 전체 셀을 검사. 그리고 변경할 셀을 changeCell 배열에 담는다.
  var changedCell = [];
  for (var ix = 0; ix < state.nx; ix++) {
    for(var iy = 0; iy < state.ny; iy++) {
      var sum = state.getSumAround(ix,iy);
      if (sum <= 1 || sum >= 4) { // 죽음
        if (state.cells[ix][iy]) {
          changedCell.push({x:ix, y:iy});
          // 셀에 상태 변경 요청
          state.tellCellChange(iy, iy, 0);
        }
      } else if (sum == 3) {
        if (!state.cells[ix][iy]) {
          changedCell.push({x: ix, y: iy});
          // 셀에 상태 변경 요청
          state.tellCellChange(ix, iy, 1);
        }
      }
    }
  }
  // 전체 셀의 상태를 확인하고 셀의 상태를 변경한다.(배타적 논리합으로 0 -> 1, 1->0)
  for(var i = 0; i < changedCell.length; i++) {
    state.cells[changedCell[i].x][changedCell[i].y] ^= 1;
  }
  // 다음 세대로 교체하고 세대 표시의 변경 요청
  state.tellGenerationChange(state.generation++);
};

// 셀의 상태 설정
// setLife 메서드는 셀 값에 생물의 생사 여부를 기록한다. life = 0이면 죽음, 1이면 생존, 2는 반전.

state.setLife = function(ix, iy, life) {
  if (life == 2) { // 생물의 삶과 죽음을 반대로 설정한다.
    state.cells[ix][iy] ^= 1;
    state.tellCellChange(ix, iy, state.cells[ix][iy]);
  } else { // 지정한 life 값으로 덮어쓰기.
    if (state.cells[ix][iy] != life) {
      state.cells[ix][iy] = life;
      state.tellCellChange(ix, iy, life);
    }
  }
};

// 모든 셀을 지우기.

state.clearAllCell = function() {
  // 모든 셀의 상태 값을 0으로 설정한다.
  for(var ix=0; ix<state.nx; ix++) {
    for(var iy=0; iy<state.ny; iy++) {
      state.setLife(ix, iy, 0);
    }
  }
  state.tellGenerationChange(state.generation = 0);
};


// view 객체 정의
/*
 view.layer[0]에는 생물, view.layer[1]에는 격자선. 그래서 절대 위치에 겹쳐서 표시된다.
*/

view.create = function(nx, ny, width, height) {
  // layer canvas 요소
  view.layer = [];
  // 생물 표시 레이어
  view.layer[0] = elt("canvas", {id: "rayer0", width: width, height: height});
  // 격자 선
  view.layer[1] = elt("canvas", {id: "rayer1", width: width, height: height});
  // 격자 크기, 셀 크기, 생물 표시 원 반지름
  view.nx = nx;
  view.ny = ny;
  view.cellWidth = view.layer[0].width/nx; // 셀 너비
  view.cellHeight = view.layer[0].height/ny; // 셀 높이
  // 생물 원 반지름.
  view.markRadius = (Math.min(view.cellWidth, view.cellHeight)/2.5+0.5) | 0;
  // canvas 렌더링 컨텍스트
  if(view.ctx) delete view.ctx;
  view.ctx = [];
  for(var i = 0; i<view.layer.length; i++) {
    view.ctx.push(view.layer[i].getContext("2d"));
  }
  // 렌더링 매개변수의 초기 설정
  view.backColor = "forestgreen";
  view.markColor = "white";
  view.strokeStyle = "black";
  view.lineWidth = 0.2;
  // 격자 그리기
  view.drawLattice();
  // 세대 표시 요소 생성
  view.generation = elt("span", { id: "generation"});
  view.statuspanel = elt("div", { class: "status"}, "세대 : ", view.generation);

  // clickview 이벤트 발생 시 사용할 이벤트 객체 생성
  view.clickEvent = document.createEvent("HTMLEvents");
  // layer[1]를 클릭했을 때 동작하는 이벤트
  view.layer[1].addEventListener("click", function(e) {
    var ix = Math.floor(e.offsetX / view.cellWidth); // 셀 x 방향 번호
    var iy = Math.floor(e.offsetY / view.cellHeight); // 셀 y 방향 번호
    // view (ix, iy) 지점을 클릭했음을 clickview 이벤트로 알린다.
    view.clickEvent.initEvent("clickview", false, false);
    view.clickEvent.detail = {ix: ix, iy: iy, life: 2};
    document.dispatchEvent(view.clickEvent);
  }, false);
  // changeCell 이벤트 리스터 등록 : state에서 받은 이벤트로 셀을 다시 그리기.
  document.addEventListener("changecell", function(e) {
    view.drawCell(e.detail.ix, e.detail.iy, edetail.life);
  }, false);
  // changeGeneration 이벤트 리스터 : state에서 받은 이벤트로 세대 표시를 갱신.
  document.addEventListener("changeGeneration", function(e) {
    view.showGeneration(e.detail.generation);
  }, false);

  // viewpanel 요소의 객체 반환.
  return elt(
    "div", {class: "viewpanel"}, view.layer[0], view.layer[1], view.statuspanel
  );
};

// 메서드 격자 선, nx >= 150 이면 그리지 않는다.

view.drawLattice = function() {
  // 각 레이어의 canvas를 초기화
  for(var i = 0; i < view.layer.length; i++) {
    view.layer[i].width = view.layer[i].width;
  }
  // 레이어 -1에 격자를 그린다. 격자는 nx >= 150이면 그리지 않는다.
  if (view.nx < 150) {
    var c = view.ctx[1];
    c.lineWidth = view.lineWidth;
    c.strokeStyle = view.strokeStyle
    for(var ix=0; ix<=view.nx; ix++) {
      c.beginPath();
        c.moveTo(ix*view.cellWidth, 0);
        c.lineTo(ix*view.cellWidth, view.nx*view.cellHeight);
        c.stroke();
    }
  }
  // 레이어 0에 배경색 칠하기
  c = view.ctx[0];
  c.fillStyle = view.backColor;
  c.fillRect(0,0,view.layer[0].width, view.layer[0].height);
};

// 셀 위에 생물 그리기.

view.drawCell = function(ix, iy, life) {
  var c = view.ctx[0];
  c.beginPath();
  if (life) {
    var x = (ix+0.5)*view.cellWidth;
    var y = (iy+0.5)*view.cellHeight;
    var r = view.markRadius;
    c.fillStyle = view.markColor;
    c.arc(x,y,r,0,Math.PI*2,true);
    c.fill();
  } else {
    var x = ix*view.cellWidth;
    var y = iy*view.cellHeight;
    c.fillStlye = view.backColor;
    c.fillRect(x,y,view.cellWidth,view.cellHeight);
  }
};

// 현재 세대 표시
view.showGeneration = function(generation) {
  view.generation.innerHTML = generation;
};

// controls 객체 정의
/*
모든 메서드는 state 객체를 인수로 받는다. toolbar 도구에 자동으로 등록.
HTML 요소 객체를 DOM으로 생성하고 초기화하고 반환한다.
*/


// 연속재생

controls.play = function(state) {
  if (!state.timeInterval) state.timeInterval = 300;
  var input = elt("input", {type: "button", value: "연속 재생"});
  input.addEventListener('click', function(e) {
    if (!state.playing) {
      state.timer = setInterval(state.update, state.timeInterval);
      state.playing = true;
    }
  });
  return input;
};

// 재생 속도 설정

controls.changeTimeInterval = function(state) {
  var select = elt("select");
  var options = [
    { name: "초고속(20ms)", value: 20},
    { name: "고속(100ms)", value: 100},
    { name: "표준(300ms)", value: 300},
    { name: "저속(600ms)", value: 600}
  ];
  for (var i =0; i<options.length; i++) {
    var option = elt("option", null, options[i].name);
    select.appendChild(option);
  }
  select.selectedIndex = 2;
  select.addEventListener('change', function(e) {
    state.timeInterval = options[select.selectedIndex].value;
    if (state.playing) {
      clearInterval(state.timer);
      state.timer = setInterval(state.update,state.timeInterval);
    }
  });
  return select;
};

// 정지

controls.stop = function(state) {
  var input = elt("input", { type: "button", value: "정지"});
  input.addEventListener('click', function(e) {
    if (state.playing) {
      clearInterval(state.timer);
      state.playing = false;
    }
  });
  return input;
};

// 다음 버튼

controls.step = function(state) {
  var input = elt("input", { type: "button", value: "다음"});
  input.addEventListener('click', function(e) {
    clearInterval(state.timer); state.playing = false;
    state.update();
  });
  return input;
};

// 패턴 선택

controls.pattern = function(state) {
  var select = elt("select");
  select.appendChild(elt("option", null, "패턴 선택"));
  for(var i = 0; i<state.patterns.length; i++) {
    select.appendChild(elt("option", null,state.patterns[i].name));
  }
  select.selectedIndex = 0;
  select.addEventListener('change', function(e) {
    clearInterval(state.timer); state.playing = false;
    if (select.selectedIndex != 0) {
      placePattern(state.patterns[select.selectedIndex - 1]);
    }
    select.selectedIndex = 0;
  });
  return select;
  function placePattern(pattern) {
    var array = pattern.points;
    // x,y 최소, 최대값
    var max = [0,0];
    var min = [state.nx-1, state.ny-1];
    for (var i = 0; i<array.length; i++) {
      for (var d = 0; d < 2; d++) {
        if(array[i][d]>max[d]) max[d] = array[i][d];
        if(array[i][d]<min[d]) min[d] = array[i][d];
      }
    }

    // 모든 셀 삭제
    state.clearAllCell();
    // canvas 중심에 패턴 배치
    for (var i = 0; i<array.length; i++) {
      var ix = array[i][0]+Math.floor((state.ny-min[0]-max[0])/2);
      var iy = array[i][1]+Math.floor((state.ny-min[1]-max[1])/2);
      state.setLife(ix,iy,1);
    }
    state.tellGenerationChange(state.generation = 0);
  }
};

// 모두 삭제(모든 상태 초기화)
controls.clear = function(state) {
  var input = elt("input", { type: "button", value: "모두 삭제"});
  input.addEventListener('click', function(e) {
    clearInterval(state.timer); state.playing = false;
    state.clearAllCell();
  });
  return input;
}