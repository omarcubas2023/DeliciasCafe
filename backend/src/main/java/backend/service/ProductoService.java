package backend.service;

import backend.model.Producto;
import backend.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    // Obtener todos los productos activos
    public List<Producto> getProductos(String categoria) {
        if (categoria != null && !categoria.equals("Todas")) {
            return productoRepository.findByCategoriaAndActivoTrue(categoria);
        }
        return productoRepository.findByActivoTrue();
    }

    // Obtener producto por ID
    public Producto getProductoById(Long id) {
        return productoRepository.findById(id).orElse(null);
    }

    // Crear nuevo producto
    public Producto crearProducto(Producto producto) {
        producto.setActivo(true);
        return productoRepository.save(producto);
    }

    // Actualizar producto
    public Producto actualizarProducto(Long id, Producto productoActualizado) {
        Producto producto = productoRepository.findById(id).orElse(null);
        if (producto != null) {
            producto.setNombre(productoActualizado.getNombre());
            producto.setPrecio(productoActualizado.getPrecio());
            producto.setCategoria(productoActualizado.getCategoria());
            producto.setDescripcion(productoActualizado.getDescripcion());
            producto.setImagen(productoActualizado.getImagen());
            return productoRepository.save(producto);
        }
        return null;
    }

    // Eliminar producto (desactivar)
    public boolean eliminarProducto(Long id) {
        Producto producto = productoRepository.findById(id).orElse(null);
        if (producto != null) {
            producto.setActivo(false);
            productoRepository.save(producto);
            return true;
        }
        return false;
    }
}