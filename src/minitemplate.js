/**
 * miniTemplate
 * 使用方法: 
 *  var tplfun = miniTemplate("<%for(var i=0;i<len;i++){%><div><%=i%></div><%}%>");
 *  tplfun({len:5}); //返回模板生成的字符串
 */
var miniTemplate = function(tpl,opts){
	"use strict";

	var lefttag = '<%',
		righttag = '%>',
		varname = "__js"+parseInt(Math.random() * 1000000000)+"__";

	tpl = ' '+(tpl || '')+' ';
	if(opts){
		if(opts.lefttag) lefttag = opts.lefttag;
		if(opts.righttag) righttag = opts.righttag;
	}
	var reg = new RegExp('('+lefttag + '.*?' + righttag+')','mg'),
		nreg = new RegExp('(?:'+lefttag + '.*?' + righttag+')','mg'),
		eqreg = /^\s*=/,
		egreg = /;+\s*$/,
		removeTag = new RegExp(lefttag+"|"+righttag,'mg');
	var lines = tpl.split(nreg),i = 0;
	var _js_ = ['var '+varname + ' = [];'];
	_js_.push('with(obj){');
	 tpl.replace(reg,function(a,b){
		i++;
		_js_.push(varname + '.push("' + lines[i-1] + '");')
		var jsblock = b.replace(removeTag,'');
		if(jsblock.match(eqreg)){
			_js_.push(varname + '.push(' + jsblock.replace(eqreg,'').replace(egreg,'') + ');');
		}else{
			_js_.push(jsblock + '');
		}
	});
	if(i){
		_js_.push(varname + '.push("' + lines[lines.length-1] + '");')
	}else{
		_js_.push(varname + '.push("' + tpl + '");')
	}
	_js_.push('return '+varname+'.join("");');
	_js_.push('}')
	_js_ = _js_.join('');
	var render = new Function('obj',_js_);
	return function(data){
		data = data || {};
		return render(data);
	}
};
