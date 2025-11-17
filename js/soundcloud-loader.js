function loadSoundCloudPlayer() {
    const iframeWrapper = document.getElementById('soundCloudIframeWrapper');
    
    if (iframeWrapper) {
      // Iniciar el wrapper como invisible y listo para la transición
      iframeWrapper.style.opacity = '0';
      void iframeWrapper.offsetWidth;
      iframeWrapper.style.transition = 'opacity 0.5s ease-in-out';

      const iframe = document.createElement('iframe');
      iframe.src = "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/francisco-neira-515458446/sets/rap-chileno&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&sharing=false&visual=true";
      iframe.frameBorder = "0";
      iframe.allow = "autoplay; encrypted-media";
      iframe.allowFullscreen = true;
      iframe.className = "w-full h-20";
      iframe.loading = "lazy";

      let iframeContentLoaded = false;

      iframe.onload = function() {
        iframeContentLoaded = true;
        console.log("Evento onload del iframe de SoundCloud disparado.");
        setTimeout(() => {
          iframeWrapper.style.opacity = '1';
          console.log("Reproductor de SoundCloud visible con fade-in.");
        }, 2000); 
      };

      iframeWrapper.appendChild(iframe);

      // Fallback por si el evento onload no se dispara o tarda demasiado
      setTimeout(function() {
        if (!iframeContentLoaded) {
          console.warn("El reproductor de SoundCloud parece no haber cargado completamente (timeout). Intentando mostrar de todas formas o fallback.");

        }
      }, 7000); // 7 segundos de espera total

    } else {
      console.error("Error: El contenedor para el iframe de SoundCloud (soundCloudIframeWrapper) no fue encontrado.");
    }
  }

  // Decidir cuándo cargar el reproductor.
  if (document.readyState === 'complete') {
    loadSoundCloudPlayer();
  } else {
    window.addEventListener('load', loadSoundCloudPlayer);
  }
