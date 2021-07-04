
const Modal = {
  open() {
      //Abrir modal
      //Adicionar a class active ao modal
      document
          .querySelector(' .modal-overlay')
          .classList
          .add('active')
  },
  close() {
      //fechar o modal
      //Revmover a class active ao modal
      //Alerta se escreve alert('texto')
      document
          .querySelector('.modal-overlay')
          .classList
          .remove('active')
  }
} 
const Storage = {
    get () {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []   
    },
    set(transactions){
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))

    }
}
const Transaction = {
    all: Storage.get(),
    
    add(transaction){
        Transaction.all.push(transaction)
        App.reload()
    },
    remove(index){
        Transaction.all.splice(index, 1)

        App.reload()
    },
       
    incomes(){
        let income = 0;
        Transaction.all.forEach(transaction => {
            if( transaction.amount > 0){
                income = income + transaction.amount;        
            }
        })
        return income
    },
    expenses() {
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if( transaction.amount < 0){
                expense = expense + transaction.amount;        
            }
        })
        return expense
    },
    total(){
       
        return Transaction.incomes() + Transaction.expenses()
    }
}
// Substituir os dados do HTML com os dados do JS
const DOM = {    //document object transaction

    transactionsContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction, index) {
    //Quando chamdo addTransaction ele recebe transactione index ele cria tr e coloca o innerHTMLtransaction 
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transaction,index){

        const CSSclass = transaction.amount > 0 ? "income" : "expense"
        const amount = Utils.formatCurrency(transaction.amount)

        const html= ` 
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">    ${amount}     </td>
            <td class="date">       ${transaction.date}       </td>
            <td><img onclick="Transaction.remove(${index})" src="imagens/remover.svg" alt="Botão remover" class="fotosdc"></td>
    `   //pode adiciona variaveis usando  ``

        return html
    },
    updateBalance(){
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
            //Utils.formatCurrency formata para real
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },
    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ""
    }
} 
const Utils ={
    formatAmount(value){
        value = Number(value.replace(/\,\./g, "")) * 100
        return Math.round(value)

    },
    formatDate(date){
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g,"")

        value = Number(value) / 100
        
        value = value.toLocaleString("pt-BR",{
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }

}
const Form ={ 
    //Pega valores
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues(){
    //pega valores
     return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
           
    },
    FormatValues(){
    //Formatar os dados para salvae
        let{description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount)
        date   = Utils.formatDate(date)
    
        return{
            description,
            amount,
            date
        }
    },
    validateFields(){
     //Verificar se todas as infos foram preenchidas
        const {description, amount, date} = Form.getValues()

        if( description.trim() === "" || 
            amount.trim()      === "" || 
            date.trim()       === "" ){
                throw new Error("Por favor, Preencha todos os campos")
            }
    },
    clearFields(){
    //Apagar os dados do formulário
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""

    },
    submit(event){
        event.preventDefault()

        try { 
        Form.validateFields()
        const transaction = Form.FormatValues()
        Transaction.add(transaction)
        //Salvar
        Form.clearFields()
        Modal.close()
        //Modal feche

        }catch(error){
            alert(error.message)
        }

    }
}
const App ={
init() {
    Transaction.all.forEach(DOM.addTransaction)

    DOM.updateBalance()
    
    Storage.set(Transaction.all)
},
reload() {
    DOM.clearTransactions()
    App.init()
}

}
App.init()