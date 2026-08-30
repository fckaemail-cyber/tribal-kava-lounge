/* Client-Side Logic, SPA Routing, Interactive AI Guide & SEO Metadata Injector */

const SITE_ORIGIN = (window.TRIBAL_SITE_CONFIG && window.TRIBAL_SITE_CONFIG.canonicalOrigin) || 'https://www.thetribalkavalounge.com';

// SEO Metadata Database
const seoDatabase = {
    'home': {
        title: 'Tribal Kava Lounge | Kava Bar & Kratom Tea in West Palm Beach, FL',
        description: 'Visit Tribal Kava Lounge in West Palm Beach for traditional kava shells, brewed kratom tea, crafted drinks, games, events, and a welcoming alcohol-free night out. Kratom 21+ only.',
        h1: 'A Kava Lounge for a Better Night Out in West Palm Beach',
        slug: '/',
        schema: {
            "@context": "https://schema.org",
            "@type": ["CafeOrCoffeeShop", "LocalBusiness"],
            "name": "Tribal Kava Lounge",
            "image": `${SITE_ORIGIN}/images/lounge-interior.jpg`,
            "@id": `${SITE_ORIGIN}/#lounge`,
            "url": SITE_ORIGIN,
            "telephone": "+1-561-355-0561",
            "email": "join@tribalkavalounge.co",
            "priceRange": "$$",
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "269"
            },
            "hasMap": "https://www.google.com/maps/search/?api=1&query=Tribal+Kava+Lounge+770+S+Military+Trail+Unit+A1+West+Palm+Beach+FL+33415",
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-561-355-0561",
                "contactType": "customer service"
            },
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "770 S Military Trail, Unit A1",
                "addressLocality": "West Palm Beach",
                "addressRegion": "FL",
                "postalCode": "33415",
                "addressCountry": "US"
            },
            "areaServed": ["West Palm Beach", "Lake Worth", "Greenacres", "Palm Springs", "Haverhill"],
            "openingHoursSpecification": [
                {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
                    "opens": "08:00",
                    "closes": "00:00"
                },
                {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": ["Friday", "Saturday"],
                    "opens": "08:00",
                    "closes": "01:00"
                }
            ],
            "sameAs": [
                "https://www.instagram.com/tribalkavalounge"
            ]
        }
    },
    'menu': {
        title: 'Menu | Kava Shells, Kratom Tea & Crafted Drinks in West Palm Beach',
        description: 'See current in-lounge prices for kava shells, brewed kratom tea, crafted kava and kratom drinks, shots, extracts, and fruit drinks at Tribal Kava Lounge. Kratom is 21+ only.',
        h1: 'Kava, Tea & Crafted Drink Menu',
        slug: '/menu',
        schema: {
            "@context": "https://schema.org",
            "@type": "Menu",
            "name": "Tribal Kava Lounge Botanical Beverage Menu",
            "mainEntityOfPage": `${SITE_ORIGIN}/menu`,
            "hasMenuSection": [
                {
                    "@type": "MenuSection",
                    "name": "Kava Shells",
                    "description": "Traditional kava shells: single $6, double $9, triple $13, and K.O. shell $10. $2 Tuesdays: single shells $2 from 2:00 PM–5:00 PM."
                },
                {
                    "@type": "MenuSection",
                    "name": "Crafted Kava",
                    "description": "Dessert-inspired kava drinks with clear $10 pricing."
                },
                {
                    "@type": "MenuSection",
                    "name": "Brewed Kratom Tea",
                    "description": "Red, white, or green leaf tea: small $6.50 or large 16 oz $8.75. 21+ only. Valid ID required."
                },
                {
                    "@type": "MenuSection",
                    "name": "Crafted Kratom Drinks",
                    "description": "Fruit-forward crafted drinks with brewed kratom tea. 21+ only. Valid ID required."
                },
                {
                    "@type": "MenuSection",
                    "name": "Kratom Shots",
                    "description": "Compact kratom shot options. 21+ only. Valid ID required."
                },
                {
                    "@type": "MenuSection",
                    "name": "Kratom Extracts",
                    "description": "Kratom Punch: 16 oz $15 or 24 oz $20. Kratom extract boost +$5. Adult-use extract options $15–25. 21+ only. Valid ID required."
                },
                {
                    "@type": "MenuSection",
                    "name": "Fruit Drinks",
                    "description": "Fresh, colorful drinks without kava or kratom."
                }
            ]
        }
    },
    'new-here': {
        title: 'New to Kava or Kratom? Start Here | Tribal Kava Lounge',
        description: 'Never tried kava or kratom before? Our beginner-friendly guide explains what kava is, what kratom is, what to order first, and how to enjoy responsibly.',
        h1: 'Never Had Kava or Kratom? Start Here.',
        slug: '/new-here',
        schema: {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is kava?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Kava is a traditional plant-based beverage made from the root of the kava plant. Traditional kava has an earthy taste, but our Kava Clouds are designed to make the experience smoother and more familiar with creamy dessert-style flavors."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What is kratom?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Kratom is a botanical beverage made from kratom leaves. We serve it as traditional-style brewed tea, fruit-forward refreshers, compact shots, and adult-use extracts. All kratom products are 21+ only with valid ID."
                    }
                }
            ]
        }
    },
    'kava-vs-kratom': {
        title: 'Kava vs. Kratom | What’s the Difference?',
        description: 'Learn the simple difference between kava and kratom, how each is served, what first-timers should know, and how to choose your first drink responsibly.',
        h1: 'Kava vs. Kratom: What’s the Difference?',
        slug: '/kava-vs-kratom',
        schema: {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": SITE_ORIGIN
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Kava vs. Kratom",
                    "item": `${SITE_ORIGIN}/kava-vs-kratom`
                }
            ]
        }
    },
    'events': {
        title: 'Events at Tribal Kava Lounge | Kava Lounge Events in West Palm Beach',
        description: 'See Friday Lotería with Tony, karaoke, $2 Tuesday shells, and rotating game, poker, Art Club, and Sip & Paint nights at Tribal Kava Lounge in West Palm Beach.',
        h1: 'Kava Lounge Events in West Palm Beach',
        slug: '/events',
        schema: {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Friday Lotería at 9 PM"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Karaoke and Rotating Community Events"
                }
            ]
        }
    },
    'visit': {
        title: 'Visit Tribal Kava Lounge | Kava Lounge in West Palm Beach',
        description: 'Visit Tribal Kava Lounge in West Palm Beach — free Wi‑Fi, first drink free, unlimited free parking, pool tables, and multiple seating sections. Hours, Unit A1 location, and first-time tips.',
        h1: 'Visit Our Kava Lounge in West Palm Beach',
        slug: '/visit',
        schema: {
            "@context": "https://schema.org",
            "@type": ["CafeOrCoffeeShop", "LocalBusiness"],
            "name": "Tribal Kava Lounge",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "770 S Military Trail, Unit A1",
                "addressLocality": "West Palm Beach",
                "addressRegion": "FL",
                "postalCode": "33415"
            }
        }
    },
    'faq': {
        title: 'Kava & Kratom FAQ | Tribal Kava Lounge',
        description: 'Get answers to common questions about kava, kratom, first-time visits, age requirements, non-alcoholic drinks, beginner-friendly options, and responsible use.',
        h1: 'Kava & Kratom FAQ',
        slug: '/faq',
        schema: {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "Is kratom 21+?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes, all kratom products are for adults 21+ only. Valid ID is required for purchase."
                    }
                }
            ]
        }
    },

    'what-is-kava': {
        title: 'What Is Kava? Beginner Guide to Kava Drinks | Tribal Kava Lounge',
        description: 'What is kava? Learn culture, preparation, and flavor — plus how Tribal Kava Lounge serves kava shells and dessert-style Kava Clouds in West Palm Beach.',
        h1: 'What Is Kava?',
        slug: '/what-is-kava',
        schema: {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "What Is Kava?",
            "description": "Beginner guide to kava drinks — culture, preparation, and flavor at Tribal Kava Lounge in West Palm Beach.",
            "mainEntityOfPage": `${SITE_ORIGIN}/what-is-kava`,
            "author": { "@type": "Organization", "name": "Tribal Kava Lounge" },
            "publisher": { "@type": "Organization", "name": "Tribal Kava Lounge", "telephone": "+1-561-355-0561" }
        }
    },
    'what-is-kratom': {
        title: 'What Is Kratom Tea? Beginner Guide for Adults 21+ | Tribal Kava Lounge',
        description: 'What is kratom tea? Formats we serve (tea, refreshers, shots, extracts), Florida 21+ rules, flavor-first copy, and responsible-use notes. West Palm Beach.',
        h1: 'What Is Kratom Tea?',
        slug: '/what-is-kratom',
        schema: {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "What Is Kratom Tea?",
            "description": "Beginner guide to kratom beverages for adults 21+ at Tribal Kava Lounge.",
            "mainEntityOfPage": `${SITE_ORIGIN}/what-is-kratom`,
            "author": { "@type": "Organization", "name": "Tribal Kava Lounge" },
            "publisher": { "@type": "Organization", "name": "Tribal Kava Lounge" }
        }
    },
    'plan-your-visit': {
        title: 'Plan Your Visit | Tribal Kava Lounge West Palm Beach',
        description: 'Plan your visit to Tribal Kava Lounge — hours, free parking, Unit A1 address, first-timer tips, groups, and weekly events in West Palm Beach.',
        h1: 'Plan Your Visit',
        slug: '/plan-your-visit',
        schema: {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Plan Your Visit",
            "url": `${SITE_ORIGIN}/plan-your-visit`
        }
    },
    'private-events': {
        title: 'Private Events | Host at Tribal Kava Lounge West Palm Beach',
        description: 'Host birthdays, creator meetups, study groups, and non-alcoholic private events at Tribal Kava Lounge in West Palm Beach.',
        h1: 'Host Something Different.',
        slug: '/private-events',
        schema: {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Private Events",
            "url": `${SITE_ORIGIN}/private-events`
        }
    },
    'press': {
        title: 'Press & Social Proof | Tribal Kava Lounge',
        description: 'Press, reviews, and social proof for Tribal Kava Lounge — West Palm Beach non-alcoholic botanical lounge.',
        h1: 'Press & Social Proof',
        slug: '/press',
        schema: {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Press & Social Proof",
            "url": `${SITE_ORIGIN}/press`
        }
    },
    'gift-cards': {
        title: 'Gift Cards Coming Soon | Tribal Kava Lounge',
        description: 'Gift cards for Tribal Kava Lounge are coming soon. Join the VIP list to be first when digital cards launch in West Palm Beach.',
        h1: 'Gift Cards',
        slug: '/gift-cards',
        schema: {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Gift Cards",
            "url": `${SITE_ORIGIN}/gift-cards`
        }
    },
    'the-daily-kava': {
        title: 'West Palm Beach Kava Stories & Local Guides | The Daily Kava',
        description: 'Fun, useful guides to kava, alcohol-free nightlife, date ideas, late-night study spots, events, and first visits in West Palm Beach.',
        h1: 'The Daily Kava',
        slug: '/the-daily-kava',
        schema: {
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "The Daily Kava",
            "description": "Education, stories, and lounge life from Tribal Kava Lounge in West Palm Beach.",
            "url": `${SITE_ORIGIN}/the-daily-kava`,
            "publisher": {
                "@type": "Organization",
                "name": "Tribal Kava Lounge",
                "telephone": "+1-561-355-0561"
            }
        }
    }
};

