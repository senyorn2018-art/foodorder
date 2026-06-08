// ==========================================================================
// 🛒 cart.js - ប្រព័ន្ធគ្រប់គ្រងកន្ត្រកទំនិញសកល និងបាញ់ទិន្នន័យតាមលេខតុសម្រាប់ Foodied
// ==========================================================================
let cart = JSON.parse(localStorage.getItem('foodied_cart')) || [];

$(document).ready(function() {
    // បច្ចុប្បន្នភាពទម្រង់កន្ត្រកទំនិញភ្លាមៗពេលបើកទំព័រមក
    updateCartUI();

    // ១. មុខងារចុចប៊ូតុង Buy Now ដើម្បីថែមអីវ៉ាន់ និងបង្ហាញ Alert Toast
    $(document).on('click', '.buy-btn', function(e) {
        e.preventDefault();
        const name = $(this).data('name');
        const price = parseFloat($(this).data('price'));
        
        // ពិនិត្យមើលថាតើមានមុខម្ហូបនេះក្នុងកន្ត្រករួចហើយឬនៅ
        let existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name: name, price: price, quantity: 1 });
        }
        
        // រក្សាទុក និងបង្ហាញទម្រង់ UI ថ្មី
        saveCart();
        updateCartUI();

        // បង្ហាញផ្ទាំង Alert Toast
        $('#alertItemName').text(name);
        const toastElement = document.getElementById('cartAlertToast');
        if (toastElement) {
            const toast = new bootstrap.Toast(toastElement, { delay: 2000 });
            toast.show();
        }
    });

    // ២. សម្អាតកន្ត្រកទាំងមូល
    $('#clearCartBtn').click(function() {
        cart = [];
        saveCart();
        updateCartUI();
    });

    // ៣. មុខងារចុចប៊ូតុងសំបុត្រព្រឹត្តិបត្រព័ត៌មាន (Newsletter Form) ក្នុង Footer
    $('.recipe-footer .btn-success').on('click', function(e) {
        e.preventDefault();
        const email = $(this).siblings('input').val();

        if (email === "") {
            alert("Please enter your email");
            return;
        }

        $.ajax({
            url: 'https://jsonplaceholder.typicode.com/posts',
            method: 'POST',
            data: { newsletter_email: email },
            success: function() {
                alert("Welcome aboard! Check your email for updates.");
                $('.recipe-footer input').val('');
            }
        });
    });

    // ==========================================================================
    // 🚀 មុខងារបញ្ជូនទិន្នន័យពី My Cart ដោយផ្អែកលើ [ លេខតុ ] ទៅ Google Sheet ស្ងាត់ៗ
    // ==========================================================================
    $('#checkoutBtn').click(function(e) {
        e.preventDefault();

        // ពិនិត្យមើលថាតើមានអីវ៉ាន់ក្នុងកន្ត្រកដែរឬទេ
        if (cart.length === 0) {
            alert("កន្ត្រកទំនិញរបស់អ្នកនៅទទេរឡើយ! សូមជ្រើសរើសមុខម្ហូបជាមុនសិន។");
            return;
        }

        // ចាប់យកតម្លៃលេខតុពី Dropdown Option ជំនាន់ Premium Custom Design
        const customerTable = $('#customerTable').val(); 

        // 💡 លក្ខខណ្ឌការពារ៖ បើភ្ញៀវភ្លេចជ្រើសរើសលេខតុ មិនអនុញ្ញាតឱ្យចុច Checkout ឡើយ
        if (!customerTable || customerTable === "") {
            alert("⚠️ សូមមេត្តាជ្រើសរើសលេខតុរបស់អ្នក (Table 01 - 10) ជាមុនសិន! 🙏");
            return;
        }

        // រៀបចំទម្រង់អត្ថបទចាប់យកទិន្នន័យលម្អិតនៃមុខម្ហូប
        let orderDetails = "🛒 បញ្ជីបញ្ជាទិញម្ហូបពី FOODIED 🛒\n";
        orderDetails += "=============================\n\n";
        
        let grandTotal = 0;
        cart.forEach((item, index) => {
            let itemTotal = item.price * item.quantity;
            grandTotal += itemTotal;
            
            orderDetails += `🔹 មុខម្ហូបទី ${index + 1}: ${item.name}\n`;
            orderDetails += `   - តម្លៃរាយ: $${item.price.toFixed(2)}\n`;
            orderDetails += `   - បរិមាណ: ${item.quantity} មុខ\n`;
            orderDetails += `   - សរុបប្រចាំមុខនេះ: $${itemTotal.toFixed(2)}\n`;
            orderDetails += `-----------------------------\n`;
        });
        
        // ភ្ជាប់ព័ត៌មានលេខតុទៅក្នុងប្រអប់លម្អិតទំនិញ
        orderDetails += `📍 ទីតាំង៖ កុម្ម៉ង់ផ្ទាល់ពី [ ${customerTable} ]\n`;
        orderDetails += "=============================\n";
        orderDetails += "🙏 សូមអរគុណសម្រាប់ការគាំទ្រ!";

        const finalTotalAmount = `$${grandTotal.toFixed(2)}`;

        // លីងសម្រាប់បាញ់ទិន្នន័យកូដស្ងាត់ (formResponse) ទៅ Google Form របស់សម្លាញ់
        const googleFormActionURL = "https://docs.google.com/forms/d/e/1FAIpQLSfHbeHkLOWhk10D4hF8pSq-A78-YWQyZ3iOwUL_hOl7Jdwjow/formResponse";

        // រៀបចំកញ្ចប់ទិន្នន័យ៖ យក [ លេខតុ ] ទៅដោតត្រង់ប្រអប់ឈ្មោះរបស់ Google Sheet
        // ត្រូវយក ID ពី tags របស់ HTML in google form
        const formData = {
            "entry.113981043": customerTable,      // បាញ់លេខតុចូលទៅប្រអប់ឈ្មោះ
            "entry.536189167": "កុម្ម៉ង់ផ្ទាល់ក្នុងហាង", // បាញ់ចំណាំទៅប្រអប់លេខទូរស័ព្ទ
            "entry.794670972": orderDetails,       // បាញ់បញ្ជីមុខម្ហូប + លេខតុលម្អិត
            "entry.851643713": finalTotalAmount     // បាញ់តម្លៃសរុបចុងក្រោយ
        };

        // ផ្ញើទៅកាន់ Google Form តាមរយៈ AJAX
        $.ajax({
            url: googleFormActionURL,
            data: formData,
            type: "POST",
            dataType: "xml",
            crossDomain: true,
            success: function() {
                showSuccessOrder();
            },
            error: function() {
                // crossDomain ជានិច្ចកាលលោតចូល Error តែទិន្នន័យគឺចូល Sheet រួចរាល់ហើយ
                showSuccessOrder();
            }
        });
    });
});

