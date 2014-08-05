function download(filename, data){
	if(navigator.userAgent.indexOf(".NET") == -1) { //Real browsers 
		var a = window.document.createElement('a');
		a.href = window.URL.createObjectURL(new Blob([data], {type: 'text/plain;charset=utf-8;'}));
		a.download = filename;

		// Append anchor to body.
		document.body.appendChild(a)
		a.click();

		// Remove anchor from body
		document.body.removeChild(a)
	} 
	else {  //IE-Specific code, because...ya'know IE ... 
		var content=data; 
		var blob = new Blob([content],{
		    type: "text/plain;charset=utf-8;"
		});

		navigator.msSaveBlob(blob, filename)
	}
}

function readFile(ev){
	var fr = new FileReader();
	fr.onload = function(e) {
		//alert(fr.result);
		loadXML(fr.result);
	}
	fr.readAsText(ev.target.files[0]);
}

function loadFile() {
	var input = window.document.createElement('input');
	input.type = 'file';
	document.body.appendChild(input)
	input.addEventListener('change', readFile);
	input.click();
	document.body.removeChild(input);
}