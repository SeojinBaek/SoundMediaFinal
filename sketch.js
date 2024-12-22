var song1, song2; // 두 곡 객체
var playButton, song1Button, song2Button, volumeSlider, speedSelect; // 버튼 및 슬라이더, 드롭다운 객체
var amp; // 오디오 볼륨 분석 객체
var currentSong = null; // 현재 선택된 곡
var spaceBackground; // 배경 이미지 객체
var particles = []; // 파티클 배열
let forwardButton, backwardButton; // 10초 점프 버튼

function preload() {
  spaceBackground = loadImage('space_background2.jpg'); 
}

function setup() {
  createCanvas(640, 1280); // 640x1280 크기의 캔버스 생성
  song1 = loadSound('rose_edit.mp3'); // 첫 번째 곡 로드
  song2 = loadSound('Drowning.mp3'); // 두 번째 곡 로드
  amp = new p5.Amplitude(); // 오디오 볼륨 분석 객체 생성
  background(51); // 초기 배경 설정
  
  // 곡 선택 버튼 생성
  song1Button = createButton('too good to say goodbye - Rose');
  song1Button.position(width / 2 - 200, height - 450);
  song1Button.size(150, 40);
  song1Button.style('background-color', 'transparent'); // 배경색을 투명으로 설정
  song1Button.style('border', '2px solid white'); // 흰색 테두리 설정
  song1Button.style('color', 'white'); // 글씨 색을 흰색으로 설정
  song1Button.style('font-size', '16px'); // 글씨 크기 설정
  song1Button.mousePressed(() => selectSong(song1, 'too good to say goodbye - Rose'));

  song2Button = createButton('drowning - WOODZ');
  song2Button.position(width / 2 + 70, height - 450);
  song2Button.size(150, 40);
  song2Button.style('background-color', 'transparent');
  song2Button.style('border', '2px solid white');
  song2Button.style('color', 'white');
  song2Button.style('font-size', '16px');
  song2Button.mousePressed(() => selectSong(song2, 'drowning - WOODZ'));

  // Play 버튼 생성 (초기 상태는 비활성화)
  playButton = createButton('Play');
  playButton.position(width / 2 - 30, height - 350);
  playButton.size(80, 40);
  playButton.style('background-color', 'transparent');
  playButton.style('border', '2px solid white');
  playButton.style('color', 'white');
  playButton.style('font-size', '16px');
  playButton.mousePressed(togglePlaying);
  playButton.hide(); // 곡이 선택되기 전에는 숨김

  // 볼륨 조절 슬라이더 생성
  volumeSlider = createSlider(0, 1, 0.7, 0.01); // 최소값 0, 최대값 1, 기본값 0.3, 스텝 0.01
  volumeSlider.position(width / 2 - 150, height - 300); // 슬라이더 위치
  volumeSlider.size(300); // 슬라이더 크기

  // 재생 속도 선택 드롭다운 생성
  speedSelect = createSelect(); 
  speedSelect.position(width / 2 - 100, height - 250);
  speedSelect.size(200, 30);
  speedSelect.option('재생 속도', 'default'); 
  speedSelect.option('Speed: 0.5x', 0.5); // 0.5배속 옵션 추가
  speedSelect.option('Speed: 0.75x', 0.75); // 0.75배속 옵션 추가
  speedSelect.option('Speed: 1x', 1); // 기본 속도 옵션 추가
  speedSelect.option('Speed: 2x', 2); // 2배속 옵션 추가
  speedSelect.selected('default'); // 실행 시 기본값 설정
  speedSelect.changed(changeSpeed); // 값이 변경되면 실행

  // 10초 앞으로 가기 버튼 생성
  forwardButton = createButton('10초 앞으로');
  forwardButton.position(width / 2 + 100, height - 200);
  forwardButton.size(100, 40);
  forwardButton.style('background-color', 'transparent');
  forwardButton.style('border', '2px solid white');
  forwardButton.style('color', 'white');
  forwardButton.style('font-size', '16px');
  forwardButton.mousePressed(skipForward);

  // 10초 뒤로 가기 버튼 생성
  backwardButton = createButton('10초 뒤로');
  backwardButton.position(width / 2 - 200, height - 200);
  backwardButton.size(100, 40);
  backwardButton.style('background-color', 'transparent');
  backwardButton.style('border', '2px solid white');
  backwardButton.style('color', 'white');
  backwardButton.style('font-size', '16px');
  backwardButton.mousePressed(skipBackward);
}

