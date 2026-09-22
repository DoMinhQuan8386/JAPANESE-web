/**
 * PORTFOLIO SCRIPTS - HOÀNG PHÚC (LHU IT)
 * Tính năng: Bộ chuyển 5 màu thông minh (Xanh dương, Đỏ, Hồng, Vàng, Tím),
 * Dark/Light Mode, Typewriter, Bộ lọc Dự án, Copy 1-chạm, Toast, Form Validation
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ================= 1. BẢNG ĐIỀU KHIỂN CHỌN MÀU THÔNG MINH (ACCENT COLOR SWITCHER) ================= */
  const colorSwatches = document.querySelectorAll('.color-swatch-btn');
  const savedAccent = localStorage.getItem('hp_portfolio_accent') || 'blue';

  function setAccent(color) {
    document.documentElement.setAttribute('data-accent', color);
    localStorage.setItem('hp_portfolio_accent', color);
    colorSwatches.forEach(swatch => {
      swatch.classList.toggle('active', swatch.getAttribute('data-color') === color);
    });
  }

  setAccent(savedAccent);

  const colorNames = {
    blue: 'Xanh Dương (Tech & Uy Tín)',
    red: 'Màu Đỏ (Quyết Tâm & Đam Mê)',
    pink: 'Màu Hồng (Năng Động & Trẻ Trung)',
    yellow: 'Màu Vàng (Năng Lượng & Tỏa Sáng)',
    purple: 'Màu Tím (Sáng Tạo & UI/UX)'
  };

  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const chosenColor = swatch.getAttribute('data-color');
      setAccent(chosenColor);
      showToast(`Đã áp dụng bảng màu: ${colorNames[chosenColor]} ✨`, 'info');
    });
  });

  /* ================= 2. THEME TOGGLE (DARK / LIGHT MODE) ================= */
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = themeToggleBtn.querySelector('.theme-icon');
  
  const savedTheme = localStorage.getItem('hp_portfolio_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.textContent = '☀️';
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    themeIcon.textContent = '🌙';
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('hp_portfolio_theme', newTheme);
    themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';

    showToast(`Đã chuyển sang chế độ ${newTheme === 'dark' ? 'Giao diện Tối 🌙' : 'Giao diện Sáng ☀️'}`, 'info');
  });

  /* ================= 3. TYPEWRITER EFFECT (HERO) ================= */
  const typewriterElement = document.getElementById('typewriter-text');
  const words = [
    'Sinh viên CNTT @ Đại học Lạc Hồng',
    'Frontend Web Developer',
    'Đam mê UI/UX & Figma',
    'Tư duy logic & Tự học nhanh'
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 90;
  const deleteSpeed = 45;
  const delayBetweenWords = 1800;

  function typeEffect() {
    if (!typewriterElement) return;
    const currentWord = words[wordIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let nextSpeed = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentWord.length) {
      nextSpeed = delayBetweenWords;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      nextSpeed = 400;
    }

    setTimeout(typeEffect, nextSpeed);
  }
  typeEffect();

  /* ================= 4. STICKY NAVBAR & MOBILE MENU ================= */
  const navbar = document.querySelector('.navbar');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('nav-links');
  const navItems = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  });

  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburgerBtn.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
    });

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburgerBtn.textContent = '☰';
      });
    });
  }

  // Active scrollspy
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelector(`.nav-links a[href*=${sectionId}]`)?.classList.add('active');
      } else {
        document.querySelector(`.nav-links a[href*=${sectionId}]`)?.classList.remove('active');
      }
    });
  });

  /* ================= 5. PROJECT FILTERING ================= */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || filterValue === category) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ================= 6. INTERACTIVE ELEVATOR PITCH TABS ================= */
  const pitchTabs = document.querySelectorAll('.pitch-tab-btn');
  const pitchScenario = document.getElementById('pitch-scenario');
  const pitchTextEl = document.getElementById('pitch-text-display');
  const pitchCopyBtn = document.getElementById('pitch-copy-btn');

  const pitchData = {
    interview: {
      title: "⏱️ Phiên Bản 1: Phỏng Vấn & Networking (Pitch 30 Giây)",
      text: `"Chào anh/chị, em là Hoàng Phúc, sinh viên năm 2 chuyên ngành Công nghệ Thông tin tại Trường Đại học Lạc Hồng (LHU).\n\nVới niềm đam mê lớn dành cho lập trình web và trải nghiệm người dùng, em tập trung phát triển kỹ năng xây dựng giao diện chuẩn responsive với HTML5, CSS Grid/Flexbox, JavaScript và hiện thực hóa thiết kế từ Figma. Điểm mạnh của em là tư duy logic mạch lạc, khả năng tự học công nghệ mới nhanh và sự tỉ mỉ trong từng chi tiết sản phẩm.\n\nEm đang tìm kiếm cơ hội thực tập vị trí Frontend Developer để đem sự nhiệt huyết cùng kiến thức nền tảng của mình đóng góp vào các dự án thực tế của quý công ty, đồng thời học hỏi từ các anh chị đi trước."`
    },
    linkedin: {
      title: "💼 Phiên Bản 2: LinkedIn & Hồ Sơ CV (Chuyên Nghiệp & Định Hướng)",
      text: `Xin chào, tôi là Hoàng Phúc – Sinh viên Khoa Công nghệ Thông tin, Trường Đại học Lạc Hồng (LHU), theo đuổi định hướng trở thành một Frontend Developer chuyên nghiệp.\n\n🚀 Về tôi:\nTôi đam mê việc biến các bản vẽ thiết kế trên Figma thành những giao diện web trực quan, mượt mà và tối ưu trên mọi kích thước màn hình. Nền tảng kỹ thuật chính của tôi tập trung vào lập trình web hiện đại (HTML5, CSS3/Flexbox/Grid, JavaScript) cùng việc chú trọng tối đa vào trải nghiệm người dùng (UI/UX).\n\n💡 Thế mạnh cốt lõi:\n• Tư duy logic giải quyết vấn đề mạch lạc, có khả năng phân tích và bẻ nhỏ bài toán kỹ thuật.\n• Tinh thần tự học cao, chủ động nghiên cứu các công nghệ và giải pháp mới.\n• Tinh thần làm việc nhóm trách nhiệm, cởi mở tiếp nhận phản hồi để hoàn thiện sản phẩm.\n\n🎯 Mục tiêu hiện tại:\nTôi đang tích cực tìm kiếm cơ hội Thực tập sinh Frontend Developer / Web Developer tại một môi trường doanh nghiệp năng động. Mong muốn được đem năng lượng trẻ, nền tảng học thuật vững chắc để cống hiến cho các dự án thực tiễn và phát triển chuyên môn sâu sắc.`
    },
    social: {
      title: "📱 Phiên Bản 3: Mạng Xã Hội (Facebook / Threads / Instagram)",
      text: `👋 Hello mọi người, mình là Hoàng Phúc – một bạn trẻ đang 'lăn lộn' cùng code tại Khoa CNTT, Đại học Lạc Hồng (LHU) 💻✨.\n\nHằng ngày ngoài việc làm bạn với bug và deadline, niềm vui của mình là biến những dòng code HTML/CSS tưởng chừng khô khan thành những giao diện web vừa mắt, mượt mà và thân thiện với người dùng. Mình tin rằng giao diện đẹp không chỉ để ngắm, mà là để người dùng cảm thấy tiện lợi nhất!\n\n🎯 Hiện tại mình đang chuẩn bị cho chặng đường mới: Tìm kiếm cơ hội thực tập vị trí Frontend Developer để 'thực chiến' nhiều hơn và học hỏi từ các tiền bối trong ngành.\n\nRất vui được kết nối, giao lưu học hỏi với các anh chị và các bạn có cùng đam mê công nghệ! ✨\n\n📍 Let's connect and create cool things together! 🚀`
    }
  };

  pitchTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      pitchTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetKey = tab.getAttribute('data-pitch');
      if (pitchData[targetKey]) {
        pitchScenario.textContent = pitchData[targetKey].title;
        pitchTextEl.textContent = pitchData[targetKey].text;
      }
    });
  });

  if (pitchCopyBtn) {
    pitchCopyBtn.addEventListener('click', () => {
      const textToCopy = pitchTextEl.textContent;
      navigator.clipboard.writeText(textToCopy).then(() => {
        pitchCopyBtn.classList.add('copied');
        pitchCopyBtn.innerHTML = `✓ Đã sao chép!`;
        showToast('Đã sao chép nội dung pitch vào clipboard!', 'success');

        setTimeout(() => {
          pitchCopyBtn.classList.remove('copied');
          pitchCopyBtn.innerHTML = `<span>📋 Sao chép</span>`;
        }, 2000);
      });
    });
  }

  /* ================= 7. CONTACT FORM SUBMISSION ================= */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('form-name').value.trim();
      const emailInput = document.getElementById('form-email').value.trim();
      const messageInput = document.getElementById('form-message').value.trim();

      if (!nameInput || !emailInput || !messageInput) {
        showToast('Vui lòng điền đầy đủ các thông tin bắt buộc!', 'warning');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '⏳ Đang gửi...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = '✓ Gửi thành công!';
        showToast(`Cảm ơn ${nameInput}! Hoàng Phúc đã nhận được tin nhắn và sẽ phản hồi sớm nhất.`, 'success');
        contactForm.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        }, 2500);
      }, 800);
    });
  }

  /* ================= 8. TOAST NOTIFICATION UTILITY ================= */
  function showToast(message, type = 'info') {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : ''}`;
    
    let icon = '🔔';
    if (type === 'success') icon = '✅';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Back to top click handler
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
