'use client';

import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

/**
 * COMPONENTE MODAL DEFINITIVO
 * 
 * Características:
 * - Renderiza NO BODY (usando Portal) - nunca fica preso no layout
 * - Acima de TUDO (z-index 100000)
 * - CENTRALIZADO na tela
 * - Scroll interno se necessário
 * - Responsivo para mobile
 * - Sem cortamento
 * 
 * Uso:
 * <Modal isOpen={isOpen} onClose={handleClose} title="Título">
 *   <form>...</form>
 * </Modal>
 */
export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  onSubmit,
  submitText = "Enviar para aprovação",
  cancelText = "Cancelar",
  isLoading = false
}) {
  const [mounted, setMounted] = useState(false);

  // Verificar se está no cliente (evita SSR issues)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Controlar scroll do body
  useEffect(() => {
    if (isOpen && mounted) {
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }

    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    };
  }, [isOpen, mounted]);

  if (!mounted || !isOpen) {
    return null;
  }

  // Renderizar usando Portal (IMPORTANTE!)
  return ReactDOM.createPortal(
    <div 
      className="modal-container"
      onClick={(e) => {
        // Fechar ao clicar fora do modal
        if (e.target === e.currentTarget && !isLoading) {
          onClose?.();
        }
      }}
    >
      <div className="modal modal-content">
        
        {/* HEADER */}
        {title && (
          <div className="modal-header">
            <h2>{title}</h2>
            <button 
              type="button"
              onClick={onClose}
              disabled={isLoading}
              aria-label="Fechar"
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                color: '#999',
                padding: '0',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isLoading ? 0.5 : 1
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* BODY */}
        <div className="modal-body">
          {children}
        </div>

        {/* FOOTER */}
        {onSubmit && (
          <div className="modal-footer">
            <button 
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="btn btn-secondary"
              style={{
                padding: '10px 16px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                backgroundColor: isLoading ? '#999' : '#6c757d',
                color: 'white',
                transition: 'background-color 0.2s'
              }}
            >
              {cancelText}
            </button>
            <button 
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                onSubmit?.(e);
              }}
              disabled={isLoading}
              className="btn btn-primary"
              style={{
                padding: '10px 16px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                backgroundColor: isLoading ? '#999' : '#28a745',
                color: 'white',
                transition: 'background-color 0.2s',
                minWidth: '150px'
              }}
            >
              {isLoading ? 'Enviando...' : submitText}
            </button>
          </div>
        )}

      </div>
    </div>,
    document.body // RENDERIZAR NO BODY!
  );
}

/**
 * COMPONENTE COMPLETO: Modal com Formulário
 * 
 * Use este se precisar de formulário pronto
 */
export function ModalComForm({
  isOpen,
  onClose,
  onSubmit,
  title = "Aprovações",
  isLoading = false,
  fields = []
}) {
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({
      ...acc,
      [field.id]: field.type === 'checkbox' ? false : ''
    }), {})
  );

  const handleChange = (e) => {
    const { id, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : type === 'file' ? files?.[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitText="Enviar para aprovação"
      cancelText="Cancelar"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {fields.map((field) => (
          <div key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {field.type !== 'checkbox' && field.label && (
              <label 
                htmlFor={field.id}
                style={{ fontWeight: '500', fontSize: '13px', color: '#333' }}
              >
                {field.label}
                {field.required && <span style={{ color: 'red', marginLeft: '2px' }}>*</span>}
              </label>
            )}

            {field.type === 'textarea' ? (
              <textarea
                id={field.id}
                placeholder={field.placeholder}
                value={formData[field.id] || ''}
                onChange={handleChange}
                disabled={isLoading}
                required={field.required}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  minHeight: '100px',
                  resize: 'vertical',
                  opacity: isLoading ? 0.6 : 1
                }}
              />
            ) : field.type === 'select' ? (
              <select
                id={field.id}
                value={formData[field.id] || ''}
                onChange={handleChange}
                disabled={isLoading}
                required={field.required}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1
                }}
              >
                <option value="">Selecione uma opção</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <label style={{ display: 'flex', gap: '8px', alignItems: 'center', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.6 : 1 }}>
                <input
                  id={field.id}
                  type="checkbox"
                  checked={formData[field.id] || false}
                  onChange={handleChange}
                  disabled={isLoading}
                  style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
                />
                {field.label}
                {field.required && <span style={{ color: 'red' }}>*</span>}
              </label>
            ) : (
              <input
                id={field.id}
                type={field.type || 'text'}
                placeholder={field.placeholder}
                value={formData[field.id] || ''}
                onChange={handleChange}
                disabled={isLoading}
                required={field.required}
                accept={field.accept}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  cursor: field.type === 'file' ? 'pointer' : 'text',
                  opacity: isLoading ? 0.6 : 1
                }}
              />
            )}

            {field.type === 'file' && formData[field.id] && (
              <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                ✓ {formData[field.id].name}
              </p>
            )}

            {field.hint && (
              <p style={{ fontSize: '12px', color: '#999', margin: '4px 0 0 0' }}>
                {field.hint}
              </p>
            )}
          </div>
        ))}
      </form>
    </Modal>
  );
}
