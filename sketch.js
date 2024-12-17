var song;
var button;
var amp;

function setup() {
  createCanvas(640, 1280); // 640x1280 크기의 캔버스 생성
  song = loadSound('rose.mp3', loaded); // 오디오 파일 로드
  amp = new p5.Amplitude(); // 오디오 볼륨 분석 객체 생성
  background(51); // 초기 배경 설정
}

function loaded() {
  // 'play' 버튼 생성
  button = createButton('play');
  
  // 버튼 스타일과 위치 설정 (아래쪽 640 구역에 배치)
  button.position(width / 2 - 30, height - 200); // 캔버스 아래쪽 중앙에 위치
  button.size(80, 40); // 버튼 크기 설정
  
  // 버튼 클릭 시 실행될 함수 연결
  button.mousePressed(togglePlaying);
}

function draw() {
  // 캔버스를 두 구역으로 나눔
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

}

function togglePlaying() {
  if (!song.isPlaying()) {
    // 노래가 재생 중이 아니면 재생
    song.play();
    song.setVolume(0.3); // 음량 설정
    button.html('pause'); // 버튼 텍스트 변경
  } else {
    // 노래가 재생 중이면 일시정지
    song.pause();
    button.html('play'); // 버튼 텍스트 변경
  }
}
