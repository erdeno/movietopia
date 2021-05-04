document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#home').addEventListener('click', () => load_home(1));
    document.querySelector("#add-movie").addEventListener('click', () => add_new_movie());
    document.querySelector("#send-dm").addEventListener('click', () => send_direct_message());
    const l = document.querySelector("#profile").text;
    document.querySelector("#profile").addEventListener('click', () => load_profile(l));

  load_home(1);
});


// This function put active class on the clicked nav item in profile.
const make_active_navbar = (itemId, navClass) => {
  const navLinks = document.querySelectorAll(`.${navClass}`);
  navLinks.forEach((item) => {
    item.classList.remove('active');
  });
  document.querySelector(`#${itemId}`).classList.add('active');
};


let num = 1;
let totalPageNum = 1;
function changePage(add=true) {
  if (add)  {
    num ++;
  } else {
    num --;
  }
  load_home(num);
};



async function getAllMovies(pageNum) {
      let response = await fetch(`/all_movies/${pageNum}`); // resolves with response headers
      let result = await response.json();
      return result;
};

async function load_home(pageNum) {
  num = pageNum
  document.title = "Movietopia";

  make_active_navbar('home', 'nav-link')
  // window.scrollTo({ top: 0, behavior: 'smooth' });
  document.querySelector('#new-movie').style.display= 'none';
  document.querySelector('#profile-view').style.display= 'none';
  document.querySelector('#imdb-query-view').style.display = 'none';
  document.querySelector('#create-dm-view').style.display = 'none';
  document.querySelector('#movie-detail-view').style.display = 'none';

  document.querySelector("#current-page").innerHTML = pageNum;

  document.querySelector('#alert').innerHTML = '';
  document.querySelector('#search-form').style.display = 'block';
  document.querySelector('#pagination').style.display = 'block';
  document.querySelector('#home-view').style.display = 'block';
  document.querySelector('#movie-row').innerHTML = '';

  const result = await getAllMovies(pageNum);
  totalPageNum = result[0];
  const movies = result.slice(1);

  const prev_page = document.querySelector('#previous-page');
  const next_page = document.querySelector('#next-page');
  if (num > 1) {
    prev_page.classList.remove('disabled');
  } else {
    prev_page.classList.add('disabled');
  }

  if (pageNum >= totalPageNum) {
    next_page.classList.add('disabled');
  } else {
    next_page.classList.remove('disabled');
  }

  movies.forEach((item, i) => {
    const movieCard = document.createElement('div');
    movieCard.classList.add("col-md-4");
    movieCard.innerHTML = `<div class="card mb-4 shadow-sm">
      <img src=${window.location.origin}/static/movietopia/img/posters/${item.imdbId}_low.jpg id="movie-img" style="object-fit: cover;"
      class="bd-placeholder-img card-img-top" width="100%" height="400rem"
      role="img" aria-label="Placeholder: Thumbnail"></img>
      <div class="card-body">
        <a href="#detail" onclick="movieDetail('${item.imdbId}')"><h4 class="text-truncate">${item.title} (${item.year})</h4></a>
        <p class="card-text">${item.plot !==null?item.plot.slice(0, 100):""}...</p>
        <div class="d-flex justify-content-between align-items-center">
          <h2><span class="badge badge-info">${item.rating}</span></h2>
        </div>
      </div>
    </div>`;
    document.querySelector("#movie-row").append(movieCard);



    document.querySelector("#search-form").onsubmit = () => {
      const search_query = document.querySelector("#search-input").value;
      if ( search_query.length > 0 && search_query.trim()) {
        query_results(search_query);
      }
      return false;
    }


  });
};


