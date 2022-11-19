const one = document.querySelector(".one");
const two = document.querySelector(".two");
const three = document.querySelector(".three");
const four = document.querySelector(".four");

one.onclick = function() {
    one.classList.add("active");
    two.classList.remove("active");
    three.classList.remove("active");
    four.classList.remove("active");
}

two.onclick = function() {
    one.classList.add("active");
    two.classList.add("active");
    three.classList.remove("active");
    four.classList.remove("active");
}
three.onclick = function() {
    one.classList.add("active");
    two.classList.add("active");
    three.classList.add("active");
    four.classList.remove("active");
}
four.onclick = function() {
    one.classList.add("active");
    two.classList.add("active");
    three.classList.add("active");
    four.classList.add("active");
}

const items = ['one', 'two', 'three', 'four'];
const cards = ['name-review', 'needs', 'price', 'contacts'];
let rememberActive = 1;

$("#next").on("click", function() {
    items.forEach((item, index) => {
        $('.'+item).removeClass("active");
    });
    items.forEach((item, index) => {
        if (index <= rememberActive) {
            $('.'+item).addClass("active");
        }
    });
    cards.forEach((item, index) => {
        $('.'+item).fadeOut();
    });
    setTimeout(function() {
        cards.forEach((item, index) => {
            if (index == rememberActive-1) {
                $('.'+item).fadeIn();
            }
        });
    }, 350);
    if ((rememberActive+1)<=items.length) {
        rememberActive++;
    }
})

$("#back").on("click", function() {
    items.forEach((item, index) => {
        $('.'+item).removeClass("active");
    });
    items.forEach((item, index) => {
        if (index < rememberActive-1) {
            $('.'+item).addClass("active");
        }
    });
    cards.forEach((item, index) => {
        $('.'+item).fadeOut();
    });
    setTimeout(function() {
        cards.forEach((item, index) => {
            if (item == cards[rememberActive-1]) {
                $('.'+item).fadeIn();
            }
        });
    }, 350);
    if (rememberActive >= 2) {
        rememberActive--;
    }
})

$('.needs-item').click(function () {
    $('.needs-item').removeClass('active');
    $(this).addClass("active");
});

$('.price-item').click(function () {
    $('.price-item').removeClass('active');
    $(this).addClass("active");
});

$('.contacts-item').click(function () {
    $('.contacts-item').removeClass('active');
    $(this).addClass("active");
});

$('#show_contact_btn').click(function () {
    $(this).fadeOut('fast', function () {
        $('.contact__card').css('display', 'flex').hide().fadeIn();
        $([document.documentElement, document.body]).animate({
            scrollTop: $(".contact__card").offset().top - 20
        }, 2000);
    });
});