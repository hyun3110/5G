document.addEventListener('DOMContentLoaded', () => {
    const largeSlider = document.querySelector('.large-slider');
    const largeSliderItems = Array.from(document.querySelectorAll('.large-slider-item'));
    const smallSlider = document.querySelector('.small-slider');
    const smallSliderItems = Array.from(document.querySelectorAll('.small-slider-item'));
    const totalSlides = largeSliderItems.length;
    let currentIndex = 0;

    if (!largeSlider || !smallSlider || largeSliderItems.length === 0 || smallSliderItems.length === 0) {
        console.error('슬라이더 요소를 찾을 수 없습니다.');
        return;
    }

    // 큰 슬라이드 업데이트
    function updateLargeSlider(index) {
        largeSlider.style.transform = `translateX(-${index * 100}%)`;
    }

    // 작은 슬라이드 업데이트
    function updateSmallSlider(index) {
        smallSliderItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });

        // 작은 슬라이드 자동 스크롤
        const offset = Math.max(0, index - 1) * (smallSliderItems[0].offsetWidth + 10);
        smallSlider.style.transform = `translateX(-${offset}px)`;
    }

    // 슬라이드 이동 함수
    function goToSlide(index) {
        currentIndex = index;
        updateLargeSlider(currentIndex);
        updateSmallSlider(currentIndex);
    }

    // 자동 슬라이드
    function startAutoSlide() {
        setInterval(() => {
            const nextIndex = (currentIndex + 1) % totalSlides;
            goToSlide(nextIndex);
        }, 3000);
    }

    // 작은 슬라이드 클릭 이벤트
    smallSliderItems.forEach((item, index) => {
        item.addEventListener('click', () => goToSlide(index));
    });

    // 초기화
    function initializeSlider() {
        goToSlide(0); // 초기 슬라이드 설정
        startAutoSlide(); // 자동 슬라이드 시작
    }

    initializeSlider();
});
