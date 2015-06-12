UIL.Button = function(obj){

    UIL.Proto.call( this, obj );

    this.value = obj.value || false;

    this.c[2] = UIL.DOM('UIL svgbox', 'rect', '', {width:this.sb, height:15, fill:UIL.bgcolor(UIL.COLOR) });
    this.c[3] = UIL.DOM('UIL text', 'div', 'text-align:center;');

    this.c[1].innerHTML = '';
    this.c[3].innerHTML = this.txt;

    this.f[0] = function(e){
        this.callback( this.value );
    }.bind(this);

    this.f[1] = function(e){
        this.c[3].style.color = '#FFF';
        UIL.setSVG(this.c[2], 'fill', UIL.SELECT );
    }.bind(this);

    this.f[2] = function(e){
        this.c[3].style.color = '#CCC';
        UIL.setSVG(this.c[2], 'fill', UIL.bgcolor(UIL.COLOR) );
    }.bind(this);

    this.f[3] = function(e){
        this.c[3].style.color = '#CCC';
        UIL.setSVG(this.c[2], 'fill', UIL.SELECTDOWN );
    }.bind(this);

    this.c[2].onclick = this.f[0];
    this.c[2].onmouseover = this.f[1];
    this.c[2].onmouseout = this.f[2];
    this.c[2].onmouseup = this.f[1];
    this.c[2].onmousedown = this.f[3];

    this.init();
}

UIL.Button.prototype = Object.create( UIL.Proto.prototype );
UIL.Button.prototype.constructor = UIL.Button;

UIL.Button.prototype.label = function(string){
    this.c[3].innerHTML = string;
}

UIL.Button.prototype.rSize = function(){
    UIL.Proto.prototype.rSize.call( this );
    this.setSvg(2, 'width', this.sb);
    this.setDom(2, 'width', this.sb);
    this.setDom(2, 'left', this.sa);
    this.setDom(3, 'width', this.sb);
    this.setDom(3, 'left', this.sa);
};