exports.getDate=getDate;
function getDate()
{
    var today = new Date();
    var dateString=today.toLocaleDateString('en-us',{ weekday:"long", day:"numeric",month:"long"});
    return dateString;
}
exports.getDay=()=>{
    var today = new Date();
    var dateString=today.toLocaleDateString('en-us',{ weekday:"long"});
    return dateString;   
}

