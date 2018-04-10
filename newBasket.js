'use strict';

const cart = {
    goods: [],
    settings: {
        countSelector: '#basket-count',
        priceSelector: '#basket-price',
        cartSelector: '.my_account_cart_box',
    },

    // Инициализирует корзину.
    init(settings = {}) {
        // Записываем настройки, которые были переданы.
        Object.assign(this.settings, settings);
        // Получаем нужные элементы для работы с ними.
        this.countEl = document.querySelector(this.settings.countSelector);
        this.cartEl = document.querySelector(this.settings.cartSelector);
        this.priceEl = document.querySelector(this.settings.priceSelector);
        // Отображаем корзину.
        this.renderBasket();
        // Вешаем обработчики события.
        this.initHandlers();
    },

    // Обработчики события.
    initHandlers() {
        // Получаем все кнопки купить.
        const btns = document.querySelectorAll('.mango_cart');
        // Каждой кнопке.
        btns.forEach(item =>
            // Ставим обработчик, что при клике.
            item.addEventListener('click', () =>
                // Надо вызвать функцию add, передаем данные туда.
                this.add(item.dataset)));
    },

    add(item) {
        // Находим индекс товара
        const goodIndex = this.goods.findIndex(good => good.id === item.id);
        if (goodIndex !== -1) {
            // Если такой товар есть, прибавляем к количеству единицу
            this.goods[goodIndex].count++;
        } else {
            // Если не было такого товара, то создаем новый товар.
            this.goods.push({
                id: item.id,
                count: 1,
                name: item.name,
                price: item.price,
                imgSrc: item.src,
            });
        }

        // Раз корзина изменилась, отображаем ее заново.
        this.renderBasket();
    },

    // Отображение корзины.
    renderBasket() {
        // Чистим корзину от товаров, что там уже были.
        this.cartEl.innerHTML = '';
        // Ставим новую общую цену.
        this.priceEl.textContent = this.getSumPrice().toFixed(2);
        this.countEl.textContent = this.goods.length;

        if (this.goods.length === 0) {
            // Если товаров нет в корзине, то скрываем значек с количеством товаров и выходим отсюда.
            this.countEl.style.opacity = 0;
            return;
        }

        // Если товары существуют в корзине, то отображаем количество.
        this.countEl.style.opacity = 1;

        // В цикле проходимся по всем товарам и каждый вставляем в корзину.
        this.goods.forEach(good => {
            // Получаем html товара и вставляем этот html в корзину.
            this.cartEl.appendChild(this.getGoodHtml(good));
        });
    },

    // Функция создает html товара.
    getGoodHtml(good) {
        // Здесь будет собираться ВЕСЬ html для одного товара, данные о товаре переданы в функцию.
        // В переменной good лежит объект, который содержит id, name и т.д.
        // Формируем здесь весь html и возвращаем его из этой функции.
        // Если функция слишком большая, то разбиваем эту функцию на более маленькие,
        // чтобы одна функция создала звезды, другая создала картинку, третья название и т.д...
        // Все что ниже сейчас - это чисто для примера.
        // Создаем общую обертку.
        const cartItem = document.createElement('div'); // общая оболочка
        cartItem.className = this.settings.cartSelector.slice(1) + '_item'; //назначаем класс
        const imgItem = document.createElement('img');
        imgItem.src = good.imgSrc;
        cartItem.appendChild(imgItem);
        // Создаем элемент с названием, ценой и количеством.
        const myDiv = document.createElement('div');
        const myName = document.createElement('p');
        myName.textContent = good.name;
        myDiv.appendChild(myName);
        cartItem.appendChild(myDiv);
        // создаем рейтинг
        const myStar = document.createElement('div');
        myDiv.appendChild(myStar);
        myStar.className = 'star-rating_wrap';
        myStar.innerHTML = '<input class="star-rating__input" id="star-rating-5" type="radio" name="rating"\n' +
            'value="5">\n' + '<label class="star-rating__ico fa fa-star-o fa-lg" for="star-rating-5"\n' +
            'title="5 out of 5 stars"></label>\n' +
            '<input class="star-rating__input" id="star-rating-4" type="radio" name="rating"\n' +
            'value="4">\n' + '<label class="star-rating__ico fa fa-star-o fa-lg" for="star-rating-4"\n' +
            'title="4 out of 5 stars"></label>\n' +
            '<input class="star-rating__input" id="star-rating-3" type="radio" name="rating"\n' +
            'value="3">\n' + '<label class="star-rating__ico fa fa-star-o fa-lg" for="star-rating-3"\n' +
            'title="3 out of 5 stars"></label>\n' +
            '<input class="star-rating__input" id="star-rating-2" type="radio" name="rating"\n' +
            'value="2">\n' + '<label class="star-rating__ico fa fa-star-o fa-lg" for="star-rating-2"\n' +
            'title="2 out of 5 stars"></label>\n' +
            '<input class="star-rating__input" id="star-rating-1" type="radio" name="rating"\n' +
            'value="1">\n' + '<label class="star-rating__ico fa fa-star-o fa-lg" for="star-rating-1"\n' +
            'title="1 out of 5 stars"></label>';

        const myPrice = document.createElement('p');
        myPrice.textContent = good.count + ' ' + 'x' + ' ' + '$' + good.price;
        myDiv.appendChild(myPrice);

        // Кнопку удалить
        const deleteBtn = document.createElement('div');
        deleteBtn.className = this.settings.cartSelector.slice(1) + '_del';
        deleteBtn.dataset.id = good.id;
        deleteBtn.innerHTML = '<i class="fa fa-times-circle" aria-hidden="true"></i>';
        deleteBtn.addEventListener('click', () => this.deleteGood(good.id));
        cartItem.appendChild(deleteBtn);

        //console.log(imgItem);

        // Возвращаем наш "товар".
        return cartItem;
    },

    // Функция удаляет товар.
    deleteGood(id) {
        // Находим индекс товара.
        const goodIndex = this.goods.findIndex(good => good.id === id);
        if (this.goods[goodIndex].count === 1) {
            // Если количество товара 1, то удаляем этот товар.
            this.goods.splice(goodIndex, 1);
        } else {
            // Если количество товара больше, то уменьшаем количество на 1.
            this.goods[goodIndex].count--;
        }

        // Т.к. поменялась корзина, занова выводим ее.
        this.renderBasket();
    },

    // Считаем сумму товаров.
    getSumPrice() {
        let sum = 0;
        // Перебираем все товары.
        this.goods.forEach(good => {
            let num = good.price;
            // У вас в цене, в аттрибуте data-price не должно лежать $, там должна лежать только цифра.
            // Доллары потом сами вставите туда, куда нужно. Поэтому тут просто будет подсчет не более того.
            //num = parseFloat(num.replace(/\$/, "")); //берем только цифры, очки и запятые, окргуляем, это надо будет убрать
            sum += num * good.count;  // прибавляем цену товара помноженное на количество к общей сумме.
        });

        // возвращаем общую сумму.
        return sum;
    },
};

// инициализируем корзину.
window.onload = () => cart.init();