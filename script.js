// Variáveis globais
let cart = [];
let selectedColor = '';
let selectedSize = '';
let quantity = 1;


const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const productModal = document.getElementById('productModal');
const headerCartBtn = document.getElementById("header-cart-btn");
const headerCartCounter = document.getElementById("header-cart-count");


if (!cartBtn || !cartModal || !cartItemsContainer || !cartTotal || !checkoutBtn) {
    console.error('Elementos essenciais do carrinho não encontrados');
}
// Funções de Modal
function openModal(modal) {
    modal.classList.remove('hidden', 'opacity-0', 'invisible');
    modal.classList.add('flex', 'opacity-100', 'visible');
    const modalContent = modal.querySelector(':scope > div');
    if (modalContent) {
        modalContent.classList.remove('scale-95');
        modalContent.classList.add('scale-100');
    }

    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('opacity-100', 'visible', 'scale-100');
    modal.classList.add('opacity-0', 'invisible', 'scale-95');

    // Correção consistente aqui também
    const modalContent = modal.querySelector(':scope > div');
    if (modalContent) {
        modalContent.classList.add('scale-95');
        modalContent.classList.remove('scale-100');
    }

    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 300); // Match com a duração da transição (300ms)
}

function closeAllModals() {
    closeModal(cartModal);
    closeModal(productModal);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#productModal .close').addEventListener('click', closeAllModals);
    document.getElementById('close-modal').addEventListener('click', () => closeModal(cartModal));

    document.addEventListener('click', (e) => {
        if (e.target === cartModal || e.target === productModal) closeAllModals();
    });
});

// Controle de Quantidade
document.getElementById('increment')?.addEventListener('click', () => {
    quantity = Math.min(quantity + 1, 10);
    document.getElementById('quantity').value = quantity;
});

document.getElementById('decrement')?.addEventListener('click', () => {
    quantity = Math.max(quantity - 1, 1);
    document.getElementById('quantity').value = quantity;
});

document.getElementById('quantity')?.addEventListener('change', (e) => {
    quantity = Math.min(Math.max(parseInt(e.target.value) || 1, 1), 10);
    e.target.value = quantity;
});

// Seleção de Tamanho e Cor
document.querySelectorAll('.size-option').forEach(button => {
    button.addEventListener('click', function () {
        document.querySelectorAll('.size-option').forEach(btn => {
            btn.classList.remove('bg-emerald-600', 'text-white', 'border-emerald-700');
        });
        this.classList.add('bg-emerald-600', 'text-white', 'border-emerald-700');
        selectedSize = this.textContent;
    });
});

document.querySelectorAll('.color-option').forEach(button => {
    button.addEventListener('click', function () {
        document.querySelectorAll('.color-option').forEach(btn => {
            btn.classList.remove('selected', 'ring-2', 'ring-emerald-600', 'scale-110');
        });
        this.classList.add('selected', 'ring-2', 'ring-emerald-600', 'scale-110');
        selectedColor = this.dataset.color;
    });
});

// Abrir Modais
cartBtn.addEventListener("click", () => {
    openModal(cartModal);
    updateCartModal();
});

if (headerCartBtn) {
    headerCartBtn.addEventListener("click", () => {
        openModal(cartModal);
        updateCartModal();
    });
}

document.querySelectorAll('.product').forEach(product => {
    product.addEventListener('click', (e) => {
        // Resetar seleções anteriores
        selectedColor = '';
        selectedSize = '';
        quantity = 1;
        document.querySelectorAll('.size-option, .color-option').forEach(btn => {
            btn.classList.remove(
                'bg-emerald-600',
                'text-white',
                'border-emerald-700',
                'selected',
                'ring-2',
                'ring-emerald-600',
                'scale-110'
            );
        });
        document.getElementById('quantity').value = 1;

        // Carregar dados do produto
        const img = product.querySelector('img').src;
        const title = product.querySelector('p.font-bold').textContent;
        const priceElement = product.querySelector('p.text-xl.font-bold');
        const priceText = priceElement ? priceElement.firstChild.textContent.trim() : '0';
        const price = parseFloat(priceText.replace('R$ ', '').replace(',', '.'));   
        const description = product.querySelector('p.text-sm').textContent;

        document.getElementById('modalImage').src = img;
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalPrice').textContent = `R$ ${price.toFixed(2)}`;
        document.getElementById('modalDescription').textContent = description;

        openModal(productModal);
    });
});

