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

//TODO - loadFromFile() - return the XML