// AI Guide Knowledge Base Responses
const aiKnowledgeBase = {
    // Core disclaimers
    safetyDisclaimer: "I can help explain the menu and general responsible-use information, but I cannot give medical or dosing advice. For health, medication, pregnancy, nursing, or treatment-related questions, please speak with a qualified professional.",
    benefitsDisclaimer: "We do not market kava or kratom as medical products or treatments. We focus on flavor, social experience, botanical beverage education, and responsible adult use. People report different experiences, but effects can vary, and we do not guarantee effects or recommend use for any medical purpose.",
    effectsDisclaimer: "People report different experiences, and effects can vary. We do not guarantee effects or recommend kava or kratom for any medical purpose. We recommend asking our team for beginner-friendly options and using these beverages responsibly.",
    
    // Knowledge keys
    'what is kava': "Kava is a traditional plant-based beverage made from the root of the kava plant (Piper methysticum), historically native to the Pacific Islands. Traditionally, kava is ground and strained with water, leaving an earthy taste. At Tribal Kava Lounge, we serve traditional shells and dessert-inspired crafted kava drinks like Banana Pudding to make a first order approachable.",
    'what is kratom': "Kratom is a botanical beverage made from the leaves of the Mitragyna speciosa tree, native to Southeast Asia. We serve red, white, and green leaf brewed tea, fruit-forward crafted drinks like Mango Chili Lime, compact shots, and adult-use extracts. All kratom products are strictly for adults 21+ only. Valid ID is required.",
    'do you have kratom extracts or shots': "Yes — we carry brewed kratom tea, crafted kratom drinks, kratom shots, and adult-use kratom extracts. All kratom products are for adults 21+ with valid ID. For extracts, please ask our team in person before ordering.",
    'kratom tea strains': "Yes — our **kratom tea** menu includes **red, white, and green** leaf styles, brewed traditional-style. All kratom tea is **21+ only** with valid ID. Ask our team which style fits the flavor profile you want.",
    'two dollar tuesday': "Yes — **$2 Tuesdays!** Single shells are **$2 from 2:00 PM–5:00 PM** every Tuesday. Come through and grab a shell.",
    'menu prices': "Here are our current in-lounge prices: **Kava shells:** single $6, double $9, triple $13, K.O. $10 · **Brewed kratom tea:** small $6.50 or large 16 oz $8.75 · **Kratom Punch:** 16 oz $15 or 24 oz $20 · **Kratom extract boost +$5** · **Crafted kava $10** · **Crafted kratom drinks $14** · **Kava or kratom shots $6** · **Kratom extracts $15–25** · **Fruit drinks $13**. Plus **$2 Tuesdays** — single shells $2 from 2–5 PM. Kratom is 21+ only.",
    'weekly events': "Weekly lineup: **Tuesday** = $2 single shells (2–5 PM) · recurring **Karaoke** nights · **Friday** = Lotería at 9 PM, hosted by Tony with $1 boards. Mario Kart, poker, Art Club, and Sip & Paint rotate in; check Instagram for the next date.",
    'karaoke': "Yes — Tribal hosts recurring Karaoke nights. Check **@TribalKavaLounge** on Instagram for the next confirmed start time.",
    'pool tournament': "We have pool tables, but there is no current recurring tournament time published. Check @TribalKavaLounge on Instagram for the next scheduled game or tournament night.",
    'loteria': "Yes — Tony hosts **Lotería every Friday at 9 PM**. Boards are $1 each.",
    'online ordering': "Online ordering is live through DoorDash from the Order Online buttons on this site. Digital gift cards are still coming soon. You can also visit us at 770 S Military Trail, Unit A1, West Palm Beach.",
    'does kava get you drunk': "Kava is not alcohol, so it does not get you drunk like beer, wine, or liquor. It is a traditional botanical beverage made from kava root. Some people may feel different after drinking kava, so we treat it as a responsible-use beverage. Do not mix it with alcohol or other substances.",
    'is kratom alcohol': "No, kratom is not alcohol. It is a botanical tea brewed from tree leaves. However, it should be treated as a responsible-use botanical beverage. Do not mix it with alcohol or other substances.",
    'is kratom 21+': "Yes. All kratom products are strictly for adults 21+ only. A valid government-issued ID is required at the counter.",
    'can i drink kratom every day': "We do not recommend using kratom as a daily habit or using it to self-treat any health condition. Long-term use may not be right for everyone. For health or medication questions, speak with a qualified professional.",
    'what should i order first': "We recommend ordering based on your flavor preferences:\n\n" +
                               "🍨 **If you want sweet and creamy:** Try *Banana Pudding* or *La Nube Tres Leches*.\n" +
                               "🍓 **If you want fruity and refreshing:** Try *Passionfruit Mint* (21+) or *Guava Lime* (no botanicals).\n" +
                               "🌌 **If you want bold:** Try *Blue Razz Coconut*.\n\n" +
                               "Please feel free to ask our baristas at the lounge! They love guiding first-timers.",
    'what is beginner friendly': "For a sweet first kava drink, try *Banana Pudding* or *La Nube Tres Leches*. If you want no kava or kratom, *Guava Lime* is an easy fruit-forward choice. Our team can also walk you through a traditional single shell.",
    'difference between kava and kratom': "Kava and Kratom come from different botanical sources. **Kava** is made from the root of a shrub and has a long history of traditional social use in the Pacific Islands. **Kratom** is brewed from the leaves of a tropical tree native to Southeast Asia and is served as a botanical tea. Kava is available to adults, while Kratom is strictly 21+ only.",
    'do you have drinks without kava or kratom': "Yes! Our fruit drinks include *Guava Lime*, *Watermelon Cucumber Lime*, and *Jamaica Passionfruit*. They contain no kava or kratom.",
    'where are you located': "We are located at **770 S Military Trail, Unit A1, West Palm Beach, FL 33415** — an easy drive from Lake Worth, Greenacres, Palm Springs, and Haverhill. Free open-lot parking with unlimited spaces. Stop by and vibe!",
    'what are your hours': "We are open **Sunday–Thursday 8:00 AM–12:00 AM** and **Friday–Saturday 8:00 AM–1:00 AM**.",
    'parking': "Yes — **unlimited free parking** in the open lot right at the lounge. Pull in, park, and come find Unit A1.",
    'amenities': "We've got **free Wi‑Fi**, **first drink free** (ask our team when you arrive), **unlimited free parking**, **pool tables**, and **multiple seating sections**. A **smoke shop is coming soon**.",
    'wifi': "Yes — **free Wi‑Fi** is available. Perfect for study sessions, remote work, or hanging out. We also have multiple seating sections and pool tables.",
    'first drink free': "Yes — your **first drink is free**. Ask our team when you arrive and they'll hook you up.",
    'pool tables': "Yes — we have **pool tables** so you can shoot a game while you sip.",
    'smoke shop': "A **smoke shop is coming soon** at Tribal Kava Lounge. Follow **@TribalKavaLounge** on Instagram for the drop.",
    'how do i contact you': "Call us at **(561) 355-0561**, email **Join@TribalKavaLounge.Co**, follow **@TribalKavaLounge** on Instagram, or visit **TribalKavaLounge.com**. We're at 770 S Military Trail, Unit A1, West Palm Beach, FL 33415.",
    'do you have events': "Yes! We have **$2 Tuesday shells** from 2–5 PM, recurring **Karaoke**, and **Friday Lotería at 9 PM** hosted by Tony. Game nights, poker, Art Club, and Sip & Paint rotate in — check the Events page and Instagram for current dates.",
    'can i bring friends who have never tried it': "Absolutely! Tribal Kava Lounge is built for first-timers. We serve non-botanical options like Agua Frescas, and our team is happy to answer questions at the bar to make everyone feel comfortable.",
    'the daily kava': "Yes — **The Daily Kava** is our blog: beginner guides, lounge stories, and West Palm Beach life with a little humor. Read it on the site under **The Daily Kava**.",
};

