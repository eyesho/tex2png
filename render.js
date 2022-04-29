// a simple TeX-input example
import mathjax from "mathjax"
import {json} from "express";

mathjax.MathJax.config({
    undefinedCharError: false,
    MathJax: {
        font:"Latin-Modern",
        // traditional MathJax configuration
        loader: {load: ['input/tex-full',
                'input/mml',
                'output/svg',
                'ui/menu',
                'ui/safe',
                'a11y/semantic-enrich',
                'a11y/complexity',
                'a11y/explorer',
                'a11y/assistive-mml',
                '[tex]/ams',
                '[tex]/braket',
                '[tex]/boldsymbol',
                '[tex]/require',
                '[tex]/html',
                '[tex]/unicode',
                '[tex]/verb']},
        tex: {
            extensions: ['enclose.js'],
            loader: {load: ['[tex]/unicode']},
            packages: {'[+]': ['enclose','unicode']},
            Macros: {
                // 2. define new macro
                // @see https://docs.mathjax.org/en/v2.7-latest/tex.html#defining-tex-macros
                textcircled: ['\\enclose{circle}{#1}', 1],
            }
        }

    },
    SVG: {
        scale: 100,
        font:"Tex",
        mtextFont: 'arial unicode ms',
        undefinedFamily:'Arial Unicode MS'
    }
})

mathjax.start()

export function process_mathml(line,format){
    let ss = Object()
     {
        mathjax.typeset({
                math: line,
                format: format, // or "inline-TeX", "MathML"
                svg:false,      // or svg:true, or html:true
                html:true,
                xmlns: "mml",
            },
            function (data)
            {
                if (data.errors){
                    ss.code = false
                    ss.result = data.errors
                }
                else
                {      //data.svg
                    ss.code = true
                    console.log(data.html)
                    ss.result = data.svg
                }
            }
        )
    }

    return ss
}

const ml  = "<math><mrow><msup><mrow><mn>2018</mn></mrow><mn>0</mn></msup><mi>﹣</mi><mo>|</mo><mi>﹣</mi><msqrt><mn>2</mn></msqrt><mo>|</mo><mo>+</mo><msup><mrow><mo stretchy=\"false\">(</mo><mfrac><mn>1</mn><mn>3</mn></mfrac><mo stretchy=\"false\">)</mo></mrow><mrow><mo>−</mo><mn>1</mn></mrow></msup><mo>+</mo><mn>2</mn><mi>s</mi><mi>i</mi><mi>n</mi><mn>45</mn><mo>°</mo></mrow></math>"

const svgString = new XMLSerializer().serializeToString(process_mathml(ml,'MathML'))

console.log(svgString)
