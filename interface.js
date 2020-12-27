//cell types (maybe?..)
const CellTypes = Object.freeze({'Text': 1, 'iFrame': 2});

//cell class
class Cell
{
	constructor(type, id)
	{
		this.type = type;
		this.id = id;
		this.hotkeys = ['hk1', 'hk2', 'hk3'];
	}
	draw(x = 0, y = 0)
	{
		if(document.getElementById(this.id)) return;
		var cell = document.createElement('div');
		cell.id = this.id;
		cell.className = 'Cell'; //tochange
		cell.style.left = x + 'px';
		cell.style.top = y + 'px';
		document.getElementById('NihonCon').appendChild(cell);
		
		var cellTop = document.createElement('div');
		cellTop.id = this.id + 'Top';
		document.getElementById(this.id).appendChild(cellTop);
		
		var cellHead = document.createElement('div');
		cellHead.id = this.id + 'Head';
		cellHead.className = 'CellHead'; //tochange
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
		
		var cellContent = document.createElement('div');
		cellContent.id = this.id + 'Content';
		cellContent.className = 'CellContent'; //tochange
		document.getElementById(this.id).appendChild(cellContent);
		
		dragElement(document.getElementById(this.id));
	}
	undraw()
	{
		document.getElementById(this.id).remove();
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
//getClipboardContents();

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
			iFrame01Content.src = 'https://jisho.org' + '/search/' + window.getSelection().toString();
			break;
	}
}

//scroll History to bottom
const scrollToBottom = function (mutationsList, observer)
{
	hist = document.getElementById('Cell01Content');
	hist.scrollTop = hist.scrollHeight;
}
const observer = new MutationObserver(scrollToBottom);

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

function init()
{
	let cell1 = new Cell(CellTypes.Text, 'Cell01');
	cell1.draw(20, 20);
	observer.observe(document.getElementById('Cell01Content'), {attributes: true, childList: true, subtree: true});
	let cell2 = new Cell(CellTypes.Text, 'Cell02');
	cell2.draw(670, 20);
	
	document.getElementById('iFrame01').style.left = 1370;
	document.getElementById('iFrame01').style.top = 20;
	dragElement(document.getElementById('iFrame01'));
}

init();