async function query_results(search_query) {
  document.querySelector('#home-view').style.display = 'none';
  document.querySelector('#new-movie').style.display= 'none';
  document.querySelector('#profile-view').style.display = 'none';
  document.querySelector('#movie-detail-view').style.display = 'none';
  document.querySelector('#create-dm-view').style.display = 'none';
  document.querySelector('#pagination').style.display = 'none';


  document.querySelector('#imdb-query-view').style.display = 'block';
  document.querySelector('#imdb-query-row').innerHTML = '';
  document.querySelector("#search-input").value = '';
  document.querySelector('#alert').innerHTML = '';

  fetch(`/search_movies`, {
    method: 'POST',
    body: JSON.stringify({keyword: search_query})
  })
  .then(response => response.json())
  .then(result => {
    result.forEach((item, i) => {
      const movieCard = document.createElement('div');
      movieCard.classList.add("col-md-4");
      movieCard.innerHTML = `<div class="card mb-4 shadow-sm">

      <img src=${window.location.origin}/static/movietopia/img/posters/${item.imdbId}_low.jpg id="movie-img" style="object-fit: cover;"
      class="bd-placeholder-img card-img-top" width="100%" height="400rem"
      role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice"
      focusable="false"></img>

      <div class="card-body">
      <a href="#detail" onclick="movieDetail('${item.imdbId}')"><h4 class="text-truncate">${item.title} (${item.year})</h4></a>
      <p class="card-text">${item.plot !==null?item.plot.slice(0, 100):""}...</p>
      <div class="d-flex justify-content-between align-items-center">
      <h2><span class="badge badge-info">${item.rating}</span></h2>
      </div>
      </div>
      </div>`;
      document.querySelector("#imdb-query-row").append(movieCard);

    })

  })
};


async function getMovie(imdb_id) {
      let response = await fetch(`/movie/${imdb_id}`); // resolves with response headers
      let result = await response.json();
      return result;
};


async function movieDetail(imdb_id) {
  window.scrollTo({ top: 0});
  document.querySelector('#home-view').style.display = 'none';
  document.querySelector('#new-movie').style.display= 'none';
  document.querySelector('#profile-view').style.display = 'none';
  document.querySelector('#imdb-query-view').style.display = 'none';
  document.querySelector('#create-dm-view').style.display = 'none';
  document.querySelector('#search-form').style.display = 'none';
  document.querySelector('#pagination').style.display = 'none';


  document.querySelector('#alert').innerHTML = '';

  document.querySelector('#movie-detail-view').style.display = 'block';
  const result = await getMovie(imdb_id);
  document.title = result.title;
  document.querySelector('#movie-detail-title').innerHTML = `${result.title}`;
  document.querySelector('#movie-detail-plot').innerHTML = `${result.plot}`;
  document.querySelector('#movie-detail-rating').innerHTML = `<b>Rating:</b> ${result.rating}`;
  document.querySelector('#movie-detail-year').innerHTML = `<b>Year:</b> ${result.year}`;
  document.querySelector('#movie-detail-director').innerHTML = `<b>Director:</b> ${result.directors.join(', ')}`;
  document.querySelector('#movie-detail-writer').innerHTML = `<b>Writer:</b> ${result.writers.join(', ')}`;
  document.querySelector('#movie-detail-genre').innerHTML = `<b>Genre:</b> ${result.genres.join(', ')}`;
  document.querySelector('#movie-detail-img').src = window.location.origin+"/static/movietopia/img/posters/"+imdb_id+"_low.jpg";
  document.querySelector('#buttons-row').innerHTML = `
      <span>Add to:</span>
          <div class="btn-group">
            <button id="Watch" onclick="addToList('Watch', '${imdb_id}')" class="btn btn-xs btn-outline-primary mr-1 mb-0">Watchlist</button>
            <button id="Watched" onclick="addToList('Watched', '${imdb_id}')" class="btn btn-xs btn-outline-success mr-1 mb-0">Watchedlist</button>
            <button id="Favorite" onclick="addToList('Favorite', '${imdb_id}')" class="btn btn-xs btn-outline-warning mr-1 mb-0">Favorite</button>
          </div>
        <br>`;
  document.querySelector("#make-comment-button").innerHTML = `
  <button id="comment" onclick="makeComment('${imdb_id}')" class="btn btn-xs btn-warning mr-3 my-4">
      <i class="fa fa-plus-circle" aria-hidden="true"></i>
      Make Comment
  </button>`;
  if (result.inWatchList) {
    document.querySelector("#Watch").innerHTML='<i class="fa fa-check-circle"></i> Watch';
    document.querySelector("#Watch").classList.add('active')
  }
  if (result.inWatchedList) {
    document.querySelector("#Watched").innerHTML='<i class="fa fa-check-circle"></i> Watched';
    document.querySelector("#Watched").classList.add('active')
  }
  if (result.inFavorites) {
    document.querySelector("#Favorite").innerHTML='<i class="fa fa-check-circle"></i> Favorite';
    document.querySelector("#Favorite").classList.add('active')
  }

  reload_comments(imdb_id);

  document.querySelector('#return-button').onclick = () => {
    load_home(num);
  };
};


