'use strict';

const btn = document.querySelectorAll('.mango_cart');
const cart = {
    settings: {
        countSelector: '#basket-count',
        priceSelector: '#basket-price',
        cartSelector: '.my_account_cart_box',

    },
    goods: [],
    countEl: null,
    priceEl: null,
    cartItem: null,
    imgClass: null,
    itemNamePriceStar: null, // вот это общий блок для названия, рейтинга и цены на товар
    nameClass: null,
    starClass: null,
    priceClass: null,
    delClass: null,

    init(settings = {}) {

        this.settings = Object.assign(this.settings, settings);
        this.countEl = document.querySelector(this.settings.countSelector);
        this.priceEl = document.querySelector(this.settings.priceSelector);
        this.cart = document.querySelector(this.settings.cartSelector); //Получаем доступ к корзине
        this.cartItem = this.settings.cartSelector.slice(1) + '_item';

        this.imgClass = this.settings.cartSelector.slice(1) + '_img';

        this.itemNamePriceStar = this.settings.cartSelector.slice(1) + '_NamePriceStar';
        this.nameClass = this.itemNamePriceStar + '_name';
        this.starClass = this.itemNamePriceStar + '_star';
        this.priceClass = this.itemNamePriceStar + '_price';

        this.delClass = this.settings.cartSelector.slice(1) + '_del';

        this.render(); //запустили рендеринг корзины
    },


    render() {

        this.countEl.textContent = this.goods.length;
        if (this.goods.length === 0) {
            this.countEl.style.opacity = 0;
        } else {
            this.countEl.style.opacity = 1;

            let item = document.createElement('div'), //Создаем див, который будет служить одной строкой корзины...
                img = document.createElement('img'), //создаем изображение
                itemNamePriceStar = document.createElement('div'), //Создаем блок с названием, ценой и рейтингом
                itemName = document.createElement('p'), // создаем имя товара
                itemStar = document.createElement('div'), //создаем рейтинг
                itemPrice = document.createElement('p'), //создаем цену
                del = document.createElement('div'); // создаем кнопку удаления


            item.className = this.cartItem; //назначаем класс(из настроек выше)
            img.src = this.goods[this.goods.length - 1].imgSrc; //заполняем необходимое из массива корзины(cart)
            img.className = this.imgClass; //назначаем класс(из настроек выше)
            itemNamePriceStar.className = this.itemNamePriceStar;
            itemName.className = this.nameClass; //назначаем класс(из настроек выше)
            itemName.innerText = this.goods[this.goods.length - 1].name;
            itemStar.className = this.starClass; //назначаем класс(из настроек выше)
            itemStar.innerHTML = '<i class="far fa-star"></i>'; // как нижезакоментированный html (рейтинг) вставить?



            itemPrice.className = this.priceClass; //назначаем класс(из настроек выше)
            itemPrice.innerText = this.goods[this.goods.length - 1].price;
            del.className = this.delClass; //назначаем класс(из настроек выше)
            del.innerHTML = '<i class="fa fa-times-circle" aria-hidden="true"></i>';

            del.addEventListener('click', function () {
                cart.delGood();
                item.remove();
            });

            item.appendChild(img); //в родительский див добавляем картинку,
            item.appendChild(itemName); //имя,
            item.appendChild(itemPrice); //цену,
            item.appendChild(del); //кнопку.
            this.cart.appendChild(item); //Добавляем этот Див в корзину
            this.getSum();
        }
    },
    add(name, price, src, id) { //функция добавить в корзину с аргументами
        this.goods.push({
            name: name,
            price: price,
            imgSrc: src,
            id: id
        });
        this.render(); //после того, как удалили товар - снова запускаем рендеринг
    },

    delGood() { //функция удалить из корзины товар
        this.goods.shift();
        this.render(); //после того, как к массиву корзины добавили товар - снова запускаем рендеринг
    },
    getSum() {
        let sum = 0;//объявляем переменную, которая будет счетчиком
        this.goods.forEach(function (item) { // для каждого элемента массива товаров
            let num = item.price; // получаем стоимость
            num = parseFloat(num.replace(/\$/, "")); //берем только цифры, очки и запятые, окргуляем
            if (!isNaN(num)) { // если полученный результат является числом
                sum += num;  // прибавляем его к сумме
            }

        });

        this.priceEl.textContent = sum.toFixed(2); //выводим его с округлением до сотых
    },

};

btn.forEach(function (item) {
    item.addEventListener('click', function () {
        //this.parentNode.parentNode; //получили блок родительский

        const name = this.dataset.name, // вытащили текст
            price = this.dataset.price, //  цена
            src = this.dataset.src, //это адрес картинки
            id = this.dataset.id;
        cart.add(name, price, src, id); //вызвали метод add с полученными параметрами
    })
});

window.onload = () => cart.init();
/*
document.querySelectorAll('.mango_cart').forEach(el => {
    el.addEventListener('click', function () {
        cart.add(this.dataset.name, this.dataset.full_image_url, +this.dataset.price);

    })
});*/
