const allLinks = document.querySelectorAll("a:link");

allLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
        e.preventDefault();
        const href = link.getAttribute("href");

        if (href.includes("#")) {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        } else {
            window.location.href = href
        }

        // Scroll to other links
        if (href !== "#" && href.startsWith("#")) {
            const sectionEl = document.querySelector(href);
            sectionEl.scrollIntoView({ behavior: "smooth" });
        }
    });
});

const items = ['one', 'two', 'three', 'four'];
const cards = ['name-review', 'needs', 'price', 'contacts'];
let rememberActive = 1;

$("#next").click(function () {
    if (rememberActive == 1) {
        var name = $('#name').val()
        var email = $('#email').val()
        var number = $('#number').val()
        if (name.trim() == "" || email.trim() == "" || number.trim() == "") {return;}
    }
    if (rememberActive == 2) {
        var needs = $('.needs-item.active').text()
        if (needs.trim() == "") {return;}
    }
    if (rememberActive == 3) {
        var price = $('.price-item.active').text()
        if (price.trim() == "") {return;}
    }
    if (rememberActive == 4) {
        var contacts = $('.contacts-item.active').text()
        if (contacts.trim() == "") {return;}
    }
    if ($("#next").text() == "Zakończ") {
        showDoneScreen();
        return
    }
    if (rememberActive > 0) {
        $('#back').fadeIn()
    } else {
        $('#back').fadeOut()
    }
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
                if (index == 3) {
                    $("#next").text("Zakończ")
                } else {
                    $("#next").text("Dalej")
                }
            }
        });
    }, 350);
    if ((rememberActive+1)<=items.length) {
        rememberActive++;
    }
})

$("#back").click(function () {
    if (rememberActive > 2) {
        $('#back').fadeIn()
    } else {
        $('#back').fadeOut()
    }
    $("#next").text("Dalej")
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

function showDoneScreen() {
    const player = document.querySelector("lottie-player");
    $('.contact__card-step-done').css('display', 'flex').hide().fadeIn();
    $('.contact__bottom-btns').fadeOut();
    cards.forEach((item) => {
        $('.'+item).fadeOut();
    });
    $('.contact__card ul').fadeOut(function() {
        $('.contact__card-steps').css('height', '500px');
    })
    let confetti = new Confetti("confetti-body");
    confetti.setCount(175);
    confetti.setSize(1);
    confetti.setPower(25);
    confetti.setFade(false);
    setTimeout(function() {
        player.play()
        $('#confetti-body').click();
    }, 500);

    var name = $('#name').val()
    var email = $('#email').val()
    var number = $('#number').val()
    var needs = $('.needs-item.active').text()
    var price = $('.price-item.active').text()
    var contacts = $('.contacts-item.active').text()

    var sendInfo = {
        name: name.trim(),
        email: email.trim(),
        number: number.trim(),
        needs: needs.trim(),
        price: price.trim(),
        contacts: contacts.trim(),
    };

    $.ajax({
        type: "POST",
        url: '/send-order',
        dataType: "json",
        data: sendInfo,
        success: function(data) {
            console.log(data)
        }
    });
}