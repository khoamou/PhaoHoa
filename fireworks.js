const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fireworks = [];
const particles = [];
const gravity = 0.1; // Trọng lực kéo hạt pháo xuống

// Class đại diện cho pháo hoa bay lên
class Rocket {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = 3;
        this.velocity = { x: 0, y: Math.random() * -8 - 10 }; // Vận tốc ban đầu hướng lên
        this.exploded = false;
    }

    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.y += this.velocity.y;
        this.velocity.y += gravity; // Trọng lực kéo xuống
        if (this.velocity.y >= 0 && !this.exploded) {
            this.explode(); // Nổ khi đạt đỉnh
        }
    }

    explode() {
        this.exploded = true;
        const colors = ['#ff0044', '#ffff44', '#44ff44', '#4488ff', '#ff44ff', '#00ffff', '#ff9900'];
        const particleCount = Math.floor(Math.random() * 150 + 100); // Tăng số lượng hạt pháo
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(this.x, this.y, colors[Math.floor(Math.random() * colors.length)]));
        }
    }
}

// Class đại diện cho các hạt pháo nổ
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = Math.random() * 2 + 1;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.velocity = {
            x: (Math.random() - 0.5) * 6,
            y: (Math.random() - 0.5) * 6
        };
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.velocity.y += gravity; // Trọng lực kéo hạt pháo rơi xuống
        this.alpha -= this.decay; // Hạt dần biến mất
    }
}

// Hàm tạo pháo hoa bay lên
function launchRocket() {
    const x = Math.random() * canvas.width;
    const y = canvas.height;
    const color = '#ffffff'; // Màu pháo hoa bay lên
    fireworks.push(new Rocket(x, y, color));
}

// Vòng lặp hoạt ảnh
function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Tạo hiệu ứng mờ dần
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Cập nhật và vẽ pháo hoa bay lên
    fireworks.forEach((firework, index) => {
        firework.draw();
        firework.update();
        if (firework.exploded) {
            fireworks.splice(index, 1); // Loại bỏ khi đã nổ
        }
    });

    // Cập nhật và vẽ hạt pháo nổ
    particles.forEach((particle, index) => {
        particle.draw();
        particle.update();
        if (particle.alpha <= 0) {
            particles.splice(index, 1); // Loại bỏ khi hạt mờ đi
        }
    });

    // **Tăng xác suất bắn nhiều pháo cùng lúc**
    if (Math.random() < 0.4) { // 40% cơ hội bắn pháo mỗi khung hình
        launchRocket();
        if (Math.random() < 0.1) { // 10% cơ hội bắn thêm một pháo nữa cùng lúc
            launchRocket();
        }
    }

    requestAnimationFrame(animate);
}

// Cập nhật kích thước canvas khi thay đổi cửa sổ
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Bắt đầu hoạt ảnh
animate();
