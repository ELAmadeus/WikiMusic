import axios from 'axios';
import { config } from '../config.js'

const urlServidor = config.urlResourceArtistas;
async function Buscar() {
    try {
        const res = await axios.get(urlServidor); 
        return res.data;
    }
    catch (error) {
        console.error('Error al buscar los artistas:', error);
    }
}
async function BuscarPorId(IdArtista) {
    try {
        const res = await axios.get(urlServidor); 
        return res.data.find((artista) => artista.IdArtista === IdArtista);
    } catch (error) {
        console.error('Error al buscar el artista:', error);
    }
}
async function Agregar(artista) {
    try {
        const res = await axios.post(urlServidor, artista);
        console.log('Artista agregado con éxito:', res.data);
    } catch (error) {
        console.error('Error al agregar el artista:', error);
    }
}

async function Modificar(artista) {
    try {

        const res = await axios.get(urlServidor);
        const artistas = res.data;

        let artistaEncontrado = artistas.find((artistafind) => artistafind.IdArtista === artista.IdArtista);

        if (artistaEncontrado) {
            const respuesta = await axios.put(`${urlServidor}/${artista.IdArtista}`, artista);
            console.log('Artista modificado con éxito:', respuesta.data);
        } else {
            console.error('Artista no encontrado');
        }
    } catch (error) {
        console.error('Error al modificar el artista:', error);
    }
}
async function Eliminar(IdArtista) {
    try {
        const response = await axios.delete(`${urlServidor}/${IdArtista}`);
        console.log('Artista eliminado con éxito:', response.data);
    } catch (error) {
        console.error('Error al eliminar el artista:', error);
    }
}

export const ArtistasService = {
    Buscar, BuscarPorId, Agregar, Modificar, Eliminar
};
