// api/cotizacion.js
//
// Función serverless de Vercel. Recibe por POST la solicitud de cotización
// que arma js/app.js y la envía por correo a Almacén La Charra usando
// Nodemailer con una cuenta de Gmail.
//
// IMPORTANTE — CREDENCIALES:
// Este archivo NUNCA contiene contraseñas ni API keys escritas directamente.
// Se leen en tiempo de ejecución desde las Environment Variables configuradas
// en Vercel (Project → Settings → Environment Variables):
//
//   GMAIL_USER            → la cuenta de Gmail que envía el correo
//   GMAIL_APP_PASSWORD    → contraseña de aplicación de esa cuenta de Gmail
//                            (NO la contraseña normal de Gmail)
//   QUOTE_TO_EMAIL         → (opcional) a qué correo llega la cotización;
//                            si no se define, se usa el correo fijo de abajo.

const nodemailer = require("nodemailer");

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
const QUOTE_TO_EMAIL = process.env.QUOTE_TO_EMAIL || "armasymunicioneslacharra@gmail.com";

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Método no permitido." });
  }

  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.error(
      "[api/cotizacion] Faltan variables de entorno GMAIL_USER / GMAIL_APP_PASSWORD en Vercel."
    );
    return res
      .status(500)
      .json({ ok: false, error: "El servidor no está configurado correctamente. Contacta al administrador." });
  }

  // -- Parseo y validación del cuerpo de la solicitud ------------------------
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ ok: false, error: "La solicitud no tiene un formato JSON válido." });
    }
  }
  if (!body || typeof body !== "object") {
    return res.status(400).json({ ok: false, error: "Solicitud vacía o mal formada." });
  }

  const cliente = body.cliente && typeof body.cliente === "object" ? body.cliente : {};
  const productosRecibidos = Array.isArray(body.productos) ? body.productos : [];

  const nombre = isNonEmptyString(cliente.nombre) ? cliente.nombre.trim().slice(0, 200) : "";
  const apellido = isNonEmptyString(cliente.apellido) ? cliente.apellido.trim().slice(0, 200) : "";
  const telefono = isNonEmptyString(cliente.telefono) ? cliente.telefono.trim().slice(0, 60) : "";
  const ubicacion = isNonEmptyString(cliente.ubicacion) ? cliente.ubicacion.trim().slice(0, 300) : "";
  const correo = isNonEmptyString(cliente.correo) ? cliente.correo.trim().slice(0, 200) : "";
  const comentarios = isNonEmptyString(cliente.comentarios) ? cliente.comentarios.trim().slice(0, 2000) : "";

  // Nombre, apellido, teléfono y ubicación son obligatorios; correo es opcional.
  if (!nombre || !apellido || !telefono || !ubicacion) {
    return res.status(400).json({
      ok: false,
      error: "Faltan datos obligatorios (nombre, apellido, teléfono o ubicación).",
    });
  }
  if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    return res.status(400).json({ ok: false, error: "El correo del cliente no es válido." });
  }

  const productos = productosRecibidos
    .map((p) => ({
      nombre: isNonEmptyString(p && p.nombre) ? p.nombre.trim().slice(0, 200) : "",
      categoria: isNonEmptyString(p && p.categoria) ? p.categoria.trim().slice(0, 100) : "",
      calibre: isNonEmptyString(p && p.calibre) ? p.calibre.trim().slice(0, 100) : "",
      acabado: isNonEmptyString(p && p.acabado) ? p.acabado.trim().slice(0, 100) : "",
      cantidad:
        Number.isFinite(Number(p && p.cantidad)) && Number(p.cantidad) > 0
          ? Math.min(999, Math.round(Number(p.cantidad)))
          : 1,
    }))
    .filter((p) => p.nombre);

  if (!productos.length) {
    return res.status(400).json({ ok: false, error: "La solicitud no incluye ningún producto válido." });
  }

  const fecha = isNonEmptyString(body.fecha) ? body.fecha : new Date().toISOString();
  let fechaLegible = fecha;
  try {
    fechaLegible = new Date(fecha).toLocaleString("es-GT", { timeZone: "America/Guatemala" });
  } catch (e) {
    /* si falla el formateo, se usa la fecha ISO tal cual */
  }

  // -- Armado del correo -------------------------------------------------
  const filasProductos = productos
    .map(
      (p) => `
        <tr>
          <td style="padding:6px 10px;border:1px solid #ddd;">${escapeHtml(p.nombre)}</td>
          <td style="padding:6px 10px;border:1px solid #ddd;">${escapeHtml(p.categoria)}</td>
          <td style="padding:6px 10px;border:1px solid #ddd;">${escapeHtml(
            [p.calibre, p.acabado].filter(Boolean).join(" · ") || "—"
          )}</td>
          <td style="padding:6px 10px;border:1px solid #ddd;text-align:center;">${p.cantidad}</td>
        </tr>`
    )
    .join("");

  const htmlBody = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#111;">
      <h2 style="margin:0 0 4px;">Nueva solicitud de cotización</h2>
      <p style="margin:0 0 20px;color:#666;">Almacén La Charra · ${escapeHtml(fechaLegible)}</p>

      <h3 style="margin:0 0 8px;">Datos del cliente</h3>
      <table style="border-collapse:collapse;margin-bottom:20px;">
        <tr><td style="padding:4px 10px;font-weight:bold;">Nombre:</td><td style="padding:4px 10px;">${escapeHtml(nombre)}</td></tr>
        <tr><td style="padding:4px 10px;font-weight:bold;">Apellido:</td><td style="padding:4px 10px;">${escapeHtml(apellido)}</td></tr>
        <tr><td style="padding:4px 10px;font-weight:bold;">Teléfono:</td><td style="padding:4px 10px;">${escapeHtml(telefono)}</td></tr>
        <tr><td style="padding:4px 10px;font-weight:bold;">Correo:</td><td style="padding:4px 10px;">${
          correo ? escapeHtml(correo) : "(no proporcionado)"
        }</td></tr>
        <tr><td style="padding:4px 10px;font-weight:bold;">Ubicación:</td><td style="padding:4px 10px;">${escapeHtml(ubicacion)}</td></tr>
        <tr><td style="padding:4px 10px;font-weight:bold;vertical-align:top;">Comentarios:</td><td style="padding:4px 10px;">${
          comentarios ? escapeHtml(comentarios) : "(sin comentarios)"
        }</td></tr>
      </table>

      <h3 style="margin:0 0 8px;">Productos solicitados</h3>
      <table style="border-collapse:collapse;width:100%;max-width:640px;">
        <thead>
          <tr style="background:#f2f2f2;">
            <th style="padding:6px 10px;border:1px solid #ddd;text-align:left;">Producto</th>
            <th style="padding:6px 10px;border:1px solid #ddd;text-align:left;">Categoría</th>
            <th style="padding:6px 10px;border:1px solid #ddd;text-align:left;">Calibre / Acabado</th>
            <th style="padding:6px 10px;border:1px solid #ddd;text-align:center;">Cantidad</th>
          </tr>
        </thead>
        <tbody>${filasProductos}</tbody>
      </table>

      <p style="margin-top:24px;color:#888;font-size:12px;">
        Generado automáticamente desde el formulario de "Solicitud de cotización" del sitio web de
        Almacén La Charra. Esto no constituye una venta ni una reserva de producto.
      </p>
    </div>
  `;

  const textBody =
    `Nueva solicitud de cotización — Almacén La Charra\n` +
    `Fecha: ${fechaLegible}\n\n` +
    `Nombre: ${nombre}\n` +
    `Apellido: ${apellido}\n` +
    `Teléfono: ${telefono}\n` +
    `Correo: ${correo || "(no proporcionado)"}\n` +
    `Ubicación: ${ubicacion}\n` +
    `Comentarios: ${comentarios || "(sin comentarios)"}\n\n` +
    `Productos:\n` +
    productos
      .map((p, i) => {
        const detalle = [p.calibre, p.acabado].filter(Boolean).join(" · ");
        return `${i + 1}. ${p.nombre} — ${p.categoria}${detalle ? " — " + detalle : ""} — Cantidad: ${p.cantidad}`;
      })
      .join("\n");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Almacén La Charra — Sitio web" <${GMAIL_USER}>`,
      to: QUOTE_TO_EMAIL,
      replyTo: correo || undefined,
      subject: `Nueva solicitud de cotización — ${nombre} ${apellido}`,
      text: textBody,
      html: htmlBody,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[api/cotizacion] Error al enviar el correo:", err);
    return res
      .status(502)
      .json({ ok: false, error: "No se pudo enviar el correo. Intenta nuevamente más tarde." });
  }
};
