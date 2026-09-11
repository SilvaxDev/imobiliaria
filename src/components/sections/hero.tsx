"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { ensureGsapRegistered, gsap, ScrollTrigger } from "@/lib/animation/gsap";
import { useReducedMotion } from "@/lib/animation/use-reduced-motion";
import { DURATION, EASE, STAGGER } from "@/lib/animation/motion-tokens";
import { ScrollCue } from "@/components/ui/scroll-cue";

const HEADLINE_LINES = ["Encontre o espaço", "para a próxima fase", "da sua história."];

const HERO_IMAGE = "/images/hero/hero-desktop.png";
const HERO_VIDEO = "/videos/hero/hero-desktop.mp4";

// Quantas "telas" de scroll o vídeo leva para percorrer sua duração inteira
// enquanto o Hero fica pinado. Mobile usa uma distância menor.
const SCRUB_SCREENS_DESKTOP = 2.2;
const SCRUB_SCREENS_MOBILE = 1.4;

// Janelas [início, fim] (em progresso 0–1 do scrub) em que cada frase
// aparece. TODO(copy): "Cada endereço carrega uma decisão." e o fecho
// "Central Imóveis. Desde 1996." são rascunho meu para preencher o
// restante do scrub — troque pelo texto definitivo quando aprovado.
const CAPTION_BEATS = {
  intro: { start: 0, end: 0.26 },
  mid: { start: 0.38, end: 0.62 },
  close: { start: 0.74, end: 1 },
};

function mapRange(inMin: number, inMax: number, outMin: number, outMax: number, value: number) {
  const t = (value - inMin) / (inMax - inMin);
  return outMin + t * (outMax - outMin);
}

/** Opacidade de uma "frase" ao longo do progresso do scrub: 0 fora da
 * janela [start, end], 1 dentro dela, com uma curta rampa de entrada/saída
 * (`fade`) para não cortar seco. */
function beatOpacity(progress: number, start: number, end: number, fade = 0.06) {
  if (progress <= start - fade) return 0;
  if (progress < start) return mapRange(start - fade, start, 0, 1, progress);
  if (progress <= end) return 1;
  if (progress < end + fade) return mapRange(end, end + fade, 1, 0, progress);
  return 0;
}

