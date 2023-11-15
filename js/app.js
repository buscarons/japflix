// Resources
const URL_movies= "https://japceibal.github.io/japflix_api/movies-data.json";

// Elements
const inputBuscar = document.getElementById("inputBuscar");
const btnBuscar = document.getElementById("btnBuscar");
const lista = document.getElementById("lista");

let movies;

function filterArrQuery(arr, query) {
    // Auxiliary function
    function isQueryInArr(array, qry) {
        for (const elem of array) {
            if (elem.name.toUpperCase().includes(qry.toUpperCase())) return true
        }
        return false
    }

    return arr.filter((movie) => {
        let queryUC = query.toUpperCase();

        return movie.title.toUpperCase().includes(queryUC) ||
               movie.tagline.toUpperCase().includes(queryUC) ||
               movie.overview.toUpperCase().includes(queryUC) ||
               isQueryInArr(movie.genres, queryUC);
    })
};

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch(URL_movies);
        const data = await response.json();
        movies = data;
    } catch (err) {
        console.log("Hubo el siguiente error: ", err);
    }
})

btnBuscar.addEventListener("click", () => {
    if (inputBuscar.value) {
        const filteredMovies = filterArrQuery(movies, inputBuscar.value);

        lista.innerHTML = "";

        filteredMovies.forEach(movie => {
           const item = document.createElement("li");

           item.addEventListener("click", () => {
            // Obtener la información del elemento al que se hizo clic
            const clickedMovie = filteredMovies.find(m => m.title === movie.title);

            // Crear un nuevo Offcanvas con el contenido del elemento
            const offcanvasElementList = document.querySelectorAll('.offcanvas');
            const offcanvasList = [...offcanvasElementList].map(offcanvasEl => new bootstrap.Offcanvas(offcanvasEl));
            
            // Acceder al contenido del Offcanvas y actualizarlo con la información del elemento
            const offcanvasTitle = offcanvasElementList[0].querySelector('.offcanvas-title');
            offcanvasTitle.innerHTML = `
                ${clickedMovie.title}
            `;
            const offcanvasOverview = offcanvasElementList[0].querySelector('.offcanvas-body');
            offcanvasOverview.innerHTML = `<p>${clickedMovie.overview}</p><hr>`;

            let movieGenres = clickedMovie.genres[0].name;

            for(let i = 1; i < clickedMovie.genres.length; i++) {
                movieGenres += " - " + clickedMovie.genres[i].name;
            }

            const aux = document.createElement("p");
            aux.classList.add("text-muted");
            aux.textContent = movieGenres;

            offcanvasOverview.appendChild(aux);

            offcanvasOverview.innerHTML += `<div class="dropdown">
            <button type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown">
                More
            </button>
                <ul class="dropdown-menu">
                    <li class="p-2">Year: ${clickedMovie.release_date.slice(0, 4)}</li>
                    <li class="p-2">Runtime: ${clickedMovie.runtime} min</li>
                    <li class="p-2">Budget: $${clickedMovie.budget}</li>
                    <li class="p-2">Revenue: $${clickedMovie.revenue}</li>
                </ul>
            </div>`;

            offcanvasList[0].show();
           });

           item.classList.add("rounded");

           const firstContainer = document.createElement("div");

           const title = document.createElement("p");
           title.classList.add("text-white");
           title.classList.add("fw-bold");
           title.textContent = `${movie.title}`;

           const tagline = document.createElement("p");
           tagline.classList.add("text-secondary");
           tagline.classList.add("fst-italic");
           tagline.textContent = `${movie.tagline}`;

           firstContainer.appendChild(title);
           firstContainer.appendChild(tagline);

           item.appendChild(firstContainer);

           const secondContainer = document.createElement("div");

           secondContainer.innerHTML = `<span class="fa fa-star"></span>
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>
           `
           const stars = secondContainer.querySelectorAll(".fa");

           for(let i = 0; i <= Math.round(movie.vote_average / 2) - 1; i++) {
            stars[i].classList.add("checked");
           }

           item.appendChild(secondContainer);

           lista.appendChild(item);
        });
    } else {
        lista.innerHTML = "";
    }
})