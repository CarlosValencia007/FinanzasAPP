import { mount } from "@vue/test-utils";
import Grafico from "../../components/Grafico.vue";
import { describe, expect, it } from "vitest";

describe("Grafico.vue", () => {
    it("Renderiza el componente correctamente", () => {
        const wrapper = mount(Grafico);

        expect(wrapper.exists()).toBe(true);
    });

    it("Muestra el mensaje del gráfico", () => {
        const wrapper = mount(Grafico);

        expect(wrapper.text()).toContain("Gráfico de Finanzas");
        expect(wrapper.find("h2").exists()).toBe(true);
    });

    it("Tiene la estructura básica del componente", () => {
        const wrapper = mount(Grafico);

        expect(wrapper.find("div").exists()).toBe(true);
        expect(wrapper.find("h2").exists()).toBe(true);
    });
});
