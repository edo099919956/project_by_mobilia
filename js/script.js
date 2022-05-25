// ----------slider---------
'use strict';
var multiItemSlider = (function() {
    return function(selector, config) {
        var
            _mainElement = document.querySelector(selector), // основный элемент блока
            _sliderWrapper = _mainElement.querySelector('.slider__wrapper'), // обертка для .slider-item
            _sliderItems = _mainElement.querySelectorAll('.slider__item'), // элементы (.slider-item)
            _sliderControls = _mainElement.querySelectorAll('.slider__control'), // элементы управления
            _sliderControlLeft = _mainElement.querySelector('.slider__control_left'), // кнопка "LEFT"
            _sliderControlRight = _mainElement.querySelector('.slider__control_right'), // кнопка "RIGHT"
            _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width), // ширина обёртки
            _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width), // ширина одного элемента    
            _positionLeftItem = 0, // позиция левого активного элемента
            _transform = 0, // значение транфсофрмации .slider_wrapper
            _step = _itemWidth / _wrapperWidth * 100, // величина шага (для трансформации)
            _items = [], // массив элементов
            _interval = 0,
            _config = {
                isCycling: true, // автоматическая смена слайдов
                direction: 'right', // направление смены слайдов
                interval: 7000, // интервал между автоматической сменой слайдов
                pause: true // устанавливать ли паузу при поднесении курсора к слайдеру
            };

        for (var key in config) {
            if (key in _config) {
                _config[key] = config[key];
            }
        }

        // наполнение массива _item
        _sliderItems.forEach(function(item, img_click) {
            _items.push({ item: item, position: img_click, transform: 0 });
        });

        var position = {
            getItemMin: function() {
                var img_clickItem = 0;
                _items.forEach(function(item, img_click) {
                    if (item.position < _items[img_clickItem].position) {
                        img_clickItem = img_click;
                    }
                });
                return img_clickItem;
            },
            getItemMax: function() {
                var img_clickItem = 0;
                _items.forEach(function(item, img_click) {
                    if (item.position > _items[img_clickItem].position) {
                        img_clickItem = img_click;
                    }
                });
                return img_clickItem;
            },
            getMin: function() {
                return _items[position.getItemMin()].position;
            },
            getMax: function() {
                return _items[position.getItemMax()].position;
            }
        };

        var _transformItem = function(direction) {
            var nextItem;
            if (direction === 'right') {
                _positionLeftItem++;
                if ((_positionLeftItem + _wrapperWidth / _itemWidth - 1) > position.getMax()) {
                    nextItem = position.getItemMin();
                    _items[nextItem].position = position.getMax() + 1;
                    _items[nextItem].transform += _items.length * 100;
                    _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
                }
                _transform -= _step;
            }
            if (direction === 'left') {
                _positionLeftItem--;
                if (_positionLeftItem < position.getMin()) {
                    nextItem = position.getItemMax();
                    _items[nextItem].position = position.getMin() - 1;
                    _items[nextItem].transform -= _items.length * 100;
                    _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
                }
                _transform += _step;
            }
            _sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
        };

        var _cycle = function(direction) {
            if (!_config.isCycling) {
                return;
            }
            _interval = setInterval(function() {
                _transformItem(direction);
            }, _config.interval);
        };

        // обработчик события click для кнопок "назад" и "вперед"
        var _controlClick = function(e) {
            if (e.target.classList.contains('slider__control')) {
                e.preventDefault();
                var direction = e.target.classList.contains('slider__control_right') ? 'right' : 'left';
                _transformItem(direction);
                clearInterval(_interval);
                _cycle(_config.direction);
            }
        };

        var _setUpListeners = function() {
            // добавление к кнопкам "назад" и "вперед" обрботчика _controlClick для событя click
            _sliderControls.forEach(function(item) {
                item.addEventListener('click', _controlClick);
            });
            if (_config.pause && _config.isCycling) {
                _mainElement.addEventListener('mouseenter', function() {
                    clearInterval(_interval);
                });
                _mainElement.addEventListener('mouseleave', function() {
                    clearInterval(_interval);
                    _cycle(_config.direction);
                });
            }
        };

        // инициализация
        _setUpListeners();
        _cycle(_config.direction);

        return {
            right: function() { // метод right
                _transformItem('right');
            },
            left: function() { // метод left
                _transformItem('left');
            },
            stop: function() { // метод stop
                _config.isCycling = false;
                clearInterval(_interval);
            },
            cycle: function() { // метод cycle 
                _config.isCycling = true;
                clearInterval(_interval);
                _cycle();
            }
        }
    }
}());

multiItemSlider('.slider', {
        isCycling: true
    })
    // -- -- -- -- -- -- -- - mobile panel open & close-- -- -- -- -- -- -- -
let mobile_panel = document.querySelector(".mobile_panel");
document.querySelector(".btn_open_top").onclick = () => {
    if (mobile_panel.style.marginTop != "438px") {
        mobile_panel.style.marginTop = "438px"
        mobile_panel.style.opacity = "1";
        document.querySelector("header").setAttribute("style", "background-color:white")
    } else {
        mobile_panel.style.marginTop = "-500px"
        mobile_panel.style.opacity = "0"
    }
    document.querySelector("main").onclick = () => {
        mobile_panel.style.marginTop = "-500px"
        mobile_panel.style.opacity = "0"
    }
    window.addEventListener("scroll", () => {
        if (scrollY < 50 || scrollY > 50) {
            mobile_panel.style.marginTop = "-500px"
            mobile_panel.style.opacity = "0"
        }
    })
}

// window scroll
window.addEventListener("scroll", () => {
    if (scrollY > 20) {
        document.querySelector("header").setAttribute("style", "background-color: #ffffffdb; height:45px;");
    }
    if (scrollY < 20) {
        document.querySelector("header").setAttribute("style", "");
    }
})

// click too slider
let img_click = document.querySelectorAll(".img_hover");

for (let i = 0; i < img_click.length; i++) {
    img_click[i].onclick = () => {
        location.href = 'oter_slider/slider.html'
    }
}

// loader
window.onload = function() {
    setTimeout(() => {
        document.querySelector(".box").style.display = "none"
    }, 1500);
};