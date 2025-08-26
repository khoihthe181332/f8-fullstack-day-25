const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");
const slides = Array.from(document.querySelectorAll(".slide-item")); // = 8 (tính cả 2 node được clone ở đầu và cuối)
const track = document.querySelector(".track");
const pages = document.querySelectorAll(".slide-page");

// Khởi tạo
let isTouching = false;
const NEXT = 1;
const PREV = -1;

let currentIndex = 1;
let acpControl = true; // biến cho phép ấn next/prev
const originalLengthOfSlides = slides.length; // độ dài gốc của mảng = 6

// Clone slide đầu và cuối
const firstSlide = slides[0].cloneNode(true);
const lastSlide = slides[slides.length - 1].cloneNode(true);

// Thêm vào mảng slides
slides.push(firstSlide);
slides.unshift(lastSlide);

// Đưa vào DOM
track.append(firstSlide);
track.prepend(lastSlide);

// slide:      (5)  1 2 3 4 5 6  (1)
// indexSlide:  0   1 2 3 4 5 6   7   -> currentIndex
// indexPage:  (5)  0 1 2 3 4 5  (0)   
// length = 8 -> length thực tế là 6

// Gọi hàm từ đầu để khi reload ảnh hiển thị đảm bảo luôn là ảnh số 1
setPosition(true);

// Thêm class và page đầu tiên
updateClassActive(0);

// Hàm thêm class active vào page
function updateClassActive(index) {
    pages[index].classList.add("active");
};

function setNewIndex(step) {
    currentIndex = (currentIndex + step + slides.length) % slides.length;

    pages.forEach((page) => {
        if (page.classList.contains("active")) page.classList.remove("active");
    });

    if (currentIndex === 0) {
        updateClassActive(originalLengthOfSlides - 1); // Active page cuối cùng
    } else if (currentIndex === slides.length - 1) {
        updateClassActive(0); // Active page đầu tiên
    } else {
        updateClassActive(currentIndex - 1);
    };

    // Hết hiệu ứng trượt thì sẽ nhảy về ảnh đầu tiên
    track.addEventListener("transitionend", () => {
        if (currentIndex > originalLengthOfSlides) {
            currentIndex -= originalLengthOfSlides;
            setPosition(true);
        } else if (currentIndex === 0) {
            currentIndex = originalLengthOfSlides;
            setPosition(true);
        }

        acpControl = true;
    });

    setPosition();

};

function setPosition(instant = false) {
    // Khi transition đang có thì sẽ k cho bấm nút
    if (!instant) {
        acpControl = false;
    }
    track.style.transition = instant ? "none" : "ease 0.7s";
    track.style.translate = `${currentIndex * 100 * -1}%`;
}

prevBtn.addEventListener("click", (e) => {
    if (!acpControl) return;
    setNewIndex(PREV);
});

nextBtn.addEventListener("click", (e) => {
    if (!acpControl) return;
    setNewIndex(NEXT);
});

// Hàm để slide tự động chạy
let autoPlay;

function startAutoPlay() {
    autoPlay = setInterval(() => {
        setNewIndex(NEXT);
    }, 5000) // 5000ms = 5s
};

function stopAutoPlay() {
    clearInterval(autoPlay);
};

function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
};

startAutoPlay();

// Khi di chuột vào thì slide sẽ dừng lại => giống  animation-play-state: paused
track.addEventListener("mouseenter", (e) => {
    stopAutoPlay();
});

// Khi bỏ chuột ra slide lại tiếp tục chạy
track.addEventListener("mouseleave", (e) => {
    startAutoPlay();
});

// slide:      (5)  1 2 3 4 5 6  (1)
// indexSlide:  0   1 2 3 4 5 6   7   -> currentIndex
// indexPage:  (5)  0 1 2 3 4 5  (0)
// length = 8 -> length thực tế là 6

// Chọn slide trong pagination
pages.forEach((page, index) => {
    page.addEventListener("click", () => {
        // Tính bước nhảy từ vị trí hiện tại đến vị trí click
        const step = index + 1 - currentIndex;
        setNewIndex(step);
        resetAutoPlay();
    });
});


// Responsive - dùng tay trượt slide
let touchCoord = 0;
let moveCoord = 0;

function handleTouchStart(e) {
    e.preventDefault();
    isTouching = true;
    touchCoord = e.touches[0].clientX;
}

function handleTouchMove(e) {
    if (isTouching) {
        moveCoord = e.touches[0].clientX
    }
}

function handleTouchEnd(e) {
    e.preventDefault();
    if (!isTouching) return;
    isTouching = false;
    const distance = moveCoord - touchCoord;

    if (distance > 50) { // Kéo khoảng cách tăng thì vuốt về slide trước
        setNewIndex(PREV);
        resetAutoPlay();
    } else if (distance < -50) { // Kéo khoảng cách giảm thì vuốt về slide sau
        setNewIndex(NEXT);
        resetAutoPlay();
    }
}

track.addEventListener("touchstart", handleTouchStart);

track.addEventListener("touchmove", handleTouchMove);

track.addEventListener("touchend", handleTouchEnd);
