const apiKey = "ecfee61f";
const baseUrl = "http://www.omdbapi.com/?apikey=" + apiKey;

let history = [];

function init() {
    getHistoryFromStorageToUI();
    $(".btn-search").click(function () {
        let filmName = $.trim($(".form-control").val());
        if (filmName.length >= 3) {
            getFilms(filmName);
            addSearchedFilmsToStorage(filmName);
            
        }
        else {
            showAlert();
        }
    })
};

function getFilms(filmName) {
    $(function () {

        $.ajax({
            type: 'GET',
            url: `${baseUrl}&s=${filmName}`,
            success: function (response) {
                let filmDetails = response.Search;
                showFilms(filmDetails);
            }
        })
    })
}



function showAlert() {
    let alert = `
    
    <div class="alert alert-danger">Lütfen minimum 3 karakter girişi yapınız.</div>    
    `
    $(".form-container").append(alert);

    setTimeout(function () {

        $(".form-container").find(".alert.alert-danger").remove()

    }, 2500);

}

function getHistoryFromStorageToUI() {

    let localSearched = localStorage.getItem("history");

    if (localSearched != null) {
        history = localSearched.split(",");
    }

    let inputSearched = "";

    $.each(history, function (i, searchedText) {


        inputSearched += `
        <div class="mb-4 mr-3 d-flex align-items-center" >
        <button class="btn btn-dark" style="height:40px" onclick="getFilms('${searchedText}')">${searchedText}</button>
         <i class="fas fa-trash-alt btn btn-dark ml-1"style="height:40px"  onclick="deleteContainer('${searchedText}')"></i>
        </div>
         `
    });

    $(".history-container").html(inputSearched);

};

function deleteContainer(searchedText) {

    $(event.target).parent().remove();


    $.each(history, function (i, arrayItem) {
        if (arrayItem === searchedText) {


            history.splice(i, 1);
            localStorage.setItem("history", history);

        }
        if (history.length === 0) {
            localStorage.removeItem("history");

        }
    })
}

function addSearchedFilmsToStorage(filmName) {

    history.unshift(filmName); 
    if (history.length > 10) {
        history.pop();          
    }
   
    localStorage.setItem("history", history);

    getHistoryFromStorageToUI();

}

function showFilms(filmDetails) {

    let result = "";

    $.each(filmDetails, function (i, film) {

        result += `
        <div class="card first-card">
            <div class="card-header"> ${film.Title} </div>            
            <div class="card-footer d-flex justify-content-between">
                <p >${film.Year} </p>
                <a style="color: black;" class="a" > <i class="fas fa-heart"></i> </a>
            </div>
        </div>
        `;
    })

    $(".film-container").html(result);
}


$(function () {
    $(".film-container").click(function (e) {

        if ($(e.target).parent().hasClass("a") && !$(e.target).parent().hasClass("heart")) {


            $(e.target).parent().toggleClass("heart");

            let divTitle = $.trim($(e.target).parent().parent().prev().text());

            let divYear = $(e.target).parent().parent().text()


            let favFilm = "";

            favFilm += ` 
                
                    <div class="card">
                        <div class="card-header ">${divTitle}</div>                       
                        <div class="card-footer d-flex justify-content-between">
                            <p>${divYear} </p>
                            <a class="removeFav"> 
                            <i class="fas fa-heart" style="color:red" ></i></a>                            
                    </div>
                    </div>
        
                    ` ;

            $(".fav-container").append(favFilm);



        }
        else if ($(e.target).parent().hasClass("a")) {

            $(e.target).parent().toggleClass("heart");

            var removeTitle = $.trim($(e.target).parent().parent().prev().text());

            console.log($(".fav-container").find(".card-header"));


            $(".fav-container").find(".card-header").each(function (i, el) {

                console.log($(el).text() === removeTitle);

                if ($(el).text() == removeTitle) {

                    $(el).parent().remove();
                }

            });

        }

    });
});

$(function removeFavFromEachContainer() {

    $(".fav-container").click(function (e) {

        if ($(e.target).parent().hasClass("removeFav")) {

            $(e.target).parent().parent().parent().remove();

            let forToggle = $.trim($(e.target).parent().parent().prev().text());

            $(".film-container").find(".card-header").each(function (i, element) {


                if ($.trim($(element).text()) === forToggle) {

                    $(element).parent().find("a").removeClass("heart");

                }

            });


        }
    })
});

     