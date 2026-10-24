// Visitas guiadas de la Fundación Melilla Monumental.
// Fuente: https://melillamonumental.es/rutas-y-visitas/ (consultado el 19-10-2026).
// Para mantenerlo: edita la lista VISITAS. Campos:
//   n: nº del catálogo · name · m: modalidad (g gratuito, s subvencionado, p privado, t teatralizada, x próximamente)
//   r: recinto/tipo (I, II, III, IV, mod, ext, hist, bici, sup, gastro, virt, intl, '' sin tipo)
//   at: punto de encuentro · d: duración en minutos (240 = medio día) · cap: aforo orientativo ('' sin dato)
//   by: guía o gestión ('' = la propia Fundación) · url: más información (opcional) · pl: false = no enlazar a una ficha
window.VISITAS_SRC = { url: 'https://melillamonumental.es/rutas-y-visitas/', checked: '2026-10-19',
  book: 'https://melillamonumental.es/fundacion-melilla-ciudad-monumental/oficina-virtual/reserva-tu-visita/',
  contact: 'https://melillamonumental.es/contacto/', mail: 'ciudadmonumental@melilla.es', tel: '+34952976201',
  shuttle: { tel: '+34695735790', hours: { es: 'L–V 8:00–20:00 · S 8:00–15:00', en: 'Mon–Fri 8:00–20:00 · Sat 8:00–15:00', fr: 'lun–ven 8h–20h · sam 8h–15h', ar: 'الإثنين–الجمعة 8:00–20:00 · السبت 8:00–15:00' },
    stops: ['Plaza del Veedor (Melilla la Vieja)', 'Plaza de España', 'Plaza Torres Quevedo', 'Centro de Salud Zona Centro', 'Mercado Central', 'Hospital Universitario', 'Clínica Rusadir'] } };

