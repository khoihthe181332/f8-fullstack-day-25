const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");
const slides = Array.from(document.querySelectorAll(".slide-item"));
const track = document.querySelector(".track");

// Khởi tạo
const NEXT = 1;
const PREV = -1;

let currentIndex = 1;
let acpControl = true; // biến cho phép ấn next/prev
const lengthOfSlides = slides.length; // độ dài của mảng

// Clone slide đầu và cuối
const firstSlide = slides[0].cloneNode(true);
const lastSlide = slides[slides.length - 1].cloneNode(true);

// Thêm vào mảng slides
slides.push(firstSlide);
slides.unshift(lastSlide);

// Đưa vào DOM
track.append(firstSlide);
track.prepend(lastSlide);

// img:   (5) 1 2 3 4 (1)
// index:  0  1 2 3 4  5  
// length = 6 -> length thực tế là 4

// Gọi hàm từ đầu để khi reload ảnh hiển thị đảm bảo luôn là ảnh số 1 
setPosition(true);

function setNewIndex(step) {
    currentIndex = (currentIndex + step + slides.length) % slides.length;

    // Hết hiệu ứng trượt thì sẽ nhảy về ảnh đầu tiên
    track.addEventListener("transitionend", () => {
        if (currentIndex > lengthOfSlides) {
            currentIndex -= lengthOfSlides;
            setPosition(true);
        } else if (currentIndex === 0) {
            currentIndex = lengthOfSlides;
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
    track.style.transition = instant ? "none" : "ease 0.5s";
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
function slideAutoPlay() {
    autoPlay = setInterval(() => {
        setNewIndex(NEXT);
    }, 5000) // 5000ms = 5s
};

slideAutoPlay();

// Khi di chuột vào thì slide sẽ dừng lại => giống  animation-play-state: paused
track.addEventListener("mouseenter", (e) => {
    clearTimeout(autoPlay);
});

// Khi bỏ chuột ra slide lại tiếp tục chạy
track.addEventListener("mouseleave", (e) => {
    slideAutoPlay();
});

// Chọn slide trong pagination
const paginationItems = document.querySelectorAll(".slides-pagination-item");

// img:   (5) 1 2 3 4 (1)
// index:  0  1 2 3 4  5  
// length = 6 -> length thực tế là 4

// Lặp và lấy từng phần tử trong paginationItems
paginationItems.forEach((item, index) => {
    item.addEventListener("click", () => {
        currentIndex = index + 1;
        setPosition();
    });
});



