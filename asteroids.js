$('document').ready(function() {
  
  var ship, ship_x, ship_y, ship_left, ship_top, ship_xvec, ship_yvec, rads = 0;
  var shot_x, shot_y, shots, rocks;
  var level = 1, lives = 3, score = 0, ship_destroyed, motion, paused = false;
  var info_box = $('<div id="info_box"><div id="lives"></div><div id="score"></div><div id="level"</div></div>')
  info_box.click(function() { if (motion) toggle_pause() });
  var space = $('<div id = "space"></div>');
  var ship_box = $('<div id="ship_box"></div>')
  var ship = $('<div id="ship"><canvas id="ship_canvas"></canvas></div>');
  var space_width = $('body')[0].clientWidth;
  var space_height = $('body')[0].clientHeight + 10;
  space.css('height', space_height)
  $('body').append(info_box)
  $('body').append(space);
  
  space.append($('<div id="intro"><h1>ASTEROIDS!</h1><br>move mouse to rotate ship<br>left mouse button shoots<br>right mouse button accelerates towards pointer<br>click scoreboard to pause and resume<br><div id="start_button">start</div></div>'))
  
  $('#start_button').click(function() {start_level(level)} );
  
  function start_level(level) {
  	  ship_destroyed = false
  	  info_box.click(function() {return false});
  	  space.empty(); rocks = []; shots=[]; ship_xvec = 0; ship_yvec = 0;
  	  $('#lives').html('lives:&nbsp' + lives);
  	  $('#score').html('score:&nbsp' + score);
  	  $('#level').html('level:&nbsp' + level);
  	  space.append('<div id="level_big"><h1>Level&nbsp' + level + '</h1></div>');
  	  setTimeout(function(){
  	  		  space.empty();
  	  		  space.append(ship);
  	  		  make_ship();
  	  		  make_rocks(level);
  	  		  motion = setInterval(function(){game_motion()}, 50);
  	  		  
  	  }, 1500);
  };
 
  function make_ship() { 	  
  	  var canvas = $('#ship_canvas')[0].getContext('2d');
  	  canvas.lineWidth = 15;
  	  canvas.strokeStyle = 'lime';
  	  var w = $('#ship_canvas')[0].width, h = $('#ship_canvas')[0].height;
  	  canvas.moveTo(w / 2, 0);
  	  canvas.lineTo(w, h);
  	  canvas.lineTo(w / 2, h * 0.85);
  	  canvas.lineTo(0, h);
  	  canvas.lineTo(w / 2, 0);
  	  canvas.stroke();
  	  ship.css('left', (parseInt(space.css('width')) / 2) - (parseInt(ship.css('width')) / 2) + 'px');
  	  ship.css('top', (parseInt(space.css('height')) / 2) - (parseInt(ship.css('height')) / 2) + 'px');
  };
  
  function get_ship_coords(){
  	  ship_x = (parseInt(ship.css('left')) + (parseInt(ship.css('width')) / 2));
  	  ship_y = (parseInt(ship.css('top')) + (parseInt(ship.css('height')) / 2));
  	  ship_left = (parseInt(ship.css('left')));
  	  ship_top = (parseInt(ship.css('top')));
  };
  
  $('body').bind('mousemove', function(event) {
  		  event = event || window.event
  		  mouse_x = event.clientX, mouse_y = event.clientY;
  		  rads = Math.atan2(mouse_x - ship_x, mouse_y - ship_y);
  		  var degs = Math.round((rads * (180 / Math.PI) * -1) + 180);
  		  $('#ship_canvas').css('-webkit-transform', 'rotate(' + degs + 'deg)');
  		  $('#ship_canvas').css('-moz-transform', 'rotate(' + degs + 'deg)');
  		  $('#ship_canvas').css('-ms-transform', 'rotate(' + degs + 'deg)');
  		  $('#ship_canvas').css('-o-transform', 'rotate(' + degs + 'deg)');
  		  $('#ship_canvas').css('transform', 'rotate(' + degs + 'deg)');
  });
  
  space.bind('contextmenu', function(){return false});
  space.mousedown(function(){return false});
  
  space.bind('mousedown', function(event){
  		  switch(event.button){
  		  case 0:
  		  	  if (!paused) {shoot(ship_x, ship_y, mouse_x, mouse_y)};
  		  	  break;
  		  case 2:
  		  	  if (!paused) {accelerate(ship_x ,ship_y, mouse_x, mouse_y)};
  		  	  break;
  		  };
  });
  
  function shoot(ship_x, ship_y, mouse_x, mouse_y){
  	  var id = new Date().getTime()
  	  shot = $('<div  class="shot" id="shot' + id + '"></div>');
  	  shot_x = Math.round((20 * Math.sin(rads)) + ship_x);
  	  shot_y = Math.round((20 * Math.cos(rads)) + ship_y);
  	  shot.attr('x_vec', shot_x - ship_x);
  	  shot.attr('y_vec', shot_y - ship_y);
  	  shots.push(shot);
  	  space.append(shot);
  	  shot.css('left', shot_x);
  	  shot.css('top', shot_y);
  };
  
  function accelerate(ship_x, ship_y, mouse_x, mouse_y){
  	  if (mouse_x > ship_x) {ship_xvec += 1};
  	  if (mouse_x < ship_x) {ship_xvec -= 1};
  	  if (mouse_y > ship_y) {ship_yvec += 1};
  	  if (mouse_y < ship_y) {ship_yvec -= 1};
  };
  
  function make_rocks(level) {
  	  var size = 75
  	  for (var n = 1; n < level + 1; n ++) {
  	  	  var left, top;
  	  	  if (n % 5 == 0 || n == 1)  {left = 0; top = 0};
  	  	  if (n % 6 == 0 || n == 2)  {Math.round(left = space_width - size); top = Math.round(space_height - size)};
  	  	  if (n % 7 == 0 || n == 3)  {left = Math.round(space_width - size); top = 0};
  	  	  if (n % 8 == 0 || n == 4)  {left = 0; top = Math.round(space_height - size)};
  	  	  make_rock('large', left, top)
  	  };
  };
  
  function make_rock(size, left, top){
  	  var id = new Date().getTime(), line_width;
  	  var rock = $('<div class="rock" id="rock' + id + '"></div>');
  	  rock.attr('size', size);
  	  var rock_canvas = $('<canvas class="rock_canvas" id="rock_canvas' + id + '"></canvas>')
  	  rock.append(rock_canvas);
  	  space.append(rock);
  	  rocks.push(rock);
  	  
  	  switch(size){
  	  case('large'):
  	  	  size = 75; rock.attr('speed', 0.5); line_width = 4; break;
  	  case('medium'):
  	  	  size = 45; rock.attr('speed', 1); line_width = 7; break;
  	  case('small'):
  	  	  size = 20; rock.attr('speed', 1.5); line_width = 13; break;
  	  };
  	  
  	  var x_vec = 0, y_vec = 0;
  	  while (Math.abs(x_vec) < 1) {
  	  	  x_vec = Math.round((Math.random() * 4) - 2) * parseFloat(rock.attr('speed'));
  	  };
  	  while (Math.abs(y_vec) < 1) {
  	  	  y_vec = Math.round((Math.random() * 4) - 2) * parseFloat(rock.attr('speed'));
  	  };
  	  rock.attr('x_vec', x_vec);
  	  rock.attr('y_vec', y_vec);
  	  
  	  rock.css('left', left);
  	  rock.css('top', top);
  	  rock.css('width', size + 'px');
  	  rock.css('height', size + 'px');
  	  
  	  var canvas = $('#rock_canvas' + id)[0].getContext('2d');
  	  var w = $('#rock_canvas' + id)[0].width, h = $('#rock_canvas' + id)[0].height;
  	  canvas.lineWidth = line_width;
  	  canvas.strokeStyle = 'lime';

  	  var x1 = Math.round(Math.random() * (h * 0.2)), y1 = 0;
  	  var x2 = x1 + Math.round(Math.random() * (w * 0.6)), y2 = Math.round(Math.random() * (h * 0.2));
  	  var x3 = w - Math.round(Math.random() * (w * 0.2)), y3 = 0;
  	  var x4 = w, y4 = Math.round(Math.random() * (h * 0.2));
  	  var x5 = w - Math.round(Math.random() * (h * 0.2)), y5 = y4 + Math.round(Math.random() * (h * 0.6));//
  	  var x6 = w, y6 = h - Math.round(Math.random() * (h * 0.2));//
  	  var x7 = w - Math.round(Math.random() * (h * 0.2)), y7 = h;
  	  var x8 = x7 - Math.round(Math.random() * (w * 0.6)), y8 = h - Math.round(Math.random() * (h * 0.2));
  	  var x9 = Math.round(Math.random() * (w * 0.2)), y9 = h;
  	  var x10 = 0, y10= h - Math.round(Math.random() * (h * 0.2));
  	  var x11 = Math.round(Math.random() * (h * 0.2)), y11 = y10 - Math.round(Math.random() * (h * 0.6));
  	  var x12 = 0, y12 = Math.round(Math.random() * (h * 0.2));
  	  canvas.moveTo(x1, y1);
  	  canvas.lineTo(x2, y2); canvas.lineTo(x3, y3); canvas.lineTo(x4, y4);
  	  canvas.lineTo(x5, y5); canvas.lineTo(x6, y6); canvas.lineTo(x7, y7);
  	  canvas.lineTo(x8, y8); canvas.lineTo(x9, y9); canvas.lineTo(x10, y10);
  	  canvas.lineTo(x11, y11); canvas.lineTo(x12, y12); canvas.lineTo(x1, y1);
  	  canvas.stroke();
  };
  
  function range(first, last) {
  	  var arr = [first], n = first;
  	  while (n <= last) {n += 1; arr.push(n)};
  	  return arr;
  };
  
  Array.prototype.remove = function(element) {
  	  this.splice(this.indexOf(element), 1);
  };
  
  Array.prototype.contains = function(element) {
  	  for (i in this) {
  	  	  if (this[i] == element) return true;
  	  };
  	  return false;
  };
  
  function check_hits(rock) {
  	  var left = parseInt(rock[0].offsetLeft), right = left + parseInt(rock.css('width'));
  	  var top = parseInt(rock[0].offsetTop), bottom = top + parseInt(rock.css('height'))
  	  var area = [range(left, right), range(top, bottom)];
  	  $(shots).each(function(i, shot) {
  	  		  var shot_x = shot[0].offsetLeft, shot_y = shot[0].offsetTop;
  	  		  if ($.inArray(shot_x, area[0]) > -1 && $.inArray(shot_y, area[1]) > -1) {
  	  		  	  break_rock(rock, shot);
  	  		  };
  	  });
  	  
  	  if (area[0].contains(ship_x) && area[1].contains(ship_y)) {
  	  	  area[0] = []; area[1] = []; destroy_ship();
  	  }
  };
  
  function break_rock(rock, shot) {
  	  rocks.remove(rock); shots.remove(shot);
  	  rock.remove(); shot.remove();
  	  var left = parseInt(rock.css('left')), top = parseInt(rock.css('top'));
  	  var new_rocks = 0, new_size;
  	  
  	  switch(rock.attr('size')){
  	  case('large'):
  	  	  score += 50; new_rocks = 2; new_size = 'medium'; break;
  	  case('medium'):
  	  	  score += 100; new_rocks = 3; new_size = 'small'; break;
  	  case('small'):
  	  	  score += 250; break;
  	  }; 	  
  	  if (new_rocks > 0) {
  	  	  for(var n = 0; n < new_rocks; n++) {
  	  	  	  make_rock(new_size, left, top)
  	  	  };
  	  };
  	  
  	  $('#score').html('score:&nbsp' + score);
  	  if (rocks.length == 0) {
  	  	  clearInterval(motion); motion = null;
  	  	  next_level();
  	  }
  };
  
  Array.prototype.sample = function() {
  	  var i = Math.floor(Math.random() * (this.length));
  	  return this[i];
  };
  
  function next_level(){
  	  var salutations = ["Hey There", "Woah", "Nice One", "Well Done", "Awesome"];
  	  var names = ["Dude", "Buddy", "Pal", "Friend", "Amigo"];
  	  var actions = ["Rocked", "Destroyed", "Annihilated", "Kicked Butt On", "Creamed"];
  	  var congrats = $('<div id="congrats"></div>');
  	  salutation = salutations.sample();
  	  name = names.sample();
  	  action = actions.sample();
  	  congrats.append('<h2>' + salutation + '&nbsp' + name + ',<br>You&nbsp' + action + '&nbspLevel&nbsp' + level + '<br>On To...</h2>');
  	  setTimeout(function() {
  	  		  space.empty();
  	  		  space.append(congrats);
  	  }, 500);
  	  
  	  setTimeout(function() {
  	  		  level += 1; start_level(level);
  	  }, 3500);
  };
  
  function destroy_ship(){
  	  setTimeout(function(){clearInterval(motion); motion = null}, 1000)
  	  ship.remove();
  	  var explosion = $('<div id="explosion"><canvas id="explosion_canvas"></canvas></div>');
  	  space.append(explosion);
  	  var size = parseInt(explosion.css('width'));
  	  var left = ship_x - (size / 2), top = ship_y - (size / 2);
  	  explosion.css('left', left); explosion.css('top', top);
  	  var canvas = $('#explosion_canvas')[0].getContext('2d');
  	  canvas.lineWidth = 3;
  	  canvas.strokeStyle = 'lime';
  	  canvas.fillStyle = 'lime';
  	  for (n = 0; n < 25; n++) {
  	  	var x = Math.round(Math.random() * size), y = Math.round(Math.random() * size);
  	  	canvas.fillRect(x, y, 2, 2)
  	  }
  	  lives -= 1;
  	  setTimeout(function(){
  	  		if (lives == 0) {game_over()}
  	  		else {start_level(level)};
  	  }, 1000);
  	  ship_destroyed = true
  };

  
  function game_over(){
  	  $('#lives').html('lives:&nbsp' + lives);
  	  game_over_text = $('<div id="game_over"><h1>GAME OVER</h1>sorry buddy</div>');
  	  space.append(game_over_text);
  };
  
  /////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  function game_motion(){
  	  get_ship_coords();
  	  ship_left += ship_xvec; ship_top += ship_yvec;
  	  if (ship_x  > space_width) {ship.css('left', 0); get_ship_coords()};
  	  if (ship_y  > space_height) {ship.css('top', 0); get_ship_coords()};
  	  if (ship_x  < 0) {ship.css('left', space_width - 30); get_ship_coords()};
  	  if (ship_y  < 0) {ship.css('top', space_height - 30); get_ship_coords()};
  	  ship.css('left', ship_left);
  	  ship.css('top', ship_top);
  	  
  	  if (shots.length) {
  	  	  $(shots).each(function(i, shot) {
  	  	  		  var shot_left = parseInt(shot.css('left')), shot_top = parseInt(shot.css('top'));
  	  	  		  shot.css('left', shot_left + parseInt(shot.attr('x_vec')));
  	  	  		  shot.css('top', shot_top + parseInt(shot.attr('y_vec')));
  	  	  		  if (shot_left > space_width) {shots.splice(shots.indexOf(shot), 1)};
  	  	  		  if (shot_top > space_height) {shots.splice(shots.indexOf(shot), 1)};
  	  	  		  if (shot_left < 0) {shots.splice(shots.indexOf(shot), 1)};
  	  	  		  if (shot_top < 0) {shots.splice(shots.indexOf(shot), 1)};
  	  	  });
  	  }
  	  
  	  $(rocks).each(function(i, rock){
  	  		  var x_vec = parseFloat(rock.attr('x_vec')), y_vec = parseFloat(rock.attr('y_vec'));
  	  		  var left = parseFloat(rock[0].offsetLeft), top = parseFloat(rock[0].offsetTop);
  	  		  var width = parseInt(rock.css('width')), height = parseInt(rock.css('height'));
  	  		  
  	  		  if (left  > space_width) {rock.css('left', 0)}
  	  		  else if (left  < 0 - width) {rock.css('left', space_width - width)}
  	  		  else {rock.css('left', left + x_vec + 'px')};
  	  		  if (top  > space_height) {rock.css('top', 0)}
  	  		  else if (top  < 0 - height) {rock.css('top', space_height - height)}
  	  		  else {rock.css('top', top + y_vec + 'px')};
  	  		  
  	  		  if (!ship_destroyed) check_hits(rock);
  	  });
  };
  
  function toggle_pause() {
  	  if (paused) {
  	  	  $('#paused').remove();
  	  	  motion = setInterval(function(){game_motion()}, 50);
  	  	  paused = false;
  	  }
  	  else {
  	  	  clearInterval(motion); paused = true;
  	  	  space.append($('<div id="paused"><h2>...paused...</h2></div>'))
  	  };
  };
  
});