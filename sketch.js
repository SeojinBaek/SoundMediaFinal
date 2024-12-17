var song;
var button;
var amp;

function setup() {
  createCanvas(200, 200);
  song = loadSound('rose.mp3', loaded);
  amp = new p5.Amplitude();
  background(51);
}

function loaded() {
  button = createButton('play');
  button.mousePressed(togglePlaying);
}

function draw() {
  background(51);

  var vol = amp.getLevel();
  var diam = map(vol, 0, 0.3, 10, 200);

  fill(255, 0, 255);
  ellipse(width / 2, height / 2, diam, diam);
}

function togglePlaying() {
  if (!song.isPlaying()) {
    song.play();
    song.setVolume(0.3);
    button.html('pause');
  } else {
    song.stop();//여기는 알아서 고치기
    button.html('play');
  }
}