function makeComment(imdb_id) {
  if (document.querySelector('#make-comment').style.display === 'block') {
    document.querySelector('#make-comment').style.display = 'none';
  } else {
    document.querySelector('#make-comment').style.display = 'block';
    document.querySelector('#make-comment').innerHTML = `<h3 id="comment-header">You can write comment here...</h3>
    <form id="comment-form">
      <div class="form-group">
        <input autofocus class="form-control" id="comment-title" type="text" placeholder="Title">
      </div>
      <div class="form-group">
        <textarea class="form-control" id="comment-content" rows="3"></textarea>
      </div>
      <input class="btn btn-danger" type="submit" id="comment-submit" value="Submit">
    </form>`;

    document.querySelector("#comment-title").value = '';
    document.querySelector("#comment-content").value = '';

    document.querySelector("#comment-form").onsubmit = () => {
      const title = document.querySelector("#comment-title").value;
      const content = document.querySelector("#comment-content").value;
      let obj_body = {}
      if (title.length > 0 && content.length > 0) {
        obj_body = {
          imdbId: imdb_id,
          title: title,
          content: content
        }
      }

      if (Object.keys(obj_body).length>0) {
        document.querySelector("#comment-header").innerHTML = `Submitting
            <div class="spinner-grow text-success" role="status">
                <span class="sr-only">Submitting...</span>
            </div>`;

        fetch(`/comments/${imdb_id}`, {
          method: 'POST',
          body: JSON.stringify(obj_body)
        })
        .then(response => response.json())
        .then(result => {
          document.querySelector("#comment-header").innerHTML = `You can write comment here...`;
          document.querySelector('#make-comment').style.display = 'none';
          reload_comments(imdb_id);
        });

      }
      return false;
    }
  }
}



async function reload_comments(imdb_id) {
  let response = await fetch(`/comments/${imdb_id}`);
  let results = await response.json();
  document.querySelector('#comment-row').innerHTML = '';

  results.forEach((item, i) => {
    const resCard = document.createElement('div');
    resCard.classList.add("col-sm-12");
    resCard.innerHTML = `<div class="card my-2">
          <div class="card-body">
            <blockquote class="blockquote mb-0">
              <h3>${item.title}</h3>
              <p>${item.comment_content}</p>
              <footer class="blockquote-footer">
                <a href="#" onclick="load_profile('${item.user}')">
                  ${item.user}
                </a> on <cite title="Source Title">${item.date}</cite>
              </footer>
            </blockquote>
          </div>
        </div>
        `;
    document.querySelector('#comment-row').append(resCard);
  });
};

function addToList(listName, id) {

  fetch(`/add_to_list`, {
    method: 'POST',
    body: JSON.stringify({list: listName.toLowerCase(), imdbId: id})
  })
  .then(response => response.json())
  .then(result => {
    if (!document.getElementById(listName).classList.contains('active')) {
      document.getElementById(listName).innerHTML=`<i class="fa fa-check-circle"></i> ${listName}`;
      document.getElementById(listName).classList.add('active')
    } else {
      document.getElementById(listName).innerHTML=`${listName}`;
      document.getElementById(listName).classList.remove('active')
    }
  })
};