function draw() {
  // 배경 그리기
  image(spaceBackground, 0, 0, width, 640);
  image(spaceBackground, 0, 640, width, 640); 

  // 볼륨 측정
  var vol = amp.getLevel(); // 볼륨 측정
  var diam = map(vol, 0, 0.2, 10, 200); // 볼륨에 따른 원의 크기 계산

  // 파티클 생성 및 업데이트
  for (var i = particles.length - 1; i >= 0; i--) {
    particles[i].update(vol); // 파티클 업데이트
    particles[i].show(); // 파티클 그리기
    if (particles[i].isFinished()) { // 파티클이 사라졌으면 제거
      particles.splice(i, 1);
    }
  }

  // 파티클 생성 (볼륨에 비례)
  if (diam > 15) { // 일정 크기 이상일 때만 파티클 생성
    particles.push(new Particle(width / 2, 320, diam * 1.5)); // 중앙에서 파티클 생성
  }
  
  // 슬라이더 값 가져와서 볼륨 조절
  if (currentSong) {
    currentSong.setVolume(volumeSlider.value()); // 슬라이더 값에 맞게 볼륨 조정
  }
}

class Particle {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.size = random(5, 20); // 파티클 크기
    this.angle = random(TWO_PI); // 랜덤한 초기 각도
    this.radius = radius; // 원의 반경
    this.speed = random(0.005, 0.01); // 회전 속도
    this.alpha = 255; // 투명도
    this.tiltAngle = PI / 6; // 기울기 각도 (30도)
    this.color = [255, 255, 255]; // 초기 색상 (흰색)
    this.isStar = false; // 초기 모양은 원
  }

  update(vol) {
    this.angle += this.speed + vol * 0.02; // 각도 변경
    let tiltX = cos(this.tiltAngle); // x축 기울기
    let tiltY = sin(this.tiltAngle); // y축 기울기
    this.x = width / 2 + cos(this.angle) * this.radius * tiltX;
    this.y = 320 + sin(this.angle) * this.radius * tiltY;
    this.alpha -= 4;

    // 볼륨이 특정 임계값 이상이면 색상과 모양 변경
    if (vol > 0.15) { // 임계값 설정
      this.color = [random(255), random(255), random(255)];
      this.isStar = true; // 모양을 별로 변경
    } else {
      this.isStar = false; // 다시 원으로 복귀
    }
  }

  show() {
    noStroke();
    fill(this.color[0], this.color[1], this.color[2], this.alpha); // 랜덤 색상 및 투명도 적용

    if (this.isStar) {
      drawStar(this.x, this.y, this.size / 2, this.size, 5); // 별 그리기
    } else {
      ellipse(this.x, this.y, this.size, this.size); // 원 그리기
    }
  }

  isFinished() {
    return this.alpha <= 0; // 투명도가 0이 되면 사라짐
  }
}

// 별을 그리는 함수
function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;

  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function selectSong(song, songName) {
  if (currentSong && currentSong.isPlaying()) {
    currentSong.stop();
  }
  currentSong = song;
  console.log(songName + ' selected');
  playButton.html('Play');
  playButton.show();
  if (currentSong) {
    currentSong.rate(1);
  }
  speedSelect.selected('default');
}

function togglePlaying() {
  if (currentSong) {
    if (!currentSong.isPlaying()) {
      currentSong.play();
      playButton.html('Pause');
    } else {
      currentSong.pause();
      playButton.html('Play');
    }
  }
}

function changeSpeed() {
  var selectedValue = speedSelect.value();
  if (selectedValue !== 'default' && currentSong) {
    var speed = parseFloat(selectedValue);
    currentSong.rate(speed);
    console.log('Playback speed changed to: ' + speed + 'x');
  }
}

function skipForward() {
  if (currentSong) {
    let currentTime = currentSong.currentTime();
    let newTime = currentTime + 10;
    if (newTime > currentSong.duration()) {
      newTime = currentSong.duration();
    }
    currentSong.jump(newTime);
    console.log('Skipped forward 10 seconds: ' + newTime);
  }
}

function skipBackward() {
  if (currentSong) {
    let currentTime = currentSong.currentTime();
    let newTime = currentTime - 10;
    if (newTime < 0) {
      newTime = 0;
    }
    currentSong.jump(newTime);
    console.log('Skipped backward 10 seconds: ' + newTime);
  }
}
