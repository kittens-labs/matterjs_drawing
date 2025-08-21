"use strict";

//==========
// Matter.js

const WIDTH  = 400;
const HEIGHT = 600;

const Engine     = Matter.Engine;
const Render     = Matter.Render;
const Runner     = Matter.Runner;
const Body       = Matter.Body;
const Bodies     = Matter.Bodies;
const Bounds     = Matter.Bounds;
const Common     = Matter.Common;
const Composite  = Matter.Composite;
const Composites = Matter.Composites;
const Constraint = Matter.Constraint;
const Events     = Matter.Events;
const Mouse      = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const Query = Matter.Query;
const Svg = Matter.Svg;
const Vertices = Matter.Vertices;
const World = Matter.World;
window.matterLib= window.matterLib|| {};
window.matterLib.width = WIDTH;
window.matterLib.height = HEIGHT;
window.matterLib.body = Body;
window.matterLib.bodies = Bodies;
window.matterLib.composite = Composite;
window.matterLib.composites = Composites;
window.matterLib.common = Common;
window.matterLib.constraint = Constraint;
window.matterLib.Engine = Engine;
window.matterLib.query = Query;
window.matterLib.Render = Render;
window.matterLib.svg = Svg;
window.matterLib.vertices = Vertices;
window.matterLib.World = World;


window.onload = ()=>{
	initGame();
	window.matterLib.initgame = initGame;
}

function initGame(){
	Common.setDecomp();

	const engine = Engine.create();
    const canvas = document.getElementById('physic-area');

	const render = Render.create({
        canvas: canvas,
		engine: engine,
		options: {
			width: WIDTH, height: HEIGHT,
			showAngleIndicator: false,
			showCollisions: false,
			showDebug: false,
			showIds: false,
			showVelocity: false,
			hasBounds: true,
            background: '#ddffdd',
			wireframes: false// Important!!
		}
	});
	Render.run(render);
	window.matterLib.render = render;


	const ball = Bodies.circle(WIDTH/2-80, 20, 20,
		{	
			//collisionFilter:false,
			collisionFilter: {
				//group: 0, 
				category: Consts.CAT_MINE, 
				mask: Consts.CAT_MINE+Consts.CAT_MOVE+Consts.CAT_STATIC+Consts.CAT_GOAL+Consts.CAT_DRAW,  
			},
			isStatic: false,
			density: 0.001, 
			restitution: 0.8, 
			frictionAir: 0, 
            friction: 0.1,
            frictionStatic: 0,
			angle: Common.random(0, 360),
			render: {
                            fillStyle: 'red',
                            strokeStyle: '#333333',
                            lineWidth: 3
            }
		});
	Composite.add(engine.world, ball);

	
	const ground = Bodies.rectangle(WIDTH/2, HEIGHT, WIDTH, 50, 
		{
			collisionFilter: {
				//group: 0, 
				category: Consts.CAT_STATIC,
				mask: Consts.CAT_MINE+Consts.CAT_MOVE+Consts.CAT_STATIC+Consts.CAT_DRAW, 
			},
			//collisionFilter:true,
			isStatic: true,
			density: 0.001,
			restitution: 0.8,
			frictionAir: 0, 
            friction: 0.1,
            frictionStatic: 0,
			render: {
                            fillStyle: '#88aa88',
                            strokeStyle: '#000000',
                            lineWidth: 2
            }

		});
	Composite.add(engine.world, ground);

	const wall1 = Bodies.rectangle(0, HEIGHT/2, 20, HEIGHT, 
		{
			collisionFilter: {
				//group: 0, 
				category: Consts.CAT_STATIC,
				mask: Consts.CAT_MINE+Consts.CAT_MOVE+Consts.CAT_STATIC+Consts.CAT_DRAW, 
			},
			//collisionFilter:true,
			isStatic: true,
			density: 0.001,
			restitution: 0.8, 
			frictionAir: 0, 
            friction: 0.1, 
            frictionStatic: 0,
			render: {
                            fillStyle: '#88aa88',
                            strokeStyle: '#000000',
                            lineWidth: 2
            }

		});
	Composite.add(engine.world, wall1);

	const wall2 = Bodies.rectangle(WIDTH, HEIGHT/2, 20, HEIGHT,
		{
			collisionFilter: {
				//group: 0, 
				category: Consts.CAT_STATIC, 
				mask: Consts.CAT_MINE+Consts.CAT_MOVE+Consts.CAT_STATIC+Consts.CAT_DRAW,  
			},
			//collisionFilter:true,
			isStatic: true,
			density: 0.001, 
			restitution: 0.8, 
			frictionAir: 0, 
            friction: 0.1, 
            frictionStatic: 0,
			render: {
                            fillStyle: '#88aa88',
                            strokeStyle: '#000000',
                            lineWidth: 2
            }

		});
	Composite.add(engine.world, wall2);


	ctx = window.oekakiLib.ctx;
	ctx.font = "bold 40px 'Arial'";
	ctx.fillStyle = '#668866';
	ctx.fillText('Draw shapes',10, 100); 
	ctx.fillText('on the canvas.',10, 150); 
	
	const isMouseControl = false;
	if(isMouseControl){
		// add mouse control
		var mouse = Mouse.create(render.canvas),
			mouseConstraint = MouseConstraint.create(engine, {
				mouse: mouse,
				constraint: {
					stiffness: 0.1,
					render: {
						visible: false
					}
				}
			});

		Composite.add(engine.world, mouseConstraint);
		// keep the mouse in sync with rendering
		render.mouse = mouse;
	}

	//##### SYSTEM END #####

	const runner = Runner.create();
    //Runner.run(runner, engine);
	window.matterLib.Runner = Runner;
	window.matterLib.ko_runnner = runner;
	window.matterLib.ko_engine = engine;
}