// Medical trigger word list to enforce guardrails
const medicalTriggers = [
    'pain', 'anxiety', 'sleep', 'depress', 'stress', 'addict', 'withdraw', 'opioid', 'cure', 
    'treat', 'therapy', 'sedative', 'euphoria', 'dose', 'dosing', 'medical', 'pregnant', 
    'nurse', 'nursing', 'medication', 'disease', 'heal', 'illness', 'health'
];

// Path-based SPA Router (SEO-friendly URLs; Netlify /* → index.html)
const VALID_ROUTES = new Set([
    'home', 'menu', 'new-here', 'kava-vs-kratom', 'events', 'visit', 'faq',
    'the-daily-kava', 'the-daily-kava-article',
    'what-is-kava', 'what-is-kratom',
    'plan-your-visit', 'private-events', 'press', 'gift-cards'
]);

function parsePathRoute() {
    // Migrate legacy hash URLs: /#/menu → /menu
    if (window.location.hash && window.location.hash.startsWith('#/')) {
        const migrated = window.location.hash.slice(1); // /menu
        history.replaceState(null, '', migrated || '/');
    }

    let path = window.location.pathname || '/';
    // Strip trailing slash except root
    if (path.length > 1 && path.endsWith('/')) {
        path = path.slice(0, -1);
    }

    let route = path === '/' ? 'home' : path.replace(/^\//, '');
    let dailySlug = null;

    if (route.startsWith('the-daily-kava/')) {
        dailySlug = route.slice('the-daily-kava/'.length).replace(/\/$/, '');
        route = 'the-daily-kava-article';
    }

    return { route, dailySlug, path };
}

function pathForRoute(route, dailySlug) {
    if (route === 'home') return '/';
    if (route === 'the-daily-kava-article' && dailySlug) return `/the-daily-kava/${dailySlug}`;
    return `/${route}`;
}

function navigateTo(path, { replace = false } = {}) {
    if (!path.startsWith('/')) path = '/' + path;
    if (replace) history.replaceState(null, '', path);
    else history.pushState(null, '', path);
    handleRoute();
}

function handleRoute() {
    let { route, dailySlug } = parsePathRoute();

    document.querySelectorAll('.spa-view').forEach(view => {
        view.style.display = 'none';
    });

    const activeView = document.getElementById(`view-${route}`);
    if (activeView && (VALID_ROUTES.has(route) || route === 'the-daily-kava-article')) {
        activeView.style.display = 'block';
    } else {
        document.getElementById('view-home').style.display = 'block';
        route = 'home';
        dailySlug = null;
        if (window.location.pathname !== '/') {
            history.replaceState(null, '', '/');
        }
    }

    if (route === 'home') {
        renderDailyKavaHomeLatest(3);
        injectSEO('home');
    } else if (route === 'the-daily-kava') {
        renderDailyKavaIndex();
        injectSEO('the-daily-kava');
    } else if (route === 'the-daily-kava-article') {
        const ok = renderDailyKavaArticle(dailySlug);
        if (!ok) {
            navigateTo('/the-daily-kava', { replace: true });
            return;
        }
    } else {
        injectSEO(route);
    }

    // Active nav
    document.querySelectorAll('.nav-menu a, .mobile-nav-links a').forEach(link => {
        const href = link.getAttribute('href') || '';
        const isDaily = route === 'the-daily-kava' || route === 'the-daily-kava-article';
        const matches =
            (route === 'home' && (href === '/' || href === '')) ||
            href === `/${route}` ||
            (isDaily && href === '/the-daily-kava');
        link.classList.toggle('active', !!matches);
    });

    const drawer = document.getElementById('mobile-drawer');
    if (drawer) drawer.classList.remove('open');

    // Deep-link anchors like /#vip after path load
    if (window.location.hash && !window.location.hash.startsWith('#/')) {
        const el = document.querySelector(window.location.hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
        window.scrollTo(0, 0);
    }

    window.dispatchEvent(new CustomEvent('tribal:navigation', {
        detail: { route, path: window.location.pathname }
    }));
}

function getDailyKavaSorted() {
    if (typeof dailyKavaPosts === 'undefined') return [];
    return [...dailyKavaPosts].sort((a, b) => (a.date < b.date ? 1 : -1));
}

function dailyKavaCardHTML(post) {
    return `
        <article class="card daily-card">
            <div class="daily-card-meta">
                <span class="daily-cat">${post.category}</span>
                <span class="daily-date">${formatDailyDate(post.date)} · ${post.readMin} min</span>
            </div>
            <h2 class="daily-card-title"><a href="/the-daily-kava/${post.slug}">${post.title}</a></h2>
            <p class="daily-card-dek">${post.dek}</p>
            <a class="daily-read-link" href="/the-daily-kava/${post.slug}">Read story →</a>
        </article>
    `;
}

function renderDailyKavaIndex() {
    const grid = document.getElementById('daily-kava-grid');
    if (!grid) return;
    grid.innerHTML = getDailyKavaSorted().map(dailyKavaCardHTML).join('');
}

/** Latest posts strip on the home page */
function renderDailyKavaHomeLatest(limit = 3) {
    const grid = document.getElementById('daily-kava-home-latest');
    if (!grid) return;
    grid.innerHTML = getDailyKavaSorted().slice(0, limit).map(dailyKavaCardHTML).join('');
}

function escapeDailyKavaText(value) {
    const el = document.createElement('span');
    el.textContent = value || '';
    return el.innerHTML;
}

function dailyKavaFAQHTML(faq = []) {
    if (!faq.length) return '';

    return `
        <section class="daily-faq" aria-labelledby="daily-faq-heading">
            <h2 id="daily-faq-heading">Quick answers</h2>
            ${faq.map(item => `
                <details>
                    <summary>${escapeDailyKavaText(item.question)}</summary>
                    <p>${escapeDailyKavaText(item.answer)}</p>
                </details>
            `).join('')}
        </section>
    `;
}

function renderDailyKavaArticle(slug) {
    const post = typeof getDailyKavaPost === 'function' ? getDailyKavaPost(slug) : null;
    const root = document.getElementById('daily-kava-article-root');
    if (!post || !root) return false;

    root.innerHTML = `
        <a class="daily-back" href="/the-daily-kava">← The Daily Kava</a>
        <div class="daily-card-meta" style="margin-top: 1.25rem;">
            <span class="daily-cat">${post.category}</span>
            <span class="daily-date">${formatDailyDate(post.date)} · ${post.readMin} min read</span>
        </div>
        <h1 class="daily-article-title">${post.title}</h1>
        <p class="daily-article-dek">${post.dek}</p>
        <div class="daily-article-body">${post.body}</div>
        ${dailyKavaFAQHTML(post.faq)}
        <div class="daily-article-footer">
            <p>More from <a href="/the-daily-kava">The Daily Kava</a> · <a href="/menu">Menu</a> · <a href="/visit">Visit</a> · <a href="tel:+15613550561">(561) 355-0561</a></p>
            <p class="daily-note" style="margin-top: 1rem;">Kratom products are 21+ only. Valid ID required. Not intended to diagnose, treat, cure, or prevent any disease. Do not mix kava or kratom with alcohol or other substances.</p>
        </div>
    `;

    const articleTitle = post.seoTitle || `${post.title} | The Daily Kava`;
    const articleDescription = post.metaDescription || post.dek;
    const articleUrl = `${SITE_ORIGIN}/the-daily-kava/${post.slug}`;

    document.title = articleTitle;
    let metaDescTag = document.querySelector('meta[name="description"]');
    if (!metaDescTag) {
        metaDescTag = document.createElement('meta');
        metaDescTag.setAttribute('name', 'description');
        document.head.appendChild(metaDescTag);
    }
    metaDescTag.setAttribute('content', articleDescription);

    const canon = document.getElementById('seo-canonical');
    if (canon) canon.setAttribute('href', articleUrl);
    const ogType = document.getElementById('og-type');
    if (ogType) ogType.setAttribute('content', 'article');
    const ogTitle = document.getElementById('og-title');
    if (ogTitle) ogTitle.setAttribute('content', articleTitle);
    const ogDesc = document.getElementById('og-desc');
    if (ogDesc) ogDesc.setAttribute('content', articleDescription);
    const ogUrl = document.getElementById('og-url');
    if (ogUrl) ogUrl.setAttribute('content', articleUrl);

    let schemaScript = document.getElementById('seo-json-ld');
    if (schemaScript) schemaScript.remove();
    schemaScript = document.createElement('script');
    schemaScript.id = 'seo-json-ld';
    schemaScript.type = 'application/ld+json';
    const schemaGraph = [{
        "@type": "BlogPosting",
        "headline": post.title,
        "description": articleDescription,
        "datePublished": post.date,
        "dateModified": post.modified || post.date,
        "author": { "@type": "Organization", "name": "Tribal Kava Lounge" },
        "publisher": {
            "@type": "Organization",
            "name": "Tribal Kava Lounge",
            "url": SITE_ORIGIN
        },
        "mainEntityOfPage": articleUrl,
        "url": articleUrl,
        "isPartOf": { "@type": "Blog", "name": "The Daily Kava", "url": `${SITE_ORIGIN}/the-daily-kava` },
        "articleSection": post.category,
        "keywords": (post.keywords || post.tags || []).join(', '),
        "about": [
            { "@type": "Place", "name": "West Palm Beach, Florida" },
            { "@type": "Thing", "name": "Kava lounge" }
        ]
    }];

    if (post.faq && post.faq.length) {
        schemaGraph.push({
            "@type": "FAQPage",
            "mainEntity": post.faq.map(item => ({
                "@type": "Question",
                "name": item.question,
                "acceptedAnswer": { "@type": "Answer", "text": item.answer }
            }))
        });
    }

    schemaScript.text = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": schemaGraph
    }, null, 2);
    document.head.appendChild(schemaScript);

    return true;
}

