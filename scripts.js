//Seleciona os elementos do Form
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

//Seleciona o elemento da lista
const expenseList = document.querySelector("ul")
const expensesTotal = document.querySelector("aside header h2")
const expensesQuantity = document.querySelector("aside header p span")

//Captura o evento de input para formamtar o valor
amount.oninput = () => {
  //Obtem o valor atual do input e remove os caracteres nao numericos
  let value = amount.value.replace(/\D/g, "")

  //Transformar o valor em centavos
  value = Number(value) / 100

  //Atualiza o valor do input
  amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value) {
  //Formata o valor no padrao BRL (Real Brasileiro)
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  //Retorna o valor formatado
  return value
}

//Captura o evento de submit do form para obter os valores
form.onsubmit = (event) => {
  //Previne o comportamento padrao de recarregar a pagina
  event.preventDefault()

  //Cria um objeto com os detalhes na nova despesa
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  }

  //Chama a funcao que ira adicionar o item na lista
  expenseAdd(newExpense)
}

//Adiciona um novo item na lista
function expenseAdd(newExpense) {
  try {
    //Cria o elemento para adicionar o item (li) na lista (ul)
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    //Cria o icone da categoria
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)

    //Cria a info da despesa
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    //Cria o nome da despesa
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    //Cria a categoria da despesa
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    //Adciona name e categoria na div das infos da despesa
    expenseInfo.append(expenseName, expenseCategory)

    //Criar o valor da despesa
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`

    //Cria o icone de remover
    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", "img/remove.svg")
    removeIcon.setAttribute("alt", "Remover")

    //Adciona as infos no item
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

    //Adciona o item na lista
    expenseList.append(expenseItem)

    // Limpa o form
    formClear()

    //Atualiza os totais
    updateTotals()
  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas.")
    console.log(error)
  }
}

//Atualizar os totais
function updateTotals() {
  try {
    //Recupera todos os item (li) da lista (ul)
    const items = expenseList.children

    //Atualiza a quantidade de items da lista
    expensesQuantity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`

    // Variavel para incrementar o total
    let total = 0

    //Percorre cada item (li) da lista (ul)
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount")

      //Remover caracteres não númericos e substitui a virgula pelo ponto
      let value = itemAmount.textContent
        .replace(/[^\d,]/g, "")
        .replace(",", ".")

      //Converte o valor para float
      value = parseFloat(value)

      //Verifica se é um numero valido
      if (isNaN(value)) {
        return alert(
          "Não foi possível calcular o total. O valor não parece ser um número"
        )
      }

      //Incrementa o valor total
      total += Number(value)
    }

    // Criar a span para adcionar o R$ formatado
    const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$"

    //Formata o valor e remove o R$ que sera exibido pela small com um estilo costumizado
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

    //Limpa o conteudo do elemento.
    expensesTotal.innerHTML = ""

    //Adiciona o simbolo da moeda e o valor total formatado
    expensesTotal.append(symbolBRL, total)
  } catch (error) {
    console.log(error)
    alert("Não foi possível atualizar os totais.")
  }
}

//Evento que captura o clique nos items da lista
expenseList.addEventListener("click", function (event) {
  //Verificar se o elemento clicado é o icone de remover.
  if (event.target.classList.contains("remove-icon")) {
    //Obtem a li pai do elemento clicado
    const item = event.target.closest(".expense")

    //Remove o item da lista
    item.remove()
  }

  //Atualiza os totais.
  updateTotals()
})

function formClear() {
  //Limpa inputs
  expense.value = ""
  category.value = ""
  amount.value = ""

  //coloca o foco no iput de amount
  expense.focus()
}
