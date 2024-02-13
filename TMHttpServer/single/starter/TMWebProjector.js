const fs=require('fs');
const mimeTypes=require("mime-types");
const net=require('net');
const configuration=require("./configuration");
const errors=require("./errors");
const requestParser=require("./requestParser");
const { request } = require('http');


var mappings=configuration.getConfiguration();
console.log(mappings);


function Response(socket)
{
    this.responseInitiated=false;
    this.contentType="text/html";
    this.$$$socket=socket;
    this.setContentType=function(str)
    {
        this.contentType=str;
    }
    this.write=function(data)
    {
        if(this.responseInitiated==false)
        {
            this.$$$socket.write("HTTP/1.1 200 OK\n");
            this.$$$socket.write(new Date().toGMTString()+"\n");    
            this.$$$socket.write("Server: TMWebProjector\n");
            this.$$$socket.write("Content-Type: "+this.contentType+"\n");
            this.$$$socket.write("Connection: close\n\n");
            this.responseInitiated=true;
        }
        this.$$$socket.write(data);
    }
}

function serveResource(socket,resource)
{
    console.log('Resource to serve : '+resource);
    if(!fs.existsSync(resource))
    {
        errors.send404(socket,resource);
        return;
    }
    // do not use the following code instead write the one that sends chunks of 1024
    var bufferSize=1024; 
    var buffer=Buffer.alloc(bufferSize);
    file=resource;
    console.log("Opeaning file :"+file);
    var fileDescriptor=fs.openSync(file,"r");
    var data;
    var bytesExtracted;
    while(true)
    {
        bytesExtracted=fs.readSync(fileDescriptor,buffer,0,bufferSize);
        if(bytesExtracted==0)
        {
            fs.closeSync(fileDescriptor);
            break;
        }
        if(bytesExtracted<bufferSize)
        {
            data=buffer.slice(0,bytesExtracted);
        }
        else
        {
            data=buffer;
        }
    }
    //var data=fs.readFileSync(resource,"utf-8");
    var header="HTTP/1.1 200 OK\n";
    header=header+`Content-Type: ${mimeTypes.lookup(resource)}\n`;
    header=header+`Content-Length: ${data.length}\n`;
    header=header+"\n";
    var response=header+data;
    socket.write(response);
}

var httpServer=net.createServer(function(socket){
    socket.on('data',function(data){
        var request=requestParser.parseRequest(data,mappings);
        
        if(request.error!=0)
        {
            errors.processError(request.error,socket,request.resource);
            return;
        }
        if(request.isClientSideTechnologyResource)
        {
            serveResource(socket,request.resource);
        }
        else
        {
            console.log("Server side resource : "+request.resource+" will be processed");
            var service=require("./private/"+request.resource);
            service.processRequest(request,new Response(socket));
        }
    });
    socket.on('end',function(){
        console.log('connection closed by client');
    });
    socket.on('error',function(){
        console.log('Some error on client side');
    });
});

httpServer.listen(8080,'localhost');
console.log("TMWebProjector is UP : port 8080");