// SEO Injector
function injectSEO(route) {
    const meta = seoDatabase[route];
    if (!meta) return;
    
    // Set Document Title
    document.title = meta.title;
    
    // Set Meta Description
    let metaDescTag = document.querySelector('meta[name="description"]');
    if (!metaDescTag) {
        metaDescTag = document.createElement('meta');
        metaDescTag.setAttribute('name', 'description');
        document.head.appendChild(metaDescTag);
    }
    metaDescTag.setAttribute('content', meta.description);
    
    // Inject/Replace Schema Script
    let schemaScript = document.getElementById('seo-json-ld');
    if (schemaScript) {
        schemaScript.remove();
    }
    schemaScript = document.createElement('script');
    schemaScript.id = 'seo-json-ld';
    schemaScript.type = 'application/ld+json';
    schemaScript.text = JSON.stringify(meta.schema, null, 2);
    document.head.appendChild(schemaScript);
    
    // Canonical + Open Graph
    const absUrl = SITE_ORIGIN + (meta.slug === '/' ? '/' : meta.slug);
    const canon = document.getElementById('seo-canonical');
    if (canon) canon.setAttribute('href', absUrl);
    const ogTitle = document.getElementById('og-title');
    if (ogTitle) ogTitle.setAttribute('content', meta.title);
    const ogDesc = document.getElementById('og-desc');
    if (ogDesc) ogDesc.setAttribute('content', meta.description);
    const ogUrl = document.getElementById('og-url');
    if (ogUrl) ogUrl.setAttribute('content', absUrl);
    const ogType = document.getElementById('og-type');
    if (ogType) ogType.setAttribute('content', 'website');
}

