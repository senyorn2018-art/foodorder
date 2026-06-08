$(document).ready(function() {
    // Handle Buy Now click
    $('.buy-btn').on('click', function() {
        const itemName = $(this).closest('.food-card').find('h5').text();
        
        // Visual feedback
        $(this).text('Added!').addClass('btn-dark');

        // AJAX Example
        $.ajax({
            url: 'https://jsonplaceholder.typicode.com/posts', // Placeholder API
            method: 'POST',
            data: {
                item: itemName,
                quantity: 1
            },
            error: function() {
                alert('Something went wrong. Please try again.');
            }
        });
    });
});
$(document).ready(function() {
    $('.footer-section .btn-success').on('click', function(e) {
        e.preventDefault();
        const email = $(this).siblings('input').val();

        if(email === "") {
            alert("Please enter your email");
            return;
        }

        $.ajax({
            url: 'https://jsonplaceholder.typicode.com/posts',
            method: 'POST',
            data: { newsletter_email: email },
            success: function() {
                alert("Welcome aboard! Check your email for updates.");
                $('.newsletter-form input').val('');
            }
        });
    });
});

// មុខងារចុច Buy Now ដើម្បីថែមអីវ៉ាន់ និងលោត Alert
        $('.buy-btn').click(function() {
            const name = $(this).data('name');
            const price = parseFloat($(this).data('price'));
            
            // ពិនិត្យមើលថាតើមានមុខម្ហូបនេះក្នុងកន្ត្រករួចហើយឬនៅ
            let existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name: name, price: price, quantity: 1 });
            }
            
            // 💡 បច្ចុប្បន្នភាពទិន្នន័យកន្ត្រកទំនិញ
            updateCartUI();

            // 💡 បង្ហាញផ្ទាំង Alert Toast ដ៏ស្អាត
            $('#alertItemName').text(name); // ប្តូរឈ្មោះម្ហូបក្នុង Alert
            const toastElement = document.getElementById('cartAlertToast');
            const toast = new bootstrap.Toast(toastElement, { delay: 2000 }); // កំណត់ឱ្យបាត់ទៅវិញក្នុងរយៈពេល ២វិនាទី
            toast.show();
        });

        /* Active*/
        $(document).ready(function() {
    // ទាញយកឈ្មោះ File នៃទំព័រដែលកំពុងបើក (ឧទាហរណ៍៖ blog.html)
    let currentUrl = window.location.pathname.split("/").pop();
    
    // ប្រសិនបើបើកមកទទេរ (ទំព័រដើម) កំណត់វាជា index.php
    if (currentUrl === "") {
        currentUrl = "index.php";
    }

    // លុប class active ចាស់ៗចេញទាំងអស់ជាមុនសិន
    $('.navbar-nav .nav-link').removeClass('active');

    // ស្វែងរក Link ណាដែលមាន attribute 'href' ត្រូវនឹងឈ្មោះទំព័រ បន្ទាប់មកថែម class active ចូល
    $(`.navbar-nav .nav-link[href="${currentUrl}"]`).addClass('active');
    
    // ករណីពិសេស៖ ប្រសិនបើស្ថិតក្នុងទំព័រអានប្លុកលម្អិត ឱ្យជាប់ active លើម៉ឺនុយ Blog ដែរ
    if (currentUrl === "blogdetail.html") {
        $('.navbar-nav .nav-link[href="blog.html"]').addClass('active');
    }
}); 
// Animation all page
// ==========================================================================
// ✨ គ្រប់គ្រងចលនាអត្តរកម្ម (Scroll Animation System) សម្រាប់គ្រប់ទំព័រ
// ==========================================================================
document.addEventListener("DOMContentLoaded", function() {
    
    // ១. បន្ថែមចលនាទៅលើ Hero Section ភ្លាមៗពេលទំព័រទាញយកជោគជ័យ
    const heroTitle = document.querySelector('.hero-section h1, .product-hero h1, .hero-section .display-4');
    const heroImage = document.querySelector('.hero-section img, .product-hero img');
    
    if (heroTitle) {
        heroTitle.classList.add('animate__animated', 'animate__fadeInUp');
    }
    if (heroImage) {
        heroImage.classList.add('animate__animated', 'animate__fadeInRight');
    }

    // ២. បង្កើតប្រព័ន្ធចាប់មុំមើល (Intersection Observer) សម្រាប់ធាតុពេល Scroll ទៅដល់
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // ពេល Scroll ទៅដល់ធាតុនោះ
            if (entry.isIntersecting) {
                // ប្រសិនបើជាកាតផលិតផល ឬកាតប្លុក ឱ្យវាអណ្តែតឡើងថ្នមៗ
                if (entry.target.classList.contains('food-card') || 
                    entry.target.classList.contains('premium-feature-card') || 
                    entry.target.classList.contains('category-card') ||
                    entry.target.classList.contains('product-item-card')) {
                    entry.target.classList.add('animate__animated', 'animate__fadeInUp', 'animate__fast');
                } 
                // ប្រសិនបើជាផ្ទាំង Promo Box ឱ្យវារត់ចេញពីឆ្វេង ឬស្ដាំ
                else if (entry.target.classList.contains('promo-box')) {
                    entry.target.classList.add('animate__animated', 'animate__zoomIn', 'animate__fast');
                }
                // លុបការតាមដានចេញ ក្រោយពេលវាដំណើរការចលនារួច (រត់តែម្តងបានហើយ)
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15 // ឱ្យដំណើរការចលនាពេលធាតុនោះលេចចេញបាន ១៥% លើអេក្រង់
    });

    // ស្វែងរកធាតុទាំងអស់ក្នុងទំព័រដើម្បីដាក់បញ្ចូលទៅក្នុងប្រព័ន្ធចាប់ចលនា
    const elementsToAnimate = document.querySelectorAll('.food-card, .premium-feature-card, .category-card, .product-item-card, .promo-box');
    elementsToAnimate.forEach(el => {
        // កំណត់ឱ្យវាលាក់ខ្លួនសិន មុនពេល Scroll ទៅដល់
        el.style.opacity = '0';
        el.addEventListener('animationstart', () => el.style.opacity = '1');
        
        scrollObserver.observe(el);
    });
});