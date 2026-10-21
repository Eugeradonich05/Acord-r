/** Clase en <html> mientras el preloader está activo (ver globals.css). */
export const PRELOADING_CLASS = "is-preloading";

/** Marca en sessionStorage: el preloader se muestra una vez por sesión. */
export const PRELOADER_FLAG = "acordar:intro";

/** Id del temporizador de seguridad del script inline (lo cancela el componente). */
export const PRELOADER_TIMER = "__acordarIntroTimer";

/** Máximo absoluto de bloqueo si React nunca llega a tomar el control. */
const FAILSAFE_MS = 5000;

/**
 * Script inline para <head>: corre antes del primer pintado. Si es la primera
 * carga de la sesión activa el preloader; si el JS de la app no llega, a los
 * 5 s libera el scroll y la página igual.
 */
export const PRELOADER_SCRIPT = `(function(){try{if(sessionStorage.getItem("${PRELOADER_FLAG}"))return;var d=document.documentElement;d.classList.add("${PRELOADING_CLASS}");window["${PRELOADER_TIMER}"]=setTimeout(function(){d.classList.remove("${PRELOADING_CLASS}")},${FAILSAFE_MS})}catch(e){}})();`;
