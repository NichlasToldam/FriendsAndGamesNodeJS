$(document).ready(() => {
    $.ajax({
        url: 'games/',
        method: 'GET',
        dataType: 'json'
    })
    .done((games) => {
        games.forEach((game) => {
            const gameCard =    "<div class='video-card'>" +
                                    "<div id='" + game.fileName + "' class='game'>" +
                                        "<h1>"+ game.title +"</h1>" +
                                        "<img src='"+ game.gameImage +"'></img>" +
                                    "</div>" +
                                "</div>";                              
        $(".gamesDisplay").append(gameCard);  
        var alt_val, elem, i, timeout;      

        $('#'+game.fileName)
        .mouseenter(function() {
            $(this).data('old-val', this.value);
            elem = this;
            alt_val = $(this).data('alt-val').split(';');
            i = 0;
            timeout = setTimeout(loop, 500);
        })
        .mouseout(function() {
            clearTimeout(timeout);
            this.value = $(this).data('old-val');
        });

        function loop() {
        if (i === alt_val.length) {
            elem.value = $(elem).data('old-val');
            i = 0;
        } else {
            elem.value = alt_val[i++];
        }
        timeout = setTimeout(loop, 500);
        }

        });
    });
});