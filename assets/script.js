function openForm() {
    document.getElementById("popupForm").style.display = "flex";
}

function closeForm() {
    document.getElementById("popupForm").style.display = "none";
}


const yatraStops = [
    {
        id: 0,
        name: "Visakhapatnam",
        day: "Day 1",
        coords: [17.6973801, 83.2990254],
        shortDesc: "Arrival & exploration",
        description: "Begin your journey in the coastal city of Visakhapatnam. Explore the seaside, taste local delicacies, and prepare for the adventure ahead into the Eastern Ghats.",
        activities: [
            "Reach Visakhapatnam by noon",
            "Explore the coastal city",
            "Prepare for the journey ahead"
        ],
        isStartEnd: true
    },
    {
        id: 1,
        name: "Guramamidi",
        day: "Day 2",
        coords: [17.5395698, 81.7901882],
        shortDesc: "Rural village experience",
        description: "Experience authentic rural life in Guramamidi village. Connect with local communities and immerse yourself in traditional village culture.",
        activities: [
            "Village exploration",
            "Meet local communities",
            "Traditional food experience"
        ],
        isStartEnd: false
    },
    {
        id: 2,
        name: "Narsapuram",
        day: "Day 2",
        coords: [17.5364748, 81.8681155],
        shortDesc: "Cultural stop",
        description: "Brief stop at Narsapuram to experience local culture and prepare for the journey deeper into the Eastern Ghats.",
        activities: [
            "Local exploration",
            "Cultural immersion"
        ],
        isStartEnd: false
    },
    {
        id: 3,
        name: "Addateegala",
        day: "Days 2-3",
        coords: [17.4776411, 82.0234825],
        shortDesc: "Sankranti Festival immersion",
        description: "Immerse yourself in the authentic Sankranti celebrations with local tribal communities. Experience traditional cockfighting, Dhimsa dance, and forage for local greens.",
        activities: [
            "Festival celebration with locals",
            "Traditional cockfighting",
            "Fishtail palm toddy tasting",
            "Camping with Dhimsa dance",
            "Birding at Maddigedda Reservoir",
            "Foraging and traditional cooking"
        ],
        isStartEnd: false
    },
    {
        id: 4,
        name: "Chintapalle",
        day: "Day 4",
        coords: [17.8710309, 82.3499325],
        shortDesc: "Forest & nature",
        description: "Explore the dense forests around Chintapalle. Experience the natural beauty of the Eastern Ghats with its rich biodiversity.",
        activities: [
            "Forest trekking",
            "Nature exploration",
            "Wildlife spotting"
        ],
        isStartEnd: false
    },
    {
        id: 5,
        name: "Paderu",
        day: "Day 5",
        coords: [18.0802006, 82.663802],
        shortDesc: "Medicinal herb workshop",
        description: "Learn about the rich medicinal herb ecology of the Eastern Ghats. Make traditional medicines by hand with local healers.",
        activities: [
            "Identify local herb ecology",
            "Make traditional medicine by hand",
            "Understand nature-rooted wellness"
        ],
        isStartEnd: false
    },
    {
        id: 6,
        name: "Araku Valley",
        day: "Days 6-8",
        coords: [18.3222221, 82.8801765],
        shortDesc: "Caves, coffee & culture",
        description: "Scenic Araku Valley - visit the community seed bank with 'Bujji Amma', explore Borra Caves, trek to Armakonda peak, and discover hidden waterfalls.",
        activities: [
            "Trek to Armakonda peak",
            "Visit Borra Caves",
            "Community seed bank visit",
            "Kandulaplem Waterfalls",
            "Coffee plantation tour",
            "Stargazing and camping"
        ],
        isStartEnd: false
    },
    {
        id: 7,
        name: "Visakhapatnam",
        day: "Day 9",
        coords: [17.6973801, 83.2990254],
        shortDesc: "Departure",
        description: "Return to Visakhapatnam after an unforgettable 9-day journey through the Eastern Ghats. Carry with you memories, learnings, and new connections.",
        activities: [
            "Return from the mountains",
            "Farewell and departure"
        ],
        isStartEnd: true
    }
];


let yatraMap = null;
let markers = [];
let routeLine = null;

