import Link from 'next/link';
import { FaArrowRight, FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { formatPrice } from './homeData';
import './HomeSections.css';

/* Server components: no client JavaScript is shipped for these sections. */

/* ------------------------------------------------------------------ */
/* 1. NEW ARRIVALS - photo-first bento layout                          */
/* ------------------------------------------------------------------ */
function Tile({ product, large = false }) {
  return (
    <Link href={product.href} className={`hs-tile ${large ? 'hs-tile--lg' : ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={large ? product.imageLarge : product.image}
        alt={product.name}
        loading={large ? 'eager' : 'lazy'}
        decoding="async"
      />
      <span className="hs-tile__shade" />
      {product.discount > 0 ? <span className="hs-tile__badge">-{product.discount}%</span> : null}
      <span className="hs-tile__info">
        <small>{product.category}</small>
        <strong>{product.name}</strong>
        <span className="hs-tile__row">
          <span className="hs-tile__price">
            {formatPrice(product.price)}
            {product.oldPrice > 0 ? <s>{formatPrice(product.oldPrice)}</s> : null}
          </span>
          <span className="hs-tile__go" aria-hidden="true">
            <FaArrowUpRightFromSquare />
          </span>
        </span>
      </span>
    </Link>
  );
}

export function NewArrivals({ items }) {
  if (!items?.length) return null;
  const [first, ...rest] = items.slice(0, 5);

  return (
    <section className="hs-section hs-section--white" aria-label="New arrivals">
      <div className="hs-container">
        <div className="hs-bar">
          <div>
            <span className="hs-kicker">Just In</span>
            <h2 className="hs-title">New Arrivals</h2>
          </div>
          <Link href="/products" className="hs-link">
            Shop all products <FaArrowRight />
          </Link>
        </div>

        <div className="hs-bento">
          <Tile product={first} large />
          {rest.map((p) => (
            <Tile key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 2. BEST DEALS - big offer headline + ranked list                    */
/* ------------------------------------------------------------------ */
export function BestDeals({ items, maxDiscount }) {
  if (!items?.length) return null;

  return (
    <section className="hs-section hs-section--dark" aria-label="Best deals">
      <div className="hs-container hs-deals">
        <div className="hs-deals__intro">
          <span className="hs-kicker hs-kicker--gold">Limited Savings</span>
          <h2 className="hs-deals__big">
            {maxDiscount ? (
              <>
                Up to <em>{maxDiscount}%</em> off
              </>
            ) : (
              'Best Deals'
            )}
          </h2>
          <p>Our biggest price drops on solid wood furniture, updated live from the showroom.</p>
          <Link href="/products" className="hs-btn-gold">
            Shop all deals <FaArrowRight />
          </Link>
        </div>

        <ol className="hs-deals__list">
          {items.slice(0, 6).map((p, i) => (
            <li key={p.id}>
              <Link href={p.href} className="hs-deal">
                <span className="hs-deal__rank">{String(i + 1).padStart(2, '0')}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.name} loading="lazy" decoding="async" width="120" height="120" />
                <span className="hs-deal__info">
                  <small>{p.category}</small>
                  <strong>{p.name}</strong>
                  <span className="hs-deal__price">
                    {formatPrice(p.price)}
                    {p.oldPrice > 0 ? <s>{formatPrice(p.oldPrice)}</s> : null}
                  </span>
                </span>
                <span className="hs-deal__off">-{p.discount}%</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 3. CATEGORY SHELF - minimal catalogue style                         */
/* ------------------------------------------------------------------ */
export function CategoryShelf({ shelf, index = 0 }) {
  if (!shelf?.items?.length) return null;

  return (
    <section
      className={`hs-section ${index % 2 === 0 ? 'hs-section--cream' : 'hs-section--white'}`}
      aria-label={shelf.name}
    >
      <div className="hs-container">
        <div className="hs-cat__head">
          <div className="hs-cat__title">
            <span className="hs-cat__no">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <span className="hs-kicker">{shelf.count} designs</span>
              <h2 className="hs-title">{shelf.name}</h2>
            </div>
          </div>
          <Link href={shelf.href} className="hs-link">
            Explore {shelf.name} <FaArrowRight />
          </Link>
        </div>

        <div className="hs-cat__row">
          {shelf.items.map((p) => (
            <Link key={p.id} href={p.href} className="hs-plate">
              <span className="hs-plate__media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.name} loading="lazy" decoding="async" width="600" height="600" />
                {p.discount > 0 ? <span className="hs-plate__off">-{p.discount}%</span> : null}
              </span>
              <span className="hs-plate__name">{p.name}</span>
              <span className="hs-plate__price">
                {formatPrice(p.price)}
                {p.oldPrice > 0 ? <s>{formatPrice(p.oldPrice)}</s> : null}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
