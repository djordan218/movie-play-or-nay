const noPosterImg = '/static/images/no-poster.jpg';

const currentTime = moment().format('hh:mm A');
$('#currentTime').append(`The current time is: ${currentTime}.`);
const userBedtime = $('#userBedtime').data('bedtime');
const userImdb = $('#userImdb').data('imdb');
const userRt = $('#userRt').data('rt');

// pulling data from API, error handling
async function get_movie(clicked_id) {
  $(`#${clicked_id}`).attr('disabled', 'disabled');
  const res = await axios.get(
    `http://www.omdbapi.com/?apikey=188d3aee&i=${clicked_id}`
  );
  let movie = res.data;
  let movieTitle = movie.Title;
  let movieRuntime = movie.Runtime;
  let id = movie.imdbID;

  let moviePoster = movie.Poster == 'N/A' ? noPosterImg : movie.Poster;

  let imdbRating = movie.Ratings[0] ? movie.Ratings[0]['Value'] : 'no ratings';
  let rtRating = movie.Ratings[1] ? movie.Ratings[1]['Value'] : 'no ratings';
  let metacriticRating = movie.Ratings[2]
    ? movie.Ratings[2]['Value']
    : 'no ratings';

  $('#moviePopulate').append(
    `<div class="card text-bg-secondary mb-3" style="width: 20rem; height: auto">
    <img src="${moviePoster}" class="card-img-top img-fluid" />
    <div class="card-body text-center">
      <h6 class="card-title text-center">
        <span class="card-movie-title">${movieTitle}</span>
        <p>${movieRuntime}</p>
        <p>IMDB: ${imdbRating} stars.</p>
        <p>Rotten Tomatoes: ${rtRating}</p>
        <p>Metacritic: ${metacriticRating}</p>
      </h6>
    </div>
    <div class="card-body card-body-btn">
      <button
        type="button"
        id="${id}"
        onclick="decide(this.id)"
        class="btn btn-success text-center movieBtn"
      >
        Decide for me.
      </button>
    </div>
  </div>`
  );
  window.scrollTo(0, 150);
}

async function decide(clicked_id) {
  const res = await axios.get(
    `http://www.omdbapi.com/?apikey=188d3aee&i=${clicked_id}`
  );
  let movie = res.data;
  let movieRuntime = movie.Runtime;
  let imdbRating = movie.Ratings[0] ? movie.Ratings[0]['Value'] : 'no ratings';
  let rtRating = movie.Ratings[1] ? movie.Ratings[1]['Value'] : 'no ratings';

  const splitImdbRating = imdbRating.split('/')[0];
  const splitRtRating = rtRating.split('%')[0];
  const slicedRuntime = movieRuntime.split(' min')[0];

  const data = {
    startTime: currentTime,
    duration: slicedRuntime,
  };

  const endTime = moment(data.startTime, 'HH:mm A')
    .add(data.duration, 'minutes')
    .format('hh:mm A');

  const userWake = moment(userBedtime, 'HH:mm A')
    .add(480, 'minutes')
    .format('HH:mm A');

  if (splitImdbRating >= userImdb) {
    $('#userImdb').append(
      `<div class="alert alert-success alert-dismissible fade show" role="alert">This movie got <b>${splitImdbRating}/10 stars</b> on IMDB. Get the popcorn!
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
    );
  } else if (imdbRating == 'no ratings') {
    $('#userImdb').append(
      `<div class="alert alert-warning alert-dismissible fade show" role="alert">Ain't no IMDB rating. Feelin' froggy? May have to take a leap of faith.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
    );
  } else {
    $('#userImdb').append(
      `<div class="alert alert-danger alert-dismissible fade show" role="alert">This movie got <b>${splitImdbRating}/10 stars</b> on IMDB. I think you're better than this movie.<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
    );
  }

  if (splitRtRating >= userRt) {
    $('#userRt').append(
      `<div class="alert alert-success alert-dismissible fade show" role="alert">This movie got <b>${splitRtRating}%</b> on Rotten Tomatoes. Go for it!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
    );
  } else if (rtRating == 'no ratings') {
    $('#userRt').append(
      `<div class="alert alert-warning alert-dismissible fade show" role="alert">There is no Rotten Tomato rating for this movie... Feeling risky?<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
    );
  } else {
    $('#userRt').append(
      `<div class="alert alert-danger alert-dismissible fade show" role="alert">This movie got <b>${splitRtRating}%</b> on Rotten Tomatoes. Not quite up to snuff for you.<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
    );
  }

  parsedEndtime = moment(endTime, 'hh:mm A');
  parsedBedtime = moment(userBedtime, 'HH:mm A');
  parsedWake = moment(userWake, 'HH:mm A');

  if (
    parsedEndtime.isBefore(parsedBedtime) &&
    parsedEndtime.isAfter(parsedWake)
  ) {
    const endTime = moment(parsedEndtime, 'HH:mm A').format('hh:mm A');
    $('#userBedtime').append(
      `<div class="alert alert-success alert-dismissible fade show" role="alert">This movie will end at <b>${endTime}</b>! You will have time for a good night's rest! Get your comfy pants on and press play!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
    );
  } else {
    $('#userBedtime').append(
      `<div class="alert alert-danger alert-dismissible fade show" role="alert">This movie will end at <b>${endTime}</b>. You're gonna be sleepy tomorrow...<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
    );
  }

  window.scrollTo(0, 250);
  $('.alert')
    .fadeTo(15000, 500)
    .slideUp(500, function () {
      $('.alert').slideUp(500);
      $(this).alert('close');
    });
}

// handling dark mode and saving to localStorage
const darkModeSwitch = document.querySelector('.dark-mode-toggle');
if (localStorage.getItem('darkModeEnabled')) {
  document.body.className = 'dark-mode';
  $('nav').removeClass('navbar bg-light fixed-top');
  $('nav').addClass('navbar navbar-dark bg-dark fixed-top');
  $('.offcanvas').addClass('text-bg-dark');
  darkModeSwitch.checked = true;
}

// dark mode switch and class changes
darkModeSwitch.addEventListener('click', function (e) {
  const { checked } = darkModeSwitch;
  if (checked) {
    localStorage.setItem('darkModeEnabled', true);
    $('nav').removeClass('navbar bg-light fixed-top');
    $('nav').addClass('navbar navbar-dark bg-dark fixed-top');
    $('.offcanvas').addClass('text-bg-dark');
  } else {
    localStorage.removeItem('darkModeEnabled');
    $('nav').removeClass('navbar navbar-dark bg-dark fixed-top');
    $('nav').addClass('navbar bg-light fixed-top');
    $('.offcanvas').removeClass('text-bg-dark');
  }
  document.body.className = checked ? 'dark-mode' : '';
});