function add_new_movie() {
  document.title = "Add a movie";

  make_active_navbar('add-movie', 'nav-link');

  document.querySelector('#home-view').style.display = 'none';
  document.querySelector('#profile-view').style.display = 'none';
  document.querySelector('#imdb-query-view').style.display = 'none';
  document.querySelector('#movie-detail-view').style.display = 'none';
  document.querySelector('#create-dm-view').style.display = 'none';
  document.querySelector('#pagination').style.display = 'none';



  document.querySelector('#alert').innerHTML = '';
  document.querySelector('#new-movie').style.display= "block";

  document.querySelector("#movie_imdb_id").value = '';
  document.querySelector("#movie_title").value = '';
  document.querySelector("#movie_year").value = '';
  document.querySelector("#movie-form").onsubmit = () => {
    const imdb_id = document.querySelector("#movie_imdb_id").value;
    const title = document.querySelector("#movie_title").value;
    const year = document.querySelector("#movie_year").value;
    let obj_body = {}
    if (imdb_id.length > 0) {
      obj_body = {
        imdbId: imdb_id
      }
    } else if (title.length > 0) {
      if (year.length > 0) {
        obj_body = {
          title: title,
          year: year
        }
      } else {
        obj_body = {
          title:title,
        }
      }
    }

    if (Object.keys(obj_body).length>0) {
      document.querySelector("#new-movie-header").innerHTML = `Add New Movie
          <div class="spinner-grow text-success" role="status">
              <span class="sr-only">Loading...</span>
          </div>`;
      fetch(`/search_movies_imdb`, {
        method: 'POST',
        body: JSON.stringify(obj_body)
      })
      .then(response => response.json())
      .then(result => {
        display_results(result);
        document.querySelector("#new-movie-header").innerHTML = `Add New Movie`;
      });
    }
  }
  return false;
};



async function add_to_database(imdb_id) {
  document.querySelector('#alert').innerHTML = `Adding... <div class="spinner-grow text-warning" role="status">
    <span class="sr-only">Adding...</span>
  </div>`;
  let response = await fetch('/add_to_database', {
  method: 'POST',
  body: JSON.stringify({
    imdbId: imdb_id
    })
  });

  let result = await response.json();
  load_home(1);
  document.querySelector('#alert').innerHTML = `<div class="alert alert-primary" role="alert">
  <p>${result.message}</p></div>`;
};


function display_results(results) {
  document.title = "Results";

  document.querySelector('#home-view').style.display = 'none';
  document.querySelector('#new-movie').style.display= 'none';
  document.querySelector('#profile-view').style.display = 'none';
  document.querySelector('#create-dm-view').style.display = 'none';
  document.querySelector('#movie-detail-view').style.display = 'none';


  document.querySelector('#imdb-query-view').style.display = 'block';
  document.querySelector('#imdb-query-row').innerHTML = '';
  document.querySelector('#alert').innerHTML = '';
  results.forEach((item, i) => {
    const resCard = document.createElement('div');
    resCard.classList.add("card", "w-75");
    resCard.innerHTML = `<div class="card-body">
            <p class="card-text">
            ${item.title} (${item.year}) IMDb Id: ${item.imdb_id}
            <a href="#" onclick="add_to_database('${item.imdb_id}')" id="add-button-${item.imdb_id}" class="btn btn-outline-success">Add</a>
            </p>
        </div>`;
    document.querySelector('#imdb-query-row').append(resCard);
    if (item.inDatabase) {
      const add_button = document.querySelector(`#add-button-${item.imdb_id}`);
      add_button.innerHTML = 'Already added!';
      add_button.disabled = true;
      add_button.classList.add("disabled");
    }
  });
};



async function follow(l_user, f_user) {
  let response = await fetch(`/users/${l_user}`, {
    method: 'PUT',
    body: JSON.stringify({
        follow: f_user
    })
  });

  load_profile(f_user);

};

async function unfollow(l_user, f_user) {
  let response = await fetch(`/users/${l_user}`, {
    method: 'PUT',
    body: JSON.stringify({
        unfollow: f_user
    })
  });
  load_profile(f_user);
};

async function sendMessage(sender, receiver, content) {
  let response = await fetch(`/users/${receiver}`, {
    method: 'PUT',
    body: JSON.stringify({
        sender: sender,
        message: content,
    })
  });
  document.querySelector('#alert').innerHTML = `<div class="alert alert-success" role="alert">
  <p>Message Sended.</p></div>`;
};