/**
 * Hero fullscreen — abre limpo e parado (o vídeo nasce no frame 0, sem
 * autoplay) e só avança conforme o usuário rola: o Hero fica pinado numa
 * faixa de scroll e o `currentTime` do vídeo é amarrado ao progresso dessa
 * faixa via ScrollTrigger com `scrub`. Três frases (`CAPTION_BEATS`) se
 * revezam ao longo do percurso, sincronizadas com o mesmo progresso.
 *
 * O vídeo é pré-carregado por completo como Blob antes do scrub ser
 * liberado — `preload="auto"` sozinho não garante que a posição pedida já
 * esteja baixada, e buscar (`currentTime =`) além do buffer trava a
 * imagem até a rede entregar mais dados (era exatamente o travamento na
 * metade do vídeo). Com o arquivo inteiro em memória, qualquer busca é
 * instantânea, sem depender de rede.
 *
 * Em `prefers-reduced-motion`: sem pin, sem scrub — só a foto/poster
 * estática e a primeira frase, direto no estado final.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const lineRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const cueRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const introBeatRef = useRef<HTMLDivElement>(null);
  const midBeatRef = useRef<HTMLDivElement>(null);
  const closeBeatRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const reducedMotion = useReducedMotion();

  // Pré-carrega o vídeo inteiro como Blob (ver nota no topo do arquivo).
  useEffect(() => {
    if (reducedMotion) return;
    const video = videoRef.current;
    if (!video) return;

    let objectUrl: string | null = null;
    let cancelled = false;

    fetch(HERO_VIDEO)
      .then((res) => res.blob())
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        video.src = objectUrl;
      })
      .catch(() => {
        // Falha ao pré-carregar via blob (ex.: sem rede) — o vídeo fica no
        // poster estático; nenhum scrub é ativado.
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [reducedMotion]);

  useLayoutEffect(() => {
    ensureGsapRegistered();
    if (!sectionRef.current) return;

    const video = videoRef.current;
    let onLoadedMetadata: (() => void) | null = null;

    const ctx = gsap.context(() => {
      const introTargets = [eyebrowRef.current, ...lineRefs.current];

      if (reducedMotion) {
        gsap.set(introTargets, { opacity: 1, y: 0, yPercent: 0 });
        gsap.set(cueRef.current, { opacity: 1 });
        gsap.set(bgRef.current, { scale: 1 });
        gsap.set(formRef.current, { opacity: 1, y: 0 });
        return;
      }

      // --- Entrada cinematográfica (roda uma vez, ao montar) ---
      gsap.set(bgRef.current, { scale: 1.12 });

      const tl = gsap.timeline({ defaults: { ease: EASE.reveal } });

      tl.to(bgRef.current, { scale: 1, duration: DURATION.slow * 1.6, ease: EASE.inOut }, 0)
        .fromTo(
          overlayRef.current,
          { opacity: 0.92 },
          { opacity: 1, duration: DURATION.slow, ease: EASE.inOut },
          0,
        )
        .fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: DURATION.base },
          0.5,
        )
        .fromTo(
          lineRefs.current,
          { yPercent: 110 },
          { yPercent: 0, duration: DURATION.slow, stagger: STAGGER.base },
          0.65,
        )
        .fromTo(cueRef.current, { opacity: 0 }, { opacity: 1, duration: DURATION.base }, "-=0.5")
        .fromTo(
          formRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: DURATION.base },
          "-=0.6",
        );

      gsap.to(cueRef.current, {
        y: 8,
        duration: 1.4,
        ease: EASE.inOut,
        repeat: -1,
        yoyo: true,
        delay: 2.2,
      });

      // --- Vídeo + frases amarrados ao scroll ---
      if (!video) return;

      let introDone = false;
      tl.eventCallback("onComplete", () => {
        introDone = true;
      });

      // `duration` chega de forma assíncrona (metadados do vídeo/blob) —
      // mas o pin abaixo é criado já, de forma síncrona, para não deslocar
      // o layout (e as posições de outros ScrollTriggers, como os do
      // Manifesto) depois que a página já estabilizou.
      const durationRef = { current: 0 };
      let lastProgress = 0;

      onLoadedMetadata = () => {
        durationRef.current = video.duration || 0;
        // "Prime" o decoder — em alguns navegadores mobile (Safari/iOS em
        // especial) currentTime só passa a renderizar frame a frame depois
        // de um play() real, mesmo que pausado no instante seguinte.
        video.play().then(() => video.pause()).catch(() => {});
        if (durationRef.current) {
          video.currentTime = lastProgress * durationRef.current;
        }
      };
      video.addEventListener("loadedmetadata", onLoadedMetadata);
      if (video.readyState >= 1) onLoadedMetadata();

      let seekQueued = false;
      const seekTo = (time: number) => {
        if (seekQueued) return;
        seekQueued = true;
        requestAnimationFrame(() => {
          if (Math.abs(video.currentTime - time) > 0.01) {
            video.currentTime = time;
          }
          seekQueued = false;
        });
      };

      const screens = window.innerWidth < 768 ? SCRUB_SCREENS_MOBILE : SCRUB_SCREENS_DESKTOP;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${screens * 100}%`,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          lastProgress = self.progress;
          if (durationRef.current) seekTo(self.progress * durationRef.current);

          if (!introDone) return;
          gsap.set(introBeatRef.current, {
            opacity: beatOpacity(self.progress, CAPTION_BEATS.intro.start, CAPTION_BEATS.intro.end),
          });
          gsap.set(midBeatRef.current, {
            opacity: beatOpacity(self.progress, CAPTION_BEATS.mid.start, CAPTION_BEATS.mid.end),
          });
          gsap.set(closeBeatRef.current, {
            opacity: beatOpacity(self.progress, CAPTION_BEATS.close.start, CAPTION_BEATS.close.end),
          });
          gsap.set(cueRef.current, { opacity: self.progress < 0.03 ? 1 : 0 });
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      if (video && onLoadedMetadata) {
        video.removeEventListener("loadedmetadata", onLoadedMetadata);
      }
    };
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative flex h-svh min-h-160 w-full items-end overflow-hidden bg-ink"
      aria-label="Central Imóveis"
    >
      <div ref={bgRef} className="absolute inset-0 will-change-transform">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          playsInline
          poster={HERO_IMAGE}
          aria-hidden="true"
        />
      </div>

      <div
        ref={overlayRef}
        className="absolute inset-0 bg-linear-to-t from-ink via-ink/55 to-ink/10"
      />

      <div className="relative z-10 w-full px-6 pb-16 md:px-10 md:pb-24">
        <div className="relative mx-auto max-w-[1600px]">
          <div ref={introBeatRef}>
            <span
              ref={eyebrowRef}
              className="mb-6 block text-xs tracking-[0.35em] text-gold uppercase"
            >
              Central Imóveis
            </span>

            <h1 className="max-w-4xl font-display text-[clamp(2.75rem,7vw,7rem)] leading-[0.98] font-normal text-paper">
              {HEADLINE_LINES.map((line, i) => (
                <span key={line} className="block overflow-hidden">
                  <span
                    ref={(el) => {
                      lineRefs.current[i] = el;
                    }}
                    className="block"
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h1>
          </div>

          <div ref={midBeatRef} className="absolute inset-x-0 bottom-0 opacity-0">
            <p className="max-w-3xl font-display text-[clamp(2rem,5vw,4.5rem)] leading-[1.05] font-normal text-paper">
              Cada endereço
              <br />
              carrega uma decisão.
            </p>
          </div>

          <div ref={closeBeatRef} className="absolute inset-x-0 bottom-0 opacity-0">
            <p className="max-w-3xl font-display text-[clamp(2rem,5vw,4.5rem)] leading-[1.05] font-normal text-paper">
              Central Imóveis.
              <br />
              Desde 1996.
            </p>
          </div>
        </div>
      </div>

      {/*
        Wrapper cuida do posicionamento (CSS puro: centralizado, com teto de
        altura + scroll interno em viewports baixos). O GSAP anima só o
        <form> de dentro — se animasse este wrapper, o `y` do GSAP
        substituiria o `-translate-y-1/2` do Tailwind (ambos mexem em
        `transform`) e quebraria a centralização.
      */}
      <div className="absolute top-1/2 right-6 z-10 hidden max-h-[calc(100svh-3rem)] w-full max-w-[340px] -translate-y-1/2 overflow-y-auto lg:block xl:right-10 xl:max-w-[380px]">
        <form
          ref={formRef}
          onSubmit={(e) => e.preventDefault()}
          aria-label="Cadastro para atendimento exclusivo"
          className="border border-line-dark bg-ink/85 p-6 xl:p-7"
        >
          <p className="font-display text-lg leading-snug text-paper">
            Cadastre-se para um atendimento exclusivo
          </p>

          <div className="mt-6 flex flex-col gap-4">
            <HeroFormField label="Nome" type="text" name="nome" placeholder="Digite seu nome" />
            <HeroFormField label="E-mail" type="email" name="email" placeholder="exemplo@email.com" />
            <HeroFormField label="Telefone" type="tel" name="telefone" placeholder="(11) 00000-0000" />

            <label className="block">
              <span className="block text-xs tracking-[0.2em] text-muted-dark uppercase">
                Preferência de contato
              </span>
              <select
                name="preferencia"
                defaultValue="whatsapp"
                className="mt-2 w-full border-b border-line-dark bg-transparent py-2 text-sm text-paper outline-none focus-visible:border-gold"
              >
                <option className="bg-ink" value="whatsapp">
                  WhatsApp
                </option>
                <option className="bg-ink" value="telefone">
                  Telefone
                </option>
                <option className="bg-ink" value="email">
                  E-mail
                </option>
              </select>
            </label>
          </div>

          <button
            type="submit"
            className="mt-6 w-full border border-gold px-6 py-3 text-xs tracking-[0.25em] text-gold uppercase transition-colors hover:bg-gold hover:text-ink"
          >
            Enviar mensagem
          </button>
        </form>
      </div>

      <div className="absolute right-6 bottom-10 z-10 md:right-10">
        <ScrollCue ref={cueRef} />
      </div>
    </section>
  );
}

/**
 * Campo do formulário de contato do Hero — protótipo visual, não envia
 * dados a lugar nenhum (ver `onSubmit` no `<form>` acima). Sublinhado fino
 * em vez de input "caixa", para não fugir do vocabulário editorial do
 * resto do site.
 */
function HeroFormField({
  label,
  type,
  name,
  placeholder,
}: {
  label: string;
  type: string;
  name: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs tracking-[0.2em] text-muted-dark uppercase">{label}</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="mt-2 w-full border-b border-line-dark bg-transparent py-2 text-sm text-paper placeholder:text-muted-dark outline-none focus-visible:border-gold"
      />
    </label>
  );
}
