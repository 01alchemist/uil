/**   _   _____ _   _   
*    | | |_   _| |_| |
*    | |_ _| | |  _  |
*    |___|_|_| |_| |_| 2015
*    @author lo.th / http://lo-th.github.io/labs/
*/

'use strict';

var UIL = UIL || ( function () {
    //var _uis = [];
    return {
        main:null,
        REVISION: '0.4',
        events:[ 'onkeyup', 'onkeydown', 'onclick', 'onchange', 'onmouseover', 'onmouseout', 'onmousemove', 'onmousedown', 'onmouseup', 'onmousewheel' ],
        WIDTH:300, 
        bgcolor: function(p, a){
            var r=48, g=48, b=48; 
            a= a || 0.66;
            if(p){
                switch(p){
                    case 'r': case 'R': case 'S': r=160; b=68; break;
                    case 'g': case 'G': case 'E': g=120; b=68; break;
                    case 'b': case 'B': case 'T': b=120; g=68; break;
                }
            }
            return 'rgba('+r+','+g+','+b+','+a+')';
        },
        /*canvasURL:function(obj){
            var canvas = document.createElement( 'canvas' );
            canvas.width = obj.w || 20;
            canvas.height = obj.h || 20;

            var context = canvas.getContext( '2d' );
            context.fillStyle = '#444';
            context.fillRect( 0, 0, 20, 20 );
            return canvas.toDataURL();
        },*/
        setSVG:function(dom, type, value){
            dom.childNodes[0].setAttributeNS(null, type, value );
        },
        DOM:function(cc, type, css, obj, dom){ 
            type = type || 'div';
            if(type=='rect' || type=='path' || type=='polygon' || type=='text'){
                if(dom==undefined) dom = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
                var g = document.createElementNS( 'http://www.w3.org/2000/svg', type );
                dom.appendChild(g);
                
                for(var e in obj){
                    if(e=='width' || e=='height')dom.setAttribute( e, obj[e] );
                    g.setAttribute( e, obj[e] );
                }
            } else {
                if(dom==undefined) dom = document.createElement(type);
                if(cc) dom.className = cc;
            }
            
            if(css) dom.style.cssText = css; 
            return dom;
        },
        CC:function(name,rules,noAdd){
            var adds = '.';
            if(noAdd)adds='';
            if(name == '*') adds = '';
            var style = document.createElement('style');
            style.type = 'text/css';
            document.getElementsByTagName('head')[0].appendChild(style);
            if(!(style.sheet||{}).insertRule) (style.styleSheet || style.sheet).addRule(adds+name, rules);
            else style.sheet.insertRule(adds+name+"{"+rules+"}",0);
        },
        calc:function(){
            var total = 0;
            var i = this.main.uis.length;
            while(i--) total+=this.main.uis[i].h;
            if(total>this.main.height) this.main.showScroll(total);
            else this.main.hideScroll();
        }
    };
})();


