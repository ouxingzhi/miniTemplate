/**
 * miniTemplate
 */
var miniTemplate = function(){
	"use strict";

	return function(tstr,opts){
		var lefttag = '<%',
			righttag = '%>',
			varname = "__$var__";
		tstr = tstr || '';
		if(opts){
			if(opts.lefttag) lefttag = opts.lefttag;
			if(opts.righttag) righttag = opts.righttag;
		}
		var reg = new RegExp('('+lefttag + '.*?' + righttag+')','mg'),
			nreg = new RegExp('(?:'+lefttag + '.*?' + righttag+')','mg'),
			eqreg = /^\s*=/,
			egreg = /;+\s*$/,
			removeTag = new RegExp(lefttag+"|"+righttag,'mg');
		var lines = tstr.split(nreg),i = 0;
		var str = ['var '+varname + ' = [];\r\n'];
		 tstr.replace(reg,function(a,b){
			i++;
			str.push(varname + '.push("' + lines[i-1] + '");\r\n')
			var jsblock = b.replace(removeTag,'');
			if(jsblock.match(eqreg)){
				str.push(varname + '.push(' + jsblock.replace(eqreg,'').replace(egreg,'') + ');\r\n');
			}else{
				str.push(jsblock + '\r\n');
			}
		});
		if(i){
			str.push(varname + '.push("' + lines[lines.length-1] + '");\r\n')
		}else{
			str.push(varname + '.push("' + tstr + '");\r\n')
		}
		str.push('return '+varname+'.join("");');
		return function(data){
			data = data || {};
			var vars = [],vals=[];
			for(var i in data){
				vars.push(i);
				vals.push(data[i]);
			} 
			vars.push(str.join(''));
			return Function.apply(null,vars).apply(null,vals);
		}
	};

}();
