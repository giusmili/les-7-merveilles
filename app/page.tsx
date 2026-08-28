const wonders = [
  { number: "01", name: "La Grande Muraille", place: "Chine", tag: "Sur les crêtes", text: "Suivre les lignes de pierre qui ondulent entre les montagnes et découvrir l’une des constructions les plus ambitieuses de l’histoire.", accent: "clay" },
  { number: "02", name: "Pétra", place: "Jordanie", tag: "Cité de grès", text: "Traverser le Siq au petit matin, puis voir apparaître la façade du Trésor sculptée dans la roche rose.", accent: "sand" },
  { number: "03", name: "Le Christ Rédempteur", place: "Brésil", tag: "Rio vu du ciel", text: "Prendre de la hauteur sur le Corcovado et embrasser du regard la baie, les reliefs et l’énergie de Rio de Janeiro.", accent: "forest" },
  { number: "04", name: "Machu Picchu", place: "Pérou", tag: "Au-dessus des nuages", text: "Approcher la cité inca entre brume et sommets andins, dans un paysage où architecture et nature ne font plus qu’un.", accent: "moss" },
  { number: "05", name: "Chichén Itzá", place: "Mexique", tag: "Mémoire maya", text: "Explorer la péninsule du Yucatán et lire dans la pyramide de Kukulcán la précision astronomique du monde maya.", accent: "ochre" },
  { number: "06", name: "Le Colisée", place: "Italie", tag: "Rome éternelle", text: "Entrer dans l’amphithéâtre le plus célèbre de l’Antiquité et imaginer la rumeur de la foule au cœur de Rome.", accent: "wine" },
  { number: "07", name: "Le Taj Mahal", place: "Inde", tag: "Marbre et lumière", text: "Observer le marbre blanc changer de teinte avec le soleil et découvrir un monument pensé comme une déclaration d’amour.", accent: "indigo" },
];

const wondersJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Les sept nouvelles merveilles du monde",
  itemListElement: wonders.map((wonder, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "TouristAttraction",
      name: wonder.name,
      description: wonder.text,
      address: { "@type": "PostalAddress", addressCountry: wonder.place },
    },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(wondersJsonLd) }}
      />
      <main>
        <section className="hero" id="accueil">
        <nav className="nav" aria-label="Navigation principale">
          <a className="brand" href="#accueil" aria-label="Retour à l’accueil"><span className="brand-mark">7</span><span>Merveilles<br />du monde</span></a>
          <div className="nav-links"><a href="#merveilles">Les merveilles</a><a href="#itineraire">L’itinéraire</a></div>
          <a className="nav-cta" href="#merveilles">Commencer le voyage <span aria-hidden="true">↘</span></a>
        </nav>
        <div className="hero-content">
          <p className="eyebrow">Un tour du monde · Sept escales</p>
          <h1>Voyager jusqu’à<br />l’<em>extraordinaire.</em></h1>
          <p className="hero-intro">De la pierre rose de Pétra aux sommets du Machu Picchu, une invitation à parcourir les sept nouvelles merveilles du monde.</p>
          <a className="circle-link" href="#merveilles" aria-label="Découvrir les sept merveilles"><span>Explorer</span><strong aria-hidden="true">↓</strong></a>
        </div>
        <div className="hero-note"><span>Une planète</span><strong>7</strong><span>histoires<br />monumentales</span></div>
        <div className="hero-coordinates">30°19’43” N · 35°26’31” E</div>
      </section>

      <section className="manifesto" aria-label="Introduction"><p>Architecture</p><h2>Sept lieux qui racontent<br />le génie humain.</h2><p>Transmission</p></section>

      <section className="wonders-section" id="merveilles">
        <header className="section-heading">
          <div><span className="section-index">01 / 03</span><p className="eyebrow dark">Le grand voyage</p></div>
          <h2>Les sept<br /><em>incontournables</em></h2>
          <p>Sept monuments, cinq continents et des siècles d’histoire à découvrir.</p>
        </header>
        <div className="wonders-grid">
          {wonders.map((wonder) => (
            <article className={`wonder-card ${wonder.accent}`} key={wonder.name}>
              <div className="card-top"><span>{wonder.number}</span><span>{wonder.place}</span></div>
              <div className="card-copy"><p>{wonder.tag}</p><h3>{wonder.name}</h3><span>{wonder.text}</span></div>
            </article>
          ))}
        </div>
      </section>

      <section className="route-section" id="itineraire">
        <div className="route-copy">
          <span className="section-index light">02 / 03</span><p className="eyebrow">L’itinéraire</p>
          <h2>Un monde.<br /><em>Sept émotions.</em></h2>
          <p>Le voyage se dessine d’est en ouest, entre grandes civilisations, paysages spectaculaires et rencontres contemporaines.</p>
        </div>
        <ol className="route-list">
          {wonders.map((wonder) => <li key={wonder.name}><span>{wonder.number}</span><strong>{wonder.name}</strong><small>{wonder.place}</small></li>)}
        </ol>
      </section>

      <section className="finale"><span className="section-index">03 / 03</span><p className="eyebrow dark">Le prochain départ</p><h2>Le monde est vaste.<br /><em>Commencez ici.</em></h2><a href="#accueil">Revenir au départ <span aria-hidden="true">↑</span></a></section>
      <footer><div className="brand footer-brand"><span className="brand-mark">7</span><span>Merveilles<br />du monde</span></div><p>Un voyage éditorial autour des nouvelles merveilles du monde.<br /><small>© {new Date().getFullYear()} GiusMili</small></p><a href="#accueil">Haut de page</a></footer>
      </main>
    </>
  );
}
