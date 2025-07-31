const lenis = new Lenis({
  duration: 2,
  // вот «математика» easing: при t===1 сразу =1, иначе экспоненциальный выход
  easing: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),  // :contentReference[oaicite:0]{index=0}
  direction: 'vertical',
  gestureDirection: 'vertical',
  smoothWheel: true,
  smoothTouch: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);


const profile = document.querySelector(".profile")

async function fetchMe() {
  try {
    const res = await fetch("/api/users/me", {
      credentials: "include",
    });
    if (!res.ok) throw new Error(res.status);

    const user = await res.json();

    const mails = Array.isArray(user.mails) ? user.mails : [];
    const newMailCount = mails.filter(
      (m) => (m.isNew || String(m.type || "").toLowerCase() === "new")
    ).length;

    // NEW: универсальная функция, кидает все письма в контейнер, если он есть
    function renderMailsTo(containerSelector, mailsArr) {
      const box = document.querySelector(containerSelector);
      if (!box) return;                 // нет контейнера — выходим тихо

      box.innerHTML = "";               // очистка
      if (!mailsArr.length) {
        box.innerHTML = '<div class="mailList__empty">Сообщений нет</div>';
        return;
      }

      const frag = document.createDocumentFragment();
      mailsArr.forEach((m) => {
        const isNew = String(m.type || "").toLowerCase() === "new";

        const item = document.createElement("div");
        item.className = `mailList__item pointer ${isNew ? "mailList__new" : "mailList__old"}`;
        item.onclick = async () => {
          document.querySelector(".message").classList.add("open--message");
          document.getElementById("title").innerText = "Сообщение от администрации";
          document.getElementById("time").innerText = new Date(m.createdAt).toLocaleString("ru-RU");
          document.getElementById("text").innerText = m.text;
          document.body.style.overflow = "hidden !important";
          mailBox.classList.toggle("open1");
          item.classList.add("mailList__old")
          item.classList.remove("mailList__new")
          await fetch(`http://dev.local:1337/api/mails/${m.id}/mark-old`, {
            method: "PATCH",
            credentials: "include",
          });

          const idx = mails.findIndex((mail) => mail.id === m.id);
          if (idx !== -1) mails.splice(idx, 1);

          const newCount = mails.filter(
            (mm) => (mm.isNew || String(mm.type || "").toLowerCase() === "new")
          ).length;

          openMailLink.innerHTML = `Почта ${newCount > 0
            ? `<span style="color:red; font-weight:600;">( ${newCount} )</span>`
            : ""
            }`;

        };
        const title = document.createElement("div");
        title.className = "mailList__title";
        title.textContent = "Сообщение от администрации";

        const time = document.createElement("time");
        time.className = "mailList__time";
        if (m.createdAt) {
          time.dateTime = m.createdAt;
          time.textContent = new Date(m.createdAt).toLocaleString("ru-RU");
        }

        item.append(title, time);
        frag.appendChild(item);
      });

      box.appendChild(frag);
    }

    // NEW: сразу после получения mails наполняем внешний контейнер (если есть)
    // поменяй "#mailList" на нужный id/селектор
    renderMailsTo("#mailList", mails);

    // --- твой существующий код ниже без изменений ---
    profile.innerHTML = `
      <div class="profile__item">
        <button class="profile__face pointer" type="button">
            <span>${user.personaName || "Без имени"}</span>
            <img src="${user.avatar}" alt="avatar">
        </button>
        <div id="mailBox" class="mailBox"></div>
        <ul class="profile__menu">
          <li class="profile__i">
              <a class="profile__link" href="#">Активности на сайте</a>
          </li>
          <li class="profile__it">
              <a class="profile__link" href="#" id="openMail">
                Почта ${newMailCount > 0
        ? `<span style="color:red; font-weight:600;">( ${newMailCount} )</span>`
        : ""
      }
              </a>
          </li>
          <li class="profile__it">
              <a class="profile__link" href="http://dev.local:1337/api/auth/logout">Выход</a>
          </li>
        </ul>
      </div>
    `;

    const mailBox = document.getElementById("mailBox");
    const item = document.querySelector(".profile__item");
    const openMailLink = document.getElementById("openMail");

    // открытие меню профиля
    document.querySelector(".profile__face").onclick = () =>
      item.classList.toggle("open");

    // наполнение писем (оставил твою логику: показываем только new)
    if (mails.length === 0) {
      mailBox.innerHTML = '<div class="mailBox__empty">Сообщений нет</div>';
    } else {
      mails.forEach((m) => {
        const isNew = m.isNew || String(m.type || "").toLowerCase() === "new";
        if (m.type !== "new") return; // как у тебя
        const div = document.createElement("div");
        div.className = `mailBox__message pointer`;
        div.innerHTML = `<h1>Сообщение от администрации</h1>
                         <h4>${new Date(m.createdAt).toLocaleString("ru-RU")}</h4>`;
        div.onclick = async () => {
          document.querySelector(".message").classList.add("open--message");
          document.getElementById("title").innerText = "Сообщение от администрации";
          document.getElementById("time").innerText = new Date(m.createdAt).toLocaleString("ru-RU");
          document.getElementById("text").innerText = m.text;
          document.body.style.overflow = "hidden !important";
          mailBox.classList.toggle("open1");

          await fetch(`http://dev.local:1337/api/mails/${m.id}/mark-old`, {
            method: "PATCH",
            credentials: "include",
          });

          const idx = mails.findIndex((mail) => mail.id === m.id);
          if (idx !== -1) mails.splice(idx, 1);

          const newCount = mails.filter(
            (mm) => (mm.isNew || String(mm.type || "").toLowerCase() === "new")
          ).length;

          openMailLink.innerHTML = `Почта ${newCount > 0
            ? `<span style="color:red; font-weight:600;">( ${newCount} )</span>`
            : ""
            }`;

          div.remove();

          // NEW: обновим внешний список (если есть), чтобы сразу исчезло/перекрасилось
          renderMailsTo("#mailList", mails);
        };
        mailBox.appendChild(div);
      });
    }

    // кнопка "посмотреть все письма"
    const a = document.createElement("a");
    a.href = "/mails.html";
    a.innerText = "Посмотреть все письма";
    mailBox.appendChild(a);

    // открыть/закрыть блок писем
    openMailLink.addEventListener("click", (e) => {
      e.preventDefault();
      mailBox.classList.toggle("open1");
      item.classList.toggle("open");
    });

    // закрытие по клику вне mailBox
    document.addEventListener("click", (e) => {
      const isClickInside =
        mailBox.contains(e.target) || openMailLink.contains(e.target);
      if (!isClickInside && mailBox.classList.contains("open1")) {
        mailBox.classList.remove("open1");
        item.classList.remove("open");
      }
    });
  } catch (e) {
    console.log(e);
  }
}

