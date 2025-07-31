
document.fonts.ready.then(() => {
  gsap.registerPlugin(ScrollTrigger, SplitText, CSSRulePlugin, Flip)

  let split = SplitText.create(".preloader__title", {
    type: "chars, words"
  })

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
  })


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
  setTimeout(() => { clearInterval() }, 2000)
  setTimeout(() => {
    const header = document.querySelector("header");
    const title = document.querySelector(".preloader__title");
    const state = Flip.getState(title);

    const preloadTL = gsap.timeline({ paused: true })
      .to(".preloader__persons", { left: "100%", ease: "power3.out", duration: 1 });

    const imgLoad = imagesLoaded(document.body);
    const totalImgs = imgLoad.images.length;

    imgLoad.on("progress", instance => {
      preloadTL.progress(instance.progressedCount / totalImgs);
    });

    imgLoad.on("always", () => {
      const wait = 3000 - (Date.now() - preloadStart);
      setTimeout(() => {
        // анимируем скрытие
        const beforeRule = CSSRulePlugin.getRule(".preloader::before");
        const afterRule = CSSRulePlugin.getRule(".preloader::after");

        const hideTL = gsap.timeline({})
        hideTL
          .to(".preloader__persons", { xPercent: 100 })
          .to(".preloader__persons", { display: "none" })
          .to(".preloader__subtext", { y: "100vh", duration: 1 })
          .to(afterRule, { cssRule: { transform: "translateY(100%)" }, duration: 1 }, 0.8)
          .to(beforeRule, { cssRule: { transform: "translateY(-100%)" }, duration: 1 }, 0.8)
          .to(".preloader", { display: "none" })
        document.querySelector(".fq4").appendChild(hunter)
        header.appendChild(title);
        Flip.from(state, {
          duration: 1,
          ease: "power3.out",
          scale: true,
        });
        preloader.pause()
        // текст‑анимация
        gsap.to(split.chars, {
          yPercent: 0,
          rotation: 0,
          ease: "back.out",
          duration: 0.5,
          fontSize: "var(--medium-offset)",
          autoAlpha: 1,
          stagger: { amount: 0.5, from: "random" },
        });
        // Разбиваем текст на символы
        const split4 = new SplitType(".about__text", { types: "words, chars" });

        // Анимируем каждую букву
        gsap.timeline(
          {
            duration: 4,
            scrollTrigger: {
              trigger: ".about",
              start: "top top",
              end: "bottom top",
              scrub: true,
              pin: ".about__text",
              pinSpacing: false
            }
          }
        ).from(split4.chars, {
          autoAlpha: 0,
          yPercent: "random(100, 30)",
          rotation: "random(-30, 30)",
          ease: "back.out",
          stagger: 0.01,

        }).from(".about__bloob--01", { autoAlpha: 0, duration: 1.6, scale: 0.5, ease: "back.out" }, 2)
          .from(".about__bloob--02", { autoAlpha: 0, duration: 1.6, scale: 0.5, ease: "back.out" }, 3.5)
          .from(".about__bloob--05", { autoAlpha: 0, duration: 1.6, scale: 0.5, ease: "back.out" }, 3.5)
          .from(".about__bloob--03", { autoAlpha: 0, duration: 1.6, scale: 0.5, ease: "back.out" }, 3.5)
          .from(".about__bloob--04", { autoAlpha: 0, duration: 1.6, scale: 0.5, ease: "back.out" }, 3.5)

      }, Math.max(0, wait));

      gsap.from(".header", { y: -100, autoAlpha: 0, duration: 0.5, ease: "power3.out", delay: 3.7 })
      setTimeout(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".firstscreen__wrapper",
            start: "top center",           // как только .wrapper полностью вошёл в верх экрана
            end: "bottom center",        // до тех пор, пока нижняя грань .wrapper не достигнет верха окна
            toggleActions: "play reverse play reverse"
          }
        });

        tl
          // 1) Появление обёртки
          .from(".firstscreen__wrapper", {
            duration: 2,
            opacity: 0,
            x: 100,
            ease: "back.inOut"
          })

          // 2) Сбрасываем текст
          .set([".l01", ".l02"], { text: "" })

          // 3) l01 → “HIDE!”
          .to(".l01", {
            duration: 0.3,
            scrambleText: { text: "HIDE!", chars: "abcdefghijklmnopqrstuvwxyz", speed: 0.3 }
          })

          // 4) l02 → “HIDE!”
          .to(".l02", {
            duration: 0.3,
            scrambleText: { text: "HIDE!", chars: "abcdefghijklmnopqrstuvwxyz", speed: 0.3 }
          }, "+=0.2")

          // 5) l01 → “Hide”
          .to(".l01", {
            duration: 0.3,
            scrambleText: { text: "Hide", chars: "abcdefghijklmnopqrstuvwxyz", speed: 0.3 }
          }, "+=0.5")

          // 6) l02 → “Zone”
          .to(".l02", {
            duration: 0.3,
            scrambleText: { text: "Zone", chars: "abcdefghijklmnopqrstuvwxyz", speed: 0.3 }
          }, "+=0.2")

          .from(".firstscreen__subtext", { y: 100, duration: .5, autoAlpha: 0, ease: "back.out" })
      }, 2000)
    });
  }, 1500);

  const scrollSection = document.querySelector('.scroll');
  const mainScroll = document.querySelector('.main__scroll');
  // вычисляем, на сколько нужно сдвинуть блок по X:
  const totalX = mainScroll.scrollWidth - window.innerWidth;
  let split1 = new SplitText(".ta01", { type: "chars, words" });
  let split2 = new SplitText(".ta02 span", { type: "chars, words" });
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: scrollSection,
      start: 'top top',
      end: () => `+=${totalX}`,
      scrub: true,
      pin: true
    }
  });

  tl.to(mainScroll, {
    x: -totalX,
    ease: 'none',
    duration: 3.5
  }, 0);

  tl.from(".h01", {
    y: 100, x: -100, autoAlpha: 0, duration: 0.2, ease: "back.out"
  }, 0);

  tl.from(".b01", {
    y: -100, x: -100, autoAlpha: 0, duration: 0.2, ease: "back.out"
  }, 0.05);

  tl.from(split1.chars, {
    yPercent: "random(100, 30)",
    rotation: "random(-30, 30)",
    ease: "back.out",
    duration: 0.2,
    autoAlpha: 0,
    stagger: {
      amount: 0.1,
      from: "random"
    }
  }, 0);
  tl.to(".ta01", { autoAlpha: 0, y: 100, duration: 0.1, ease: "back.out" }, 1);

  tl.from(".h02", { x: -200, y: 80, autoAlpha: 0, duration: 0.2, ease: "back.out" }, 1.3)
  tl.from(".b02", { autoAlpha: 0, duration: 0.3, ease: "back.out" }, 1.3)
  tl.from(".ta02 h1", { autoAlpha: 0, duration: 0.3, ease: "back.out", x: 300 }, 1.3)
  tl.from(split2.chars, {
    autoAlpha: 0, duration: 0.3, ease: "back.out", y: 300, stagger: {
      amount: 0.1,
      from: "random"
    }
  }, 1.3)


  tl.to(".ta02 h1", { autoAlpha: 0, duration: 0.2, ease: "back.out", x: -300 }, 2.2)
  tl.to(".ta02 span", {
    y: -200, duration: 0.2, ease: "back.out", autoAlpha: 0
  }, 2.2)

  tl.from(".ta03 h1", { duration: 0.2, ease: "back.out", x: 300, autoAlpha: 0 }, 2.3)
  tl.from(".ta03 span", { duration: 0.2, ease: "back.out", x: -300, autoAlpha: 0 }, 2.3)
  // стартует в начале (0%)

  // 2) Появление текста в 33% прогресса (0.33 секунды от общей длительности)


  gsap.registerPlugin(ScrambleTextPlugin);

  document.querySelectorAll(".link-anim").forEach(el => {
    const originalText = el.textContent;

    let hoverTl;

    el.addEventListener("mouseenter", () => {
      // Если уже запущен предыдущий – убиваем
      if (hoverTl) hoverTl.kill();

      hoverTl = gsap.timeline()
        // 1) быстро скремблим в HIDE!HIDE!
        .to(el, {
          duration: 0.4,
          scrambleText: {
            text: "HIDE! HIDE!",
            chars: "HIDE!",
            speed: 0.5,
            delimiter: ""
          }
        })
        // 2) ждем 1 секунду, потом возвращаем исходник
        .to(el, {
          duration: 0.4,
          delay: .7,
          scrambleText: {
            text: originalText,
            chars: "HIDE!",
            speed: 0.5,
            delimiter: ""
          }
        });
    });
  });
  const layers = [
    { selector: ".d02", factor: 40 },  // самый медленный фон
    { selector: ".d04", factor: 30 },  // лестница чуть быстрее
    { selector: ".d01", factor: 20 },  // передний план ещё быстрее
    { selector: ".d03", factor: 10 },  // самый быстрый слой
  ];
  if (window.innerWidth > 1280) {
    function updateParallax({ clientX, clientY }) {
      const x = clientX - window.innerWidth / 2;
      const y = clientY - window.innerHeight / 2;

      layers.forEach(({ selector, factor }) => {
        gsap.to(selector, {
          x: x / factor,
          y: y / factor,
          ease: "back.out(1.7)",
          duration: 1,
        });
      });
    }

    // Реагируем на движение мыши
    window.addEventListener("mousemove", updateParallax);

    // При загрузке документа делаем первый прогон с центром экрана
    window.addEventListener("DOMContentLoaded", () => {
      updateParallax({
        clientX: window.innerWidth,
        clientY: window.innerHeight
      });
    });
  }
  else {
    gsap.set(".d04", { top: "55%" })
    gsap.set(".d03", { top: "75%", left: "35%" })
    gsap.set(".d01", { top: "65%" })
  }
  gsap.from(".block-title", {
    x: -200,
    autoAlpha: 0,
    duration: 0.6,
    ease: "power3.out",
    scrollTrigger: {
      start: "top top",        // когда заголовок коснётся верха viewport
      end: "bottom top",       // пока он полностью не уйдёт наверх
      toggleActions: "play reverse play reverse"
      // play  — при входе
      // reverse — при выходе назад
    }
  });

  // 2. Анимация каждого скрина в галерее
  gsap.utils.toArray(".gallery img").forEach(img => {
    gsap.from(img, {
      y: 50,
      autoAlpha: 0,
      duration: 0.4,
      ease: "power2.out",
      scrollTrigger: {
        trigger: img,
        start: "top 90%",      // когда верх картинки на 90% высоты viewport
        end: "bottom 10%",     // когда низ картинки дойдёт до 10% сверху
        toggleActions: "play reverse play reverse"
      }
    });
  });

  // все анимации и ScrollTrigger'ы инициализированы
  ScrollTrigger.refresh();
  window.dispatchEvent(new Event('animationsReady'));

});


