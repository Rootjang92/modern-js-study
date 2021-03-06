/*
화면을 구성하는 요소를 생성하고 요소에 이벤트 리스너를 등록
*/

function createPainter(parent, width, height) {
  // title
  var title = elt("h2", null, "Simpla Painter");
  // canvas 요소와 렌더링 컨텍스트 가져오기
  var [canvas, ctx] = createCanvas(width, height);
  // 도구 막대 : controls 객체의 프로퍼티 순회
  var toolbar = elt("div", null);
  for (var name in controls) {
    toolbar.appendChild(controls[name](ctx));
  }

  toolbar.style.fontSize = "small";
  toolbar.style.marginBottom = "3px";

  // toolbar 요소와 canvas 요소를 지정한 parent의 자식 요소로 삽입한다.
  parent.appendChild(elt("div", null, title, toolbar, canvas));
}

function createCanvas(canvasWidth, canvasHeight) {
  var canvas = elt("canvas", { width: canvasWidth, height: canvasHeight });
  var ctx = canvas.getContext("2d");
  canvas.style.border = "1px solid gray";
  canvas.style.cursor = "pointer";
  // 그리기 도구를 mousedown 이벤트의 이벤트 리스너로 등록
  canvas.addEventListener("mousedown", function(e) {
    // Firefox 대책 : 색상을 선택하면, change 이벤트를 강제로 발생시킨다
		var event = document.createEvent("HTMLEvents");
		event.initEvent("change", false, true);
		colorInput.dispatchEvent(event);
		// 선택한 그리기 도구를 초기화
		paintTools[paintTool](e,ctx);
  }, false);
  canvas.addEventListener("dragover", function(e) {
    e.preventDefault();
  }, false);
  canvas.addEventListener("drop", function(e) {
    var files = e.dataTransfer.files;
    if (files[0].type.substring(0, 6) !== "image/") return;
    loadImageURL(ctx, URL.createObjectURL(files[0]));
    e.preventDefault();
  }, false);
  return [canvas, ctx];
}

/*
유틸리티
*/

// element의 왼쪽 위 모서리에서 마우스의 상대 위치 가져오기

function relativePosition(event, element) {
  var rect = element.getBoundingClientRect();
  return { x: Math.floor(event.clientX - rect.left),
           y: Math.floor(event.clientY - rect.top) };
}

/*
그리기 도구
각 메서드는 controls.painter를 통해 자동으로 도구 선택 메뉴에 추가.
메뉴에서 선택한 도구는 변수 paintTool에 저장되어 그림 그릴 때 사용
*/

var paintTool; // 선택된 그리기 도구를 담는 변수
var paintTools = Object.create(null); // 그리기 도구 객체

// brush
paintTools.brush = function(e, ctx) {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  // Canvas 화면을 img에 저장.
  var img = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  // canvas 요소에 대한 마우스 포인터 상대위치
  var p = relativePosition(e, ctx.canvas);
  ctx.beginPath();
  ctx.moveTo(p.x, p.y);
  // 드래그 이벤트 리스터 등록

  setDragListners(ctx, img, function(q) {
    ctx.lineTo(q.x, q.y); // 경로 추가
    ctx.stroke(); // 경로 그리기
  });
};

// line(선그리기)

paintTools.line = function(e, ctx) {
  // 초기화
  ctx.lineCap = "round";
  // Canvas 화면 img에 저장
  var img = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  var p = relativePosition(e, ctx.canvas);

  setDragListners(ctx, img, function(q) {
    ctx.beginPath();
    ctx.moveTO(p.x, p.y); ctx.lineTo(q.x, q.y);
    ctx.stroke();
  });
};

// circle

paintTools.circle = function(e, ctx) {
  var img = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  var p = relativePosition(e, ctx.canvas);
  setDragListners(ctx, img, function(q) {
    var dx = q.x - p.x;
    var dy = q.y - p.y;
    var r = Math.sqrt(dx*dx+dy*dy);
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, 2*Math.PI, false);
    ctx.stroke();
  });
};

// circleFill : 채워진 원

paintTools.circleFill = function(e, ctx) {
  var img = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  var p = relativePosition(e, ctx.canvas);
  setDragListners(ctx, img, function(q) {
    var dx = q.x - p.x;
    var dy = q.y - p.y;
    var r = Math.sqrt(dx*dx+dy*dy);
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, 2*Math.PI, false);
    ctx.fill();
  });
};

/*
 그리기 도구 유틸리티
*/

// 마우스 드래그할 때 이벤트 리스너 등록

function setDragListners(ctx, img, draw) {
  var mousemoveEventListener = function(e) {
    ctx.putImageData(img, 0, 0);
    // 지정한 그리기 함수 draw로 마우스 위치까지 그리기
    draw(relativePosition(e, ctx.canvas));
  };

  document.addEventListener('mousemove', mousemoveEventListener, false);
  // mouseup 이벤트 리스터
  document.addEventListener('mouseup', function(e) {
    ctx.putImageData(img, 0, 0);

    draw(relativePosition(e, ctx.canvas));

    document.removeEventListener("mousemove", mousemoveEventListener, false);
    document.removeEventListener('mouseup', arguments.callee, false);
  }, false);
}

/*
컨트롤러
각종 설정 변경
*/

var controls = Object.create(null);
var colorInput;

// 그리기 도구 선택
controls.painter = function(ctx) {
  var DEFAULT_TOOL = 0;
  var select = elt("select", null);
  var label = elt("label", null, "그리기 도구 : ", select);
  for (var name in paintTools) {
    select.appendChild(elt("option", {value: name}, name));
  }
  select.selectedIndex = DEFAULT_TOOL;
  paintTool = select.children[DEFAULT_TOOL].value;
  select.addEventListener("change", function(e) {
    paintTool = this.children[this.selectedIndex].value;
  }, false);
  return label;
};

