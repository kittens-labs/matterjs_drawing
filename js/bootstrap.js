/*!
 * bootstrap.js 0.1 by @kittens-labs
 * https://kittens-labs.onrender.com
 * License MIT
 * 
 * The MIT License (MIT)
 * 
 * Copyright (c) Liam Brummitt and contributors.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
const clearBtn = document.querySelector('#clear-button');
const fitBtn = document.querySelector('#fit-button');
const startBtn = document.querySelector('#start-button');
window.oekakiLib= window.oekakiLib|| {};
let x;
let y;
let mousePressed = false;
simpleLineSize = 30;
positionList = null;
lineLength = 0;
drawCnt = 0;
canvas = document.querySelector('#drawing-area');
ctx = canvas.getContext('2d');
window.oekakiLib.canvas = canvas; 
window.oekakiLib.ctx = ctx; 
lineLength = 0;
tmp_x = 0;
tmp_y =0;
$(document).ready(function() { 
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', mouseup);
  canvas.addEventListener('mouseout', mouseup);
  canvas.addEventListener('touchstart', startDrawing);
  canvas.addEventListener('touchmove', draw);
  canvas.addEventListener('touchend', mouseup);
  canvas.addEventListener('touchcancel', mouseup);
  canvas.addEventListener('pointerout', mouseup);
  function initCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  isSP = false;
  function getRelativePos(e) {
        const rect = canvas.getBoundingClientRect();
        if (e.clientX !== undefined) {
          return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
          };
        }
        if (e.touches && e.touches.length > 0) {
          isSP = true;
          return {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top
          };
        }
        return null;
  }
  function distance(x1, y1, x2, y2) {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
  }
  function startDrawing(e) {
    pos = getRelativePos(e);
    canvasRect = canvas.getBoundingClientRect();
    x = pos.x;
    y = pos.y;
      mousePressed = true;
      if(positionList === null){
        positionList = [];
        positionList.push([drawCnt, x, y]);
      }else if(positionList != ''){
        drawCnt++;  window.oekakiLib.drawCnt = drawCnt;
      }
  }
  function draw(e) {
    if (mousePressed == false) return;
    pos = getRelativePos(e);
    x2 = pos.x;
    y2 = pos.y;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x2-1, y2-1);
    ctx.lineTo(x2+1, y2+1);
    ctx.lineTo(x2-1, y2+1);
    ctx.lineTo(x2+1, y2-1);
    ctx.stroke();
    x = x2;
    y = y2;
    window.oekakiLib.xx = x;
    window.oekakiLib.yy = y;
    if(lineLength == 0){
      if(positionList == null){
        mousePressed = false;
        return;
      }
      positionList.push([drawCnt, x, y]);
      window.oekakiLib.positionList = positionList;
      window.oekakiLib.positionListCnt = positionList.length;
      tmp_x = x;
      tmp_y = y;
    }else if(distance(tmp_x, tmp_y, x,y)>simpleLineSize){
      positionList.push([drawCnt, x, y]);
      window.oekakiLib.positionList = positionList;
      window.oekakiLib.positionListCnt = positionList.length;
      tmp_x = x;
      tmp_y = y;
    }
    window.oekakiLib.lineLength = lineLength;
    lineLength++;
  }
  function mouseup() {
    if(mousePressed == true){
      positionList.push([drawCnt, x, y]);
      lineLength = 0;
      if(positionList.length >= 3){
        processing();
      }
      positionList = [];
    }
    mousePressed = false;
  }
  clearBtn.addEventListener('click', () => {
    startAtOnce = false;
    mousePressed = false;
    window.oekakiLib.xx = 0;
    window.oekakiLib.yy = 0;
    window.oekakiLib.lineLength = 0;
    window.oekakiLib.positionListCnt = 0;
    window.oekakiLib.drawCnt = 0;
    window.oekakiLib.positionList = [];
    positionList = [];
    initCanvas();
    positionList = null;
    window.matterLib.Render.stop(window.matterLib.render);
    window.matterLib.World.clear(window.matterLib.ko_engine.world);
    window.matterLib.Engine.clear(window.matterLib.ko_engine);
    window.matterLib.initgame();
  });
  let startAtOnce = false;
	function processing(){
    var select = function(root, selector) {
            return Array.prototype.slice.call(root.querySelectorAll(selector));
    };
    simplePositions = [];

    function canvasToSimpleLine(){
      initCanvas();
      if (positionList === null){ return;};
      j=0;
      let  = [];
      for(i = 0; i < drawCnt+1; i++){
        simplePositions[i] = [];
        if(j < positionList.length-1){
          while(positionList[j][0] == i && positionList[j+1][0] == i){ 
            ctx.moveTo(positionList[j][1], positionList[j][2]);
            ctx.lineTo(positionList[j+1][1], positionList[j+1][2]);
            ctx.stroke();

            simplePositions[i].push({x:positionList[j][1], y:positionList[j][2]});
            j++;
            if((j+1) >= positionList.length){
              break;
            }
          }
        }
        j++;
      }
      initCanvas();
      drawCnt = 0;
    }
    canvasToSimpleLine();
    function simpleLineToSVG() {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      let xml = '<svg width="' + canvas.width + '" height="' + canvas.height + '" xmlns="http://www.w3.org/2000/svg">';
      for(let j = 0; j < simplePositions.length; j++){
        let positions = "";
        flg = false;
        for(let i = 0, k = simplePositions[j].length-1; i < simplePositions[j].length-1; i++, k--){  
          const x = simplePositions[j][i].x;
          const y = simplePositions[j][i].y;
          const nx = simplePositions[j][i+1].x;
          const ny = simplePositions[j][i+1].y;
          let plus = 2;
          positions+="M "+(x)+" "+(y)+" ";  
          positions+="L "+(nx)+" "+(ny)+" "; 
          positions+="L "+(nx+plus)+" "+(ny+plus)+" ";
          positions+="L "+(x+plus)+" "+(y+plus)+" Z ";
          xml+='<path d="'+positions+'" stroke="black" fill="black" stroke-width="2" />';
          positions = "";
        }
        xml += '</svg>';
        svg.innerHTML = xml;
        drawSVG = false;
        drawSVGCode = false;
        if(drawSVG){
          document.open();
          document.write(svg.innerHTML);
          document.close();
        }else if(drawSVGCode){
          document.open();
          document.write("<textarea><pre><code>");
          document.write(svg.innerHTML);
          document.write("</code></pre></textarea>");
          document.close();
        }
        svgToVertices(svg,  simplePositions[j]);
        xml = "";
      }
      simplePositions = null;
    }
    positionList = null;
    simpleLineToSVG();
    function svgToVertices(svg, _simplePositions){
      var vertexSets = select(svg, 'path')
                  .map(function(path) {
                    return Svg.pathToVertices(path, 30);
                  });
      addOneToWorld(_simplePositions, vertexSets);
    }

    function addOneToWorld(_simplePositions, vertexSets){
            let s_positions = _simplePositions;
            svg_obj = window.matterLib.bodies.fromVertices(
                -100, 
                -100, vertexSets, 
                {
                 collisionFilter: {
                          category: Consts.CAT_DRAW,
                          mask: Consts.CAT_MINE+Consts.CAT_MINE2+Consts.CAT_MINE3+Consts.CAT_STATIC+Consts.CAT_DRAW+Consts.CAT_MOVE,
                        },
                        isStatic: false,
                        density: 0.005,
                        restitution: 0.0, 
                        frictionAir: 0,
                        friction: 0.0,
                        frictionStatic: 0,
                        render: {
                            fillStyle: 'black',
                            strokeStyle: 'black',
                            lineWidth: 1
                        }
                    });
            vertices = svg_obj.vertices;
            mostx=-1000;
            mosty=-1000;
            for(let i = 0; i < vertices.length; i++){
                  if(vertices[i].x >= mostx){
                    mostx = vertices[i].x;
                  }
                  if(vertices[i].y >= mosty){
                    mosty = vertices[i].y;
                  }
            }
            smostx=-1000;
            smosty=-1000;
            for(let i = 0; i < s_positions.length; i++){
                  if(s_positions[i].x >= smostx){
                    smostx = s_positions[i].x;
                  }
                  if(s_positions[i].y > smosty){
                    smosty = s_positions[i].y;
                  }
            }
            dis_x = svg_obj.position.x - (mostx-smostx);
            dis_y = svg_obj.position.y - (mosty-smosty);
            window.matterLib.body.setPosition(svg_obj, { x: dis_x, y:dis_y});
            window.matterLib.composite.add(window.matterLib.ko_engine.world, svg_obj);
    }
    if(startAtOnce == false){
		  window.matterLib.Runner.run(window.matterLib.ko_runnner,
		  	window.matterLib.ko_engine);
        startAtOnce = true;
        window.oekakiLib.isSTart = true;
    }
	}
});