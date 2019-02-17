$(document).ready(function() {

    players = [];

    userInfo = [];

    // Ajout d'un user dans le tableau
    $('.add-gamer button').click(function(e) {

        e.preventDefault();
        let name = $(this).prev('input').val();

        if ( name != '' ) {

            players.push(name);

            $('.list-gamer .content').html('');
            for (i = 0; i < players.length; ++i) {
                $('.list-gamer .content').append('<div class="player"><button class="delete" data-key="' + i + '"><i class="icon-cancel-circled"></i></button><span>' + players[i] + '</span></div>')
            }
            $('.error').text('');
            $(this).prev('input').val('');

            // Suppression d'un user de la liste
            deleteUserList();

        } else {

            $(this).prev('input').val('');

        }
    });

    // Nouvelle partie
    $('.new-game').click(function(e) {
        e.preventDefault();
        $('#begin-play').hide().find('.content').html('');
        localStorage.clear();
    });

    updateOrder();

    // Enregistrer les scores
    $('.enter-score').click(function(e) {
        e.preventDefault();

        if ( $('#begin-play .content').hasClass('selected') ) {

            for ( s = 0; s < localStorage.length; s++) {

                if ( $('.user[data-user="'+s+'"] input[type="number"]').val() !== "" ) {
                    var newScore = parseFloat($('.user[data-user="'+s+'"] input[type="number"]').val()); // valeur du champ input
                } else if ( $('.user[data-user="'+s+'"]').hasClass('the-winner') ) {
                    var newScore = -20;
                } else {
                    var newScore = 0;
                }

                var actuallyScore = parseFloat(localStorage.getItem(localStorage.key(s)));

                // SCORE FINAL
                var score = newScore + actuallyScore;

                localStorage.setItem(localStorage.key(s), score);

                $('.user[data-user="'+s+'"] .points span').text(parseFloat(localStorage.getItem(localStorage.key(s))));
                $('.user[data-user="'+s+'"]').attr('data-score', score);

                // Ajout de marque au vainqueur
                if ( $('.user[data-user="'+s+'"]').hasClass('the-winner') ) {
                    $('.user[data-user="'+s+'"] .winner').append('<span></span>');
                }

                // Ajout de l'historique des points
                var historique = $('.user[data-user="'+s+'"] .historique').html();
                if ( historique == "") {
                    historique = '<span>' + newScore + '</span>';
                } else {
                    historique += ' / <span>' + newScore + '</span>';
                }
                $('.user[data-user="'+s+'"] .historique').html(historique);

            }

            // reset
            $('.user input').val('');
            $('.user .win input').prop('checked', false);
            $('.user').removeClass('the-winner').parent('.content').removeClass('selected');
            $('.error-winner').text('');

        } else {
            $('.error-winner').text('Veuillez sélectionner un vainqueur !');
        }
    });

    // Mettre à jour la liste
    $('.maj').click(function(e) {
        e.preventDefault();

        for ( f = 0; f < localStorage.length; f++) {

            if ( $('.user[data-user="'+f+'"] input[type="number"]').val() !== "" ) {
                var newScore = parseFloat($('.user[data-user="'+f+'"] input[type="number"]').val()); // valeur du champ input
            } else {
                var newScore = 0;
            }

            var actuallyScore = parseFloat(localStorage.getItem(localStorage.key(f)));
            var score = newScore + actuallyScore;
            localStorage.setItem(localStorage.key(f), score);

            $('.user[data-user="'+f+'"] .points span').text(parseFloat(localStorage.getItem(localStorage.key(f))));

            // Correction du dernier score en historique
            $('.user[data-user="'+f+'"] .historique span:last-child').text(score);

        }
        
        // reset
        $('.user input').val('');
        $('.user .win input').prop('checked', false);
        $('.user').removeClass('the-winner').parent('.content').removeClass('selected');

    });

    $('.sortBy .cross-close').click(function() {
        $('.sortBy').hide();
        $('.sortBy .content .sort-user').remove();

    });

    // Lancer la partie
    $('.play').click(function(e) {
        e.preventDefault();

        localStorage.clear();
        $.each(players, function(index, value) {
            localStorage.setItem(value, 0);
        });

        if ( $('.list-gamer .content').html() !== "" ) {

            $('#begin-play').show();

            for ( e = 0; e < localStorage.length; e++) {

                var keyName = localStorage.key(e);

                $('#begin-play > .content').append('<div class="user" data-user="'+ e +'" data-score="0" data-name="'+ keyName +'"><div class="win"><i class="icon-crown"></i></div><div class="name">'+ localStorage.key(e) +'<span class="winner"></span></div><div class="points"><input type="number" /><span>'+ localStorage.getItem(localStorage.key(e)) +'</span> pts</div><div class="historique"></div></div>');
            }

            $('.error').text('');

        } else {
            $('.error').text('Veuillez ajouter des joueurs avant de lancer une nouvelle partie');
        }

        // Ajout variable pour le vainqueur
        $('.win').click(function() {
            $('.win:not(this)').parents('.user').removeClass('the-winner');
            $(this).parents('.user').addClass('the-winner').parents('.content').addClass('selected');
        });

    });
});

function deleteUserList() {

    $('.delete').on('click', function(e) {
        e.preventDefault();

        var elementToDelete = $(this).attr('data-key');

        players.splice(elementToDelete, 1);

        $('.list-gamer .content').html('');
        for (i = 0; i < players.length; ++i) {
            $('.list-gamer .content').append('<div class="player"><button class="delete" data-key="' + i + '"><i class="icon-cancel-circled"></i></button><span>' + players[i] + '</span></div>')
        }

        // Suppression d'un user de la liste
        deleteUserList();

        console.log(players);
    });
}

function updateOrder() {

    $('.sort').click(function() {

        $('.sortBy').show();
        divList = $(".user");
        divList.sort(function (a, b) {
            return  $(a).attr('data-score') - $(b).attr('data-score');
        });
        for (i = 0; i < localStorage.length; i++) {
            $('<div class="sort-user"><div class="sort-classement">' + (i+1) + '<span>e</span></div><div class="sort-pseudo">' + divList.eq(i).attr('data-name') + '</div><div class="sort-score">' + divList.eq(i).attr('data-score') + ' points</div></div>').appendTo(".sortBy .content");
        }

    });

}