// Adicionar ao Carrinho (event delegation)
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('add-to-cart-modal')) {
        e.preventDefault();

        if (!selectedSize || !selectedColor) {
            showToast('Selecione o tamanho e a cor!');
            return;
        }

        const title = document.getElementById('modalTitle').textContent;
        const price = parseFloat(document.getElementById('modalPrice').textContent.replace('R$ ', ''));
        const quantity = parseInt(document.getElementById('quantity').value);

        addToCart({
            id: `${title}-${selectedColor}-${selectedSize}`, // ID único
            name: `${title} - Cor: ${selectedColor} - Tamanho: ${selectedSize}`,
            price: price,
            quantity: quantity,
            color: selectedColor,
            size: selectedSize
        });

        closeAllModals();
    }
});

function addToCart(newItem) {
    const existingItem = cart.find(item => item.id === newItem.id);

    if (existingItem) {
        existingItem.quantity += newItem.quantity;
    } else {
        cart.push(newItem);
    }
    updateCartModal();
}

function updateCartModal() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let totalItems = 0;

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'flex justify-between items-center mb-4 gap-4 p-3 bg-white rounded-lg shadow-sm';
        itemElement.innerHTML = `
            <div class="flex items-center gap-4 flex-1">
                <div class="${getColorClass(item.color)} w-6 h-6 rounded-full border-2"></div>
                <div>
                    <p class="font-medium">${item.name.split(' - ')[0]}</p>
                    <div class="text-sm text-gray-600">
                        <p>Tamanho: ${item.size}</p>
                        <p>Cor: ${item.color}</p>
                    </div>
                </div>
            </div>
            <div class="text-right flex items-center gap-3">
                <div class="flex items-center gap-2">
                    <button class="decrease-quantity px-2 py-1 border rounded" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-quantity px-2 py-1 border rounded" data-id="${item.id}">+</button>
                </div>
                <p class="text-emerald-600 font-medium min-w-[80px]">R$ ${(item.price * item.quantity).toFixed(2)}</p>
                <button class="remove-item text-red-500 hover:text-red-700 text-sm" 
                        data-id="${item.id}">
                    Remover
                </button>
            </div>
        `;

        cartItemsContainer.appendChild(itemElement);
        total += item.price * item.quantity;
        totalItems += item.quantity;
    });

    const cartSubtotal = document.getElementById('subtotal');
    if (cartSubtotal) {
        cartSubtotal.textContent = total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    cartCounter.textContent = totalItems;
    if (headerCartCounter) headerCartCounter.textContent = totalItems;
}


// Funções Auxiliares
function getColorClass(color) {
    const colorMap = {
        'Branco': 'bg-white border-gray-300',
        'Preto': 'bg-black border-black',
        'Vermelho': 'bg-red-600 border-red-700',
        'Azul': 'bg-blue-600 border-blue-700'
    };
    return colorMap[color] || 'bg-gray-200 border-gray-300';
}

