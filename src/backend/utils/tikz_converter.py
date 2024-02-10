from models.graph.Graph import Graph

def get_tikz_representation(graph: Graph) -> str:
    tikz = ""
    for node in graph.nodes:
        if node.isInput:
            tikz += f"\\node[input_node, fill=gray] ({node.id}) at ({node.x * 2}, {node.y * 2}) {{}};\n"
        else:
            fill = ""
            tikz += f"\\node[node, fill={fill}] ({node.id}) at ({node.x * 2}, {node.y * 2}) {{}};\n"
    for link in graph.links:
        if link.isInput:
            tikz += f"\\draw[io_link] ({(link.source.x * 2) - 1},{link.source.y * 2}) -- ({link.target.id});\n"
        elif link.hasDirection:
            tikz += f"\\draw[io_link] ({link.source.id}) -- ({(link.target.x * 2) + 1},{link.target.y * 2});\n"
        else:
            tikz += f"\\draw[link] ({link.source.id}) -- ({link.target.id});\n"
    return tikz

def get_color_definitions() -> str:
    return """
\\definecolor{link50}{HTML}{011215}
\\definecolor{link100}{HTML}{01242a}
\\definecolor{link200}{HTML}{023740}
\\definecolor{link300}{HTML}{024955}
\\definecolor{link400}{HTML}{035b6a}
\\definecolor{link500}{HTML}{046d7f}
\\definecolor{link600}{HTML}{047f94}
\\definecolor{link700}{HTML}{0592aa}
\\definecolor{link800}{HTML}{05a4bf}
\\definecolor{link900}{HTML}{06b6d4}
\\definecolor{node50}{HTML}{140a1a}
\\definecolor{node100}{HTML}{291433}
\\definecolor{node200}{HTML}{3d1f4c}
\\definecolor{node300}{HTML}{522966}
\\definecolor{node400}{HTML}{663380}
\\definecolor{node500}{HTML}{7a3d99}
\\definecolor{node600}{HTML}{8f47b2}
\\definecolor{node700}{HTML}{a352cc}
\\definecolor{node800}{HTML}{b85ce6}
\\definecolor{node900}{HTML}{cc66ff}
    """

def get_styles() -> str:
    return """
\\tikzstyle{node}=[circle, draw=black, minimum size=1.25cm, thick]
\\tikzstyle{input_node}=[circle, draw=black, minimum size=1.25cm, thick]
\\tikzstyle{link}=[line width = 4pt]
\\tikzstyle{io_link}=[-latex, line width = 4pt]
    """    