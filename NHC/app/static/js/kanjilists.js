var examples = null;
var exID = null;

function sendKanjiList()
{
	var list = document.getElementById('lists').value;
	respList(sendData('http://localhost:5000/get-examples', list));
}

async function sendData(url, data)
{
	console.log('called sendData()');
	return new Promise((resolve, reject) =>
	{
		const xhttp = new XMLHttpRequest();
		xhttp.open("POST", url, true);
		xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhttp.send('list=' + data);
		
		xhttp.onload = () =>
		{
			resolve(xhttp.response);
		}
		xhttp.onerror = () =>
		{
			reject('Failed to reach the server with sendData()');
		}
	});
}	



function respList(request)
{
	const handleResponse = (response) =>
	{
		exID = null;
		//console.log(JSON.parse(response));
		examples = JSON.parse(response);
		document.getElementById('nextButton').disabled = false;
		nextExample();
	}
	const handleError = (response) =>
	{
		alert(response);
	}
	request.then(handleResponse).catch(handleError);
}

function nextExample()
{
	if(exID == null || exID >= examples.examples.length)
	{
		exID = 0;
	}
	else
	{
		exID++;
	}
	document.getElementById('Example').innerHTML = examples.examples[exID][0] + '<br>(source: ' + examples.examples[exID][1] + ')';
}