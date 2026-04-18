gsap.registerPlugin(ScrollTrigger);

// ─── Hero: появление имён при загрузке ─────────────────────────
const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

tl.from(".hero__name--groom", { y: 60, opacity: 0, duration: 1.2 })
  .from(".hero__ampersand",   { scale: 0, opacity: 0, duration: 0.6 }, "-=0.4")
  .from(".hero__name--bride", { y: 60, opacity: 0, duration: 1.2 }, "-=0.4")
  .from(".hero__date",        { y: 20, opacity: 0, duration: 0.8 }, "-=0.2")
  .from(".hero__scroll-hint", { opacity: 0, duration: 0.5 });

// ─── Подсказка «скролл» — пульсирует ───────────────────────────
gsap.to(".hero__scroll-hint", {
  y: 10, repeat: -1, yoyo: true, duration: 0.8, ease: "sine.inOut"
});

// ─── Детали: анимация при скролле ──────────────────────────────
gsap.from(".details__item", {
  scrollTrigger: { trigger: "#details", start: "top 75%" },
  y: 40, opacity: 0, stagger: 0.2, duration: 0.9, ease: "power2.out"
});

// ─── RSVP форма ─────────────────────────────────────────────────
gsap.from("#rsvp", {
  scrollTrigger: { trigger: "#rsvp", start: "top 80%" },
  y: 50, opacity: 0, duration: 1
});

// ─── Отправка формы (fetch + обработка ошибок) ──────────────────
document.getElementById("rsvpForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = e.target.querySelector("button");
  btn.disabled = true;
  btn.textContent = "Отправляем...";

  const formData = new FormData(e.target);
  const payload = {
    name: formData.get("name"),
    phone: formData.get("phone") || null,
    guests_count: parseInt(formData.get("guests_count")),
    status: formData.get("status"),
    message: formData.get("message") || null,
  };

  try {
    const res = await fetch("/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      gsap.to("#rsvpForm", { opacity: 0, y: -20, duration: 0.5, onComplete: () => {
        document.getElementById("rsvpForm").style.display = "none";
        const success = document.getElementById("rsvpSuccess");
        success.style.display = "block";
        gsap.from(success, { opacity: 0, y: 20, duration: 0.6 });
      }});
    } else {
      const err = await res.json();
      alert(err.detail || "Что-то пошло не так");
      btn.disabled = false;
      btn.textContent = "Отправить";
    }
  } catch {
    alert("Ошибка сети, попробуйте позже");
    btn.disabled = false;
    btn.textContent = "Отправить";
  }
});