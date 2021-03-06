
//cell functions
const CellFunctions = Object.freeze({'Nothing': 1, 'History': 2, 'ToolTip': 3, 'PlainInput': 50});

//observers are global
const obsSend = new MutationObserver(autoSend);

//array of cells
var Cells = new Array();

//cannot access cell class before initialization
class Cell
{
	constructor(id, func)
	{
		this.fTypes = {};
		this.fTypes[CellFunctions.Nothing] = null;
		this.fTypes[CellFunctions.History] = this.respHistory;
		this.fTypes[CellFunctions.ToolTip] = this.respTooltip;
		
		this.urls = {};
		this.urls[CellFunctions.Nothing] = '/';
		this.urls[CellFunctions.History] = '/history';
		this.urls[CellFunctions.ToolTip] = '/tooltip';
		
		this.id = id;
		this.func = this.fTypes[func];
		this.url = this.urls[func];
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
		
		var cellX = document.createElement('button');
		cellX.onclick = () => 
		{
			Cells.splice(Cells.indexOf(this), 1);
			this.undraw();
		}
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
			document.getElementById(this.id + 'Content').appendChild(document.createElement("br"));
			document.getElementById(this.id + 'Content').scrollTop = document.getElementById(this.id + 'Content').scrollHeight;
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
				div.style.color = '#000000';
				
				document.getElementById(this.id + 'Content').appendChild(div);
				var tip = document.createElement('div');
				tip.id = this.id + 'ToolTipText' + pad(i + 1, 2);
				tip.className = 'ToolTipText';
				
				if(pResp.ttText[i].toolTip && pResp.ttText[i].toolTip[0].kana)
				{
					div.innerHTML = '<ruby>' + pResp.ttText[i].word + '<rt>' + pResp.ttText[i].toolTip[0].kana + '</rt></ruby>';
				}
				else
				{
					div.textContent = pResp.ttText[i].word;
				}
				let iHTML = '';
				if(pResp.ttText[i].toolTip) 
				{
					for(let k = 0; k < pResp.ttText[i].toolTip.length; k++)
					{
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
					tip.innerHTML = iHTML;
				}
				else
				{
					tip.innerHTML = '<span class = "ttWord">No tooltip</span>';
				}
				
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

class Input
{
	constructor(id)
	{
		this.id = id;
	}
	draw(x = 20, y = 20)
	{
		if(document.getElementById(this.id)) return; //already drawn
		
		var input = document.createElement('div');
		input.id = this.id;
		input.className = 'Input';
		input.style.left = x + 'px';
		input.style.top = y + 'px';
		document.getElementById('NihonCon').appendChild(input);
		
		var inputTop = document.createElement('div');
		inputTop.id = this.id + 'Top';
		document.getElementById(this.id).appendChild(inputTop);
		
		var inputHead = document.createElement('div');
		inputHead.id = this.id + 'Head';
		inputHead.className = 'InputHead';
		inputHead.innerHTML = this.id;
		document.getElementById(this.id + 'Top').appendChild(inputHead);
		
		var inputX = document.createElement('button');
		inputX.onclick = () => 
		{
			this.undraw();
		}
		inputX.className = 'CellX';
		inputX.innerHTML = 'X';
		document.getElementById(this.id + 'Top').appendChild(inputX);
		
		var inputContent = document.createElement('textarea');
		inputContent.id = this.id + 'Content';
		inputContent.className = 'InputContent';
		document.getElementById(this.id).appendChild(inputContent);
		
		
		var inputControls = document.createElement('div');
		inputControls.id = this.id + 'Controls';
		document.getElementById(this.id).appendChild(inputControls);
		
		var sendButton = document.createElement('button');
		sendButton.onclick = () =>
		{
			inputSend(inputContent.value);
		}
		sendButton.innerHTML = 'Send';
		inputControls.appendChild(sendButton);
		
		dragElement(document.getElementById(this.id));
	}
	undraw()
	{
		document.getElementById(this.id).remove();
	}
}
	

//call init() now
init();

//create buttons, link observers, stuff like that
function init()
{
	newButton = document.createElement('button');
	newButton.className = 'NewButton';
	newButton.textContent = '+';
	newButton.onclick = newCellPopup;
	document.getElementById('NihonCon').appendChild(newButton);
	
	themeButton = document.createElement('button');
	themeButton.className = 'ThemeButton';
	themeButton.textContent = 'Theme';
	themeButton.onclick = () =>
	{
		if(document.getElementById('Theme').innerHTML == '@import url("./css/style.css")')
		{
			setTheme('dark');
		}
		else
		{
			setTheme('style');
		}
	};
	document.getElementById('NihonCon').appendChild(themeButton);
	
	let Cell01 = new Cell('testHistory', CellFunctions.History);
	Cells.push(Cell01);
	Cells[0].draw(20, 320);
	
	let Cell02 = new Cell('testToolTip', CellFunctions.ToolTip);
	Cells.push(Cell02);
	Cells[1].draw(670, 320);
	
	let Input01 = new Input('testInput', CellFunctions.PlainInput);
	Input01.draw(670, 20);
	
	obsSend.observe(document.getElementById('Clipboard'), {attributes: true, childList: true, subtree: true});
}


//will make themes later
function setTheme(theme)
{
	document.getElementById('Theme').innerHTML = '@import url("./css/' + theme + '.css")';
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

//leading zeros
function pad(num, size) 
{
	num = num.toString();
	while (num.length < size) num = "0" + num;
	return num;
}

//send data from hidden div on change
function autoSend(mutationsList, observer)
{
	console.log('called autoSend()');
	clip = getClipboard();
	Cells.forEach((item, index) =>
	{
		item.func(sendData('http://localhost:5000' + item.url, clip));
	});
}

//send from input
function inputSend(input)
{
	Cells.forEach((item, index) =>
	{
		item.func(sendData('http://localhost:5000' + item.url, input));
	});
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

//create new cell
function newCellPopup()
{
	modal = document.createElement('div');
	modal.className = 'Modal';
	document.getElementById('NihonCon').appendChild(modal);
	mWindow = document.createElement('div');
	mWindow.className = 'ModalWindow';
	iID = document.createElement('input');
	iID.id = 'iID';
	iID.value = 'Cell01';
	mWindow.appendChild(iID);
	iType = document.createElement('select');
	iType.id = 'iType';
	Object.keys(CellFunctions).forEach((key) =>
	{
		opt = document.createElement('option');
		opt.value = key;
		opt.textContent = key;
		iType.appendChild(opt);
	});
	mWindow.appendChild(iType);
	cBtn = document.createElement('button');
	cBtn.textContent = 'Create';
	cBtn.onclick = () =>
	{
		console.log(CellFunctions[iType.options[iType.selectedIndex].value]);
		Cells.push(new Cell(iID.value, CellFunctions[iType.options[iType.selectedIndex].value]));
		Cells[Cells.length - 1].draw();
		modal.remove();
	}
	mWindow.appendChild(cBtn);
	modal.appendChild(mWindow);
}


//unused:

/*

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

//read clipboard directly?
//does not work in firefox
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
*/