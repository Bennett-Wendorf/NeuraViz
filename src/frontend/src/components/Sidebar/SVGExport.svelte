<script lang="ts">
    import { Button, Tooltip } from 'flowbite-svelte';
    import resolveConfig from 'tailwindcss/resolveConfig'
    import tailwindConfig from '../../../tailwind.config.cjs'

    const fullTailwindConfig = resolveConfig(tailwindConfig)

    import { modelValid } from '../../utils/stores';
    import * as d3 from 'd3';

    let exportButtonDisabled: boolean = !$modelValid;

    $: exportButtonDisabled = !$modelValid;

    function retrieveSVG() {
        const svgElement = (d3.select('#graph>svg').node() as Node).cloneNode(true);
        const isDarkMode = d3.select('html').classed('dark');
        convertTailwindToInline(svgElement, isDarkMode);
        var svgString = new XMLSerializer().serializeToString(svgElement);

        var downloadLink = document.createElement('a');
        downloadLink.href = `data:image/svg+xml,${encodeURIComponent(svgString)}`;
        downloadLink.download = 'model.svg';

        downloadLink.click();
    }

    function convertTailwindToInline(svgElement: Node, isDarkMode: boolean) {
        function traverseAndConvert(element: Node) {
            if (element instanceof Element) {
                if (element.hasAttribute("class")){
                    const classNames = element.getAttribute('class').split(' ');
                    const inlineStyles = classNames
                        .map((className) => {
                            let parsedClass = className.split(':');
                            const isDarkClass = parsedClass[0] === 'dark';
                            if (isDarkClass) {
                                parsedClass.shift();
                                if (!isDarkMode) {
                                    return '';
                                }
                            } else {
                                if (isDarkMode) {
                                    return '';
                                }
                            }
                            parsedClass = parsedClass[0].split('-');
                            const attr = parsedClass[0];
                            const color = parsedClass[1];
                            const shade = parsedClass[2];

                            if (attr !== 'fill' && attr !== 'stroke') {
                                return '';
                            }

                            if (!shade && color.startsWith('[')) {
                                return `${attr}: ${color.substring(1, color.length - 1)};`;
                            }
                            
                            return `${attr}: ${fullTailwindConfig.theme.colors[color][shade]};`;
                        })
                        .join(' ');

                    element.removeAttribute('class');
                    element.setAttribute('style', inlineStyles);
                }

                element.childNodes.forEach((child) => traverseAndConvert(child));
            }
        }

        // Replace classes with inline styles
        traverseAndConvert(svgElement);
    }
</script>

<div class="flex flex-row gap-2 justify-center ml-3">
    <Button on:click={retrieveSVG} disabled={exportButtonDisabled}>
        Export as SVG
    </Button>
    {#if exportButtonDisabled}
        <Tooltip class="bg-neutral-700 text-white dark:bg-neutral-800">Please upload a file before exporting</Tooltip>
    {/if}
</div>