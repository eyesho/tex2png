// a simple TeX-input example
import mathjax from "mathjax-node"
import readline from "readline";
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

mathjax.config({
    MathJax: {
        font:"Latin-Modern",
        // traditional MathJax configuration
        loader: {load: ['[tex]/unicode']},
        tex: {
            extensions: ['enclose.js'],
            packages: {'[+]': ['enclose']},
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
        undefinedFamily:'Arial Unicode MS'
    }
})

mathjax.start();

var yourMath = 'E = mc^2';

//\textcircled {1}
rl.on('line', function(line){
    mathjax.typeset({
            math: line,
            format: "TeX", // or "inline-TeX", "MathML"
            svg:true,      // or svg:true, or html:true
            packages: {'[+]': ['enclose']},
            Macros: {
                // 2. define new macro
                // @see https://docs.mathjax.org/en/v2.7-latest/tex.html#defining-tex-macros
                textcircled: ['\\enclose{circle}{#1}', 1],
            },
            nope:{}

        },
        function (data)
        {

            if (!data.errors)
            {
                console.log(data.svg)
            }
        }
    )
}
)