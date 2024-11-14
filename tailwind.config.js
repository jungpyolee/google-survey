module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        expand: "expand 0.3s ease-in-out", // 애니메이션 이름과 속도 설정
      },
      keyframes: {
        expand: {
          "0%": { transform: "scaleX(0)" }, // 시작 시 scaleX(0)
          "100%": { transform: "scaleX(1)" }, // 끝날 때 scaleX(1)로 확장
        },
      },
    },
  },
  plugins: [],
};
