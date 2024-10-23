// Seleciona o elemento do formulário (input) pelo ID "amount"
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expanse = document.getElementById("expense");
const category = document.getElementById("category");

// Seleciona os elementos da lista
const expanseList = document.querySelector("ul");
const expenseTotal = document.querySelector("aside header h2")
const expansesQuantity = document.querySelector("aside header p span");

// Capturando o evento de input para formatar o valor conforme o usuário digita
amount.oninput = () => {
  // Obtém o valor atual do input e remove todos os caracteres não numéricos usando uma expressão regular
  // \D corresponde a qualquer caractere que não seja um dígito e o "g" aplica a remoção globalmente
  let value = amount.value.replace(/\D/g, "");

  // Transforma o valor em centavos (exemplo: 150 se tornará 1.50)
  // Divide o valor numérico por 100 para obter o valor monetário correto
  value = Number(value) / 100;

  // Atualiza o valor do input formatando-o para o padrão da moeda brasileira (R$)
  amount.value = formatCurrencyBRL(value);
};

// Função que formata o valor para o formato de moeda brasileiro (BRL)
function formatCurrencyBRL(value) {
  // Utiliza a função toLocaleString para formatar o valor como moeda BRL
  return value.toLocaleString("pt-BR", {
    style: "currency", // Define o estilo como "currency" (moeda)
    currency: "BRL", // Define a moeda como Real Brasileiro (BRL)
  });
}

// Captura o evento de submit do formulário para obter os valores
form.onsubmit = (event) => {
  // Previne o comportamento padrão de recarregar a página
  event.preventDefault();

  // Cria um objeto com os detalhes na nova despesa
  const newExpense = {
    id: new Date().getTime(),
    expanse: expanse.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    create_at: new Date(),
  };

  console.log(newExpense);

  expenseAdd(newExpense);
};

// Adiciona um novo item na lista
function expenseAdd(newExpense) {
  try {
    // Cria o elemento para adicionar na lista
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    // Cria o icone da categoria

    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    // Cria a info da despesa
    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    // Cria o nome da despesa
    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expanse;

    // Cria a categoria da despesa
    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    // Adiciona nome e categoria na div das informações da despesa
    expenseInfo.append(expenseName, expenseCategory);

    // Cria o valor da despesa
    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`;

    // Cria o icone de remover
    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.setAttribute("src", "img/remove.svg");
    removeIcon.setAttribute("alt", "remover");

    // Adiciona as informações no item
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);

    // Adiciona o item na lista
    expanseList.append(expenseItem);

    // Limpa o formulário para adicionar um novo item
    formClear()
    // Atualiza o updateTotals
    updateTotals();
  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas");
    console.log(error);
  }
}

// Atualizar os totais

function updateTotals() {
  try {
    // Recupera todos os itens (li) da lista (ul)
    const items = expanseList.children;

    // Atualiza a quantidade de itens da lista
    expansesQuantity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`;

    // Variavel para incrementar o total
    let total = 0;

    // Percorre cada item (lit) da lista (ul)
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount");

      // Remover caracteres não numéricos e substitui a vírgula pelo ponto
      let value = itemAmount.textContent
        .replace(/[^\d,]/g, "")
        .replace(",", ".");

      // Converte o valor para float
      value = parseFloat(value);

      // Verifica se é um número valido
      if (isNaN(value)) {
        return alert(
          "Não foi possivel calcular o total. O valor não parece ser um número"
        );
      }

      // Incrementar valor total
      total += Number(value);
    }
    // Cria a span para adicionar o R$ formatado
    const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$"

    // Formata o valor e remove o R$ que sera exibido pela small com um estilo customizado
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")
    // Limpa o conteúdo do elemento
    expenseTotal.innerHTML = ""
    
    // Adiciona o simbolo da moeda e o valor formatado
    expenseTotal.append(symbolBRL, total)
  } catch (error) {
    alert("Não foi possível atualizar os totais");
    console.log(error);
  }
}

// Evento que captura o clique nos itens da lista
expanseList.addEventListener("click", function(event){
    // Verificar se o elemento clicado é o ícone de remover
    if(event.target.classList.contains("remove-icon")){
        // Obtem a li pai do elemento clicado
        const item = event.target.closest(".expense")

        // Remove o item da lista
        item.remove()
    }

    // Atualiza os totais
    updateTotals()
})

function formClear(){
    // Limpa os inputs
    expanse.value = ""
    category.value = ""
    amount.value = ""

    // Coloca o foco no input
    expanse.focus()
}