// AI Assistant Response Logic
function generateBotResponse(userInput) {
    const cleanedInput = userInput.toLowerCase().trim();
    
    // 1. Guardrail triggers checks (Medical/Health questions)
    const isMedical = medicalTriggers.some(word => cleanedInput.includes(word));
    if (isMedical) {
        return aiKnowledgeBase.safetyDisclaimer;
    }
    
    // 2. Direct keyword mapping
    if (cleanedInput.includes('kava') && cleanedInput.includes('kratom') && cleanedInput.includes('difference')) {
        return aiKnowledgeBase['difference between kava and kratom'];
    }
    if (cleanedInput.includes('get you drunk') || cleanedInput.includes('drunk') || cleanedInput.includes('buzz')) {
        return aiKnowledgeBase['does kava get you drunk'];
    }
    if (cleanedInput.includes('is kratom alcohol') || (cleanedInput.includes('kratom') && cleanedInput.includes('alcohol'))) {
        return aiKnowledgeBase['is kratom alcohol'];
    }
    if (cleanedInput.includes('kratom') && (cleanedInput.includes('every day') || cleanedInput.includes('daily') || cleanedInput.includes('how often'))) {
        return aiKnowledgeBase['can i drink kratom every day'];
    }
    if (cleanedInput.includes('extract') || cleanedInput.includes('shot')) {
        return aiKnowledgeBase['do you have kratom extracts or shots'];
    }
    if (cleanedInput.includes('order online') || cleanedInput.includes('online order') || cleanedInput.includes('delivery') || cleanedInput.includes('gift card')) {
        return aiKnowledgeBase['online ordering'];
    }
    if (cleanedInput.includes('what should i order') || cleanedInput.includes('recommend') || (cleanedInput.includes('menu') && !cleanedInput.includes('price'))) {
        return aiKnowledgeBase['what should i order first'];
    }
    if (cleanedInput.includes('beginner') || cleanedInput.includes('first time') || cleanedInput.includes('new here')) {
        return aiKnowledgeBase['what is beginner friendly'];
    }
    if (cleanedInput.includes('without kava') || cleanedInput.includes('non-botanical') || cleanedInput.includes('no kava')) {
        return aiKnowledgeBase['do you have drinks without kava or kratom'];
    }
    if (cleanedInput.includes('21+') || cleanedInput.includes('age') || cleanedInput.includes('id')) {
        return aiKnowledgeBase['is kratom 21+'];
    }
    if (cleanedInput.includes('parking') || cleanedInput.includes('park')) {
        return aiKnowledgeBase['parking'];
    }
    if (cleanedInput.includes('wifi') || cleanedInput.includes('wi-fi') || cleanedInput.includes('wi fi') || cleanedInput.includes('internet')) {
        return aiKnowledgeBase['wifi'];
    }
    if (cleanedInput.includes('first drink') || cleanedInput.includes('free drink') || cleanedInput.includes('complimentary')) {
        return aiKnowledgeBase['first drink free'];
    }
    if (cleanedInput.includes('hours') || cleanedInput.includes('open') || cleanedInput.includes('close')) {
        return aiKnowledgeBase['what are your hours'];
    }
    if (cleanedInput.includes('2 dollar') || cleanedInput.includes('$2') || cleanedInput.includes('two dollar') || (cleanedInput.includes('tuesday') && (cleanedInput.includes('shell') || cleanedInput.includes('$') || cleanedInput.includes('deal') || cleanedInput.includes('special') || cleanedInput.includes('promo')))) {
        return aiKnowledgeBase['two dollar tuesday'];
    }
    if (cleanedInput.includes('tuesday')) {
        return aiKnowledgeBase['two dollar tuesday'];
    }
    if (cleanedInput.includes('price') || cleanedInput.includes('how much') || cleanedInput.includes('cost') || cleanedInput.includes('pricing')) {
        return aiKnowledgeBase['menu prices'];
    }
    if (cleanedInput.includes('karaoke') || cleanedInput.includes('karokee') || cleanedInput.includes('wednesday')) {
        return aiKnowledgeBase['karaoke'];
    }
    if (cleanedInput.includes('tournament') || cleanedInput.includes('thursday')) {
        return aiKnowledgeBase['pool tournament'];
    }
    if (cleanedInput.includes('loteria') || cleanedInput.includes('lotería') || cleanedInput.includes('friday')) {
        return aiKnowledgeBase['loteria'];
    }
    if ((cleanedInput.includes('red') || cleanedInput.includes('white') || cleanedInput.includes('green') || cleanedInput.includes('strain')) && cleanedInput.includes('kratom')) {
        return aiKnowledgeBase['kratom tea strains'];
    }
    if (cleanedInput.includes('pool') || cleanedInput.includes('billiard')) {
        return aiKnowledgeBase['pool tables'];
    }
    if (cleanedInput.includes('smoke shop') || cleanedInput.includes('smoke') || cleanedInput.includes('vape')) {
        return aiKnowledgeBase['smoke shop'];
    }
    if (cleanedInput.includes('amenities') || cleanedInput.includes('what do you have') || cleanedInput.includes('facilities') || cleanedInput.includes('seating')) {
        return aiKnowledgeBase['amenities'];
    }
    if (cleanedInput.includes('email') || cleanedInput.includes('contact') || cleanedInput.includes('instagram') || cleanedInput.includes('website') || cleanedInput.includes('phone') || cleanedInput.includes('call') || cleanedInput.includes('561')) {
        return aiKnowledgeBase['how do i contact you'];
    }
    if (cleanedInput.includes('location') || cleanedInput.includes('where') || cleanedInput.includes('address')) {
        return aiKnowledgeBase['where are you located'];
    }
    if (cleanedInput.includes('daily kava') || cleanedInput.includes('blog') || cleanedInput.includes('article')) {
        return aiKnowledgeBase['the daily kava'];
    }
    if (cleanedInput.includes('event') || cleanedInput.includes('open mic') || cleanedInput.includes('happen') || cleanedInput.includes('weekly')) {
        return aiKnowledgeBase['do you have events'];
    }
    if (cleanedInput.includes('friend') || cleanedInput.includes('bring')) {
        return aiKnowledgeBase['can i bring friends who have never tried it'];
    }
    if (cleanedInput.includes('what is kava') || cleanedInput.includes('explain kava')) {
        return aiKnowledgeBase['what is kava'];
    }
    if (cleanedInput.includes('what is kratom') || cleanedInput.includes('explain kratom')) {
        return aiKnowledgeBase['what is kratom'];
    }
    
    // 3. Benefits / effects general question checks
    if (cleanedInput.includes('benefit') || cleanedInput.includes('good for') || cleanedInput.includes('why drink')) {
        return aiKnowledgeBase.benefitsDisclaimer;
    }
    if (cleanedInput.includes('feel') || cleanedInput.includes('effect') || cleanedInput.includes('what does it do')) {
        return aiKnowledgeBase.effectsDisclaimer;
    }
    
    // 4. Default fallback
    return "I would love to help you with that! Tribal Kava Lounge serves traditional kava shells, brewed kratom tea, crafted drinks, and fruit drinks in an alcohol-free lounge. For a first order, try Banana Pudding or Guava Lime, or ask our team to walk you through a traditional shell. You can also ask me 'What is kava?' or 'Where are you located?'";
}

