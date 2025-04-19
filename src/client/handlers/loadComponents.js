const fs = require("fs");
const path = require("path");

function loadComponents(client, logSummary = []) {
    const componentCount = { success: 0, failed: 0 };
    const componentsPath = path.resolve(__dirname, "../../discord/components");

    if (!fs.existsSync(componentsPath) || !fs.statSync(componentsPath).isDirectory()) {
        console.error(`Caminho de componentes inválido: ${componentsPath}`);
        return;
    }

    const loadFromDirectory = (directory) => {
        fs.readdirSync(directory).forEach((entry) => {
            const entryPath = path.join(directory, entry);
            const stats = fs.statSync(entryPath);

            if (stats.isDirectory()) {
                loadFromDirectory(entryPath);
            } else if (entry.endsWith(".js")) {
                try {
                    const components = [].concat(require(entryPath));
                    components.forEach((component) => {
                        if (!component?.id) {
                            console.warn(`Componente inválido ou sem ID em ${entryPath}`);
                            componentCount.failed++;
                        } else {
                            client.components.set(component.id, component);
                            componentCount.success++;
                        }
                    });
                } catch (error) {
                    console.error(`Erro ao carregar componente em ${entryPath}:`, error);
                    componentCount.failed++;
                }
            }
        });
    };

    loadFromDirectory(componentsPath);
    logSummary.push(`#dim [Ccmponents ${componentCount.success}] - #bold black[failed ${componentCount.failed}]`);
}

module.exports = loadComponents;
