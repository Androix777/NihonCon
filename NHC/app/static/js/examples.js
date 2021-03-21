async function sendData(url, data)
{
	console.log('called sendData()');
	return new Promise((resolve, reject) =>
	{
		const xhttp = new XMLHttpRequest();
		xhttp.open("POST", url, true);
		xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhttp.send('value=' + data);
		
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

function respHistory(request)
{
	
	const handleResponse = (response) =>
	{
		console.log(response);
		response = JSON.parse(response);
		
		for(let i = 0; i < response.examples.length; i++)
		{
			document.getElementById('Examples').innerHTML += response.examples[i][0] + ' (' + response.examples[i][1] + ')<br>';
		}
		
	}
	const handleError = (response) =>
	{
		alert(response);
	}
	request.then(handleResponse).catch(handleError);
}

respHistory(sendData('http://localhost:5000/get-examples', ''));