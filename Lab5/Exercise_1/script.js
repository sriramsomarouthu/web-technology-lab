let xmlDoc;

// ================= READ =================
function loadEmployees() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "employees.xml", true);
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                xmlDoc = xhr.responseXML;
                if (!xmlDoc) {
                    showMsg("Malformed XML file", "red");
                    return;
                }
                displayEmployees();
                showMsg("Employees loaded successfully", "green");
            } else {
                showMsg("Error loading XML file", "red");
            }
        }
    };
}

function displayEmployees() {
    let tbody = document.querySelector("#empTable tbody");
    tbody.innerHTML = "";

    let employees = xmlDoc.getElementsByTagName("employee");

    if (employees.length === 0) {
        showMsg("No employee records found", "red");
        return;
    }

    for (let emp of employees) {
        let row = `<tr>
            <td>${emp.getElementsByTagName("id")[0].textContent}</td>
            <td>${emp.getElementsByTagName("name")[0].textContent}</td>
            <td>${emp.getElementsByTagName("department")[0].textContent}</td>
            <td>${emp.getElementsByTagName("salary")[0].textContent}</td>
        </tr>`;
        tbody.innerHTML += row;
    }
}

// ================= CREATE =================
function addEmployee() {
    if (!xmlDoc) return showMsg("Load XML first", "red");

    let emp = xmlDoc.createElement("employee");

    emp.appendChild(createNode("id", eid.value));
    emp.appendChild(createNode("name", ename.value));
    emp.appendChild(createNode("department", edept.value));
    emp.appendChild(createNode("salary", esalary.value));

    xmlDoc.documentElement.appendChild(emp);
    displayEmployees();
    showMsg("Employee added (in memory)", "green");
}

// ================= UPDATE =================
function updateEmployee() {
    let employees = xmlDoc.getElementsByTagName("employee");
    let found = false;

    for (let emp of employees) {
        if (emp.getElementsByTagName("id")[0].textContent === eid.value) {
            emp.getElementsByTagName("department")[0].textContent = edept.value;
            emp.getElementsByTagName("salary")[0].textContent = esalary.value;
            found = true;
            break;
        }
    }

    found ? showMsg("Employee updated", "green")
          : showMsg("Employee ID not found", "red");

    displayEmployees();
}

// ================= DELETE =================
function deleteEmployee() {
    let employees = xmlDoc.getElementsByTagName("employee");

    for (let emp of employees) {
        if (emp.getElementsByTagName("id")[0].textContent === eid.value) {
            xmlDoc.documentElement.removeChild(emp);
            displayEmployees();
            showMsg("Employee deleted", "green");
            return;
        }
    }
    showMsg("Employee ID not found", "red");
}

// ================= UTIL =================
function createNode(tag, value) {
    let node = xmlDoc.createElement(tag);
    node.appendChild(xmlDoc.createTextNode(value));
    return node;
}

function showMsg(text, color) {
    let msg = document.getElementById("msg");
    msg.textContent = text;
    msg.style.color = color;
}