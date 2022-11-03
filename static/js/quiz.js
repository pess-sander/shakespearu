$(document).ready(() => {

    const QUESTION_TIME = 10 * 1000;

    let question_num = 0;
    let hearts = 5;
    let timebar_timer = null;
    let timebar_width = 100;
    let out_of_time_timer = null;
    let right_num;

    let in_question = true;
    let won = null;

    console.log(words);

    function reset_hearts() {
        hearts = 5;

        let empty_hearts = document.getElementsByClassName('heart-empty');
        while (empty_hearts.length > 0) {
            empty_hearts[0].classList.add('heart-full');
            empty_hearts[0].classList.remove('heart-empty');
        }
    }

    function right_click() {
        if (in_question) {
            $('.quiz-ans-btn#right').addClass('right');
            in_question = false;
            won = true;
            $('#quiz-next').show();

            clearInterval(timebar_timer);
            clearTimeout(out_of_time_timer);
        }
    }

    function wrong_click() {
        if (in_question) {
            $('.quiz-ans-btn#wrong').addClass('wrong');
            in_question = false;
            won = false;
            $('#quiz-next').show();

            clearInterval(timebar_timer);
            clearTimeout(out_of_time_timer);

            kill_heart();
        }
    }

    function next_question() {
        if (hearts <= 0) {
            $('#quiz-question').hide();
            $('#quiz-lost').show();
            question_num = 0;
            reset_hearts();
            return;
        }

        if (question_num >= 20) {
            $('#quiz-question').hide();
            $('#quiz-won').show();
            question_num = 0;
            reset_hearts();
            return;
        }

        let right = words[question_num].right;
        let wrong = words[question_num].wrong;
        right_num = Math.floor(Math.random() * 2);

        $(`#ans${right_num}`).attr('id', 'right');
        $(`#ans${1-right_num}`).attr('id', 'wrong');
        $('#right').text(right);
        $('#wrong').text(wrong);
        document.getElementById('right').addEventListener('click', right_click);
        document.getElementById('wrong').addEventListener('click', wrong_click);

        timebar_width = 100;
        $('#time-bar').width(`${timebar_width}%`);

        question_num += 1;
        $('#question-num').text(question_num);

        in_question = true;
        won = null;

        timebar_width -= 0.1;
        $('#time-bar').width(`${timebar_width}%`);
        timebar_timer = setInterval(() => {
            timebar_width -= 0.2;
            $('#time-bar').width(`${timebar_width}%`);
        }, QUESTION_TIME / 500);

        out_of_time_timer = setTimeout(() => {
            clearInterval(timebar_timer);
            in_question = false;
            won = false;
            $('.quiz-ans-btn#right').addClass('right');

            kill_heart();

            $('#quiz-next').show();
        }, QUESTION_TIME + 50);
    }

    function kill_heart() {
        hearts -= 1;
        let full_hearts = document.getElementsByClassName('heart-full');
        let curr_el = full_hearts[full_hearts.length - 1]
        curr_el.classList.remove('heart-full');
        curr_el.classList.add('heart-half');

        setTimeout(() => {
            curr_el.classList.remove('heart-half');
            curr_el.classList.add('heart-empty');
        }, 150);
    }

    $('#start').click(() => {
        $('#quiz-intro').hide();
        $('#quiz-question').show();

        next_question();
    });

    $('#quiz-next-btn').click(() => {
        $('.quiz-ans-btn#right').removeClass('right');
        $('.quiz-ans-btn#wrong').removeClass('wrong');
        document.getElementById('right').removeEventListener('click', right_click);
        document.getElementById('wrong').removeEventListener('click', wrong_click);
        $('#right').attr('id', `ans${right_num}`);
        $('#wrong').attr('id', `ans${1-right_num}`);

        $('#quiz-next').hide();
        next_question();
    });

    $('.quiz-ans-btn').click(() => {
        console.log()
    });

    $('#quiz-return1').click(() => {
        $('#quiz-won').hide();
        $('#quiz-intro').show();
    });
    $('#quiz-return2').click(() => {
        $('#quiz-lost').hide();
        $('#quiz-intro').show();
    });

});