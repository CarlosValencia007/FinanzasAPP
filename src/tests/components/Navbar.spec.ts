import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { createRouter, createMemoryHistory } from "vue-router";
import Navbar from "../../components/Navbar.vue";
import Login from "../../components/Login.vue";
import Register from "../../components/Register.vue";

// Mock del composable useAuth
const mockCheckAuth = vi.fn().mockResolvedValue(false);
const mockLogout = vi.fn().mockResolvedValue(undefined);
const mockGetUserEmail = { value: "" };

vi.mock("../../composables/useAuth", () => ({
    useAuth: vi.fn(() => ({
        checkAuth: mockCheckAuth,
        logout: mockLogout,
        getUserEmail: mockGetUserEmail,
    })),
}));

describe("Navbar.vue", () => {
    let router: any;

    beforeEach(() => {
        // Crear un router mock para las pruebas
        router = createRouter({
            history: createMemoryHistory(),
            routes: [
                { path: "/", component: { template: "<div>Home</div>" } },
                { path: "/login", component: Login },
                { path: "/register", component: Register },
                { path: "/dashboard", component: { template: "<div>Dashboard</div>" } },
                { path: "/transactions", component: { template: "<div>Transactions</div>" } },
            ],
        });

        // Limpiar todos los mocks
        vi.clearAllMocks();
        mockCheckAuth.mockResolvedValue(false);
        mockGetUserEmail.value = "";
    });

    it("Renderiza el componente correctamente", () => {
        const wrapper = mount(Navbar, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.exists()).toBe(true);
        expect(wrapper.find("nav").exists()).toBe(true);
        expect(wrapper.find("header").exists()).toBe(true);
    });

    it("Muestra el logo de FINANZAPP", () => {
        const wrapper = mount(Navbar, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.text()).toContain("FINANZAPP");
        expect(wrapper.find(".logo").exists()).toBe(true);
    });



    it("Muestra los enlaces de navegación cuando el usuario NO está autenticado", async () => {
        const wrapper = mount(Navbar, {
            global: {
                plugins: [router],
            },
        });

        await flushPromises();

        expect(wrapper.text()).toContain("Inicio");
        expect(wrapper.text()).toContain("Iniciar Sesión");
        expect(wrapper.text()).toContain("Registrarse");
    });

    it("Muestra los enlaces de navegación cuando el usuario está autenticado", async () => {
        mockCheckAuth.mockResolvedValue(true);
        mockGetUserEmail.value = "test@live.uleam.edu.ec";

        const wrapper = mount(Navbar, {
            global: {
                plugins: [router],
            },
        });

        await flushPromises();
        await wrapper.vm.$nextTick();

        expect(wrapper.text()).toContain("Dashboard");
        expect(wrapper.text()).toContain("Transacciones");
        expect(wrapper.text()).toContain("Cerrar Sesión");
    });

    it("Muestra botones de autenticación cuando el usuario NO está autenticado", async () => {
        const wrapper = mount(Navbar, {
            global: {
                plugins: [router],
            },
        });

        await flushPromises();

        expect(wrapper.text()).toContain("Iniciar Sesión");
        expect(wrapper.text()).toContain("Registrarse");
        expect(wrapper.find(".login-nav-link").exists()).toBe(true);
        expect(wrapper.find(".register-nav-link").exists()).toBe(true);
    });

    it("Muestra botón de cerrar sesión cuando el usuario está autenticado", async () => {
        mockCheckAuth.mockResolvedValue(true);

        const wrapper = mount(Navbar, {
            global: {
                plugins: [router],
            },
        });

        await flushPromises();
        await wrapper.vm.$nextTick();

        expect(wrapper.text()).toContain("Cerrar Sesión");
        expect(wrapper.find(".logout-nav-button").exists()).toBe(true);
    });

    it("Contiene enlaces con RouterLink", () => {
        const wrapper = mount(Navbar, {
            global: {
                plugins: [router],
            },
        });

        const routerLinks = wrapper.findAllComponents({ name: "RouterLink" });
        expect(routerLinks.length).toBeGreaterThan(0);
    });

    it("El enlace de login apunta a /login", () => {
        const wrapper = mount(Navbar, {
            global: {
                plugins: [router],
            },
        });

        const links = wrapper.findAllComponents({ name: "RouterLink" });
        const loginLink = links.find(link => link.props("to") === "/login");
        expect(loginLink).toBeDefined();
        expect(loginLink?.props("to")).toBe("/login");
    });

    it("El enlace de registro apunta a /register", () => {
        const wrapper = mount(Navbar, {
            global: {
                plugins: [router],
            },
        });

        const links = wrapper.findAllComponents({ name: "RouterLink" });
        const registerLink = links.find(link => link.props("to") === "/register");

        expect(registerLink).toBeDefined();
        expect(registerLink?.props("to")).toBe("/register");
    });

    it("Muestra el botón del menú móvil", () => {
        const wrapper = mount(Navbar, {
            global: {
                plugins: [router],
            },
        });

        const menuToggle = wrapper.find(".menu-toggle");
        expect(menuToggle.exists()).toBe(true);
        expect(menuToggle.attributes("aria-label")).toBe("Abrir menú");
    });

    it("El botón del menú móvil tiene 3 spans", () => {
        const wrapper = mount(Navbar, {
            global: {
                plugins: [router],
            },
        });

        const menuToggle = wrapper.find(".menu-toggle");
        const spans = menuToggle.findAll("span");
        expect(spans.length).toBe(3);
    });

    it("Abre y cierra el menú móvil al hacer clic", async () => {
        const wrapper = mount(Navbar, {
            global: {
                plugins: [router],
            },
        });

        const menuToggle = wrapper.find(".menu-toggle");
        const navLinks = wrapper.find(".nav-links");

        // Inicialmente el menú no debería estar abierto
        expect(navLinks.classes()).not.toContain("nav-links-open");

        // Hacer clic para abrir
        await menuToggle.trigger("click");
        await wrapper.vm.$nextTick();

        // El menú debería estar abierto
        expect(navLinks.classes()).toContain("nav-links-open");
        expect(menuToggle.attributes("aria-label")).toBe("Cerrar menú");

        // Hacer clic para cerrar
        await menuToggle.trigger("click");
        await wrapper.vm.$nextTick();

        // El menú debería estar cerrado
        expect(navLinks.classes()).not.toContain("nav-links-open");
    });

    it("Cierra el menú al hacer clic en un enlace", async () => {
        const wrapper = mount(Navbar, {
            global: {
                plugins: [router],
            },
        });

        const menuToggle = wrapper.find(".menu-toggle");
        const navLinks = wrapper.find(".nav-links");

        // Abrir el menú
        await menuToggle.trigger("click");
        await wrapper.vm.$nextTick();
        expect(navLinks.classes()).toContain("nav-links-open");

        // Hacer clic en un enlace
        const loginLink = wrapper.findAllComponents({ name: "RouterLink" })
            .find(link => link.props("to") === "/login");
        
        if (loginLink) {
            await loginLink.trigger("click");
            await wrapper.vm.$nextTick();
            
            // El menú debería estar cerrado
            expect(navLinks.classes()).not.toContain("nav-links-open");
        }
    });

    it("Tiene definido el manejador de logout", () => {
        const wrapper = mount(Navbar, {
            global: {
                plugins: [router],
            },
        });

        // Verificar que el componente tiene el método handleLogout
        expect(typeof (wrapper.vm as any).handleLogout).toBe("function");
    });

    it("Ejecuta logout cuando se hace clic en cerrar sesión", async () => {
        mockCheckAuth.mockResolvedValue(true);

        const wrapper = mount(Navbar, {
            global: {
                plugins: [router],
            },
        });

        await flushPromises();
        await wrapper.vm.$nextTick();

        const logoutButton = wrapper.find(".logout-nav-button");
        await logoutButton.trigger("click");
        await flushPromises();

        expect(mockLogout).toHaveBeenCalled();
    });

    it("Actualiza el estado cuando cambia la ruta", async () => {
        const wrapper = mount(Navbar, {
            global: {
                plugins: [router],
            },
        });

        await flushPromises();

        // Cambiar la ruta
        await router.push("/dashboard");
        await flushPromises();
        await wrapper.vm.$nextTick();

        // Verificar que se llamó checkAuth después del cambio de ruta
        expect(mockCheckAuth).toHaveBeenCalled();
    });
});
