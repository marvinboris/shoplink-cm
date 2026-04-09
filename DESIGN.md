# DESIGN.md — ShopLink CM
## Prompt de Mise à Jour du Design (projet existant)

---

## CONTEXTE

ShopLink CM est un SaaS de social commerce pour vendeurs camerounais sur WhatsApp/Instagram/TikTok, déjà développé fonctionnellement. Ce prompt a pour unique objectif de **refondre l'interface visuellement** sans toucher à la logique métier, aux routes, ni aux appels API existants. Chaque composant doit être retouché ou réécrit sur le plan du style uniquement, sauf indication contraire.

---

## MISSION

Faire de ShopLink CM l'application de social commerce la **plus belle et la plus désirable d'Afrique**. L'interface cible des vendeuses actives sur Instagram et TikTok — elles ont l'œil, elles comparent. Si c'est moche, elles n'achèteront pas. Le design doit être chaud, vivant, moderne et donner envie de partager sa boutique avec fierté.

Deux interfaces à refondre distinctement :
1. **App Vendeur** (dashboard) — gestion, analytics, commandes
2. **Page Catalogue Public** (ce que le client voit) — vitrine, commande, paiement

---

## PHASE 0 — AUDIT VISUEL OBLIGATOIRE

Avant de modifier quoi que ce soit :

1. **Parcours complet de l'app** : ouvre chaque page (dashboard, catalogue public, onboarding, commandes, paramètres) et documente l'état actuel dans `AUDIT.md`
2. **Recherche design de référence** via web search :
   - Dribbble : "mobile SaaS dashboard warm 2024", "e-commerce catalog mobile UI", "social commerce app design", "storefront link mobile"
   - Behance : "African e-commerce UI", "vendor dashboard mobile"
   - Références produit : Stan.store, Gumroad, Linktree — étudie leur onboarding et leur catalogue
3. **Inventaire des composants** : liste tous les fichiers de composants existants, classe-les par fréquence d'utilisation et impact visuel (ProductCard, OrderCard, DashboardStats, CatalogPage, CheckoutSheet, etc.)

---

## SYSTÈME DE DESIGN — "SAVANE URBAINE"

### Tokens CSS (remplacer globals.css ou équivalent)

```css
:root {
  /* Couleurs primaires */
  --primary: #FF4D00;
  --primary-light: #FF6B35;
  --primary-dark: #D93D00;
  --primary-soft: rgba(255, 77, 0, 0.10);
  --primary-ultra-soft: rgba(255, 77, 0, 0.05);

  /* Fonds clairs (app vendeur et catalogue) */
  --bg-base: #F8F6F2;
  --bg-surface: #FFFFFF;
  --bg-elevated: #F2EFE9;
  --bg-hover: #EBE7E0;

  /* Accents sémantiques */
  --accent-green: #00C48C;
  --accent-green-soft: rgba(0, 196, 140, 0.10);
  --accent-gold: #FFB800;
  --accent-gold-soft: rgba(255, 184, 0, 0.10);

  /* Texte */
  --text-1: #1A1A2E;
  --text-2: #4B5563;
  --text-3: #9CA3AF;

  /* Bordures */
  --border-subtle: #E8E3DC;
  --border-default: #D4CEC5;
  --border-strong: #B5AFA4;

  /* Ombres chaudes (teintées beige/orange, pas grises) */
  --shadow-sm: 0 1px 4px rgba(26,26,46,0.06);
  --shadow-md: 0 4px 16px rgba(26,26,46,0.08);
  --shadow-lg: 0 8px 32px rgba(26,26,46,0.12);
  --shadow-card-hover: 0 8px 32px rgba(255,77,0,0.10), 0 2px 8px rgba(26,26,46,0.08);
  --shadow-primary: 0 4px 20px rgba(255,77,0,0.30);

  /* Géométrie */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 120ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-default: 220ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 380ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-bounce: 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Typographie (mettre à jour next/font ou @import)

```css
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=Outfit:wght@500;600;700;800&display=swap');

:root {
  --font-display: 'Bricolage Grotesque', sans-serif;  /* Titres, noms de boutique, héros */
  --font-body: 'DM Sans', sans-serif;                  /* Corps, labels, descriptions */
  --font-data: 'Outfit', sans-serif;                   /* Prix, chiffres, stats */
}

