$(document).ready(function(){
    $('.tabs').tabs();
    $('.modal-trigger').leanModal();

});
$('a').click(function(){
    index = $(this).attr("id");
});

let index = 0;
var pastTime = 0;
var firstLoad = true;
var dataRecord = [];

webgazer.setGazeListener((data, time) => {
    if (data) {
        dataRecord.push([data.x, data.y, time])
    }
})



// START EYETRACKER
document.getElementById("start").onclick = function(e){
    dataRecord = [];
    document.getElementById("divFinish").style.display = "block";
    document.getElementById("menu").style.display = "none";
    document.getElementById("divStart").style.display = "none";

    if(firstLoad) webgazer.begin()
    else webgazer.resume();
    firstLoad = false;
    
}

// FINISH EYETRAKER
document.getElementById("finish").onclick = function(e){
     
    document.getElementById("divFinish").style.display = "none";
    document.getElementById("menu").style.display = "block";
    document.getElementById("divStart").style.display = "block";
    
    webgazer.pause()

    var points = [];
    let max = 300;
    var cont = 0;
    dataRecord.forEach(function(row) {
        var point = {
            x: parseInt(row[0]), 
            y: parseInt(row[1]), 
            value: Math.floor(parseInt(row[2])/200) - pastTime
        }
        points.push(point);
    });
    pastTime =  Math.floor(parseInt(points[points.length-1].value)) ;

    var data = {
        max: max,
        data: points
    };

    var website =''
    if (index == 0 ) website = '#apple'; 
    else if (index == 1 ) website = '#samsung'; 
    else website = '#xiaomi'
    
    // GENERATE HEATMAP
    var heatmapInstance = h337.create({
        container: document.querySelector(website),
    });
    heatmapInstance.setData (data);

    // SET CANVAS AS MODAL TO DOWNLOAD
    html2canvas(document.querySelector(website)).then(canvas => {
    canvas.id = 'canvitas';
    const modal = document.querySelector('#modal');
    var child = modal.lastElementChild; 
    while (child) {
        modal.removeChild(child);
        child = modal.lastElementChild;
    }
        modal.appendChild(canvas);
    });
    $('.heatmap-canvas').remove();

}
// document.getElementById("download").onclick = function(e){
//     //var canvas = document.getElementById("canvitas");
//     //var img    = canvas.toDataURL("image/png");
//     //document.write('<img src="'+img+'"/>');
    
//     html2canvas(document.querySelector("#canvitas"),{allowTaint: true,
//         foreignObjectRendering: true,useCORS: true}).then(canvas => {
//         document.write('<a href="javascript:"'+canvas.toDataURL('image/jpeg')+' download="download" >Download as jpeg</a>');

//         var link = document.createElement('a');
//          link.href = canvas.toDataURL('image/jpeg');;
//          link.download = 'apple.png';
//          link.click();

//         //     document.body.appendChild(canvas)
// //     // var div = document.createElement('div');
// //     // div.setAttribute("id", "divimag");
// //     // div.appendChild(canvas);
// //     // document.body.appendChild(div)
// //     //html2canvas(document.querySelector("#divimag"), {allowTaint: true, foreignObjectRendering: true}).then(canva => {
// //         var link = document.createElement('a');
// //         link.href = canvas.toDataURL();;
// //         link.download = 'apple.png';
// //         link.click();

// //         var canvas = document.getElementById("mycanvas");
// //     //var img    = canvas.toDataURL("image/png");
// //     //document.write('<img src="'+img+'"/>');
// //     document.write('<a href="javascript:"'+canvas.toDataURL('image/jpeg')+' download="download" >Download as jpeg</a>');

// //     //});
    
//  });
// }