function initYatraMap() {
    const mapContainer = document.getElementById('yatraMap');
    if (!mapContainer) return;

    yatraMap = L.map('yatraMap', {
        scrollWheelZoom: false,
        zoomControl: true
    }).setView([18.0, 82.8], 9);


    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(yatraMap);


    const routeCoords = yatraStops.map(stop => stop.coords);
    routeLine = L.polyline(routeCoords, {
        color: '#1a3a1a',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 10',
        lineCap: 'round',
        lineJoin: 'round'
    }).addTo(yatraMap);

    yatraStops.forEach((stop, index) => {
        const markerHtml = `
            <div class="custom-marker ${stop.isStartEnd ? 'start-end' : ''}" data-stop="${index}">
                ${index + 1}
            </div>
        `;

        const icon = L.divIcon({
            html: markerHtml,
            className: 'custom-marker-wrapper',
            iconSize: [stop.isStartEnd ? 44 : 36, stop.isStartEnd ? 44 : 36],
            iconAnchor: [stop.isStartEnd ? 22 : 18, stop.isStartEnd ? 22 : 18]
        });

        const marker = L.marker(stop.coords, { icon: icon })
            .addTo(yatraMap)
            .bindPopup(createPopupContent(stop));

        marker.on('click', () => {
            setActiveStop(index);
        });

        markers.push(marker);
    });

    yatraMap.fitBounds(routeLine.getBounds(), { padding: [30, 30] });
}

function createPopupContent(stop) {
    return `
        <div class="popup-content">
            <span class="popup-day">${stop.day}</span>
            <h4>${stop.name}</h4>
            <p>${stop.shortDesc}</p>
            <button class="popup-btn" onclick="openStopModal(${stop.id})">
                <i class="ph-fill ph-info"></i> View Details
            </button>
        </div>
    `;
}

let currentStop = 0;

function setActiveStop(stopIndex) {
    currentStop = stopIndex;
    document.querySelectorAll('.timeline-stop').forEach((el, i) => {
        const marker = el.querySelector('.stop-marker');
        if (i === stopIndex) {
            marker.classList.add('active');
        } else {
            marker.classList.remove('active');
        }
    });

    const progress = (stopIndex / (yatraStops.length - 1)) * 100;
    document.querySelector('.timeline-progress').style.width = `${progress}%`;

    markers.forEach(m => m.setZIndexOffset(0));
    if (markers[stopIndex]) {
        markers[stopIndex].setZIndexOffset(1000);

        const stop = yatraStops[stopIndex];
        yatraMap.flyTo(stop.coords, 10, {
            animate: true,
            duration: 1.5
        });

        markers[stopIndex].openPopup();
    }
}

function initTimelineInteractions() {
    document.querySelectorAll('.timeline-stop').forEach((stop, index) => {
        stop.addEventListener('click', () => {
            setActiveStop(index);
        });
    });
}

function openStopModal(stopId) {
    const stop = yatraStops.find(s => s.id === stopId);
    if (!stop) return;

    const modal = document.getElementById('stopModal');

    modal.querySelector('.modal-day-badge').textContent = stop.day;
    modal.querySelector('.modal-title').textContent = stop.name;
    modal.querySelector('.modal-description').textContent = stop.description;
    const activityList = modal.querySelector('.modal-activity-list');
    activityList.innerHTML = stop.activities.map(activity =>
        `<li>${activity}</li>`
    ).join('');

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeStopModal() {
    const modal = document.getElementById('stopModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeStopModal();
        closeForm();
    }
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('stop-modal')) {
        closeStopModal();
    }
});

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

function initCtaObserver() {
    const ctaBtn = document.querySelector('.sticky-cta');
    const mapSection = document.getElementById('route-section');

    if (!ctaBtn || !mapSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                ctaBtn.classList.add('hidden');
            } else {
                ctaBtn.classList.remove('hidden');
            }
        });
    }, {
        threshold: 0.1
    });

    observer.observe(mapSection);
}

document.addEventListener('DOMContentLoaded', function () {
    initYatraMap();
    initTimelineInteractions();

    initScrollAnimations();
    initCtaObserver();

    document.querySelector('.timeline-stop[data-stop="0"] .stop-marker').classList.add('active');

    if (markers[0]) {
        markers[0].setZIndexOffset(1000);
    }

    const form = document.getElementById("yatraForm");
    if (!form) return;

    const submitBtn = form.querySelector('.submit-btn');

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";

        const scriptURL = 'https://script.google.com/macros/s/AKfycbxODUeFAAlMg19pvPZhYxLJ619rmpkEbzfDNrysXksCE3jygg-ZHfMpFf6_lZhI57Qa/exec';

        const formData = new FormData(form);
        const params = new URLSearchParams(formData);

        fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString()
        })
            .then(() => {
                alert("✅ Application submitted successfully! We'll get back to you soon.");
                form.reset();
                closeForm();
            })
            .catch((error) => {
                console.error('Error:', error);
                alert("❌ Something went wrong. Please try again or contact us directly.");
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = "Submit Application";
            });
    });
});

