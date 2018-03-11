var data = [
    "Taylor Swift",
    "Michael Jackson",
    "Football",
    "Cat",
    "Dog",
    "Coding",
    "College",
    "Basketball",
    "Car",
    "Meme",
    "Sword",
    "Gun",
    "Virtual Reality",
]
var apiKey = "afdUAkCwcDGyEQcK3PIYGorOPdFVfOTq";
var apiUrl = "https://api.giphy.com/v1/gifs/search?api_key=" + apiKey + "&limit=20";
$(document).ready(function(){
    //button creation function
    function createButton(buttonText){
        var button = $("<button>");
        button.addClass("btn btn-secondary gifButton");
        button.text(buttonText);
        $("#topics").append(button);
    }
    //initial button creation using data array
    data.forEach(function(element){
        createButton(element);
    });
    //listener to add new buttons
    $("#addButton").on("click", function(event){
        event.preventDefault();
        var newTopic = $("#addTopic").val().trim();
        //check for nonempty value
        //check for uniqueness
        if (newTopic != "" && data.indexOf(newTopic)==-1){
            //append newTopic into data array
            data.push(newTopic);
            createButton(newTopic);
        }
    });
    function createGifCard(rate, still, animate){
        //use handlebards as templating engine
        var source = $("#card-template").html();
        var template = Handlebars.compile(source);
        var context = {
            animateSrc: animate,
            stillSrc: still,
            ratingString: "Rating: " + rate
        };
        var html = template(context);
        var card = $(html);
        $("#gifCards").append(card);
    }
    function createModal(rating, animateSrc, fullSrc){
        //use handlebars as templating engine
        var source = $("#modal-template").html();
        var template = Handlebars.compile(source);
        var context = {
            animatedGIF: animateSrc,
            originalGIF: fullSrc,
            ratingString: "Rating: " + rating
        };
        var html = template(context);
        var modal = $(html);
        $("#modals").append(modal);
    }
    $(document).on("click", ".gifButton", function(){
        var queryValue = $(this).text();
        //check if button is not disabled
        //disabled is a bootstrap class so it will still trigger click event
        if(!$(this).hasClass("disabled")){
            //remove the current disabled button if any
            $(".gifButton.disabled").removeClass("disabled");
            //add the disabled class to the clicked button
            //prevents button spamming
            $(this).addClass("disabled");
            //empty the div containing the gifs
            $("#gifCards").empty();
            $("#modals").empty();
            //set up query url with existing template defined above
            var queryUrl = apiUrl + "&q=" + queryValue;
            $.ajax({
                method: "GET",
                url: queryUrl
            }).done(function(response){
                response.data.forEach(function(element){
                    //check if the image is a gif
                    if(element.type == "gif"){
                        //get rating
                        var rating = element.rating;
                        //get still image fixed width for card
                        var stillUrl = element.images.fixed_width_still.url;
                        //get animated image fixed width for card
                        var animatedUrl = element.images.fixed_width.url;
                        //get the orginal animated image
                        var fullUrl = element.images.original.url;
                        createGifCard(rating, stillUrl, animatedUrl);
                        createModal(rating, animatedUrl, fullUrl);
                    }
                });
            });
        }   
    });
    //used to check if two modals are shown at once
    var currentAnimatedUrl = "";
    $(document).on("mouseenter", ".gifCard", function(){
        //change image source to animated gif 
        var img = $(this).children("img");
        var animatedUrl = img.attr("data-animate");
        img.attr("src", animatedUrl);
        var modalImg = $("[data-src = '"+animatedUrl+"'] img");
        modalImg.attr("src", modalImg.attr("data-original"));
    });
    $(document).on("mouseleave", ".gifCard", function(){
        //change image source to still gif
        var img = $(this).children("img");
        var stillUrl = img.attr("data-still");
        img.attr("src", stillUrl);
    });
    $(document).on("click", ".gifCard", function(){
        //show the modal after a click on the card
        var animatedUrl = $(this).children("img").attr("data-animate");
        currentAnimatedUrl = animatedUrl;
        //set slight delay for load
        setTimeout(function(){
            $("[data-src = '"+animatedUrl+"']").modal("show");
        }, 500);
        //remove all other modal
        setTimeout(function removePreviousModal(){
            $(".modal").each(function(){
                if($(this).attr("data-src")!= currentAnimatedUrl){
                    $(this).modal("hide");
                }
            });
        }, 1000);
        
    });
    $(document).on("mouseenter", ".modal-content", function(){
        $(this).children(".modal-footer").slideToggle("fast", function(){
        });
        $(this).children(".modal-header").slideToggle("fast", function(){
        });
    });
    $(document).on("mouseleave", ".modal-content", function(){
        $(this).children(".modal-footer").slideToggle("fast", function(){
        });
        $(this).children(".modal-header").slideToggle("fast", function(){
        });
    });
});

