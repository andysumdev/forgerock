$(document).ready(function(){
    $.ajax({
  		url: "/getUploads",
  		cache: false,
  		success: function(data){
			var gallery = "";
			var galleryJSON = jQuery.parseJSON(data);
			$.each(galleryJSON, function(key, value){
    			gallery += "<div id=\"" + value.imgID + "\" class = col-lg-3 col-md-4 col-xs-6>" +
							"<a href=\"#\" class=\"d-block\">" +
                			"<img class=\"img-fluid img-thumbnail\" src=\"images/" + value.fileName + "\" alt=\"\">" +
            				"</a><ul><li><b>Name:</b> " + value.fileName + "</li><li><b>Size:</b> " + value.fileSize + " (bytes)</li>" +
							"<li><b>Type:</b> " + value.mimeType + "</li><li><b>Upload Date:</b> " + value.uploadDate + "</li></div>";
			});
			if(gallery === ""){
				$("#galleryContainer").html("No Images Uploaded");
			}else{
				$("#galleryContainer").html(gallery);
			}
  		}
	});
});
