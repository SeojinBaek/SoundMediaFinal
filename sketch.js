var song1, song2; // 두 곡 객체
var playButton, song1Button, song2Button, volumeSlider, speedSelect; // 버튼 및 슬라이더, 드롭다운 객체
var amp; // 오디오 볼륨 분석 객체
var currentSong = null; // 현재 선택된 곡

function setup() {
  createCanvas(640, 1280); // 640x1280 크기의 캔버스 생성
  song1 = loadSound('rose.mp3'); // 첫 번째 곡 로드
  song2 = loadSound('Drowning.mp3'); // 두 번째 곡 로드
  amp = new p5.Amplitude(); // 오디오 볼륨 분석 객체 생성
  background(51); // 초기 배경 설정

  // 곡 선택 버튼 생성
  song1Button = createButton('too good to say goodbye - Rose');
  song1Button.position(width / 2 - 100, height - 450);
  song1Button.size(150, 40);
  song1Button.mousePressed(() => selectSong(song1, 'too good to say goodbye - Rose'));

  song2Button = createButton('drowning - WOODZ');
  song2Button.position(width / 2 + 70, height - 450);
  song2Button.size(150, 40);
  song2Button.mousePressed(() => selectSong(song2, 'drowning - WOODZ'));

  // Play 버튼 생성 (초기 상태는 비활성화)
  playButton = createButton('Play');
  playButton.position(width / 2 - 30, height - 350);
  playButton.size(80, 40);
  playButton.mousePressed(togglePlaying);
  playButton.hide(); // 곡이 선택되기 전에는 숨김

  // 볼륨 조절 슬라이더 생성
  volumeSlider = createSlider(0, 1, 0.3, 0.01); // 최소값 0, 최대값 1, 기본값 0.3, 스텝 0.01
  volumeSlider.position(width / 2 - 150, height - 250); // 슬라이더 위치
  volumeSlider.size(300); // 슬라이더 크기

// 재생 속도 선택 드롭다운 생성
speedSelect = createSelect(); 
speedSelect.position(width / 2 - 100, height - 200);
speedSelect.size(200, 30);

// 기본값으로 "재생 속도" 옵션 추가 (비활성화 상태)
speedSelect.option('재생 속도', 'default'); 
speedSelect.option('Speed: 0.5x', 0.5); // 0.5배속 옵션 추가
speedSelect.option('Speed: 0.75x', 0.75); // 0.75배속 옵션 추가
speedSelect.option('Speed: 1x', 1); // 기본 속도 옵션 추가
speedSelect.option('Speed: 2x', 2); // 2배속 옵션 추가
speedSelect.selected('default'); // 실행 시 기본값 설정

speedSelect.changed(changeSpeed); // 값이 변경되면 실행
}

function draw() {
  // 위쪽 640: 음량에 따라 변화하는 원
  fill(100); // 위쪽 구역 배경색 (어두운 회색)
  rect(0, 0, width, 640); // 위쪽 구역
  
  // 현재 오디오 볼륨 측정
  var vol = amp.getLevel();
  
  // 볼륨을 기준으로 원 크기 계산
  var diam = map(vol, 0, 0.3, 10, 200);
  
  // 원 그리기
  fill(255, 0, 255); // 보라색
  ellipse(width / 2, 320, diam, diam); // 위쪽 구역 중앙에 원 그리기

  // 아래쪽 640: 사용자 인터페이스 영역
  fill(51); // 아래쪽 구역 배경색 (기본 회색)
  rect(0, 640, width, 640); // 아래쪽 구역

  // 슬라이더 값을 가져와 현재 곡의 볼륨을 조절
  if (currentSong) {
    currentSong.setVolume(volumeSlider.value());
  }
}

function selectSong(song, songName) {
  // 현재 재생 중인 곡을 정지
  if (currentSong && currentSong.isPlaying()) {
    currentSong.stop();
  }

  // 선택한 곡을 현재 곡으로 설정
  currentSong = song;
  console.log(songName + ' selected'); // 선택된 곡 이름 표시

  // Play 버튼 활성화 및 보이기
  playButton.html('Play');
  playButton.show();
}

function togglePlaying() {
  if (currentSong) {
    if (!currentSong.isPlaying()) {
      // 선택된 곡 재생
      currentSong.play();
      playButton.html('Pause'); // 버튼 텍스트 변경
    } else {
      // 재생 중이면 일시정지
      currentSong.pause();
      playButton.html('Play'); // 버튼 텍스트 변경
    }
  }
}

function changeSpeed() {
  // 선택된 값이 'default'가 아닌 경우만 재생 속도 변경
  var selectedValue = speedSelect.value();
  if (selectedValue !== 'default' && currentSong) {
    var speed = parseFloat(selectedValue); // 선택된 값을 가져옴
    currentSong.rate(speed); // 선택된 속도로 재생 속도 변경
    console.log('Playback speed changed to: ' + speed + 'x');
  }
}
