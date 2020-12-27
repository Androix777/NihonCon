//leading zeros
function pad(num, size) 
{
	num = num.toString();
	while (num.length < size) num = "0" + num;
	return num;
}

//collect all hotkeys
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
observer.observe(document.getElementById('Cell01Content'), {attributes: true, childList: true, subtree: true});

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

document.getElementById('Cell02').style.left = '650px';
document.getElementById('iFrame01').style.left = '1300px';
dragElement(document.getElementById('Cell01'));
dragElement(document.getElementById('Cell02'));
dragElement(document.getElementById('iFrame01'));