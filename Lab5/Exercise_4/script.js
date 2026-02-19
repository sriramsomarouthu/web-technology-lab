let products = [];

// ================= LOAD (FETCH API) =================
function loadInventory() {
    fetch("inventory.json")
        .then(res => res.json())
        .then(data => {
            products = data.products;
            displayProducts(products);
            showMsg("Inventory loaded successfully", "green");
        })
        .catch(() => showMsg("Error loading JSON data", "red"));
}

// ================= DISPLAY =================
function displayProducts(list) {
    let tbody = document.querySelector("#inventoryTable tbody");
    tbody.innerHTML = "";
    let total = 0;

    list.forEach(p => {
        let row = document.createElement("tr");

        if (p.stock < 10) row.classList.add("low-stock");

        row.innerHTML = `
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>${p.price}</td>
            <td>${p.stock}</td>
        `;

        tbody.appendChild(row);
        total += p.price * p.stock;
    });

    document.getElementById("totalValue").textContent = total;
}

// ================= VALIDATION =================
function validate() {
    if (!pid.value || !pname.value || !pcategory.value || !pprice.value || !pstock.value) {
        showMsg("All fields are required", "red");
        return false;
    }
    if (pprice.value <= 0 || pstock.value < 0) {
        showMsg("Invalid price or stock value", "red");
        return false;
    }
    return true;
}

// ================= ADD =================
function addProduct() {
    if (!validate()) return;

    products.push({
        id: Number(pid.value),
        name: pname.value,
        category: pcategory.value,
        price: Number(pprice.value),
        stock: Number(pstock.value)
    });

    displayProducts(products);
    showMsg("Product added", "green");
}

// ================= UPDATE =================
function updateProduct() {
    let found = false;

    products.forEach(p => {
        if (p.id == pid.value) {
            p.price = Number(pprice.value);
            p.stock = Number(pstock.value);
            found = true;
        }
    });

    found ? showMsg("Product updated", "green")
          : showMsg("Product ID not found", "red");

    displayProducts(products);
}

// ================= DELETE =================
function deleteProduct() {
    let index = products.findIndex(p => p.id == pid.value);

    if (index !== -1) {
        products.splice(index, 1);
        displayProducts(products);
        showMsg("Product deleted", "green");
    } else {
        showMsg("Product ID not found", "red");
    }
}

// ================= SEARCH =================
function searchByCategory() {
    let cat = searchCat.value.toLowerCase();
    let filtered = products.filter(p => p.category.toLowerCase() === cat);
    displayProducts(filtered);
}

// ================= UTIL =================
function showMsg(text, color) {
    let msg = document.getElementById("msg");
    msg.textContent = text;
    msg.style.color = color;
}