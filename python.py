import networkx as nx  
import matplotlib.pyplot as plt  

# Clase para el árbol de rutas  
class ArbolRutas:  
    def __init__(self, valor):  
        self.valor = valor  
        self.hijos = []  
        self.peso = {}  # Diccionario para almacenar pesos/distancias  

    def agregar_hijo(self, hijo, peso=1):  
        self.hijos.append(hijo)  
        self.peso[hijo.valor] = peso  

# Implementación del sistema de rutas  
def crear_sistema_rutas():  
    # Crear grafo para las ciudades  
    G = nx.Graph()  

    # Agregar ciudades (nodos)  
    ciudades = ['Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Temuco']  
    G.add_nodes_from(ciudades)  

    # Agregar conexiones con pesos (distancias en km)  
    rutas = [  
        ('Santiago', 'Valparaíso', 116),  
        ('Santiago', 'La Serena', 472),  
        ('Santiago', 'Concepción', 500),  
        ('Concepción', 'Temuco', 260),  
        ('Valparaíso', 'La Serena', 400)  
    ]  
    G.add_weighted_edges_from(rutas)  

    # Crear árbol de rutas  
    raiz = ArbolRutas('Santiago')  # Santiago como centro de distribución  
    valpo = ArbolRutas('Valparaíso')  
    serena = ArbolRutas('La Serena')  
    conce = ArbolRutas('Concepción')  
    temuco = ArbolRutas('Temuco')  

    # Construir jerarquía  
    raiz.agregar_hijo(valpo, 116)  
    raiz.agregar_hijo(serena, 472)  
    raiz.agregar_hijo(conce, 500)  
    conce.agregar_hijo(temuco, 260)  

    return G, raiz  

# Función para encontrar ruta óptima usando Dijkstra  
def encontrar_ruta_optima(G, origen, destino):  
    try:  
        ruta = nx.shortest_path(G, origen, destino, weight='weight')  
        distancia = nx.shortest_path_length(G, origen, destino, weight='weight')  
        return ruta, distancia  
    except nx.NetworkXNoPath:  
        return None, None  

# Función para visualizar el grafo  
def visualizar_grafo(G):  
    pos = nx.spring_layout(G)  
    plt.figure(figsize=(10, 8))  
    nx.draw(G, pos, with_labels=True, node_color='lightblue',   
            node_size=1500, font_size=10, font_weight='bold')  

    # Agregar pesos de las aristas  
    edge_labels = nx.get_edge_attributes(G, 'weight')  
    nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels)  

    plt.title("Sistema de Rutas de Entrega")  
    plt.axis('off')  
    plt.show()  

# Ejemplo de uso  
if __name__ == "__main__":  
    # Crear sistema de rutas  
    G, arbol = crear_sistema_rutas()  

    # Encontrar ruta óptima entre dos ciudades  
    origen = 'Santiago'  
    destino = 'Temuco'  
    ruta, distancia = encontrar_ruta_optima(G, origen, destino)  

    print(f"\nRuta óptima desde {origen} hasta {destino}:")  
    if ruta:  
        print(f"Ruta: {' -> '.join(ruta)}")  
        print(f"Distancia total: {distancia} km")  
    else:  
        print("No se encontró una ruta válida")  

    # Visualizar el grafo  
    visualizar_grafo(G)  