miniTemplate
============

一个简单的js模板方法
使用方法
var tplfun = miniTemplate("<%for(var i=0;i<len;i++){%><div><%=i%></div><%}%>");
tplfun({len:5}); //返回模板生成的字符串
