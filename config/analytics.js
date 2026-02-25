// Analytics configuration
(function() {
    // Configuration
    const CONFIG = {
        roistat: {
            enabled: true,
            projectId: 'YOUR_PROJECT_ID', // Замените на реальный ID
            host: 'cloud.roistat.com'
        },
        metrika: {
            enabled: true,
            id: 'YOUR_METRIKA_ID' // Замените на реальный ID
        },
        google: {
            enabled: false,
            id: 'UA-XXXXX-Y' // Опционально
        }
    };

    // Roistat Counter
    if (CONFIG.roistat.enabled) {
        (function(w, d, s, h, id) {
            w.roistatProjectId = id;
            w.roistatHost = h;
            var p = d.location.protocol == "https:" ? "https://" : "http://";
            var u = p + h + "/static/marketplace/";
            var js = d.createElement(s);
            js.async = 1;
            js.src = u + "roistat.js";
            d.head.appendChild(js);
            
            console.log('✅ Roistat initialized');
        })(window, document, 'script', CONFIG.roistat.host, CONFIG.roistat.projectId);
    }

    // Yandex Metrika
    if (CONFIG.metrika.enabled) {
        (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {
                if (document.scripts[j].src === r) { return; }
            }
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
        })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

        ym(CONFIG.metrika.id, "init", {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true,
            ecommerce: false
        });
        
        console.log('✅ Yandex Metrika initialized');
    }

    // Google Analytics
    if (CONFIG.google.enabled) {
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', CONFIG.google.id);
        
        console.log('✅ Google Analytics initialized');
    }

    // Custom tracking
    window.trackEvent = function(category, action, label) {
        // Yandex
        if (typeof ym === 'function') {
            ym(CONFIG.metrika.id, 'reachGoal', action);
        }
        
        // Google
        if (typeof gtag === 'function') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }
        
        // Roistat
        if (window.roistat && window.roistat.lead) {
            window.roistat.lead.add();
        }
        
        console.log('📊 Track event:', { category, action, label });
    };

    // Auto-track page views
    document.addEventListener('DOMContentLoaded', function() {
        // Track initial page view
        setTimeout(() => {
            window.trackEvent('Page', 'view', window.location.pathname);
        }, 1000);
    });

})();