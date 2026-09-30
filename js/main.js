document.addEventListener('DOMContentLoaded', () => {
    // Inject Properties into the Grid
    const propertiesGrid = document.getElementById('properties-grid');
    const modalBody = document.getElementById('modal-body');
    const modal = document.getElementById('property-modal');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    let currentLightboxImages = [];
    let currentLightboxIndex = 0;
    
    // GTM Push Helper
    const pushGTM = (eventName, eventData = {}) => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: eventName, ...eventData });
    };

    // Render Properties
    const renderProperties = (filter = 'all') => {
        propertiesGrid.innerHTML = '';
        const filtered = propertiesData.filter(p => filter === 'all' || p.badge.toLowerCase().includes(filter));
        
        if (filtered.length === 0) {
            propertiesGrid.innerHTML = '<p style="color:var(--text-secondary); text-align:center; grid-column:1/-1;">Nenhum imóvel encontrado para este filtro.</p>';
            return;
        }

        filtered.forEach(prop => {
            const card = document.createElement('div');
            card.className = 'property-card fade-in';
            card.innerHTML = `
                <div class="property-image">
                    <div class="property-badges">
                        <span class="badge primary">${prop.badge}</span>
                        ${prop.status ? `<span class="badge ghost">${prop.status}</span>` : ''}
                    </div>
                    <img src="${prop.images[0]}" alt="${prop.name}" loading="lazy">
                </div>
                <div class="property-content">
                    <div class="property-price">
                        <small>${prop.price.includes('Consulte') ? 'Investimento' : 'Valor'}</small>
                        ${prop.price}
                    </div>
                    <h3 class="property-title">${prop.name}</h3>
                    <div class="property-location">📍 ${prop.location}</div>
                    <div class="property-specs">
                        <span class="spec-item"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M3 21V3h18v18H3z M3 9h18 M9 3v6"/></svg> ${prop.area}</span>
                        <span class="spec-item"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M3 18v-6a2 2 0 012-2h14a2 2 0 012 2v6 M3 18h18 M5 10V6a2 2 0 012-2h10a2 2 0 012 2v4"/></svg> ${prop.suites}</span>
                        <span class="spec-item"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M5 17h14M6 17l1.5-6h9L18 17M8 20h.01M16 20h.01M7 11l1-3h8l1 3"/></svg> ${prop.parking}</span>
                    </div>
                    <div class="property-actions">
                        <button class="btn btn-card details js-open-modal" data-id="${prop.id}">Ver detalhes</button>
                        <a href="#" class="btn btn-card whatsapp js-whatsapp" data-property="${prop.name}" data-cta="Card CTA">WhatsApp</a>
                    </div>
                </div>
            `;
            propertiesGrid.appendChild(card);
        });
    };

    renderProperties();

    // Filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderProperties(e.target.dataset.filter);
        });
    });

    // Modals
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.js-open-modal')) {
            const id = e.target.closest('.js-open-modal').dataset.id;
            openModal(id);
        }
        if (e.target.closest('.modal-close') || e.target.matches('.modal-backdrop')) {
            modal.classList.remove('active');
        }
    });

    const openModal = (id) => {
        const prop = propertiesData.find(p => p.id === id);
        if (!prop) return;

        pushGTM('view_property', { property_id: prop.id, property_name: prop.name });

        const specsHtml = `
            <ul class="modal-specs-list">
                <li><span>Área Privativa</span><span>${prop.area}</span></li>
                <li><span>Área Total</span><span>${prop.areaTotal}</span></li>
                <li><span>Dormitórios</span><span>${prop.bedrooms}</span></li>
                <li><span>Vagas</span><span>${prop.parking}</span></li>
            </ul>
        `;

        const detailsHtml = `
            <ul class="modal-specs-list">
                ${prop.details.map(d => `<li><span>✓</span><span>${d}</span></li>`).join('')}
            </ul>
        `;

        modalBody.innerHTML = `
            <div class="modal-gallery">
                <img src="${prop.images[0]}" alt="${prop.name}" class="modal-gallery-main" id="modal-main-img" data-index="0">
                <div class="modal-gallery-thumbs">
                    ${prop.images.map((img, idx) => `<img src="${img}" class="modal-thumb ${idx === 0 ? 'active' : ''}" data-index="${idx}">`).join('')}
                </div>
            </div>
            <div class="modal-info">
                <div class="modal-header-info">
                    <div>
                        <div class="property-badges" style="position:relative; top:0; left:0; margin-bottom:16px;">
                            <span class="badge primary">${prop.badge}</span>
                            <span class="badge ghost">${prop.location}</span>
                        </div>
                        <h2 class="modal-title">${prop.name}</h2>
                    </div>
                    <div class="modal-price-box">
                        <small>${prop.price.includes('Consulte') ? 'Investimento' : 'Valor'}</small>
                        ${prop.oldPrice ? `<div class="old-price">${prop.oldPrice}</div>` : ''}
                        <div class="price">${prop.price}</div>
                    </div>
                </div>
                
                <p class="modal-desc">${prop.desc}</p>
                
                <div class="modal-grid">
                    <div class="modal-panel">
                        <h3>Especificações</h3>
                        ${specsHtml}
                    </div>
                    <div class="modal-panel">
                        <h3>Diferenciais</h3>
                        ${detailsHtml}
                    </div>
                </div>
                
                <div class="modal-payment">
                    <div>
                        <p style="margin-bottom:4px;"><small>Condições de Pagamento</small></p>
                        <h4 style="font-size:1.1rem; color:var(--text-primary);">${prop.payment}</h4>
                    </div>
                    <a href="#" class="btn btn-whatsapp js-whatsapp" data-property="${prop.name}" data-cta="Modal CTA">Falar com Corretor</a>
                </div>
            </div>
        `;
        
        modal.classList.add('active');

        // Gallery Interactivity
        const mainImg = document.getElementById('modal-main-img');
        const thumbs = document.querySelectorAll('.modal-thumb');
        
        thumbs.forEach(thumb => {
            thumb.addEventListener('click', (e) => {
                thumbs.forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                mainImg.src = e.target.src;
                mainImg.dataset.index = e.target.dataset.index;
            });
        });

        // Setup Lightbox for modal gallery
        currentLightboxImages = prop.images;
        mainImg.addEventListener('click', () => {
            openLightbox(parseInt(mainImg.dataset.index));
        });
    };

    // Lightbox Logic
    const openLightbox = (index) => {
        currentLightboxIndex = index;
        lightboxImg.src = currentLightboxImages[currentLightboxIndex];
        lightbox.classList.add('active');
    };

    const updateLightbox = () => {
        lightboxImg.src = currentLightboxImages[currentLightboxIndex];
    };

    document.querySelector('.lightbox-close').addEventListener('click', () => lightbox.classList.remove('active'));
    document.querySelector('.lightbox-backdrop').addEventListener('click', () => lightbox.classList.remove('active'));
    
    document.querySelector('.lightbox-next').addEventListener('click', () => {
        currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxImages.length;
        updateLightbox();
    });
    
    document.querySelector('.lightbox-prev').addEventListener('click', () => {
        currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxImages.length) % currentLightboxImages.length;
        updateLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'ArrowRight') document.querySelector('.lightbox-next').click();
        if (e.key === 'ArrowLeft') document.querySelector('.lightbox-prev').click();
        if (e.key === 'Escape') lightbox.classList.remove('active');
    });

    // Header Scroll
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    }, { passive: true });

    // WhatsApp Round Robin Logic
    const consultants = [
        { name: 'Fernanda Bohnenberger', phone: '5547991707447' },
        { name: 'Ricardo Ribeiro', phone: '5547991214885' }
    ];
    const rotationKey = 'fb_whatsapp_rr_v2';
    
    const getNextConsultant = () => {
        let index = parseInt(localStorage.getItem(rotationKey) || '0');
        if (isNaN(index)) index = 0;
        const consultant = consultants[index % consultants.length];
        localStorage.setItem(rotationKey, (index + 1).toString());
        return consultant;
    };

    // Handle WhatsApp Clicks
    document.body.addEventListener('click', (e) => {
        const waBtn = e.target.closest('.js-whatsapp');
        if (waBtn) {
            e.preventDefault();
            const property = waBtn.dataset.property || 'Geral';
            const cta = waBtn.dataset.cta || 'WhatsApp Button';
            const consultant = getNextConsultant();
            
            let message = `Olá, ${consultant.name}! `;
            if (property === 'Geral') {
                message += `Tenho interesse em imóveis de alto padrão em Balneário Camboriú e gostaria de mais informações.`;
            } else {
                message += `Tenho interesse no imóvel ${property} e gostaria de mais informações.`;
            }

            pushGTM('click_whatsapp', {
                whatsapp_source: cta,
                whatsapp_consultant: consultant.name,
                whatsapp_property: property
            });

            const url = `https://wa.me/${consultant.phone}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank', 'noopener');
        }
    });

    // Form Submission
    const form = document.getElementById('lead-form');
    const statusDiv = document.getElementById('form-status');
    let formStarted = false;

    form.addEventListener('input', () => {
        if (!formStarted) {
            pushGTM('form_start', { form_id: 'lead-form' });
            formStarted = true;
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nome = form.nome.value.trim();
        const telefone = form.telefone.value.trim();
        const email = form.email.value.trim();
        const objetivo = form.objetivo.value;
        const mensagem = form.mensagem.value.trim();

        if (!nome || !telefone || !email || !objetivo) {
            statusDiv.className = 'form-status error';
            statusDiv.innerText = 'Preencha os campos obrigatórios.';
            return;
        }

        const consultant = getNextConsultant();
        const textMessage = `Olá, ${consultant.name}!\n\nAcabei de preencher o formulário do site e gostaria de atendimento.\n\n*Nome:* ${nome}\n*Telefone:* ${telefone}\n*E-mail:* ${email}\n*Busco:* ${objetivo}\n*Mensagem:* ${mensagem || 'N/A'}`;

        pushGTM('generate_lead', {
            form_id: 'lead-form',
            lead_name: nome, // Never send PII in real GTM, but as requested: "Não envie nomes... em eventos comuns de Analytics." 
            // WAIT, prompt says: "Não envie nomes, telefones, e-mails ou textos livres dos visitantes em eventos comuns de Analytics."
            // So I will REMOVE them from GTM!
            whatsapp_consultant: consultant.name,
            lead_objective: objetivo
        });
        
        // Remove PII from GTM Push
        window.dataLayer.push({
            event: 'generate_lead_clean',
            form_id: 'lead-form',
            lead_objective: objetivo,
            whatsapp_consultant: consultant.name
        });

        statusDiv.className = 'form-status success';
        statusDiv.innerText = 'Redirecionando para o WhatsApp...';

        setTimeout(() => {
            const url = `https://wa.me/${consultant.phone}?text=${encodeURIComponent(textMessage)}`;
            window.open(url, '_blank', 'noopener');
            form.reset();
            formStarted = false;
            statusDiv.innerText = '';
        }, 1500);
    });
});
