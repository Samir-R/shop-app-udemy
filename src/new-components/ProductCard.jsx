import { useState } from 'react';
import Modal from './Modal';
import './ProductCard.css';

function ProductCard({ product }) {
  const [showAllergenModal, setShowAllergenModal] = useState(false);
  const [showHalalModal, setShowHalalModal] = useState(false);
  const [showKosherModal, setShowKosherModal] = useState(false);

  const handleAddToCart = () => {
    console.log('Ajouter au panier:', product.name);
  };

  const handleAddMenuToCart = () => {
    console.log('Créer un menu avec:', product.name);
  };

  return (
    <>
      <div className="product-card">
        <div className="product-image-container">
          <img src={product.image} alt={product.name} className="product-image" />
          {product.originalPrice && (
            <div className="promo-badge">PROMO</div>
          )}
        </div>

        <div className="product-content">
          <h3 className="product-name">{product.name}</h3>

          <div className="product-icons">
            {product.allergens && product.allergens.length > 0 && (
              <button
                className="icon-btn icon-allergen"
                onClick={() => setShowAllergenModal(true)}
                title="Allergènes"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </button>
            )}

            {product.isSpicy && (
              <div className="icon-badge icon-spicy" title="Épicé">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2Z"/>
                </svg>
              </div>
            )}

            {product.isHalal && (
              <button
                className="icon-btn icon-halal"
                onClick={() => setShowHalalModal(true)}
                title="Halal"
              >
                <span className="icon-text">H</span>
              </button>
            )}

            {product.isKosher && (
              <button
                className="icon-btn icon-kosher"
                onClick={() => setShowKosherModal(true)}
                title="Kosher"
              >
                <span className="icon-text">K</span>
              </button>
            )}
          </div>

          <div className="product-price">
            {product.originalPrice ? (
              <>
                <span className="price-original">{product.originalPrice.toFixed(2)}€</span>
                <span className="price-promo">{product.price.toFixed(2)}€</span>
              </>
            ) : (
              <span className="price-current">{product.price.toFixed(2)}€</span>
            )}
          </div>

          <div className="product-actions">
            {product.hasMenu ? (
              <>
                <button className="btn-cart btn-simple" onClick={handleAddToCart}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  Seul
                </button>
                <button className="btn-cart btn-menu" onClick={handleAddMenuToCart}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg>
                  Menu
                </button>
              </>
            ) : (
              <button className="btn-cart btn-full" onClick={handleAddToCart}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Ajouter au panier
              </button>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showAllergenModal}
        onClose={() => setShowAllergenModal(false)}
        title="Allergènes"
      >
        <div className="allergen-list">
          {product.allergens && product.allergens.length > 0 ? (
            <>
              <p className="allergen-intro">Ce produit contient les allergènes suivants :</p>
              <ul>
                {product.allergens.map((allergen, index) => (
                  <li key={index}>{allergen}</li>
                ))}
              </ul>
              <p className="allergen-warning">
                ⚠️ Si vous êtes allergique à l'un de ces ingrédients, veuillez ne pas consommer ce produit.
              </p>
            </>
          ) : (
            <p>Aucun allergène déclaré pour ce produit.</p>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={showHalalModal}
        onClose={() => setShowHalalModal(false)}
        title="Certification Halal"
      >
        <div className="certification-info">
          <p>✓ Ce produit est certifié <strong>Halal</strong>.</p>
          <p>Tous nos produits halal respectent les normes alimentaires islamiques et sont certifiés par un organisme reconnu.</p>
        </div>
      </Modal>

      <Modal
        isOpen={showKosherModal}
        onClose={() => setShowKosherModal(false)}
        title="Certification Kosher"
      >
        <div className="certification-info">
          <p>✓ Ce produit est certifié <strong>Kosher</strong>.</p>
          <p>Tous nos produits kosher respectent les lois alimentaires juives (Kashrout) et sont certifiés par un rabbin.</p>
        </div>
      </Modal>
    </>
  );
}

export default ProductCard;