body {
  font-family: var(--font-body);
  background-color: var(--bg-base);
  color: var(--text-1);
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, .shop-name { font-family: var(--font-display); }
.price, .stat-value, .amount { font-family: var(--font-data); font-variant-numeric: tabular-nums; }
```

---

## COMPOSANTS APP VENDEUR À REFONDRE

### 1. Onboarding Wizard

**Objectif** : Zéro friction, excitation croissante, célébration finale mémorable.

```
Structure :
- Fond : var(--bg-base) + motif géométrique très léger en background (losanges, opacity 0.03)
- Progress bar : trait fin en haut de page, couleur var(--primary), transition width smooth
- Numéro d'étape : "1 sur 4" en var(--text-3), DM Sans 400, 13px
- Headline de chaque étape : Bricolage Grotesque 700, 28px, var(--text-1)

Étape 1 (Téléphone + OTP) :
- Grand input centré, height 56px, font-size 20px, radius var(--radius-lg)
- Sous le champ : "Nous vous enverrons un code par SMS"
- Bouton "Recevoir mon code" : var(--primary), border-radius var(--radius-full), shadow var(--shadow-primary)
- Champs OTP : 6 cases séparées, focus → bordure var(--primary)

Étape 4 (Premier produit) :
- Zone d'upload photo : pointillés var(--border-default) avec icône appareil photo centré
  Hover : fond var(--primary-ultra-soft), bordure var(--primary) en pointillés
  Après upload : aperçu pleine zone avec bouton "Changer"

Célébration finale :
- Confetti canvas (canvas-confetti library) pendant 3 secondes
- Illustration SVG "🎉 Votre boutique est live !" 
- Lien de la boutique en grand : fond var(--primary-soft), texte var(--primary), Outfit 600
- Boutons : "Partager sur WhatsApp" (fond #25D366) + "Voir ma boutique" (fond var(--primary))
- Animation : scale 0 → 1 avec bounce sur le bloc de célébration
```

### 2. Bottom Navigation (mobile)

```css
.bottom-nav {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  height: 64px;
  background: var(--bg-surface);
  border-top: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 50;
  box-shadow: 0 -4px 20px rgba(26,26,46,0.06);
}

.nav-item {
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  transition: background var(--transition-fast);
}

.nav-item.active {
  color: var(--primary);
}

.nav-item.active .nav-icon {
  background: var(--primary-soft);
  border-radius: var(--radius-sm);
  padding: 4px 12px;
}

.nav-label { font-size: 10px; font-family: var(--font-body); font-weight: 500; }
```

### 3. Dashboard Principal

**Header :**
```
- "Bonjour [Prénom] 👋" : Bricolage Grotesque 700, 22px, var(--text-1)
- Date du jour : DM Sans 400, 14px, var(--text-3)
- Photo de profil : 40px, cercle, bordure 2px var(--primary)
- Cloche notifications : badge rouge pulsant si nouvelles notifs
```

**Carte Revenus du Jour :**
```
- Fond dégradé : linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)
- Border-radius : var(--radius-xl)
- Montant : Outfit 800, 36px, blanc
- "Revenus aujourd'hui" : DM Sans 400, 14px, rgba(255,255,255,0.75)
- Sparkline 7 jours : SVG path blanc, opacity 0.5
- Variation % : badge blanc semi-transparent, vert si positif
- Padding : 24px
- Ombre : var(--shadow-primary)
```

**Stats Cards (grille 2x2) :**
```
Chaque card :
- Fond : var(--bg-surface)
- Bordure : 1px var(--border-subtle)
- Radius : var(--radius-lg)
- Icône : carré 36px, fond coloré soft, icône 18px
- Valeur : Outfit 700, 24px, var(--text-1)
- Label : DM Sans 400, 12px, var(--text-3)
- Variation : 11px, vert/rouge selon signe
```

**Feed Activité Temps Réel :**
```
Chaque entrée animée (fade-in + slide depuis la droite) :
- Bordure gauche 3px : var(--accent-green) si paiement, var(--primary) si commande, var(--accent-gold) si nouveau client
- Fond : var(--bg-surface)
- Radius : var(--radius-md)
- Timestamp : DM Sans 400, 11px, var(--text-3)
```

### 4. ProductCard (composant critique)

```css
.product-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition:
    transform var(--transition-default),
    box-shadow var(--transition-default),
    border-color var(--transition-default);
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-card-hover);
  border-color: var(--border-default);
}

