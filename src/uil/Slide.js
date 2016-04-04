UIL.Slide = function( o ){

    UIL.Proto.call( this, o );

    this.setTypeNumber( o );

    this.type = o.type || 0;
    this.buttonColor = o.bColor || UIL.BUTTON;

    //this.old = this.value;
    this.isDown = false;
    this.isOver = false;

    this.c[2] = UIL.DOM('UIL number', 'div', ' text-align:right; width:47px; color:'+ this.fontColor );
    this.c[3] = UIL.DOM('UIL', 'div', 'border:1px solid '+UIL.Border+'; pointer-events:auto; cursor:w-resize; background:rgba(0,0,0,0.3); top:2px; height:'+(this.h-4)+'px;' );
    this.c[4] = UIL.DOM('UIL', 'div', 'left:4px; top:5px; height:'+(this.h-10)+'px; background:' + this.fontColor +';' );

    if(this.type !== 0){
        this.c[3].style.borderRadius = '4px';
        this.c[3].style.height = '8px';
        this.c[3].style.top = (this.h*0.5)-4 + 'px';
        this.c[4].style.borderRadius = '2px';
        this.c[4].style.height = '4px';
        this.c[4].style.top = (this.h*0.5)-2 + 'px';
        var ww = this.h-4;
        var ra = 20;

        if(this.type === 2){
            ra = 2;
            ww = (this.h-4)*0.5
        }

        this.c[5] = UIL.DOM('UIL', 'div', 'border-radius:'+ra+'px; margin-left:'+(-ww*0.5)+'px; border:1px solid '+UIL.Border+'; background:'+this.buttonColor+'; left:4px; top:2px; height:'+(this.h-4)+'px; width:'+ww+'px;' );
    }

    this.c[3].events = [ 'mouseover', 'mousedown', 'mouseout' ];

    this.init();

};

UIL.Slide.prototype = Object.create( UIL.Proto.prototype );
UIL.Slide.prototype.constructor = UIL.Slide;

UIL.Slide.prototype.handleEvent = function( e ) {

    e.preventDefault();

    switch( e.type ) {
        case 'mouseover': this.over( e ); break;
        case 'mousedown': this.down( e ); break;
        case 'mouseout': this.out( e ); break;

        case 'mouseup': this.up( e ); break;
        case 'mousemove': this.move( e ); break;
    }

};

UIL.Slide.prototype.mode = function( mode ){

    var s = this.s;

    switch(mode){
        case 0: // base
            s[2].color = this.fontColor;
            s[3].background = 'rgba(0,0,0,0.3)';
            s[4].background = this.fontColor;
        break;
        case 1: // over
            s[2].color = this.colorPlus;
            s[3].background = UIL.SlideBG;
            s[4].background = this.colorPlus;
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
    //this.mode(2);

};

UIL.Slide.prototype.move = function( e ){

    if( this.isDown ){
        var n = ((( e.clientX - this.left - 3 ) / this.w ) * this.range + this.min ) - this.old;
        if(n >= this.step || n <= this.step){ 
            n = ~~ ( n / this.step );
            this.value = this.numValue( this.old + ( n * this.step ) );
            this.update( true );
            this.old = this.value;
        }
    }

};

UIL.Slide.prototype.update = function( up ){

    var ww = this.w * (( this.value - this.min ) / this.range );
   
    this.s[4].width = ww + 'px';
    if(this.s[5])this.s[5].left = (this.sa+ww+ 3) + 'px';
    this.c[2].textContent = this.value;

    if( up ) this.send();

};

UIL.Slide.prototype.rSize = function(){

    UIL.Proto.prototype.rSize.call( this );

    this.width = this.sb - this.sc;
    this.w = this.width - 6;

    var tx = this.sc;
    if(this.isUI || !this.simple) tx = this.sc+10;

    var ty = ~~(this.h * 0.5) - 8;

    var s = this.s;

    s[2].width = this.sc + 'px';
    s[2].left = this.size - tx + 'px';
    s[2].top = ty + 'px';
    s[3].left = this.sa + 'px';
    s[3].width = this.width + 'px';
    s[4].left = (this.sa + 3) + 'px';

    this.update();

};