UIL.Gui = function(css){
    this.uis = [];
    
    this.content = UIL.DOM('UIL content', 'div', css);
    document.body.appendChild(this.content);

    var margin = this.content.style.marginLeft;
    var decal = Number(margin.substring(0,margin.length-2));

    this.mask = UIL.DOM('UIL mask', 'div', css);
    document.body.appendChild(this.mask);
    this.mask.style.marginLeft = (decal-50)+'px';

    this.inner = UIL.DOM('UIL inner');
    this.content.appendChild(this.inner);
    
    this.scrollBG = UIL.DOM('UIL scroll-bg', 'div', 'right:0; top:0; width:20px; height:100%; cursor:s-resize; display:none; ');
    this.content.appendChild(this.scrollBG);
    this.scrollBG.name = 'move';

    this.scrollBG2 = UIL.DOM('UIL scroll-bg', 'div', 'left:0; top:0; width:90px; height:100%; cursor:s-resize; display:none; background:none;');
    this.content.appendChild(this.scrollBG2);
    this.scrollBG2.name = 'move';
    
    this.scroll = UIL.DOM(null, 'rect', 'right:3px; top:6px;', {width:12, height:40, fill:'#666' });
    this.scrollBG.appendChild(this.scroll);  

    UIL.main = this;

    this.down = false;

    this.f = [];

    // onmousedown
    this.f[0] = function(e){
        if(e.target.name){
            if(e.target.name=='move'){
                this.down = true;
                this.f[1](e);
                this.scrollBG.style.background = 'rgba(0,0,0,0.4)';
                UIL.setSVG(this.scroll, 'fill','#FFF');
                e.preventDefault();
            }
        }
    }.bind(this);

    // mousemove
    this.f[1] = function(e){
        if(!this.down) return;
        var rect = this.content.getBoundingClientRect();
        var y = e.clientY-rect.top;
        if(y<20) y = 20;
        if(y>(this.height-20)) y = this.height-20;
        this.py = (((y-20)/(this.height-40))*this.range).toFixed(0);
        this.inner.style.top = -this.py+'px';
        this.scroll.style.top = (y-20)+'px';
    }.bind(this);

    // mouseup
    this.f[2] = function(e){
        this.down = false;
        this.scrollBG.style.background = 'rgba(0,0,0,0.2)';
        UIL.setSVG(this.scroll, 'fill','#666');
    }.bind(this);

    // over
    this.f[3] = function(e){
        this.scrollBG.style.background = 'rgba(0,0,0,0.3)';
        UIL.setSVG(this.scroll, 'fill','#AAA');
    }.bind(this);

    this.content.onmousedown = this.f[0];
    this.content.onmousemove = this.f[1];
    this.content.onmouseout = this.f[2];
    this.content.onmouseup = this.f[2];
    this.content.onmouseover = this.f[3];

    this.height = 0;
    this.top = parseFloat(this.content.style.top.substring(0,this.content.style.top.length-2));
    this.height = window.innerHeight-this.top;

    this.content.style.height = this.height+'px';

    window.addEventListener("resize", function(e){this.resize(e)}.bind(this), false );
}

UIL.Gui.prototype = {
    constructor: UIL.Gui,
    show:function(){
        this.content.style.display = 'block';
    },
    hide:function(){
        this.content.style.display = 'none';
    },
    add:function(type, obj){
        var n;
        switch(type){
            case 'button': n = new UIL.Button(obj); break;
            case 'string': n = new UIL.String(obj); break;
            case 'number': n = new UIL.Number(obj); break;
            case 'title':  n = new UIL.Title(obj);  break;
            case 'color':  n = new UIL.Color(obj);  break;
            case 'slide':  n = new UIL.Slide(obj);  break;
            case 'bool':   n = new UIL.Bool(obj);   break;
            case 'list':   n = new UIL.List(obj);   break;
        }
        this.uis.push(n);
        UIL.calc();
    },
    resize:function(e){
        this.height = window.innerHeight-this.top;
        this.inner.style.top = '0px';
        this.scroll.style.top = '0px';
        this.content.style.height = this.height+'px';
        UIL.calc();
    },
    remove: function ( n ) { 
        var i = this.uis.indexOf( n ); 
        if ( i !== -1 ) { 
            this.uis[i].clear();
            this.uis.splice( i, 1 ); 
        }
    },
    clear:function(){
        this.inner.style.top = '0px';
        this.scroll.style.top = '0px';
        var i = this.uis.length;
        while(i--){
            this.uis[i].clear();
            this.uis.pop();
        }
        this.uis = [];
        UIL.calc();
    },
    showScroll:function(h){
        this.min = 0;
        this.max = h-this.height;
        this.range = this.max - this.min;
        this.scrollBG.style.display = 'block';
        this.scrollBG2.style.display = 'block';
    },
    hideScroll:function(){
        this.inner.style.top = '0px';
        this.scroll.style.top = '0px';
        this.scrollBG.style.display = 'none';
        this.scrollBG2.style.display = 'none';
    }
}

