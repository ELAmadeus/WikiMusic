import axios from 'axios';
import { config } from '../config.js'

const urlServidor = config.urlResourceAlbumes;
async function Buscar() {
    try {
        const res = await axios.get(urlServidor); 
        return res.data;
    }
    catch (error) {
        console.error('Error al buscar los albumes:', error);
    }
}
async function BuscarPorId(IdAlbum) {
    try {
        const res = await axios.get(urlServidor); 
        return res.data.find((album) => album.IdAlbum === IdAlbum);
    } catch (error) {
        console.error('Error al buscar el album:', error);
    }
}
async function Agregar(album) {
    try {
        const res = await axios.post(urlServidor, album);
        console.log('Album agregado con éxito:', res.data);
    } catch (error) {
        console.error('Error al agregar el album:', error);
    }
}

async function Modificar(album) {
    try {

        const res = await axios.get(urlServidor);
        const albumes = res.data;

        let albumEncontrado = albumes.find((albumfind) => albumfind.IdAlbum === album.IdAlbum);

        if (albumEncontrado) {
            const respuesta = await axios.put(`${urlServidor}/${album.IdAlbum}`, album);
            console.log('Album modificado con éxito:', respuesta.data);
        } else {
            console.error('Album no encontrado');
        }
    } catch (error) {
        console.error('Error al modificar el album:', error);
    }
}
async function Eliminar(IdAlbum) {
    try {
        const response = await axios.delete(`${urlServidor}/${IdAlbum}`);
        console.log('Album eliminado con éxito:', response.data);
    } catch (error) {
        console.error('Error al eliminar el album:', error);
    }
}

export const AlbumesService = {
    Buscar, BuscarPorId, Agregar, Modificar, Eliminar
};