// Append Chat Messages
function appendMessage(sender, text, targetChatElementId) {
    const chatContainer = document.getElementById(targetChatElementId);
    if (!chatContainer) return;
    
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-msg', sender);
    msgDiv.textContent = sender === 'bot' ? text.replace(/\*\*/g, '').replace(/\*/g, '') : text;
    chatContainer.appendChild(msgDiv);
    
    // Auto Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Handle sending messages (floating widget or embedded)
function sendMessage(inputElementId, targetChatElementId) {
    const inputField = document.getElementById(inputElementId);
    if (!inputField) return;
    
    const userText = inputField.value.trim();
    if (!userText) return;
    
    // User message
    appendMessage('user', userText, targetChatElementId);
    inputField.value = '';
    
    // Bot Typing Effect
    setTimeout(() => {
        const botResponse = generateBotResponse(userText);
        appendMessage('bot', botResponse, targetChatElementId);
    }, 600);
}

function setFloatingChatOpen(shouldOpen, focusInput = false) {
    const bubble = document.getElementById('floating-chat-bubble');
    const chatWindow = document.getElementById('floating-chat-window');
    if (!bubble || !chatWindow) return;

    bubble.classList.remove('show-prompt');
    bubble.setAttribute('aria-expanded', String(shouldOpen));

    if (shouldOpen) {
        chatWindow.hidden = false;
        window.requestAnimationFrame(() => chatWindow.classList.add('open'));
        if (focusInput) {
            window.setTimeout(() => document.getElementById('float-chat-input')?.focus(), 80);
        }
        return;
    }

    chatWindow.classList.remove('open');
    chatWindow.hidden = true;
}

function updateBusinessStatus() {
    const status = document.getElementById('business-open-status');
    if (!status) return;

    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23'
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
    const minutes = (Number(values.hour) * 60) + Number(values.minute);
    const lateSpill = minutes < 60 && (values.weekday === 'Saturday' || values.weekday === 'Sunday');
    const daytimeOpen = minutes >= 480;
    const isOpen = daytimeOpen || lateSpill;
    const closesAtOne = lateSpill || (daytimeOpen && (values.weekday === 'Friday' || values.weekday === 'Saturday'));

    status.textContent = isOpen
        ? `Open now · Closes ${closesAtOne ? '1 AM' : 'at midnight'}`
        : 'Closed · Opens at 8 AM';
    status.classList.toggle('is-open', isOpen);
    status.classList.toggle('is-closed', !isOpen);
}

// Event Listeners Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Router Init — path-based + intercept in-app links
    window.addEventListener('popstate', handleRoute);
    document.addEventListener('click', (e) => {
        const a = e.target.closest('a[href]');
        if (!a) return;
        const href = a.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) return;
        if (a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        // Internal path navigation
        if (href.startsWith('/')) {
            e.preventDefault();
            // Support /#vip style — path + hash
            navigateTo(href.split('#')[0] || '/');
            if (href.includes('#')) {
                const id = href.split('#')[1];
                setTimeout(() => {
                    const el = document.getElementById(id);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 50);
            }
        }
    });
    handleRoute();
    
    // Hamburger menu toggle
    const hamburger = document.getElementById('nav-toggle');
    const drawer = document.getElementById('mobile-drawer');
    if (hamburger && drawer) {
        hamburger.addEventListener('click', () => {
            drawer.classList.toggle('open');
        });
    }
    
    // Floating Chat Bubble Toggle
    const bubble = document.getElementById('floating-chat-bubble');
    const chatWindow = document.getElementById('floating-chat-window');
    if (bubble && chatWindow) {
        bubble.addEventListener('click', () => {
            const shouldOpen = bubble.getAttribute('aria-expanded') !== 'true';
            setFloatingChatOpen(shouldOpen, shouldOpen);
        });
        
        // Give the page room to breathe before offering help. On mobile, use the
        // same guide with a shorter delay and a compact prompt.
        const isMobileViewport = window.matchMedia('(max-width: 768px)').matches;
        setTimeout(() => {
            if (chatWindow.hidden) {
                bubble.classList.add('show-prompt');
                window.setTimeout(() => bubble.classList.remove('show-prompt'), 7000);
            }
        }, isMobileViewport ? 18000 : 30000);
    }
    
    const chatClose = document.getElementById('chat-close-btn');
    if (chatClose && chatWindow) {
        chatClose.addEventListener('click', (e) => {
            e.stopPropagation();
            setFloatingChatOpen(false);
            bubble?.focus();
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && chatWindow && !chatWindow.hidden) {
            setFloatingChatOpen(false);
            bubble?.focus();
        }
    });

    updateBusinessStatus();
    window.setInterval(updateBusinessStatus, 60000);
    
    // Set up send buttons & inputs for both chat interfaces
    const floatSend = document.getElementById('float-chat-send');
    const floatInput = document.getElementById('float-chat-input');
    if (floatSend && floatInput) {
        floatSend.addEventListener('click', () => sendMessage('float-chat-input', 'float-chat-messages'));
        floatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage('float-chat-input', 'float-chat-messages');
        });
    }

    const embedSend = document.getElementById('embed-chat-send');
    const embedInput = document.getElementById('embed-chat-input');
    if (embedSend && embedInput) {
        embedSend.addEventListener('click', () => sendMessage('embed-chat-input', 'embed-chat-messages'));
        embedInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage('embed-chat-input', 'embed-chat-messages');
        });
    }
    
    // Accordion FAQ triggers
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.closest('.accordion-item');
            const isActive = item.classList.contains('active');
            
            // Close all
            document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
            
            // Open clicked
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    // Interactive Quiz Option Selection
    document.querySelectorAll('.quiz-card').forEach(card => {
        card.addEventListener('click', () => {
            // Remove active classes
            document.querySelectorAll('.quiz-card').forEach(c => c.style.borderColor = 'var(--card-border)');
            
            // Activate clicked
            card.style.borderColor = 'var(--electric-blue)';
            const recommendation = card.getAttribute('data-recommendation');
            const answerBox = document.getElementById('quiz-result-box');
            if (answerBox) {
                answerBox.style.display = 'block';
                document.getElementById('quiz-recommendation-text').innerHTML = `<strong>Recommended drink:</strong> <span style="color:var(--text-cream);font-weight:700;">${recommendation}</span>`;
            }
        });
    });
    
    // Coming Soon overlay dismiss
    const comingSoonOverlay = document.getElementById('coming-soon-overlay');
    const previewBtn = document.getElementById('coming-soon-preview');
    if (comingSoonOverlay && previewBtn) {
        previewBtn.addEventListener('click', () => {
            comingSoonOverlay.classList.add('hidden');
        });
    }
});

// Global helpers to handle starter questions in chat
window.askAI = function(questionText, targetInputId, targetSendId) {
    const input = document.getElementById(targetInputId);
    const sendBtn = document.getElementById(targetSendId);
    if (input && sendBtn) {
        if (targetInputId === 'float-chat-input') {
            setFloatingChatOpen(true);
        }
        input.value = questionText;
        sendBtn.click();
    }
};
