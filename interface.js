//cell types (maybe?..)
const CellTypes = Object.freeze({'Text': 1, 'iFrame': 2});
const CellFunctions = Object.freeze({'History': 1, 'ToolTip': 2});

//cell class
class Cell
{
	constructor(id, type, func)
	{
		this.fTypes = {};
		this.fTypes[CellFunctions.History] = this.respHistory;
		this.fTypes[CellFunctions.ToolTip] = this.respTooltip;
		
		this.id = id;
		this.type = type;
		this.hotkeys = ['hk1', 'hk2', 'hk3'];
		this.func = this.fTypes[func];
	}
	draw(x = 20, y = 20)
	{
		if(document.getElementById(this.id)) return; //already drawn
		
		var cell = document.createElement('div');
		cell.id = this.id;
		cell.className = 'Cell';
		cell.style.left = x + 'px';
		cell.style.top = y + 'px';
		document.getElementById('NihonCon').appendChild(cell);
		
		var cellTop = document.createElement('div');
		cellTop.id = this.id + 'Top';
		document.getElementById(this.id).appendChild(cellTop);
		
		var cellHead = document.createElement('div');
		cellHead.id = this.id + 'Head';
		cellHead.className = 'CellHead';
		cellHead.innerHTML = this.id;
		document.getElementById(this.id + 'Top').appendChild(cellHead);
		
		//hotkey
		var cellSelect = document.createElement('select');
		cellSelect.id = this.id + 'Hotkey';
		cellSelect.className = 'Hotkey';
		document.getElementById(this.id + 'Top').appendChild(cellSelect);
		
		this.hotkeys.forEach(fillHotkeys, this);
		function fillHotkeys(item, index)
		{
			var opt = document.createElement('option');
			opt.value = 'index:' + index + ' item:' + item;
			opt.innerHTML = 'index:' + index + ' item:' + item;
			document.getElementById(this.id + 'Hotkey').appendChild(opt);
		}
		
		var cellX = document.createElement('button');
		cellX.onclick = () => this.undraw();
		cellX.className = 'CellX';
		cellX.innerHTML = 'X';
		document.getElementById(this.id + 'Top').appendChild(cellX);
		
		var cellContent = document.createElement('div');
		cellContent.id = this.id + 'Content';
		cellContent.className = 'CellContent';
		document.getElementById(this.id).appendChild(cellContent);
		
		dragElement(document.getElementById(this.id));
	}
	undraw()
	{
		document.getElementById(this.id).remove();
		
		//remove tooltips
		let i = 1;
		while(document.getElementById(this.id + 'ToolTip' + pad(i, 2)))
		{
			document.getElementById(cellid + 'ToolTip' + pad(i, 2)).remove();
			document.getElementById(cellid + 'ToolTipText' + pad(i, 2)).remove();
			i++;
		}
	}
	
