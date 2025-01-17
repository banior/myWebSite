let draggedItem = null;

function handleDragStart(e) {
    draggedItem = this;
    setTimeout(() => this.style.display = 'none', 0);
}

function handleDragEnd() {
    this.style.display = 'block';
    draggedItem = null;
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    const mainBlock = document.querySelector('.main-block');
    const rect = mainBlock.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (draggedItem) {
        draggedItem.style.position = 'absolute';
        draggedItem.style.left = `${x}px`;
        draggedItem.style.top = `${y}px`;
        mainBlock.appendChild(draggedItem);
        draggedItem.style.background = getRandomColor();
    }
    draggedItem = null;
}

function handleBlock2Drop(e) {
    e.preventDefault();
    if (draggedItem) {
        const block2 = document.getElementById('block2');
        draggedItem.style.position = '';
        draggedItem.style.left = '';
        draggedItem.style.top = '';
        block2.appendChild(draggedItem);
        draggedItem.style.background = '#FFD700';
        sortBlock2();
    }
    draggedItem = null;
}

function sortBlock2() {
    const block2 = document.getElementById('block2');
    const items = Array.from(block2.children);
    items.sort((a, b) => a.textContent.localeCompare(b.textContent));
    items.forEach(item => block2.appendChild(item));
}

function parseInput() {
    const inputField = document.getElementById('inputField').value;
    const block2 = document.getElementById('block2');
    block2.innerHTML = '';

    if (!inputField) return;

    const parts = inputField.split('-')
    .map(part => part.trim())
    .filter(part => part)
    .filter((part, index, array) => array.indexOf(part) === index);
    
    
    const wordsLower = [];
    const wordsUpper = [];
    const numbers = [];

    parts.forEach(part => {
        if (!isNaN(part)) {
            numbers.push(Number(part));
        } else if (part[0] === part[0].toUpperCase()) {
            wordsUpper.push(part);
        } else {
            wordsLower.push(part);
        }
    });

    wordsLower.sort();
    wordsUpper.sort();
    numbers.sort((a, b) => a - b);

    const sortedElements = {};

    let index = 1;
    wordsLower.forEach(word => {
        sortedElements[`a${index++}`] = word;
    });
    index = 1;
    wordsUpper.forEach(word => {
        sortedElements[`b${index++}`] = word;
    });
    index = 1;
    numbers.forEach(number => {
        sortedElements[`n${index++}`] = number.toString();
    });

    for (const key in sortedElements) {
        const element = document.createElement('div');
        element.className = 'draggable';
        element.draggable = true;
        element.textContent = `${key} ${sortedElements[key]}`;

        element.addEventListener('dragstart', handleDragStart);
        element.addEventListener('dragend', handleDragEnd);
        element.addEventListener('click', () => {
            if (element.parentNode.classList.contains('main-block')) {
                document.getElementById('selectedWord').textContent += " " + sortedElements[key];
            }
        });

        block2.appendChild(element);
    }
}
function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

document.querySelector('.main-block').addEventListener('dragover', handleDragOver);
document.querySelector('.main-block').addEventListener('drop', handleDrop);
document.getElementById('block2').addEventListener('dragover', handleDragOver);
document.getElementById('block2').addEventListener('drop', handleBlock2Drop);