import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { createRouter, createMemoryHistory } from "vue-router";
import { supabase } from "../../lib/conectionWithSupabase";
import Register from "../../components/Register.vue";
import Login from "../../components/Login.vue";

// Mock de Supabase
vi.mock("../../lib/conectionWithSupabase", () => ({
    supabase: {
        auth: {
            signUp: vi.fn(),
        },
    },
}));

// Mock de useToast
vi.mock("../../composables/useToast", () => ({
    useToast: () => ({
        toasts: [],
        removeToast: vi.fn(),
        success: vi.fn(),
        error: vi.fn(),
    }),
}));

describe("Register.vue", () => {
    let router: any;

    beforeEach(() => {
        // Crear un router mock para las pruebas
        router = createRouter({
            history: createMemoryHistory(),
            routes: [
                { path: "/", component: { template: "<div>Home</div>" } },
                { path: "/login", component: Login },
                { path: "/register", component: Register },
            ],
        });

        // Limpiar localStorage y sessionStorage antes de cada test
        localStorage.clear();
        sessionStorage.clear();

        // Limpiar todos los mocks
        vi.clearAllMocks();
    });

    it("Renderiza el componente correctamente", () => {
        const wrapper = mount(Register, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.exists()).toBe(true);
        expect(wrapper.find(".register-container").exists()).toBe(true);
        expect(wrapper.find(".register-card").exists()).toBe(true);
    });

    it("Muestra el título y eslogan de la aplicación", () => {
        const wrapper = mount(Register, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.text()).toContain("FINANZAPP");
        expect(wrapper.text()).toContain("Tu aliado financiero");
        expect(wrapper.text()).toContain("Crear Cuenta");
        expect(wrapper.find(".logo-title").exists()).toBe(true);
        expect(wrapper.find(".logo-tagline").exists()).toBe(true);
    });

    it("Muestra el formulario de registro con todos los campos", () => {
        const wrapper = mount(Register, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.find("form").exists()).toBe(true);
        expect(wrapper.find('input[type="email"]').exists()).toBe(true);
        expect(wrapper.find('input[id="firstName"]').exists()).toBe(true);
        expect(wrapper.find('input[id="lastName"]').exists()).toBe(true);
        expect(wrapper.find('input[id="password"]').exists()).toBe(true);
        expect(wrapper.find('input[id="confirmPassword"]').exists()).toBe(true);
        expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
    });

    it("Actualiza los valores del modelo cuando el usuario escribe", async () => {
        const wrapper = mount(Register, {
            global: {
                plugins: [router],
            },
        });

        const emailInput = wrapper.find('input[type="email"]');
        const firstNameInput = wrapper.find('input[id="firstName"]');
        const lastNameInput = wrapper.find('input[id="lastName"]');
        const passwordInput = wrapper.find('input[id="password"]');

        await emailInput.setValue("e1315844983@live.uleam.edu.ec");
        await firstNameInput.setValue("David");
        await lastNameInput.setValue("Jaramillo");
        await passwordInput.setValue("David132#");

        expect((emailInput.element as HTMLInputElement).value).toBe("e1315844983@live.uleam.edu.ec");
        expect((firstNameInput.element as HTMLInputElement).value).toBe("David");
        expect((lastNameInput.element as HTMLInputElement).value).toBe("Jaramillo");
        expect((passwordInput.element as HTMLInputElement).value).toBe("David132#");
    });

    it("Valida que el correo sea del dominio institucional", async () => {
        const wrapper = mount(Register, {
            global: {
                plugins: [router],
            },
        });

        const emailInput = wrapper.find('input[type="email"]');
        
        // Probar con email inválido
        await emailInput.setValue("test@gmail.com");
        await emailInput.trigger("blur");
        await wrapper.vm.$nextTick();

        expect(wrapper.text()).toContain("@live.uleam.edu.ec");
        expect(wrapper.find(".error-message").exists()).toBe(true);
    });

    it("Muestra mensaje de éxito cuando el correo es válido", async () => {
        const wrapper = mount(Register, {
            global: {
                plugins: [router],
            },
        });

        const emailInput = wrapper.find('input[type="email"]');
        
        await emailInput.setValue("test@live.uleam.edu.ec");
        await emailInput.trigger("blur");
        await wrapper.vm.$nextTick();

        expect(wrapper.text()).toContain("✓ Correo válido");
        expect(wrapper.find(".success-message").exists()).toBe(true);
    });

    it("Muestra los requisitos de contraseña", () => {
        const wrapper = mount(Register, {
            global: {
                plugins: [router],
            },
        });

        expect(wrapper.find(".password-requirements").exists()).toBe(true);
        expect(wrapper.text()).toContain("8+ caracteres");
        expect(wrapper.text()).toContain("Mayúscula");
        expect(wrapper.text()).toContain("Minúscula");
        expect(wrapper.text()).toContain("Número");
        expect(wrapper.text()).toContain("Especial");
    });

    it("Actualiza los requisitos de contraseña cuando el usuario escribe", async () => {
        const wrapper = mount(Register, {
            global: {
                plugins: [router],
            },
        });

        const passwordInput = wrapper.find('input[id="password"]');
        
        // Escribir una contraseña que cumple algunos requisitos
        await passwordInput.setValue("David1#");
        await passwordInput.trigger("input");
        await wrapper.vm.$nextTick();

        // Verificar que algunos requisitos se marcan como cumplidos
        const requirements = wrapper.findAll(".requirement");
        expect(requirements.length).toBeGreaterThan(0);
    });

    it("Alterna la visibilidad de la contraseña al hacer clic en el botón", async () => {
        const wrapper = mount(Register, {
            global: {
                plugins: [router],
            },
        });

        const passwordInput = wrapper.find('input[id="password"]');
        const toggleButtons = wrapper.findAll(".password-toggle");
        const toggleButton = toggleButtons[0];

        // Inicialmente debe ser tipo password
        expect(passwordInput.attributes("type")).toBe("password");

        // Hacer clic en el botón de toggle
        await toggleButton.trigger("click");
        await wrapper.vm.$nextTick();

        // Ahora debe ser tipo text
        expect(passwordInput.attributes("type")).toBe("text");

        // Hacer clic de nuevo
        await toggleButton.trigger("click");
        await wrapper.vm.$nextTick();

        // Debe volver a ser password
        expect(passwordInput.attributes("type")).toBe("password");
    });

    it("Alterna la visibilidad de la confirmación de contraseña", async () => {
        const wrapper = mount(Register, {
            global: {
                plugins: [router],
            },
        });

        const confirmPasswordInput = wrapper.find('input[id="confirmPassword"]');
        const toggleButtons = wrapper.findAll(".password-toggle");
        const toggleConfirmButton = toggleButtons[1];

        expect(confirmPasswordInput.attributes("type")).toBe("password");

        await toggleConfirmButton.trigger("click");
        await wrapper.vm.$nextTick();

        expect(confirmPasswordInput.attributes("type")).toBe("text");
    });

    it("Valida que las contraseñas coincidan", async () => {
        const wrapper = mount(Register, {
            global: {
                plugins: [router],
            },
        });

        const passwordInput = wrapper.find('input[id="password"]');
        const confirmPasswordInput = wrapper.find('input[id="confirmPassword"]');

        await passwordInput.setValue("David123#");
        await passwordInput.trigger("input");
        
        await confirmPasswordInput.setValue("DifferentPass123#");
        await confirmPasswordInput.trigger("input");
        await wrapper.vm.$nextTick();

        expect(wrapper.text()).toContain("Las contraseñas no coinciden");
        expect(wrapper.find(".error-message").exists()).toBe(true);
    });

    it("Muestra mensaje de éxito cuando las contraseñas coinciden", async () => {
        const wrapper = mount(Register, {
            global: {
                plugins: [router],
            },
        });

        const passwordInput = wrapper.find('input[id="password"]');
        const confirmPasswordInput = wrapper.find('input[id="confirmPassword"]');

        await passwordInput.setValue("David123#");
        await passwordInput.trigger("input");
        
        await confirmPasswordInput.setValue("David123#");
        await confirmPasswordInput.trigger("input");
        await wrapper.vm.$nextTick();

        expect(wrapper.text()).toContain("✓ Las contraseñas coinciden");
        expect(wrapper.find(".success-message").exists()).toBe(true);
    });

    it("Contiene un enlace para iniciar sesión", () => {
        const wrapper = mount(Register, {
            global: { plugins: [router] },
        });

        const links = wrapper.findAllComponents({ name: "RouterLink" });
        const loginLink = links.find(link => link.props("to") === "/login");

        expect(loginLink).toBeDefined();
        expect(loginLink?.props("to")).toBe("/login");
        expect(wrapper.text()).toContain("¿Ya tienes cuenta?");
        expect(wrapper.text()).toContain("Inicia Sesión");
    });

    it("Registra correctamente con credenciales válidas", async () => {
        // Mock de la respuesta de Supabase
        (supabase.auth.signUp as any).mockResolvedValue({
            data: { 
                user: { 
                    email: "e1315844999@live.uleam.edu.ec",
                    user_metadata: {
                        first_name: "David",
                        last_name: "Javier",
                    }
                } 
            },
            error: null,
        });

        const wrapper = mount(Register, {
            global: {
                plugins: [router],
            },
        });

        // Llenar el formulario
        await wrapper.find('input[type="email"]').setValue("e1315844999@live.uleam.edu.ec");
        await wrapper.find('input[type="email"]').trigger("blur");
        
        await wrapper.find('input[id="firstName"]').setValue("David");
        await wrapper.find('input[id="lastName"]').setValue("Javier");
        
        await wrapper.find('input[id="password"]').setValue("David123#");
        await wrapper.find('input[id="password"]').trigger("input");
        
        await wrapper.find('input[id="confirmPassword"]').setValue("David123#");
        await wrapper.find('input[id="confirmPassword"]').trigger("input");
        
        await wrapper.vm.$nextTick();

        // Enviar el formulario
        await wrapper.find("form").trigger("submit.prevent");
        await flushPromises();

        // Verificar que se llamó al método de registro con los datos correctos
        expect(supabase.auth.signUp).toHaveBeenCalledWith({
            email: "e1315844999@live.uleam.edu.ec",
            password: "David123#",
            options: {
                data: {
                    first_name: "David",
                    last_name: "Javier",
                    full_name: "David Javier",
                },
            },
        });
    });

    it("Muestra el estado de carga mientras se procesa el registro", async () => {
        // Mock de la respuesta de Supabase con delay
        (supabase.auth.signUp as any).mockImplementation(() => 
            new Promise(resolve => setTimeout(() => resolve({ data: {}, error: null }), 100))
        );

        const wrapper = mount(Register, {
            global: {
                plugins: [router],
            },
        });

        // Llenar el formulario con datos válidos
        await wrapper.find('input[type="email"]').setValue("e1315844999@live.uleam.edu.ec");
        await wrapper.find('input[type="email"]').trigger("blur");
        
        await wrapper.find('input[id="firstName"]').setValue("David");
        await wrapper.find('input[id="lastName"]').setValue("Javier");
        
        await wrapper.find('input[id="password"]').setValue("David123#");
        await wrapper.find('input[id="password"]').trigger("input");
        
        await wrapper.find('input[id="confirmPassword"]').setValue("David123#");
        await wrapper.find('input[id="confirmPassword"]').trigger("input");
        
        await wrapper.vm.$nextTick();

        // Enviar el formulario
        const submitPromise = wrapper.find("form").trigger("submit.prevent");
        await wrapper.vm.$nextTick();

        // Verificar que muestra el spinner
        expect(wrapper.text()).toContain("Registrando...");
        expect(wrapper.find(".loading-spinner").exists()).toBe(true);

        await submitPromise;
        await flushPromises();
    });

    it("Deshabilita el botón de registro cuando el formulario no es válido", async () => {
        const wrapper = mount(Register, {
            global: {
                plugins: [router],
            },
        });

        const submitButton = wrapper.find('button[type="submit"]');
        expect(submitButton.attributes("disabled")).toBeDefined();
    });

    it("Habilita el botón de registro cuando el formulario es válido", async () => {
        const wrapper = mount(Register, {
            global: {
                plugins: [router],
            },
        });

        // Llenar el formulario con datos válidos
        await wrapper.find('input[type="email"]').setValue("test@live.uleam.edu.ec");
        await wrapper.find('input[type="email"]').trigger("blur");
        
        await wrapper.find('input[id="firstName"]').setValue("David");
        await wrapper.find('input[id="lastName"]').setValue("Javier");
        
        await wrapper.find('input[id="password"]').setValue("David123#");
        await wrapper.find('input[id="password"]').trigger("input");
        
        await wrapper.find('input[id="confirmPassword"]').setValue("David123#");
        await wrapper.find('input[id="confirmPassword"]').trigger("input");
        
        await wrapper.vm.$nextTick();

        const submitButton = wrapper.find('button[type="submit"]');
        // El botón no debería estar deshabilitado si el formulario es válido
        expect(submitButton.attributes("disabled")).toBeUndefined();
    });
});
