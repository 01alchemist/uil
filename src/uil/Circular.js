UIL.Circular = function( o ){

    UIL.Proto.call( this, o );

    this.setTypeNumber( o );

    this.range = this.max - this.min;

    this.value = o.value || 0;

    this.radius = o.radius || 15;
    this.w = this.radius*2;
    this.height = this.radius*2;
    this.h = (this.radius*2) + 22;

    this.twoPi = Math.PI * 2;

    this.percent = 0;

    this.c[2] = UIL.DOM('UIL text', 'div', 'top:'+(this.height+2)+'px; text-align:center; width:40px; padding:3px 5px; color:'+ this.fontColor );

    this.c[3] = UIL.DOM('UIL svgbox', 'circle', 'width:'+this.w+'px; height:'+this.height+'px; cursor:pointer;', { cx:this.radius, cy:this.radius, r:this.radius, fill:'rgba(0,0,0,0.3)' });
    this.c[4] = UIL.DOM('UIL svgbox', 'path', 'width:'+this.w+'px; height:'+this.height+'px; pointer-events:none;', { d:this.makePath(), fill:this.fontColor });
    this.c[5] = UIL.DOM('UIL svgbox', 'circle', 'width:'+this.w+'px; height:'+this.height+'px; pointer-events:none;', { cx:this.radius, cy:this.radius, r:this.radius*0.5, fill:UIL.bgcolor(UIL.COLOR, 1), 'stroke-width':1, stroke:UIL.SVGC });
    this.c[6] = UIL.DOM('UIL svgbox', 'circle', 'width:'+this.w+'px; height:'+this.height+'px; pointer-events:none;', { cx:this.radius, cy:this.radius, r:this.radius, fill:'none', 'stroke-width':1, stroke:UIL.SVGC });

    this.c[3].events = [ 'mouseover', 'mousedown', 'mouseout' ];

    this.init();

};

UIL.Circular.prototype = Object.create( UIL.Proto.prototype );
UIL.Circular.prototype.constructor = UIL.Circular;

UIL.Circular.prototype.handleEvent = function( e ) {

    e.preventDefault();
    //e.stopPropagation();

    switch( e.type ) {
        case 'mouseover': this.over( e ); break;
        case 'mousedown': this.down( e ); break;
        case 'mouseout':  this.out( e );  break;

        case 'mouseup':   this.up( e );   break;
        case 'mousemove': this.move( e ); break;
    }

};

UIL.Circular.prototype.mode = function( mode ){

    switch(mode){
        case 0: // base
            UIL.setSvg( this.c[3], 'fill','rgba(0,0,0,0.2)');
            UIL.setSvg( this.c[4], 'fill', this.fontColor );
        break;
        case 1: // over
            UIL.setSvg( this.c[3], 'fill','rgba(0,0,0,0.6)');
            UIL.setSvg( this.c[4], 'fill', UIL.SELECT );
        break;
        case 2: // edit
            UIL.setSvg( this.c[3], 'fill','rgba(0,0,0,0.2)');
            UIL.setSvg( this.c[4], 'fill', UIL.MOVING );
        break;

    }
}

UIL.Circular.prototype.over = function( e ){

    this.isOver = true;
    this.mode(1);

};

UIL.Circular.prototype.out = function( e ){

    this.isOver = false;
    if(this.isDown) return;
    this.mode(0);

};

UIL.Circular.prototype.keydown = function( e ){

    if( e.keyCode === 13 ){ 
        e.preventDefault();
        this.value = e.target.textContent;//e.target.value;
        this.callback( this.value );
        e.target.blur();
    }

};

UIL.Circular.prototype.up = function( e ){

    this.isDown = false;
    document.removeEventListener( 'mouseup', this, false );
    document.removeEventListener( 'mousemove', this, false );

    if(this.isOver) this.mode(1);
    else this.mode(0);
    

};

UIL.Circular.prototype.down = function( e ){

    this.isDown = true;
    this.oldr = null;
    //this.prev = { x:e.clientX, d:0, v:parseFloat(this.value), r:this.r  };
    this.move( e );
    this.mode(2);

    document.addEventListener( 'mouseup', this, false );
    document.addEventListener( 'mousemove', this, false );

};

UIL.Circular.prototype.move = function( e ){

    if( this.isDown ){

        e.preventDefault(); 
        var rect = this.c[3].getBoundingClientRect();
        var x = this.radius - (e.clientX - rect.left);
        var y = this.radius - (e.clientY - rect.top);
        this.r = Math.atan2( y, x ) - Math.PI*0.5;

        var range = this.twoPi;
        this.r = (((this.r%range)+range)%range);

        if( this.oldr!==null ) this.r = Math.abs(this.r - this.oldr) > Math.PI ? this.oldr : this.r;

        var steps = 1/range;
        var value = (this.r)*steps;

        this.value = this.numValue( (this.range*value)+this.min );

        

        this.update( true );

        this.oldr = this.r;
    }

};

UIL.Circular.prototype.makePath = function(){

    var r = this.radius;
    var unit = this.twoPi;  
    var start = 0;
    var end = this.percent * unit - 0.001;
    var x1 = r + r * Math.sin(start);
    var y1 = r - r * Math.cos(start);
    var x2 = r + r * Math.sin(end);
    var y2 = r - r * Math.cos(end);
    var big = end - start > Math.PI ? 1 : 0;
    return "M " + r + "," + r + " L " + x1 + "," + y1 + " A " + r + "," + r + " 0 " + big + " 1 " + x2 + "," + y2 + " Z";

};

UIL.Circular.prototype.update = function( up ){

    this.c[2].textContent = this.value;

    this.percent = (this.value - this.min) / this.range;

    UIL.setSvg( this.c[4], 'd', this.makePath() );
    if( up ) this.callback(this.value);
    
};

UIL.Circular.prototype.rSize = function(){

    UIL.Proto.prototype.rSize.call( this );

    this.c[2].style.left = (this.sa+(this.radius-20)) + 'px';
    this.c[3].style.left = this.sa + 'px';
    this.c[4].style.left = this.sa + 'px';
    this.c[5].style.left = this.sa + 'px';
    this.c[6].style.left = this.sa + 'px';
    //this.c[2].style.width = this.sb + 'px';

    this.update();

};