.product-card:active {
  transform: scale(0.98);
}
```

Structure interne :
```
[IMAGE - ratio 1:1]
  → object-fit: cover
  → skeleton shimmer pendant chargement
  → badge "PROMO 🔥" : fond var(--primary), texte blanc, Outfit 600, 11px, radius var(--radius-full), padding 3px 8px
  → badge "⚡ Dernier" : fond var(--accent-gold-soft), texte var(--accent-gold), même style
  → toggle dispo (coin haut-droite en mode dashboard) : pill vert/gris

[CONTENU - padding 12px]
  → Nom : DM Sans 600, 14px, var(--text-1), max 2 lignes, line-clamp-2
  → Prix : Outfit 700, 18px, var(--text-1)
  → Prix barré : DM Sans 400, 14px, var(--text-3), text-decoration: line-through
  → Stock : DM Sans 400, 12px, var(--text-3) — "12 en stock" ou "Rupture" en rouge
```

### 5. Gestion Commandes (Kanban)

**Colonnes du Kanban :**
```
En-tête colonne :
- Nom statut : DM Sans 700, 13px, var(--text-2), UPPERCASE, letter-spacing 0.06em
- Compteur : badge rond, fond var(--bg-elevated), var(--text-3), Outfit 600, 12px

Card commande :
- Fond : var(--bg-surface)
- Bordure gauche 4px colorée par statut :
    En attente → var(--accent-gold)
    Payé      → var(--accent-green)
    Expédié   → couleur neutre (#818CF8)
    Annulé    → #F87171
- Nom client : DM Sans 600, 14px
- Produits : thumbnails 28px empilés (max 3 + "+N")
- Montant : Outfit 700, 16px, var(--primary)
- Heure : DM Sans 400, 11px, var(--text-3)
- Bouton WhatsApp : icône #25D366, 20px, opacity 0.7 → 1 au hover

Drag & drop entre colonnes :
- Card draggée : opacity 0.5 + rotation 2deg + shadow forte
- Zone de drop active : fond var(--primary-ultra-soft), bordure pointillée var(--primary)
```

### 6. Paramètres — Sélecteur de Thème Boutique

```
8 thèmes à afficher en grille 4x2 :
Chaque option : 
- Aperçu miniature 80x60px de la page catalogue dans ce thème
- Nom du thème sous l'aperçu : DM Sans 500, 12px
- Sélectionné : bordure 2px var(--primary) + checkmark blanc en overlay
- Hover : scale(1.05) + shadow

Thèmes disponibles à créer :
1. "Savane" — orange + beige (thème par défaut)
2. "Nuit" — fond #0D1117, accents violets
3. "Rose Gold" — fond blanc cassé, accents #C9A96E et rose
4. "Jungle" — fond sombre, accent vert #2D6A4F
5. "Soleil" — fond jaune doux #FFFBEB, accents ambre
6. "Encre" — noir pur + blanc, typographie oversize
7. "Corail" — fond blush #FFF0F0, accents corail #FF6B6B
8. "Royal" — fond marine #0A1628, accents or #FFD700
```

---

## PAGE CATALOGUE PUBLIC (/boutique/[slug])

C'est la page la plus importante : c'est ce que le client voit. Elle doit être **la plus belle vitrine mobile jamais vue au Cameroun**.

### Structure générale

```
[HEADER BOUTIQUE]
- Photo de couverture : full-width, height 160px, object-fit: cover
  Overlay dégradé en bas : transparent → var(--bg-surface)
- Avatar boutique : 72px, cercle, bordure 3px var(--bg-surface), shadow var(--shadow-md)
  Positionné à cheval sur la couverture (-36px de margin-top)
- Nom boutique : Bricolage Grotesque 700, 22px
- Bio : DM Sans 400, 14px, var(--text-2), max 2 lignes
- Stats : "124 produits • 4.9 ⭐ • Membre depuis 2024" — DM Sans 400, 12px, var(--text-3)
- Bouton WhatsApp STICKY (position fixed, top 16px, right 16px, z-index 50) :
    Fond #25D366, icône WhatsApp blanc, shadow verte, border-radius var(--radius-full)

[NAVIGATION CATÉGORIES]
- Scroll horizontal (overflow-x: auto, scrollbar-width: none)
- Tab actif : fond var(--primary), texte blanc, radius var(--radius-full)
- Tab inactif : fond var(--bg-elevated), texte var(--text-2)
- Padding tab : 8px 16px
- Font : DM Sans 600, 14px
- Gap : 8px

[GRILLE PRODUITS]
- 2 colonnes sur mobile, 3 sur desktop
- Gap : 12px
- Padding horizontal : 16px

[FOOTER BOUTIQUE]
- "Propulsé par ShopLink CM" : DM Sans 400, 11px, var(--text-3)
  → disparaît sur plan payant
```

### ProductCard Catalogue (version publique)

```css
.catalog-card {
  background: var(--bg-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-default), box-shadow var(--transition-default);
  cursor: pointer;
}

.catalog-card:active {
  transform: scale(0.97);
}
```

```
[IMAGE ratio 1:1]
  → lazy loading + skeleton
  → badge "PROMO" (fond var(--primary)) si compare_price présent
  → badge "⚡ Dernier" (fond var(--accent-gold-soft)) si stock ≤ 2
  → bouton cœur en overlay : animation fill scale 1 → 1.3 → 1

[CONTENU padding 10px]
  → Nom : DM Sans 600, 13px, line-clamp-2
  → Prix : Outfit 700, 16px, var(--text-1)
  → Prix barré : 12px, var(--text-3), line-through
  → Bouton "Commander" : pleine largeur, var(--primary), DM Sans 600, 14px
    radius: var(--radius-md), height: 36px
    Tap → ouvre le BottomSheet de commande
```

### BottomSheet de Commande

```
- Fond : var(--bg-surface)
- Radius haut : var(--radius-xl) var(--radius-xl) 0 0
- Handle : 4px x 32px, fond var(--border-default), centré en haut, margin-top 8px
- Animation : slide-up depuis le bas (translateY 100% → 0), duration 300ms, ease-out
- Backdrop : rgba(0,0,0,0.4), backdrop-filter: blur(4px)

Contenu :
- En-tête : photo produit 48px + nom + prix, en ligne
- Sélecteur quantité : boutons - et + avec valeur centrale, font Outfit 600
- Séparateur : 1px var(--border-subtle) + label section "Vos informations"
- Inputs : height 48px, fond var(--bg-elevated), radius var(--radius-md), bordure var(--border-subtle)
  Focus : bordure var(--primary), ring var(--primary-soft) 3px
- Sélecteur paiement :
    Chaque option : card avec radio, icône opérateur, nom — sélectionné → bordure var(--primary) + fond var(--primary-ultra-soft)
- CTA final "Payer [montant] FCFA" : pleine largeur, height 52px, var(--primary)
  Outfit 700, 16px, radius var(--radius-lg), shadow var(--shadow-primary)
  État loading : spinner blanc centré

Page succès (après paiement validé) :
- Confetti canvas-confetti (3 secondes, couleurs var(--primary) + var(--accent-green) + var(--accent-gold))
- Checkmark animé : cercle vert qui se dessine (SVG stroke-dashoffset animation), puis ✓ fade-in
- "Commande confirmée !" : Bricolage Grotesque 700, 26px
- Numéro de commande : Outfit 500, 14px, var(--text-2)
- Récapitulatif dans une card : produits + total + infos client
- Bouton "Voir d'autres produits" → ferme le sheet et recharge le catalogue
- Bouton "Partager ma commande" → Web Share API (screenshot ou lien)
```

---

## ANIMATIONS & MICRO-INTERACTIONS

```css
/* Entrée des éléments (stagger) */
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.product-card,
.order-card,
.stat-card {
  animation: fadeSlideUp 0.35s ease both;
}

/* Délais staggerés pour les grilles */
.product-card:nth-child(1) { animation-delay: 0.00s; }
.product-card:nth-child(2) { animation-delay: 0.04s; }
.product-card:nth-child(3) { animation-delay: 0.08s; }
.product-card:nth-child(4) { animation-delay: 0.12s; }
/* ...continuer jusqu'à nth-child(10) */

/* Skeleton shimmer */
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, var(--bg-elevated) 25%, var(--bg-hover) 50%, var(--bg-elevated) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: var(--radius-sm);
}