async function send_direct_message() {
  make_active_navbar('send-dm', 'nav-link');
  document.title = "Send Message";
  document.querySelector('#home-view').style.display = 'none';
  document.querySelector('#new-movie').style.display= 'none';
  document.querySelector('#imdb-query-view').style.display = 'none';
  document.querySelector('#movie-detail-view').style.display = 'none';
  document.querySelector('#search-form').style.display = 'none';
  document.querySelector('#pagination').style.display = 'none';
  document.querySelector('#profile-view').style.display = 'none';



  document.querySelector('#create-dm-view').style.display = 'block';
  document.querySelector('#alert').innerHTML = '';
  const logged_user_name = document.querySelector("#profile").text;

  const logged_user = await userDetails(logged_user_name);
  document.querySelector('#create-dm-view').innerHTML = `<h3 id="comment-header">You can send DM with this form...</h3>
  <form id="dm-form" class="w-50">
    <div class="form-group">
      <label for="receiver">Receiver</label>
      <select class="form-control" id="receiver-select"></select>
    </div>
    <div class="form-group">
      <textarea class="form-control" id="message-content" rows="3"></textarea>
    </div>
    <input class="btn btn-warning" type="submit" id="comment-submit" value="Send">
  </form>`;

  logged_user.followers.forEach((item, i) => {
    const user_option = document.createElement('option');
    user_option.innerHTML = item;
    document.querySelector("#receiver-select").append(user_option)
  });

  // document.querySelector("#receiver-select").value = "";
  document.querySelector("#message-content").value = "";

  document.querySelector("#dm-form").onsubmit = () => {
    const receiver = document.querySelector("#receiver-select").value;
    const content = document.querySelector("#message-content").value;

    sendMessage(logged_user.username, receiver, content)
    load_home(1)

    return false;
  };


};

// This function will fetch user details.
async function userDetails(username) {
      let response = await fetch(`/users/${username}`); // resolves with response headers
      let result = await response.json();
      return result;
};


