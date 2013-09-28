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
	_js_ = _js_.join('');
	return function(data){
		data = data || {};
		var vars = [],vals=[];
		for(var i in data){
			vars.push(i);
			vals.push(data[i]);
		} 
		vars.push(_js_);
		return Function.apply(null,vars).apply(null,vals);
	}
};
