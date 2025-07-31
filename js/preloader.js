document.fonts.ready.then(() => {
  gsap.registerPlugin(ScrollTrigger, SplitText, CSSRulePlugin, Flip);

  // 1) Разбиваем заголовок прелоадера на символы и слова
  let split = SplitText.create(".preloader__title", {
    type: "chars, words"
  });

  // 2) Анимация текста прелоадера (бесконечный yoyo)
  let preloader = gsap.from(split.chars, {
    yPercent: "random(100, 30)",
    rotation: "random(-30, 30)",
    ease: "back.out",
    duration: 1,
    autoAlpha: 0,
    repeat: -1,
    yoyo: true,
    stagger: {
      amount: 0.5,
      from: "random"
    }
  });

  // 3) Сдвиг фигур за текстом
  let person = gsap.from(".preloader__persons", {
    xPercent: -100,
    duration: 0.5,
    ease: "power3.out",
    delay: 1
  });

  // 4) Спрайтовая анимация охотника
  const hunter = document.querySelector(".preloader__hunter");
  let frame = 1;
  const preloadStart = Date.now();
  const spriteInterval = setInterval(() => {
    frame = frame < 9 ? frame + 1 : 1;
    hunter.setAttribute(
      "src",
      `assets/images/hunter/run-right/Male_1_Run${frame}.png`
    );
  }, 300);
  setTimeout(() => clearInterval(spriteInterval), 2000);

  // 5) Линейка прогресса загрузки картинок
  const preloadTL = gsap.timeline({ paused: true })
    .to(".preloader__persons", { left: "100%", ease: "power3.out", duration: 1 });

  const imgLoad = imagesLoaded(document.body);
  const totalImgs = imgLoad.images.length;

  imgLoad.on("progress", instance => {
    preloadTL.progress(instance.progressedCount / totalImgs);
  });

  // 6) Когда всё загрузилось, скрываем прелоадер
  imgLoad.on("always", () => {
    const wait = 3000 - (Date.now() - preloadStart);
    setTimeout(() => {
      const beforeRule = CSSRulePlugin.getRule(".preloader::before");
      const afterRule  = CSSRulePlugin.getRule(".preloader::after");

      const hideTL = gsap.timeline({
        onComplete() {
          setTimeout(() => {
            document.querySelector(".preloader").remove();
          }, 1000);
        }
      });

      hideTL
        .to(".preloader__persons", { xPercent: 100 })
        .to(".preloader__persons", { display: "none" })
        .to(".preloader__subtext", { y: "100vh", duration: 1 })
        .to(afterRule,  { cssRule: { transform: "translateY(100%)" }, duration: 1 }, 0.8)
        .to(beforeRule, { cssRule: { transform: "translateY(-100%)" }, duration: 1 }, 0.8);

      // Переносим элементы в DOM и превращаем сплит‑текст в заголовке
      const header = document.querySelector("header");
      const title  = document.querySelector(".preloader__title");
      const state  = Flip.getState(title);

      document.querySelector(".fq4").appendChild(hunter);
      header.appendChild(title);

      Flip.from(state, {
        duration: 1,
        ease: "power3.out",
        scale: true,
      });

      // Останавливаем бесконечный preloader
      preloader.pause();

      // Финальная анимация текста заголовка
      gsap.to(split.chars, {
        yPercent: 0,
        rotation: 0,
        ease: "back.out",
        duration: 0.5,
        fontSize: "var(--medium-offset)",
        autoAlpha: 1,
        stagger: { amount: 0.5, from: "random" },
      });
    }, Math.max(0, wait));
  });
});
  const hunter = document.querySelector(".preloader__hunter")
  let frame = 1
  const preloadStart = Date.now();
  setInterval(() => {
    frame = frame < 9 ? frame + 1 : 1;
    hunter.setAttribute(
      "src",
      `assets/images/hunter/run-right/Male_1_Run${frame}.png`
    );
    frame++
  }, 300)