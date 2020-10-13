/**
 * Phone number validation.
 *
 * @param {string} str - string to  validate.
 * @return {boolean}.
 */
function phoneCheck(str) {
    return /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g.test(str);
}

/**
 * Sort array items alphabetically by "name" property.
 *
 * @param {object} a - current item.
 * @param {object} b - next item to compare.
 * @return {number} - "-1" - move up, "1" - move down.
 */
function sortByName(a, b) {
    if (a.name < b.name) {
        return -1;
    }
    else if (a.name > b.name) {
        return 1;
    }
    return 0;
}

/**
 * Sort array items alphabetically by "fav" property.
 *
 * @param {object} a - current item.
 * @param {object} b - next item to compare.
 * @return {number} - "-1" - move up, "1" - move down.
 */
function sortByFav(a, b) {
    var aN = a.fav === true ? 1 : 0;
    var bN = b.fav === true ? 1 : 0;

    if (aN > bN) {
        return -1;
    }
    else if (aN < bN) {
        return 1;
    }
    return 0;
}

$(document).ready(function() {
    var book = localStorage.getItem('book') ? JSON.parse(localStorage.getItem('book')) : [];
    var listSelector = 'ul#contacts'; // Contact list selector.

    /**
     * Build lists based on array items.
     *
     * @param {string} listIDSelector - selector of an HTML container.
     * @param {array} arr - array with items.
     */
    var buildList = function (listIDSelector ,arr) {
        var contactItemHTML = '';

        if (!arr.length) {
            return true;
        }

        arr.forEach(function (entry) {
            var isFav = entry.fav ? "contact-item-fav" : ''; // spec. class.

            contactItemHTML += "<li class='contact-item " + isFav + "'>" +
                "<div class='contact-info'>" +
                    "<span class='contact-name'>" + entry.name + "" + "</span>" +
                    "<span class='contact-phone'>" + entry.phone + "" + "</span>" +
                "</div>" +
                "<div class='contact-options'>" +
                    "<button class='fv fv-" + entry.fav + "'>*</button>" +
                    "<button class='rm'>-</button>" +
                "</div>" +
                "</li>";
        });

        // Build contact lists:
        $(listIDSelector).html(contactItemHTML);
    }

    buildList(listSelector, book);

    $('form#new-contact').on('submit', function(event) {
        event.preventDefault();

        if (!phoneCheck($('input#new-phone').val())) {
            $('input#new-phone ~ .message').show();
            return true;
        }
        else {
            $('input#new-phone ~ .message').hide();
        }

        var inputtedName = $('input#new-name').val();
        var inputtedPhone = $('input#new-phone').val();
        var fav = $('input#fav').prop('checked');
        var newContact = {
            name: inputtedName,
            phone: inputtedPhone,
            fav: fav,
        };

        book.push(newContact);
        book.sort(sortByName);
        book.sort(sortByFav);
        localStorage.setItem('book', JSON.stringify(book));
        buildList(listSelector, book);

        if (phoneCheck($('input#new-phone').val())) {
            // Clear inputs:
            $('input#new-name').val('');
            $('input#new-phone').val('');
            $('input#fav').prop('checked', false);
        }
    });

    // Add contact to favorites:
    $(listSelector).on('click', '.contact-options .fv', function(event) {
        var $ind = $(event.currentTarget).closest('.contact-item').index();
        var updatedContact = {
            name: book[$ind].name,
            phone: book[$ind].phone,
            fav: book[$ind].fav !== true,
        };
        book.splice($ind, 1, updatedContact);
        book.sort(sortByName);
        book.sort(sortByFav);
        localStorage.setItem('book', JSON.stringify(book));
        buildList(listSelector, book);
    });

    // Remove contact:
    $(listSelector).on('click', '.contact-options .rm', function(event) {
        var $ind = $(event.currentTarget).closest('.contact-item').index();
        book.splice($ind, 1);
        book.sort(sortByName);
        book.sort(sortByFav);
        localStorage.setItem('book', JSON.stringify(book));
        buildList(listSelector, book);
    });
});