fetchMe();

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const toggle = document.querySelector(".header__toggle");
  const items = gsap.utils.toArray(".header__item");
  const menu = document.querySelector(".header__menu");
  const ico = toggle.querySelector(".fa-solid")
  const made = document.querySelector(".made-by")

  // создаём media query для max-width:550px
  const mql = window.matchMedia("(max-width: 550px)");
  let tl; // переменная для таймлайна

  // функция инициализации или очистки анимации в зависимости от ширины
  function handleMenuByWidth(e) {
    if (e.matches) {
      // < 550px — инициализируем анимацию
      menu.style.display = "none";
      // если таймлайн уже был — убиваем его, чтобы не было дубликатов
      if (tl) tl.kill();

      tl = gsap.timeline({ paused: true, reversed: true })
        .to(header, {
          height: "100vh",
          duration: 0.6,
          ease: "power2.out",
          onStart() {
            menu.style.display = "flex";
          }
        })
        .from(items, {
          x: () => gsap.utils.random(-window.innerWidth, window.innerWidth),
          y: () => gsap.utils.random(-window.innerHeight, window.innerHeight),
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.2)"
        }, "-=0.3");
    } else {
      // ≥ 550px — показываем меню и сбрасываем стили
      if (tl) tl.kill();
      header.style.height = "";    // сбрасываем inline-height
      menu.style.display = "flex";
    }
  }

  // вешаем слушатель на изменения ширины
  mql.addListener(handleMenuByWidth);
  // вызываем один раз при загрузке
  handleMenuByWidth(mql);

  document.querySelectorAll(".header__link").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();

      // иконка гамбургера
      ico.classList.toggle("fa-xmark");
      ico.classList.toggle("fa-bars-staggered");
      made.classList.toggle("hidden");
      if (tl) tl.reversed() ? tl.play() : tl.reverse();

      const href = link.getAttribute("href"); // может быть "/index.html#about" или "#about"
      const [path, hash] = href.split('#');

      // если путь ведёт на другую страницу — переходим
      if (path && path !== window.location.pathname) {
        window.location.href = href;
        return;
      }

      // иначе скроллим внутри текущей страницы
      if (hash) {
        const target = document.getElementById(hash);
        if (target) {
          lenis.scrollTo(target, { offset: -20 });
          // обновляем ScrollTrigger после скролла
          ScrollTrigger.refresh();
        }
      }
    });
  });

  // клик «гамбургера»
  toggle.addEventListener("click", () => {
    // только если <550px
    if (!mql.matches || !tl) return;
    ico.classList.toggle("fa-xmark")
    ico.classList.toggle("fa-bars-staggered")
    made.classList.toggle("hidden")

    tl.reversed() ? tl.play() : tl.reverse();
  });
});

function closeMessage() {
  document.querySelector(".message").classList.remove("open--message")
}

function scrollToHash() {
  const hash = window.location.hash;
  if (!hash) return;
  const id = hash.slice(1);
  const target = document.getElementById(id);
  if (target) {
    ScrollTrigger.refresh();
    lenis.scrollTo(target, { offset: -20 });
  }
}



// 3) Обработка кликов и прямой заход по хешу
document.addEventListener('DOMContentLoaded', () => {
  scrollToHash();
  history.scrollRestoration = 'manual';

  const toggle = document.querySelector(".header__toggle");
  const ico = toggle.querySelector(".fa-solid");
  const made = document.querySelector(".made-by");
  // tl и handleMenuByWidth у вас уже инициализированы выше

  document.querySelectorAll(".header__link").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();

      ico.classList.toggle("fa-xmark");
      ico.classList.toggle("fa-bars-staggered");
      made.classList.toggle("hidden");
      if (tl) tl.reversed() ? tl.play() : tl.reverse();

      const [path, hash] = link.getAttribute("href").split("#");
      if (hash && path === window.location.pathname) {
        const el = document.getElementById(hash);
        if (el) {
          lenis.scrollTo(el, { offset: -20 });
          ScrollTrigger.refresh();
        }
      } else if (path && path !== window.location.pathname) {
        window.location.href = `${path}#${hash}`;
      }
    });
  });

  window.addEventListener("load", scrollToHash);

  // когда анимации и ScrollTrigger инициализированы (см. animation.js)
  window.addEventListener('animationsReady', scrollToHash);
});
