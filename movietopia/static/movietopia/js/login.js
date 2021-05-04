window.onload = function() {
  const body = document.querySelector('body');
  let x_pos = 0;
  let y_pos = '50px';
  document.body.background = "../img/login_background2.jpg"
  setInterval(function(){
    body.style.backgroundPosition = `${x_pos}px ${y_pos}`;
    x_pos--;
  }, 120);

}
