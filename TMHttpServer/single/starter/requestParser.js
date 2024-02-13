const qs=require('querystring');
exports.parseRequest=function(data,mappings){
    var request={};
    request.error=0;
    var str=data.toString();
    var splits=str.split("\n");
    var firstLine=splits[0];
    var w=firstLine.split(" ");
    request.method=w[0].toUpperCase();
    request.data={};
    if(request.method=="GET")
    {
        var i=w[1].indexOf("?");
        if(i!=-1)
        {
            request.queryString=w[1].substring(i+1);
            request.data=JSON.parse(JSON.stringify(qs.decode(request.queryString)));
            w[1]=w[1].substring(0,i);
        }
    }
    if(request.method=="POST")
    {
        var lastLine=splits[splits.length-1];
        request.queryString=lastLine;
        request.data=JSON.parse(JSON.stringify(qs.decode(request.queryString)));
    }
    
    if(w[1]=="/private" || w[1].startsWith("/private/"))
    {
        request.resource=w[1].substring(1);
        request.error=404;
        request.isClientSideTechnologyResource=true;
        return request;
    }
    if(w[1]=='/')
    {
        request.resource="index.html";
        request.isClientSideTechnologyResource=true;
        return request;
    }
    else
    {
        var e=0;
        while(e<mappings.paths.length)
        {
            if(mappings.paths[e].path==w[1])
            {
                request.resource=mappings.paths[e].resource;
                request.isClientSideTechnologyResource=false;
                return request;
            }
            e++;
        }
        request.resource=w[1].substring(1);
        request.isClientSideTechnologyResource=true;
        return request
    }
}