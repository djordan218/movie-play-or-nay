$('#decide').click(movieDecision);

function movieDecision() {
  const currentTime = $('#currentTime').data('time');
  const userBedtime = $('#userBedtime').data('bedtime');
  const userImdb = $('#userImdb').data('imdb');
  const userRt = $('#userRt').data('rt');
  const imdbRating = $('#imdbRating').data('imdb');
  const rtRating = $('#rtRating').data('rt');
  const runtime = $('#runtime').data('runtime');

  const splitImdbRating = imdbRating.split('/')[0];
  const splitRtRating = rtRating.split('%')[0];
  const slicedRuntime = runtime.split(' min')[0];

  const data = {
    startTime: currentTime,
    duration: slicedRuntime,
  };

  const endTime = moment(data.startTime, 'HHmm')
    .add(data.duration, 'minutes')
    .format('HH:mm A');

  if (splitImdbRating >= userImdb) {
    $('#userImdb').append(
      `<div class="alert alert-success alert-dismissible fade show" role="alert">This movie got a <b>${splitImdbRating}/10 stars</b> on IMDB. Get the popcorn!
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
    );
  } else if (imdbRating == 'NA') {
    $('#userImdb').append(
      `<div class="alert alert-warning alert-dismissible fade show" role="alert">Ain't no IMDB rating. Feelin' froggy? May have to take a leap of faith.
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
    );
  } else {
    $('#userImdb').append(
      `<div class="alert alert-danger alert-dismissible fade show" role="alert">This movie got a <b>${splitImdbRating}/10 stars</b> on IMDB. I think you're better than this movie.<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
    );
  }

  if (splitRtRating >= userRt) {
    $('#userRt').append(
      `<div class="alert alert-success alert-dismissible fade show" role="alert">This movie got a <b>${splitRtRating}%</b> on Rotten Tomatoes. Go for it!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
    );
  } else if (rtRating == 'NA') {
    $('#userRt').append(
      `<div class="alert alert-warning alert-dismissible fade show" role="alert">There is no Rotten Tomato rating for this movie... Feeling risky?<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
    );
  } else {
    $('#userRt').append(
      `<div class="alert alert-danger alert-dismissible fade show" role="alert">This movie got a <b>${splitRtRating}%</b> on Rotten Tomatoes. Not quite up to snuff for you.<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
    );
  }

  parsedEndtime = moment(endTime, 'HH:mm A');
  parsedBedtime = moment(userBedtime, 'HH:mm A');

  if (parsedEndtime.isBefore(parsedBedtime)) {
    const endTime = moment(parsedEndtime, 'HHmm').format('hh:mm A');
    $('#userBedtime').append(
      `<div class="alert alert-success alert-dismissible fade show" role="alert">This movie will end at <b>${endTime}</b> for you to get a good night's rest! Get some comfy pants on!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
    );
  } else {
    $('#userBedtime').append(
      `<div class="alert alert-danger alert-dismissible fade show" role="alert">This movie will end at <b>${endTime}</b>. You're gonna be sleepy tomorrow...<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
    );
  }
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
