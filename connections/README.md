# 한국어 커넥션 🎮

뉴욕타임즈의 Connections 게임을 한국어로 재해석한 웹 게임입니다. 16개의 단어를 4개씩 그룹으로 묶어보세요!

## 🎯 게임 방법

1. 16개의 단어가 주어집니다
2. 공통점이 있는 단어 4개를 선택합니다
3. "제출하기" 버튼을 눌러 답을 확인합니다
4. 4번의 실수 기회 안에 모든 그룹을 찾아야 합니다!

## ✨ 주요 기능

- 📅 매일 새로운 퍼즐 (3개의 퍼즐이 순환)
- 🎨 난이도별 색상 구분 (쉬움 → 어려움)
- 🔀 단어 섞기 기능
- 📱 반응형 디자인 (모바일, 태블릿, 데스크톱 지원)
- ♿ 접근성 지원 (키보드 네비게이션)
- 📊 결과 공유 기능

## 🛠️ 기술 스택

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite 7
- **Language**: JavaScript (JSX)

## 📦 설치 및 실행

### 사전 요구사항

- Node.js 18 이상
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone https://github.com/MinKyeongHyeon/connections.git
cd connections/connections

# 의존성 설치
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 열기

### 프로덕션 빌드

```bash
npm run build
```

### 빌드 미리보기

```bash
npm run preview
```

## 📁 프로젝트 구조

```
connections/
├── src/
│   ├── connections/
│   │   └── Connections.jsx    # 메인 게임 컴포넌트
│   ├── App.jsx                # 앱 루트 컴포넌트
│   ├── main.jsx               # 앱 진입점
│   └── index.css              # Tailwind CSS 설정
├── public/                    # 정적 파일
├── index.html                 # HTML 템플릿
├── vite.config.js            # Vite 설정
├── tailwind.config.js        # Tailwind 설정
├── postcss.config.js         # PostCSS 설정
├── .prettierrc               # Prettier 설정
└── package.json              # 프로젝트 메타데이터
```

## 🚀 배포

### Vercel 배포

```bash
# Vercel CLI 설치 (처음 한 번만)
npm i -g vercel

# 배포
vercel
```

또는 GitHub 연동으로 자동 배포:

1. Vercel 대시보드에서 프로젝트 import
2. Git repository 연결
3. 자동으로 빌드 및 배포

### Netlify 배포

```bash
# Netlify CLI 설치 (처음 한 번만)
npm i -g netlify-cli

# 배포
netlify deploy --prod
```

또는 드래그 앤 드롭:

1. `npm run build` 실행
2. `dist` 폴더를 Netlify에 드래그 앤 드롭

## 🎮 게임 난이도

- 🟡 **쉬움** (노란색): 명확한 카테고리
- 🟢 **보통** (초록색): 조금 더 생각이 필요한 그룹
- 🔵 **어려움** (파란색): 창의적 사고 필요
- 🟣 **전문가** (보라색): 단어 채우기 문제

## 📝 커스터마이징

### 새로운 퍼즐 추가

`src/connections/Connections.jsx` 파일의 `puzzles` 배열에 새로운 퍼즐을 추가하세요:

```javascript
{
  categories: [
    {
      name: "카테고리 이름",
      words: ["단어1", "단어2", "단어3", "단어4"],
      difficulty: "easy", // easy, medium, hard, expert
      color: "bg-yellow-400",
      icon: "circle", // circle, square, triangle, star
    },
    // 3개의 카테고리 더 추가...
  ];
}
```

## 🤝 기여

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참고하세요.

## 👤 만든 사람

**MinKyeongHyeon**

- GitHub: [@MinKyeongHyeon](https://github.com/MinKyeongHyeon)

## 🙏 감사의 말

- 뉴욕타임즈 Connections 게임에서 영감을 받았습니다
- [Lucide](https://lucide.dev/) 아이콘 라이브러리
- [Tailwind CSS](https://tailwindcss.com/) 스타일링 프레임워크

## 📈 향후 계획

- [ ] 더 많은 퍼즐 추가
- [ ] 사용자 통계 기능
- [ ] 다크 모드 지원
- [ ] 퍼즐 제작 도구
- [ ] 멀티플레이어 모드

---

⭐ 이 프로젝트가 마음에 드셨다면 GitHub Star를 눌러주세요!
