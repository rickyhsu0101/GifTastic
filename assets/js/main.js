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
        var card = $("<div>");
        card.addClass("card gifCard");

        var cardImage = $("<img>");
        cardImage.addClass("card-img-top");
        cardImage.attr("src", still);
        cardImage.attr("data-still", still);
        cardImage.attr("data-animate", animate);

        var cardFooter = $("<div>");
        cardFooter.addClass("card-footer");
        cardFooter.text("Rating: " + rate);

        card.append(cardImage);
        card.append(cardFooter);

        $("#gifCards").append(card);
    }
    function createModal(rating, animateSrc, fullSrc){
        //create surround modal block
        var modal = $("<div>");
        modal.addClass("modal fade");
        modal.attr("data-src", animateSrc);
        modal.attr("tabindex", "-1");
        //set the modal to dialog
        var modalDialog = $("<div>");
        modalDialog.addClass("modal-dialog modal-dialog-centered modal-lg");
        //set modal content block
        var modalContent = $("<div>");
        modalContent.addClass("modal-content");
        //set modal header
        var modalHeader = $("<div>");
        modalHeader.addClass("modal-header");
        //initialize the close icon as a button that dismisses the modal
        var closeButton = $("<button type='button' class='close' data-dismiss='modal'></button>");
        var closeIcon = $("<span>&times;</span>");
        closeButton.append(closeIcon);
        //append the button to the header
        modalHeader.append(closeButton);
        //set modal body
        var modalBody = $("<div>");
        modalBody.addClass("modal-body");
        modalBody.append("<img src = '' data-original = '"+fullSrc+"'>");
        //set modal footer
        var modalFooter = $("<div>");
        modalFooter.addClass("modal-footer");
        modalFooter.append("<h2>Rating: "+rating+"</h2>");
        //append header, body, and footer to content
        modalContent.append(modalHeader, modalBody, modalFooter);
        //append content to dialog
        modalDialog.append(modalContent);
        //append dialog to modal block
        modal.append(modalDialog);
        //add the created modal to the modals block
        $("#modals").append(modal);
    }
    $(document).on("click", ".gifButton", function(){
        var queryValue = $(this).text();
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
                    var rating = element.rating;
                    var stillUrl = element.images.fixed_width_still.url;
                    var animatedUrl = element.images.fixed_width.url;
                    var fullUrl = element.images.original.url;
                    createGifCard(rating, stillUrl, animatedUrl);
                    createModal(rating, animatedUrl, fullUrl);
                }
            });
        });
    });
    $(document).on("mouseenter", ".gifCard", function(){
        var img = $(this).children("img");
        var animatedUrl = img.attr("data-animate");
        img.attr("src", animatedUrl);
        var modalImg = $("[data-src = '"+animatedUrl+"'] img");
        modalImg.attr("src", modalImg.attr("data-original"));
    });
    $(document).on("mouseleave", ".gifCard", function(){
        var img = $(this).children("img");
        var stillUrl = img.attr("data-still");
        img.attr("src", stillUrl);
    });
    $(document).on("click", ".gifCard", function(){
        var animatedUrl = $(this).children("img").attr("data-animate");
        setTimeout(function(){
            $("[data-src = '"+animatedUrl+"']").modal("show");
        }, 700);
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