// 색상 선택(색과 채우기 모두, 분리해서 별도의 컨트롤러로 만들기)
controls.color = function(ctx) {
  var input = colorInput = elt("input", {type: "color"});
  var label = elt("label", null, "색: ", input);
  input.addEventListener("change", function(e) {
    ctx.strokeStyle = this.value;
    ctx.fillStyle = this.value;
  }, false);
  return label;
};

// 브러쉬 굵기

controls.brushsize = function(ctx) {
  var size = [1,2,3,4,5,6,8,10,12,14,16,20,24,28];
  var select = elt("select", null);
  for (var i = 0; i<size.length; i++) {
    select.appendChild(elt("option", {value: size[i].toString()}, size[i].toString()));
  }
  select.selectedIndex = 2;
  ctx.lineWidth = size[select.selectedIndex];
  var label = elt("label", null, " 선의 너비 : ", select);
  select.addEventListener('change', function(e) {
    ctx.lineWidth = this.value;
  }, false);
  return label;
}

// 투명도 선택

controls.alpha = function(e) {
  var input = elt("input", {type:"number", min:"0", max:"1", step:"0.05", value: "1"});
  var label = elt("label", null, " 투명도 :", input);
  input.addEventListener('change', function(ctx) {
    ctx.globalAlpha = this.value;
  }, false);
  return label;
}

// 이미지 필터링

var filterTools = Object.create(null);

controls.filter = function(ctx) {
  var DEFAULT_FILTER = 0;
  var select = elt("select", null);
  var label = elt("label", null, " ", select);
  select.appendChild(elt("option", {value: "filter"}, "필터"));
  for(var name in filterTools) {
    select.appendChild(elt("option", {value: name}, name));
  }
  select.selectedIndex = DEFAULT_FILTER;
  select.addEventListener("change", function(e) {
    var filterTool = this.children[this.selectedIndex].value;
    var inputImage = ctx.getImageData(0,0,ctx.canvas.width, ctx.canvas.height);
    var outputImage = filterTools[filterTool](inputImage);
    ctx.putImageData(outputImage,0,0);
    select.selectedIndex = DEFAULT_FILTER;
  }, false);
  return label;
}

// 필터링 도구 메서드 추가.
// 2n+1차 정방 행렬인 Weight, Weight를 가중치로 잡아 각 픽셀 주변의 가중 평균을 구함.
// keepBrightness는 밝기 유지 여부.

function weightAverageFilter(image, n, Weight, keepBrightness, offset) {
  var width = image.width, height = image.height;
  var outputImage = new ImageData(width, height);
  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      var iR = 4*(width*y+x);
      for (var i = 0; i < 3; i++) {
        var average = 0, weightSum = 0;
        for(ix = -n; ix <= n; ix++) {
          var xp = x + ix;
          if(xp<0 || xp>=width) continue;
          for(iy = -n; iy<=n; iy++) {
            var yp = y + iy;
            if(yp<0 || yp>=height) continue;
            var w = Weight[iy+n][ix+n];
            weightSum += w;
            average += w*image.data[4*(width*yp+xp)+i];
          }
        }
        if(keepBrightness) {
          average /= weightSum;
        }
        outputImage.data[iR+i] = average + offset;
      }
      outputImage.data[iR + 3] = image.data[iR+3];
    }
  }
  return outputImage;
}

// 필터 도구 추가.

filterTools.blur = function(inputImage) {
  var size = 2;
  var W = [];
  for(var i = 0; i<=2*size; i++) {
    W[i] = [];
    for(var j = 0; j<=2*size; j++) {
      W[i][j] = 1;
    }
  }
  return weightAverageFilter(inputImage, size, W, true, 0);
};

// 샤프
filterTools.sharp = function(inputImage) {
  var W = [
    [0,-1,0],
    [-1,5,-1],
    [0,-1,0]
  ];
  return weightAverageFilter(inputImage, 1, W, false, 0);
};

// 엠보싱
filterTools.emboss = function(inputImage) {
  var W = [
    [-1,0,0],
    [0,0,0],
    [0,0,1]
  ];
  return weightAverageFilter(inputImage, 1, W, false, 128);
};

// 저장기능

controls.save = function(ctx) {
  var input = elt("input", {type: "button", value: "저장"});
  var label = elt("lbael", null, " ", input);
  input.addEventListener("click", function(e) {
    var dataURL = ctx.canvas.toDataURL();
    open(dataURL, "save");
  }, false);
  return label;
}


// 파일 입력 컨트롤

controls.file = function(ctx) {
  var input = elt("input", {type: "file"});
  var label = elt("label", null, " ", input);
  input.addEventListener("change", function(e) {
    if (input.files.length == 0 ) return;
    var reader = new FileReader();
    reader.onload = function() {
      loadImageURL(ctx, reader.result);
    };
    reader.readAsDataURL(input.files[0]);
  }, false);
  return label;
};

// ur을 ctx에 그린다.(그림이 Canvas 경계선에 내접하도록)

function loadImageURL(ctx, url) {
  var image = document.createElement("img");
  image.onload = function() {
    var factor = Math.min(ctx.canvas.width/this.width, ctx.canvas.height/this.height);
    var wshift = (ctx.canvas.width - factor*this.width)/2;
    var hshift = (ctx.canvas.height - factor*this.height)/2;
    var savedColor = ctx.fillStyle;
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
    ctx.drawImage(image, 0, 0,
      this.width, this.height, wshift, hshift,
      this.width*factor, this.height*factor
    );
    ctx.fillStyle = savedColor;
  };
  image.scr = url;
}