async function load_profile(profile_name, display=1) {
  make_active_navbar('profile', 'nav-link');
  document.title = `Profile Details: ${profile_name}`;
  document.querySelector('#home-view').style.display = 'none';
  document.querySelector('#new-movie').style.display= 'none';
  document.querySelector('#imdb-query-view').style.display = 'none';
  document.querySelector('#movie-detail-view').style.display = 'none';
  document.querySelector('#search-form').style.display = 'none';
  document.querySelector('#create-dm-view').style.display = 'none';
  document.querySelector('#pagination').style.display = 'none';


  document.querySelector('#alert').innerHTML = '';
  document.querySelector('#profile-view').style.display = 'block';

  const logged_user_name = document.querySelector("#profile").text;

  const logged_user = await userDetails(logged_user_name);
  const page_user = await userDetails(profile_name);

  document.querySelector("#profile-nav-items").innerHTML = `
  <a id="profile-nav-watch" class="profile-nav list-group-item with-badge active" onclick="load_profile('${profile_name}', 1)" href="#">
    <i class="fa fa-clock-o"></i>Watchlist
    <span class="badge badge-primary badge-pill" id="watch-count"></span>
  </a>
  <a id="profile-nav-watched" class="profile-nav list-group-item with-badge" onclick="load_profile('${profile_name}', 2)" href="#">
    <i class="fa fa-eye"></i>Watchedlist
    <span class="badge badge-primary badge-pill" id="watched-count"></span>
  </a>
  <a id="profile-nav-favorite" class="profile-nav list-group-item with-badge" onclick="load_profile('${profile_name}', 3)" href="#">
    <i class="fa fa-heart"></i>Favorites
    <span class="badge badge-primary badge-pill" id="favorite-count"></span>
  </a>`;

  document.querySelector("#profile-img").src = page_user.profile_photo;
  document.querySelector("#user-name").innerHTML = page_user.username;
  document.querySelector("#profile-numbers").innerHTML = `Follower: ${page_user.followers.length} Follow: ${page_user.following.length}`;
  document.querySelector("#join-date").innerHTML = `Joined ${page_user.join_date}`;
  document.querySelector("#watch-count").innerHTML = page_user.watch_movies.length;
  document.querySelector("#watched-count").innerHTML = page_user.watched_movies.length;
  document.querySelector("#favorite-count").innerHTML = page_user.favorite_movies.length;

  // Follow Unfollow functionality
  if (page_user.username !== logged_user.username) {
    if (logged_user.following.includes(page_user.username)) {
      document.querySelector(".profile-userbuttons").innerHTML =
      `<button onclick=unfollow('${logged_user_name}','${page_user.username}')
      type="button" class="btn btn-danger btn-sm">Unfollow</button>`;
    } else {
      document.querySelector(".profile-userbuttons").innerHTML =
      `<button onclick=follow('${logged_user_name}','${page_user.username}')
      type="button" class="btn btn-success btn-sm">Follow</button>`;
    }
  } else {
      document.querySelector(".profile-userbuttons").innerHTML = "";
      const r_dm = document.createElement('div');
      r_dm.innerHTML=`
      <a id="profile-nav-r-dm" class="profile-nav list-group-item" onclick="load_profile('${profile_name}', 4)" href="#">
        <i class="fa fa-envelope"></i>View Received DM's
      </a>`;
      document.querySelector("#profile-nav-items").append(r_dm);
      const s_dm = document.createElement('div');
      s_dm.innerHTML = `
      <a id="profile-nav-s-dm" class="profile-nav list-group-item" onclick="load_profile('${profile_name}', 5)" href="#">
        <i class="fa fa-envelope"></i>View Sended DM's
      </a>`;
      document.querySelector("#profile-nav-items").append(s_dm);


  }



  if (display === 1) {
      var items = page_user.watch_movies;
      document.querySelector('#profile-heading').innerHTML = "Watchlist";
      make_active_navbar("profile-nav-watch", 'profile-nav');
    } else if (display === 2) {
      var items = page_user.watched_movies;
      document.querySelector('#profile-heading').innerHTML = "Watched Movies";
      make_active_navbar("profile-nav-watched", 'profile-nav');
    } else if (display === 3) {
      var items = page_user.favorite_movies;
      document.querySelector('#profile-heading').innerHTML = "Favorite Movies";
      make_active_navbar("profile-nav-favorite", 'profile-nav');
    } else if (display === 4) {
      var direct_messages = page_user.received_messages;
      document.querySelector('#profile-heading').innerHTML = "Received Direct Messages";
      make_active_navbar("profile-nav-r-dm", 'profile-nav');
      document.querySelector('#movies-list-body').innerHTML = "";
      direct_messages.forEach((item, i) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>
            <div class="product-item">
                <div class="product-info">
                    <h4 class="product-title"><a href="#" onclick="load_profile('${item.sender}')">From ${item.sender},</a></h4>
                    <div class="text-lg text-medium text-muted">${item.message_content}</div>
                    <div>Date:
                        <div class="d-inline text-success">${item.date}</div>
                    </div>
                </div>
            </div>
        </td>`;
        document.querySelector('#movies-list-body').append(row);
    })
  } else if (display === 5) {
    var direct_messages = page_user.sended_messages;
    document.querySelector('#profile-heading').innerHTML = "Sended Direct Messages";
    make_active_navbar("profile-nav-s-dm", 'profile-nav');
    document.querySelector('#movies-list-body').innerHTML = "";
    direct_messages.forEach((item, i) => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>
          <div class="product-item">
              <div class="product-info">
                  <h4 class="product-title"><a href="#" onclick="load_profile('${item.receiver}')">To ${item.receiver},</a></h4>
                  <div class="text-lg text-medium text-muted">${item.message_content}</div>
                  <div>Date:
                      <div class="d-inline text-success">${item.date}</div>
                  </div>
              </div>
          </div>
      </td>`;
      document.querySelector('#movies-list-body').append(row);
    });
  }



  if (items) {
    document.querySelector('#movies-list-body').innerHTML = "";
    items.forEach((item, i) => {

      const movie = document.createElement('tr');
      movie.innerHTML = `
      <td>
        <div class="product-item">
          <a class="product-thumb" href="#" onclick="movieDetail('${item.imdbId}')"><img src=${window.location.origin}/static/movietopia/img/posters/${item.imdbId}_low.jpg alt="Product"></a>
          <div class="product-info">
            <h4 class="product-title"><a href="#" onclick="movieDetail('${item.imdbId}')">${item.title}</a> (${item.year})</h4>
            <div class="text-lg text-medium text-muted">${item.plot !==null ? item.plot.slice(0, 100):""}...</div>
            <div>Directed by:
              <div class="d-inline text-success">${item.directors}</div>
            </div>
          </div>
        </div>
      </td>`;
      document.querySelector('#movies-list-body').append(movie);
    });

    if (items.length === 0) {
      document.querySelector('#movies-list-body').innerHTML = "<h2>There is no movies in this list yet.</h2>";

    }
  }


};
