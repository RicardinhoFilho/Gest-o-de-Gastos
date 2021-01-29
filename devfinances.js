
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

const transactions =
    [
        {
            id: 1,
            description: 'Luz',
            amount: -50001,
            date: '22/07/2020'
        },
        {
            id: 2,
            description: 'Website',
            amount: 500000,
            date: '22/07/2020'
        },
        {
            id: 3,
            description: 'Internet',
            amount: -20000,
            date: '22/07/2020'
        }

    ]

const Transaction =
{

    //pegar todas as entradas
    //verificar se é maior que 0 então somar em income
    //verificar se é maior que 0 então somar em expense

    //verificando entradas
    incomes() {
        let income = 0
        transactions.forEach(function (transaction) {//para cada transação
            if (transaction.amount > 0) //se for positivo = entrada
                income += transaction.amount //soma em income
        })
        return income //retorna o valor sem formatação 
    },

    //verificando saídas
    expenses() {
        let expense = 0
        transactions.forEach(function (transaction) { //para cada transação
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
        tr.innerHTML = editTableCard.innerHTMLtransaction(transaction)

        editTableCard.transactionContainer.appendChild(tr)
    },
    innerHTMLtransaction(transaction) {
        formatAmount = Utils.formatCurrency(transaction.amount)
        const classInOrEx = transaction.amount > 0 ? "income" : "expense"
        const html = `
    <td class="description">${transaction.description}</td>
    <td class="${classInOrEx}">${formatAmount}</td>
    <td class="date">${transaction.date}</td>
    <td><img src="./assets/minus.svg" alt="Remover Transação"></td>`
        // console.log(html)
        return html
    },

    updateBalance() { //atualiza os cardas de entrada, saída e soma e também formata utilizando nossa função Utils.formatCurrency
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes()) 
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())
    }
}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? '-' : ''//armazenando o sinal da entrada do usuário 

        value = String(value).replace(/\D/g, "") //neste momento estamos validando, retirando tudo que não for número \/D\ retira oq não é numero e "g" significa global, isso significa que todas as letrar serão retiradas caso o usuário digite letras

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}
transactions.forEach(function (transaction) {
    /*a estrutura acima é uma estrutura for melhorada, seria o mesmo que:
        for(i=0; i <= 3; i++) entretanto forEach varre nosso array enquanto tenha dados, por exemplo se eu adicionar mais uma transição ele irá adicionar mais aquele elemento
    */
    editTableCard.addTransacrion(transaction)
});

editTableCard.updateBalance()