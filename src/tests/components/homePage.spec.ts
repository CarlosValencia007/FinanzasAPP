import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { createRouter, createMemoryHistory } from "vue-router";
import Homepage from "../../pages/homepage.vue";
import Login from "../../components/Login.vue";

// Mock de useAuth
const mockCheckAuth = vi.fn().mockResolvedValue(false);
const mockGetUserEmail = { value: "" };

vi.mock("../../composables/useAuth", () => ({
    useAuth: vi.fn(() => ({
        checkAuth: mockCheckAuth,
        getUserEmail: mockGetUserEmail,
    })),
}));

// Mock de AOS
vi.mock("aos", () => ({
    default: {
        init: vi.fn(),
    },
}));

// Mock de vue-particles
vi.mock("vue-particles", () => ({
    default: {
        name: "VueParticles",
        template: "<div></div>",
    },
}));

describe("Homepage.vue", () => {
    let router: any;

    beforeEach(() => {
        // Crear un router mock para las pruebas
        router = createRouter({
            history: createMemoryHistory(),
            routes: [
                { path: "/", component: { template: "<div>Home</div>" } },
                { path: "/login", component: Login },
            ],
        });

        // Limpiar todos los mocks
        vi.clearAllMocks();
        mockCheckAuth.mockResolvedValue(false);
        mockGetUserEmail.value = "";
    });

    it("Renderiza el componente correctamente", () => {
        const wrapper = mount(Homepage, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.exists()).toBe(true);
        expect(wrapper.find(".homepage").exists()).toBe(true);
    });

    describe("Sección Hero", () => {
        it("Muestra la sección hero", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            expect(wrapper.find(".hero-section").exists()).toBe(true);
        });

        it("Muestra el badge 'Tu aliado financiero'", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            expect(wrapper.text()).toContain("Tu aliado financiero");
            expect(wrapper.find(".hero-badge").exists()).toBe(true);
        });

        it("Muestra el título principal", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            expect(wrapper.text()).toContain("Toma el control de");
            expect(wrapper.text()).toContain("finanzas");
            expect(wrapper.find(".hero-title").exists()).toBe(true);
        });

        it("Muestra el subtítulo", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            expect(wrapper.text()).toContain("Gestiona ingresos, gastos y presupuestos");
            expect(wrapper.find(".hero-subtitle").exists()).toBe(true);
        });

        it("Muestra el botón CTA cuando el usuario NO está autenticado", async () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            await flushPromises();

            expect(wrapper.find(".cta-button").exists()).toBe(true);
            expect(wrapper.text()).toContain("Comenzar gratis");
        });

        it("NO muestra el botón CTA cuando el usuario está autenticado", async () => {
            mockCheckAuth.mockResolvedValue(true);

            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            await flushPromises();
            await wrapper.vm.$nextTick();

            expect(wrapper.find(".cta-button").exists()).toBe(false);
        });

        it("Redirige a /login cuando se hace clic en el botón CTA", async () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            await flushPromises();

            const ctaButton = wrapper.find(".cta-button");
            await ctaButton.trigger("click");
            await flushPromises();

            expect(router.currentRoute.value.path).toBe("/login");
        });
    });

    describe("Hero Cards", () => {
        it("Muestra las tarjetas hero", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            expect(wrapper.find(".hero-cards").exists()).toBe(true);
            expect(wrapper.findAll(".info-card").length).toBe(3);
        });

        it("Muestra la tarjeta 'Gratis'", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            expect(wrapper.text()).toContain("Gratis");
            expect(wrapper.text()).toContain("Sin costos ocultos ni tarifas mensuales");
        });

        it("Muestra la tarjeta 'Seguro'", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            expect(wrapper.text()).toContain("Seguro");
            expect(wrapper.text()).toContain("Encriptación de extremo a extremo");
        });

        it("Muestra la tarjeta '24/7'", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            expect(wrapper.text()).toContain("24/7");
            expect(wrapper.text()).toContain("Disponible cuando lo necesites");
        });
    });

    describe("Sección de Características", () => {
        it("Muestra el encabezado de la sección", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            expect(wrapper.find(".features-section").exists()).toBe(true);
            expect(wrapper.text()).toContain("Características principales");
            expect(wrapper.text()).toContain("Todo lo que necesitas en un solo lugar");
        });

        it("Muestra 3 elementos de características", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            const featureItems = wrapper.findAll(".feature-item");
            expect(featureItems.length).toBe(3);
        });

        it("Muestra la característica 'Control de transacciones'", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            expect(wrapper.text()).toContain("Control de transacciones");
            expect(wrapper.text()).toContain("Registra y organiza tus ingresos y gastos");
        });

        it("Muestra la característica 'Balance en tiempo real'", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            expect(wrapper.text()).toContain("Balance en tiempo real");
            expect(wrapper.text()).toContain("Visualiza tu situación financiera actualizada");
        });

        it("Muestra la característica 'Historial detallado'", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            expect(wrapper.text()).toContain("Historial detallado");
            expect(wrapper.text()).toContain("Accede a todo tu historial con filtros inteligentes");
        });

        it("Cada característica tiene un icono", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            const iconWrappers = wrapper.findAll(".feature-icon-wrapper");
            expect(iconWrappers.length).toBe(3);
        });

        it("Cada característica tiene un número", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            expect(wrapper.text()).toContain("01");
            expect(wrapper.text()).toContain("02");
            expect(wrapper.text()).toContain("03");
        });
    });

    describe("Sección de Beneficios", () => {
        it("Muestra la sección de beneficios", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            expect(wrapper.find(".benefits-section").exists()).toBe(true);
            expect(wrapper.text()).toContain("¿Por qué elegir FinanzApp?");
        });

        it("Muestra los beneficios", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            expect(wrapper.text()).toContain("Interfaz intuitiva");
            expect(wrapper.text()).toContain("Visualización clara");
            expect(wrapper.text()).toContain("Categorías flexibles");
            expect(wrapper.text()).toContain("Reportes detallados");
        });
    });

    describe("Sección de Visión", () => {
        it("Muestra la sección de visión", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            expect(wrapper.find(".vision-section").exists()).toBe(true);
            expect(wrapper.text()).toContain("Nuestra Historia");
        });

        it("Muestra el contenido de la visión", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            expect(wrapper.text()).toContain("Creada por estudiantes, para estudiantes");
            expect(wrapper.text()).toContain("Universidad Laica Eloy Alfaro de Manabí");
        });
    });

    describe("Estructura General", () => {
        it("Contiene la sección hero", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            expect(wrapper.find(".hero-section").exists()).toBe(true);
        });

        it("Contiene la sección de características", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            expect(wrapper.find(".features-section").exists()).toBe(true);
        });

        it("Contiene la sección de beneficios", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            expect(wrapper.find(".benefits-section").exists()).toBe(true);
        });

        it("Contiene la sección de visión", () => {
            const wrapper = mount(Homepage, {
                global: { plugins: [router] },
            });

            expect(wrapper.find(".vision-section").exists()).toBe(true);
        });
    });
});
