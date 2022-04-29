

class RenderMathjax:
    """
    usage:
        import sys
        sys.path.append("/home/ubuntu/Pictures/data_generator")
        from latex_render import RenderMathjax
    """

    def __init__(self, debug=False, format='mathml'):
        self.mathml_url = "http://192.168.8.156:4000/mathml"
        self.latex_url = "http://192.168.8.156:4000/latex"
        # self.latex_url = "http://localhost:4000/latex"
        # self.mathml_url = "http://localhost:4000/mathml"
        self.debug = debug
        self.format = format

    def process(self, latex_input):
        if self.format == 'mathml':
            result = post(url=self.mathml_url, data=latex_input.encode('utf-8'))
        else:
            result = post(url=self.latex_url, data=latex_input.encode('utf-8'))
            # print(result.json())

        result_json = result.json()
        if not bool(result_json) or result_json is None:
            raise "format error,try to change url(mathml or latex)"
        code = result_json['code']
        result = result_json['result']

        if code:
            file_bytes = cairosvg.svg2png(bytestring=result.encode('utf-8'), background_color='white',dpi=200)
            input_image = Image.open(io.BytesIO(file_bytes))
            input_image = np.asarray(input_image)

            return input_image
        else:
            print(result_json)
            return result

    def process_list(self, list_input):
        result = Parallel(n_jobs=6, backend='loky')(delayed(self.process)(i) for i in list_input)
        return result