UIL.COLOR = 'N';
UIL.SELECT = '#035fcf';
UIL.SELECTDOWN = '#024699'
UIL.txt1 = 'font-family:"Open Sans", sans-serif; font-size:12px; color:#cccccc; outline:none; padding:0px 5px; width:170px; left:0; top:1px; height:17px; padding-bottom:1px;';
UIL.BASIC = 'position:absolute; left:100px; pointer-events:auto; cursor:pointer; border:solid 1px rgba(0,0,0,0.2);'

UIL.CC('UIL', 'position:absolute; pointer-events:none; box-sizing:border-box; -o-user-select:none; -ms-user-select:none; -khtml-user-select:none; -webkit-user-select:none; -moz-user-select:none;');

UIL.CC('UIL.content', 'width:'+(UIL.WIDTH)+'px; margin-left:0px; overflow:hidden; background:none;');
UIL.CC('UIL.mask', 'width:'+(UIL.WIDTH+100)+'px; height:100%; margin-left:-50px; pointer-events:auto; cursor:col-resize; background:none; display:none;');
UIL.CC('UIL.inner', 'width:'+(UIL.WIDTH)+'px; top:0; left:0; height:auto; overflow:hidden; background:none;');

UIL.CC('UIL.base', 'position:relative; transition: 0.1s ease-out; width:'+(UIL.WIDTH)+'px; height:20px; left:0px; background:rgba(40,40,40,0.5); border-bottom:1px solid rgba(0,0,0,0.2); overflow:hidden;');

UIL.CC('UIL.text', 'width:90px; top:2px; height:16px; padding-left:10px; padding-right:5px; text-align:Left; overflow:hidden; white-space:nowrap;'+ UIL.txt1);
UIL.CC('UIL.itext', 'pointer-events:auto; left:100px;');

UIL.CC('input', ' border:solid 1px rgba(0,0,0,0.2); background:rgba(0,0,0,0.2); transition: 0.1s ease-out;'+ UIL.txt1, true);
UIL.CC('input:focus', 'border: solid 1px rgba(0,0,0,0); background:rgba(0,0,0,0.6);', true);

UIL.CC('UIL.Listtxt', UIL.BASIC+'left:100px; text-align:center; border:solid 1px rgba(90,90,90,0.6);'+UIL.txt1);
UIL.CC('UIL.Listtxt:hover', 'border:1px solid '+UIL.SELECT+';');
UIL.CC('UIL.list', 'box-sizing:content-box; border:20px solid rgba(0,0,0,0); border-bottom:10px solid transparent; left:80px; top:0px; width:170px; height:90px; overflow:hidden; cursor:s-resize; pointer-events:auto; display:none;');
UIL.CC('UIL.list-in', 'left:0; top:0; width:170px; background:rgba(0,0,0,0.2); ');
UIL.CC('UIL.listItem', 'position:relative; width:170px; height:18px; background:rgba(0,0,0,0.2); padding-left:5px; border-bottom:1px solid rgba(0,0,0,0.2); pointer-events:auto; cursor:pointer;'+UIL.txt1);
UIL.CC('UIL.listItem:hover', 'background:'+UIL.SELECT+'; color:#FFFFFF;')
UIL.CC('UIL.list-sel', 'width:10px; height:10px; right:5px; background:#666; margin-top:5px;');

UIL.CC('UIL.scroll-bg', 'cursor:w-resize; pointer-events:auto; background:rgba(0,0,0,0.2);');
UIL.CC('UIL.color-txt', UIL.txt1 );




// UMD (Universal Module Definition)
/*( function ( root ) {
    if ( typeof define === 'function' && define.amd ) {// AMD
        define( [], function () { return UIL; } );
    } else if ( typeof exports === 'object' ) { // Node.js
        module.exports = UIL;
    } else {// Global variable
        root.UIL = UIL;
    }
})(this);*/