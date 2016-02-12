UIL.Slide = function( o ){

    UIL.Proto.call( this, o );

    this.setTypeNumber( o );

    this.width = UIL.BW - 40;
    this.w = this.width - 8;

    this.h = o.height || 20;
    this.h = this.h < 11 ? 11 : this.h;

    this.old = this.value;
    this.isDown = false;
    this.isOver = false;

    var ty = (o.height * 0.5) - 10;

    if(this.c[1]!==undefined) this.c[1].style.top = ty + 'px';

    this.c[2] = UIL.DOM('UIL text', 'div', 'top:'+ty+'px; text-align:right; width:40px; padding:3px 5px; color:'+ this.fontColor );
    this.c[3] = UIL.DOM('UIL slidebg', 'rect', 'top:2px; height:'+(this.h-4)+'px;' );
    this.c[4] = UIL.DOM('UIL', 'rect', 'left:4px; top:5px; height:'+(this.h-10)+'px; background:' + this.fontColor+';' );
    //this.c[3] = UIL.DOM('UIL svgbox', 'rect', 'width:'+this.width+'px; height:'+(this.h-3)+'px; cursor:w-resize;', { width:'100%', height:this.h-3, fill:UIL.SVGB, 'stroke-width':1, stroke:UIL.SVGC });
    //this.c[4] = UIL.DOM('UIL svgbox', 'rect', 'left:4px; top:4px; width:'+(this.width-8)+'px; height:'+(this.h-10)+'px; pointer-events:none;', { width:'100%', height:'100%', fill: this.fontColor });

    // pattern test
    /*var svg = this.c[3];
    UIL.DOM( null, 'defs', null, {}, svg );
    UIL.DOM( null, 'pattern', null, {id:'sripe', x:0, y:0, width:10, height:10, patternUnits:'userSpaceOnUse' }, svg, 1 );
    UIL.DOM( null, 'line', null, { x1:5, x2:0, y1:0, y2:10, stroke:UIL.SVGC, 'stroke-width':1  }, svg, [1,0] );
    UIL.DOM( null, 'line', null, { x1:10, x2:5, y1:0, y2:10, stroke:UIL.SVGC, 'stroke-width':1  }, svg, [1,0] );
    */

    this.c[3].events = [ 'mouseover', 'mousedown', 'mouseout' ];

    this.init();

};

UIL.Slide.prototype = Object.create( UIL.Proto.prototype );
UIL.Slide.prototype.constructor = UIL.Slide;

UIL.Slide.prototype.handleEvent = function( e ) {

    e.preventDefault();
    //e.stopPropagation();

    switch( e.type ) {
        case 'mouseover': this.over( e ); break;
        case 'mousedown': this.down( e ); break;
        case 'mouseout': this.out( e ); break;

        case 'mouseup': this.up( e ); break;
        case 'mousemove': this.move( e ); break;
    }

};

UIL.Slide.prototype.mode = function( mode ){

    switch(mode){
        case 0: // base
            //UIL.setSvg( this.c[3], 'fill','rgba(0,0,0,0.2)');
            this.c[4].style.background = this.fontColor;

            //UIL.setSvg( this.c[4], 'fill', this.fontColor );
        break;
        case 1: // over
            //UIL.setSvg( this.c[3], 'fill','rgba(0,0,0,0.6)');
            this.c[4].style.background = UIL.SELECT;
            //UIL.setSvg( this.c[4], 'fill', UIL.SELECT );
        break;
        case 2: // edit
            //UIL.setSvg( this.c[3], 'fill','url(#sripe)');
            this.c[4].style.background = UIL.MOVING;
            //UIL.setSvg( this.c[4], 'fill', UIL.MOVING );
        break;

    }
}

UIL.Slide.prototype.over = function( e ){

    this.isOver = true;
    this.mode(1);

};

UIL.Slide.prototype.out = function( e ){

    this.isOver = false;
    if(this.isDown) return;
    this.mode(0);

};

UIL.Slide.prototype.up = function( e ){

    this.isDown = false;
    document.removeEventListener( 'mouseup', this, false );
    document.removeEventListener( 'mousemove', this, false );

    if(this.isOver) this.mode(1);
    else this.mode(0);

    this.sendEnd();
    
};

UIL.Slide.prototype.down = function( e ){

    this.isDown = true;
    document.addEventListener( 'mouseup', this, false );
    document.addEventListener( 'mousemove', this, false );

    this.left = this.c[3].getBoundingClientRect().left;
    this.old = this.value;
    this.move( e );
    this.mode(2);

};

UIL.Slide.prototype.move = function( e ){

    if( this.isDown ){
        var n = ((( e.clientX - this.left - 4 ) / this.w ) * this.range + this.min ) - this.old;
        if(n >= this.step || n <= this.step){ 
            n = ~~ ( n / this.step );
            this.value = this.numValue( this.old + ( n * this.step ) );
            this.update( true );
            this.old = this.value;
        }
    }

};

UIL.Slide.prototype.listen = function( v ){

    this.value = v;
    this.update();

};

UIL.Slide.prototype.update = function( up ){

    var ww = this.w * (( this.value - this.min ) / this.range );
    this.c[4].style.width = ww + 'px';
    this.c[2].textContent = this.value;

    if( up ) this.send();

};

UIL.Slide.prototype.rSize = function(){

    UIL.Proto.prototype.rSize.call( this );

    this.width = this.sb - 40;
    this.w = this.width - 8;

    this.c[2].style.left = this.size - 50 + 'px';
    this.c[3].style.left = this.sa + 'px';
    this.c[3].style.width = this.width + 'px';
    this.c[4].style.left = (this.sa + 4) + 'px';

    this.update();

};