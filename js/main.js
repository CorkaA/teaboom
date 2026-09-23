document.addEventListener('DOMContentLoaded', () => {

    const formatPrice = (num) => {
        return num.toFixed(2).replace('.',',') + ' ₽';
    };

    const formatBigPrice = (num) => {
        const parts = num.toFixed(2).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        return parts.join(',') + ' ₽';
    }
    
    async function loadProductData() {
        try {
            const response = await fetch('./js/data.json');
            if (!response.ok) throw new Error('Ошибка загрузки данных');
            const data = await response.json();
            console.log('Данные:', data);
            renderProduct(data);
        } catch (error) {
            console.error('ошибка', error);
        }
    }

    async function renderProduct(data) {
        document.getElementById('product-image').src = data.image;
        document.getElementById('product-category').textContent = data.category;
        document.getElementById('product-title').textContent = data.title;
        document.getElementById('product-briefly').textContent = data.briefly;
        document.getElementById('product-description').textContent = data.description;
        document.getElementById('product-composition').textContent = data.composition;
        document.getElementById('product-taste').textContent = data.taste;

        const benefitsList = document.getElementById('product-benefits-list');
        benefitsList.innerHTML = '';

        if (data.benefits && data.benefits.length > 0) {
            data.benefits.forEach(benefit => {
                const li = document.createElement('li');
                li.textContent = benefit;
                benefitsList.appendChild(li);
            });
        }

        const optionList = document.getElementById('weight-options');
        optionList.innerHTML = '';

        data.variants.forEach(variant => {
            const li = document.createElement('li');
            const btn = document.createElement('button');

            btn.className = `options-btn ${variant.isDefault ? 'active' : ''}`;
            btn.textContent = `${variant.weight} г`;
            btn.dataset.id = variant.id;

            btn.addEventListener('click', () => selectVariant(variant, btn));

            li.appendChild(btn);
            optionList.appendChild(li);
        });

        const defaultVariant = data.variants.find(v => v.isDefault) || data.variants[0];
        updateDetails(defaultVariant);
    }

    function updateDetails(variant) {
        document.getElementById('product-article').textContent = `арт. ${variant.article}`;

        const oldPriceEl = document.getElementById('old-price');
        const priceEl = document.getElementById('price');

        if (variant.oldPrice) {
            oldPriceEl.textContent = formatBigPrice(variant.oldPrice);
            oldPriceEl.classList.add('visible');
        } else {
            oldPriceEl.textContent = '';
            oldPriceEl.classList.remove('visible');
        }

        priceEl.textContent = formatBigPrice(variant.price);
    }

    function selectVariant(variant, btnElement) {
        document.querySelectorAll('.options-btn').forEach(btn => 
            btn.classList.remove('active')
        );
        btnElement.classList.add('active');

        updateDetails(variant);
    }

    loadProductData();
});