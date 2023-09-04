import { catalogo, lerLocalStorage, salvarLocalStorage } from "./utilidades"

const idsProdutosCarrinhoComQuantidade = lerLocalStorage('carrinho') ?? {}

var carrinho = document.getElementById('carrinho')
function abrirCarrinho() {
    carrinho.classList.add('right-[0px]')
    carrinho.classList.remove('right-[-360px]')
}

function fecharCarrinho() {
    carrinho.classList.remove('right-[0px]')
    carrinho.classList.add('right-[-360px]')
}

function irParaCheckout() {
    if(Object.keys(idsProdutosCarrinhoComQuantidade).length == 0) {
        return
    }

    window.location.href = window.location.origin + "./checkout.html"
}

export function inicializarCarrinho() {
    const botaoFecharCarrinho = document.getElementById('fechar-carrinho')
    const botaoAbrirCarrinho = document.getElementById('abrir-carrinho')
    const botaoIrParaCheckout = document.getElementById('finalizar-compra')

    botaoFecharCarrinho.addEventListener('click', fecharCarrinho)
    botaoAbrirCarrinho.addEventListener('click', abrirCarrinho)
    botaoIrParaCheckout.addEventListener('click', irParaCheckout)
}

function incrementarQuantidadeProduto(idProduto) {
    idsProdutosCarrinhoComQuantidade[idProduto]++
    atualizarInformacaoQuantidade(idProduto)
    atualizarPrecoCarrinho()
    salvarLocalStorage('carrinho', idsProdutosCarrinhoComQuantidade)
}

function decrementarQuantidadeProduto(idProduto) {
    if (idsProdutosCarrinhoComQuantidade[idProduto] == 1) {
        removerDoCarrinho(idProduto)
        return
    }
    idsProdutosCarrinhoComQuantidade[idProduto]--
    atualizarInformacaoQuantidade(idProduto)
    atualizarPrecoCarrinho()
    salvarLocalStorage('carrinho', idsProdutosCarrinhoComQuantidade)
}

function atualizarInformacaoQuantidade(idProduto) {
    document.getElementById(`quantidade-${idProduto}`).innerText = idsProdutosCarrinhoComQuantidade[idProduto]
}

function removerDoCarrinho(idProduto) {
    delete idsProdutosCarrinhoComQuantidade[idProduto];
    renderizarProdutosCarrinho()
    atualizarPrecoCarrinho()
    salvarLocalStorage('carrinho', idsProdutosCarrinhoComQuantidade)
}

function desenharProdutoNoCarrinho(idProduto) {
    const produto = catalogo.find((p) => p.id === idProduto)
    const containerProdutosCarrinho = document.getElementById('produtos-carrinho')

    const elementoArticle = document.createElement('article');
    elementoArticle.classList.add('flex')
    elementoArticle.classList.add('bg-slate-100')
    elementoArticle.classList.add('border')
    elementoArticle.classList.add('rounded-lg')
    elementoArticle.classList.add('p-1')
    elementoArticle.classList.add('relative')

    const cartaoProdutoCarrinho = `
        <button id="remover-item-${produto.id}" class="absolute top-0 right-2">
            <i class="fa-solid fa-circle-xmark text-slate-500 hover:text-slate-800"></i>
        </button>
        
        <img src="./assets/img/${produto.imagem}" alt="Produto ${produto.id}" class="h-24 rounded-lg">

        <div class="p-2 flex flex-col justify-between">
            <p class="text-slate-900 text-sm" >${produto.nome}</p>
            <p class="text-slate-400 text-xs">Tamanho: M</p>
            <p class="text-green-700 text-lg">$${produto.preco}</p>
        </div>
        <div class='flex text-slate-950 items-end absolute bottom-0 right-2 gap-2 text-lg'>
            <button id='decrementar-produto-${idProduto}'>-</button>
            <p id='quantidade-${produto.id}' >${idsProdutosCarrinhoComQuantidade[produto.id]}</p>
            <button id='incrementar-produto-${idProduto}'>+</button>
        </div>
    `

    elementoArticle.innerHTML = cartaoProdutoCarrinho
    containerProdutosCarrinho.appendChild(elementoArticle)

    document.getElementById(`decrementar-produto-${idProduto}`).addEventListener('click', () => decrementarQuantidadeProduto(produto.id))

    document.getElementById(`incrementar-produto-${idProduto}`).addEventListener('click', () => incrementarQuantidadeProduto(produto.id))

    document.getElementById(`remover-item-${idProduto}`).addEventListener('click', () => removerDoCarrinho(produto.id))
}

export function renderizarProdutosCarrinho() {
    const containerProdutosCarrinho = document.getElementById('produtos-carrinho');
    containerProdutosCarrinho.innerHTML = "";

    for (const idProduto in idsProdutosCarrinhoComQuantidade) {
        desenharProdutoNoCarrinho(idProduto)
    }
}

export function adicionarAoCarrinho (idProduto) {
    if (idProduto in idsProdutosCarrinhoComQuantidade){
        incrementarQuantidadeProduto(idProduto)
        return
    }
    idsProdutosCarrinhoComQuantidade[idProduto] = 1
    atualizarPrecoCarrinho()
    desenharProdutoNoCarrinho(idProduto)
    salvarLocalStorage('carrinho', idsProdutosCarrinhoComQuantidade)
}

export function atualizarPrecoCarrinho() {
    const precoCarrinho = document.getElementById('preco-total');
    let precoTotalCarrinho = 0

    for (const idProduto in idsProdutosCarrinhoComQuantidade){
        const produto = catalogo.find(p => p.id == idProduto)
        precoTotalCarrinho += produto.preco * idsProdutosCarrinhoComQuantidade[produto.id]
    }

    precoCarrinho.innerText = `Total: ${precoTotalCarrinho}`
}