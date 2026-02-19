let xmlDoc;

// ================= LOAD (AJAX GET) =================
function loadBooks() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "books.xml", true);
    xhr.send();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                xmlDoc = xhr.responseXML;
                if (!xmlDoc) {
                    showMsg("Malformed XML file", "red");
                    return;
                }
                displayBooks();
                showMsg("Books loaded successfully", "green");
            } else {
                showMsg("Error loading XML", "red");
            }
        }
    };
}

// ================= DISPLAY =================
function displayBooks() {
    let tbody = document.querySelector("#bookTable tbody");
    tbody.innerHTML = "";

    let books = xmlDoc.getElementsByTagName("book");

    if (books.length === 0) {
        showMsg("No books found", "red");
        return;
    }

    for (let book of books) {
        let row = `<tr>
            <td>${book.getElementsByTagName("id")[0].textContent}</td>
            <td>${book.getElementsByTagName("title")[0].textContent}</td>
            <td>${book.getElementsByTagName("author")[0].textContent}</td>
            <td>${book.getElementsByTagName("status")[0].textContent}</td>
        </tr>`;
        tbody.innerHTML += row;
    }
}

// ================= ADD BOOK =================
function addBook() {
    if (!validate()) return;

    let book = xmlDoc.createElement("book");

    book.appendChild(createNode("id", bid.value));
    book.appendChild(createNode("title", btitle.value));
    book.appendChild(createNode("author", bauthor.value));
    book.appendChild(createNode("status", bstatus.value));

    xmlDoc.documentElement.appendChild(book);
    displayBooks();
    showMsg("Book added successfully", "green");
}

// ================= UPDATE STATUS =================
function updateStatus() {
    let books = xmlDoc.getElementsByTagName("book");
    let found = false;

    for (let book of books) {
        if (book.getElementsByTagName("id")[0].textContent === bid.value) {
            book.getElementsByTagName("status")[0].textContent = bstatus.value;
            found = true;
            break;
        }
    }

    found ? showMsg("Status updated", "green")
          : showMsg("Book ID not found", "red");

    displayBooks();
}

// ================= DELETE BOOK =================
function deleteBook() {
    let books = xmlDoc.getElementsByTagName("book");

    for (let book of books) {
        if (book.getElementsByTagName("id")[0].textContent === bid.value) {
            xmlDoc.documentElement.removeChild(book);
            displayBooks();
            showMsg("Book deleted", "green");
            return;
        }
    }
    showMsg("Book ID not found", "red");
}

// ================= VALIDATION =================
function validate() {
    if (!xmlDoc) {
        showMsg("Load XML first", "red");
        return false;
    }
    if (!bid.value || !btitle.value || !bauthor.value || !bstatus.value) {
        showMsg("All fields are required", "red");
        return false;
    }
    return true;
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