var song1, song2; // 두 곡 객체
var playButton, song1Button, song2Button, volumeSlider, speedSelect; // 버튼 및 슬라이더, 드롭다운 객체
var amp; // 오디오 볼륨 분석 객체
var currentSong = null; // 현재 선택된 곡
var spaceBackground; // 배경 이미지 객체
var particles = []; // 파티클 배열

function preload() {
  spaceBackground = loadImage("space_background2.jpg");
}

function setup() {
  createCanvas(640, 1280); // 640x1280 크기의 캔버스 생성
  song1 = loadSound("rose.mp3"); // 첫 번째 곡 로드
  song2 = loadSound("Drowning.mp3"); // 두 번째 곡 로드
  amp = new p5.Amplitude(); // 오디오 볼륨 분석 객체 생성
  background(51); // 초기 배경 설정

  // 곡 선택 버튼 생성
  song1Button = createButton("too good to say goodbye - Rose");
  song1Button.position(width / 2 - 200, height - 450);
  song1Button.size(150, 40);
  song1Button.style("background-color", "transparent"); // 배경색을 투명으로 설정
  song1Button.style("border", "2px solid white"); // 흰색 테두리 설정
  song1Button.style("color", "white"); // 글씨 색을 흰색으로 설정
  song1Button.style("font-size", "16px"); // 글씨 크기 설정
  song1Button.mousePressed(() =>
    selectSong(song1, "too good to say goodbye - Rose")
  );

  song2Button = createButton("drowning - WOODZ");
  song2Button.position(width / 2 + 70, height - 450);
  song2Button.size(150, 40);
  song2Button.style("background-color", "transparent");
  song2Button.style("border", "2px solid white");
  song2Button.style("color", "white");
  song2Button.style("font-size", "16px");
  song2Button.mousePressed(() => selectSong(song2, "drowning - WOODZ"));

  // Play 버튼 생성 (초기 상태는 비활성화)
  playButton = createButton("Play");
  playButton.position(width / 2 - 30, height - 350);
  playButton.size(80, 40);
  playButton.style("background-color", "transparent");
  playButton.style("border", "2px solid white");
  playButton.style("color", "white");
  playButton.style("font-size", "16px");
  playButton.mousePressed(togglePlaying);
  playButton.hide(); // 곡이 선택되기 전에는 숨김

  // 볼륨 조절 슬라이더 생성
  volumeSlider = createSlider(0, 1, 0.3, 0.01); // 최소값 0, 최대값 1, 기본값 0.3, 스텝 0.01
  volumeSlider.position(width / 2 - 150, height - 300); // 슬라이더 위치
  volumeSlider.size(300); // 슬라이더 크기

  // 재생 속도 선택 드롭다운 생성
  speedSelect = createSelect();
  speedSelect.position(width / 2 - 100, height - 250);
  speedSelect.size(200, 30);

  // 기본값으로 "재생 속도" 옵션 추가 (비활성화 상태)
  speedSelect.option("재생 속도", "default");
  speedSelect.option("Speed: 0.5x", 0.5); // 0.5배속 옵션 추가
  speedSelect.option("Speed: 0.75x", 0.75); // 0.75배속 옵션 추가
  speedSelect.option("Speed: 1x", 1); // 기본 속도 옵션 추가
  speedSelect.option("Speed: 2x", 2); // 2배속 옵션 추가
  speedSelect.selected("default"); // 실행 시 기본값 설정

  speedSelect.changed(changeSpeed); // 값이 변경되면 실행
}

function draw() {
  // 배경 그리기
  image(spaceBackground, 0, 0, width, 640);
  image(spaceBackground, 0, 640, width, 640);

  // 볼륨 측정
  var vol = amp.getLevel(); // 볼륨 측정
  var diam = map(vol, 0, 0.3, 10, 200); // 볼륨에 따른 원의 크기 계산

  // 파티클 생성 및 업데이트
  for (var i = particles.length - 1; i >= 0; i--) {
    particles[i].update(vol); // 파티클 업데이트
    particles[i].show(); // 파티클 그리기
    if (particles[i].isFinished()) {
      // 파티클이 사라졌으면 제거
      particles.splice(i, 1);
    }
  }

  // 파티클 생성 (볼륨에 비례)
  if (diam > 30) {
    // 일정 크기 이상일 때만 파티클 생성
    particles.push(new Particle(width / 2, 320, diam)); // 중앙에서 파티클 생성
  }
}

// 파티클 클래스
class Particle {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.size = random(5, 20); // 파티클 크기
    this.angle = random(TWO_PI); // 랜덤한 초기 각도
    this.radius = radius; // 원의 반경
    this.speed = random(0.0005, 0.001); // 시계방향 회전 속도
    this.alpha = 255; // 투명도
  }

  // 파티클 업데이트
  update(vol) {
    // 파티클의 각도를 조금씩 증가시켜서 시계방향으로 회전하도록 만들기
    this.angle += this.speed + vol * 0.02; // 볼륨에 따라 속도 조절

    // 시계방향 회전을 위해 x, y 위치를 계산 (원형 경로)
    this.x = width / 2 + cos(this.angle) * this.radius;
    this.y = 320 + sin(this.angle) * this.radius;

    // 서서히 투명해짐
    this.alpha -= 2;
  }

  // 파티클 그리기
  show() {
    noStroke();
    fill(255, this.alpha); // 하얀색, 투명도 적용
    ellipse(this.x, this.y, this.size, this.size); // 파티클 그리기
  }

  // 파티클이 사라졌는지 확인
  isFinished() {
    return this.alpha <= 0; // 투명도가 0이 되면 사라짐
  }
}

// 슬라이더 값을 가져와 현재 곡의 볼륨을 조절
if (currentSong) {
  currentSong.setVolume(volumeSlider.value());
}

function selectSong(song, songName) {
  // 현재 재생 중인 곡을 정지
  if (currentSong && currentSong.isPlaying()) {
    currentSong.stop();
  }

  // 선택한 곡을 현재 곡으로 설정
  currentSong = song;
  console.log(songName + " selected"); // 선택된 곡 이름 표시

  // Play 버튼 활성화 및 보이기
  playButton.html("Play");
  playButton.show();

  // 재생 속도 초기화
  if (currentSong) {
    currentSong.rate(1); // 속도를 기본값 1로 설정
  }
  speedSelect.selected("default"); // 드롭다운 메뉴를 "재생 속도"로 리셋
}

function togglePlaying() {
  if (currentSong) {
    if (!currentSong.isPlaying()) {
      // 선택된 곡 재생
      currentSong.play();
      playButton.html("Pause"); // 버튼 텍스트 변경
    } else {
      // 재생 중이면 일시정지
      currentSong.pause();
      playButton.html("Play"); // 버튼 텍스트 변경
    }
  }
}

function changeSpeed() {
  // 선택된 값이 'default'가 아닌 경우만 재생 속도 변경
  var selectedValue = speedSelect.value();
  if (selectedValue !== "default" && currentSong) {
    var speed = parseFloat(selectedValue); // 선택된 값을 가져옴
    currentSong.rate(speed); // 선택된 속도로 재생 속도 변경
    console.log("Playback speed changed to: " + speed + "x");
  }
}