// Event Delegation para controles do carrinho
document.addEventListener('click', function (e) {
    // Aumentar quantidade
    if (e.target.classList.contains('increase-quantity')) {
        const itemId = e.target.dataset.id;
        const item = cart.find(item => item.id === itemId);
        if (item) {
            item.quantity += 1;
            updateCartModal();
        }
    }

    // Diminuir quantidade
    else if (e.target.classList.contains('decrease-quantity')) {
        const itemId = e.target.dataset.id;
        const item = cart.find(item => item.id === itemId);
        if (item) {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                // Remove completamente se a quantidade for 1
                cart = cart.filter(i => i.id !== itemId);
            }
            updateCartModal();
        }
    }

    // Remover item completamente
    else if (e.target.classList.contains('remove-item')) {
        const itemId = e.target.dataset.id;
        cart = cart.filter(item => item.id !== itemId);
        updateCartModal();
    }
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showToast('Seu carrinho está vazio!');
        return;
    }

    if (!addressInput.value.trim()) {
        addressWarn.classList.remove('hidden');
        addressInput.classList.add('border-red-500');
        return;
    }

    const message = cart.map(item =>
        `${item.name} - ${item.quantity}x | R$ ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const phone = "5584996535977";
    const encodedMessage = encodeURIComponent(`${message}\n\nEndereço: ${addressInput.value}`);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');

    cart = [];
    addressInput.value = '';
    updateCartModal();
    closeAllModals();
});

function showToast(text, isError = true) {
    Toastify({
        text: text,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
            background: isError ? "#ef4444" : "#10b981",
            borderRadius: "8px",
            fontWeight: "500"
        }
    }).showToast();
}
// Adicione estas variáveis
let currentRating = 0;
const feedbackForm = document.getElementById('feedback-form');
const stars = document.querySelectorAll('.star');

// Sistema de avaliação por estrelas
stars.forEach(star => {
    star.addEventListener('click', () => {
        currentRating = parseInt(star.dataset.rating);
        stars.forEach(s => {
            s.style.color = parseInt(s.dataset.rating) <= currentRating ? '#FFD700' : '#CCCCCC';
        });
    });
});

// Enviar feedback
document.getElementById('submit-feedback').addEventListener('click', async () => {
    const comment = document.getElementById('feedback-comment').value;
    const images = document.getElementById('feedback-images').files;

    if (!currentRating) {
        showToast('Selecione uma avaliação com as estrelas!');
        return;
    }

    // Upload das imagens e envio do feedback
    const imageUrls = await uploadImages(images);

    const feedback = {
        userId: "ID_DO_USUARIO", // Obter do sistema de autenticação
        userName: "Nome do Usuário",
        productId: "ID_DO_PRODUTO",
        rating: currentRating,
        comment,
        images: imageUrls,
        date: new Date().toISOString()
    };

    // Adicionar ao Firestore ou seu backend
    await addFeedbackToDB(feedback);
    showToast('Avaliação enviada com sucesso!', false);
    loadProductFeedbacks();
    feedbackForm.classList.add('hidden');
});

// Funções auxiliares
async function uploadImages(files) {
    // Implementar upload para Firebase Storage ou outro serviço
    return []; // Retornar array de URLs
}

async function addFeedbackToDB(feedback) {
    // Implementar conexão com seu backend
}

async function loadProductFeedbacks(productId) {
    const feedbacksContainer = document.getElementById('product-feedbacks');
    feedbacksContainer.innerHTML = '<p>Carregando avaliações...</p>';

    // Buscar feedbacks do produto no banco de dados
    const feedbacks = await getFeedbacksFromDB(productId);

    if (feedbacks.length === 0) {
        feedbacksContainer.innerHTML = '<p>Seja o primeiro a avaliar este produto!</p>';
        return;
    }

    feedbacksContainer.innerHTML = '';
    feedbacks.forEach(fb => {
        const stars = '★'.repeat(fb.rating) + '☆'.repeat(5 - fb.rating);
        const date = new Date(fb.date).toLocaleDateString();

        feedbacksContainer.innerHTML += `
      <div class="border-b pb-4">
        <div class="flex justify-between">
          <p class="font-medium">${fb.userName}</p>
          <div class="text-yellow-400">${stars}</div>
        </div>
        <p class="text-sm text-gray-500 mb-2">${date}</p>
        <p class="text-gray-700">${fb.comment}</p>
        ${fb.images?.length ? `
          <div class="flex gap-2 mt-2">
            ${fb.images.map(img => `<img src="${img}" class="h-16 rounded border">`).join('')}
          </div>
        ` : ''}
      </div>
    `;
    });
}
// Adicione estas variáveis
const cepInput = document.getElementById('cep-input');
const calculateShippingBtn = document.getElementById('calculate-shipping');
const shippingResults = document.getElementById('shipping-results');
// Função de exemplo para cálculo de frete
async function calculateShipping(cep) {
    if (!cepInput || !shippingResults) {
        console.error('Elementos necessários não encontrados');
        return;
    }
    // Substitua por sua API real de cálculo de frete
    return [
        { id: 'sedex', name: 'Sedex', price: 15.90, days: 3, default: false },
        { id: 'pac', name: 'PAC', price: 9.90, days: 7, default: true },
        { id: 'retirada', name: 'Retirada em Loja', price: 0, days: 0, default: false }
    ];
}

// Máscara para CEP
cepInput.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    e.target.value = value;
});

// Calcular frete
calculateShippingBtn.addEventListener('click', async () => {
    const cep = cepInput.value.replace(/\D/g, '');

    if (cep.length !== 8) {
        showToast('Digite um CEP válido com 8 dígitos');
        return;
    }

    try {
        const viaCepResponse = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const addressData = await viaCepResponse.json();

        if (addressData.erro) {
            throw new Error('CEP não encontrado');
        }

        addressInput.value = `${addressData.logradouro}, ${addressData.bairro}, ${addressData.localidade} - ${addressData.uf}`;

        const shippingOptions = await calculateShipping(cep);

        // Mostrar opções
        shippingResults.innerHTML = '';
        shippingOptions.forEach(option => {
            const div = document.createElement('div');
            div.className = 'flex justify-between items-center';
            div.innerHTML = `
          <div class="flex items-center gap-2">
            <input type="radio" name="shipping" id="shipping-${option.id}" 
                  value="${option.id}" ${option.default ? 'checked' : ''}>
            <label for="shipping-${option.id}">${option.name}</label>
          </div>
          <span>${option.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        `;
            shippingResults.appendChild(div);
        });

        shippingResults.classList.remove('hidden');

        shippingResults.querySelectorAll('input[name="shipping"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const selectedOption = shippingOptions.find(opt => opt.id === e.target.value);
                updateShippingCost(selectedOption.price);
            });
        });

        const defaultOption = shippingOptions.find(opt => opt.default);
        if (defaultOption) updateShippingCost(defaultOption.price);

    } catch (error) {
        showToast(`Erro ao calcular frete: ${error.message}`);
    }
});

// Adicione ao evento de finalizar compra
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showToast('Seu carrinho está vazio!');
        return;
    }

    if (!addressInput.value.trim()) {
        addressWarn.classList.remove('hidden');
        addressInput.classList.add('border-red-500');
        return;
    }

    // Obter método de pagamento selecionado
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    // Calcular total com descontos/acréscimos
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = parseFloat(document.querySelector('input[name="shipping"]:checked')?.dataset.price || 0);

    let total = subtotal + shipping;
    let discount = 0;

    // Aplicar desconto para Pix
    if (paymentMethod === 'pix') {
        discount = total * 0.05;
        total -= discount;
    }

    const message = `
      *Pedido realizado com sucesso!*
      
      *Itens:*
      ${cart.map(item => `➤ ${item.name} - ${item.quantity}x | R$ ${(item.price * item.quantity).toFixed(2)}`).join('\n')}
      
      *Subtotal:* R$ ${subtotal.toFixed(2)}
      *Frete:* R$ ${shipping.toFixed(2)}
      ${discount > 0 ? `*Desconto (Pix):* R$ ${discount.toFixed(2)}\n` : ''}
      *Total:* R$ ${total.toFixed(2)}
      
      *Forma de Pagamento:* ${getPaymentMethodName(paymentMethod)}
      *Endereço de Entrega:* ${addressInput.value}
      
      Obrigado pela sua compra!`;

    const phone = "5584996535977";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');

    cart = [];
    addressInput.value = '';
    updateCartModal();
    closeAllModals();
});

function getPaymentMethodName(method) {
    const methods = {
        pix: 'Pix',
        card: 'Cartão de Crédito',
        boleto: 'Boleto Bancário'
    };
    return methods[method] || method;
}
// Sistema de avaliação por estrelas
function setupStarRating() {
    const stars = document.querySelectorAll('.stars-rating .star');
    let currentRating = 0;

    stars.forEach(star => {
        // Hover para pré-visualização
        star.addEventListener('mouseover', function () {
            const rating = parseInt(this.getAttribute('data-rating'));
            highlightStars(rating);
        });

        // Clique para definir avaliação
        star.addEventListener('click', function () {
            currentRating = parseInt(this.getAttribute('data-rating'));
            highlightStars(currentRating);
            // Aqui você pode salvar a avaliação selecionada
            console.log('Avaliação selecionada:', currentRating);
        });

        // Reset ao sair do container
        document.querySelector('.stars-rating').addEventListener('mouseleave', function () {
            if (currentRating === 0) {
                resetStars();
            } else {
                highlightStars(currentRating);
            }
        });
    });

    function highlightStars(rating) {
        stars.forEach(star => {
            const starRating = parseInt(star.getAttribute('data-rating'));
            if (starRating <= rating) {
                star.classList.add('text-yellow-400');
                star.classList.remove('text-gray-300');
            } else {
                star.classList.remove('text-yellow-400');
                star.classList.add('text-gray-300');
            }
        });
    }

    function resetStars() {
        stars.forEach(star => {
            star.classList.remove('text-yellow-400');
            star.classList.add('text-gray-300');
        });
    }
}

// Chame esta função quando o modal for aberto
document.querySelector('#productModal .close').addEventListener('click', function () {
    setTimeout(setupStarRating, 100);
});

// Ou quando o modal terminar de carregar
setupStarRating();
// função para atualizar o custo do frete
function updateShippingCost(shippingPrice) {
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('cart-total');
    const shippingCostElement = document.getElementById('shipping-cost');

    // Verifica se os elementos existem
    if (!subtotalElement || !totalElement || !shippingCostElement) {
        console.error('Elementos do frete não encontrados no DOM');
        return;
    }

    // Converte o valor do subtotal para número
    const subtotal = parseFloat(subtotalElement.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    
    // Calcula o total
    const total = subtotal + shippingPrice;

    // Atualiza os elementos
    shippingCostElement.textContent = shippingPrice.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    totalElement.textContent = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function parseCurrency(currencyString) {
    if (!currencyString) return 0;

    // Para formatos como "R$ 1.234,56"
    const cleanString = currencyString
        .replace(/[^\d,-]/g, '')  // Remove caracteres não numéricos exceto , e -
        .replace(/\./g, '')       // Remove pontos (separadores de milhares)
        .replace(',', '.');       // Converte vírgula decimal em ponto

    return parseFloat(cleanString) || 0;
}