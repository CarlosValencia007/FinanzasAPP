import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach } from "vitest";
import { createRouter, createMemoryHistory } from "vue-router";
import Footer from "../../components/Footer.vue";

describe("Footer.vue", () => {
    let router: any;

    beforeEach( () => {
        // Crear un router mock para las pruebas
        router = createRouter({
            history: createMemoryHistory(),
            routes: [
                { path: "/", component: { template: "<div>Home</div>" } },
                { path: "/dashboard", component: { template: "<div>Dashboard</div>" } },
                { path: "/transactions", component: { template: "<div>Transactions</div>" } },
            ],
        });
        
    });

    it("Renderiza el componente correctamente", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.exists()).toBe(true);
        expect(wrapper.find("footer").exists()).toBe(true);
        expect(wrapper.find(".footer-section").exists()).toBe(true);
    });

    it("Muestra el título de la marca FINANZAPP", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.text()).toContain("FINANZAPP");
        expect(wrapper.find(".brand-title").exists()).toBe(true);
    });

    it("Muestra la descripción de la marca", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.text()).toContain("La herramienta más simple y efectiva");
        expect(wrapper.find(".brand-description").exists()).toBe(true);
    });

    it("Muestra el año actual en el copyright", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        const currentYear = new Date().getFullYear();
        expect(wrapper.text()).toContain(`© ${currentYear}`);
        expect(wrapper.find(".copyright").exists()).toBe(true);
    });

    it("Muestra la sección de Navegación con sus enlaces", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.text()).toContain("Navegación");
        expect(wrapper.text()).toContain("Inicio");
        expect(wrapper.find(".footer-column").exists()).toBe(true);
        expect(wrapper.find(".column-title").exists()).toBe(true);
    });

    it("Muestra los enlaces de navegación correctos", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.text()).toContain("Dashboard");
        expect(wrapper.text()).toContain("Transacciones");
    });

    it("Muestra el logo de ULEAM", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.find(".footer-brand").exists()).toBe(true);
        expect(wrapper.find(".uleam-logo").exists()).toBe(true);
    });

    it("Muestra el texto de la universidad", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.text()).toContain("Proyecto desarrollado por estudiantes");
        expect(wrapper.text()).toContain("Universidad Laica Eloy Alfaro de Manabí");
        expect(wrapper.find(".university-text").exists()).toBe(true);
    });

    it("Muestra el mensaje en el footer bottom", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.text()).toContain("Hecho con");
        expect(wrapper.text()).toContain("para ayudarte a manejar tus finanzas");
        expect(wrapper.find(".footer-bottom").exists()).toBe(true);
    });

    it("Contiene RouterLinks para navegación", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        const routerLinks = wrapper.findAllComponents({ name: "RouterLink" });
        expect(routerLinks.length).toBeGreaterThan(0);
    });

    it("El enlace de Inicio apunta a /", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        const links = wrapper.findAllComponents({ name: "RouterLink" });
        const homeLink = links.find(link => link.props("to") === "/");

        expect(homeLink).toBeDefined();
        expect(homeLink?.props("to")).toBe("/");
    });

    it("El enlace de Dashboard apunta a /dashboard", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        const links = wrapper.findAllComponents({ name: "RouterLink" });
        const dashboardLink = links.find(link => link.props("to") === "/dashboard");

        expect(dashboardLink).toBeDefined();
        expect(dashboardLink?.props("to")).toBe("/dashboard");
    });

    it("El enlace de Transacciones apunta a /transactions", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        const links = wrapper.findAllComponents({ name: "RouterLink" });
        const transactionsLink = links.find(link => link.props("to") === "/transactions");

        expect(transactionsLink).toBeDefined();
        expect(transactionsLink?.props("to")).toBe("/transactions");
    });

    it("Los enlaces tienen la clase footer-link", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        const footerLinks = wrapper.findAll(".footer-link");
        expect(footerLinks.length).toBeGreaterThan(0);
    });

    it("Tiene la estructura de grid correcta", () => {
        const wrapper = mount(Footer, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.find(".footer-grid").exists()).toBe(true);
        expect(wrapper.find(".footer-brand").exists()).toBe(true);
        expect(wrapper.find(".footer-column").exists()).toBe(true);
        expect(wrapper.find(".footer-about").exists()).toBe(true);
    });
});
