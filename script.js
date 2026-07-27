const menuToggle = document.querySelector(".menu-toggle");
const menuBar = document.querySelector(".menu-bar");
const header = document.querySelector("header");
const revealTargets = document.querySelectorAll(
    ".headline, .supporting-text, .home-actions, .home-grid, .page-hero, .section-heading, .feature-card, .service-card, .portfolio-card, .value-card, .stat-card, .page-actions, .hero-actions, .instagram-feed-section, .instagram-card"
);
const instagramFeedGrid = document.querySelector("#instagram-feed-grid");
const fallbackInstagramFeed = [
    { url: "https://www.instagram.com/p/DbQeixMOgJd/", title: "Brand rollout" },
    { url: "https://www.instagram.com/p/DbDZ3sWRILB/", title: "Lead generation" },
    { url: "https://www.instagram.com/p/DXwPOdtxmZB/", title: "Website content" },
    { url: "https://www.instagram.com/p/DXHB5UfE00n/", title: "Paid ads" },
    { url: "https://www.instagram.com/p/DaXmdzQRRbw/", title: "Creative direction" },
    { url: "https://www.instagram.com/p/DZfAGl8TZkB/", title: "Social media" },
    { url: "https://www.instagram.com/p/DW6LCi7ksxh/", title: "Marketing strategy" },
    { url: "https://www.instagram.com/p/DWLzJTkkSlP/", title: "Performance launch" },
];

if (menuToggle && menuBar && header) {
    const menuIcon = menuToggle.querySelector("i");

    menuToggle.addEventListener("click", () => {
        menuBar.classList.toggle("active");

        if(menuBar.classList.contains("active")){
            menuIcon.classList.remove("fa-bars-staggered");
            menuIcon.classList.add("fa-xmark");
        }else{
            menuIcon.classList.remove("fa-xmark");
            menuIcon.classList.add("fa-bars-staggered");
        }
    });

    menuBar.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            if (!menuBar.classList.contains("active")) {
                return;
            }

            menuBar.classList.remove("active");
            menuIcon.classList.remove("fa-xmark");
            menuIcon.classList.add("fa-bars-staggered");
        });
    });

    let lastScroll = 0;

    window.addEventListener("scroll", () => {

        if(menuBar.classList.contains("active")) return;

        const currentScroll = window.pageYOffset;

        if(currentScroll <= 0){
            header.classList.remove("hide");
            return;
        }

        if(currentScroll > lastScroll){
            header.classList.add("hide");
        }else{
            header.classList.remove("hide");
        }

        lastScroll = currentScroll;
    });
}

if (revealTargets.length > 0) {
    revealTargets.forEach((element, index) => {
        element.classList.add("scroll-reveal");
        element.style.setProperty("--reveal-delay", `${Math.min(index * 60, 360)}ms`);
    });

    const observer = new IntersectionObserver(
        (entries, observerInstance) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                observerInstance.unobserve(entry.target);
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -4% 0px",
        }
    );

    revealTargets.forEach((element) => observer.observe(element));
}

if (instagramFeedGrid) {
    const feedUrl = instagramFeedGrid.dataset.feedUrl;
    let instagramScriptPromise = null;

    const loadInstagramScript = () => {
        if (window.instgrm && window.instgrm.Embeds) {
            return Promise.resolve();
        }

        if (instagramScriptPromise) {
            return instagramScriptPromise;
        }

        instagramScriptPromise = new Promise((resolve, reject) => {
            const existingScript = document.querySelector('script[data-instagram-embed]');

            if (existingScript) {
                existingScript.addEventListener("load", () => resolve(), { once: true });
                existingScript.addEventListener("error", () => reject(), { once: true });
                return;
            }

            const script = document.createElement("script");
            script.async = true;
            script.src = "https://www.instagram.com/embed.js";
            script.dataset.instagramEmbed = "true";
            script.onload = () => resolve();
            script.onerror = () => reject();
            document.head.appendChild(script);
        });

        return instagramScriptPromise;
    };

    const renderInstagramFeed = (items) => {
        if (!Array.isArray(items) || items.length === 0) {
            instagramFeedGrid.innerHTML = '<div class="instagram-feed-empty">No Instagram videos were found.</div>';
            return;
        }

        instagramFeedGrid.innerHTML = items
            .map((item, index) => {
                const title = item.title || `Video ${String(index + 1).padStart(2, "0")}`;
                const caption = item.caption || "";

                return `
                    <article class="instagram-card" style="--reveal-delay:${Math.min(index * 60, 360)}ms">
                        <blockquote class="instagram-media" data-instgrm-permalink="${item.url}" data-instgrm-version="14" style="background:#000;border:0;border-radius:0;box-shadow:none;margin:0;padding:0;">
                            <a href="${item.url}" target="_blank" rel="noreferrer noopener">View this post on Instagram</a>
                        </blockquote>
                        <p class="instagram-card-caption"><strong>${title}</strong>${caption ? ` ${caption}` : ""}</p>
                    </article>
                `;
            })
            .join("");

        loadInstagramScript()
            .then(() => {
                if (window.instgrm && window.instgrm.Embeds && typeof window.instgrm.Embeds.process === "function") {
                    window.instgrm.Embeds.process();
                }
            })
            .catch(() => {
                instagramFeedGrid.insertAdjacentHTML("beforeend", '<div class="instagram-feed-empty">Instagram embeds could not be loaded right now.</div>');
            });
    };

    const renderFallbackFeed = () => renderInstagramFeed(fallbackInstagramFeed);

    fetch(feedUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to load ${feedUrl}`);
            }

            return response.json();
        })
        .then(renderInstagramFeed)
        .catch(() => {
            renderFallbackFeed();
        });

    renderFallbackFeed();
}

window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset;
    const hero = document.querySelector(".page-hero, .content-wrapper");

    if (!hero) {
        return;
    }

    const parallaxLift = Math.min(scrollTop * 0.06, 24);
    hero.style.setProperty("--hero-offset", `${parallaxLift}px`);
});