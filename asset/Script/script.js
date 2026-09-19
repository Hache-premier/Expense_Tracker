const transactionForm = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const transactionList = document.getElementById("transaction-list");

const balanceDisplay = document.getElementById("balance");
const incomeDisplay = document.getElementById("income");
const expensesDisplay = document.getElementById("expenses");

const allFilter = document.getElementById("all-filter");
const incomeFilter = document.getElementById("income-filter");
const expenseFilter = document.getElementById("expense-filter");

let transactions = [];

transactionForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);

    if (description === "" || amount === 0) {
        return;
    }

    const transaction = {
        id: Date.now(),
        description: description,
        amount: amount
    };

    transactions.push(transaction);

    descriptionInput.value = "";
    amountInput.value = "";

    console.log(transactions);
});

function displayTransactions() {
    transactionList.innerHTML = "";

    transactions.forEach(function (transaction) {
        const listItem = document.createElement("li");

        listItem.className = transaction.amount >= 0 ? "income-item" : "expense-item";

        listItem.innerHTML = `
            <div class="transaction-info">
                <span>${transaction.description}</span>
                <span>${transaction.amount >= 0 ? "+" : "-"}$${Math.abs(transaction.amount).toFixed(2)}</span>
            </div>

            <button type="button" class="delete-button" data-id="${transaction.id}">
                Delete
            </button>
        `;

        transactionList.appendChild(listItem);
    });
}
