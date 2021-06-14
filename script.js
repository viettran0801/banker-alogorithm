let numProcess;
let numResource;
let maxs = [];
let allocations = [];
let resources = [];
let processes = [];
let availables = [];
let requests = [];
let needs = [];

// alogorithm

function isSafe() {
    let works = [...availables];
    let finishs = new Array(numProcess);
    for(let i = 0; i < numProcess; i ++) finishs[i] = false;
    let flag = true;

    clearArray(processes);

    while(flag) {
        flag = false;
        for(let i = 0; i < numProcess; i ++) {
            if(finishs[i] == false && isSmallerOrEqual(needs[i], works)) {
                finishs[i] = true;
                add(works, allocations[i]);
                flag = true;
                processes.push(i);
            }
        }
    }
    for(let i = 0; i < numProcess; i ++) {
        if(finishs[i] == false) return false;
    }

    return true;
}

function isDeadLock() {
    let works = [...availables];
    let finishs = new Array(numProcess);
    for(let i = 0; i < numProcess; i ++) {
        finishs[i] = isVectorZero(allocations[i]);
    }
    let flag = true;
    clearArray(processes);

    while(flag) {
        flag = false;
        for(let i = 0; i < numProcess; i ++) {
            if(finishs[i] == false && isSmallerOrEqual(requests[i], works)) {
                finishs[i] = true;
                add(works, allocations[i]);
                flag = true;
                processes.push(i);
            }
        }
    }
    for(let i = 0; i < numProcess; i ++) {
        if(finishs[i] == false) return true;
    }
    return false;
}

function isVectorZero(arr) {
    for(let i = 0; i < arr.length; i ++) {
        if(arr[i] !== 0) return false;
    }
    return true;
}

function add(self, other) {
    for(let i = 0; i < self.length; i ++) {
        self[i] += other[i];
    }
}

function isSmallerOrEqual(a, b) {
    for(let i = 0; i < a.length; i ++) {
        if(a[i] > b[i]) {
            return false;
        }
    }
    return true;
}

function clearArray(arr) {
    while(arr.length > 0) {
        arr.pop();
    }
}

function create2D(n, m) {
    let arr = new Array(n);
    for(let i = 0; i < n; i ++) {
        arr[i] = new Array(m);
    }
    return arr;
}

// input and render UI

function calcSafe() {
    const maxTable = document.getElementById('max');
    const alloTable = document.getElementById('allo');
    const res = document.getElementById('resources');
    const result = document.getElementById('result');
    const error = document.getElementById('error');
    result.innerHTML = "";
    error.innerHTML = "";

    try {    
        parseTextTo2DArray(maxTable.value, maxs);
        parseTextTo2DArray(alloTable.value, allocations);
        parseTextToArray(res.value, resources);   
    } catch (error) {
        error.innerHTML = 'Input is not correct format';
        return;
    }

    init(0);

    if(isSafe()) {
        result.innerHTML = `Safe: ${processes.map(v => `P${v}`).join('->')}`;
    }
    else {
        result.innerHTML = 'Not safe';
    }
}

function calcDeadLock() {
    const reqTable = document.getElementById('req');
    const alloTable = document.getElementById('allo');
    const res = document.getElementById('resources');
    const error = document.getElementById('error');
    result.innerHTML = "";
    error.innerHTML = "";

    try {    
        parseTextTo2DArray(reqTable.value, requests);
        parseTextTo2DArray(alloTable.value, allocations);
        parseTextToArray(res.value, resources);   
    } catch (error) {
        error.innerHTML= 'Input is not correct format';
        return;
    }

    init(1);

    if(!isDeadLock()) {
        result.innerHTML = `Hệ thống không bế tắc: ${processes.map(v => `P${v}`).join('->')}`;
    }
    else {
        let deadProcess = [];
        console.log(processes);
        for(let i = 0; i < numProcess; i ++) {
            if(!processes.includes(i)) {
                deadProcess.push(i);
            } 
        }
        result.innerHTML = `Các tiến trình đang chờ đợi lẫn nhau: ${deadProcess}`;
    }
}

function init(type) {
    clearArray(availables);
    clearArray(needs);

    for(let i = 0; i < numResource; i ++) {
        availables[i] = resources[i];
        for(let j = 0; j < numProcess; j ++) {
            availables[i] -= allocations[j][i];
        }
    }

    if(type === 1) return;

    for(let i = 0; i < numProcess; i ++) {
        needs.push([]);
        for(let j = 0; j < numResource; j ++) {
            needs[i].push(maxs[i][j] - allocations[i][j]);
        }
    }
}

function parseTextTo2DArray(s, arr) {
    const lines = s.split('\n').filter(line => line !== "");
    numProcess = lines.length;
    clearArray(arr);

    for(let i = 0; i < numProcess; i ++) {
        arr.push(lines[i].trim().split(/\s+/).map(v => Number.parseInt(v)));
    }
    numResource = arr[0].length;
}

function parseTextToArray(s, arr) {
    clearArray(arr);
    s.trim().split(/\s+/).map(v => Number.parseInt(v)).forEach(ele => {
        arr.push(ele);
    });
}


