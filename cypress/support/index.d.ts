/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Inicia sesión con Supabase usando credenciales reales
     * @param email - Correo electrónico del usuario
     * @param password - Contraseña del usuario
     * @param rememberMe - Si es true, guarda en localStorage (por defecto: true)
     * @example
     * cy.login('test@live.uleam.edu.ec', 'password123')
     */
    login(email: string, password: string, rememberMe?: boolean): Chainable<void>;
    
    /**
     * Cierra sesión limpiando localStorage y sessionStorage
     * @example
     * cy.logout()
     */
    logout(): Chainable<void>;
    
    /**
     * Realiza login y visita una ruta específica (no puede ser /login o /register)
     * @param route - Ruta a visitar después del login
     * @param email - Correo electrónico (opcional, usa TEST_USER_EMAIL por defecto)
     * @param password - Contraseña (opcional, usa TEST_USER_PASSWORD por defecto)
     * @param rememberMe - Si es true, guarda en localStorage (por defecto: true)
     * @example
     * cy.loginAndVisit('/dashboard')
     * cy.loginAndVisit('/transactions')
     */
    loginAndVisit(route: string, email?: string, password?: string, rememberMe?: boolean): Chainable<void>;
  }
}