	//request types
	respHistory(request)
	{
		
		const handleResponse = (response) =>
		{
			console.log(response);
			document.getElementById(this.id + 'Content').appendChild(document.createTextNode(response));
			document.getElementById(this.id + 'Content').appendChild(document.createElement("br"));
		}
		const handleError = (response) =>
		{
			alert(response);
		}
		request.then(handleResponse).catch(handleError);
	}
	respTooltip(request)
	{
		
		const handleResponse = (response) =>
		{
			console.log(response);
			//example response for testing
			var exResp = '{"ttText":[' +
			'{"toolTip":[' +
				'{"description":["descr11"],"kana":"kana11"},' +
				'{"description":["descr12","descr13","descr14"],"kana":"kana12"}],' +
			'"word":"word1"},' +
			'{"toolTip":[' +
				'{"description":["descr21"],"kana":"kana21"}],' +
			'"word":"word2"}]}';
				
			//resp = exResp;
			var pResp = JSON.parse(response);
			
			//clean existing
			let j = 1;
			while(document.getElementById(this.id + 'ToolTip' + pad(j, 2)))
			{
				document.getElementById(this.id + 'ToolTip' + pad(j, 2)).remove();
				document.getElementById(this.id + 'ToolTipText' + pad(j, 2)).remove();
				j++;
			}
			
			//create tooltips
			for(let i = 0; i < pResp.ttText.length; i++)
			{
				var div = document.createElement('div');
				div.id = this.id + 'ToolTip' + pad(i + 1, 2);
				div.className = 'ToolTip';
				div.style.backgroundColor = '#99ff99';
				
				document.getElementById(this.id + 'Content').appendChild(div);
				var tip = document.createElement('div');
				tip.id = this.id + 'ToolTipText' + pad(i + 1, 2);
				tip.className = 'ToolTipText';
				
				div.textContent = pResp.ttText[i].word;
				
				var iHTML = '';
				for(let k = 0; k < pResp.ttText[i].toolTip.length; k++)
				{
					console.log(pResp.ttText[i].toolTip.length);
					
					iHTML += '<span class = "ttWord">';
					iHTML += pResp.ttText[i].word;
					iHTML += '</span>';
					iHTML += ' ';
					iHTML += '[<span class = "ttKana">';
					iHTML += pResp.ttText[i].toolTip[k].kana;
					iHTML += '</span>]';
					iHTML += ' ';
					for(let l = 0; l < pResp.ttText[i].toolTip[k].description.length; l++)
					{
						iHTML += '<span class = "ttMisc">';
						iHTML += '(' + (l + 1) + ')';
						iHTML += '</span>';
						iHTML += ' ';
						iHTML += '<span class = "ttDescr">';
						iHTML += pResp.ttText[i].toolTip[k].description[l];
						iHTML += '</span>';
						iHTML += '/';
					}
					iHTML = iHTML.slice(0, -1);
					iHTML += '<br>';
				}
				tip.innerHTML += iHTML;
				//tip.textContent = pResp.ttText[i].toolTip;
				document.getElementById('NihonCon').appendChild(tip);
				
				//attach tooltips to mouse
				var cellid = this.id;
				div.addEventListener('mousemove', function(e)
				{
					document.getElementById(cellid + 'ToolTipText' + pad(i + 1, 2)).style.left = (e.pageX - 20) + 'px';
					document.getElementById(cellid + 'ToolTipText' + pad(i + 1, 2)).style.top = (e.pageY + 20) + 'px';
					document.getElementById(cellid + 'ToolTipText' + pad(i + 1, 2)).style.visibility = 'visible';
				},false);		
				div.addEventListener('mouseleave', function(e)
				{
					document.getElementById(cellid + 'ToolTipText' + pad(i + 1, 2)).style.visibility = 'hidden';
				},false);	
			}
		}
		const handleError = (response) =>
		{
			alert(response);
		}
		request.then(handleResponse).catch(handleError);
	}
}

function testFunc(str = 'none')
{
	console.log('testFunc called with: ' + str);
}

//get clipboard, return it, clear it, nothing else
function getClipboard()
{
	var clip = document.getElementById('Clipboard').textContent;
	obsSend.disconnect();
	document.getElementById('Clipboard').innerHTML = '';
	obsSend.observe(document.getElementById('Clipboard'), {attributes: true, childList: true, subtree: true});
	return clip;
}

//send something, return response, nothing else
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

//iframe cell class
class iFrameCell extends Cell
{
	constructor(type, id, url)
	{
		super(type, id);
		this.url = url;
	}
	draw(x = 20, y = 20)
	{
		if(document.getElementById(this.id)) return; //already drawn
		
		var cell = document.createElement('div');
		cell.id = this.id;
		cell.className = 'iFrameCell';
		cell.style.left = x + 'px';
		cell.style.top = y + 'px';
		document.getElementById('NihonCon').appendChild(cell);
		
		var cellTop = document.createElement('div');
		cellTop.id = this.id + 'Top';
		document.getElementById(this.id).appendChild(cellTop);
		
		var cellHead = document.createElement('div');
		cellHead.id = this.id + 'Head';
		cellHead.className = 'iFrameCellHead';
		cellHead.innerHTML = this.id;
		document.getElementById(this.id + 'Top').appendChild(cellHead);
		
		//hotkey
		var cellSelect = document.createElement('select');
		cellSelect.id = this.id + 'Hotkey';
		cellSelect.className = 'Hotkey';
		document.getElementById(this.id + 'Top').appendChild(cellSelect);
		
		this.hotkeys.forEach(fillHotkeys, this);
		function fillHotkeys(item, index)
		{
			var opt = document.createElement('option');
			opt.value = 'index:' + index + ' item:' + item;
			opt.innerHTML = 'index:' + index + ' item:' + item;
			document.getElementById(this.id + 'Hotkey').appendChild(opt);
		}
		
		var cellX = document.createElement('button');
		cellX.onclick = () => this.undraw();
		cellX.className = 'CellX';
		cellX.innerHTML = 'X';
		document.getElementById(this.id + 'Top').appendChild(cellX);
		
		var cellContent = document.createElement('iframe');
		cellContent.id = this.id + 'Content';
		cellContent.className = 'extIFrame';
		document.getElementById(this.id).appendChild(cellContent);
		//cellContent.src = url;
		
		this.load(this.url);
		
		dragElement(document.getElementById(this.id));
	}
	load(url)
	{
		document.getElementById(this.id + 'Content').src = url;
	}
}

