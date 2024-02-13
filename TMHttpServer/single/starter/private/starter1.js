var thisModule=this;
exports.processRequest=function(request,response)
{
    var name=request.data["nm"];
    var city=request.data["ct"];
    var gender=request.data["gender"];
    console.log(name);
    console.log(city);
    console.log(gender);
    response.setContentType("text/html");
    
    response.write("<!DOCTYPE html>");
    response.write("<html lang='en'>");
    response.write("<head>");
    response.write("<meta charset='utf-8'>");
    response.write("<title>Server Side Processing Example</title>");
    response.write("</head>");
    response.write("<body>");
    response.write("<h1>All is Well</h1><br>");
    response.write("Hello, "+name+"<br>");
    response.write("<a href='index.html'>Home</a>");
    response.write("</body>");
    response.write("</html>");

    /*
    var body="<!DOCTYPE HTML>";
    body=body+"<html lang='en'>";
    body=body+"<head>";
    body=body+"<meta charset='utf-8'>";
    body=body+"<title>Cool Server Side Processing Example</title>";
    body=body+"</head>";
    body=body+"<body>";
    body=body+"<center>";
    body=body+"<h1>All is Well</h1>";
    body=body+"<p>"+city+" is the city of Gods.</p>";
    body=body+"<a href='/index.html'>Home</a>";
    body=body+"</center>";
    body=body+"</body>";
    body=body+"</html>";
    var header="HTTP/1.1 200 OK\n";
    header=header+new Date().toGMTString()+"\n";
    header=header+"Server: TMWebProjector\n";
    header=header+"Content-Type: text/html\n";
    header=header+"Content-length: "+body.length+"\n";
    header=header+"Connection: close\n";
    header=header+"\n";
    response.write(header+body);
    */
}
