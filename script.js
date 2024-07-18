document.addEventListener('DOMContentLoaded', (event) => {
    // Инициализация переменных
    let counter = parseInt(localStorage.getItem('counter')) || 0;
    let clickPower = parseInt(localStorage.getItem('clickPower')) || 1;
    let upgradeCost = parseInt(localStorage.getItem('upgradeCost')) || 10;
    let passiveIncome = parseInt(localStorage.getItem('passiveIncome')) || 0;
    let passiveUpgrades = JSON.parse(localStorage.getItem('passiveUpgrades')) || [];
    let theme = localStorage.getItem('theme') || 'light';

    const counterElement = document.getElementById('counter');
    const clicksPerHourElement = document.getElementById('clicksPerHour');
    const clickButton = document.getElementById('clickButton');
    const upgradeButton = document.getElementById('upgradeButton');
    const upgradeCostElement = document.getElementById('upgradeCost');
    const passiveButton = document.getElementById('passiveButton');
    const passiveMenu = document.getElementById('passiveMenu');
    const themeToggleButton = document.getElementById('themeToggle');
    const coinImage = document.getElementById('coinImage');

    const devCounterInput = document.getElementById('devCounter');
    const setCounterButton = document.getElementById('setCounterButton');

    // Лиги и соответствующие им изображения
    const leagues = [
        { threshold: 0, image: 'coin.png' },
        { threshold: 100000, image: 'silver_coin.png' },
        { threshold: 1000000, image: 'gold_coin.png' },
        { threshold: 10000000, image: 'diamond_coin.png' },
        { threshold: 100000000, image: 'skibidi_coin.png' }
    ];

    // Установка начальной темы
    document.body.classList.toggle('dark', theme === 'dark');

    // Обновление интерфейса при загрузке
    counterElement.textContent = counter;
    upgradeCostElement.textContent = upgradeCost;
    updatePassiveClicksPerHour();
    updateLeagueImage();

    // Обработчик кликов по кнопке
    clickButton.addEventListener('click', () => {
        counter += clickPower;
        counterElement.textContent = counter;
        localStorage.setItem('counter', counter);
        updateLeagueImage();
    });

    // Обработчик кликов по кнопке улучшения
    upgradeButton.addEventListener('click', () => {
        if (counter >= upgradeCost) {
            counter -= upgradeCost;
            clickPower++;
            upgradeCost = Math.floor(upgradeCost * 1.5); // Увеличение стоимости улучшения

            // Обновление интерфейса
            counterElement.textContent = counter;
            upgradeCostElement.textContent = upgradeCost;

            // Сохранение прогресса
            localStorage.setItem('counter', counter);
            localStorage.setItem('clickPower', clickPower);
            localStorage.setItem('upgradeCost', upgradeCost);
        } else {
            alert('Not enough points to upgrade!');
        }
    });

    // Обработчик кликов по пассивным улучшениям
    document.querySelectorAll('.passiveUpgrade').forEach(tile => {
        tile.addEventListener('click', () => {
            const cost = parseInt(tile.getAttribute('data-cost'));
            const income = parseInt(tile.getAttribute('data-income'));

            if (counter >= cost) {
                counter -= cost;
                passiveIncome += income;

                // Сохранение прогресса
                passiveUpgrades.push({ cost, income });
                localStorage.setItem('counter', counter);
                localStorage.setItem('passiveIncome', passiveIncome);
                localStorage.setItem('passiveUpgrades', JSON.stringify(passiveUpgrades));

                updatePassiveClicksPerHour();

                // Обновление интерфейса
                counterElement.textContent = counter;
            } else {
                alert('Not enough points to buy this upgrade!');
            }
        });
    });

    // Обработчик переключения темы
    themeToggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        theme = document.body.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });

    // Обработчик установки счёта через панель разработчика
    setCounterButton.addEventListener('click', () => {
        const newCounter = parseInt(devCounterInput.value);
        if (!isNaN(newCounter)) {
            counter = newCounter;
            counterElement.textContent = counter;
            localStorage.setItem('counter', counter);
            updateLeagueImage();
        }
    });

    // Функция для открытия/закрытия меню пассивных улучшений
    window.toggleMenu = function () {
        if (passiveMenu.classList.contains('open')) {
            passiveMenu.classList.remove('open');
        } else {
            passiveMenu.classList.add('open');
        }
    }

    // Функция для пассивного увеличения счётчика
    setInterval(() => {
        counter += passiveIncome;
        counterElement.textContent = counter;
        localStorage.setItem('counter', counter);
        updateLeagueImage();
    }, 1000); // Увеличение счётчика каждую секунду на количество пассивного дохода

    // Функция для обновления количества пассивных кликов в час
    function updatePassiveClicksPerHour() {
        const clicksPerHour = passiveIncome * 3600;
        clicksPerHourElement.textContent = clicksPerHour;
    }

    // Функция для обновления изображения в зависимости от количества очков
    function updateLeagueImage() {
        for (let i = leagues.length - 1; i >= 0; i--) {
            if (counter >= leagues[i].threshold) {
                coinImage.src = leagues[i].image;
                break;
            }
        }
    }
});
