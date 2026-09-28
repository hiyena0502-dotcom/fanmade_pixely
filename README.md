# PIXELY : LOST SKY

잠뜰님의 생일을 준비하며 여러 이야기의 세계를 여행하는 비공식 팬메이드 어드벤처의 화면 초안입니다. 현재는 HOME, CHAPTERS, COLLECTION, 저장 슬롯 관리 화면이 구현되어 있습니다. 실제 포인트앤클릭 스토리는 아직 연결되지 않았습니다.

## 실행

정적 사이트입니다. `index.html`을 열거나 로컬 정적 서버에서 실행할 수 있습니다. 별도 빌드와 외부 패키지는 필요하지 않습니다.

## 파일

- `index.html` — 화면 구조
- `style.css` — 화면 스타일과 반응형 레이아웃
- `app.js` — 저장 슬롯, 챕터, 컬렉션, 업데이트 알림
- `site-version.json` — 배포된 사이트 버전

세이브는 브라우저 `localStorage`의 `pixely-lost-sky-saves-v2` 키에 슬롯 세 개로 저장됩니다. 브라우저 데이터를 지우면 세이브도 삭제됩니다.

## 배포할 때

사이트 파일을 수정하면 `app.js`의 `SITE_VERSION`, `site-version.json`의 `version`, `index.html`의 CSS/JS `?v=` 값을 같은 새 값으로 올려 주세요. 열린 탭은 배포 버전이 달라지면 새로고침 안내를 표시합니다. `node --test tests/*.test.js`로 주요 동작과 버전 일치를 확인할 수 있습니다.

> UNOFFICIAL FANMADE PROJECT
