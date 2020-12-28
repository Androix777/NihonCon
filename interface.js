//cell types (maybe?..)
const CellTypes = Object.freeze({'Text': 1, 'iFrame': 2});

//cell class
class Cell
{
	constructor(id, type)
	{
		this.id = id;
		this.type = type;
		this.hotkeys = ['hk1', 'hk2', 'hk3'];
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
	}
}

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
async function getClipboardContents() {
  try {
    const text = await navigator.clipboard.readText();
    console.log('Pasted content: ', text);
  } catch (err) {
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
const sendData = function(mutationsList, observer)
{
	sendClipboard();
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
const obsSend = new MutationObserver(sendData);

function init()
{
	//does not work in firefox
	/*
	setInterval(function()
	{
		getClipboardContents();
	}, 5000);
	*/
	let Cell01 = new Cell('Cell01', CellTypes.Text);
	Cell01.draw(20, 20);
	
	obsScroll.observe(document.getElementById('Cell01Content'), {attributes: true, childList: true, subtree: true});
	
	let Cell02 = new Cell('Cell02', CellTypes.Text);
	Cell02.draw(670, 20);
	
	obsSend.observe(document.getElementById('Clipboard'), {attributes: true, childList: true, subtree: true});
	//let iFrame01 = new iFrameCell('iFrame01', CellTypes.iFrame, 'https://jisho.org');
	//iFrame01.draw(20, 320);
}

function sendClipboard()
{
	let clipAddress = 'http://localhost:5000/text';
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() 
	{
		if (this.readyState == 4 && this.status == 200) 
		{
			console.log('Response: ' + this.responseText);
			
			respHistory('Cell01', this.responseText);
			
			respTooltips('Cell02', this.responseText);
		}
	};
	xhttp.open("POST", clipAddress, true);
	xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhttp.send('value=' + document.getElementById('Clipboard').innerHTML);
	obsSend.disconnect();
	document.getElementById('Clipboard').innerHTML = '';
	obsSend.observe(document.getElementById('Clipboard'), {attributes: true, childList: true, subtree: true});
	
	function respHistory(cellid, resp)
	{
		document.getElementById(cellid + 'Content').appendChild(document.createTextNode(resp));
		document.getElementById(cellid + 'Content').appendChild(document.createElement("br"));
	}
	function respTooltips(cellid, resp)
	{
		if(document.getElementById('ttip'))
		{
			document.getElementById('ttip').remove();
		}
		var div = document.createElement('div');
		div.id = 'ttip';
		div.className = 'ToolTip';
		div.textContent = resp;
		document.getElementById(cellid + 'Content').appendChild(div);
		var span = document.createElement('span');
		span.className = 'ToolTipText';
		span.textContent = 'Tooltip for: ' + resp;
		div.appendChild(span);
	}
}

init();