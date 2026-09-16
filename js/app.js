// ============================================
// Todo el script usa jQuery y se ejecuta
// cuando el DOM está listo
// ============================================
$(function () {

    /* ============================================
       1. FOTO DE PERFIL (subir y guardar)
       ============================================ */
    const STORAGE_KEY = 'foto_perfil_emanuel';
    const $avatarContainer = $('#avatarContainer');
    const $avatarInput = $('#avatarInput');
    const $avatarPreview = $('#avatarPreview');

    function cargarFotoGuardada() {
        const fotoGuardada = localStorage.getItem(STORAGE_KEY);
        if (fotoGuardada) {
            $avatarPreview.attr('src', fotoGuardada);
            $avatarPreview.attr('alt', 'Foto de Emanuel Mercado (guardada)');
            console.log('📸 Foto cargada desde almacenamiento local');
        } else {
            console.log('📷 No hay foto guardada. Sube una haciendo clic en el avatar.');
        }
    }

    function guardarFoto(dataURL) {
        try {
            localStorage.setItem(STORAGE_KEY, dataURL);
            console.log('✅ Foto guardada correctamente en localStorage');
            return true;
        } catch (error) {
            console.error('❌ Error al guardar la foto:', error);
            if (error.name === 'QuotaExceededError') {
                alert('⚠️ La imagen es demasiado grande. Usa una imagen más pequeña (menos de 1MB).');
            }
            return false;
        }
    }

    $avatarContainer.on('click', function () {
        $avatarInput.trigger('click');
    });

    $avatarInput.on('change', function () {
        const file = this.files[0];

        if (!file) {
            console.log('⚠️ No se seleccionó ningún archivo');
            return;
        }

        if (!file.type.startsWith('image/')) {
            alert('⚠️ Por favor, selecciona un archivo de imagen válido.');
            $(this).val('');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert('⚠️ La imagen es demasiado grande. Máximo 2MB.');
            $(this).val('');
            return;
        }

        console.log(`📸 Procesando imagen: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);

        const reader = new FileReader();

        reader.onload = function (event) {
            const dataURL = event.target.result;
            $avatarPreview.attr('src', dataURL);
            $avatarPreview.attr('alt', `Foto de Emanuel Mercado (${file.name})`);

            if (guardarFoto(dataURL)) {
                console.log(`✅ Foto "${file.name}" guardada exitosamente`);
                mostrarNotificacion('📸 Foto actualizada correctamente', 'success');
            }
        };

        reader.onerror = function () {
            alert('❌ Error al leer el archivo. Intenta con otra imagen.');
            console.error('Error al leer el archivo');
        };

        reader.readAsDataURL(file);
    });

    cargarFotoGuardada();

    /* ============================================
       2. NOTIFICACIÓN VISUAL (toast simple con jQuery)
       ============================================ */
    function mostrarNotificacion(mensaje, tipo = 'success') {
        const color = tipo === 'success' ? '#238636' : '#f85149';
        const $notificacion = $('<div>')
            .text(mensaje)
            .css({
                position: 'fixed',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%) translateY(20px)',
                background: color,
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '0.95rem',
                zIndex: 9999,
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                maxWidth: '90%',
                textAlign: 'center',
                opacity: 0
            });

        $('body').append($notificacion);

        $notificacion.animate(
            { opacity: 1, bottom: '30px' },
            300,
            function () {
                setTimeout(() => {
                    $notificacion.animate({ opacity: 0, bottom: '20px' }, 500, function () {
                        $(this).remove();
                    });
                }, 2500);
            }
        );
    }

    /* ============================================
       3. NAVEGACIÓN SUAVE + CIERRE DEL MENÚ MÓVIL
       ============================================ */
    $('.navbar-nav a.nav-link').on('click', function (e) {
        e.preventDefault();
        const targetId = $(this).attr('href');
        const $target = $(targetId);

        if ($target.length) {
            $('html, body').animate(
                { scrollTop: $target.offset().top - 55 },
                600
            );
        }

        // Cerrar el menú colapsado en móvil después de hacer clic
        const $navbarCollapse = $('#navbarNav');
        if ($navbarCollapse.hasClass('show')) {
            $navbarCollapse.collapse('hide');
        }
    });

    /* ============================================
       4. RESALTAR ENLACE ACTIVO SEGÚN SCROLL
       ============================================ */
    const $sections = $('.section');
    const $navLinks = $('.navbar-nav a.nav-link');

    $(window).on('scroll', function () {
        let current = '';

        $sections.each(function () {
            const sectionTop = $(this).offset().top - 120;
            if ($(window).scrollTop() >= sectionTop) {
                current = $(this).attr('id');
            }
        });

        $navLinks.removeClass('active');
        if (current) {
            $navLinks.filter(`[href="#${current}"]`).addClass('active');
        }
    });

    /* ============================================
       5. ANIMACIÓN "REVEAL" AL HACER SCROLL
       ============================================ */
    function revelarElementos() {
        const alturaVentana = $(window).height();

        $('.reveal').each(function () {
            const $el = $(this);
            if ($el.hasClass('reveal-visible')) return;

            const topElemento = $el.offset().top;
            const scrollActual = $(window).scrollTop();

            if (scrollActual + alturaVentana - 80 > topElemento) {
                $el.addClass('reveal-visible');
            }
        });
    }

    $(window).on('scroll resize', revelarElementos);
    revelarElementos(); // Ejecutar una vez al cargar (para lo visible en el primer viewport)

    /* ============================================
       6. VALIDACIÓN DEL FORMULARIO DE CONTACTO
       ============================================ */
    const $form = $('#contactForm');
    const $feedback = $('#formFeedback');

    const validadores = {
        nombre: function (valor) {
            return valor.trim().length >= 3;
        },
        correo: function (valor) {
            const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regexCorreo.test(valor.trim());
        },
        asunto: function (valor) {
            return valor.trim().length >= 4;
        },
        mensaje: function (valor) {
            return valor.trim().length >= 10;
        }
    };

    function validarCampo($campo) {
        const nombreCampo = $campo.attr('name');
        const valor = $campo.val();
        const esValido = validadores[nombreCampo] ? validadores[nombreCampo](valor) : true;

        if (esValido) {
            $campo.removeClass('is-invalid').addClass('is-valid');
        } else {
            $campo.removeClass('is-valid').addClass('is-invalid');
        }

        return esValido;
    }

    // Validar en tiempo real mientras el usuario escribe / sale del campo
    $form.find('.form-control').on('input blur', function () {
        validarCampo($(this));
    });

    // Validar al enviar
    $form.on('submit', function (e) {
        e.preventDefault();

        let formularioValido = true;

        $form.find('.form-control').each(function () {
            const valido = validarCampo($(this));
            if (!valido) {
                formularioValido = false;
            }
        });

        $feedback.removeClass('show-success show-error');

        if (formularioValido) {
            const datos = {
                nombre: $('#nombre').val().trim(),
                correo: $('#correo').val().trim(),
                asunto: $('#asunto').val().trim(),
                mensaje: $('#mensaje').val().trim()
            };

            console.log('📨 Formulario válido. Datos listos para enviar:', datos);

            $feedback
                .addClass('show-success')
                .html(`✅ ¡Gracias, ${datos.nombre}! Tu mensaje fue validado correctamente y quedaría listo para enviarse.`);

            mostrarNotificacion('✅ Formulario enviado correctamente', 'success');

            // Reiniciar el formulario tras un envío exitoso
            $form[0].reset();
            $form.find('.form-control').removeClass('is-valid is-invalid');
        } else {
            $feedback
                .addClass('show-error')
                .html('⚠️ Por favor corrige los campos marcados en rojo antes de enviar.');

            mostrarNotificacion('⚠️ Revisa los campos del formulario', 'error');
        }
    });

    /* ============================================
       7. MENSAJES EN CONSOLA
       ============================================ */
    console.log('🚀 Hoja de vida de Emanuel Mercado');
    console.log('📄 Estudiante de Ingeniería de Software');
    console.log('🎨 Bootstrap + jQuery activados');
    console.log('📷 Haz clic en la foto de perfil para subir tu imagen');
});
