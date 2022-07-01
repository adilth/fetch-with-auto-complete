$(document).ready(function () {
  $("#title").autocomplete({
    source: async function (request, response) {
      let data = await fetch(
        `http://localhost:8000/search?query=${request.term}`
      )
        .then((results) => results.json())
        .then((results) => {
          console.log(results);
          return results.map((result) => {
            return {
              label: result.title,
              value: result.title,
              id: result._id,
            };
          });
        });
      response(data);
      // console.log(response);
    },
    minLength: 2,
    select: function (event, ui) {
      // $("#info").empty();
      $("#info").append(`<h3 id="crew">Casting crew<h3>`);
      console.log(ui.item.id);
      fetch(`http://localhost:8000/get/${ui.item.id}`)
        .then((result) => result.json())
        .then((result) => {
          $("#cast").empty();
          result.cast.forEach((cast) => {
            $("#cast").append(`<li>${cast}</li>`);
          });
          $("img").attr("src", result.poster);
          $("#crew").empty();
          $("#date").empty();
          $("#date").append(result.released);
          $("#cast").append(`<p class="genres">${result.genres}<p>`);
        });
    },
  });
});
