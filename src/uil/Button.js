UIL.Button = function( o ){

    UIL.Proto.call( this, o );

    this.value = o.value || [this.txt];

    this.buttonColor = o.bColor || UIL.BUTTON;

    this.isLoadButton = o.loader || false;
    this.isDragButton = o.drag || false;
    if(this.isDragButton )this.isLoadButton=true;
    this.r = o.r || 0;

    this.lng = this.value.length;

    for(var i = 0; i < this.lng; i++){
        this.c[i+2] = UIL.DOM(null, 'div', UIL.TXT + UIL.BASIC +'text-align:center; border:1px solid '+UIL.Border+'; top:1px; pointer-events:auto; cursor:pointer; background:'+this.buttonColor+'; height:'+(this.h-2)+'px; border-radius:'+this.r+'px; line-height:'+(this.h-4)+'px;' );
        this.c[i+2].style.color = this.fontColor;

        this.c[i+2].events = [ 'click', 'mouseover', 'mousedown', 'mouseup', 'mouseout' ];
        this.c[i+2].innerHTML = this.value[i];//this.txt;
        this.c[i+2].name = i;
    }

    if( this.c[1] !== undefined ) this.c[1].textContent = '';
    

    if( this.isLoadButton ) this.initLoader();
    if( this.isDragButton ) this.initDrager();

    this.init();

};

UIL.Button.prototype = Object.create( UIL.Proto.prototype );
UIL.Button.prototype.constructor = UIL.Button;

UIL.Button.prototype.handleEvent = function( e ) {

    e.preventDefault();

    switch( e.type ) {
        case 'click': this.click( e ); break;
        case 'mouseover': this.mode( 1, e ); break;
        case 'mousedown': this.mode( 2, e ); break;
        case 'mouseup': this.mode( 0, e ); break;
        case 'mouseout': this.mode( 0, e ); break;
        case 'change': this.fileSelect( e.target.files[0] ); break;

        case 'dragover': this.dragover(); break;
        case 'dragend': this.dragend(); break;
        case 'dragleave': this.dragend(); break;
        case 'drop': this.drop( e ); break;
    }

};

UIL.Button.prototype.dragover = function(){
    this.s[4].borderColor = UIL.SELECT;
    this.s[4].color = UIL.SELECT;
};
UIL.Button.prototype.dragend = function(){
    this.s[4].borderColor = this.fontColor;
    this.s[4].color = this.fontColor;
};
UIL.Button.prototype.drop = function(e){
    this.dragend();
    this.fileSelect( e.dataTransfer.files[0] );
};

UIL.Button.prototype.mode = function( mode, e ){

    var s = this.s;
    var i = e.target.name || 0;
    if(i==='loader') i = 0;


    switch( mode ){
        case 0: // base
            s[i+2].color = this.fontColor;
            s[i+2].background = this.buttonColor;
        break;
        case 1: // over
            s[i+2].color = '#FFF';
            s[i+2].background = UIL.SELECT;
        break;
        case 2: // edit / down
            s[i+2].color = this.fontColor;
            s[i+2].background = UIL.SELECTDOWN;
        break;

    }
}

UIL.Button.prototype.initDrager = function(){

    this.c[4] = UIL.DOM(null, 'div', UIL.TXT + UIL.BASIC +' text-align:center; line-height:'+(this.h-8)+'px; border:1px dashed '+this.fontColor+'; top:2px; pointer-events:auto; cursor:default; height:'+(this.h-4)+'px; border-radius:'+this.r+'px;' );
    this.c[4].textContent = 'DRAG';

    this.c[2].events = [  ];
    this.c[4].events = [ 'dragover', 'dragend', 'dragleave', 'drop' ];


};

UIL.Button.prototype.initLoader = function(){

    this.c[3] = UIL.DOM(null, 'input', UIL.BASIC +'border:1px solid '+UIL.Border+'; top:1px; opacity:0; pointer-events:auto; cursor:pointer; height:'+(this.h-2)+'px;' );
    this.c[3].name = 'loader';
    this.c[3].type = "file";

    this.c[2].events = [  ];
    this.c[3].events = [ 'change', 'mouseover', 'mousedown', 'mouseup', 'mouseout' ];

    //this.hide = document.createElement('input');

};

UIL.Button.prototype.fileSelect = function( file ){

    //if( ! e.target.files ) return;

    //var file = e.target.files[0];
   
    this.c[3].type = "null";
    // console.log( this.c[4] )

    if( file === undefined ) return;

    var reader = new FileReader();
    var fname = file.name;
    var type = fname.substring(fname.indexOf('.')+1, fname.length );

    if( type === 'png' || type === 'jpg' ) reader.readAsDataURL( file );
    else if(type === 'z') reader.readAsBinaryString( file );
    else reader.readAsText( file );

    reader.onload = function(e) { 
        this.callback( e.target.result, fname, type );
         this.c[3].type = "file";
        //this.send( e.target.result ); 
    }.bind(this);

};

UIL.Button.prototype.click = function( e ){

    var i = e.target.name || 0;
    var v = this.value[i];

    this.send( v );

};

UIL.Button.prototype.label = function( string, n ){

    n = n || 2;
    this.c[n].textContent = string;

};

UIL.Button.prototype.icon = function( string, y, n ){

    n = n || 2;
    this.s[n].padding = ( y || 0 ) +'px 0px';
    this.c[n].innerHTML = string;

};

UIL.Button.prototype.rSize = function(){

    UIL.Proto.prototype.rSize.call( this );

    var s = this.s;
    var w = this.sb;
    var d = this.sa;


    if( this.isDragButton ){ 
        w = ~~ w * 0.5;
        s[4].left = (d+w) + 'px';
        s[4].width = w-4 + 'px';
    }

    if( this.isLoadButton ){
        s[3].left = d + 'px';
        s[3].width = w + 'px';
    }

    var tt = ~~ (w / this.lng);

    for(var i = 0; i < this.lng; i++){

        s[i+2].left = d + (tt*i) + 'px';
        s[i+2].width = (tt-4) + 'px';

    }

    

};