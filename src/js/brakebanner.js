class BrakeBanner{
	constructor(selector){
		this.app = new PIXI.Application({
			width: window.innerWidth,
			height: window.innerHeight,
			backgroundColor: 0xffffff,
			resizeTo: window
		})

		document.querySelector(selector).appendChild(this.app.view);

		this.stage = this.app.stage;

		this.loader = new PIXI.Loader();

		this.loader.add("btn.png", "images/btn.png");
		this.loader.add("btn_circle.png", "images/btn_circle.png");
		this.loader.add("brake_bike.png", "images/brake_bike.png");
		this.loader.add("brake_handlerbar.png", "images/brake_handlerbar.png");
		this.loader.add("brake_lever.png", "images/brake_lever.png");

		this.loader.load();

		this.loader.onComplete.add(()=>{
			this.show();
		})
	}

	show() {
		//添加车子
		const bikeContainer = new PIXI.Container();
		this.stage.addChild(bikeContainer);

		bikeContainer.scale.x = bikeContainer.scale.y = 0.3;

		const bikeImage = new PIXI.Sprite(this.loader.resources["brake_bike.png"].texture);
		bikeContainer.addChild(bikeImage);

		const bikeLevelrImage = new PIXI.Sprite(this.loader.resources["brake_lever.png"].texture);
		bikeContainer.addChild(bikeLevelrImage);

		bikeLevelrImage.pivot.x = 455;
		bikeLevelrImage.pivot.y = 455;

		bikeLevelrImage.x = 722;
		bikeLevelrImage.y = 900;

		const bikeHandlerBarImage = new PIXI.Sprite(this.loader.resources["brake_handlerbar.png"].texture);
		bikeContainer.addChild(bikeHandlerBarImage);

		
		//添加按钮
		let actionBtn = this.createActionBtn();
		actionBtn.x = actionBtn.y = 300;
		this.stage.addChild(actionBtn);
		//添加按钮点击事件
		actionBtn.interactive = true;
		actionBtn.buttonMode = true;
		actionBtn.on("mousedown",()=>{
			// bikeLevelrImage.rotation = Math.PI/180*-30;
			gsap.to(bikeLevelrImage, {duration:.6, rotation: Math.PI/180*-30});
			pause();
		})
		actionBtn.on("mouseup",()=>{
			// bikeLevelrImage.rotation = 0;
			gsap.to(bikeLevelrImage, {duration:.6, rotation: 0});
			start();
		})

		let resize = ()=>{
			bikeContainer.x = window.innerWidth-bikeContainer.width;
			bikeContainer.y = window.innerHeight-bikeContainer.height;
		}
		window.addEventListener('resize', resize);
		resize();


		//创建粒子
		let particleContainer = new PIXI.Container();
		this.stage.addChild(particleContainer);

		particleContainer.pivot.x = window.innerWidth/2;
		particleContainer.pivot.y = window.innerHeight/2;

		particleContainer.x = window.innerWidth/2;
		particleContainer.y = window.innerHeight/2;

		//旋转粒子容器
		particleContainer.rotation = 35*Math.PI/180;

		let particles = [];
		let colors = [0xf1cf54, 0xb5cea8, 0xf1cf54, 0x818181, 0x00000];

		for (let i=0; i<10; i++) {
			let gr = new PIXI.Graphics();

			gr.beginFill(colors[Math.floor(Math.random()*colors.length)]);

			gr.drawCircle(0,0,6); 

			gr.endFill();

			let pItem = {
				sx: Math.random()*window.innerWidth,
				sy: Math.random()*window.innerHeight,
				gr: gr
			}

			gr.x = pItem.sx;
			gr.y = pItem.sy;

			particleContainer.addChild(gr);
			particles.push(pItem);
		}
		//粒子移动
		let speed = 0;
		function loop() {

			speed += .5;
			speed = Math.min(speed, 20);

			for (let i=0; i<particles.length; i++) {
				let pItem = particles[i];

				pItem.gr.y += speed;

				pItem.gr.scale.y = 40;
				pItem.gr.scale.x = 0.03;

				if(pItem.gr.y>window.innerHeight)pItem.gr.y = 0;
			}

		}
		function start() {
			speed = 0;
			gsap.ticker.add(loop);
		}
		function pause() {
			gsap.ticker.remove(loop);
			for (let i=0; i<particles.length; i++) {
				let pItem = particles[i];

				pItem.gr.y += speed;

				pItem.gr.scale.y = 1;
				pItem.gr.scale.x = 1;

				// if(pItem.gr.y>window.innerHeight)pItem.gr.y = 0;
				gsap.to(pItem.gr, {duration:.6,x:pItem.sx,y:pItem.sy,ease:'elastic.out'});
			}
		}
		start();

		//粒子有多个颜色
		//粒子向某个角度持续移动
		//超出边界后回到顶部继续移动
		//按住鼠标停止移动
		//停止时有回弹效果
		//松开鼠标继续

	}

	createActionBtn() {
		let actionBtn = new PIXI.Container();

		let btnImage = new PIXI.Sprite(this.loader.resources['btn.png'].texture);

		let btnCircle = new PIXI.Sprite(this.loader.resources['btn_circle.png'].texture);
		let btnCircle2 = new PIXI.Sprite(this.loader.resources['btn_circle.png'].texture);

		actionBtn.addChild(btnImage);
		actionBtn.addChild(btnCircle);
		actionBtn.addChild(btnCircle2);

		btnImage.pivot.x = btnImage.pivot.y = btnImage.width/2;
		btnCircle.pivot.x = btnCircle.pivot.y = btnCircle.width/2;
		btnCircle2.pivot.x = btnCircle2.pivot.y = btnCircle2.width/2;

		btnCircle.scale.x = btnCircle.scale.y = 0.8;
		gsap.to(btnCircle.scale, {duration:1,x:1.3,y:1.3,repeat:-1});
		gsap.to(btnCircle, {duration:1,alpha:0,repeat:-1});
		
		return actionBtn;
	}
}