const TGM = 'Tu Guía en Melilla', TGM_URL = 'https://tuguiaenmelilla.com/';
window.VISITAS = [
  { n: 1, name: 'Aljibes', pl: false, m: 'g', r: 'I', at: 'Plaza de la Maestranza', d: 30, cap: '<30', by: '' },
  { n: 2, name: 'Museos Peñuelas', m: 'g', r: 'I', at: 'Plaza de la Maestranza', d: 45, cap: '<30', by: '' },
  { n: 3, name: 'Túnel de Santa Ana y Capilla de Santiago', m: 'g', r: 'I', at: 'Plaza de la Maestranza', d: 30, cap: '<30', by: '' },
  { n: 4, name: 'Melilla Fenicia', m: 'g', r: 'I', at: 'Plaza de Estopiñán', d: 45, cap: '<30', by: '' },
  { n: 5, name: 'Museo Casa del Reloj', m: 'g', r: 'I', at: 'Plaza de Estopiñán', d: 45, cap: '<30', by: '' },
  { n: 6, name: 'Iglesia de la Purísima', m: 'g', r: 'I', at: 'Calle Miguel Acosta', d: 30, cap: '<30', by: '' },
  { n: 7, name: 'Museo de Arte Sacro', m: 'g', r: 'I', at: 'Calle Miguel Acosta', d: 30, cap: '<30', by: '' },
  { n: 8, name: 'Cuevas del Conventico', m: 'g', r: 'I', at: 'Calle Miguel Acosta', d: 45, cap: '<30', by: '' },
  { n: 9, name: 'Faro Torre del Bonete', m: 'g', r: 'I', at: '', d: 30, cap: '<30', by: '' },
  { n: 10, name: 'CIMLaV (Centro de Interpretación de Melilla la Vieja)', m: 'g', r: 'I', at: 'Torreón de los Cabestrantes', d: 30, cap: '<30', by: '' },
  { n: 11, name: 'Memoria y Pluma', m: 'g', r: 'I', at: 'Torreón de los Cabestrantes', d: 45, cap: '<30', by: 'Biblioteca Macondo', url: 'https://bibliotecamacondojaf.blogspot.com/2019/04/memoria-y-pluma-encarna-leon-itinerario.html' },
  { n: 12, name: 'Plaza de Armas', m: 'g', r: 'II', at: 'Túnel de las Victorias', d: 30, cap: '<30', by: '' },
  { n: 13, name: 'Foso del Hornabeque', m: 'g', r: 'III', at: 'Plaza de las Culturas', d: 30, cap: '<30', by: '' },
  { n: 14, name: 'Galería de Minas', m: 'x', r: 'IV', at: 'Cerro del Cubo', d: 60, cap: '<20', by: '' },
  { n: 15, name: 'Torreón de las Cinco Palabras', m: 'x', r: 'III', at: 'Zona media de la Alcazaba', d: 30, cap: '<30', by: '' },
  { n: 16, name: 'Mina de San José', m: 'x', r: 'III', at: 'Bajo las murallas del Mantelete', d: 30, cap: '<15', by: '' },
  { n: 17, name: 'Puerta de Santiago', m: 'x', r: 'I', at: 'Capilla de Santiago', d: 45, cap: '<15', by: '' },
  { n: 18, name: 'Hospital del Rey', m: 'x', r: 'I', at: 'Hospital del Rey', d: 30, cap: '<30', by: '' },
  { n: 19, name: 'Puerta del Socorro', m: 'x', r: 'I', at: 'Hospital del Rey', d: 30, cap: '<15', by: '' },
  { n: 20, name: 'Museo de la Imprenta', m: 'x', r: 'I', at: 'Hospital del Rey', d: 45, cap: '<30', by: '' },
  { n: 21, name: 'Antigua Farmacia Militar', m: 'x', r: 'I', at: 'Calle Miguel Acosta', d: 45, cap: '<30', by: '' },
  { n: 22, name: 'Descubriendo Melilla la Vieja de la mano del Mariscal Sherlock', m: 't', r: 'III', at: 'Plaza de las Culturas', d: 60, cap: '<30', by: 'Sibila Teatros' },
  { n: 23, name: 'La Melilla Sefardí', m: 's', r: 'I', at: 'Plaza de la Maestranza', d: 120, cap: '<30', by: 'Mem Guímel' },
  { n: 24, name: 'Melilla Modernista caminando', m: 's', r: 'mod', at: 'Triángulo de Oro', d: 45, cap: '', by: 'Mem Guímel' },
  { n: 25, name: 'Melilla Modernista VIP (en bus, 7 plazas)', m: 's', r: 'mod', at: 'Triángulo de Oro', d: 120, cap: '<7', by: 'Mem Guímel' },
  { n: 26, name: 'Fuertes del Cubo', m: 'g', r: 'IV', at: 'Cerro del Cubo', d: 60, cap: '<50', by: '' },
  { n: 27, name: 'Fuerte de Victoria Grande', m: 'g', r: 'IV', at: 'Cerro del Cubo', d: 45, cap: '<50', by: '' },
  { n: 28, name: 'Fuerte de Victoria Chica', m: 'g', r: 'IV', at: 'Cerro del Cubo', d: 30, cap: '', by: '' },
  { n: 29, name: 'Fuerte del Rosario', m: 'g', r: 'IV', at: 'Cerro del Cubo', d: 30, cap: '', by: '' },
  { n: 30, name: 'Galería Victoria Grande – Victoria Chica', m: 'g', r: 'IV', at: 'Cerro del Cubo', d: 30, cap: '<20', by: '' },
  { n: 31, name: 'Plaza de Toros', m: 'g', r: 'ext', at: 'Cerro de San Lorenzo', d: 30, cap: '<50', by: '' },
  { n: 32, name: 'Plaza de Toros completa', m: 'g', r: 'ext', at: 'Cerro de San Lorenzo', d: 60, cap: '<50', by: '' },
  { n: 33, name: 'Cementerio: Héroes', m: 's', r: 'ext', at: 'Cementerio de la Purísima', d: 60, cap: '', by: 'Oxígeno Laboratorio Cultural' },
  { n: 34, name: 'Cementerio de noche', m: 'p', r: 'ext', at: 'Cementerio de la Purísima', d: 60, cap: '', by: '' },
  { n: 35, name: 'Melilla la Vieja, el origen', m: 'p', r: 'III', at: 'Plaza de las Culturas', d: 120, cap: '', by: TGM, url: TGM_URL },
  { n: 36, name: 'Secretos del Modernismo', m: 'p', r: 'mod', at: 'Triángulo de Oro', d: 90, cap: '', by: TGM, url: TGM_URL },
  { n: 37, name: 'Misterios y leyendas', m: 'p', r: 'hist', at: 'Cementerio de la Purísima', d: 90, cap: '', by: TGM, url: TGM_URL },
  { n: 38, name: 'Sende Ruta de Melilla', m: 'p', r: '', at: 'Explanada del Cuartel de la Legión', d: 180, cap: '', by: TGM, url: TGM_URL },
  { n: 39, name: 'Ellas, mujeres en la historia de Melilla', m: 'p', r: '', at: 'Hospital de la Cruz Roja', d: 90, cap: '', by: TGM, url: TGM_URL },
  { n: 40, name: 'Tour privado Melilla esencial', m: 'p', r: '', at: 'Plaza de las Culturas', d: 180, cap: '', by: TGM, url: TGM_URL },
  { n: 41, name: 'Sabores de la ciudad', m: 'p', r: 'gastro', at: 'Plaza de España', d: 180, cap: '', by: TGM, url: TGM_URL },
  { n: 42, name: 'Melilla en bicicleta', m: 'p', r: 'bici', at: 'Plaza de Toros', d: 120, cap: '', by: TGM, url: TGM_URL },
  { n: 43, name: 'Melilla en paddle surf', m: 'p', r: 'sup', at: 'Puerto Deportivo', d: 180, cap: '', by: TGM, url: TGM_URL },
  { n: 44, name: 'Tour virtual', m: 'g', r: 'virt', at: 'Online', d: 50, cap: '', by: TGM, url: TGM_URL },
  { n: 45, name: 'Excursión a Marruecos: monte Gurugú y Nador', m: 'p', r: 'intl', at: 'Rotonda de la frontera de Beni Enzar', d: 240, cap: '', by: TGM, url: TGM_URL }
];

