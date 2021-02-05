const Storage = {//armazenando dados em nosso local storage 
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [] //utilizamos novamente JSON agora parse para transformarmos a string em um array 
    },
    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))//como nosso local storage somente armazena strings, estamos transformando nosso array trasactions em uma string utilizando JSON.stringfly
    }
}
const Modal = {
    open() {
        // Abrir modal
        // Adicionar a class active ao modal
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')

    },
    close() {
        // fechar o modal
        // remover a class active do modal
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    }
    //toogle
}




const Transaction =
{
    all: transactions =
        [
            Storage.get()
        ],

    add(transaction) {

        Transaction.all.push(transaction)
        application.reload()

        //console.log(Transaction.all)
    },

    remove(index) {

        Transaction.all.splice(index, 1)//splice é um método para excluir elementos de um array, neste caso entramos com index = posição deste elemento e 1 que será a quantidade de elementos que serão removidos durante está ação 
        //recebe o index que é o posicionamento dentro do vetor para que possamos remove-lo
        application.reload()

    },


    //pegar todas as entradas
    //verificar se é maior que 0 então somar em income
    //verificar se é maior que 0 então somar em expense
    //verificando entradas
    incomes() {
        let income = 0
        Transaction.all.forEach(function (transaction) {//para cada transação
            if (transaction.amount > 0) //se for positivo = entrada
                income += transaction.amount //soma em income
        })
        return income //retorna o valor sem formatação 
    },

    //verificando saídas
    expenses() {
        let expense = 0
        Transaction.all.forEach(function (transaction) { //para cada transação
            if (transaction.amount < 0) //verificar se é negativo = saída
                expense += transaction.amount // soma em expense
        })
        return expense //retorna o valor sem formatação 
    },
    total() {

        let total = 0
        total = Transaction.incomes() + Transaction.expenses()

        return total //retorna o valor sem formatação 
    }

}


const editTableCard = {
    transactionContainer: document.querySelector(`#data-table tbody`),
    addTransacrion(transaction, index) {
        //console.log(transaction)

        const tr = document.createElement('tr')
        tr.innerHTML = editTableCard.innerHTMLtransaction(transaction, index)

        editTableCard.transactionContainer.appendChild(tr)
    },
    innerHTMLtransaction(transaction, index) {
        formatAmount = Utils.formatCurrency(transaction.amount)
        const classInOrEx = transaction.amount > 0 ? "income" : "expense"
        const html = `
    <td class="description">${transaction.description}</td>
    <td class="${classInOrEx}">${formatAmount}</td>
    <td class="date">${transaction.date}</td>
    <td><img  class="remove" onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação"></td>`
        // console.log(html)
        return html
    },

    updateBalance() { //atualiza os cardas de entrada, saída e soma e também formata utilizando nossa função Utils.formatCurrency
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        editTableCard.transactionContainer.innerHTML = ''
    }
}

const Utils = {

    formatAmount(value) {

        //formatando amount para depois utilizarmos a função
        value = Number(value.replace(/\,\./g, "")) * 100
        console.log(value)
        return value

    },

    formatDate(date) {
        //formatando a data para nosso padrão antes : 2021-2-15 queremos 15/2/2021
        const splittedDate = date.split('-')//nossa constante agora é um array que quebra nos travessões"-", sendo destsa forma um array de 3 posições

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? '-' : ''//armazenando o sinal da entrada do usuário 
        console.log(signal)
        value = String(value).replace(/\D/g, "") //neste momento estamos validando, retirando tudo que não for número \/D\ retira oq não é numero e "g" significa global, isso significa que todas as letrar serão retiradas caso o usuário digite letras

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}


const application = {

    init() {

        Transaction.all.forEach(function (transaction, index) {//varre todos os gastos/lucros passa seu valor de transação e o INDEX que é seu posicionamento no vetor transactions, parsa desta forma removermos utilizando remove 
            /*a estrutura acima é uma estrutura for melhorada, seria o mesmo que:
                for(i=0; i <= 3; i++) entretanto forEach varre nosso array enquanto tenha dados, por exemplo se eu adicionar mais uma transição ele irá adicionar mais aquele elemento
            */
            editTableCard.addTransacrion(transaction, index)
            Storage.set(Transaction.all)
        })

        editTableCard.updateBalance()


    },

    reload() {

        Storage.set(Transaction.all)
        editTableCard.clearTransactions()
        application.init()


    }
}


application.init()

const Form = {

    _description: document.querySelector('input#description'),//pegando o campo description presente no formulário
    _amount: document.querySelector('input#amount'),//pegando o campo amount dentro do nosso formulário
    _date: document.querySelector('input#date'),//pegando o campo date dentro do nosso formulário

    getValues() {
        return {
            description: Form._description.value, //atribuindo o valor do campo para a variavel
            amount: Form._amount.value,//atribuindo o valor do campo para a variavel
            date: Form._date.value//atribuindo o valor do campo para a variavel
        }
    },

    validateFilds() {
        //console.log("validando os campos")
        const { description, amount, date } = Form.getValues()//pegando os valores para validar
        //console.log(`${date}`)
        if (description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Por favor preencha todos os campos")
        }
    },

    formatValues() {

        let { description, amount, date } = Form.getValues()


        amount = Utils.formatAmount(amount)
        //console.log(amount)
        date = Utils.formatDate(date)
        //console.log(date)

        return { description, amount, date }
    },
    saveTransaction(transaction) {

        Transaction.add(transaction)

    },
    clearTransaction() {
        Form._description.value = ""
        Form._amount.value = ""
        Form._date.value = ""

    },

    submit(event) {
        //verificar se todas as informações foram preenchidas 
        event.preventDefault()
        try {

            //tente validar os campos
            Form.validateFilds()

            //formatar os dados para salvar 
            const transaction = Form.formatValues()
            //console.log(transaction)
            //salvar 
            Form.saveTransaction(transaction)
            //apagar os dados do formulario 
            Form.clearTransaction()
            //quero que o modal feche 
            Modal.close()
            //atualizar a aplicação 
            application.reload()
        } catch (error) {

            window.alert(error.message)

        }





    }

}
//Transaction.remove(0)


//Storage.get()

application.init