const transactionForm = document.getElementById('transaction-form')
const descriptionInput = document.getElementById('description')
const amountInput = document.getElementById('amount')
const transactionList = document.getElementById('transaction-list')

const balanceDisplay = document.getElementById('balance')
const incomeDisplay = document.getElementById('income')
const expensesDisplay = document.getElementById('expenses')

const incomeChart = document.getElementById('income-chart')
const expenseChart = document.getElementById('expense-chart')

const allFilter = document.getElementById('all-filter')
const incomeFilter = document.getElementById('income-filter')
const expenseFilter = document.getElementById('expense-filter')

let transactions = []

transactionForm.addEventListener('submit', function (event) {
  event.preventDefault()

  const description = descriptionInput.value.trim()
  const amount = Number(amountInput.value)

  if (description === '' || amount === 0) {
    return
  }

  const transaction = {
    id: Date.now(),
    description,
    amount,
    date: new Date().toLocaleDateString()
  }

  transactions.push(transaction)

  saveTransactions()
  displayTransactions()
  updateTotals()
  updateChart()

  descriptionInput.value = ''
  amountInput.value = ''
})

function displayTransactions (filter = 'all') {
  transactionList.innerHTML = ''

  let filteredTransactions = transactions

  if (filter === 'income') {
    filteredTransactions = transactions.filter(function (transaction) {
      return transaction.amount > 0
    })
  }

  if (filter === 'expense') {
    filteredTransactions = transactions.filter(function (transaction) {
      return transaction.amount < 0
    })
  }

  filteredTransactions.forEach(function (transaction) {
    const listItem = document.createElement('li')

    listItem.className =
      transaction.amount >= 0 ? 'income-item' : 'expense-item'

    listItem.innerHTML = `
      <div class="transaction-info">
        <div>
          <span>${transaction.description}</span>
          <small>${transaction.date}</small>
        </div>

        <span class="transaction-amount">
          ${transaction.amount >= 0 ? '+' : '-'}${Math.abs(
            transaction.amount
          ).toFixed(0)} FCFA
        </span>
      </div>

      <button type="button" class="delete-button" data-id="${transaction.id}">
        Delete
      </button>
    `

    transactionList.appendChild(listItem)
  })
}

function updateTotals () {
  const amounts = transactions.map(function (transaction) {
    return transaction.amount
  })

  const income = amounts
    .filter(function (amount) {
      return amount > 0
    })
    .reduce(function (total, amount) {
      return total + amount
    }, 0)

  const expenses = amounts
    .filter(function (amount) {
      return amount < 0
    })
    .reduce(function (total, amount) {
      return total + amount
    }, 0)

  const balance = income + expenses

  balanceDisplay.textContent = `${balance.toFixed(0)} FCFA`
  incomeDisplay.textContent = `${income.toFixed(0)} FCFA`
  expensesDisplay.textContent = `${Math.abs(expenses).toFixed(0)} FCFA`
}

function updateChart () {
  const income = transactions
    .filter(function (transaction) {
      return transaction.amount > 0
    })
    .reduce(function (total, transaction) {
      return total + transaction.amount
    }, 0)

  const expenses = transactions
    .filter(function (transaction) {
      return transaction.amount < 0
    })
    .reduce(function (total, transaction) {
      return total + Math.abs(transaction.amount)
    }, 0)

  const highestAmount = Math.max(income, expenses, 1)

  const incomeHeight = (income / highestAmount) * 150
  const expenseHeight = (expenses / highestAmount) * 150

  incomeChart.style.height = `${incomeHeight}px`
  expenseChart.style.height = `${expenseHeight}px`
}

function setActiveFilter (activeButton) {
  allFilter.classList.remove('active')
  incomeFilter.classList.remove('active')
  expenseFilter.classList.remove('active')

  activeButton.classList.add('active')
}

transactionList.addEventListener('click', function (event) {
  if (!event.target.classList.contains('delete-button')) {
    return
  }

  const transactionId = Number(event.target.dataset.id)

  transactions = transactions.filter(function (transaction) {
    return transaction.id !== transactionId
  })

  saveTransactions()
  displayTransactions()
  updateTotals()
  updateChart()
})

allFilter.addEventListener('click', function () {
  displayTransactions('all')
  setActiveFilter(allFilter)
})

incomeFilter.addEventListener('click', function () {
  displayTransactions('income')
  setActiveFilter(incomeFilter)
})

expenseFilter.addEventListener('click', function () {
  displayTransactions('expense')
  setActiveFilter(expenseFilter)
})

function saveTransactions () {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

function loadTransactions () {
  const data = localStorage.getItem('transactions')

  if (data) {
    transactions = JSON.parse(data)
  }
}

loadTransactions()
displayTransactions()
updateTotals()
updateChart()
setActiveFilter(allFilter)