// Textos de la sección (se añaden a I18N)
(function () {
  const S = {
    es: { vis: 'Visitas guiadas', vis_title: 'Visitas guiadas y rutas monumentales', vis_kick: 'Fundación Melilla Monumental', vis_sub: '45 itinerarios por los cuatro recintos, el modernismo y la ciudad, muchos gratis.',
      vis_free: 'gratuitas', vis_all: 'Todas', vis_book: 'Reservar visita', vis_contact: 'Contactar', vis_more: 'Más información', vis_meet: 'Punto de encuentro', vis_cap: 'Grupo', vis_by: 'Organiza', vis_own: 'Fundación Melilla Monumental',
      vis_m_g: 'Gratis', vis_m_s: 'Subvencionada', vis_m_p: 'Privada', vis_m_t: 'Teatralizada', vis_m_x: 'Próximamente',
      vis_r_I: 'Primer recinto', vis_r_II: 'Segundo recinto', vis_r_III: 'Tercer recinto', vis_r_IV: 'Cuarto recinto (Cerro del Cubo)', vis_r_mod: 'Modernismo', vis_r_ext: 'Fuera del centro', vis_r_hist: 'Historia', vis_r_bici: 'En bicicleta', vis_r_sup: 'Paddle surf', vis_r_gastro: 'Gastronomía', vis_r_virt: 'Virtual', vis_r_intl: 'Excursión a Marruecos', vis_r_: 'Otras',
      vis_half: 'Medio día', vis_none: 'No hay visitas con estos filtros.', vis_note: 'Horarios, días y reserva se confirman con la Fundación: el catálogo puede cambiar.',
      vis_src: 'Datos del catálogo de melillamonumental.es, revisado el {d}.', vis_soon: 'Aún sin fecha: la Fundación las anuncia como próximas.',
      vis_tip: 'Cómo encajarlas', vis_tip1: 'Las del primer recinto salen de plazas a pocos metros: puedes encadenar Aljibes, Túnel de Santa Ana y Cuevas del Conventico en una mañana.',
      vis_tip2: 'Para el modernismo, combina una visita guiada con nuestra ruta con audioguía por el Ensanche.', vis_tip3: 'Las del Cerro del Cubo quedan lejos del centro: ve en taxi o coche.',
      shuttle: 'Bus gratis a Melilla la Vieja', shuttle_sub: 'Transporte a demanda gratuito. Pídelo con al menos 6 horas de antelación por llamada o WhatsApp.', shuttle_stops: 'Puntos de recogida', vis_see: 'Ver el sitio' },
    en: { vis: 'Guided tours', vis_title: 'Guided tours and heritage walks', vis_kick: 'Melilla Monumental Foundation', vis_sub: '45 tours across the four fortified enclosures, Modernism and the city — many of them free.',
      vis_free: 'free', vis_all: 'All', vis_book: 'Book a tour', vis_contact: 'Contact', vis_more: 'More info', vis_meet: 'Meeting point', vis_cap: 'Group', vis_by: 'Run by', vis_own: 'Melilla Monumental Foundation',
      vis_m_g: 'Free', vis_m_s: 'Subsidised', vis_m_p: 'Private', vis_m_t: 'Theatrical', vis_m_x: 'Coming soon',
      vis_r_I: 'First enclosure', vis_r_II: 'Second enclosure', vis_r_III: 'Third enclosure', vis_r_IV: 'Fourth enclosure (Cerro del Cubo)', vis_r_mod: 'Modernism', vis_r_ext: 'Outside the centre', vis_r_hist: 'History', vis_r_bici: 'By bike', vis_r_sup: 'Paddle surf', vis_r_gastro: 'Food', vis_r_virt: 'Virtual', vis_r_intl: 'Trip to Morocco', vis_r_: 'Other',
      vis_half: 'Half day', vis_none: 'No tours match these filters.', vis_note: 'Times, days and booking are confirmed by the Foundation; the catalogue may change.',
      vis_src: 'Data from the melillamonumental.es catalogue, checked on {d}.', vis_soon: 'No date yet: announced by the Foundation as coming soon.',
      vis_tip: 'How to fit them in', vis_tip1: 'First-enclosure tours start from squares a few steps apart: Aljibes, Santa Ana Tunnel and Conventico Caves fit in one morning.',
      vis_tip2: 'For Modernism, pair a guided tour with our audio-guide walk through the Ensanche.', vis_tip3: 'Cerro del Cubo tours are far from the centre: take a taxi or car.',
      shuttle: 'Free bus to Melilla la Vieja', shuttle_sub: 'Free on-demand transport. Book at least 6 hours ahead by phone or WhatsApp.', shuttle_stops: 'Pick-up points', vis_see: 'See the place' },
    fr: { vis: 'Visites guidées', vis_title: 'Visites guidées et parcours patrimoniaux', vis_kick: 'Fondation Melilla Monumental', vis_sub: '45 itinéraires dans les quatre enceintes, le modernisme et la ville, dont beaucoup gratuits.',
      vis_free: 'gratuites', vis_all: 'Toutes', vis_book: 'Réserver', vis_contact: 'Contacter', vis_more: 'Plus d’infos', vis_meet: 'Point de rendez-vous', vis_cap: 'Groupe', vis_by: 'Organisé par', vis_own: 'Fondation Melilla Monumental',
      vis_m_g: 'Gratuite', vis_m_s: 'Subventionnée', vis_m_p: 'Privée', vis_m_t: 'Théâtralisée', vis_m_x: 'Bientôt',
      vis_r_I: 'Première enceinte', vis_r_II: 'Deuxième enceinte', vis_r_III: 'Troisième enceinte', vis_r_IV: 'Quatrième enceinte (Cerro del Cubo)', vis_r_mod: 'Modernisme', vis_r_ext: 'Hors centre', vis_r_hist: 'Histoire', vis_r_bici: 'À vélo', vis_r_sup: 'Paddle', vis_r_gastro: 'Gastronomie', vis_r_virt: 'Virtuelle', vis_r_intl: 'Excursion au Maroc', vis_r_: 'Autres',
      vis_half: 'Demi-journée', vis_none: 'Aucune visite avec ces filtres.', vis_note: 'Horaires, jours et réservation à confirmer auprès de la Fondation ; le catalogue peut changer.',
      vis_src: 'Données du catalogue de melillamonumental.es, vérifié le {d}.', vis_soon: 'Pas encore de date : annoncées comme prochaines.',
      vis_tip: 'Comment les combiner', vis_tip1: 'Les visites de la première enceinte partent de places voisines : Aljibes, tunnel de Santa Ana et grottes du Conventico en une matinée.',
      vis_tip2: 'Pour le modernisme, associez une visite guidée à notre parcours audioguidé dans l’Ensanche.', vis_tip3: 'Le Cerro del Cubo est loin du centre : prenez un taxi ou une voiture.',
      shuttle: 'Bus gratuit vers Melilla la Vieja', shuttle_sub: 'Transport gratuit à la demande. Réservez au moins 6 h à l’avance par appel ou WhatsApp.', shuttle_stops: 'Points de prise en charge', vis_see: 'Voir le lieu' },
    ar: { vis: 'جولات مع مرشد', vis_title: 'جولات مع مرشد ومسارات تراثية', vis_kick: 'مؤسسة مليلية الأثرية', vis_sub: '45 مسارًا في الأسوار الأربعة والحداثة والمدينة، وكثير منها مجاني.',
      vis_free: 'مجانية', vis_all: 'الكل', vis_book: 'احجز جولة', vis_contact: 'اتصل', vis_more: 'مزيد من المعلومات', vis_meet: 'نقطة اللقاء', vis_cap: 'المجموعة', vis_by: 'تنظيم', vis_own: 'مؤسسة مليلية الأثرية',
      vis_m_g: 'مجانية', vis_m_s: 'مدعومة', vis_m_p: 'خاصة', vis_m_t: 'مسرحية', vis_m_x: 'قريبًا',
      vis_r_I: 'السور الأول', vis_r_II: 'السور الثاني', vis_r_III: 'السور الثالث', vis_r_IV: 'السور الرابع (تلة الكوبو)', vis_r_mod: 'الحداثة', vis_r_ext: 'خارج المركز', vis_r_hist: 'تاريخ', vis_r_bici: 'بالدراجة', vis_r_sup: 'التجديف وقوفًا', vis_r_gastro: 'مأكولات', vis_r_virt: 'افتراضية', vis_r_intl: 'رحلة إلى المغرب', vis_r_: 'أخرى',
      vis_half: 'نصف يوم', vis_none: 'لا توجد جولات بهذه المرشحات.', vis_note: 'تؤكد المؤسسة المواعيد والأيام والحجز؛ قد يتغير البرنامج.',
      vis_src: 'بيانات من برنامج melillamonumental.es، تمت مراجعتها في {d}.', vis_soon: 'بدون تاريخ بعد: أعلنتها المؤسسة كجولات قادمة.',
      vis_tip: 'كيف تنظمها', vis_tip1: 'جولات السور الأول تنطلق من ساحات متقاربة: يمكنك الجمع بين الصهاريج ونفق سانتا آنا وكهوف الكونفينتيكو في صباح واحد.',
      vis_tip2: 'للحداثة، اجمع جولة مع مرشد مع مسارنا بالدليل الصوتي.', vis_tip3: 'تلة الكوبو بعيدة عن المركز: استخدم سيارة أجرة.',
      shuttle: 'حافلة مجانية إلى مليلية القديمة', shuttle_sub: 'نقل مجاني عند الطلب. اطلبه قبل 6 ساعات على الأقل بالهاتف أو واتساب.', shuttle_stops: 'نقاط الركوب', vis_see: 'عرض المكان' }
  };
  for (const l in S) Object.assign(window.I18N[l], S[l]);
})();
