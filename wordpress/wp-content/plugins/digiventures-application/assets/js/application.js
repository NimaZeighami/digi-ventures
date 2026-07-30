(function () {
  'use strict';

  var MAX_UPLOAD_SIZE = 20 * 1024 * 1024;
  var ALLOWED_UPLOAD_EXTENSIONS = ['pdf', 'ppt', 'pptx'];

  function createElement(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function clearFeedback(form) {
    var node = form.querySelector('.dv-feedback');
    if (!node) return;
    node.replaceChildren();
    node.className = 'dv-feedback';
    node.hidden = true;
    node.removeAttribute('role');
  }

  function feedback(form, message, type) {
    var node = form.querySelector('.dv-feedback');
    if (!node) return;

    var isError = type === 'error';
    var icon = createElement('span', 'dv-feedback-icon', '');
    icon.setAttribute('aria-hidden', 'true');
    var content = createElement('span', 'dv-feedback-content', '');
    content.appendChild(createElement(
      'strong',
      'dv-feedback-title',
      isError ? 'ارسال انجام نشد' : 'عملیات موفق بود'
    ));
    content.appendChild(createElement('span', 'dv-feedback-message', message));

    node.replaceChildren(icon, content);
    node.className = 'dv-feedback ' + (isError ? 'is-error' : 'is-success');
    node.hidden = false;
    node.setAttribute('role', isError ? 'alert' : 'status');
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' بایت';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' کیلوبایت';
    return (bytes / (1024 * 1024)).toFixed(1) + ' مگابایت';
  }

  function uploadElements(upload) {
    return {
      input: upload.querySelector('input[type="file"]'),
      status: upload.querySelector('[data-upload-status]'),
      title: upload.querySelector('[data-upload-title]'),
      meta: upload.querySelector('[data-upload-meta]'),
      remove: upload.querySelector('[data-upload-remove]'),
      progress: upload.querySelector('[data-upload-progress]'),
      progressBar: upload.querySelector('[data-upload-progress-bar]')
    };
  }

  function resetUpload(upload) {
    var elements = uploadElements(upload);
    var hasExistingFile = upload.getAttribute('data-existing-file') === '1';
    upload.className = 'dv-upload' + (hasExistingFile ? ' has-existing-file' : '');
    elements.status.hidden = true;
    elements.progress.hidden = true;
    elements.progressBar.style.width = '0%';
    elements.progress.removeAttribute('aria-valuenow');
    elements.remove.disabled = false;
    elements.input.setCustomValidity('');
  }

  function setUploadState(upload, state, title, meta, percent) {
    var elements = uploadElements(upload);
    var hasExistingFile = upload.getAttribute('data-existing-file') === '1';
    upload.className = 'dv-upload' + (hasExistingFile ? ' has-existing-file' : '') + ' is-' + state;
    elements.status.hidden = false;
    elements.title.textContent = title;
    elements.meta.textContent = meta || '';
    elements.remove.hidden = state === 'invalid' || state === 'complete';
    elements.remove.disabled = state === 'uploading' || state === 'processing';

    var hasProgress = state === 'uploading' || state === 'processing';
    elements.progress.hidden = !hasProgress;
    if (hasProgress) {
      var safePercent = Math.max(0, Math.min(100, percent || 0));
      elements.progress.setAttribute('role', 'progressbar');
      elements.progress.setAttribute('aria-label', 'درصد آپلود فایل');
      elements.progress.setAttribute('aria-valuemin', '0');
      elements.progress.setAttribute('aria-valuemax', '100');
      elements.progress.setAttribute('aria-valuenow', String(safePercent));
      elements.progressBar.style.width = safePercent + '%';
    }
  }

  function validateUpload(upload) {
    var elements = uploadElements(upload);
    var file = elements.input.files && elements.input.files[0];
    elements.input.setCustomValidity('');

    if (!file) {
      if (elements.input.required) {
        var requiredMessage = 'لطفاً فایل Pitch Deck را انتخاب کنید.';
        elements.input.setCustomValidity(requiredMessage);
        setUploadState(upload, 'invalid', 'فایلی انتخاب نشده است', requiredMessage, 0);
        return false;
      }
      resetUpload(upload);
      return true;
    }

    var parts = file.name.toLowerCase().split('.');
    var extension = parts.length > 1 ? parts.pop() : '';
    if (ALLOWED_UPLOAD_EXTENSIONS.indexOf(extension) === -1) {
      var typeMessage = 'فقط فایل‌های PDF، PPT و PPTX قابل قبول هستند.';
      elements.input.setCustomValidity(typeMessage);
      setUploadState(upload, 'invalid', 'فرمت فایل مجاز نیست', typeMessage, 0);
      return false;
    }
    if (!file.size) {
      var emptyMessage = 'فایل انتخاب‌شده خالی است. فایل دیگری انتخاب کنید.';
      elements.input.setCustomValidity(emptyMessage);
      setUploadState(upload, 'invalid', 'فایل خالی است', emptyMessage, 0);
      return false;
    }
    if (file.size > MAX_UPLOAD_SIZE) {
      var sizeMessage = 'حجم فایل ' + formatFileSize(file.size) + ' است؛ حداکثر حجم مجاز ۲۰ مگابایت است.';
      elements.input.setCustomValidity(sizeMessage);
      setUploadState(upload, 'invalid', 'حجم فایل بیش از حد مجاز است', sizeMessage, 0);
      return false;
    }

    setUploadState(upload, 'ready', 'فایل آماده ارسال است', file.name + ' • ' + formatFileSize(file.size), 0);
    return true;
  }

  function initialiseUpload(upload) {
    var elements = uploadElements(upload);
    var dropzone = upload.querySelector('.dv-upload-dropzone');
    resetUpload(upload);

    elements.input.addEventListener('change', function () {
      var form = upload.closest('form');
      if (form) clearFeedback(form);
      validateUpload(upload);
    });

    elements.remove.addEventListener('click', function () {
      elements.input.value = '';
      resetUpload(upload);
      elements.input.focus();
    });
    dropzone.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        elements.input.click();
      }
    });

    ['dragenter', 'dragover'].forEach(function (eventName) {
      dropzone.addEventListener(eventName, function (event) {
        event.preventDefault();
        upload.classList.add('is-dragging');
      });
    });
    ['dragleave', 'drop'].forEach(function (eventName) {
      dropzone.addEventListener(eventName, function (event) {
        event.preventDefault();
        upload.classList.remove('is-dragging');
      });
    });
    dropzone.addEventListener('drop', function (event) {
      var files = event.dataTransfer && event.dataTransfer.files;
      if (!files || !files.length) return;
      try {
        var transfer = new DataTransfer();
        transfer.items.add(files[0]);
        elements.input.files = transfer.files;
      } catch (error) {
        elements.input.click();
        return;
      }
      elements.input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  function request(form, endpoint, method, headers, onProgress, onUploadComplete) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open(method, window.DV_APP.restUrl + endpoint, true);
      xhr.timeout = 60000;
      Object.keys(headers).forEach(function (name) {
        xhr.setRequestHeader(name, headers[name]);
      });

      if (xhr.upload && onProgress) {
        xhr.upload.addEventListener('progress', function (event) {
          if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
        });
        xhr.upload.addEventListener('load', function () {
          if (onUploadComplete) onUploadComplete();
        });
      }

      xhr.addEventListener('load', function () {
        var payload = {};
        try {
          payload = xhr.responseText ? JSON.parse(xhr.responseText) : {};
        } catch (error) {
          payload = {};
        }
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(payload);
          return;
        }
        var message = payload.message;
        if (!message && xhr.status === 413) message = 'حجم فایل از محدودیت سرور بیشتر است.';
        if (!message && xhr.status === 401) message = 'نشست شما منقضی شده است. دوباره وارد شوید.';
        if (!message && xhr.status === 403) message = 'اجازه انجام این عملیات را ندارید یا نشست شما منقضی شده است.';
        reject(new Error(message || 'سرور نتوانست درخواست را پردازش کند. لطفاً دوباره تلاش کنید.'));
      });
      xhr.addEventListener('error', function () {
        reject(new Error(navigator.onLine ? 'ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید.' : 'اتصال اینترنت قطع است. پس از اتصال دوباره تلاش کنید.'));
      });
      xhr.addEventListener('timeout', function () {
        reject(new Error('زمان ارسال درخواست بیش از حد طول کشید. اتصال اینترنت را بررسی و دوباره تلاش کنید.'));
      });
      xhr.addEventListener('abort', function () {
        reject(new Error('ارسال درخواست متوقف شد.'));
      });
      xhr.send(new FormData(form));
    });
  }

  function firstInvalidField(form) {
    return Array.prototype.find.call(form.elements, function (field) {
      return field.willValidate && !field.validity.valid;
    });
  }

  function setSubmitting(form, button, submitting, originalText) {
    form.setAttribute('aria-busy', submitting ? 'true' : 'false');
    if (!button) return;
    button.disabled = submitting;
    button.classList.toggle('is-loading', submitting);
    button.textContent = submitting ? 'در حال ارسال…' : originalText;
  }

  function showToast(message, type) {
    var region = document.querySelector('[data-dv-toast-region]');
    if (!region || !message) return;
    var toast = createElement('div', 'dv-toast is-' + (type === 'error' ? 'error' : 'success'), '');
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
    var icon = createElement('span', 'dv-toast-icon', '');
    icon.setAttribute('aria-hidden', 'true');
    var copy = createElement('span', 'dv-toast-copy', '');
    copy.appendChild(createElement('strong', '', type === 'error' ? 'عملیات انجام نشد' : 'عملیات موفق بود'));
    copy.appendChild(createElement('span', '', message));
    var close = createElement('button', 'dv-toast-close', '×');
    close.type = 'button';
    close.setAttribute('aria-label', 'بستن اعلان');
    close.addEventListener('click', function () { toast.remove(); });
    toast.append(icon, copy, close);
    region.appendChild(toast);
    window.setTimeout(function () {
      toast.classList.add('is-leaving');
      window.setTimeout(function () { toast.remove(); }, 220);
    }, 5200);
  }

  function initialiseNotices() {
    var params = new URLSearchParams(window.location.search);
    var noticeCode = params.get('dv_notice');
    if (noticeCode === 'logged_out' || noticeCode === 'logged_in') {
      showToast(
		noticeCode === 'logged_in' ? 'با موفقیت وارد حساب خود شدید. خوش آمدید.' : 'با موفقیت از حساب خارج شدید.',
        'success'
      );
      params.delete('dv_notice');
      var clean = window.location.pathname + (params.toString() ? '?' + params.toString() : '') + window.location.hash;
      window.history.replaceState({}, document.title, clean);
    }
    try {
      var stored = window.sessionStorage.getItem('dv_notice');
      if (stored) {
        window.sessionStorage.removeItem('dv_notice');
        var notice = JSON.parse(stored);
        showToast(notice.message, notice.type);
      }
    } catch (error) {
      // Storage can be unavailable in privacy-restricted browsers.
    }
  }

  function initialiseAuthModals() {
    var activeModal = null;
    var previousFocus = null;

    function openModal(type, trigger) {
      var modal = document.querySelector('[data-dv-auth-modal="' + type + '"]');
      if (!modal) return;
      previousFocus = trigger || document.activeElement;
      activeModal = modal;
      modal.hidden = false;
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('dv-modal-open');
      window.requestAnimationFrame(function () {
        modal.classList.add('is-visible');
        var focusTarget = modal.querySelector('input:not([type="hidden"]), .dv-modal-card');
        if (focusTarget) focusTarget.focus();
      });
    }

    function closeModal() {
      if (!activeModal) return;
      var modal = activeModal;
      modal.classList.remove('is-visible');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('dv-modal-open');
      activeModal = null;
      window.setTimeout(function () { modal.hidden = true; }, 180);
      if (previousFocus && previousFocus.focus) previousFocus.focus();
    }

    document.addEventListener('click', function (event) {
      var opener = event.target.closest('[data-dv-auth-open]');
      if (opener) {
        var type = opener.getAttribute('data-dv-auth-open');
        if (document.querySelector('[data-dv-auth-modal="' + type + '"]')) {
          event.preventDefault();
          openModal(type, opener);
        }
        return;
      }
      if (event.target.closest('[data-dv-modal-close]')) {
        event.preventDefault();
        closeModal();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (!activeModal) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
        return;
      }
      if (event.key !== 'Tab') return;
      var focusable = activeModal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    document.querySelectorAll('[data-dv-logout-form]').forEach(function (form) {
      form.addEventListener('submit', function () {
        var button = form.querySelector('[type="submit"]');
        if (!button) return;
        button.disabled = true;
        button.classList.add('is-loading');
        button.textContent = 'در حال خروج…';
      });
    });
  }

  function initialiseDashboardFilters() {
    document.querySelectorAll('[data-dv-table-search]').forEach(function (input) {
      var key = input.getAttribute('data-dv-table-search');
      var table = document.querySelector('[data-dv-filter-table="' + key + '"]');
      if (!table) return;
      var status = document.querySelector('[data-dv-table-status="' + key + '"]');
      var empty = table.parentElement.querySelector('[data-dv-filter-empty]');

      function filterRows() {
        var query = input.value.trim().toLowerCase();
        var selectedStatus = status ? status.value : '';
        var visible = 0;
        table.querySelectorAll('[data-dv-filter-row]').forEach(function (row) {
          var matchesSearch = !query || (row.getAttribute('data-search') || '').toLowerCase().indexOf(query) !== -1;
          var matchesStatus = !selectedStatus || row.getAttribute('data-status') === selectedStatus;
          row.hidden = !(matchesSearch && matchesStatus);
          if (!row.hidden) visible += 1;
        });
        if (empty) empty.hidden = visible !== 0;
      }

      input.addEventListener('input', filterRows);
      if (status) status.addEventListener('change', filterRows);
    });
  }

  function initialiseReviewDialogs() {
    document.addEventListener('toggle', function (event) {
      var details = event.target;
      if (!details.matches || !details.matches('.dv-review-details')) return;
      if (details.open) {
        document.querySelectorAll('.dv-review-details[open]').forEach(function (other) {
          if (other !== details) other.removeAttribute('open');
        });
        document.body.classList.add('dv-review-open');
        var select = details.querySelector('select');
        if (select) select.focus();
      } else if (!document.querySelector('.dv-review-details[open]')) {
        document.body.classList.remove('dv-review-open');
      }
    }, true);
    document.addEventListener('click', function (event) {
      var close = event.target.closest('[data-dv-review-close]');
      if (!close) return;
      var details = close.closest('.dv-review-details');
      if (details) details.removeAttribute('open');
    });
    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape' || document.querySelector('.dv-modal.is-visible')) return;
      var details = document.querySelector('.dv-review-details[open]');
      if (details) {
        event.preventDefault();
        details.removeAttribute('open');
        var summary = details.querySelector('summary');
        if (summary) summary.focus();
      }
    });
  }

  function initialiseAccountMenu() {
    var menus = document.querySelectorAll('.dv-account-menu');
    if (!menus.length) return;

    function close(menu) {
      var trigger = menu.querySelector('[data-dv-account-menu]');
      var popover = menu.querySelector('[data-dv-account-popover]');
      if (!trigger || !popover) return;
      trigger.setAttribute('aria-expanded', 'false');
      popover.hidden = true;
    }

    menus.forEach(function (menu) {
      var trigger = menu.querySelector('[data-dv-account-menu]');
      var popover = menu.querySelector('[data-dv-account-popover]');
      if (!trigger || !popover) return;
      trigger.addEventListener('click', function () {
        var open = trigger.getAttribute('aria-expanded') === 'true';
        menus.forEach(function (other) { if (other !== menu) close(other); });
        trigger.setAttribute('aria-expanded', open ? 'false' : 'true');
        popover.hidden = open;
      });
    });
    document.addEventListener('click', function (event) {
      if (!event.target.closest('.dv-account-menu')) menus.forEach(close);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') menus.forEach(close);
    });
  }

  document.querySelectorAll('[data-dv-upload]').forEach(initialiseUpload);
  document.querySelectorAll('.dv-feedback').forEach(function (node) {
    if (!node.textContent.trim()) node.hidden = true;
  });
  initialiseAuthModals();
  initialiseDashboardFilters();
  initialiseReviewDialogs();
  initialiseAccountMenu();
  initialiseNotices();

  document.addEventListener('input', function (event) {
    var form = event.target.closest('.dv-form');
    if (!form) return;
    event.target.classList.remove('is-invalid');
    if (form.querySelector('.dv-feedback.is-error')) clearFeedback(form);
  });

  document.addEventListener('invalid', function (event) {
    var field = event.target;
    var form = field.closest && field.closest('.dv-form[data-dv-endpoint]');
    if (!form) return;

    field.classList.add('is-invalid');
    if (field.type === 'file') {
      var upload = field.closest('[data-dv-upload]');
      if (upload) validateUpload(upload);
    }
    if (!form.querySelector('.dv-feedback.is-error')) {
      feedback(form, 'لطفاً فیلدهای مشخص‌شده را کامل و اصلاح کنید.', 'error');
    }
  }, true);

  document.addEventListener('submit', async function (event) {
    var form = event.target.closest('.dv-form[data-dv-endpoint]');
    if (!form || !window.DV_APP) return;
    event.preventDefault();
    clearFeedback(form);

    var upload = form.querySelector('[data-dv-upload]');
    if (upload && !validateUpload(upload)) {
      feedback(form, 'فایل ارائه را بررسی کنید و سپس دوباره فرم را ارسال کنید.', 'error');
    }

    if (!form.checkValidity()) {
      var invalid = firstInvalidField(form);
      Array.prototype.forEach.call(form.elements, function (field) {
        if (field.willValidate && !field.validity.valid) field.classList.add('is-invalid');
      });
      if (!form.querySelector('.dv-feedback.is-error')) {
        feedback(form, 'لطفاً فیلدهای مشخص‌شده را کامل و اصلاح کنید.', 'error');
      }
      if (invalid && invalid.type !== 'file') invalid.focus();
      else if (upload) upload.querySelector('.dv-upload-dropzone').focus();
      form.reportValidity();
      return;
    }

    var button = form.querySelector('[type="submit"]');
    var original = button ? button.textContent : '';
    var endpoint = form.getAttribute('data-dv-endpoint');
    var isPublic = endpoint.indexOf('auth/') === 0 || endpoint === 'contact';
    var headers = isPublic ? { 'X-DV-Nonce': window.DV_APP.publicNonce } : { 'X-WP-Nonce': window.DV_APP.restNonce };
    var method = form.getAttribute('data-dv-method') || 'POST';
    var uploadFile = upload && uploadElements(upload).input.files[0];

    setSubmitting(form, button, true, original);
    if (uploadFile) {
      setUploadState(upload, 'uploading', 'در حال آپلود فایل…', uploadFile.name + ' • ۰٪', 0);
    }

    try {
      var payload = await request(
        form,
        endpoint,
        method,
        headers,
        uploadFile ? function (percent) {
          setUploadState(upload, 'uploading', 'در حال آپلود فایل…', uploadFile.name + ' • ' + percent + '٪', percent);
        } : null,
        uploadFile ? function () {
          setUploadState(upload, 'processing', 'آپلود انجام شد؛ در حال ثبت نهایی…', uploadFile.name, 100);
        } : null
      );

      if (uploadFile) {
        setUploadState(upload, 'complete', 'فایل با موفقیت آپلود و ثبت شد', uploadFile.name + ' • ' + formatFileSize(uploadFile.size), 100);
      }
      feedback(form, payload.message || 'درخواست با موفقیت انجام شد.', 'success');

      var redirect = payload.data && payload.data.redirect;
      if (endpoint === 'auth/login' && redirect) {
        var destination = new URL(redirect, window.location.origin);
        if (destination.origin === window.location.origin) {
          destination.searchParams.set('dv_notice', 'logged_in');
          redirect = destination.toString();
        }
      }
      if (redirect) {
        window.setTimeout(function () { window.location.assign(redirect); }, 650);
      } else if (endpoint.indexOf('/status') > -1 || endpoint.indexOf('/role') > -1 || endpoint === 'requests') {
        window.setTimeout(function () { window.location.reload(); }, 1500);
      }
    } catch (error) {
      var message = error.message || 'خطای غیرمنتظره‌ای رخ داد. لطفاً دوباره تلاش کنید.';
      if (uploadFile) {
        setUploadState(upload, 'failed', 'ارسال فایل کامل نشد', uploadFile.name + ' • فایل هنوز ثبت نشده است', 0);
      }
      feedback(form, message, 'error');
    } finally {
      setSubmitting(form, button, false, original);
    }
  });
}());
