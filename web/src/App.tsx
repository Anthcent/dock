import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";
import "./App.css";
import { fetchMenu, submitOrder } from "./lib/api";
import { addItemToCart, cartSubtotal, updateCartNotes, updateCartQuantity } from "./lib/cart";
import type { CartItem, MenuItem, MenuResponse } from "./types";

const categoryLabels: Record<MenuItem["category"], string> = {
  smash: "Smash a la plancha",
  signature: "Firmas de la casa",
  combos: "Combos del patio",
  sides: "Acompañantes",
  drinks: "Bebidas",
};

function App() {
  const [menu, setMenu] = useState<MenuResponse | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    fulfillmentType: "pickup" as "pickup" | "delivery",
    address: "",
    paymentMethod: "Pago movil",
    requestedTime: "20 minutos",
    notes: "",
  });

  useEffect(() => {
    fetchMenu().then(setMenu);
  }, []);

  const featuredItems = useMemo(() => menu?.items.filter((item) => item.featured) ?? [], [menu]);
  const groupedItems = useMemo(() => {
    const groups = new Map<MenuItem["category"], MenuItem[]>();

    menu?.items.forEach((item) => {
      groups.set(item.category, [...(groups.get(item.category) ?? []), item]);
    });

    return Array.from(groups.entries());
  }, [menu]);

  const subtotal = cartSubtotal(cart);

  async function handleOrderSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (cart.length === 0) {
      setConfirmation("Agrega al menos un producto antes de enviar.");
      return;
    }

    setSubmitting(true);
    setConfirmation("");

    try {
      const result = await submitOrder({
        ...form,
        items: cart,
      });

      window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
      setConfirmation(`Pedido ${result.orderCode} listo. Se abrio WhatsApp para confirmarlo.`);
      setCart([]);
    } catch {
      setConfirmation("No pudimos crear el pedido. Revisa el API o intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Brasa de Barrio</p>
          <h1>Hamburguesas con filo de plancha, humo corto y pedido directo por WhatsApp.</h1>
          <p className="lede">
            Diseñamos la carta como si fuera una libreta de cocina del local: cruda, calida y
            memorable. Menu real, carrito real y salida directa para operar por WhatsApp.
          </p>
          <div className="hero-actions">
            <a href="#menu" className="button button-primary">
              Ver menu
            </a>
            <a href="#pedido" className="button button-secondary">
              Hacer pedido
            </a>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-ticket">
            <span>Turno de fuego</span>
            <strong>18:00 - 23:00</strong>
          </div>
          <div className="hero-stat-grid">
            <article>
              <span>Costra</span>
              <strong>doble smash</strong>
            </article>
            <article>
              <span>Salsa</span>
              <strong>pickles curados</strong>
            </article>
            <article>
              <span>Canal</span>
              <strong>WhatsApp directo</strong>
            </article>
          </div>
        </div>
      </section>

      <section className="featured-band">
        {featuredItems.map((item) => (
          <article key={item.slug} className="featured-card" style={{ "--accent": item.accent } as CSSProperties}>
            <img src={item.image} alt={item.name} />
            <div>
              <p>{item.tagline}</p>
              <h2>{item.name}</h2>
              <span>${item.price}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="story-grid">
        <article>
          <p className="section-kicker">Manifiesto</p>
          <h2>Sin rojo ketchup ni neones de plantilla.</h2>
          <p>
            La identidad usa tinta tostada, verde encurtido y crema de ticket. Se siente mas a
            barrio, hierro y libreta que a fast-food generico.
          </p>
        </article>
        <article>
          <p className="section-kicker">Operacion</p>
          <h2>Dockploy friendly desde el dia uno.</h2>
          <p>
            Frontend, API y Mongo vienen preparados para contenedores, ideal para empezar a probar
            la VPS con algo util y visualmente fuerte.
          </p>
        </article>
      </section>

      <section className="menu-section" id="menu">
        <div className="section-head">
          <p className="section-kicker">Carta completa</p>
          <h2>Menu con personalidad y estructura lista para crecer.</h2>
        </div>

        {groupedItems.map(([category, items]) => (
          <div key={category} className="category-block">
            <div className="category-header">
              <h3>{categoryLabels[category]}</h3>
              <span>{items.length} piezas</span>
            </div>

            <div className="menu-grid">
              {items.map((item) => (
                <article key={item.slug} className="menu-card">
                  <img src={item.image} alt={item.name} />
                  <div className="menu-card-body">
                    <div className="menu-card-top">
                      <div>
                        <p>{item.tagline}</p>
                        <h4>{item.name}</h4>
                      </div>
                      <strong>${item.price}</strong>
                    </div>
                    <p className="description">{item.description}</p>
                    <ul>
                      {item.ingredients.map((ingredient) => (
                        <li key={ingredient}>{ingredient}</li>
                      ))}
                    </ul>
                    <button className="button button-primary" onClick={() => setCart((current) => addItemToCart(current, item))}>
                      Agregar al pedido
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="order-layout" id="pedido">
        <div className="cart-panel">
          <div className="section-head compact">
            <p className="section-kicker">Pedido vivo</p>
            <h2>Tu bandeja</h2>
          </div>

          {cart.length === 0 ? (
            <p className="empty-copy">Todavia no has agregado hamburguesas ni extras.</p>
          ) : (
            <div className="cart-list">
              {cart.map((item) => (
                <article key={item.slug} className="cart-row">
                  <div>
                    <strong>{item.name}</strong>
                    <span>${item.price} c/u</span>
                  </div>

                  <div className="cart-actions">
                    <button type="button" onClick={() => setCart((current) => updateCartQuantity(current, item.slug, item.quantity - 1))}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => setCart((current) => updateCartQuantity(current, item.slug, item.quantity + 1))}>
                      +
                    </button>
                  </div>

                  <textarea
                    value={item.notes}
                    onChange={(event) =>
                      setCart((current) => updateCartNotes(current, item.slug, event.target.value))
                    }
                    placeholder="Nota para cocina"
                  />
                </article>
              ))}
            </div>
          )}

          <div className="subtotal-row">
            <span>Subtotal</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
        </div>

        <form className="order-form" onSubmit={handleOrderSubmit}>
          <div className="section-head compact">
            <p className="section-kicker">Checkout WhatsApp</p>
            <h2>Datos del pedido</h2>
          </div>

          <label>
            Nombre
            <input
              required
              value={form.customerName}
              onChange={(event) => setForm((current) => ({ ...current, customerName: event.target.value }))}
            />
          </label>

          <label>
            Telefono
            <input
              required
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
            />
          </label>

          <label>
            Tipo de entrega
            <select
              value={form.fulfillmentType}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  fulfillmentType: event.target.value as "pickup" | "delivery",
                }))
              }
            >
              <option value="pickup">Retiro en local</option>
              <option value="delivery">Delivery</option>
            </select>
          </label>

          {form.fulfillmentType === "delivery" ? (
            <label>
              Direccion
              <input
                required
                value={form.address}
                onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
              />
            </label>
          ) : null}

          <label>
            Metodo de pago
            <input
              value={form.paymentMethod}
              onChange={(event) => setForm((current) => ({ ...current, paymentMethod: event.target.value }))}
            />
          </label>

          <label>
            Hora estimada
            <input
              value={form.requestedTime}
              onChange={(event) => setForm((current) => ({ ...current, requestedTime: event.target.value }))}
            />
          </label>

          <label>
            Notas generales
            <textarea
              value={form.notes}
              onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
            />
          </label>

          <button className="button button-primary submit" type="submit" disabled={submitting}>
            {submitting ? "Preparando pedido..." : "Enviar a WhatsApp"}
          </button>

          <p className="confirmation">{confirmation}</p>
        </form>
      </section>
    </main>
  );
}

export default App;