//read clipboard directly?
//seems there is no way to detect copy from outside the page
//aside from reading clipboard every x seconds...
async function getClipboardContents() 
{
  try 
  {
    const text = await navigator.clipboard.readText();
    console.log('Pasted content: ', text);
  } catch (err) 
  {
    console.error('Failed to read clipboard contents: ', err);
  }
}

//leading zeros
function pad(num, size) 
{
	num = num.toString();
	while (num.length < size) num = "0" + num;
	return num;
}

//collect all hotkeys
function gatherHotkeys()
{
	var i = 1;
	var hotkeys = new Array();
	while(document.getElementById('Cell' + pad(i, 2) + 'Hotkey'))
	{
		hotkeys.push(document.getElementById('Cell' + pad(i, 2) + 'Hotkey'));
		i++;
	}
	i = 1;
	while(document.getElementById('iFrame' + pad(i, 2) + 'Hotkey'))
	{
		hotkeys.push(document.getElementById('iFrame' + pad(i, 2) + 'Hotkey'));
		i++;
	}
}

//listen to keypresses
document.addEventListener('keydown', keyPressEvents);
function keyPressEvents(e)
{
	switch(e.code)
	{
		case 'Digit1':
			Cell02Content.textContent = window.getSelection().toString();
			break;
		case 'Digit2':
			//iFrame01Content.src = 'https://jisho.org' + '/search/' + window.getSelection().toString();
			document.getElementById('iFrame01Content').src = 'https://jisho.org' + '/search/' + window.getSelection().toString();
			break;
	}
}

//scroll Cell01 to bottom
const scrollToBottom = function (mutationsList, observer)
{
	hist = document.getElementById('Cell01Content');
	hist.scrollTop = hist.scrollHeight;
}

//send data from hidden div on change
const autoSend = function(mutationsList, observer)
{
	console.log('called autoSend()');
	clip = getClipboard();
	Cells[0].func(sendData('http://localhost:5000/text', clip));
	Cells[1].func(sendData('http://localhost:5000/text', clip));
}
 
//drag cells!
function dragElement(elem)
{
	var p1 = 0, p2 = 0, p3 = 0, p4 = 0;
	if(document.getElementById(elem.id + 'Head'))
	{
		document.getElementById(elem.id + 'Head').onmousedown = dragMouseDown;
	}
	function dragMouseDown(e)
	{
		e = e || window.event;
		e.preventDefault();
		p3 = e.clientX;
		p4 = e.clientY;
		document.onmouseup = closeDragElement;
		document.onmousemove = elementMove;
	}
	function elementMove(e)
	{
		e = e || window.event;
		e.preventDefault();
		p1 = p3 - e.clientX;
		p2 = p4 - e.clientY;
		p3 = e.clientX;
		p4 = e.clientY;
		elem.style.top = (elem.offsetTop - p2) + 'px';
		elem.style.left = (elem.offsetLeft - p1) + 'px';
	}
	function closeDragElement()
	{
		document.onmouseup = null;
		document.onmousemove = null;
	}
}

//observers are global
const obsScroll = new MutationObserver(scrollToBottom);
const obsSend = new MutationObserver(autoSend);

var Cells = new Array();

//initializing
function init()
{
	//does not work in firefox
	/*
	setInterval(function()
	{
		getClipboardContents();
	}, 5000);
	*/
	console.log(Cell);
	
	let Cell01 = new Cell('Cell01', CellTypes.Text, CellFunctions.History);
	Cells.push(Cell01);
	Cells[0].draw(20, 20);
	
	let Cell02 = new Cell('Cell02', CellTypes.Text, CellFunctions.ToolTip);
	Cells.push(Cell02);
	Cells[1].draw(670, 20);
	
	let Cell03 = new Cell('Cell03', CellTypes.Text, null);
	Cells.push(Cell03);
	Cells[2].draw(20, 240);
	
	//obsScroll.observe(document.getElementById('Cell01Content'), {attributes: true, childList: true, subtree: true});
	
	
	
	obsSend.observe(document.getElementById('Clipboard'), {attributes: true, childList: true, subtree: true});
	
	//we actually still have iframes...
	//let iFrame01 = new iFrameCell('iFrame01', CellTypes.iFrame, 'https://jisho.org');
	//iFrame01.draw(20, 320);
}

init();

