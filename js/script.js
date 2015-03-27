var randomTexts = [
    'I like coffee.',
    'I like tea.',
    'I like hot chocolate.',
    'I like pizza.',
    'I like this color.',
    'That\'s me!',
    'Hello, World!',
    'Hello, you.',
    'I know you are reading this.',
    'Stop refreshing!',
    'Nice to meet you.',
    'Meow!',
    'Insert unnecessary message here.',
    'Thank you for visiting.',
    'Check out my stuff.',
    'Random text appears.',
    'Woof!',
    'The cake is a lie.',
    'The cake is a pie.',
    'Kappa',
    'Greetings.',
    'Fus Ro Dah!',
    'Go Pikachu!',
    'This is my true form.',
    '10 / 10, would visit again',
    '10 / 10, would refresh again',
    'Hey, how are you?',
    'This was the best idea I\'ve ever had!',
    'FrankerZ',
    '2 + 4 = Fish',
    '<b>I am bold.</b>',
    '10 / 10, would bookmark',
    'It\'s-a me!',
    'Welcome!',
        'Oh, it\'s ' + getTime() + '. I gotta go.',
    getDayOfWeek()];

function getRandomText() {
    var index = Math.floor(Math.random() * randomTexts.length);
    var randomText = randomTexts[index];

    var date = new Date();
    var strDate = date.getDate() + '.' + (date.getMonth() + 1) + '.';
    switch (strDate) {
        case '1.1.':
            randomText = 'Happy New Year!';
            break;
        case '30.1.':
            randomText = 'Happy Birthday!';
            break;
        case '31.10.':
            randomText = 'Happy Halloween!';
            break;
        case '25.12.':
            randomText = 'Merry Christmas!';
            break;
    }

    var headerSubtitle = document.getElementById('headerSubtitle');
    headerSubtitle.innerHTML = randomText;
}

function getTime() {
    var date = new Date();
    return date.getHours() + ':' + date.getMinutes();
}

function getDayOfWeek() {
    switch (new Date().getDay()) {
        case 1: return 'I hate Mondays.';
        case 2: return 'It\'s Tuesday!';
        case 3: return 'It\'s Wednesday!';
        case 4: return 'It\'s Thursday!';
        case 5: return 'TGIF';
        case 6: return 'It\'s Saturday!';
        case 0: return 'It\'s Sunday!';
    }

    return 'This message should never appear.';
}
