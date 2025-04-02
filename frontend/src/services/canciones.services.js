import axios from 'axios';
import { config } from '../config.js'

const urlServidor = config.urlResourceCanciones;
async function Buscar() {
    try {
        const res = await axios.get(urlServidor); 
        return res.data;
    }
    catch (error) {
        console.error('Error al buscar las canciones:', error);
    }
}
async function BuscarPorId(IdCancion) {
    try {
        const res = await axios.get(urlServidor); 
        return res.data.find((cancion) => cancion.IdCancion === IdCancion);
    } catch (error) {
        console.error('Error al buscar la cancion:', error);
    }
}
async function Agregar(cancion) {
    try {
        const res = await axios.post(urlServidor, cancion);
        console.log('Cancion agregada con éxito:', res.data);
    } catch (error) {
        console.error('Error al agregar la cancion:', error);
    }
}

async function Modificar(cancion) {
    try {

        const res = await axios.get(urlServidor);
        const canciones = res.data;

        let cancionEncontrada = canciones.find((cancionfind) => cancionfind.IdCancion === cancion.IdCancion);

        if (cancionEncontrada) {
            const respuesta = await axios.put(`${urlServidor}/${cancion.IdCancion}`, cancion);
            console.log('Cancion modificada con éxito:', respuesta.data);
        } else {
            console.error('Cancion no encontrada');
        }
    } catch (error) {
        console.error('Error al modificar la cancion:', error);
    }
}
async function Eliminar(IdCancion) {
    try {
        const response = await axios.delete(`${urlServidor}/${IdCancion}`);
        console.log('Cancion eliminada con éxito:', response.data);
    } catch (error) {
        console.error('Error al eliminar la cancion:', error);
    }
}

export const CancionesService = {
    Buscar, BuscarPorId, Agregar, Modificar, Eliminar
};