/* Pulse notification */
@keyframes pulse-dot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50%       { transform: scale(1.4); opacity: 0.7; }
}
.notif-dot { animation: pulse-dot 1.5s infinite; }

/* Toggle disponibilité produit */
.toggle-thumb {
  transition: transform var(--transition-bounce);
}
```

Tous les éléments interactifs :
- `:active` → `transform: scale(0.96)` (sauf les inputs)
- Boutons principaux `:hover` → `box-shadow: var(--shadow-primary)` + légère élévation
- Icônes de navigation `:active` → scale 0.85 avec bounce retour

---

## EFFETS D'AMBIANCE

```css
/* Fond app légèrement texturé (beige chaud, pas blanc pur) */
body {
  background-color: var(--bg-base);  /* #F8F6F2 */
}

/* Grain très subtil sur la carte revenus */
.revenue-card::after {
  content: '';
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,..."); /* noise SVG */
  opacity: 0.04;
  border-radius: inherit;
  pointer-events: none;
}

/* Bordures avec gradient sur les sections importantes */
.featured-section {
  border: 1px solid;
  border-image: linear-gradient(135deg, var(--primary-soft), transparent) 1;
}

/* Ombre chaude sur les cards (pas grise) */
.card-warm-shadow {
  box-shadow: 0 4px 16px rgba(255, 107, 53, 0.08), 0 1px 4px rgba(26,26,46,0.06);
}
```

---

## RESPONSIVE MOBILE-FIRST

Breakpoints :
```css
/* Mobile 375px — écrire en premier */
/* Tablet */  @media (min-width: 640px)  { ... }
/* Desktop */ @media (min-width: 1024px) { ... }
```

Règles mobile absolues :
- Hauteur minimale de toute zone tappable : 44px
- Padding latéral des pages : 16px (jamais moins)
- Inputs : height minimum 48px, font-size 16px (évite le zoom auto iOS)
- Bottom navigation : toujours visible (height 64px + safe area)
- BottomSheet : max-height 90vh avec scroll interne si contenu long
- Grille produits catalogue : toujours 2 colonnes sur mobile, jamais 1 ni 3

---

## CHECKLIST AVANT LIVRAISON

- [ ] Aucune couleur codée en dur (tout via CSS variables)
- [ ] Aucune font générique (Inter, Roboto, Arial) restante dans le code
- [ ] Skeleton loading sur ProductCard, OrderCard, StatsCards, CatalogGrid
- [ ] Tous les boutons ont `:hover`, `:active`, `:focus-visible`, `:disabled` stylés
- [ ] Bottom navigation visible et fonctionnelle sur mobile (375px, 390px, 430px)
- [ ] BottomSheet de commande testé sur iOS Safari (gestion du safe-area-inset-bottom)
- [ ] Confetti de célébration (onboarding + paiement validé) fonctionnel
- [ ] Page catalogue public testée sans compte vendeur (accès public)
- [ ] 8 thèmes de couleur actifs sur la page catalogue (vérifier que les variables sont bien surchargées)
- [ ] Contraste texte/fond ≥ AA sur tous les thèmes
- [ ] Animations respectent `prefers-reduced-motion`
- [ ] Score Lighthouse Performance ≥ 90 sur la page catalogue /boutique/[slug]
- [ ] PWA manifest + icônes + service worker fonctionnels

---

## ORDRE D'EXÉCUTION

1. Installer les fonts (Bricolage Grotesque + DM Sans + Outfit)
2. Remplacer globals.css avec les tokens définis ci-dessus
3. Bottom Navigation (présente sur toutes les pages mobile)
4. Dashboard : header + carte revenus + stats cards
5. `<ProductCard />` version dashboard (toggle dispo, actions)
6. Page liste produits + formulaire ajout/édition
7. `<OrderCard />` + Kanban commandes
8. **Page catalogue public /boutique/[slug]** ← priorité absolue car c'est la vitrine client
9. `<ProductCard />` version catalogue (bouton Commander)
10. BottomSheet de commande + flow paiement + page succès confetti
11. Onboarding wizard + célébration
12. Paramètres : sélecteur 8 thèmes
13. Analytics : charts et heatmaps

**Valider le rendu dans le navigateur après chaque composant. Tester sur mobile (DevTools 390px) à chaque étape. Ne pas enchaîner sans validation visuelle.**
