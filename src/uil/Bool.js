UIL.Bool = function( o ){

    UIL.Proto.call( this, o );

    this.value = o.value || false;

    this.buttonColor = UIL.BUTTON;

    this.inh = o.inh || this.h;

    var t = ~~ (this.h*0.5)-((this.inh-2)*0.5);



    this.c[2] = UIL.DOM('UIL', 'div', 'background:'+ UIL.BOOLBG +'; height:'+(this.inh-2)+'px; width:36px; top:'+t+'px; border-radius:20px; pointer-events:auto; cursor:pointer; transition:0.1s ease-out;' );
    this.c[3] = UIL.DOM('UIL', 'div', 'opasity:0, background:'+ UIL.BOOLBG +'; height:'+(this.inh-6)+'px; width:'+(this.inh-6)+'px; top:'+(t+2)+'px; border-radius:20px; ' );

    //this.c[3] = UIL.DOM('UIL', 'path', 'width:17px; top:'+(t+1)+'px;',{ width:17, height:17, d:'M 4 9 L 6 12 14 4', 'stroke-width':2, stroke:'#000', fill:'none', 'stroke-linecap':'butt' });
    this.c[4] = UIL.DOM('UIL', 'div', 'border:1px solid '+UIL.Border+'; height:'+(this.inh-4)+'px; width:16px; top:'+(t+1)+'px; border-radius:20px; background:'+this.buttonColor+'; transition:margin 0.1s ease-out;' );

    /*this.c[2] = UIL.DOM('UIL', 'div', 'background:'+ UIL.BOOLBG +'; height:18px; width:36px; top:'+t+'px; border-radius:8px; pointer-events:auto; cursor:pointer;' );
    this.c[3] = UIL.DOM('UIL', 'path', 'width:17px; top:'+(t+1)+'px;',{ width:17, height:17, d:'M 4 9 L 6 12 14 4', 'stroke-width':2, stroke:'#000', fill:'none', 'stroke-linecap':'butt' });
    this.c[4] = UIL.DOM('UIL', 'div', 'height:16px; width:16px; top:'+(t+1)+'px; border-radius:8px; background:'+UIL.bgcolor(UIL.COLOR,1)+'; transition:margin 0.1s ease-out;' );*/

    if(this.value){
        this.c[4].style.marginLeft = '18px';
        this.c[2].style.background = this.fontColor;
        this.c[2].style.borderColor = this.fontColor;
    }

    this.c[2].events = [ 'click' ];

    this.init();

};

UIL.Bool.prototype = Object.create( UIL.Proto.prototype );
UIL.Bool.prototype.constructor = UIL.Bool;

UIL.Bool.prototype.handleEvent = function( e ) {

    e.preventDefault();

    switch( e.type ) {
        case 'click': this.click(e); break;
    }

};

UIL.Bool.prototype.click = function( e ){

    var s = this.s;

    if(this.value){
        this.value = false;
    } else {
        this.value = true;;
    }

    this.update();

    this.send();

};



UIL.Bool.prototype.rSize = function(){

    UIL.Proto.prototype.rSize.call( this );
    var s = this.s;
    s[2].left = this.sa + 'px';
    s[3].left = this.sa+1+ 'px';
    s[4].left = this.sa+1 + 'px';

};

UIL.Bool.prototype.update = function() {

    var s = this.s;

    if(this.value){
        s[4].marginLeft = '18px';
        s[2].background = this.fontColor;
        s[2].borderColor = this.fontColor;
        s[4].borderColor = this.fontColor;
    } else {
        s[4].marginLeft = '0px';
        s[2].background = UIL.BOOLBG;
        s[2].borderColor = UIL.BOOLBG;
        s[4].borderColor = UIL.Border;
    }
        
};