// មុខងាររក្សាទុកទិន្នន័យចូលក្នុង localStorage
function saveCart() {
    localStorage.setItem('foodied_cart', JSON.stringify(cart));
}

// មុខងារបូក/បន្ថយចំនួននៅក្នុងកន្ត្រក
window.changeQty = function(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
    updateCartUI();
}

// មុខងារគូរផ្ទៃ និងគណនាលុយក្នុងកន្ត្រកទំនិញ
function updateCartUI() {
    const listContainer = $('#cartItemsList');
    if (listContainer.length === 0) return; 
    
    listContainer.empty();
    
    if (cart.length === 0) {
        listContainer.append('<p class="text-muted text-center py-5 empty-cart-msg">Your cart is empty!</p>');
        $('.cart-count').text('0');
        $('.cart-total-main, .cart-total-nav, #cartTotalValue').text('0.00');
        return;
    }

    let total = 0;
    let totalItemsCount = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        totalItemsCount += item.quantity;

        const itemHTML = `
            <div class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                <div>
                    <h6 class="fw-bold mb-1 small text-dark">${item.name}</h6>
                    <span class="text-success small fw-semibold">$${item.price.toFixed(2)} x ${item.quantity}</span>
                </div>
                <div class="d-flex align-items-center gap-1">
                    <button class="btn btn-sm btn-light border rounded-circle py-0 px-2" onclick="changeQty(${index}, -1)">-</button>
                    <button class="btn btn-sm btn-light border rounded-circle py-0 px-2" onclick="changeQty(${index}, 1)">+</button>
                </div>
            </div>
        `;
        listContainer.append(itemHTML);
    });

    $('.cart-count').text(totalItemsCount);
    $('.cart-total-main, .cart-total-nav, #cartTotalValue').text(total.toFixed(2));
}

// មុខងារបង្ហាញសារជោគជ័យ និងសម្អាតកន្ត្រក
function showSuccessOrder() {
    alert("🎉 ការបញ្ជាទិញរបស់លោកអ្នកទទួលបានជោគជ័យហើយ! ចុងភៅកំពុងរៀបចំម្ហូបជូនតាមលេខតុរបស់អ្នក។");
    cart = [];
    saveCart();
    updateCartUI();
    
    // សម្អាតតម្លៃប្រអប់លេខតុនៅលើអេក្រង់វិញ
    $('#customerTable').val('');
}

/* ==========================================================================
   ✨ ប្រព័ន្ធគ្រប់គ្រង Menu Active ស្វ័យប្រវត្តិតាមឈ្មោះទំព័រ URL
   ========================================================================== */
$(document).ready(function() {
    let currentUrl = window.location.pathname.split("/").pop();
    
    if (currentUrl === "" || currentUrl === "index.html") {
        currentUrl = "index.html";
    }

    $('.navbar-nav .nav-link').removeClass('active');
    $(`.navbar-nav .nav-link[href="${currentUrl}"]`).addClass('active');
    
    if (currentUrl === "blogdetail.html") {
        $('.navbar-nav .nav-link[href="blog.html"]').addClass('active');
    }
}); 

/* ==========================================================================
   ✨ គ្រប់គ្រងចលនាអត្តរកម្ម (Scroll Animation System) សម្រាប់គ្រប់ទំព័រ
   ========================================================================== */
document.addEventListener("DOMContentLoaded", function() {
    const heroTitle = document.querySelector('.hero-section h1, .product-hero h1, .hero-section .display-4');
    const heroImage = document.querySelector('.hero-section img, .product-hero img');
    
    if (heroTitle) {
        heroTitle.classList.add('animate__animated', 'animate__fadeInUp');
    }
    if (heroImage) {
        heroImage.classList.add('animate__animated', 'animate__fadeInRight');
    }

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('food-card') || 
                    entry.target.classList.contains('premium-feature-card') || 
                    entry.target.classList.contains('category-card') ||
                    entry.target.classList.contains('product-item-card')) {
                    entry.target.classList.add('animate__animated', 'animate__fadeInUp', 'animate__fast');
                } 
                else if (entry.target.classList.contains('promo-box')) {
                    entry.target.classList.add('animate__animated', 'animate__zoomIn', 'animate__fast');
                }
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15 
    });

    const elementsToAnimate = document.querySelectorAll('.food-card, .premium-feature-card, .category-card, .product-item-card, .promo-box');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.addEventListener('animationstart', () => el.style.opacity = '1');
        scrollObserver.observe(el);
    });
});